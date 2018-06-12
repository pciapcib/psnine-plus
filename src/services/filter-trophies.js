import qs from 'qs'

const filterMap = {
  all: '全部',
  missing: '未获得',
  earned: '已获得',
  tips: '有tips'
}

function makeFilterItem (type, query, filter) {
  const to = qs.stringify(Object.assign({}, query, { filter: type }), { addQueryPrefix: true })
  const $link = $('<a></a>').text(filterMap[type]).attr('href', to)

  if (type === filter) {
    $link.addClass('current')
  }

  const $item = $('<li></li>').append($link)

  return $item
}

function makeFilter (query) {
  const filter = query.filter || 'all'
  const filterText = filterMap[filter] || filterMap['all']

  const $dropdown = $('<li class="dropdown"></li>')
    .append(`<a href="javascript:void(0)" class="arr-down">${filterText}</a>`)
    .hover(function () {
      $(this).toggleClass('hover')
    })

  const $all = makeFilterItem('all', query, filter)
  const $earned = makeFilterItem('earned', query, filter)
  const $missing = makeFilterItem('missing', query, filter)
  const $tips = makeFilterItem('tips', query, filter)

  const $dropdownItems = $('<ul></ul>').append($all, $earned, $missing, $tips)

  $dropdown.append($dropdownItems)

  return $dropdown
}

export default function filterTrophies (params, query) {
  if (!query.psnid) return

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

  const filter = query.filter || 'all'
  const ob = query.ob || 'trophyid'

  switch (filter) {
    case 'earned':
      $earned.show()
      $missing.hide()

      break

    case 'missing':
      $missing.show()
      $earned.hide()

      break

    case 'tips':
      $tips.show()
      $noTips.hide()

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
