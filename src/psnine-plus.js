import controller from './controller'
import {
  filterTrophies
} from './services'

// TODO: 增加用户小卡片
const router = {
  '/psngame/:gameId': filterTrophies
}

$(function () {
  const { pathname, search } = window.location

  controller(router, pathname, search)
})
