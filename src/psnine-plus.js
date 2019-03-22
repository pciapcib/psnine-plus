import controller from './controller'
import {
  hoverPSNCard,
  enhanceSortTrophies,
  filterTrophies,
  blockPSNs,
  blockTopicKeywords,
  blockGeneElements,
  blockGeneKeywords,
  blockPlatinumBooking
} from './services'

// 根据路由分配功能
// 1. '/:page': [service]
// 2. '/page/:id': [service1, service2]
// 在某页面下不执行某功能
// 3. '!/page/path': [service]
const router = {
  '/:page*': [hoverPSNCard, blockPSNs],
  '!/psnid/:psnId': [hoverPSNCard],
  '/': [blockTopicKeywords],
  '/topic': [blockTopicKeywords],
  '/psngame/:gameId': [enhanceSortTrophies, filterTrophies, blockPlatinumBooking],
  '/psngame/:gameId/topic': [blockTopicKeywords],
  '/gene': [blockGeneElements, blockGeneKeywords],
  '/trophy/:trophyId': [blockPlatinumBooking]
}

$(function () {
  const { pathname, search } = window.location

  chrome.storage.sync.get(null, config => {
    controller(router, config, pathname, search)
  })
})
