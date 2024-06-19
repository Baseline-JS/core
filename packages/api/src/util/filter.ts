import { ConditionExpressionArgs } from '@baselinejs/dynamodb';

type OperatorType = 'BeginsWith' | 'LessThan' | 'GreaterThan' | 'LessThanEqual' | 'GreaterThanEqual' | 'Equal' | 'NotEqual' | 'Between' | 'AttributeExists' | 'AttributeNotExists';
export function equal(field: string, value: string): ConditionExpressionArgs {
  return comparison(field, value, 'Equal')
}

export function notEqual(field: string, value: string): ConditionExpressionArgs {
  return comparison(field, value, 'NotEqual')
}

export function beginsWith(field: string, value: string): ConditionExpressionArgs {
  return comparison(field, value, 'BeginsWith')
}

export function lessThan(field: string, value: string): ConditionExpressionArgs {
  return comparison(field, value, 'LessThan')
}

export function lessThanEqual(field: string, value: string): ConditionExpressionArgs {
  return comparison(field, value, 'LessThanEqual')
}

export function greaterThan(field: string, value: string): ConditionExpressionArgs {
  return comparison(field, value, 'GreaterThan')
}

export function greaterThanEqual(field: string, value: string): ConditionExpressionArgs {
  return comparison(field, value, 'GreaterThanEqual')
}

export function comparison(field: string, value: string, operator: OperatorType) : ConditionExpressionArgs {
  return {
    operator,
    field,
    value
  }
}

export function between(field: string, start: string, end: string): ConditionExpressionArgs {
  return {
    operator: 'Between',
    field,
    value: start,
    betweenSecondValue: end
  }
}

export function attributeExists(field: string): ConditionExpressionArgs {
  return {
    operator: 'AttributeExists',
    field
  }
}

export function attributeNotExists(field: string): ConditionExpressionArgs {
  return {
    operator: 'AttributeNotExists',
    field
  }
}