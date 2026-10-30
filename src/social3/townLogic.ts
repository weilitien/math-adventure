export type StoryStep={line:string;choices:{text:string;reply:string;ok:boolean}[]};
export type Story={id:string;unit:number;place:string;icon:string;friend:string;avatar:string;title:string;intro:string;ending:string;reward:string;steps:StoryStep[]};
const step=(line:string,good:string,reply:string,other:string,retry:string):StoryStep=>({line,choices:[{text:other,reply:retry,ok:false},{text:good,reply,ok:true}]});
export const stories:Story[]=[
 {id:'library',unit:0,place:'圖書館',icon:'📚',friend:'小鹿米米',avatar:'🦌',title:'找不到的那本書',intro:'米米想做樹木小報告，卻在書架前迷路了。一起找出學習的好方法！',ending:'我們找到資料，也做了分類標籤！教室的閱讀角變整齊了。',reward:'閱讀地毯',steps:[
 step('好多書喔！我要介紹校園的樹，應該從哪裡開始？','先寫下想知道的樹木問題','對！先有問題，找資料才有方向。','把最厚的書全部搬走','書的厚度不一定符合需要。我們先想想要找什麼。'),
 step('我想知道葉片的形狀，可以找誰或什麼來幫忙？','找植物圖鑑，也請館員協助','找到合適資源了！還能和實際觀察比對。','把自己的猜測都寫成事實','猜測可以是起點，但還需要查證。我們找找資料吧。'),
 step('報告完成啦！借來的書要怎麼處理？','依圖書館規則歸還，方便大家再借','謝謝你！書回到該去的位置，下一位也找得到。','藏進自己的抽屜，下次比較方便','別人也需要借書，我們想個大家都方便的方法。')]},
 {id:'meeting',unit:1,place:'班級教室',icon:'🏫',friend:'小熊阿布',avatar:'🐻',title:'我們的班會時間',intro:'大家想改造教室角落，卻有不同想法。幫阿布主持一次友善的班會。',ending:'大家的意見被聽見了！我們一起掛上班級合作旗。',reward:'合作彩旗',steps:[
 step('有人想設閱讀角，有人想放桌遊。我該先聽誰？','讓不同方案輪流說明理由','好！先了解需要，也確認時間、空間和材料。','只讓我的好朋友發言','其他人也有想法。怎麼讓每個人都有表達機會呢？'),
 step('大家約好每人一票，我可以替朋友再投嗎？','不代投，遵守每人一票的約定','公平的一票，才能表達每個參與者的選擇。','可以，只要沒人發現','這樣會多出一票。我們再想想原本的約定。'),
 step('閱讀角入選了，喜歡桌遊的同學有點失望。','聽聽他們的感受，討論未來的安排','我們可以照決定合作，也尊重不同的想法。','叫他們閉嘴，不准再說話','投票後也要尊重他人。可以怎麼回應失望的朋友呢？')]},
 {id:'home',unit:2,place:'暖暖的家',icon:'🏡',friend:'小兔朵朵',avatar:'🐰',title:'一起準備分享日',intro:'朵朵想邀家人參加作品分享日。時間不多，怎樣分工才合適？',ending:'我們一起完成準備，也記得感謝家人的幫忙！獲得一盆暖心小花。',reward:'窗邊盆栽',steps:[
 step('桌面還沒整理，作品也還沒擺好，怎麼分工？','依每個人的能力與時間一起討論','每個人能做的事不同，一起商量就有幫手。','全部交給媽媽，其他人不用做','家事可以共同分擔，不是某一個人的固定工作。'),
 step('這個櫃子好重，我想自己搬開。','先請大人協助，改做能安全完成的事','我可以先整理自己的作品，不用勉強搬重物。','不管多重都自己搬','分擔也要注意安全。我們找適合自己能力的工作吧。'),
 step('活動結束，客廳留下好多材料！','一起整理，向幫忙的家人道謝','善後也是活動的一部分，謝謝大家的合作！','直接離開，留給別人整理','還有最後一步呢！大家使用的空間可以怎麼恢復？')]},
 {id:'park',unit:3,place:'友善公園',icon:'🌳',friend:'小貓可可',avatar:'🐱',title:'照片分享之前',intro:'可可拍了朋友的活動照片，想放上網。一起練習尊重別人的選擇。',ending:'朋友放心地笑了！尊重別人的意願，是讓大家安心的魔法。',reward:'友善牆畫',steps:[
 step('這張照片有朋友入鏡，可以直接放到公開網頁嗎？','先說明用途，詢問朋友意願','拍到照片，不代表已經得到分享的同意。','照片在我的手機裡，當然可以','照片中的人也有選擇的權利。我們先問問看。'),
 step('朋友說不希望公開，我該怎麼辦？','尊重意願，不公開這張照片','謝謝你尊重我的選擇！我們還是好朋友。','偷偷發布，不告訴朋友','偷偷分享仍然沒有取得同意。再想想朋友說的話。'),
 step('另一位朋友同意分享，但照片裡露出了他的住址。','先處理私人資訊，再確認分享範圍','同意分享後，也要留意個人資訊與約定的範圍。','既然同意，就不用管住址','住址是私人資訊。我們再檢查一次，必要時請大人幫忙。')]},
];
export type TownState={steps:Record<string,number>;decor:Record<string,string>};
export const emptyTown=():TownState=>({steps:{},decor:{}});
export function parseTown(raw:unknown):TownState{const p=raw as Partial<TownState>|null;const next=emptyTown();for(const s of stories){const n=p?.steps?.[s.id];if(typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=s.steps.length)next.steps[s.id]=n;if(n===s.steps.length&&['sun','sea'].includes(p?.decor?.[s.id]??''))next.decor[s.id]=p!.decor![s.id]}return next}
export const completed=(t:TownState,id:string)=>{const s=stories.find(s=>s.id===id);return !!s&&t.steps[id]===s.steps.length};
export function advance(t:TownState,id:string,index:number,choice:number):TownState{const s=stories.find(s=>s.id===id);if(!s||index!==(t.steps[id]??0)||!s.steps[index]?.choices[choice]?.ok)return t;return {...t,steps:{...t.steps,[id]:index+1}}}
export function decorate(t:TownState,id:string,color:string):TownState{if(!completed(t,id)||!['sun','sea','none'].includes(color))return t;const decor={...t.decor};if(color==='none')delete decor[id];else decor[id]=color;return {...t,decor}}
