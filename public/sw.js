const CACHE_NAME = 'quanto-v1';
const STATIC_ASSETS = ['/', '/app'];

// Install — cache shell
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Quanto';
  const options = {
    body: data.body || 'Não esqueça de registrar seus gastos hoje!',
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/app' },
    actions: [{ action: 'open', title: 'Abrir Quanto' }]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Click on notification
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/app';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
    const existing = cs.find(c => c.url.includes(url));
    if (existing) return existing.focus();
    return clients.openWindow(url);
  }));
});

// Periodic reminder (scheduled via client)
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_REMINDER') {
    const delay = e.data.delay || 8 * 60 * 60 * 1000; // 8h default
    setTimeout(() => {
      self.registration.showNotification('Quanto', {
        body: e.data.body || 'Já registrou seus gastos de hoje? 💰',
        icon: '/icons/icon-192.svg',
        badge: '/icons/icon-192.svg',
        vibrate: [100, 50, 100],
        data: { url: '/app' },
        tag: 'daily-reminder',
      });
    }, delay);
  }
});
