export const units=[
 {name:'字的小旅行',icon:'✉️',desc:'第 1 課延伸：文字傳意、讀懂訊息'},
 {name:'妙故事點點名',icon:'📖',desc:'第 2 課延伸：人物、事件與故事順序'},
 {name:'繞口令村',icon:'👄',desc:'第 3 課延伸：相近字音、詞語與語句'},
 {name:'小丑魚和海葵',icon:'🐠',desc:'第 4 課延伸：合作主題、因果與閱讀'},
 {name:'飛舞的絲帶',icon:'🎀',desc:'第 5 課延伸：動作描寫與譬喻'},
 {name:'小女生',icon:'🌻',desc:'第 6 課延伸：人物心情與友善表達'},
];
export type Question={id:string;unit:number;topic:string;prompt:string;kind:'choice'|'multi'|'order';options:string[];answer:string[];hints:[string,string];steps:string[];passage?:string};
const bank:Question[]=[];
function add(unit:number,id:string,topic:string,prompt:string,options:string[],correct:number[],hint:string,explanation:string,kind:Question['kind']='choice',passage?:string){bank.push({id:`C3:${unit}:${id}`,unit,topic,prompt,options,answer:correct.map(i=>options[i]),kind,hints:[hint,'回到題目或短文找線索，再逐一比較選項。'],steps:[explanation],passage})}
// Lesson titles transcribed from the user's contents photo. All passages and exercises below are original, not textbook text or prescribed vocabulary.
const letter='星期一，小禾在桌上發現一張紙條：「放學後，請到圖書館找我，一起完成海報。小安留。」小禾把紙條放進聯絡簿，提醒自己別忘了約定。';
add(0,'where','閱讀找線索','小安約小禾在哪裡見面？',['圖書館','操場','餐廳'],[0],'找紙條中的地點。','紙條寫著「請到圖書館找我」，所以約定地點是圖書館。','choice',letter);
add(0,'why','閱讀找線索','小禾把紙條放進聯絡簿，主要為了什麼？',['提醒自己記得約定','把紙條送給老師','拿來摺紙飛機'],[0],'看短文最後一句。','最後一句說明了保存紙條的目的：提醒自己別忘了約定。','choice',letter);
add(0,'message','閱讀找線索','紙條中有哪些已說明的資訊？（全選）',['見面時間是放學後','見面地點是圖書館','要一起完成海報','海報一定要用紅色筆寫'],[0,1,2],'只選短文明確提到的內容。','紙條有時間、地點與目的，沒有指定筆的顏色。','multi',letter);
add(0,'word','詞語練習','「小禾提醒自己別忘了約定。」其中「提醒」最接近哪個意思？',['讓自己注意並記得','故意把事情弄錯','把東西藏得更深'],[0],'想想提醒能幫忙避免什麼。','提醒是使人注意或記起某件事。');
add(0,'punctuation','標點練習','小安想詢問：「你明天有空嗎」句尾適合加哪個標點？',['？','。','，'],[0],'這句話是在詢問。','詢問的句子通常在句尾使用問號。');
add(0,'order','句子重組','依「時間 → 人物 → 動作 → 目的」排成一句通順的話。',['放學後，','小禾','走進圖書館，','準備和小安一起做海報。'],[0,1,2,3],'先交代時間，再說誰做了什麼。','放學後，小禾走進圖書館，準備和小安一起做海報。','order');
const story='小松鼠想把一籃果子送給奶奶。走到橋邊時，籃子的提把斷了。小兔找來繩子，和小松鼠一起修好提把。最後，他們帶著果子，平安到達奶奶家。';
add(1,'person','故事要素','誰找來繩子幫忙？',['小兔','奶奶','小鳥'],[0],'找「找來繩子」前面的人物。','短文明確寫出小兔找來繩子。','choice',story);
add(1,'problem','故事要素','故事中遇到的主要問題是什麼？',['籃子的提把斷了','果子全部吃完了','奶奶搬家了'],[0],'找主角在路上遇到的困難。','提把斷了，讓小松鼠無法順利提著籃子，因此需要修理。','choice',story);
add(1,'ending','故事要素','哪一句最適合概括故事的結果？',['他們修好籃子，把果子送到奶奶家','他們放棄送果子，各自回家','小兔拿走所有果子'],[0],'看故事最後發生什麼事。','最後兩人帶著果子到達奶奶家，完成送果子的目的。','choice',story);
add(1,'true','故事要素','哪些內容符合短文？（全選）',['小松鼠要送果子給奶奶','小兔和小松鼠一起修提把','提把在出門前就已修好','他們最後到了奶奶家'],[0,1,3],'分清楚出發、困難、解決和結果。','提把是在走到橋邊時斷掉，之後才一起修好。','multi',story);
add(1,'word','詞語練習','「平安到達」的「平安」最接近哪個意思？',['安全，沒有遭遇危險','速度非常快','聲音特別大'],[0],'平安關心的是安全情形。','平安表示安全、沒有事故，並不表示一定很快。');
add(1,'order','故事排序','依短文內容排列事件。',['小松鼠帶果子出發','走到橋邊，籃子提把斷了','小兔找來繩子，一起修好','兩人帶果子到奶奶家'],[0,1,2,3],'先出發，再遇到困難、解決問題、到達。','依序是出發、提把斷掉、修好提把、到達奶奶家。','order',story);
const rhyme='藍籃裝梨，綠籃裝李。小莉提藍籃，小力提綠籃。兩人先慢慢讀，再輪流加快，遇到讀不清楚的地方就停下來練習。';
add(2,'basket','閱讀找線索','原創短文中的藍籃裝了什麼？',['梨','李','桃'],[0],'找第一句的配對。','第一句寫「藍籃裝梨」。','choice',rhyme);
add(2,'method','閱讀找線索','兩人讀不清楚時怎麼做？',['停下來練習','一直比誰喊得大聲','立刻放棄'],[0],'看短文最後一部分。','短文說遇到讀不清楚的地方，就停下來練習。','choice',rhyme);
add(2,'sound','字音辨識','「藍色」的「藍」和「竹籃」的「籃」，注音有什麼關係？',['都讀 ㄌㄢˊ','都讀 ㄋㄢˊ','一個讀 ㄌㄢˊ，一個讀 ㄌㄧˊ'],[0],'兩個字不同，但讀音相同。','藍與籃都讀 ㄌㄢˊ；字形和意思不同。');
add(2,'word','字詞辨識','要表示裝東西的竹製容器，應填哪個字？「竹（　）」',['籃','藍','蘭'],[0],'想想竹製容器的字有哪些部件。','竹籃的籃有竹字頭；藍常表示顏色。');
add(2,'practice','閱讀找線索','哪些是短文提到的練習方法？（全選）',['先慢慢讀','輪流加快','讀不清楚時停下來練習','從頭到尾只比音量'],[0,1,2],'找出文中的動作，不加上自己的猜測。','短文提到慢讀、輪流加快、停下練習，沒有比音量。','multi',rhyme);
add(2,'order','句子重組','依「先 → 再 → 最後」排列這次朗讀練習。',['先看清楚每個字，','再慢慢讀出句子，','最後練習讀得清楚又流暢。'],[0,1,2],'留意表示順序的詞。','先、再、最後能幫助讀者知道步驟順序。','order');
const team='班上要做海洋海報。小晴擅長畫圖，小宇擅長整理資料。他們先討論分工，再各自準備。小宇發現說明少了一句，便請小晴一起補上。完成後，兩人都說：「一起做，想法更多！」';
add(3,'skill','閱讀找線索','小宇擅長什麼？',['整理資料','畫圖','游泳'],[0],'找出小宇的專長。','文中明說小宇擅長整理資料。','choice',team);
add(3,'reason','因果理解','小宇為什麼請小晴一起補上說明？',['因為發現說明少了一句','因為海報已經丟掉','因為不想做海報'],[0],'找出請求幫忙之前的發現。','小宇發現說明有缺漏，所以邀小晴一起補上。','choice',team);
add(3,'title','段落大意','哪個標題最適合這篇原創短文？',['合作完成海洋海報','一個人的游泳比賽','神祕的午餐'],[0],'標題要能涵蓋主要事件。','短文主要寫兩人分工合作完成海報。','choice',team);
add(3,'actions','閱讀找線索','哪些事情在短文中發生了？（全選）',['兩人先討論分工','小宇發現說明少了一句','兩人合作完成海報','小晴把海報藏起來'],[0,1,2],'依短文確認每個選項。','討論、發現缺漏、合作完成都有提到，沒有藏起海報。','multi',team);
add(3,'because','句型練習','「（　）大家互相幫忙，所以工作順利完成。」應填哪個詞？',['因為','雖然','如果'],[0],'這裡是在說明已發生事情的原因和結果。','因為……所以……可以連結原因與結果。');
add(3,'order','句子重組','依「因為 → 原因 → 所以 → 結果」排序。',['因為','大家願意互相幫忙，','所以','海報順利完成了。'],[0,1,2,3],'先說原因，再說結果。','因為大家願意互相幫忙，所以海報順利完成了。','order');
const ribbon='操場上，小恩握著彩帶練習。她輕輕轉動手腕，彩帶在空中畫出圓圈，像一道彎彎的彩虹。風忽然變大，彩帶纏在一起。小恩停下來解開，再慢慢試一次。';
add(4,'action','動作描寫','小恩做了哪個動作，讓彩帶畫出圓圈？',['輕輕轉動手腕','用力跺腳','坐在地上'],[0],'找圓圈出現之前的動作。','她輕輕轉動手腕，彩帶便在空中畫出圓圈。','choice',ribbon);
add(4,'compare','譬喻練習','短文把空中的彩帶比作什麼？',['彎彎的彩虹','安靜的石頭','厚厚的書本'],[0],'找「像」後面的詞語。','「像一道彎彎的彩虹」用彩虹描寫彩帶的樣子。','choice',ribbon);
add(4,'response','閱讀找線索','彩帶纏住後，小恩怎麼做？',['停下解開，再試一次','丟掉彩帶回家','叫別人不准練習'],[0],'讀短文最後一句。','她先停下來解開彩帶，再慢慢試一次。','choice',ribbon);
add(4,'verbs','詞語練習','哪些詞語表示動作？（全選）',['轉動','握著','解開','彎彎的'],[0,1,2],'動作能回答「做什麼」。','轉動、握著、解開表示動作；彎彎的描寫形狀。','multi');
add(4,'describe','描寫練習','哪一句同時寫出了動作和動作的樣子？',['她輕輕轉動手腕。','她有一條彩帶。','今天是星期三。'],[0],'找出「怎麼做」和「做什麼」。','輕輕描寫轉動的方式，讓動作更具體。');
add(4,'order','故事排序','依短文排列小恩練習的經過。',['轉動手腕，彩帶畫出圓圈','風變大，彩帶纏在一起','停下來解開彩帶','再慢慢試一次'],[0,1,2,3],'從順利練習，到遇到問題，再處理問題。','文中的順序是轉動、纏住、解開、再試。','order',ribbon);
const friend='新同學小芸站在教室門口，低著頭，不知道要坐哪裡。小青走過去說：「我帶你找座位，好嗎？」小芸點點頭，輕聲說謝謝。下課時，小芸主動邀小青一起看書，臉上露出了笑容。';
add(5,'begin','人物心情','從「低著頭，不知道要坐哪裡」推想，小芸一開始可能有什麼感受？',['有些不安、不知所措','已經非常熟悉教室','對所有同學很生氣'],[0],'用動作與當時情境推想，不要加入沒有的情節。','身處不熟悉的教室，不知道座位，可能感到不安；這是根據線索的推想。','choice',friend);
add(5,'help','閱讀找線索','小青如何幫助小芸？',['詢問是否需要帶她找座位','替她把書全部丟掉','要求她立刻表演'],[0],'找小青說的話。','小青先詢問，再提供帶路的協助。','choice',friend);
add(5,'change','人物心情','哪個線索最能看出小芸後來比較自在？',['主動邀小青看書，露出笑容','一直站在門口低頭','不讓任何人接近'],[0],'找短文後半段的行為。','主動邀請與笑容，都是她較放鬆、願意互動的線索。','choice',friend);
add(5,'facts','閱讀找線索','哪些是短文明確寫出的事情？（全選）',['小芸是新同學','小青願意帶小芸找座位','小芸下課邀小青看書','小芸最喜歡的顏色是藍色'],[0,1,2],'區分文中資訊與額外猜測。','前三項都能在文中找到，沒有提到喜歡的顏色。','multi',friend);
add(5,'polite','句子表達','想詢問新同學是否需要幫忙，哪句話最合適？',['需要我陪你找教室嗎？','你怎麼連教室都找不到！','不准問任何問題！'],[0],'詢問要表達協助，也留給對方選擇。','用詢問的方式提出協助，比責備或命令更友善。');
add(5,'order','句子重組','依「人物 → 動作 → 說話內容」重組句子。',['小青','走到門口，','輕聲問：','「需要我幫忙嗎？」'],[0,1,2,3],'先交代誰，再接動作和話語。','小青走到門口，輕聲問：「需要我幫忙嗎？」','order');
export const questions:readonly Question[]=bank;
export const topicNames=Object.fromEntries([...new Set(bank.map(q=>q.topic))].map(t=>[t,t]));
export function shuffle<T>(items:readonly T[],rng:()=>number=Math.random):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function prepare(q:Question,rng:()=>number=Math.random):Question {let options=shuffle(q.options,rng);if(q.kind==='order'&&options.every((o,i)=>o===q.answer[i]))options=[...options.slice(1),options[0]];return {...q,options,answer:[...q.answer],hints:[...q.hints],steps:[...q.steps]}}
export function validate(q:Question,answer:string[]):boolean {if(!answer.length||new Set(answer).size!==answer.length||answer.length!==q.answer.length)return false;return q.kind==='order'?answer.every((a,i)=>a===q.answer[i]):q.answer.every(a=>answer.includes(a))}
export function buildRound(selected:number[],count=20,pool?:string[],rng:()=>number=Math.random):Question[]{
 const filtered=bank.filter(q=>selected.includes(q.unit)&&(!pool?.length||pool.includes(q.topic)));
 if(!filtered.length)throw new Error('請先勾選至少一個有題目的單元。');
 const buckets=shuffle(units.map((_,i)=>shuffle(filtered.filter(q=>q.unit===i),rng)),rng),result:Question[]=[];
 while(result.length<Math.min(count,filtered.length)){for(const bucket of buckets){const q=bucket.pop();if(q&&result.length<count)result.push(prepare(q,rng))}}
 return result;
}
