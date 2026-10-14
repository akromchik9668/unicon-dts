import React from 'react';
import {translations} from './translations';
import {nationalTranslations} from './nationalTranslations';
import {orbitTranslations} from './orbitTranslations';
import {atlasTranslations} from './atlasTranslations';
Object.assign(translations,nationalTranslations,orbitTranslations,atlasTranslations);
export function readLanguage(){try{const l=localStorage.getItem('dts-language');return ['ru','uz','en'].includes(l)?l:'ru'}catch{return 'ru'}}
let language=readLanguage();
export function setLanguage(l){language=l;document.documentElement.lang=l;try{localStorage.setItem('dts-language',l)}catch{}document.title=l==='uz'?'IUT — ishonch arxitekturasi · UNICON.UZ':l==='en'?'TTP — architecture of trust · UNICON.UZ':'ДТС — архитектура доверия · UNICON.UZ'}
export function t(text){if(typeof text!=='string')return text;const abbreviation=language==='ru'?'ДТС':language==='uz'?'IUT':'TTP';const finish=value=>value.replace(/\bIUT\b|\bTTP\b|ДТС/g,abbreviation).replace(new RegExp(abbreviation+' / '+abbreviation,'g'),abbreviation);const trimmed=text.trim(),entry=translations[trimmed];if(language==='ru')return finish(entry?.ru||text);if(entry?.[language])return finish(text.replace(trimmed,entry[language]));if(trimmed.endsWith(' · юридические и физические лица'))return t(trimmed.split(' · ')[0])+(language==='uz'?' · yuridik va jismoniy shaxslar':' · legal entities and individuals');if(trimmed.endsWith(' · схема взаимодействия'))return t(trimmed.split(' · ')[0])+(language==='uz'?' · hamkorlik sxemasi':' · cooperation diagram');return finish(text.replace(/ШАГ (\d+) \/ (\d+)/g,language==='uz'?'QADAM $1 / $2':'STEP $1 / $2').replace(/ЭТАП (\d+) \/ (\d+)/g,language==='uz'?'BOSQICH $1 / $2':'STAGE $1 / $2'))}

export function h(type,props,...children){let next=props;if(typeof type==='string'&&props){next={...props};for(const key of ['aria-label','title','alt','placeholder'])if(next[key])next[key]=t(next[key]);if(type==='option'&&next.value===undefined&&typeof children[0]==='string')next.value=children[0]}return React.createElement(type,next,...children.map(c=>typeof c==='string'?t(c):c))}

