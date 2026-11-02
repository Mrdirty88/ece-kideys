import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scroll } from '../scroll'

const TRAIL = 12

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Siyah beyaz portreye, imleç izinden ve zamandan beslenen mor-turuncu mürekkep dökülür.
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform float uFocusX;
  uniform vec3 uTrail[${TRAIL}];

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
    for(int i=0;i<${TRAIL};i++){
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
`

export function InkPortrait() {
  const tex = useTexture('./img/hero-1200.webp')
  tex.colorSpace = THREE.NoColorSpace
  tex.minFilter = THREE.LinearFilter
  const size = useThree((s) => s.size)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const trail = useMemo(() => Array.from({ length: TRAIL }, () => new THREE.Vector3(0.6, 0.5, 0)), [])
  const head = useRef(0)
  const last = useRef(new THREE.Vector2(0.6, 0.5))
  const intro = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImg: { value: new THREE.Vector2(1200, 1622) },
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uScroll: { value: 0 },
      uFocusX: { value: 0.72 },
      uTrail: { value: trail },
    }),
    [tex, trail],
  )

  useFrame((state, dt) => {
    const m = mat.current
    if (!m) return
    const vh = window.innerHeight
    const s = Math.min(scroll.y / vh, 1.2)
    m.uniforms.uScroll.value = s
    m.uniforms.uTime.value = state.clock.getElapsedTime()
    m.uniforms.uRes.value.set(size.width, size.height)
    m.uniforms.uFocusX.value = size.width < 700 ? 0.68 : 0.82
    intro.current = Math.min(1, intro.current + dt * 0.55)
    m.uniforms.uIntro.value = 1 - Math.pow(1 - intro.current, 3)

    // iz: fare hareket ettikçe yeni damla, hepsi zamanla söner
    const mx = scroll.mouse.x
    const my = 1 - scroll.mouse.y
    const dist = Math.hypot(mx - last.current.x, my - last.current.y)
    if (dist > 0.012) {
      head.current = (head.current + 1) % TRAIL
      trail[head.current].set(mx, my, Math.min(1, 0.35 + dist * 8))
      last.current.set(mx, my)
    }
    for (const v of trail) v.z *= Math.pow(0.35, dt)
    m.visible = s < 1.05
  })

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}
