import { t, ParentNode } from '@arrow-js/core'
import json from './tabby.json'
import '../public/style.scss'

/* -----------------
 * Type definitions.
 */
export type TabbyConfiguration = {
  layout: Partial<{
    background: string
    columns: number
    rows: number
  }>
  options: Array<{
    url: string
    icon: string
  }>
  quicklinks: {
    key: string
    links: string[]
  }
}

/* ---------------
 * Main interface.
 */
const CONFIG: TabbyConfiguration = json
const APP = document.getElementById('root') as ParentNode

// Handle quick links.
let timer: ReturnType<typeof setTimeout> | null = null
const handlePress = (e: KeyboardEvent) => {
  const { key, links } = CONFIG.quicklinks
  if (e.key !== key) return
  e.preventDefault()
  if (timer) {
    clearTimeout(timer)
    timer = null
    links.forEach((url, i) => {
      if (i === 0) chrome.tabs.update({ url })
      else if (i === links.length - 1) chrome.tabs.create({ url, active: true })
      else chrome.tabs.create({ url })
    })
  } else {
    timer = setTimeout(() => (timer = null), 200)
  }
}

// Add event listener.
document.addEventListener('keydown', handlePress)

// Set CSS properties.
const p = (l: string, v: string) => {
  document.documentElement.style.setProperty(l, v)
}

p(`--background-image`, `url(${CONFIG.layout.background}`)
p(`--columns`, Array(CONFIG.layout.columns).fill('1fr').join(' '))
p(`--rows`, Array(CONFIG.layout.rows).fill('1fr').join(' '))

// Render!
const html = t`
  <div class="links">
    ${() =>
      CONFIG.options.map(
        (tab) =>
          t`<div>
              <a href="${tab.url}">${tab.icon}</a>
            </div>`
      )}
  </div>
`

html(APP)
