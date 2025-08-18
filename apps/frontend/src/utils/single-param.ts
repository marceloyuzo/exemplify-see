export function useSingleParam<T extends string>(
  param: string | string[] | undefined,
  fallback = '',
): T {
  if (typeof param === 'string') return param as T
  if (Array.isArray(param)) return param[0] as T
  return fallback as T
}
