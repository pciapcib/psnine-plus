import R from 'ramda'

const platinumBookingList = [
  '预定',
  '预订'
]

function getBlockPlatinumBookingTips ($platinumTips) {
  return $platinumTips.filter(function () {
    const content = $(this).find('.ml64 > .content').text()
    const hasBlockContent = R.any(R.contains(R.__, content), platinumBookingList)

    return hasBlockContent && content.length < 100
  })
}

// 屏蔽白金预订
export default function blockPlatinumBooking (config, params, query) {
  const $platinumBookingTips = getBlockPlatinumBookingTips($('.list > li'))

  if (params.trophyId) {
    if (R.endsWith('001', params.trophyId)) {
      $platinumBookingTips.hide()
    }
  } else if (params.gameId) {
    const $platinumTipsNum = $('#1 .text-platinum + .alert-success > b')
    const platinumTipsNum = $platinumTipsNum.text()

    $.ajax({
      method: 'GET',
      url: $('#1 .text-platinum').attr('href'),
      dataType: 'html'
    })
      .done(raw => {
        const $platinumBookingTips = getBlockPlatinumBookingTips($(raw).find('.list > li'))

        $platinumTipsNum.text(platinumTipsNum - $platinumBookingTips.length)
      })
  }
}
