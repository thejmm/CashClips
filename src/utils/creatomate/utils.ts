// src/utils/creatomate/utils.ts
export function deepClone<T>(value: T): T {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  const target: any = Array.isArray(value) ? [] : {};

  for (const key in value) {
    target[key] = deepClone(value[key]);
  }

  return target;
}

export function deepFind(
  predicate: (value: any) => boolean,
  value: any,
): any | undefined {
  if (typeof value === "object") {
    if (value != null) {
      if (predicate(value)) {
        return value;
      }

      for (const key in value) {
        const foundValue = deepFind(predicate, value[key]);
        if (foundValue) {
          return foundValue;
        }
      }
    }
  }

  return undefined;
}

export function groupBy<K, V>(
  items: V[],
  iteratee: (value: V) => K,
): Map<K, V[]> {
  return items.reduce((map, value) => {
    const key = iteratee(value);

    let array = map.get(key);
    if (!array) {
      array = [];
      map.set(key, array);
    }

    array.push(value);

    return map;
  }, new Map<K, V[]>());
}
