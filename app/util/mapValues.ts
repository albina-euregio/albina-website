export function mapValues<K extends string | number | symbol, T, U>(
  obj: Record<K, T>,
  callbackfn: (value: T) => U
): Record<K, U> {
  return Object.fromEntries<U>(
    Object.entries<T>(obj).map(([k, v]) => [k, callbackfn(v)])
  );
}
