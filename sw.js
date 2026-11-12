/* Coach Course : fonctionnement hors ligne */
const C='coach-v2';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon-180.png']).catch(()=>{}))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url);
  if(r.mode==='navigate'||u.origin===location.origin){
    const key=r.mode==='navigate'?'./index.html':r;
    e.respondWith(fetch(r).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(key,cp)); } return res; })
      .catch(()=>caches.match(key).then(x=>x||caches.match('./')))); return; }
  if(/gstatic\.com\/firebasejs\/|cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.href)){
    e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); return res; }))); }
});
