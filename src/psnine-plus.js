import qs from 'qs'

import match from './match'
import filterTrophies from './filter-trophies'

const pathMap = {
  '/psngame/:id': filterTrophies
}

$(function () {
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const pathname = window.location.pathname

  match(pathMap, pathname, query)
})
