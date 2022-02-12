export function findLastIndex<T>(
  array: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

export function replaceAt<T>(array: T[], index: number, item: T): T[] {
  console.log(array.slice(0, index));
  console.log(array.slice(index));

  return [
    ...array.slice(0, index),
    item,
    ...array.slice(index + 1, array.length),
  ];
}
