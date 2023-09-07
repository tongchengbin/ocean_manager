import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Ocean CTF 管理后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
