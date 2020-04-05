import {
  cloneDeep,
  isArray,
  map,
  isString,
  isNumber,
  mapKeys,
  isPlainObject,
  mapValues,
  camelCase,
} from 'lodash';

export function recursiveCamelCase<TOutput>(
  object: Record<string, any> | Array<Record<string, any>>
) {
  return transform(object) as TOutput;
}

function transform(object: any): any {
  let camelCaseObject = cloneDeep(object);

  if (isArray(camelCaseObject)) {
    return map(camelCaseObject, recursiveCamelCase);
  }

  if (isString(camelCaseObject)) {
    return camelCaseObject;
  }

  if (isNumber(camelCaseObject)) {
    return camelCaseObject;
  }

  camelCaseObject = mapKeys(camelCaseObject, (_, key) => camelCase(key));

  // Recursively apply throughout object
  return mapValues(camelCaseObject, (value) => {
    if (isPlainObject(value)) {
      return recursiveCamelCase(value);
    } else if (isArray(value)) {
      return map(value, recursiveCamelCase);
    }
    return value;
  });
}
