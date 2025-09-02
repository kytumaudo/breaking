// service-worker.js

// Lắng nghe các sự kiện install và activate (cần thiết cho service worker)
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  // Bỏ qua chờ đợi để service worker mới được kích hoạt ngay lập tức
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Đảm bảo service worker kiểm soát trang ngay lập tức
  event.waitUntil(self.clients.claim());
});


// Lắng nghe tin nhắn từ trang chính
self.addEventListener('message', (event) => {
  // Chỉ xử lý tin nhắn có type là 'SCHEDULE_BREAK_END'
  if (event.data && event.data.type === 'SCHEDULE_BREAK_END') {
    const { empName, endTime } = event.data.payload;

    const delay = endTime - Date.now();

    // Nếu thời gian đã qua thì không làm gì cả
    if (delay < 0) return;

    // Đặt một bộ đếm giờ
    setTimeout(() => {
      // Khi hết giờ, hiển thị thông báo
      self.registration.showNotification('Hết giờ nghỉ!', {
        body: `Thời gian nghỉ của nhân viên ${empName} đã kết thúc.`,
        icon: 'icon.png', // Bạn có thể thêm một file icon.png vào thư mục
        vibrate: [200, 100, 200], // Rung điện thoại
        // Âm thanh sẽ là âm thanh thông báo mặc định của hệ điều hành
      });
    }, delay);
  }
});