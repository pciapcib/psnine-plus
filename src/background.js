import { DEFAULT_SERVICES } from './constants'

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return

  if (tab.url.indexOf('psnine.com') === -1) {
    chrome.browserAction.disable(tabId)
  }
})

chrome.runtime.onInstalled.addListener(qwe => {
  chrome.storage.sync.get(null, data => {
    if (data == null) {
      chrome.storage.sync.set({
        ...DEFAULT_SERVICES
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
        chrome.tabs.query({
          url: '*://*.psnine.com/*'
        }, tabs => {
          tabs.forEach(tab => chrome.tabs.reload(tab.id))
        })
      })
  }
})
