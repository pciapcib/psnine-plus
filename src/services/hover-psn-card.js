export default function hoverPSNCard (params, query) {
  const cache = {}

  const $psnLinks = $('body > div:not(.header) a[href*="//psnine.com/psnid/"]')

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
        $el.tooltipster('content', cache[url])
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
