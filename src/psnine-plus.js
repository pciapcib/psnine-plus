import controller from './controller'
import {
  hoverPSNCard,
  filterTrophies
} from './services'

const router = {
  '/:page*': hoverPSNCard,
  '/psngame/:gameId': filterTrophies
}

$(function () {
  const { pathname, search } = window.location

  controller(router, pathname, search)
})
