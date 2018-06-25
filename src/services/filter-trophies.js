import qs from 'qs'
import R from 'ramda'

import { PSNINE_DOMAIN } from '../constants'

const filterMap = {
  all: '全部',
  earned: '已获得',
  missing: '未获得',
  tips: '有Tips'
}

function makeFilterItem (type, query, filter) {
  const to = qs.stringify(Object.assign({}, query, { filter: type }), { addQueryPrefix: true })
  const $link = $(`<a href="${to}">${filterMap[type]}</a>`)

  if (type === filter) {
    $link.addClass('current')
  }

  const $item = $('<li></li>').append($link)

  return $item
}

function makeFilter (query) {
  // 非用户入口的游戏页面不显示奖杯筛选
  const validFilterMap = query.psnid ? filterMap : R.omit(['earned', 'missing'])(filterMap)

  const filter = query.filter || 'all'
  const filterText = validFilterMap[filter] || validFilterMap['all']

  const $filterDropdown = $(`
    <li class="dropdown">
      <a href="javascript:void(0)" class="arr-down">${filterText}</a>
      <ul></ul>
    </li>
  `)
    .hover(function () {
      $(this).toggleClass('hover')
    })

  const getFilterItem = type => makeFilterItem(type, query, filter)
  const filterItems = R.pipe(R.keys, R.map(getFilterItem))(validFilterMap)

  $filterDropdown.find('ul').append(filterItems)

  return $filterDropdown
}

// 添加占位内容
function addPlaceHolder ($trophies, $content, img, msg) {
  if ($trophies.length === 0) {
    const $placeholder = $(`
      <tr>
        <td valign="top" align="center">
        <img src="http://photo.${PSNINE_DOMAIN}/face/${img}.gif" style="padding: 10px 0;">
        <p>${msg}</p>
        </td>
      </tr>
    `)

    $content.append($placeholder)
  }
}

// 筛选游戏页面奖杯
export default function filterTrophies (params, query) {
  const $main = $('.mt40 .main')

  const $trophies = $main.find('tr[id]')

  const $earned = $trophies.has('img.earned')
  const $missing = $trophies.not($earned)

  const $tips = $trophies.has('td:eq(1) em.alert-success')
  const $noTips = $trophies.not($tips)

  const $dropmenu = $main.find('.dropmenu')
  const $filterTitle = $('<li><em>筛选</em></li>')
  const $filterDropdown = makeFilter(query)

  const $content = $dropmenu.next().find('tbody')

  const filter = query.filter || 'all'
  const sort = query.ob || 'trophyid'

  $dropmenu.append($filterTitle, $filterDropdown)

  switch (filter) {
    case 'earned':
    // 非用户入口的游戏页面不显示已获得奖杯筛选
      if (!query.psnid) return

      $missing.hide()

      addPlaceHolder($earned, $content, 'alu/30', '未获得任何奖杯')

      break

    case 'missing':
      // 非用户入口的游戏页面不显示未获得奖杯筛选
      if (!query.psnid) return

      $earned.hide()

      addPlaceHolder($missing, $content, 'alu/35', '已获得全部奖杯')

      break

    case 'tips':
      $noTips.hide()

      addPlaceHolder($tips, $content, 'alu/36', '快来成为大佬')

      break
  }

  // 只在默认排序下进行游戏和 DLC 信息的判断，
  // 游戏本体或某个 DLC 中的所有奖杯都隐藏时，
  // 则隐藏对应的横幅信息
  if (sort === 'trophyid') {
    const $banners = $main.find('table.list tr:first-child')

    $banners.each(function () {
      const $this = $(this)
      const $dlcNum = $this.parents('.box').prev('.hd')

      if ($this.siblings().toArray().every(e => $(e).is(':hidden'))) {
        $this.hide()
        $dlcNum.hide()
      } else {
        $this.show()
        $dlcNum.show()
      }
    })
  }
}
