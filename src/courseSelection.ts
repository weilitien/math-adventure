export type Course='math3'|'math5'|'science3';
export function resolveCourse(search:string,saved:string|null,legacyGrade:string|null):Course {
 const params=new URLSearchParams(search);
 if(params.get('subject')==='science')return 'science3';
 if(params.get('grade')==='5')return 'math5';
 if(params.get('grade')==='3'||params.get('subject')==='math')return 'math3';
 if(saved==='math3'||saved==='math5'||saved==='science3')return saved;
 return legacyGrade==='5'?'math5':'math3';
}
export function courseUrl(current:string,course:Course){const url=new URL(current);url.searchParams.set('grade',course==='math5'?'5':'3');url.searchParams.set('subject',course==='science3'?'science':'math');return url}
