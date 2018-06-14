chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return

  if (tab.url.indexOf('psnine.com') === -1) {
    chrome.browserAction.disable(tabId)

    return
  }

  chrome.tabs.executeScript(tabId, {
    code: 'var injected = window.psninePlusInjected; window.psninePlusInjected = true; injected;',
    runAt: 'document_start'
  }, res => {
    if (chrome.runtime.lastError || res[0]) return

    const cssFiles = [
      './tooltipster.bundle.min.css',
      './psnine-plus.css'
    ]

    const jsFiles = [
      './jquery.min.js',
      './tooltipster.bundle.min.js',
      './psnine-plus.js'
    ]

    eachTask([
      cb => eachItem(cssFiles, inject(tabId, 'insertCSS'), cb),
      cb => eachItem(jsFiles, inject(tabId, 'executeScript'), cb)
    ])
  })
})

function inject (tabId, fn) {
  return (file, cb) => {
    chrome.tabs[fn](tabId, {
      file,
      runAt: 'document_end'
    }, cb)
  }
}

function eachTask (tasks, done) {
  (function next (index = 0) {
    if (index === tasks.length) done && done()
    else tasks[index](() => next(++index))
  })()
}

function eachItem (arr, iter, done) {
  const tasks = arr.map(item => cb => iter(item, cb))
  return eachTask(tasks, done)
}
