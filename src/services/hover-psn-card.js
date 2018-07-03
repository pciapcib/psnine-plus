import { PSNINE_HOST } from '../constants'

// 悬浮 PSN 卡片
export default function hoverPSNCard (config, params, query) {
  const cache = {}

  // 排除头部导航栏的个人主页
  const $psnLinks = $(`body > div:not(.header) a[href*="//${PSNINE_HOST}/psnid/"]`)

  $psnLinks.tooltipster({
    debug: false,
    theme: ['psnine-plus-psn-card'],
    content: '',
    contentAsHTML: true,
    arrow: false,
    delay: 100,
    animationDuration: 0,
    updateAnimation: null,
    interactive: true,
    functionBefore (self, event) {
      const $el = $(event.origin)
      const url = $el.attr('href')

      if (cache[url]) {
        self.content(cache[url])
      } else {
        $.ajax({
          method: 'GET',
          url,
          dataType: 'html'
        })
          .done(raw => {
            const psnCard = $(raw).filter('.header').next().get(0)

            if (psnCard) {
              const card = cache[url] = psnCard.outerHTML

              self.content(card)
            }
          })
      }
    }
  })
}
