import * as T from 'three';
export function createIslandScene(host:HTMLElement,onSelect:(id:number)=>void,initial:number,passed:number[]){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);
 const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');host.appendChild(canvas);
 const scene=new T.Scene(),world=new T.Group();scene.add(world);
 const camera=new T.OrthographicCamera(-10,10,7,-7,.1,100);camera.position.set(5,13,18);camera.lookAt(0,0,0);
 scene.add(new T.HemisphereLight(0xffffff,0x91a4b0,2.5));const sun=new T.DirectionalLight(0xffefd2,3);sun.position.set(-5,12,8);scene.add(sun);
 const materials=new Map<number,T.MeshStandardMaterial>();
 function mat(color:number){if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.8,flatShading:true}));return materials.get(color)!}
 function mesh(g:T.BufferGeometry,color:number,parent:T.Object3D,x=0,y=0,z=0){const m=new T.Mesh(g,mat(color));m.position.set(x,y,z);parent.add(m);return m}
 function box(p:T.Object3D,c:number,x:number,y:number,z:number,w:number,h:number,d:number){return mesh(new T.BoxGeometry(w,h,d),c,p,x,y,z)}
 function ball(p:T.Object3D,c:number,x:number,y:number,z:number,r:number){return mesh(new T.SphereGeometry(r,12,8),c,p,x,y,z)}
 function tree(p:T.Object3D,x:number,z:number,size=1){const g=new T.Group();p.add(g);g.position.set(x,.2,z);g.scale.setScalar(size);box(g,0x99714a,0,.35,0,.16,.7,.16);mesh(new T.ConeGeometry(.55,1.05,7),0x4d9671,g,0,.95);mesh(new T.ConeGeometry(.42,.85,7),0x71b884,g,0,1.4)}
 const colors=[0x97ca88,0x7dbb9b,0xf1ca7a,0xeeb291,0xb7a4df,0xe7ce7c];
 const islands:T.Group[]=[],rings:T.Mesh[]=[],textures:T.Texture[]=[],sprites:T.SpriteMaterial[]=[];
 for(let i=0;i<6;i++){
  const g=new T.Group();g.userData.level=i;world.add(g);islands.push(g);
  mesh(new T.CylinderGeometry(1.65,1.3,.6,9),0xb88a62,g,0,-.25);
  mesh(new T.CylinderGeometry(1.3,.35,.8,9),0xd2ae82,g,0,-.95);
  mesh(new T.CylinderGeometry(1.7,1.65,.18,9),colors[i],g,0,.12);
  const ring=mesh(new T.TorusGeometry(1.85,.055,6,48),0xfff3ab,g,0,.22);ring.rotation.x=Math.PI/2;rings.push(ring);
  for(let j=0;j<5;j++)mesh(new T.CylinderGeometry(.13,.14,.04,7),0xffedbf,g,-.7+j*.32,.24,1);
  if(i===0){mesh(new T.CylinderGeometry(.4,.55,1.6,10),0xfff3d4,g,0,1);mesh(new T.CylinderGeometry(.55,.55,.3,10),0xe98b65,g,0,1.65);mesh(new T.ConeGeometry(.64,.5,10),0xdf7659,g,0,2.1);ball(g,0xffd875,0,1.85,.4,.14);tree(g,-1,-.2,.7)}
  if(i===1){tree(g,-.65,-.4,1);tree(g,.6,-.3,1.2);tree(g,0,.65,.65)}
  if(i===2){box(g,0x786a61,0,.28,0,2.8,.1,.65);for(let j=0;j<7;j++)box(g,0xe7dab0,-1.2+j*.4,.36,0,.12,.08,.9);box(g,0xdd7455,-.3,.8,0,1.1,.7,.65);box(g,0x4a8493,.5,1,0,.65,1.1,.7);box(g,0xffe9a6,.5,1.6,0,.85,.15,.9);for(const x of [-.6,.4])for(const z of [-.4,.4]){const w=mesh(new T.CylinderGeometry(.22,.22,.12,12),0x394e58,g,x,.52,z);w.rotation.x=Math.PI/2}mesh(new T.CylinderGeometry(.14,.14,.4,8),0x455d66,g,-.6,1.3);ball(g,0xffffff,-.6,1.8,0,.18)}
  if(i===3){box(g,0xffe6b1,0,.85,0,1.65,1.25,1.1);const roof=mesh(new T.ConeGeometry(1.3,.7,4),0xd87867,g,0,1.8);roof.rotation.y=Math.PI/4;for(let j=0;j<5;j++)box(g,j%2?0xfff6de:0x6aab9d,-.7+j*.35,1.15,.72,.34,.2,.6);box(g,0x815c4b,0,.65,.56,.4,.8,.04);box(g,0x9cd6df,.5,1,.57,.4,.4,.05)}
  if(i===4){box(g,0xd5c5ec,0,.8,0,1.7,1.2,.85);for(const x of [-.85,.85]){mesh(new T.CylinderGeometry(.33,.37,1.8,8),0xe8def2,g,x,1,0);mesh(new T.ConeGeometry(.52,.85,8),0x8b77b4,g,x,2.3)}box(g,0x816e9c,0,.65,.44,.5,.85,.05);box(g,0xf4d776,0,1.9,0,.05,.9,.05);box(g,0xf0a3b1,.2,2.2,0,.4,.27,.05)}
  if(i===5){mesh(new T.CylinderGeometry(.85,1,.25,8),0xf4e6bb,g,0,.4);box(g,0xe9ae42,0,.8,0,.25,.7,.25);mesh(new T.CylinderGeometry(.65,.25,.65,10),0xffd769,g,0,1.35);for(const x of [-.65,.65])mesh(new T.TorusGeometry(.3,.08,8,16),0xf2bb49,g,x,1.4);mesh(new T.OctahedronGeometry(.27),0xffef99,g,0,2.1)}
  tree(g,1,-.8,.5);
  const label=document.createElement('canvas');label.width=128;label.height=128;const ctx=label.getContext('2d')!;ctx.fillStyle=passed.includes(i)?'#3b795d':'#fffaf0';ctx.beginPath();ctx.arc(64,64,51,0,Math.PI*2);ctx.fill();ctx.fillStyle=passed.includes(i)?'#ffffff':'#426653';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 65px sans-serif';ctx.fillText(String(i+1),64,68);const texture=new T.CanvasTexture(label);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);const sm=new T.SpriteMaterial({map:texture});sprites.push(sm);const tag=new T.Sprite(sm);tag.scale.set(.65,.65,1);tag.position.set(-1.15,.9,.85);g.add(tag);
 }
 const clouds:T.Group[]=[];for(const [x,y,z] of [[-6,2,-4],[6,3,-3],[-6,-1,4],[5,-1,5]]){const c=new T.Group();c.position.set(x,y,z);world.add(c);clouds.push(c);for(let j=0;j<3;j++){const b=ball(c,0xffffff,(j-1)*.45,j===1?.15:0,0,j===1?.55:.4);b.scale.z=.7}}
 let selected=initial,angle=0,paused=false,inView=true,disposed=false,frame=0,time=0,last=0;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 function select(i:number){selected=i;rings.forEach((r,j)=>r.visible=j===i);draw()}
 function draw(){if(!disposed)renderer.render(scene,camera)}
 function resize(){const w=host.clientWidth,h=host.clientHeight,small=w<600;renderer.setSize(w,h);const half=small?5.3:8.5;camera.left=-half;camera.right=half;camera.top=half*h/w;camera.bottom=-half*h/w;camera.updateProjectionMatrix();camera.position.set(small?2:5,13,18);camera.lookAt(0,0,0);islands.forEach((g,i)=>g.position.set(small?(i%2-.5)*4.2:(i%3-1)*4.5,0,small?(Math.floor(i/2)-1)*3.9:(Math.floor(i/3)-.5)*4.4));draw()}
 function tick(stamp:number){frame=0;if(disposed)return;time+=Math.min((stamp-last)/1000,.05);last=stamp;islands.forEach((g,i)=>g.position.y=Math.sin(time*.9+i)*.1);clouds.forEach((c,i)=>c.position.y+=Math.sin(time+i)*.001);world.rotation.y=angle;draw();if(!paused&&!reduce.matches&&inView&&!document.hidden)frame=requestAnimationFrame(tick)}
 function schedule(){cancelAnimationFrame(frame);frame=0;if(!paused&&!reduce.matches&&inView&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick)}else draw()}
 const observer=new ResizeObserver(resize);observer.observe(host);const visibility=new IntersectionObserver(([e])=>{inView=e.isIntersecting;schedule()});visibility.observe(host);document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);
 const ray=new T.Raycaster();let down:{x:number;y:number;angle:number;id:number}|null=null,moved=false;
 function start(e:PointerEvent){if(!e.isPrimary)return;down={x:e.clientX,y:e.clientY,angle,id:e.pointerId};moved=false}
 function move(e:PointerEvent){if(!down||down.id!==e.pointerId)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>8)moved=true;if(Math.abs(dx)>Math.abs(dy)){angle=T.MathUtils.clamp(down.angle+dx*.0025,-.55,.55);world.rotation.y=angle;draw()}}
 function end(e:PointerEvent){if(!down||down.id!==e.pointerId)return;if(!moved){const r=canvas.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=ray.intersectObjects(islands,true)[0];if(hit){let object:T.Object3D|null=hit.object;while(object&&object.userData.level===undefined)object=object.parent;if(object){select(object.userData.level);onSelect(object.userData.level)}}}down=null}
 const cancel=()=>{down=null};canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('pointerleave',cancel);
 const lost=(e:Event)=>{e.preventDefault();paused=true;schedule();host.dispatchEvent(new CustomEvent('scene-unavailable'))};canvas.addEventListener('webglcontextlost',lost);
 resize();select(initial);schedule();
 return {select,pause(value:boolean){paused=value;schedule()},rotate(direction:number){angle=T.MathUtils.clamp(angle+direction*.18,-.55,.55);world.rotation.y=angle;draw()},dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',schedule);reduce.removeEventListener('change',schedule);canvas.removeEventListener('pointerdown',start);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',end);canvas.removeEventListener('pointercancel',cancel);canvas.removeEventListener('pointerleave',cancel);canvas.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose()});materials.forEach(m=>m.dispose());sprites.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove()}};
}
