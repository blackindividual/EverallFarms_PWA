/// <reference lib="webworker" />
// Custom service worker for PWA (injectManifest strategy)
// Precache
import { precacheAndRoute } from 'workbox-precaching'

// self.__WB_MANIFEST is replaced at build time
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST || [])

// Basic push handler (server must send JSON or text)
self.addEventListener('push', (event: any) => {
  const dataText = event?.data?.text?.() || ''
  let payload: any = {}
  try { payload = JSON.parse(dataText) } catch { payload = { title: 'EverallFarm', body: dataText || 'New reminder' } }
  const title = payload.title || 'EverallFarm Reminder'
  const body = payload.body || 'You have a new reminder.'
  const url = payload.url || '/' // open on click
  const options: NotificationOptions = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url },
  }
  event.waitUntil((self as any).registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event: any) => {
  const url = event?.notification?.data?.url || '/'
  event.notification.close()
  event.waitUntil((async () => {
    const allClients = await (self as any).clients.matchAll({ type: 'window', includeUncontrolled: true })
    const existing = allClients.find((c: any) => c.url.includes(url))
    if (existing) {
      existing.focus()
      return
    }
    await (self as any).clients.openWindow(url)
  })())
})
