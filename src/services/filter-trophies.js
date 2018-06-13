import qs from 'qs'
import R from 'ramda'

const filterMap = {
  all: '全部',
  earned: '已获得',
  missing: '未获得',
  tips: '有tips'
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

function addPlaceHolder ($trophies, $content, img, msg) {
  if ($trophies.length === 0) {
    const $placeholder = $(`
      <tr>
        <td valign="top" align="center">
        <img src="http://photo.psnine.com/face/${img}.gif" style="padding: 10px 0;">
        <p>${msg}</p>
        </td>
      </tr>
    `)

    $content.append($placeholder)
  }
}

export default function filterTrophies (params, query) {
  const $main = $('.mt40 .main')

  const $trophies = $main.find('tr[id]')

  const $earned = $trophies.has('img.earned')
  const $missing = $trophies.not($earned)

  const $tips = $trophies.has('td:eq(1) em.alert-success')
  const $noTips = $trophies.not($tips)

  const $dropmenu = $main.find('.dropmenu')
  const $filterTitle = $('<li><em>过滤</em></li>')
  const $filterDropdown = makeFilter(query)

  $dropmenu.append($filterTitle, $filterDropdown)

  const $content = $dropmenu.next().find('tbody')

  const filter = query.filter || 'all'
  const ob = query.ob || 'trophyid'

  switch (filter) {
    case 'earned':
      if (!query.psnid) return

      $missing.hide()

      addPlaceHolder($earned, $content, 'alu/30', '未获得任何奖杯')

      break

    case 'missing':
      if (!query.psnid) return

      $earned.hide()

      addPlaceHolder($missing, $content, 'alu/35', '已获得全部奖杯')

      break

    case 'tips':
      $noTips.hide()

      addPlaceHolder($tips, $content, 'alu/36', '快来成为大佬')

      break
  }

  if (ob === 'trophyid') {
    const $banners = $main.find('table.list tr:first-child')

    $banners.each(function (index) {
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
