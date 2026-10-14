/** @jsx h */
import {h} from './i18n';
import React,{useState,useEffect} from 'react';
const land='M28 180 65 130 135 125 155 100 214 109 242 157 216 186 169 200 149 240 105 237 90 213 51 208ZM171 259 219 253 257 282 269 324 245 369 219 425 198 404 190 348 168 307ZM336 142 369 100 421 108 448 147 418 180 383 191 350 177ZM357 217 420 202 466 227 476 275 445 332 414 360 375 307 366 267ZM447 154 464 105 512 99 546 74 610 89 638 69 738 96 824 127 858 170 822 206 759 210 734 260 690 269 665 307 622 263 595 251 558 209 518 218 491 186ZM683 354 735 332 796 350 818 393 772 415 710 401Z';
export default function TechMap({countries,country,onPick,onOrigin}){
 const [motion,M]=useState(true),[tour,T]=useState(false),[zoom,Z]=useState(1);
 useEffect(()=>{if(!tour||!countries.length)return;let index=0;onPick(countries[index].id);const timer=setInterval(()=>{index=(index+1)%countries.length;onPick(countries[index].id)},3200);return()=>clearInterval(timer)},[tour,countries]);
 const choose=id=>{T(false);onPick(id)};
 return <div className={'tech-map '+(!motion?'motion-paused':'')}>
  <div className="map-hud"><div><span className="signal-bars"><i/><i/><i/><i/></span><span>АТЛАС ДОВЕРИЯ<small>Визуализация маршрутов обмена</small></span></div><span className="hud-coordinate">UZ · 41.3° N / 69.2° E</span></div>
  <div className="map-stage"><div className="map-zoom" style={{transform:`scale(${zoom})`}}>
   <svg viewBox="0 0 900 490" preserveAspectRatio="none" className="tech-geography" aria-hidden="true"><defs>
    <pattern id="tech-grid" width="45" height="35" patternUnits="userSpaceOnUse"><path d="M45 0H0V35" fill="none" stroke="#27526b" strokeWidth=".5"/></pattern>
    <pattern id="tech-dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#438b9e"/></pattern>
    <radialGradient id="map-light"><stop stopColor="#1b6477" stopOpacity=".4"/><stop offset="1" stopColor="#072232" stopOpacity="0"/></radialGradient>
    <linearGradient id="route-color"><stop stopColor="#3ae5cb"/><stop offset="1" stopColor="#6ba6ff"/></linearGradient>
    <filter id="signal-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="land-clip"><path d={land}/></clipPath>
   </defs><rect width="900" height="490" fill="url(#tech-grid)"/><ellipse cx="540" cy="265" rx="365" ry="260" fill="url(#map-light)"/>
   <g className="map-latitudes" fill="none" stroke="#245169" strokeWidth=".6"><ellipse cx="450" cy="245" rx="430" ry="210"/><ellipse cx="450" cy="245" rx="290" ry="210"/><ellipse cx="450" cy="245" rx="140" ry="210"/><path d="M25 245H875M65 145Q450 90 835 145M65 345Q450 400 835 345"/></g>
   <path d={land} fill="#0e3343" stroke="#36768a" strokeWidth=".7"/><path d={land} fill="url(#tech-dots)"/>
   <g clipPath="url(#land-clip)"><rect className="land-scanner" x="-100" width="100" height="490" fill="#5ddfc0" opacity=".14"/></g>
   <g className="origin-radar" fill="none" stroke="#3ae5cb"><circle cx="522" cy="294" r="36"/><circle cx="522" cy="294" r="65"/><circle cx="522" cy="294" r="96"/></g>
   {countries.map((c,i)=>{const x=c.x*9,y=c.y*4.9;const d=`M522 294 Q${(522+x)/2-35} ${Math.min(294,y)-75} ${x} ${y}`;return <g key={c.id} className={'tech-route '+(c.status==='Работает'||c.status==='Подключено'?'route-live ':'route-progress ')+(country===c.id?'route-selected':'')}>
    <path d={d} className="route-glow"/><path d={d} className="route-base"/><path d={d} className="route-dashes"/>
    <path d={d} className="route-click" onClick={()=>choose(c.id)}><title>{c.name} — раскрыть маршрут</title></path>
    <g className="moving-packet"><circle r="7" fill="#49eacf" filter="url(#signal-glow)"/><circle r="2.5" fill="#c8fff5"/><animateMotion dur={`${3.2+i*.45}s`} begin={`${-i}s`} repeatCount="indefinite" path={d}/></g>
    <g className="moving-packet return-packet"><circle r="2" fill="#89baff"/><animateMotion dur={`${4+i*.4}s`} begin={`${-i-1}s`} repeatCount="indefinite" path={d} keyPoints="1;0" keyTimes="0;1" calcMode="linear"/></g>
    <circle className="destination-wave" cx={x} cy={y} r="12" style={{animationDelay:`${-i}s`}}/>
   </g>})}</svg>
   <button className="tech-origin" style={{left:'58%',top:'60%'}} onClick={onOrigin}><span className="origin-ring"/><span className="origin-shield">◇</span><b>ДТС</b><small>УЗБЕКИСТАН</small></button>
   {countries.map((c,i)=><button className={'tech-pin pin-'+c.id+' '+(c.status==='Работает'||c.status==='Подключено'?'pin-live ':'pin-progress ')+(c.x>75?'pin-right ':'')+(c.y>=55&&c.x<75?'pin-below ':'')+(country===c.id?'chosen':'')} key={c.id} style={{left:c.x+'%',top:c.y+'%',animationDelay:`${i*.1}s`}} onClick={()=>choose(c.id)}><span className="pin-target"/><span className="pin-label"><small>{c.code||'ПАРТНЁР'} <i>↗</i></small><b>{c.name}</b><em>{c.status}</em></span></button>)}
  </div><span className="map-axis axis-left">90° N<br/>45° N<br/>00°<br/>45° S</span><div className="zoom-controls"><button aria-label="Увеличить карту" disabled={zoom>=1.45} onClick={()=>Z(Math.min(1.45,zoom+.15))}>+</button><button aria-label="Уменьшить карту" disabled={zoom<=1} onClick={()=>Z(Math.max(1,zoom-.15))}>−</button><button aria-label="Сбросить масштаб" onClick={()=>Z(1)}>⌖</button></div></div>
  <div className="tech-map-footer"><div><span className="map-demo-dot"/>ДЕМОНСТРАЦИЯ ОБМЕНА<small>Анимация не отражает фактическое подключение</small></div><div className="map-buttons"><button aria-pressed={tour} onClick={()=>{T(!tour);M(true)}}>{tour?'Ⅱ Остановить обзор':'▷ Обзор стран'}</button><button aria-pressed={!motion} onClick={()=>{M(!motion);if(motion)T(false)}}>{motion?'Ⅱ Анимация':'▷ Анимация'}</button></div></div>
 </div>
}



