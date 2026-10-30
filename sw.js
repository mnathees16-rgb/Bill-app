const C='shopbill-v13';
const F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const HOSTS=['www.gstatic.com','unpkg.com','cdn.jsdelivr.net'];   // Firebase + camera-scanner library files
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// Network first (new uploads show up automatically), cache when offline.
// Only this app's own files and the library files above are cached; live database traffic is never touched.
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||!(u.origin===location.origin||HOSTS.includes(u.hostname)))return;
  e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request)));
});
