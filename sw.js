// 폰에 설치한 앱이 인터넷이 잠깐 끊겨도 열리도록, 마지막으로 받은 화면 파일을 보관해 둡니다.
// 인터넷이 되면 항상 새 파일을 먼저 받아서 쓰기 때문에, 업데이트하면 다음 실행부터 바로 반영돼요.
const CACHE = 'yeonkki-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // 같은 사이트의 화면 파일만 보관 (Supabase 데이터 요청 등은 건드리지 않음)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./')))
  );
});
