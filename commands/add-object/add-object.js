#!/usr/bin/env node

// Template Fields
// - nameFirst
// - nameCamel
// - nameSnakeUpper
// - nameUpper
// - nameLower
// - nameKebab
// - apiCreateFields "field1, field2, field3"
// - apiUpdateFields "blankId, field1, field2, field3"
// - primaryKey "blankId"
// - seedData {"blankId": "", "field1": ""},{"blankId": "", "field1": ""}
// - mapperFields blankId: data?.blankId, field1: data?.field1
// - typeFields blankId: string; field1: string;

const fs = require('fs');
const readlineSync = require('readline-sync');
const YAML = require('js-yaml');

const functionNames = [
  'And',
  'Base64',
  'Cidr',
  'Condition',
  'Equals',
  'FindInMap',
  'GetAtt',
  'GetAZs',
  'If',
  'ImportValue',
  'Join',
  'Not',
  'Or',
  'Ref',
  'Select',
  'Split',
  'Sub',
];

class CustomTag {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

function yamlType(name, kind) {
  const functionName = ['Ref', 'Condition'].includes(name) ? name : `!${name}`;
  return new YAML.Type(`${functionName}`, {
    kind,
    multi: true,
    representName: function (object) {
      return object.type;
    },
    represent: function (object) {
      return object.data;
    },
    instanceOf: CustomTag,
    construct: function (data, type) {
      return new CustomTag(type, data);
    },
  });
}

function generateTypes() {
  const types = functionNames
    .map((functionName) =>
      ['mapping', 'scalar', 'sequence'].map((kind) =>
        yamlType(functionName, kind),
      ),
    )
    .flat();
  return types;
}

const writeServerlessApiYaml = () => {
  const yamlTypes = generateTypes();
  const schema = YAML.DEFAULT_SCHEMA.extend(yamlTypes);

  const serverlessFile = fs.readFileSync(
    `${projectRoot}/packages/api/serverless.yml`,
    'utf8',
  );
  const yamlJson = YAML.load(serverlessFile, { schema: schema });
  const filenameName = `${toKebabCase(name.toLowerCase())}`;

  const newFunction = `\${file(./src/baseblocks/${filenameName}/${filenameName}-functions.yml)}`;
  const newResource = `\${file(./src/baseblocks/${filenameName}/${filenameName}-dynamodb.yml)}`;
  if (
    yamlJson.functions.find((i) => i === newFunction) ||
    yamlJson.resources.find((i) => i === newResource)
  ) {
    console.log('Conflicting resource/function in serverless.yml, not saving.');
    return;
  }

  yamlJson.functions.push(newFunction);
  yamlJson.resources.push(newResource);
  yamlJson.provider.iam.role.statements[0].Resource.push(
    new CustomTag('!Sub', `\${${toCamelCase(name)}Table.Arn}`),
    new CustomTag('!Sub', `\${${toCamelCase(name)}Table.Arn}/index/*`),
  );
  yamlJson.custom['serverless-dynamodb'].seed.local.sources.push({
    table: `\${env:APP_NAME}-\${opt:stage}-${filenameName}`,
    sources: [`./src/baseblocks/${filenameName}/${filenameName}.seed.json`],
  });

  const yamlResult = YAML.dump(yamlJson, {
    schema,
  });

  fs.writeFileSync(`${projectRoot}/packages/api/serverless.yml`, yamlResult);
};

const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

const toKebabCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');

const cwd = process.cwd();
// console.log(`Current Working Dir: ${cwd}`);
const projectRoot = cwd.split('/commands')[0];
// console.log(`Project Root: ${projectRoot}`);
const templatePath = `${cwd}/template`;
// console.log(`Template Path: ${templatePath}`);

let name = readlineSync.question('What is the name of the new object? ');

console.log(`Creating new object [${name}]`);

// Support multi words in kebab case, pascal case or snake case
if (name.includes('-')) {
  name = name.split('-').join(' ');
} else if (name.includes('_')) {
  name = name.split('_').join(' ');
} else {
  name = name
    .replace(/([A-Z][a-z])/g, ' $1')
    .replace(/(\d)/g, ' $1')
    .trim();
}

const primaryKey = `${toCamelCase(name)}Id`;
const inputFields = [];
var fieldName = '';
do {
  console.log('Current Fields:', [
    primaryKey,
    ...inputFields.map((i) => i.name),
  ]);
  fieldName = readlineSync.question('New field name (or enter to finish): ');
  if (fieldName) {
    const tsTypes = ['string', 'number', 'boolean', 'any', 'string[]'];
    const index = readlineSync.keyInSelect(tsTypes, 'Type?');
    const tsType = tsTypes[index];
    const isRequired = readlineSync.keyInYN('is field required?');
    console.log(
      `Added field [${fieldName}${isRequired ? '' : '?'}: ${tsType}]\n`,
    );
    inputFields.push({
      name: fieldName,
      tsType: tsType,
      isRequired: isRequired,
    });
  }
} while (fieldName);

const fields = inputFields.map((field) => field.name);
const allFields = [primaryKey, ...fields];

let dataTypeFields = `  ${primaryKey}: string;`;
inputFields.forEach((field) => {
  dataTypeFields = `${dataTypeFields}\n  ${field.name}${
    field.isRequired ? '' : '?'
  }: ${field.tsType};`;
});

let dataMapperFields = '';
allFields.forEach((field) => {
  dataMapperFields = `${dataMapperFields}\n    ${field}: data?.${field},`;
});

const data = {
  name,
  nameFirst: `${name[0].toUpperCase()}${toCamelCase(name.slice(1))}`,
  nameCamel: `${toCamelCase(name)}`,
  nameSnakeUpper: `${name.replace(/\s/g, '_').toUpperCase()}`,
  nameUpper: `${name.toUpperCase()}`,
  nameLower: `${name.toLowerCase()}`,
  nameKebab: `${toKebabCase(name.toLowerCase())}`,
  apiCreateFields: fields.join(', '),
  apiUpdateFields: allFields.join(', '),
  primaryKey: `${toCamelCase(name)}Id`,
  seedData: ``,
  mapperFields: dataMapperFields,
  typeFields: dataTypeFields,
};

const renderTemplate = (template) => {
  let generatedContent = template;
  Object.keys(data).forEach((key) => {
    generatedContent = generatedContent.replace(
      new RegExp(`{{ ${key} }}`, 'g'),
      data[key],
    );
  });
  return generatedContent;
};

const apiOutputPath = `${projectRoot}/packages/api/src/baseblocks/${toKebabCase(
  name.toLowerCase(),
)}`;
const filenameName = `${toKebabCase(name.toLowerCase())}`;
const files = [
  {
    templateFile: `${templatePath}/api/blank.ts`,
    outputPath: apiOutputPath,
    outputFilename: `${apiOutputPath}/${filenameName}.ts`,
  },
  {
    templateFile: `${templatePath}/api/blank.service.ts`,
    outputPath: apiOutputPath,
    outputFilename: `${apiOutputPath}/${filenameName}.service.ts`,
  },
  {
    templateFile: `${templatePath}/api/blank.seed.json`,
    outputPath: apiOutputPath,
    outputFilename: `${apiOutputPath}/${filenameName}.seed.json`,
  },
  {
    templateFile: `${templatePath}/api/blank-functions.yml`,
    outputPath: apiOutputPath,
    outputFilename: `${apiOutputPath}/${filenameName}-functions.yml`,
  },
  {
    templateFile: `${templatePath}/api/blank-dynamodb.yml`,
    outputPath: apiOutputPath,
    outputFilename: `${apiOutputPath}/${filenameName}-dynamodb.yml`,
  },
  {
    templateFile: `${templatePath}/api/blank-api.ts`,
    outputPath: apiOutputPath,
    outputFilename: `${apiOutputPath}/${filenameName}-api.ts`,
  },
  {
    templateFile: `${templatePath}/types/blank.d.ts`,
    outputPath: `${projectRoot}/shared/types`,
    outputFilename: `${projectRoot}/shared/types/${filenameName}.d.ts`,
  },
  {
    templateFile: `${templatePath}/client-api/blank.ts`,
    outputPath: `${projectRoot}/shared/client-api`,
    outputFilename: `${projectRoot}/shared/client-api/${filenameName}.ts`,
  },
];

const fileOperations = async (file) => {
  const templateFileData = fs.readFileSync(file.templateFile).toString();
  const result = renderTemplate(templateFileData);
  await fs.promises.mkdir(file.outputPath, {
    recursive: true,
  });
  console.log(`Creating ${file.outputFilename}`);
  fs.writeFileSync(file.outputFilename, result);
};

(async () => {
  console.log('Creating files...');
  for (let filePos = 0; filePos < files.length; filePos++) {
    const file = files[filePos];
    await fileOperations(file);
  }
  console.log('Updating api serverless.yml');
  writeServerlessApiYaml();
  console.log('Done!');
})();
