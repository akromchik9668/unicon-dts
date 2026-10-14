/** @jsx h */
import {h} from './i18n';
import React from 'react';
export default function RevealDiagram({nodes,steps,step,playing,story,selected,select,start,overview,Icon}){
 nodes=nodes.map(n=>({...n,y:n.y>=80?74:n.y})); const active=steps[step]?.id;
 return <div className={'diagram reveal-diagram '+(story?'story-mode':'overview-mode')}>
 <div className="story-toolbar"><span><i/>{story?(step<0?'СНАЧАЛА — ЯДРО ДОВЕРИЯ':`ЭТАП 0${step+1} / 06`):'ПОЛНАЯ АРХИТЕКТУРА'}</span><button onClick={overview}>{story?'Вся схема ↗':'Пошаговый показ ↗'}</button></div>
 <div className="core-aura"/><div className="story-orbit"/>
 <svg className="connections" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="story-glow"><feGaussianBlur stdDeviation="4"/></filter></defs>
 {nodes.filter(n=>!story||steps.findIndex(s=>s.id===n.id)<=step).map(n=>{const index=steps.findIndex(s=>s.id===n.id),isActive=n.id===active;const d=`M500 300 Q${n.x*10} 300 ${n.x*10} ${n.y*6}`;return <g key={n.id} className={'story-link '+(isActive?'story-active':'')}>
 <path className="story-connection-glow" d={d}/><path className="story-connection" pathLength="1" d={d}/><path className="line-hit" d={d} onClick={()=>select(n.id)}/>
 {(isActive||!story)&&<g className="story-packet"><circle r="12" fill="#60ecd5" filter="url(#story-glow)" opacity=".65"/><rect x="-5" y="-7" width="10" height="14" rx="2" fill="#e0fff8"/><path d="M-2-3H2M-2 0H2M-2 3H1" stroke="#258e80" strokeWidth="1"/><animateMotion dur="2.8s" begin=".7s" repeatCount="indefinite" path={d} keyPoints={index===0||index===5?'1;0':'0;1'} keyTimes="0;1" calcMode="linear"/></g>}
 </g>})}</svg>
 <button className="central-node story-core" onClick={()=>select('dts')}><Icon name="shield" size={32}/><strong>ДТС</strong><span>Ядро доверия</span><b>+</b></button>
 {nodes.filter(n=>!story||steps.findIndex(s=>s.id===n.id)<=step).map(n=>{const index=steps.findIndex(s=>s.id===n.id);return <button key={n.id} className={'diagram-node story-node '+(active===n.id?'lit':'')+(story&&index<step?' revealed-done':'')} style={{left:n.x+'%',top:n.y+'%','--reveal-x':`${(50-n.x)*7}px`,'--reveal-y':`${(50-n.y)*5}px`}} onClick={()=>select(n.id)}><span className="node-icon"><Icon name={n.icon}/></span><strong>{n.name}</strong><small>{n.sub}</small><b>{story&&index<step?'✓':'↗'}</b><span className="node-sequence">0{index+1}</span></button>})}
 {story&&step<0&&<div className="story-invitation"><span>Каждая связь — отдельный шаг</span><button onClick={start}>{playing?'Раскрываем архитектуру…':'▷ Начать путешествие документа'}</button></div>}
 {story&&step>=0&&<div className="scene-caption" key={step}><span>0{step+1}</span><div><small>{step===5?'РЕЗУЛЬТАТ ОБМЕНА':'ПУТЬ ЭЛЕКТРОННОГО ДОКУМЕНТА'}</small><strong>{steps[step].title}</strong></div></div>}
 <div className="scene-progress">{steps.map((s,i)=><i className={step>=i?'filled':''} key={s.id}/>)}</div>
 </div>
}


