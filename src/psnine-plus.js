import controller from './controller'
import {
  hoverPSNCard,
  filterTrophies
} from './services'

// 根据路由分配功能函数
// 1. '/:page': service
// 2. '/page/:id': [service1, service2]
const router = {
  '/:page*': hoverPSNCard,
  '!/psnid/:psnId': hoverPSNCard,
  '/psngame/:gameId': filterTrophies
}

$(function () {
  const { pathname, search } = window.location

  controller(router, pathname, search)
})
