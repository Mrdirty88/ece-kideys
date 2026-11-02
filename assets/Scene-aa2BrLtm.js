import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{a as t,c as n,d as r,f as i,g as a,i as o,l as s,m as c,n as l,o as u,p as d,r as f,s as p,t as m,u as h}from"./gl-B69cjiyU.js";import{t as g}from"./index-DOP1vSZ3.js";var _=e(a(),1),v=c(),y=12,b=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,x=`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform float uFocusX;
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

  vec2 coverUv(vec2 uv){
    float ra=uRes.x/uRes.y; float ia=uImg.x/uImg.y;
    vec2 s=ra>ia?vec2(1.0,ia/ra):vec2(ra/ia,1.0);
    vec2 off=(1.0-s)*vec2(uFocusX,0.8);
    return uv*s+off;
  }

  void main(){
    vec2 uv=vUv;
    float t=uTime*0.06;
    float aspect=uRes.x/uRes.y;

    // Kaydırırken hafif yaklaşma ve sıvı bükülme
    vec2 zuv=(uv-0.5)*(1.0-uScroll*0.08)+0.5;
    vec2 p=vec2(uv.x*aspect,uv.y);
    vec2 q=vec2(fbm(p*1.1+t),fbm(p*1.1-t+3.1));
    float warp=fbm(p*0.8+q*1.2+vec2(t*0.7,-t));

    // İmleç izi
    float trail=0.0;
    for(int i=0;i<${y};i++){
      vec3 m=uTrail[i];
      vec2 d=vec2((uv.x-m.x)*aspect,uv.y-m.y);
      trail+=m.z*smoothstep(0.24,0.0,length(d+q*0.06));
    }
    trail=clamp(trail,0.0,1.4);

    vec2 duv=zuv+q*0.006*(1.0+uScroll*6.0)+vec2(warp*0.004*trail);
    vec2 cuv=coverUv(duv);
    float r=texture2D(uTex,cuv+vec2(0.0015*trail,0.0)).r;
    float g=texture2D(uTex,cuv).r;
    float b=texture2D(uTex,cuv-vec2(0.0015*trail,0.0)).r;
    float lum=g;

    // Taban: siyah-mürdüm duoton
    vec3 ink=vec3(0.043,0.027,0.063);
    vec3 paper=vec3(0.93,0.90,0.94);
    vec3 base=mix(ink,paper,smoothstep(0.08,0.95,pow(vec3(r,g,b),vec3(1.5))));
    base*=mix(vec3(1.0),vec3(0.86,0.82,0.95),0.5);

    // Mürekkep alanı: kenarlardan ve imleç izinden yayılır
    float edge=smoothstep(0.15,1.0,length((uv-vec2(0.62,0.45))*vec2(aspect*0.7,1.0)));
    float field=warp*0.8+edge*0.7+trail*0.9+uScroll*1.6-0.62+ (1.0-uIntro)*-1.2;
    float inkMask=smoothstep(0.0,0.22,field);
    float hot=smoothstep(-0.2,0.6,fbm(p*0.9-q+t*0.5));

    vec3 violet=vec3(0.545,0.239,1.0);
    vec3 ember=vec3(1.0,0.416,0.102);
    vec3 plum=vec3(0.165,0.055,0.29);
    vec3 dye=mix(violet,ember,hot);
    // mürekkep, fotoğrafın ışığını taşır: koyular mürdüm, açıklar ateş
    vec3 dyed=mix(plum*0.6,dye,smoothstep(0.08,0.95,lum));
    dyed+=ember*0.25*pow(lum,6.0);

    vec3 col=mix(base,dyed,inkMask*0.92);
    // mürekkep sınırında parlak çizgi
    float rim=smoothstep(0.0,0.05,field)-smoothstep(0.05,0.16,field);
    col+=mix(ember,violet,hot)*rim*0.35;

    // vinyet + alt koyulaşma (başlık okunurluğu)
    float vig=smoothstep(1.25,0.35,length((uv-0.5)*vec2(aspect*0.8,1.0)));
    col*=mix(0.35,1.0,vig);
    col=mix(col,ink,smoothstep(0.55,0.0,uv.y)*0.82);

    // giriş: siyahtan açılış
    col=mix(ink,col,smoothstep(0.0,0.6,uIntro));
    float fade=1.0-smoothstep(0.5,0.95,uScroll);
    gl_FragColor=vec4(col,fade);
  }
`;function S(){let e=t(`./img/hero-1200.webp`);e.colorSpace=``,e.minFilter=s;let r=n(e=>e.size),a=(0,_.useRef)(null),o=(0,_.useMemo)(()=>Array.from({length:y},()=>new d(.6,.5,0)),[]),c=(0,_.useRef)(0),l=(0,_.useRef)(new i(.6,.5)),u=(0,_.useRef)(0),f=(0,_.useMemo)(()=>({uTex:{value:e},uRes:{value:new i(1,1)},uImg:{value:new i(1200,1622)},uTime:{value:0},uIntro:{value:0},uScroll:{value:0},uFocusX:{value:.72},uTrail:{value:o}}),[e,o]);return p((e,t)=>{let n=a.current;if(!n)return;let i=window.innerHeight,s=Math.min(g.y/i,1.2);n.uniforms.uScroll.value=s,n.uniforms.uTime.value=e.clock.getElapsedTime(),n.uniforms.uRes.value.set(r.width,r.height),n.uniforms.uFocusX.value=r.width<700?.68:.82,u.current=Math.min(1,u.current+t*.55),n.uniforms.uIntro.value=1-(1-u.current)**3;let d=g.mouse.x,f=1-g.mouse.y,p=Math.hypot(d-l.current.x,f-l.current.y);p>.012&&(c.current=(c.current+1)%y,o[c.current].set(d,f,Math.min(1,.35+p*8)),l.current.set(d,f));for(let e of o)e.z*=.35**t;n.visible=s<1.05}),(0,v.jsxs)(`mesh`,{frustumCulled:!1,renderOrder:-1,children:[(0,v.jsx)(`planeGeometry`,{args:[2,2]}),(0,v.jsx)(`shaderMaterial`,{ref:a,vertexShader:b,fragmentShader:x,uniforms:f,transparent:!0,depthTest:!1,depthWrite:!1})]})}var C=`
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
`;function T(){let e=(0,_.useRef)(null),t=n(e=>e.viewport),i=(0,_.useMemo)(()=>({uTime:{value:0},uAmp:{value:.12},uFreq:{value:1.6}}),[]);return p((n,r)=>{let a=e.current;if(!a)return;let o=window.innerHeight,s=g.y/o,c=n.clock.getElapsedTime();i.uTime.value=c;let l=h.smoothstep(s,.45,1.15),u=t.width<6,d=(u?1.05:1.45)*l,f=Math.sin(s*.9)*(u?.4:1),p=(u?.3:t.width*.22)+f,m=u?.9:.1;a.position.x=h.damp(a.position.x,p,3,r),a.position.y=h.damp(a.position.y,m+(1-l)*-2,3,r);let _=h.damp(a.scale.x,Math.max(d,1e-4),4,r);a.scale.setScalar(_),a.rotation.y=c*.12+s*.6,a.rotation.x=s*.25+g.mouse.y*.3;let v=.1+Math.min(Math.abs(g.velocity)*.004,.18);i.uAmp.value=h.damp(i.uAmp.value,v,4,r),a.visible=l>.001}),(0,v.jsx)(`group`,{ref:e,scale:1e-4,children:(0,v.jsxs)(`mesh`,{children:[(0,v.jsx)(`sphereGeometry`,{args:[1,160,160]}),(0,v.jsx)(m,{baseMaterial:r,vertexShader:C,fragmentShader:w,uniforms:i,metalness:.65,roughness:.16,clearcoat:1,clearcoatRoughness:.08,iridescence:.6,iridescenceIOR:1.4,envMapIntensity:1.4})]})})}function E(){let e=typeof window<`u`&&window.innerWidth<768,[t,n]=(0,_.useState)(e?1:1.5),[r,i]=(0,_.useState)(!0);return(0,_.useEffect)(()=>{let e=()=>i(!document.hidden);return document.addEventListener(`visibilitychange`,e),()=>document.removeEventListener(`visibilitychange`,e)},[]),(0,v.jsx)(`div`,{className:`pointer-events-none fixed inset-0 z-0`,"aria-hidden":`true`,children:(0,v.jsxs)(u,{dpr:t,frameloop:r?`always`:`never`,camera:{position:[0,0,6],fov:35},gl:{antialias:!0,alpha:!0,powerPreference:`high-performance`},onCreated:({gl:e})=>{e.toneMapping=4,e.toneMappingExposure=1.05,e.setClearColor(`#0b0710`,0)},children:[(0,v.jsx)(l,{onDecline:()=>n(1)}),(0,v.jsxs)(_.Suspense,{fallback:null,children:[(0,v.jsx)(S,{}),(0,v.jsx)(T,{}),(0,v.jsxs)(o,{resolution:256,frames:1,children:[(0,v.jsx)(`color`,{attach:`background`,args:[`#0b0710`]}),(0,v.jsx)(f,{form:`rect`,intensity:6,color:`#ff6a1a`,position:[-4,2,-2],scale:[6,2,1]}),(0,v.jsx)(f,{form:`rect`,intensity:5,color:`#8b3dff`,position:[4,-1,-2],scale:[6,3,1]}),(0,v.jsx)(f,{form:`circle`,intensity:4,color:`#fff1e6`,position:[0,5,2],scale:2}),(0,v.jsx)(f,{form:`ring`,intensity:3,color:`#ff8a3d`,position:[0,-4,3],scale:3})]})]})]})})}export{E as default};