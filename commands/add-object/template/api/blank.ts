import { {{ nameFirst }} } from '@baseline/types/{{ nameKebab }}';

export const {{ nameCamel }}Mapper = (data: {{ nameFirst }}): {{ nameFirst }} => {
  const {{ nameCamel }}: {{ nameFirst }} = {{{ mapperFields }}
  };
  return {{ nameCamel }};
};
