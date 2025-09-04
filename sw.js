// Tên của bộ nhớ cache
const CACHE_NAME = 'checkin-app-cache-v1';

// Danh sách các file cần được cache lại để ứng dụng hoạt động offline
const urlsToCache = [
  '/',
  '/index (1).html',
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js'
];

// Sự kiện 'install': được gọi khi service worker được cài đặt lần đầu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện 'fetch': được gọi mỗi khi có một yêu cầu mạng từ ứng dụng
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Nếu tìm thấy trong cache, trả về từ cache
        if (response) {
          return response;
        }
        // Nếu không, thực hiện yêu cầu mạng
        return fetch(event.request);
      }
    )
  );
});
