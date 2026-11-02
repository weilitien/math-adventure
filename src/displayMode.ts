export type DisplayMode='flat'|'3d';
export const displayModeKey='math-adventure-display-mode-v1';
export function resolveDisplayMode(saved:string|null,compact:boolean,reducedMotion:boolean,saveData:boolean):DisplayMode{
 if(saved==='flat'||saved==='3d')return saved;
 return compact||reducedMotion||saveData?'flat':'3d';
}
export function loadDisplayMode():DisplayMode{
 let saved:string|null=null;try{saved=localStorage.getItem(displayModeKey)}catch{}
 const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;
 return resolveDisplayMode(saved,window.matchMedia('(max-width: 800px)').matches,window.matchMedia('(prefers-reduced-motion: reduce)').matches,connection?.saveData===true);
}
