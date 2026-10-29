export const units = [
  {name:'多位小數與加減', icon:'🔎', desc:'看懂位值、比較大小、對齊小數點', topics:['place','decimalCompare','decimalAdd','decimalSubtract','round','decimalStory']},
  {name:'因數與公因數', icon:'🧩', desc:'找出因數，解開平均分裝的任務', topics:['factors','gcd','packing']},
  {name:'倍數與公倍數', icon:'🚂', desc:'找規律，算出下一次相遇的時刻', topics:['multiple','divisibility','lcm','meeting']},
  {name:'擴分、約分與通分', icon:'🍰', desc:'用不同寫法，認識一樣大的分數', topics:['expand','reduce','fractionCompare','quotient','commonDenominator']},
  {name:'多邊形與扇形', icon:'📐', desc:'選讀：邊長、內角和、扇形與圓心角', topics:['polygon','triangle','triangleAngle','quadAngle','sector']},
];
export const topicNames:Record<string,string> = {
 place:'小數位值',decimalCompare:'小數大小',decimalAdd:'小數加法',decimalSubtract:'小數減法',round:'小數取概數',decimalStory:'小數生活題',
 factors:'找出所有因數',gcd:'最大公因數',packing:'平均分裝',multiple:'倍數',divisibility:'辨認倍數',lcm:'最小公倍數',meeting:'同時發生的問題',
 expand:'擴分',reduce:'約成最簡分數',fractionCompare:'異分母分數大小',quotient:'用分數表示除法',commonDenominator:'通分',
 polygon:'多邊形',triangle:'三角形邊長',triangleAngle:'三角形內角',quadAngle:'四邊形內角',sector:'扇形圓心角',
};
export type Question = {id:string;topic:string;unit:number;prompt:string;kind:'number'|'choice'|'list'|'fraction';answer:string;options?:string[];hints:[string,string];steps:string[];data:number[];visual?:'place'|'fraction'|'triangle'|'quad'|'sector';reduced?:boolean};
export function gcd(a:number,b:number):number {while(b){[a,b]=[b,a%b]}return a}
export const lcm=(a:number,b:number)=>a/gcd(a,b)*b;
export const factors=(n:number)=>Array.from({length:n},(_,i)=>i+1).filter(i=>n%i===0);
export function decimal(n:number,places=3){const digits=String(n).padStart(places+1,'0');return digits.slice(0,-places)+'.'+digits.slice(-places)}
export function normalize(s:string){return s.normalize('NFKC').trim().replace(/／/g,'/')}
// Exact decimal/fraction comparison: do not round floating-point answers.
export function rational(s:string):[bigint,bigint]|null {
 const text=normalize(s);if(text.length>80)return null;
 if(/^\d+\s*\/\s*\d+$/.test(text)){const [a,b]=text.split('/').map(x=>BigInt(x.trim()));return b>0n?[a,b]:null}
 if(!/^\d+(\.\d+)?$/.test(text))return null;
 const [a,b='']=text.split('.');return [BigInt(a+b),10n**BigInt(b.length)];
}
export function validate(q:Question,raw:string){
 const text=normalize(raw);if(!text)return false;
 if(q.kind==='choice')return text===q.answer;
 if(q.kind==='list'){
  if(!/^\d+(?:[\s,，、]+\d+)*$/.test(text))return false;
  const values=text.split(/[\s,，、]+/).map(Number),expected=q.answer.split('、').map(Number);
  return new Set(values).size===values.length&&values.length===expected.length&&expected.every(n=>values.includes(n));
 }
 if(q.kind==='fraction'&&!/^\d+\s*\/\s*\d+$/.test(text))return false;
 if(q.kind==='number'&&text.includes('/'))return false;
 const actual=rational(text),expected=rational(q.answer);if(!actual||!expected)return false;
 if(q.reduced){let [a,b]=actual;while(b)[a,b]=[b,a%b];if(a!==1n)return false}
 return actual[0]*expected[1]===expected[0]*actual[1];
}
export function generate(topic:string,rng:()=>number=Math.random):Question {
 const r=(a:number,b:number)=>a+Math.floor(rng()*(b-a+1));
 const unit=units.findIndex(u=>u.topics.includes(topic));if(unit<0)throw new Error('未知題型');
 let prompt='',answer='',kind:Question['kind']='number',options:string[]|undefined,data:number[]=[],visual:Question['visual'],reduced=false;
 let hints:Question['hints']=['先圈出題目提供的數字，想想要求的是什麼。','把已知條件分成小步驟，再一步一步計算。'],steps:string[]=[];
 switch(topic){
  case 'place':{const n=r(10001,999999),p=r(1,3),digits=decimal(n);data=[n,p];prompt=`${digits} 的${['','十分','百分','千分'][p]}位數字是多少？`;answer=String(Math.floor(n/10**(3-p))%10);visual='place';hints=['小數點右邊第一位是十分位。',`從小數點往右數第 ${p} 個位置，不要跳過 0。`];steps=[`小數點右邊依序是十分位、百分位、千分位。`,`${digits} 的${['','十分','百分','千分'][p]}位數字是 ${answer}。`];break}
  case 'decimalCompare':{const a=r(1,99999),b=r(0,3)===0?a:r(1,99999);data=[a,b];prompt=`${decimal(a)} □ ${decimal(b)}，選出正確符號。`;answer=a>b?'>':a<b?'<':'=';kind='choice';options=['>','<','='];hints=['先比較整數部分，再依序比較十分位、百分位、千分位。','把小數點對齊；從左到右找到第一個不一樣的位數。'];steps=[`${decimal(a)} 有 ${a} 個 0.001；${decimal(b)} 有 ${b} 個 0.001。`,`${decimal(a)} ${answer} ${decimal(b)}`];break}
  case 'decimalAdd':case 'decimalSubtract':case 'decimalStory':{let a=r(1001,99999),b=r(101,99999);const add=topic==='decimalAdd';if(!add&&a<b)[a,b]=[b,a];data=[a,b,add?1:0];prompt=topic==='decimalStory'?`一條緞帶長 ${decimal(a)} 公尺，剪下 ${decimal(b)} 公尺後，還剩多少公尺？`:`${decimal(a)} ${add?'＋':'−'} ${decimal(b)} ＝？`;answer=decimal(add?a+b:a-b);hints=['小數點對齊，相同位值才能相加減。',`可以把兩個數都看成「幾個 0.001」，先算 ${a} ${add?'＋':'−'} ${b}，再換回小數。`];steps=[`將兩個數都乘以 1000：${a} 和 ${b}。`,`${a} ${add?'＋':'−'} ${b} = ${add?a+b:a-b}。`,`換回原來單位，答案是 ${answer}。`];break}
  case 'round':{const n=r(1001,999999),p=r(1,2),factor=10**(3-p);data=[n,p];prompt=`把 ${decimal(n)} 四捨五入到${p===1?'十分位（小數第 1 位）':'百分位（小數第 2 位）'}。`;answer=decimal(Math.floor((n+factor/2)/factor)*factor);hints=['找到要保留的位數，再看它右邊一位。','下一位是 0～4 就捨去，5～9 就進 1；必要時連續進位。'];steps=[`要保留小數 ${p} 位，觀察第 ${p+1} 位。`,`下一位數字是 ${Math.floor(n/(factor/10))%10}。`,`四捨五入後是 ${Number(answer)}。`];break}
  case 'factors':{const n=r(6,72);data=[n];kind='list';prompt=`找出 ${n} 的所有正因數，用「、」分隔（順序不限）。`;answer=factors(n).join('、');hints=['能把這個數整除的正整數，就是它的因數。',`從 1 開始找相乘等於 ${n} 的整數配對，記得包含 1 和自己。`];steps=[`檢查哪些正整數可以整除 ${n}。`,`所有因數：${answer}。`];break}
  case 'gcd':case 'packing':{const common=r(2,9),a=common*r(2,9),b=common*r(2,9);data=[a,b];answer=String(gcd(a,b));prompt=topic==='packing'?`有 ${a} 張星星貼紙和 ${b} 張花朵貼紙，要全部平均分成相同的禮物包，每包兩種貼紙的數量都一樣，最多能分成幾包？`:`${a} 和 ${b} 的最大公因數是多少？`;hints=['找出兩個數共同的因數。','先分別列出因數，再從共同出現的數裡選最大的。'];steps=[`${a} 的因數：${factors(a).join('、')}。`,`${b} 的因數：${factors(b).join('、')}。`,`最大的共同因數是 ${answer}${topic==='packing'?'，所以最多分成 '+answer+' 包':''}。`];break}
  case 'multiple':{const a=r(3,25),k=r(2,12);data=[a,k];prompt=`從 ${a} 開始，${a} 的第 ${k} 個正倍數是多少？`;answer=String(a*k);hints=['正倍數從原數的 1 倍開始，不包含 0。',`第 ${k} 個正倍數就是把 ${a} 乘以 ${k}。`];steps=[`${a} 的正倍數是 ${a}、${a*2}、${a*3}……`,`${a} × ${k} = ${answer}。`];break}
  case 'divisibility':{const n=r(100,9999),d=[2,5,10][r(0,2)];data=[n,d];prompt=`${n} 是 ${d} 的倍數嗎？`;answer=n%d===0?'是':'不是';kind='choice';options=['是','不是'];hints=['先觀察個位數，不一定要做完整除法。',`2 的倍數個位是 0、2、4、6、8；5 的倍數個位是 0 或 5；10 的倍數個位是 0。`];steps=[`${n} 的個位數是 ${n%10}。`,`${n} ÷ ${d} 的餘數是 ${n%d}，所以${answer} ${d} 的倍數。`];break}
  case 'lcm':case 'meeting':{const a=r(2,12),b=r(2,12);data=[a,b];answer=String(lcm(a,b));prompt=topic==='meeting'?`紅燈每 ${a} 秒閃一次，藍燈每 ${b} 秒閃一次。現在同時閃亮，至少再過幾秒會再次同時閃亮？`:`${a} 和 ${b} 的最小公倍數是多少？`;hints=['找兩個數共同的正倍數，不把 0 算進去。','分別列出正倍數，找第一個共同出現的數。'];steps=[`${a} 的正倍數：${Array.from({length:lcm(a,b)/a},(_,i)=>a*(i+1)).join('、')}。`,`${b} 的正倍數：${Array.from({length:lcm(a,b)/b},(_,i)=>b*(i+1)).join('、')}。`,`最小公倍數是 ${answer}${topic==='meeting'?'，所以再過 '+answer+' 秒同時閃亮':''}。`];break}
  case 'expand':{const d=r(3,12),n=r(1,d-1),k=r(2,6);data=[n,d,k];prompt=`擴分：${n}/${d} = □/${d*k}。空格的分子是多少？`;answer=String(n*k);visual='fraction';hints=['擴分時，分子和分母要乘上同一個數。',`分母從 ${d} 變成 ${d*k}，先算它乘了幾倍。`];steps=[`${d*k} ÷ ${d} = ${k}。`,`分子也乘 ${k}：${n} × ${k} = ${answer}。`,`${n}/${d} = ${answer}/${d*k}。`];break}
  case 'reduce':{const baseD=r(3,12),baseN=r(1,baseD-1),k=r(2,6),n=baseN*k,d=baseD*k,g=gcd(n,d);data=[n,d];prompt=`把 ${n}/${d} 約成最簡分數。請用「分子/分母」輸入。`;answer=`${n/g}/${d/g}`;kind='fraction';reduced=true;hints=['約分時，分子、分母要除以同一個公因數。','找出分子與分母的最大公因數，兩者都除以它。'];steps=[`${n} 和 ${d} 的最大公因數是 ${g}。`,`${n} ÷ ${g} = ${n/g}；${d} ÷ ${g} = ${d/g}。`,`最簡分數是 ${answer}。`];break}
  case 'fractionCompare':{const b=r(2,9),d=r(2,9),a=r(1,b),c=r(1,d),den=lcm(b,d);data=[a,b,c,d];prompt=`${a}/${b} □ ${c}/${d}，選出正確符號。`;answer=a*d>c*b?'>':a*d<c*b?'<':'=';kind='choice';options=['>','<','='];visual='fraction';hints=['分母不同時，先通分，不能只比較分子。',`可以用 ${b} 和 ${d} 的公倍數作為共同分母。`];steps=[`共同分母可用 ${den}。`,`${a}/${b} = ${a*den/b}/${den}；${c}/${d} = ${c*den/d}/${den}。`,`所以 ${a}/${b} ${answer} ${c}/${d}。`];break}
  case 'quotient':{const n=r(2,15),d=r(2,9),g=gcd(n,d);data=[n,d];prompt=`把 ${n} 公升果汁平均分到 ${d} 個水壺，每壺幾公升？請用「分子/分母」表示。`;answer=`${n/g}/${d/g}`;kind='fraction';hints=['平均分用除法，答案可以是分數。','被除數放分子，除數放分母；等值分數也可以。'];steps=[`${n} ÷ ${d} = ${n}/${d}。`,`約分後為 ${answer} 公升。`];break}
  case 'commonDenominator':{const b=r(2,9),d=r(2,9),a=r(1,b),c=r(1,d),den=lcm(b,d);data=[a,b,c,d,den];prompt=`將 ${a}/${b} 和 ${c}/${d} 通分成分母 ${den}。第一個分數 ${a}/${b} 通分後的分子是多少？`;answer=String(a*den/b);hints=['找出第一個分數的分母要乘幾倍。',`用 ${den} ÷ ${b} 求倍數，分子也乘同樣的倍數。`];steps=[`${den} ÷ ${b} = ${den/b}。`,`${a} × ${den/b} = ${answer}。`,`${a}/${b} = ${answer}/${den}。`];break}
  case 'polygon':{const n=r(3,24);data=[n];prompt=`一個多邊形有 ${n} 條邊，它有幾個頂點？`;answer=String(n);hints=['多邊形的邊首尾相接，每兩條相鄰邊交會在一個頂點。','沿著邊走一圈，每走過一條邊就到達下一個頂點。'];steps=[`${n} 邊形有 ${n} 條邊，也有 ${n} 個頂點。`];break}
  case 'triangle':{const a=r(2,15),b=r(2,15),c=r(2,25);data=[a,b,c];prompt=`長度 ${a}、${b}、${c} 公分的三根棒子，可以圍成三角形嗎？`;answer=a+b>c&&a+c>b&&b+c>a?'可以':'不可以';kind='choice';options=['可以','不可以'];hints=['三角形任意兩邊長的和，要大於第三邊。','先把最短兩邊相加，看看是否「大於」最長邊；相等也不行。'];const sorted=[a,b,c].sort((a,b)=>a-b);steps=[`最短兩邊之和：${sorted[0]} + ${sorted[1]} = ${sorted[0]+sorted[1]}。`,`最長邊是 ${sorted[2]}。`,`所以${answer}圍成三角形。`];break}
  case 'triangleAngle':{const a=r(3,12)*5,b=r(3,12)*5;data=[a,b];prompt=`三角形的兩個內角是 ${a}°、${b}°，第三個內角是幾度？`;answer=String(180-a-b);visual='triangle';hints=['三角形的內角和是 180°。',`先算 ${a} + ${b}，再用 180 減去這個和。`];steps=[`${a} + ${b} = ${a+b}。`,`180 − ${a+b} = ${answer}°。`];break}
  case 'quadAngle':{const a=r(14,20)*5,b=r(14,20)*5,c=r(14,20)*5;data=[a,b,c];prompt=`四邊形的三個內角是 ${a}°、${b}°、${c}°，第四個內角是幾度？`;answer=String(360-a-b-c);visual='quad';hints=['四邊形可以分成兩個三角形，內角和是 360°。','把已知的三個角加起來，再從 360° 扣掉。'];steps=[`${a} + ${b} + ${c} = ${a+b+c}。`,`360 − ${a+b+c} = ${answer}°。`];break}
  case 'sector':{const d=[3,4,5,6,8,9,10,12][r(0,7)],n=r(1,d-1);data=[n,d];prompt=`一個圓平均分成 ${d} 等份，取其中連續的 ${n} 份，扇形的圓心角是幾度？`;answer=String(360/d*n);visual='sector';hints=['一個完整圓的圓心角是 360°。',`先算 360 ÷ ${d}，再乘上 ${n}。`];steps=[`每份的圓心角：360 ÷ ${d} = ${360/d}°。`,`${360/d} × ${n} = ${answer}°。`];break}
 }
 return {id:`G5:${topic}:${data.join(':')}`,topic,unit,prompt,kind,answer,options,hints,steps,data,visual,reduced};
}
export function buildRound(selectedUnits:number[],count=20,pool?:string[],rng:()=>number=Math.random){
 const topics=pool?.length?pool:units.flatMap((u,i)=>selectedUnits.includes(i)?u.topics:[]);
 if(!topics.length)throw new Error('請至少選擇一個單元');
 const shuffled=[...topics];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
 const ordered:string[]=[],buckets=units.map(u=>shuffled.filter(t=>u.topics.includes(t)));
 while(buckets.some(b=>b.length)){for(const bucket of buckets){const t=bucket.shift();if(t)ordered.push(t)}}
 const seen=new Set<string>(),questions:Question[]=[];
 for(let i=0;i<count;i++){let q:Question|undefined;for(let j=0;j<1000;j++){const candidate=generate(ordered[i%ordered.length],rng);if(!seen.has(candidate.id)){q=candidate;break}}if(!q)throw new Error('這個題型的不同題目暫時用完，請重新開始');seen.add(q.id);questions.push(q)}return questions;
}
