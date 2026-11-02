export function swapCards(items:readonly string[],from:number,to:number):string[]{
 const next=[...items];if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=next.length||to>=next.length)return next;
 [next[from],next[to]]=[next[to],next[from]];return next;
}
export function toggleAnswer(items:readonly string[],option:string,multiple:boolean):string[]{return multiple?(items.includes(option)?items.filter(x=>x!==option):[...items,option]):[option]}
export const companions=[{icon:'🦉',name:'點點',tip:'先看橫軸與縱軸，點選日期看看數值。'},{icon:'🦊',name:'阿栗',tip:'找找哪些數可以整除，把條件一個個核對。'},{icon:'🐰',name:'朵朵',tip:'圈出角度、邊長和平行關係，圖形會給你線索。'},{icon:'🐻',name:'阿布',tip:'先想是平均分裝，還是再次同時發生？'},{icon:'🐱',name:'米米',tip:'把面、邊和頂點分開數，別漏了背面的部分。'},{icon:'🐿️',name:'小果',tip:'有括號先算括號，再乘除、後加減；同級從左到右。'}];
