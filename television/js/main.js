

(() => {
 const host=document.getElementById('particles');
 const count=Math.min(55,Math.max(24,Math.round(innerWidth/28)));
 for(let i=0;i<count;i++){
   const p=document.createElement('i');p.className='particle';
   p.style.setProperty('--x',(Math.random()*100)+'%');
   p.style.setProperty('--dur',(9+Math.random()*18)+'s');
   p.style.setProperty('--delay',(-Math.random()*24)+'s');
   p.style.width=p.style.height=(1+Math.random()*2.5)+'px';
   host.appendChild(p);
 }
 // Live site analytics: aggregate unique users and visit pulses.
 const countNode = document.getElementById('uniqueTodayCount');
 const pulseNode = document.getElementById('visitPulse');
 const apiUrl = 'http://k90908k8.beget.tech/fml31/stats/telemetry.php';
 let previousVisits = null;
 let polling = false;

 function triggerVisitPulse() {
   if (!pulseNode) return;
   pulseNode.classList.remove('pulse-active');
   // Restart the CSS animation reliably for every new visit event.
   void pulseNode.offsetWidth;
   pulseNode.classList.add('pulse-active');
   window.setTimeout(() => pulseNode.classList.remove('pulse-active'), 1250);
 }

 function animateVisitBurst(count) {
   // Replay every newly observed visit; keep the screen readable during bursts.
   const replayCount = Math.min(count, 12);
   for (let i = 0; i < replayCount; i++) {
     window.setTimeout(triggerVisitPulse, i * 260);
   }
 }

 async function refreshLiveStats() {
   if (polling || document.visibilityState === 'hidden') return;
   polling = true;
   try {
     const response = await fetch(apiUrl, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       cache: 'no-store',
       body: JSON.stringify({ action: 'get_live_stats' })
     });
     if (!response.ok) throw new Error('HTTP ' + response.status);
     const data = await response.json();
     if (!data.success) throw new Error('API response was not successful');

     if (countNode) countNode.textContent = Number(data.unique_users_today || 0).toLocaleString('ru-RU');

     const visits = Number(data.total_visits_today || 0);
     if (previousVisits !== null && visits > previousVisits) {
       animateVisitBurst(visits - previousVisits);
     }
     previousVisits = visits;
   } catch (error) {
     // The display keeps running if the analytics API is temporarily unavailable.
     if (countNode && countNode.textContent === '—') countNode.textContent = '…';
     console.warn('Не удалось обновить статистику посещений:', error);
   } finally {
     polling = false;
   }
 }

 refreshLiveStats();
 window.setInterval(refreshLiveStats, 7000);
 document.addEventListener('visibilitychange', () => {
   if (document.visibilityState === 'visible') refreshLiveStats();
 });

 // TV-friendly: tap/click or press F to toggle fullscreen.
 const fullscreen=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.()};
 document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f')fullscreen();});
 document.addEventListener('dblclick',fullscreen);
})();
