(function(){
'use strict';

var clamp01=function(v){return Math.max(0,Math.min(1,v));};
var lerp=function(a,b,t){return a+(b-a)*clamp01(t);};
var smoothstep=function(t){t=clamp01(t);return t*t*(3-2*t);};
var DPR=Math.min(window.devicePixelRatio||1,2);
var viewW=window.innerWidth,viewH=window.innerHeight;

var rooms=['r1','r2','r3','r4','r5','r6'].map(function(id){return document.getElementById(id);});
var roomData=rooms.map(function(el){return{el:el,progress:0,top:0,height:0};});

function cacheRooms(){
  roomData.forEach(function(r){
    var rect=r.el.getBoundingClientRect();
    r.top=rect.top+window.scrollY;
    r.height=rect.height;
  });
}
cacheRooms();
window.addEventListener('resize',function(){viewW=window.innerWidth;viewH=window.innerHeight;cacheRooms();});

// ── WHALE VIDEO BACKGROUND (buttery 30fps loop + scroll scrub) ──
var whaleWrap=document.getElementById('whaleWrap');
var whaleVid=document.getElementById('whaleVid');
var vidReady=false;
function tryPlay(){
  if(vidReady||!whaleVid)return;
  if(whaleVid.readyState>=2){
    vidReady=true;
    whaleVid.play().catch(function(){});
  }
}
if(whaleVid){
  whaleVid.addEventListener('canplay',tryPlay);
  whaleVid.addEventListener('loadeddata',tryPlay);
}
window.addEventListener('pointerdown',tryPlay,{passive:true});
window.addEventListener('keydown',tryPlay,{passive:true});

// ── TEXT EFFECTS ──
var nameText=document.getElementById('nameText'),nameStage=document.getElementById('nameStage');

function splitToChars(el,cls){
  var text=el.textContent;el.textContent='';
  var chars=[];
  text.split('').forEach(function(ch){
    var s=document.createElement('span');
    if(ch===' '&&cls!=='name-char'){s.className=cls;s.textContent=ch;s.style.display='inline';}
    else{s.className=cls+(ch===' '?' name-space':'');s.textContent=ch===' '?'\u00a0':ch;}
    el.appendChild(s);chars.push(s);
  });
  return chars;
}
var nameVPChars=splitToChars(nameText,'name-char');
var roleVPChars=[];
var projectsEl=document.getElementById('varprox');
var projectsSpan=document.createElement('span');
projectsSpan.className='variable-proximity';
projectsEl.appendChild(projectsSpan);
var projectsVPChars=splitToChars(projectsSpan,'vp-char');
var allVPChars=[].concat(nameVPChars,roleVPChars,projectsVPChars);
var nameRevealCount=0;

var TITLE_PAD=40;
function fitName(){
  if(!nameText)return;
  nameText.style.fontSize='';
  var avail=viewW-TITLE_PAD*2;
  var w=nameText.scrollWidth;
  if(w>avail&&w>0){
    var cur=parseFloat(getComputedStyle(nameText).fontSize);
    nameText.style.fontSize=(cur*avail/w)+'px';
  }
}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitName);else fitName();
window.addEventListener('resize',fitName);

function revealNameChars(count){
  nameVPChars.forEach(function(c,i){
    c.style.opacity=i<count?'1':'0';
    c.style.transform=i<count?'translateY(0)':'translateY(20px)';
  });
}
var curMX=0,curMY=0;
window.addEventListener('mousemove',function(e){curMX=e.clientX;curMY=e.clientY;},{passive:true});

function updateAllVP(){
  allVPChars.forEach(function(c){
    var rect=c.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    var dist=Math.hypot(curMX-cx,curMY-cy),radius=150;
    if(dist<radius){var t=1-dist/radius,wght=400+600*t,opsz=9+31*t;c.style.fontVariationSettings="'wght' "+Math.round(wght)+", 'opsz' "+Math.round(opsz);}
    else c.style.fontVariationSettings="'wght' 400, 'opsz' 9";
  });
}

// ── GALLERY CARDS ──
var cardData=[
  {name:'Whale Passage',img:'images/whale-ocean.jpg',url:'https://www.instagram.com/margreenie/'},
  {name:'Behind the Greens',img:'images/forest-green.jpg',url:'https://www.instagram.com/behindthegreensmedia/'},
    {name:'Terra Incognita',img:'images/terra-incognita.jpg',url:'https://terraincognita.pt/en/'},
  {name:'Mercedes Oceanic Lounge',img:'images/mercedes-oceanic.jpg',url:'https://mboceaniclounge.pt/en/'},
  {name:'Mangrowth (documentary)',img:'images/mangrove.jpg',url:'https://www.wherevermags.com/news/eco-heroines-in-portugal/'},
  {name:'The Knysna Quest',img:'images/knysna-quest.jpg',url:'blog.html'},
  {name:'Voyage Michigan Story',img:'images/voyage-michigan.jpg',url:'https://voyagemichigan.com/interview/check-out-margarita-samsonovas-story/'},
  {name:'70 Countries & Counting',img:'images/70-countries.jpg',url:'https://www.instagram.com/margreenie/'}
];
var $cardRing=document.getElementById('cardRing');
cardData.forEach(function(card){
  var el=document.createElement('div');el.className='ring-card';
  var inner=card.img
      ?'<div class="ring-card-inner"><div class="ring-card-front"><img src="'+card.img+'" alt="'+card.name+'" style="width:100%;height:100%;object-fit:cover;border-radius:12px"></div></div><div class="ring-card-reflect" aria-hidden="true"><img src="'+card.img+'" alt=""></div><div class="ring-card-pill">'+card.name+'</div>'
      :'<div class="ring-card-inner"><div class="ring-card-front"><span class="ring-card-title">'+card.name+'</span></div></div><div class="ring-card-pill">'+card.name+'</div>';
  el.innerHTML=inner;
  if(card.url)el.addEventListener('click',function(e){e.stopPropagation();window.open(card.url,'_blank');});
  if(card.restart)el.addEventListener('click',function(e){e.stopPropagation();window.scrollTo({top:0,behavior:'smooth'});});
  el._spring={tx:0,tz:-400,ry:0,sc:1,op:0,vtx:0,vtz:0,vry:0,vsc:0,vop:0};
  $cardRing.appendChild(el);
});

// ── PHASE DOTS ──
var dots=document.querySelectorAll('.phase-dots .dot');
dots.forEach(function(dot){
  dot.addEventListener('click',function(){
    document.getElementById(this.getAttribute('data-room')).scrollIntoView({behavior:'smooth'});
  });
});

// ── MOBILE MENU ──
var menuToggle=document.getElementById('menuToggle'),mobileMenu=document.getElementById('mobileMenu'),menuBackdrop=document.getElementById('menuBackdrop');
function setMenu(open){
  mobileMenu.classList.toggle('open',open);
  menuBackdrop.classList.toggle('open',open);
  menuToggle.classList.toggle('open',open);
  menuToggle.setAttribute('aria-expanded',open?'true':'false');
}
if(menuToggle){
  menuToggle.addEventListener('click',function(){setMenu(!mobileMenu.classList.contains('open'));});
  menuBackdrop.addEventListener('click',function(){setMenu(false);});
  mobileMenu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});
}

// ── DONATE PLACEHOLDERS ──
var donateNote=document.getElementById('donateNote');
document.querySelectorAll('.donate-chip').forEach(function(chip){
  chip.addEventListener('click',function(){
    donateNote.textContent=chip.dataset.donate+' is being set up — payment links and wallet addresses will appear here at launch. Follow @margreenie for the announcement.';
    donateNote.style.color='var(--purple)';
  });
});

// ── LANDSCAPE PROMPT ──
var landscapeOverlay=document.getElementById('landscapeOverlay');
var loDismissed=false;
function checkOrientation(){
  var portraitPhone=window.innerHeight>window.innerWidth&&window.innerWidth<=900;
  if(!portraitPhone)loDismissed=false;
  landscapeOverlay.style.display=(portraitPhone&&!loDismissed)?'flex':'none';
}
checkOrientation();
window.addEventListener('orientationchange',function(){setTimeout(checkOrientation,100);});
var loLastW=window.innerWidth;
window.addEventListener('resize',function(){
  if(window.innerWidth!==loLastW){loLastW=window.innerWidth;checkOrientation();}
});
document.getElementById('loOkBtn').addEventListener('click',function(){loDismissed=true;landscapeOverlay.style.display='none';});

// ── SCROLL ENGINE: Lenis (inertial smooth scroll) + GSAP ScrollTrigger ──
// One system drives scroll. Lenis lerps the scroll value (compositor-friendly,
// dampens when you stop). ScrollTrigger maps room progress to animations with
// scrub easing. All animated props are transform/opacity only.

// Lenis: buttery inertial scrolling
var lenis = new Lenis({
  duration: 1.1,            // lerp duration — higher = floatier
  easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.4
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Autoscroll: when idle, glide the page down synced to the video (21.6vh/s).
// Uses Lenis scrollTo (eased, interruptible) — no hand-rolled velocity ramp.
var lastInputT = 0;
var AUTO_IDLE_MS = 700;
var autoVelVh = 21.6;                 // vh per second (intro synced to video)
var autoScrollOn = true;
function clamp01(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
function smoothstep(v){ v = clamp01(v); return v * v * (3 - 2 * v); }
function introSpan(){
  // intro = r1..r5, gallery r6 is excluded
  var top = roomData[0].top;
  var bot = roomData[4].top + roomData[4].height;
  return { top: top, span: Math.max(1, bot - top) };
}
var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var armAt = performance.now() + 6000;   // hero breathes first; arming after 6s idle
function userInputNow(){ lastInputT = performance.now(); armAt = 0; autoTicking = false; }
['wheel','touchstart','touchmove','keydown','pointerdown'].forEach(function(ev){
  window.addEventListener(ev, userInputNow, {passive:true});
});
var autoTicking = false;
var autoV = 0;                        // current autoscroll velocity (px/s)
var autoLastT = 0;
// Autoscroll runs inside the gsap.ticker (every frame, cannot die).
// Contract: while the user is idle inside the intro, THE SITE SCROLLS ITSELF.
// Lenis is stopped so its smoothing cannot fight the native scroll; on any
// user input, Lenis is restarted and resynced instantly, handing control back.
function autoscrollStep(){
  if(!autoScrollOn || REDUCED) return;
  var now = performance.now();
  if(now < armAt) return;              // rooms 1-3 play first, no forced skip
  var idle = now - lastInputT >= AUTO_IDLE_MS;
  var s = introSpan(), galleryTop = s.top + s.span;
  var inIntro = window.scrollY < galleryTop - 2;
  if(idle && inIntro){
    // user idle + intro: take over and glide
    if(!lenis.isStopped) lenis.stop();
    if(!autoLastT) autoLastT = now;
    var dtMs = Math.min(50, now - autoLastT);
    autoLastT = now;
    var cruise = autoVelVh * window.innerHeight;
    var remain = galleryTop - window.scrollY;
    if(remain < window.innerHeight * 2){                 // ease out near gallery
      cruise *= Math.max(0, remain / (window.innerHeight * 2));
    }
    autoV += (cruise - autoV) * Math.min(1, dtMs / 400); // buttery ramp
    if(autoV < 1) autoV = 0;
    window.scrollBy(0, autoV * dtMs / 1000);
    autoTicking = autoV > 0;
  }else{
    // user active (or at gallery): release control back to Lenis
    autoV = 0;
    autoLastT = 0;
    autoTicking = false;
    if(lenis.isStopped){
      lenis.start();
      lenis.scrollTo(window.scrollY, { immediate: true }); // resync Lenis
    }
  }
}
gsap.ticker.add(autoscrollStep);

// ScrollTrigger: room progress -> animations (scrub easing, transform/opacity only)
gsap.registerPlugin(ScrollTrigger);

// Ocean -> gallery transition: ONE scrubbed timeline, strictly sequential in
// BOTH directions. First half: the ocean slides up out of view. Second half:
// the gallery rises from underneath. Scrolling back up reverses it exactly —
// the gallery fully exits before the ocean returns. No crossfade, ever.
gsap.timeline({
  scrollTrigger: {
    trigger: '#r5', start: 'top bottom', end: 'bottom top', scrub: 1
  }
})
.to('#whaleWrap', { yPercent: -100, opacity: 0, duration: 0.5, ease: 'power2.in' })
.to('#slateStage', { y: '-60vh', opacity: 0, duration: 0.5, ease: 'power2.in', overwrite: 'auto' }, '<')
.fromTo('#galleryRoom',
  { yPercent: 100, opacity: 0 },
  { yPercent: 0, opacity: 1, visibility: 'visible', duration: 0.5, ease: 'power2.out' }
)
.to('#galleryFloor', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '<');

// Title: rises into place through early r3, holds through r4. It leaves only
// in the '#r5' ocean timeline (rides up with the whale; overwrite:'auto' takes
// sole control when that starts). So it can never linger into r6.
gsap.timeline({
  scrollTrigger: {
    trigger: '#r3', start: 'top 60%', end: 'bottom top', scrub: 1
  }
})
.fromTo('#slateStage', { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' });



// Title chars: reveal progressively as r3 is scrolled (scrubbed, re-enters).
// Without this the name chars stay at their CSS default opacity:0.
ScrollTrigger.create({
  trigger: '#r3', start: 'top 60%', end: 'bottom top', scrub: true,
  onUpdate: function(self){
    var target = Math.floor(Math.min(1, self.progress / 0.2) * nameVPChars.length);
    if(target !== nameRevealCount){ revealNameChars(target); nameRevealCount = target; }
  }
});

// Mouse-proximity variable-font effect (rAF-throttled mousemove, plus on scroll)
var vpRaf = null;
window.addEventListener('mousemove', function(){
  if(vpRaf) return;
  vpRaf = requestAnimationFrame(function(){ vpRaf = null; updateAllVP(); });
}, {passive:true});
ScrollTrigger.create({
  trigger: '#r6', start: 'top bottom', end: 'bottom top',
  onUpdate: updateAllVP
});

// Nav bar: fade in once past the intro
gsap.to('#topNav', {
  opacity: 1, pointerEvents: 'auto', ease: 'none',
  scrollTrigger: { trigger: '#r4', start: 'top bottom', end: 'top top', scrub: 1 }
});

// Gallery ring scrub: active card follows scroll progress through r6
var ringCards = document.querySelectorAll('.ring-card');
var total = ringCards.length;
ScrollTrigger.create({
  trigger: '#r6', start: 'top top', end: 'bottom bottom', scrub: 1,
  onUpdate: function(self){
    var idx = Math.max(0, Math.min(total - 1, Math.round(self.progress * (total - 1))));
    ringCards.forEach(function(card, i){ card.classList.toggle('focused', i === idx); });
  }
});
// Mobile: the horizontal swipe drives the focused card (scroll-snap row)
var galleryEl = document.getElementById('galleryRoom');
if(galleryEl){
  galleryEl.addEventListener('scroll', function(){
    if(!mobilePortrait) return;
    var step = galleryEl.scrollWidth / total;
    var idx = Math.max(0, Math.min(total - 1, Math.round(galleryEl.scrollLeft / step)));
    ringCards.forEach(function(card, i){ card.classList.toggle('focused', i === idx); });
  }, {passive:true});
}

// Keep the gallery spring physics running on a lightweight rAF (transform-only).
// On mobile portrait the gallery is a horizontal scroll-snap row — the 3D
// spring would fight the native swipe, so it is skipped there.
var mobilePortrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
var gallerySpring = function(){
  if(mobilePortrait) return;
  var active = document.querySelector('.ring-card.focused');
  if(active){
    var idx = Array.prototype.indexOf.call(ringCards, active);
    ringCards.forEach(function(card, i){
      var dist = i - idx, tx, tz, ry, sc, op;
      if(dist === 0){ tx = 0; tz = 120; ry = 0; sc = 1; op = 1; }
      else if(dist === -1){ tx = -480; tz = -130; ry = 32; sc = 1; op = 1; }
      else if(dist === 1){ tx = 480; tz = -130; ry = -32; sc = 1; op = 1; }
      else if(dist === -2){ tx = -720; tz = -230; ry = 42; sc = 1; op = 1; }
      else if(dist === 2){ tx = 720; tz = -230; ry = -42; sc = 1; op = 1; }
      else { tx = 0; tz = -400; ry = 0; sc = 1; op = 0; }
      var s = card._spring;
      s.vtx += (tx - s.tx) * 0.08; s.vtx *= 0.72; s.tx += s.vtx;
      s.vtz += (tz - s.tz) * 0.08; s.vtz *= 0.72; s.tz += s.vtz;
      s.vry += (ry - s.ry) * 0.08; s.vry *= 0.72; s.ry += s.vry;
      s.vsc += (sc - s.sc) * 0.08; s.vsc *= 0.72; s.sc += s.vsc;
      s.vop += (op - s.op) * 0.08; s.vop *= 0.72; s.op += s.vop;
      card.style.transform = 'translateX(' + s.tx.toFixed(1) + 'px) translateZ(' + s.tz.toFixed(1) + 'px) rotateY(' + s.ry.toFixed(1) + 'deg) scale(' + s.sc.toFixed(2) + ')';
      card.style.opacity = Math.max(0, Math.min(1, s.op)).toFixed(3);
      card.style.zIndex = dist === 0 ? '100' : Math.abs(dist) === 1 ? '50' : '30';
      card.style.pointerEvents = s.op > 0.3 ? 'auto' : 'none';
    });
  }
  requestAnimationFrame(gallerySpring);
};
requestAnimationFrame(gallerySpring);

// Scroll reset
if('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);


})();
