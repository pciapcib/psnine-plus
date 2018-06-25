import controller from './controller'
import {
  hoverPSNCard,
  enhanceSortTrophies,
  filterTrophies
} from './services'

// 根据路由分配功能
// 1. '/:page': [service]
// 2. '/page/:id': [service1, service2]
// 在某页面下不执行某功能
// 3. '!/page/path': [service]
const router = {
  '/:page*': [hoverPSNCard],
  '!/psnid/:psnId': [hoverPSNCard],
  '/psngame/:gameId': [enhanceSortTrophies, filterTrophies]
}

$(function () {
  const { pathname, search } = window.location

  chrome.storage.sync.get(null, config => {
    controller(router, config, pathname, search)
  })
})
