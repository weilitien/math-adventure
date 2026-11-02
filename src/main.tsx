import React,{useState,useEffect,lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {resolveCourse,courseUrl,type Course} from './courseSelection';
import './style.css';
import './grade5/style.css';
const ClassicMath=lazy(()=>import('./ClassicMath'));
const GradeFiveApp=lazy(()=>import('./grade5/App'));
const ScienceApp=lazy(()=>import('./science3/App'));
const SocialApp=lazy(()=>import('./social3/App'));
const ChineseApp=lazy(()=>import('./chinese3/App'));
const HanlinApp=lazy(()=>import('./hanlin3/App'));
const HanlinFiveApp=lazy(()=>import('./hanlin5/App'));
class CourseBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<section className="course-loading" role="alert"><h2>課程暫時無法載入</h2><p>請確認網路後重新載入；已儲存的學習紀錄會保留。</p><button onClick={()=>window.location.reload()}>重新載入</button></section>:this.props.children}
}
function MathThreeCourse(){
 const [classic,setClassic]=useState(false);
 return <><div className="grade-switch" aria-label="三年級數學練習模式"><button aria-pressed={!classic} onClick={()=>{if(classic&&window.confirm('切換到翰林單元？已完成紀錄會保留。'))setClassic(false)}}>翰林版三上 · 九大單元</button><button aria-pressed={classic} onClick={()=>{if(!classic&&window.confirm('切換到原本數字冒險？已完成紀錄會保留。'))setClassic(true)}}>原本數字冒險與收藏</button><span>兩種模式紀錄分開保存</span></div>{classic?<ClassicMath/>:<HanlinApp/>}</>;
}
function MathFiveCourse(){
 const [legacy,setLegacy]=useState(false);
 return <><div className="grade-switch" aria-label="五年級數學版本"><button aria-pressed={!legacy} onClick={()=>{if(legacy&&window.confirm('切換到翰林五上？已完成紀錄會保留。'))setLegacy(false)}}>翰林版 · 考試第 1～6 單元</button><button aria-pressed={legacy} onClick={()=>{if(!legacy&&window.confirm('切換到原康軒練習？已完成紀錄會保留。'))setLegacy(true)}}>原康軒練習與紀錄</button><span>兩個版本紀錄分開保存</span></div>{legacy?<GradeFiveApp/>:<HanlinFiveApp/>}</>;
}
function GradeRoot(){
 const [course,setCourse]=useState<Course>(()=>{let saved:string|null=null,legacy:string|null=null;try{saved=localStorage.getItem('math-adventure-selected-course');legacy=localStorage.getItem('math-adventure-selected-grade')}catch{}return resolveCourse(window.location.search,saved,legacy)});
 useEffect(()=>{document.title=course==='chinese3'?'國語小探險家｜康軒三年級上學期':course==='social3'?'社會小探險家｜翰林三年級上學期':course==='science3'?'自然小探險家｜康軒三年級上學期':course==='math5'?'數學冒險王｜翰林版五年級上學期・第1～6單元':'數學冒險王｜翰林版三年級上學期'},[course]);
 const change=(next:Course)=>{if(next===course)return;if(!window.confirm('切換科目會離開目前頁面；已完成題目和學習紀錄會保留。'))return;setCourse(next);try{localStorage.setItem('math-adventure-selected-course',next);if(next==='math3'||next==='math5')localStorage.setItem('math-adventure-selected-grade',next==='math5'?'5':'3')}catch{}window.history.replaceState(null,'',courseUrl(window.location.href,next))};
 return <><div className="grade-switch" aria-label="選擇年級與科目"><strong>我的學習專區</strong><button aria-pressed={course==='math3'} onClick={()=>change('math3')}>三年級數學 · 翰林版</button><button aria-pressed={course==='math5'} onClick={()=>change('math5')}>五年級數學 · 翰林版</button><button aria-pressed={course==='science3'} onClick={()=>change('science3')}>三年級自然 · 康軒</button><button aria-pressed={course==='social3'} onClick={()=>change('social3')}>三年級社會 · 翰林</button><button aria-pressed={course==='chinese3'} onClick={()=>change('chinese3')}>三年級國語 · 康軒</button><span>各科紀錄分開保存</span></div><CourseBoundary key={course}><Suspense fallback={<section className="course-loading" role="status">📚 正在準備這一科的冒險…</section>}>{course==='chinese3'?<ChineseApp/>:course==='social3'?<SocialApp/>:course==='science3'?<ScienceApp/>:course==='math5'?<MathFiveCourse/>:<MathThreeCourse/>}</Suspense></CourseBoundary></>;
}
createRoot(document.getElementById('root')!).render(<GradeRoot/>);
