chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return

  chrome.tabs.executeScript(tabId, {
    code: 'var injected = window.psninePlusInjected; window.psninePlusInjected = true; injected;',
    runAt: 'document_start'
  }, res => {
    if (chrome.runtime.lastError || res[0]) return

    const jsFiles = [
      './jquery.min.js',
      './psnine-plus.js'
    ]

    eachItem(jsFiles, inject(tabId, 'executeScript'))
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
