// 屏蔽机因关键字
export default function blockGeneKeywords (config, params, query) {
  const blockedKeywords = config.blockGeneKeywordsList

  if (blockedKeywords.length === 0) return

  const $geneContents = $('.list .content')

  const $blockedContents = $geneContents
    .filter(blockedKeywords.map(keyword => `:contains(${keyword})`).join())

  const $blockedGenes = $blockedContents.parents('li')

  $blockedGenes.hide()
}
