export function getParameterNames(func: Function): string[] {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
  const ARGUMENT_NAMES = /([^\s,]+)/g
  const fnStr = func.toString().replace(STRIP_COMMENTS, '')
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  return result || []
}
