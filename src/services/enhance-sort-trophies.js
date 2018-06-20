import qs from 'qs'
import R from 'ramda'

const sortMap = {
  date: '获得日'
}

function makeSortItem (type, query, sort) {
  const to = qs.stringify(Object.assign({}, query, { ob: type }), { addQueryPrefix: true })
  const $link = $(`<a href="${to}">${sortMap[type]}</a>`)

  if (type === sort) {
    $link.addClass('current')
  }

  const $item = $('<li></li>').append($link)

  return $item
}

function makeSort (query) {
  const sort = query.ob || 'trophyid'

  const getFilterItem = type => makeSortItem(type, query, sort)
  const sortItems = R.pipe(R.keys, R.map(getFilterItem))(sortMap)

  return sortItems
}

function getTrophyDatetime (el) {
  const $date = $(el).find('td:eq(2) em.alert-success')

  if ($date.length === 0) return 0

  const year = $date.attr('tips').slice(0, 4)
  const datetime = $date.html().trim().replace('-', '/').replace('<br>', ' ')

  const trophyDatetime = new Date(`${year}/${datetime}`).getTime()

  return trophyDatetime
}

function getTrophyId (el) {
  return +$(el).attr('id')
}

// 增强排序游戏页面奖杯
export default function enhanceSortTrophies (params, query) {
  const $main = $('.mt40 .main')

  const $useless = $main.find('> *:gt(3)')

  const $trophies = $main.find('tr[id]')

  const $dropmenu = $main.find('.dropmenu')
  const $sortDropdown = $dropmenu.find('.dropdown').first()
  const $sortCurrent = $sortDropdown.find('> a')
  const $sortDropdownList = $sortDropdown.find('ul')

  const dateSortItem = makeSort(query)

  const $content = $dropmenu.next().find('tbody')

  const sort = query.ob || 'trophyid'
  const sortText = sortMap[sort]

  if (sortText) {
    $sortCurrent.text(sortText)
    $sortDropdownList.find('li a').removeClass('current')
  }

  $sortDropdownList.append(dateSortItem)

  switch (sort) {
    case 'date':
      $useless.remove()
      $content.empty()

      // 奖杯获得日降序、奖杯 ID 升序
      $trophies.sort((a, b) => {
        return getTrophyDatetime(b) - getTrophyDatetime(a) ||
          getTrophyId(a) - getTrophyId(b)
      })

      $content.append($trophies)

      break
  }
}
