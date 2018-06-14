chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return

  if (tab.url.indexOf('psnine.com') === -1) {
    chrome.browserAction.disable(tabId)
  }
})
