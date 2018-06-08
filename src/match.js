import pathToRegexp from 'path-to-regexp'

export default function match (pathMap, pathname, query) {
  for (const path in pathMap) {
    const reg = pathToRegexp(path)

    if (reg.test(pathname) && pathMap[path]) {
      pathMap[path](query)
    }
  }
}
