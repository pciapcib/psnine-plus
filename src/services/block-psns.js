import { PSNINE_HOST } from '../constants'

// 屏蔽用户
export default function blockPSNs (config, params, query) {
  const blockedPSNs = config.blockPSNsList

  if (blockedPSNs.length === 0) return

  // 查找列表，侧边列表和评论
  const $psnLinks = $('.list, .darklist, .post')
    .find(`a[href*="//${PSNINE_HOST}/psnid/"]`)

  const $blockedPSNs = $psnLinks
    .filter(blockedPSNs.map(psnId => `[href$=${psnId}]`).join())

  // 屏蔽列表、表格列表和评论
  const $blockedList = $blockedPSNs.parents('li, tr, .post')

  $blockedList.hide()
}
