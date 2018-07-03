// 屏蔽机因元素
export default function blockGeneElements (config, params, query) {
  const blockedElements = config.blockGeneElementsList

  if (blockedElements.length === 0) return

  const $geneElements = $('.list p.meta a')

  const $blockedElements = $geneElements.filter(function () {
    return blockedElements.includes($(this).text())
  })

  const $blockedGenes = $blockedElements.parents('li')

  $blockedGenes.hide()
}
