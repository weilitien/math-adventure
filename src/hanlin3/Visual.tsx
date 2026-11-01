import type {Question} from './questions';
export default function Visual({q}:{q:Question}){
 if(!q.visual)return null;
 if(q.visual==='table')return <div className="table-wrap"><table><caption>圖書角借書紀錄</caption><thead><tr><th scope="col">日期</th><th scope="col">借出本數</th></tr></thead><tbody>{[['星期一',12],['星期二',18],['星期三',15]].map(([d,n])=><tr key={d}><th scope="row">{d}</th><td>{n} 本</td></tr>)}</tbody></table></div>;
 return <svg className="hanlin-visual" viewBox="0 0 500 165" role="img" aria-label={{ruler:'毫米尺，紙條從 12 到 37 毫米',line:'數線每格 10，A 在 30，B 在 50',angles:'同長邊的三個角：A 小於直角，B 為直角，C 大於直角',fraction:'長方形平均分八份，前三份塗色'}[q.visual]}>
 {q.visual==='ruler'&&<><rect x="30" y="70" width="440" height="55" rx="4" fill="#f8e5b6"/><rect x="150" y="38" width="250" height="25" rx="3" fill="#77aab4"/>{Array.from({length:41},(_,i)=><g key={i}><path d={`M${30+i*10} 70v${i%10===0?25:i%5===0?18:10}`} stroke="#4f6355"/>{i%10===0&&<text x={30+i*10} y="115" textAnchor="middle">{i}</text>}</g>)}<text x="150" y="30" textAnchor="middle">12</text><text x="400" y="30" textAnchor="middle">37</text><text x="445" y="150">毫米</text></>}
 {q.visual==='line'&&<><path d="M40 90H460" stroke="#426756" strokeWidth="3"/>{Array.from({length:7},(_,i)=><g key={i}><path d={`M${40+i*65} 80v20`} stroke="#426756" strokeWidth="2"/><text x={40+i*65} y="127" textAnchor="middle">{i===3?'A':i===5?'B':i*10}</text>{(i===3||i===5)&&<circle cx={40+i*65} cy="90" r="6" fill="#d08a60"/>}</g>)}</>}
 {q.visual==='angles'&&<>{[40,200,370].map((x,i)=><g key={x}><path d={`M${x+75} 115H${x}L${x+(i===0?53:i===1?0:-38)} ${i===0?62:i===1?40:50}`} fill="none" stroke={['#be8654','#5b9297','#a67ba0'][i]} strokeWidth="5"/>{i===1&&<path d={`M${x} 99h16v16`} fill="none" stroke="#5b9297"/>}<text x={x+25} y="150" textAnchor="middle">{['A','B','C'][i]}</text></g>)}</>}
 {q.visual==='fraction'&&<>{Array.from({length:8},(_,i)=><rect key={i} x={40+i*52} y="45" width="52" height="70" fill={i<3?'#7daeb4':'#fffdf3'} stroke="#456b62" strokeWidth="2"/>)}<text x="250" y="145" textAnchor="middle">同一個長方形，平均分成 8 份</text></>}
 </svg>;
}
