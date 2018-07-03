// 屏蔽主题关键字
export default function blockTopicKeywords (config, params, query) {
  const blockedKeywords = config.blockTopicKeywordsList

  if (blockedKeywords.length === 0) return

  const $topicTitles = $('.list .title')

  const $blockedTitles = $topicTitles
    .has(blockedKeywords.map(keyword => `a:contains(${keyword})`).join())

  const $blockedTopics = $blockedTitles.parents('li')

  $blockedTopics.hide()
}
