import R from 'ramda'

export const PSNINE_HOST = window.location.host
export const PSNINE_DOMAIN = PSNINE_HOST.replace('www.', '')

export const SERVICES = {
  hoverPSNCard: 'PSN 卡片',
  filterTrophies: '奖杯筛选',
  enhanceSortTrophies: '奖杯排序增强'
}

export const DEFAULT_SERVICES = { ...R.map(R.T, SERVICES) }
}
