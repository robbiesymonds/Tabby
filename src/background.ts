/**
 * List of utility functions that will be executed by Tabby.
 * @note - After adding a new utility function, run `yarn build` to compile.
 */

const CONFIGURATION: UtilityConfiguration[] = [
  // Alerts a message when visiting this specific URL.
  {
    matches: ['https://robbiesymonds.me'],
    data: { message: 'Thanks for using Tabby!' },
    callback: (data) => {
      alert(data.message)
    }
  }
]

/*
 * ---------------------------------------------
 * NOTHING BELOW THIS LINE NEEDS TO BE CHANGED.
 * ---------------------------------------------
 */

type UtilityConfiguration = {
  matches: string[]
  data: Record<string, any>
  callback: (data: Record<string, any>) => void
}

const handleTabUpdate = async (tabId: number) => {
  const tab = await chrome.tabs.get(tabId)
  if (tab.url && tab.status === 'complete') {
    CONFIGURATION.forEach((utility) => {
      utility.matches.forEach((match) => {
        let url = tab.url!
        if (match.charAt(match.length - 1) !== '/') url = url.slice(0, -1)
        if (url === match) {
          chrome.scripting
            .executeScript({
              target: { tabId },
              func: utility.callback,
              args: [utility.data]
            })
            .catch(console.error)
        }
      })
    })
  }
}

// Create listeners.
chrome.tabs.onActivated.addListener(({ tabId }) => handleTabUpdate(tabId))
chrome.tabs.onUpdated.addListener((tabId) => handleTabUpdate(tabId))
