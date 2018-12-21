import R from 'ramda'
import { DEFAULT_SERVICES, DEFAULT_LIST_SERVICES } from './constants'

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return

  if (tab.url.indexOf('psnine.com') === -1) {
    chrome.browserAction.disable(tabId)
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, data => {
    if (R.either(R.isNil, R.isEmpty)(data)) {
      chrome.storage.sync.set({
        ...DEFAULT_SERVICES,
        ...DEFAULT_LIST_SERVICES
      })
    }
  })
})

chrome.runtime.onMessage.addListener(({ type, data }) => {
  switch (type) {
    case 'openPopup':
      chrome.storage.sync.get(null, data => {
        chrome.runtime.sendMessage({
          type: 'getConfig',
          data
        })
      })

      break

    case 'setConfig':
      chrome.storage.sync.set(data, () => {
        ['*://*.psnine.com/*', '*://*.d7vg.com/*'].forEach(url => {
          chrome.tabs.query({ url }, tabs => {
            tabs.forEach(tab => chrome.tabs.reload(tab.id))
          })
        })
      })
  }
})
