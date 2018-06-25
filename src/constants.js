import R from 'ramda'

export const PSNINE_DOMAIN = window.location.host.replace('www.', '')

export const SERVICES = {
  hoverPSNCard: 'PSN 卡片',
  filterTrophies: '奖杯筛选',
  enhanceSortTrophies: '奖杯排序增强'
}

export const DEFAULT_SERVICES = {
  ...R.map(R.T, SERVICES)
}
