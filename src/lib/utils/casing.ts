/**
 * Casing Transformation Utilities
 * Standardizes conversion between API (snake_case) and UI (camelCase)
 */

export function toCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/(_[a-z])/g, (group) =>
          group.toUpperCase().replace("_", ""),
        )]: toCamel(obj[key]),
      }),
      {},
    );
  }
  return obj;
}

export function toSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toSnake(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)]: toSnake(
          obj[key],
        ),
      }),
      {},
    );
  }
  return obj;
}
