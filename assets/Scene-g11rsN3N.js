import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{a as t,c as n,d as r,f as i,g as a,i as o,l as s,m as c,n as l,o as u,p as d,r as f,s as p,t as m,u as h}from"./gl-CY2Eu2Hn.js";import{t as g}from"./index-ZlNrH-kC.js";var _=e(a(),1),v=c(),y=12,b=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,x=`
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform vec3 uTrail[${y}];

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m;m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
  float fbm(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<5;i++){s+=a*snoise(p);p*=2.02;a*=0.5;}return s;}

  void main(){
    vec2 uv=vUv;
    float aspect=uRes.x/uRes.y;
    vec2 p=vec2(uv.x*aspect,uv.y);
    float t=uTime*0.05;

    // imleç izi: sıvıyı iten ve parlatan damlalar
    vec2 push=vec2(0.0);
    float glow=0.0;
    for(int i=0;i<${y};i++){
      vec3 m=uTrail[i];
      vec2 d=vec2((uv.x-m.x)*aspect,uv.y-m.y);
      float f=m.z*smoothstep(0.32,0.0,length(d));
      push+=normalize(d+1e-4)*f*0.25;
      glow+=f;
    }

    vec2 q=vec2(fbm(p*0.7+t),fbm(p*0.7-t+5.2));
    vec2 r=vec2(fbm(p*0.9+q*1.7+vec2(1.7,9.2)+t*1.3-push),fbm(p*0.9+q*1.7+vec2(8.3,2.8)-t*1.1+push));
    float f=fbm(p*0.8+r*1.5+uScroll*0.8);

    vec3 ink=vec3(0.043,0.027,0.063);
    vec3 plum=vec3(0.165,0.055,0.29);
    vec3 violet=vec3(0.545,0.239,1.0);
    vec3 ember=vec3(1.0,0.416,0.102);
    vec3 flame=vec3(1.0,0.62,0.30);

    vec3 col=mix(ink,plum,smoothstep(-0.6,0.4,f));
    col=mix(col,violet,smoothstep(0.2,0.75,length(q)*f+0.15)*0.7);
    col=mix(col,ember,smoothstep(0.55,1.0,r.x+f*0.6)*0.85);
    // ince parlak damarlar
    float vein=smoothstep(0.02,0.0,abs(f-0.18))+smoothstep(0.015,0.0,abs(r.y-0.25))*0.6;
    col+=mix(flame,violet,uv.y)*vein*0.35;
    col+=mix(ember,violet,0.5)*glow*0.18;

    // kenarlar ve alt koyu (yazı okunurluğu)
    float vig=smoothstep(1.3,0.3,length((uv-vec2(0.6,0.55))*vec2(aspect*0.8,1.0)));
    col*=mix(0.35,1.0,vig);
    col=mix(col,ink,smoothstep(0.5,0.0,uv.y)*0.7);

    col=mix(ink,col,smoothstep(0.0,1.0,uIntro));
    float fade=1.0-smoothstep(0.55,1.05,uScroll);
    gl_FragColor=vec4(mix(ink,col,fade),1.0);
  }
`;function S(){let e=n(e=>e.size),t=(0,_.useRef)(null),r=(0,_.useMemo)(()=>Array.from({length:y},()=>new d(.6,.5,0)),[]),a=(0,_.useRef)(0),o=(0,_.useRef)(new i(.6,.5)),s=(0,_.useRef)(0),c=(0,_.useMemo)(()=>({uRes:{value:new i(1,1)},uTime:{value:0},uIntro:{value:0},uScroll:{value:0},uTrail:{value:r}}),[r]);return p((n,i)=>{let c=t.current;if(!c)return;let l=Math.min(g.y/window.innerHeight,1.2);c.uniforms.uScroll.value=l,c.uniforms.uTime.value=n.clock.getElapsedTime(),c.uniforms.uRes.value.set(e.width,e.height),s.current=Math.min(1,s.current+i*.5),c.uniforms.uIntro.value=1-(1-s.current)**3;let u=g.mouse.x,d=1-g.mouse.y,f=Math.hypot(u-o.current.x,d-o.current.y);f>.01&&(a.current=(a.current+1)%y,r[a.current].set(u,d,Math.min(1,.3+f*10)),o.current.set(u,d));for(let e of r)e.z*=.3**i;c.visible=l<1.1}),(0,v.jsxs)(`mesh`,{frustumCulled:!1,renderOrder:-1,children:[(0,v.jsx)(`planeGeometry`,{args:[2,2]}),(0,v.jsx)(`shaderMaterial`,{ref:t,vertexShader:b,fragmentShader:x,uniforms:c,depthTest:!1,depthWrite:!1})]})}var C=`
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  varying float vDisp;
  
  vec4 permute4(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise3(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+2.0*C.xxx;vec3 x3=x0-1.0+3.0*C.xxx;
    i=mod(i,289.0);
    vec4 p=permute4(permute4(permute4(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float disp(vec3 p){
    return snoise3(p*uFreq+vec3(uTime*0.22,uTime*0.15,-uTime*0.18))*uAmp
         + snoise3(p*uFreq*2.3-uTime*0.3)*uAmp*0.35;
  }
  vec3 orth(vec3 v){return normalize(abs(v.x)>abs(v.z)?vec3(-v.y,v.x,0.0):vec3(0.0,-v.z,v.y));}
  void main(){
    vec3 p=position; vec3 n=normal;
    float d=disp(p);
    vec3 t=orth(n); vec3 b=normalize(cross(n,t));
    float e=0.01;
    vec3 pa=p+n*d;
    vec3 pt=(p+t*e)+n*disp(p+t*e);
    vec3 pb=(p+b*e)+n*disp(p+b*e);
    csm_Position=pa;
    csm_Normal=normalize(cross(pt-pa,pb-pa));
    vDisp=d;
  }
`,w=`
  uniform float uAmp;
  varying float vDisp;
  void main(){
    float k=smoothstep(-uAmp,uAmp,vDisp);
    vec3 violet=vec3(0.30,0.09,0.62);
    vec3 ember=vec3(0.95,0.33,0.06);
    csm_DiffuseColor=vec4(mix(violet,ember,k),1.0);
  }
`;function T(){let e=(0,_.useRef)(null),t=n(e=>e.viewport),r=(0,_.useMemo)(()=>({uTime:{value:0},uAmp:{value:.12},uFreq:{value:1.6}}),[]);return p((n,i)=>{let a=e.current;if(!a)return;let o=window.innerHeight,c=g.y/o,l=n.clock.getElapsedTime();r.uTime.value=l;let u=s.smoothstep(c,.85,1.5),d=t.width<6,f=(d?1.05:1.45)*u,p=Math.sin(c*.9)*(d?.4:1),m=(d?.3:t.width*.22)+p,h=d?.9:.1;a.position.x=s.damp(a.position.x,m,3,i),a.position.y=s.damp(a.position.y,h+(1-u)*-2,3,i);let _=s.damp(a.scale.x,Math.max(f,1e-4),4,i);a.scale.setScalar(_),a.rotation.y=l*.12+c*.6,a.rotation.x=c*.25+g.mouse.y*.3;let v=.1+Math.min(Math.abs(g.velocity)*.004,.18);r.uAmp.value=s.damp(r.uAmp.value,v,4,i),a.visible=u>.001}),(0,v.jsx)(`group`,{ref:e,scale:1e-4,children:(0,v.jsxs)(`mesh`,{children:[(0,v.jsx)(`sphereGeometry`,{args:[1,160,160]}),(0,v.jsx)(m,{baseMaterial:h,vertexShader:C,fragmentShader:w,uniforms:r,metalness:.65,roughness:.16,clearcoat:1,clearcoatRoughness:.08,iridescence:.6,iridescenceIOR:1.4,envMapIntensity:1.4})]})})}var E=[{x:-.62,y:.42,s:.2,f:1.1,sp:.7},{x:.6,y:-.38,s:.27,f:1,sp:.5},{x:.7,y:.5,s:.1,f:1.4,sp:.9},{x:-.55,y:-.55,s:.13,f:1.3,sp:.6}];function D({b:e,i:t}){let n=(0,_.useRef)(null),r=(0,_.useMemo)(()=>({uTime:{value:0},uAmp:{value:.07},uFreq:{value:e.f}}),[e.f]);return p(i=>{let a=i.clock.getElapsedTime();r.uTime.value=a*e.sp+t*10;let o=n.current;o&&(o.position.y=Math.sin(a*e.sp+t)*.06,o.position.x=Math.cos(a*e.sp*.7+t)*.04,o.rotation.y=a*.2)}),(0,v.jsx)(`group`,{position:[e.x,e.y,.15],scale:e.s,children:(0,v.jsxs)(`mesh`,{ref:n,children:[(0,v.jsx)(`sphereGeometry`,{args:[1,96,96]}),(0,v.jsx)(m,{baseMaterial:h,vertexShader:C,fragmentShader:w,uniforms:r,metalness:.7,roughness:.14,clearcoat:1,clearcoatRoughness:.06,iridescence:.7,iridescenceIOR:1.4,envMapIntensity:1.5})]})})}var O=`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,k=`
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uSize;   // piksel
  uniform vec2 uImg;
  uniform float uReveal;
  void main(){
    float ra=uSize.x/uSize.y, ia=uImg.x/uImg.y;
    vec2 sc=ra>ia?vec2(1.0,ia/ra):vec2(ra/ia,1.0);
    vec2 off=(1.0-sc)*vec2(0.72,0.78);
    vec4 c=texture2D(uTex,vUv*sc+off);
    vec2 px=vUv*uSize;
    float R=uSize.x*0.5;
    float a=1.0;
    if(px.y>uSize.y-R){ a=smoothstep(R+1.0,R-1.0,length(px-vec2(R,uSize.y-R))); }
    float br=28.0;
    if(px.y<br){
      if(px.x<br) a=min(a,smoothstep(br+1.0,br-1.0,length(px-vec2(br,br))));
      if(px.x>uSize.x-br) a=min(a,smoothstep(br+1.0,br-1.0,length(px-vec2(uSize.x-br,br))));
    }
    a*=step(1.0-uReveal,vUv.y);
    gl_FragColor=vec4(c.rgb,a);
  }
`;function A(){let e=t(`./img/hero-1200.webp`);e.colorSpace=r;let a=(0,_.useRef)(null),o=(0,_.useRef)(null),{camera:c,size:l}=n(),u=(0,_.useRef)(null),d=(0,_.useMemo)(()=>({uTex:{value:e},uSize:{value:new i(1,1)},uImg:{value:new i(1200,1622)},uReveal:{value:0}}),[e]);return p(e=>{let t=a.current;if(!t)return;u.current||(u.current=document.getElementById(`hero-photo`),document.documentElement.classList.add(`gl-photo`));let n=u.current?.getBoundingClientRect();if(!n)return;let r=c,i=2*Math.tan(r.fov*Math.PI/360)*r.position.z,f=i*(l.width/l.height);t.position.set(((n.left+n.width/2)/l.width-.5)*f,-((n.top+n.height/2)/l.height-.5)*i,0),t.scale.set(n.width/l.width*f,n.height/l.height*i,1);let p=o.current?.uniforms??d;p.uSize.value.set(n.width,n.height),p.uReveal.value=s.smoothstep(e.clock.getElapsedTime(),1.7,3),t.visible=n.bottom>-50}),(0,v.jsxs)(`mesh`,{ref:a,children:[(0,v.jsx)(`planeGeometry`,{args:[1,1]}),(0,v.jsx)(`shaderMaterial`,{ref:o,vertexShader:O,fragmentShader:k,uniforms:d,transparent:!0,toneMapped:!1})]})}function j(){let e=(0,_.useRef)(null),t=(0,_.useRef)(null),r=(0,_.useRef)(null),{camera:i,size:a}=n(),o=(0,_.useRef)(null),c=(0,_.useMemo)(()=>new d,[]);return p((n,l)=>{let u=e.current;if(!u)return;o.current||=document.getElementById(`hero-photo`);let d=o.current?.getBoundingClientRect();if(!d)return;let f=i,p=2*Math.tan(f.fov*Math.PI/360)*f.position.z,m=p*(a.width/a.height),h=((d.left+d.width/2)/a.width-.5)*m,_=-((d.top+d.height/2)/a.height-.5)*p,v=d.height/a.height*p;c.set(h,_,0),u.position.lerp(c,Math.min(1,l*12));let y=g.y/window.innerHeight,b=1-s.smoothstep(y,.5,1),x=s.smoothstep(n.clock.getElapsedTime(),1.6,3.2),S=Math.max(1e-4,v*.62*b*x);u.scale.setScalar(s.damp(u.scale.x,S,5,l)),u.visible=b>.01;let C=n.clock.getElapsedTime();t.current&&t.current.rotation.set(1.15+Math.sin(C*.3)*.08,.35,C*.25),r.current&&r.current.rotation.set(1.35,-.55+Math.cos(C*.25)*.1,-C*.18),u.rotation.y=(g.mouse.x-.5)*.25,u.rotation.x=(g.mouse.y-.5)*.15}),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(A,{}),(0,v.jsxs)(`group`,{ref:e,scale:1e-4,children:[(0,v.jsxs)(`group`,{position:[0,-.28,0],children:[(0,v.jsxs)(`mesh`,{ref:t,children:[(0,v.jsx)(`torusGeometry`,{args:[1.05,.022,32,220]}),(0,v.jsx)(`meshPhysicalMaterial`,{color:`#ff8a3d`,metalness:1,roughness:.15,clearcoat:1,envMapIntensity:1.6})]}),(0,v.jsxs)(`mesh`,{ref:r,children:[(0,v.jsx)(`torusGeometry`,{args:[1.22,.008,24,220]}),(0,v.jsx)(`meshPhysicalMaterial`,{color:`#c9a8ff`,metalness:1,roughness:.2,envMapIntensity:1.4})]})]}),E.map((e,t)=>(0,v.jsx)(D,{b:e,i:t},t))]})]})}function M(){let e=typeof window<`u`&&window.innerWidth<768,[t,n]=(0,_.useState)(e?1:1.5),[r,i]=(0,_.useState)(!0);return(0,_.useEffect)(()=>{let e=()=>i(!document.hidden);return document.addEventListener(`visibilitychange`,e),()=>document.removeEventListener(`visibilitychange`,e)},[]),(0,v.jsx)(`div`,{className:`pointer-events-none fixed inset-0 z-0`,"aria-hidden":`true`,children:(0,v.jsxs)(u,{dpr:t,frameloop:r?`always`:`never`,camera:{position:[0,0,6],fov:35},gl:{antialias:!0,alpha:!0,powerPreference:`high-performance`},onCreated:({gl:e})=>{e.toneMapping=4,e.toneMappingExposure=1.05,e.setClearColor(`#0b0710`,0)},children:[(0,v.jsx)(l,{onDecline:()=>n(1)}),(0,v.jsxs)(_.Suspense,{fallback:null,children:[(0,v.jsx)(S,{}),(0,v.jsx)(j,{}),(0,v.jsx)(T,{}),(0,v.jsxs)(o,{resolution:256,frames:1,children:[(0,v.jsx)(`color`,{attach:`background`,args:[`#0b0710`]}),(0,v.jsx)(f,{form:`rect`,intensity:6,color:`#ff6a1a`,position:[-4,2,-2],scale:[6,2,1]}),(0,v.jsx)(f,{form:`rect`,intensity:5,color:`#8b3dff`,position:[4,-1,-2],scale:[6,3,1]}),(0,v.jsx)(f,{form:`circle`,intensity:4,color:`#fff1e6`,position:[0,5,2],scale:2}),(0,v.jsx)(f,{form:`ring`,intensity:3,color:`#ff8a3d`,position:[0,-4,3],scale:3})]})]})]})})}export{M as default};