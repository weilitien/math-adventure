import {dayKey, type Progress} from './progress';
export const companions = [
 {id:'fox',icon:'🦊',name:'森林小狐',cost:0,description:'帶著好奇心，一起發現數字的秘密。'},
 {id:'rabbit',icon:'🐰',name:'花園小兔',cost:50,description:'一步一步跳，也能到達很遠的地方。'},
 {id:'panda',icon:'🐼',name:'竹林熊貓',cost:100,description:'慢慢想，找到自己的解題方法。'},
 {id:'cat',icon:'🐱',name:'偵探小貓',cost:150,description:'細心看線索，答案就藏在其中。'},
 {id:'astronaut',icon:'🧑‍🚀',name:'星空探險家',cost:200,description:'帶著數學本領，出發探索宇宙！'},
 {id:'wizard',icon:'🧙',name:'數字魔法師',cost:300,description:'把學會的方法，變成生活中的魔法。'},
];
export interface Rewards {owned:string[];equipped:string;claims:string[]}
export function rewards(p:Progress):Rewards {const r=p.rewards;const owned=['fox',...companions.filter(c=>c.cost>0&&Array.isArray(r?.owned)&&r.owned.includes(c.id)).map(c=>c.id)];return {owned,equipped:owned.includes(r?.equipped||'')?r!.equipped:'fox',claims:Array.isArray(r?.claims)?[...new Set(r.claims.filter(c=>typeof c==='string'&&/^\d{4}-\d{1,2}-\d{1,2}:(steps|explore|focus)$/.test(c)))]:[]}}
export function wallet(p:Progress){const r=rewards(p);return p.attempts.reduce((s,a)=>s+a.stars,0)+r.claims.length*20-companions.filter(c=>r.owned.includes(c.id)).reduce((s,c)=>s+c.cost,0)}
export function activeCompanion(p:Progress){return companions.find(c=>c.id===rewards(p).equipped)!}
export function dailyMissions(p:Progress,now=new Date()) {const date=dayKey(now),today=p.attempts.filter(a=>dayKey(new Date(a.completedAt))===date);return [
 {id:'steps',icon:'👣',title:'今天的小腳印',description:'完成 5 題，訂正完成也算！',current:today.length,target:5,pool:['T02','T08','T09','T10','T11']},
 {id:'explore',icon:'🧭',title:'好奇心探險家',description:'探索 3 種不同的題型。',current:new Set(today.map(a=>a.topicId)).size,target:3,pool:['T01','T04','T06','T17','T19']},
 {id:'focus',icon:'🌿',title:'耐心練習家',description:'累積完成 10 題，不需要連續答對。',current:today.length,target:10,pool:['T03','T07','T12','T15','T20']},
 ].map(m=>({...m,key:`${date}:${m.id}`,claimed:rewards(p).claims.includes(`${date}:${m.id}`)}))}
export function claimMission(p:Progress,id:string,now=new Date()):Progress {const m=dailyMissions(p,now).find(m=>m.id===id);if(!m||m.claimed||m.current<m.target)return p;const r=rewards(p);return {...p,rewards:{...r,claims:[...r.claims,m.key]}}}
export function chooseCompanion(p:Progress,id:string):Progress {const c=companions.find(c=>c.id===id),r=rewards(p);if(!c||(!r.owned.includes(id)&&wallet(p)<c.cost))return p;return {...p,rewards:{...r,owned:[...new Set([...r.owned,id])],equipped:id}}}
export function badges(p:Progress){const a=p.attempts;return [
 {id:'first',icon:'🌱',name:'第一步',description:'完成第一道題目',current:a.length,target:1},
 {id:'curious',icon:'🧭',name:'好奇心滿滿',description:'探索 5 種題型',current:new Set(a.map(x=>x.topicId)).size,target:5},
 {id:'patient',icon:'🪴',name:'耐心小樹',description:'累積完成 25 題',current:a.length,target:25},
 {id:'brave',icon:'🛠️',name:'勇敢再試',description:'完成 3 次訂正',current:a.filter(x=>x.corrected).length,target:3},
 {id:'island',icon:'🏝️',name:'探險通行證',description:'通過任意一個關卡',current:p.passed.length,target:1},
 {id:'world',icon:'🌏',name:'世界探險家',description:'探索全部 20 種題型',current:new Set(a.map(x=>x.topicId)).size,target:20},
 {id:'hundred',icon:'💎',name:'百題寶石',description:'累積完成 100 題',current:a.length,target:100},
 {id:'crown',icon:'👑',name:'冒險王',description:'通過全部 6 個關卡',current:p.passed.length,target:6},
 ].map(b=>({...b,unlocked:b.current>=b.target}))}
export const stories=[
 ['島上的燈塔需要數字能量。一起認識千、百、十、個，點亮回家的路！','你為燈塔補充了數字能量，海上的小船看見方向了！'],
 ['森林裡的路標排錯了！比較大小、整理順序，幫小動物找到回家的路。','森林路標整理好了，小動物們開心地踏上回家的路！'],
 ['規律列車準備出發！找出每一站的數字變化，幫車長鋪好軌道。','軌道一段段接起來，列車載著你的新本領繼續前進！'],
 ['商店街開市囉！幫店長數錢、換鈔和找零，完成今天的採買任務。','商店街的採買任務完成，店長謝謝你的細心幫忙！'],
 ['城堡裡藏著數字寶箱！觀察線索、安排數字卡，找出開鎖的祕密。','你收集了新的數字線索，離城堡的祕密又近了一步！'],
 ['最後的冒險集合了五個地方的智慧。帶著學會的方法，探索新的挑戰！','你的探險日記又多了一頁，每一種方法都是珍貴的寶物！'],
];
