import R from 'ramda'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'

export default function controller (router, pathname, search) {
  // 区分黑白路径
  const paths = R.keys(router)
  const isBlackPath = R.startsWith('!')
  const whitePaths = R.reject(isBlackPath, paths)
  const blackPaths = R.filter(isBlackPath, paths)

  whitePaths.forEach(whitePath => {
    const paramNames = []
    const whitePathReg = pathToRegexp(whitePath, paramNames)

    let pathFns = router[whitePath]

    if (whitePathReg.test(pathname) && pathFns) {
      // '/page/:id' => '/page/233' => { id: '233' }
      const captures = whitePathReg.exec(pathname).slice(1)
      const params = captures.reduce((params, capture, index) => {
        params[paramNames[index].name] = capture
        return params
      }, {})

      // '?psnid=233' => { psnid: '233' }
      const query = qs.parse(search, { ignoreQueryPrefix: true })

      if (!Array.isArray(pathFns)) {
        pathFns = [pathFns]
      }

      pathFns.forEach(fn => {
        // 黑名单优先
        blackPaths.forEach(blackPath => {
          const blackPathReg = pathToRegexp(blackPath.slice(1))

          if (blackPathReg.test(pathname)) {
            let blackFns = router[blackPath]

            if (!Array.isArray(blackFns)) {
              blackFns = [blackFns]
            }

            if (blackFns.some(R.identical(fn))) {
              return
            }
          }

          fn(params, query)
        })
      })
    }
  })
}
