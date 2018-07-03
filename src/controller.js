import R from 'ramda'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'

export default function controller (router, config, pathname, search) {
  // 区分黑白名单路径
  const paths = R.keys(router)
  const isBlackPath = R.startsWith('!')
  const whitePaths = R.reject(isBlackPath, paths)
  const blackPaths = R.filter(isBlackPath, paths)

  whitePaths.forEach(whitePath => {
    const paramNames = []
    const whitePathReg = pathToRegexp(whitePath, paramNames)

    const pathFns = router[whitePath]

    if (whitePathReg.test(pathname) && pathFns) {
      // '/page/:id' => '/page/233' => { id: '233' }
      const captures = whitePathReg.exec(pathname).slice(1)
      const params = captures.reduce((params, capture, index) => {
        params[paramNames[index].name] = capture
        return params
      }, {})

      // '?psnid=233' => { psnid: '233' }
      const query = qs.parse(search, { ignoreQueryPrefix: true })

      pathFns.forEach(fn => {
        // 关闭某功能
        if (config[fn.name] === false) return

        // 黑名单路径优先
        blackPaths.forEach(blackPath => {
          const blackPathReg = pathToRegexp(blackPath.slice(1))

          if (blackPathReg.test(pathname)) {
            const blackFns = router[blackPath]

            if (blackFns.some(R.identical(fn))) return
          }

          fn(config, params, query)
        })
      })
    }
  })
}
