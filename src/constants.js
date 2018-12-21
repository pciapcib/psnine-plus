import R from 'ramda'

export const PSNINE_ORIGIN = window.location.origin
export const PSNINE_HOST = window.location.host

export const SERVICES = {
  hoverPSNCard: 'PSN 卡片',
  filterTrophies: '奖杯筛选',
  enhanceSortTrophies: '奖杯排序增强'
}

export const DEFAULT_SERVICES = { ...R.map(R.T, SERVICES) }

export const LIST_SERVICES = {
  blockPSNs: '屏蔽用户',
  blockTopicKeywords: '屏蔽话题关键字',
  blockGeneElements: '屏蔽机因元素',
  blockGeneKeywords: '屏蔽机因关键字'
}

export const DEFAULT_LIST_SERVICES = {
  ...R.map(R.T, LIST_SERVICES),
  ...R.keys(LIST_SERVICES).reduce(
    (listServices, serviceName) => R.assoc(`${serviceName}List`, [], listServices),
    {}
  )
}
