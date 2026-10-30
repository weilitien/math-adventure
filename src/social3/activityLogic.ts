export const proposals=['閱讀分享','合作桌遊','作品交流'];
export function tallyVote(choice:number|null){
 const counts=[4,4,3];
 if(choice!==null&&Number.isInteger(choice)&&choice>=0&&choice<counts.length)counts[choice]++;
 const max=Math.max(...counts);
 return {counts,total:counts.reduce((a,b)=>a+b,0),leaders:counts.flatMap((n,i)=>n===max?[i]:[])};
}
export const resourceTasks=[
 {prompt:'想查一個詞語的意思',choices:['字典','課表','校園平面圖'],answer:'字典',why:'字典能查詞語意思；也可以請教老師並比對例句。'},
 {prompt:'想確認明天有哪些課',choices:['字典','課表','校園平面圖'],answer:'課表',why:'課表記錄課程時間；準備用品時也可查看老師的材料清單。'},
 {prompt:'想找到校園圖書館的位置',choices:['字典','課表','校園平面圖'],answer:'校園平面圖',why:'平面圖呈現校園場所的位置，也可以向師長詢問。'},
];
export const lifeTasks=[
 {unit:2,prompt:'準備家庭聚會，誰適合幫忙整理桌面？',choices:['依能力和時間共同分工','只能由女性整理'],answer:'依能力和時間共同分工',why:'家務可以一起分擔，依能力與時間協調，不以性別限制。'},
 {unit:3,prompt:'朋友不願意讓你公開他的照片，怎麼辦？',choices:['尊重意願，不公開','只要自己喜歡就公開'],answer:'尊重意願，不公開',why:'尊重別人的隱私與選擇，即使是朋友，也要取得同意。'},
];
