import pathToRegexp from 'path-to-regexp'
import qs from 'qs'

export default function controller (router, pathname, search) {
  for (const path in router) {
    const paramNames = []
    const reg = pathToRegexp(path, paramNames)

    let pathFn = router[path]

    if (reg.test(pathname) && pathFn) {
      const captures = reg.exec(pathname).slice(1)
      const params = captures.reduce((params, capture, index) => {
        params[paramNames[index].name] = capture
        return params
      }, {})

      const query = qs.parse(search, { ignoreQueryPrefix: true })

      if (!Array.isArray(pathFn)) {
        pathFn = [pathFn]
      }

      pathFn.forEach(fn => fn(params, query))
    }
  }
}
