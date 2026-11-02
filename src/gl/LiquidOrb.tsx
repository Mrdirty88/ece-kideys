import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { scroll } from '../scroll'

const noise = /* glsl */ `
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
`

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  varying float vDisp;
  ${noise}
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
`

const fragmentShader = /* glsl */ `
  uniform float uAmp;
  varying float vDisp;
  void main(){
    float k=smoothstep(-uAmp,uAmp,vDisp);
    vec3 violet=vec3(0.30,0.09,0.62);
    vec3 ember=vec3(0.95,0.33,0.06);
    csm_DiffuseColor=vec4(mix(violet,ember,k),1.0);
  }
`

// Kaydırma ile biçim değiştiren sıvı küre: "mürekkep sese dönüşür".
export function LiquidOrb() {
  const group = useRef<THREE.Group>(null)
  const viewport = useThree((s) => s.viewport)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: 0.12 }, uFreq: { value: 1.6 } }),
    [],
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const vh = window.innerHeight
    const s = scroll.y / vh
    const t = state.clock.getElapsedTime()
    uniforms.uTime.value = t
    // hero sonrası görünür, sayfa ilerledikçe sağa ve sola salınır
    const appear = THREE.MathUtils.smoothstep(s, 0.45, 1.15)
    const narrow = viewport.width < 6
    const baseScale = (narrow ? 1.05 : 1.45) * appear
    const sway = Math.sin(s * 0.9) * (narrow ? 0.4 : 1)
    const targetX = (narrow ? 0.3 : viewport.width * 0.22) + sway
    const targetY = narrow ? 0.9 : 0.1
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 3, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY + (1 - appear) * -2, 3, dt)
    const sc = THREE.MathUtils.damp(g.scale.x, Math.max(baseScale, 0.0001), 4, dt)
    g.scale.setScalar(sc)
    g.rotation.y = t * 0.12 + s * 0.6
    g.rotation.x = s * 0.25 + scroll.mouse.y * 0.3
    const amp = 0.1 + Math.min(Math.abs(scroll.velocity) * 0.004, 0.18)
    uniforms.uAmp.value = THREE.MathUtils.damp(uniforms.uAmp.value, amp, 4, dt)
    g.visible = appear > 0.001
  })

  return (
    <group ref={group} scale={0.0001}>
      <mesh>
        <sphereGeometry args={[1, 160, 160]} />
        <CustomShaderMaterial
          baseMaterial={THREE.MeshPhysicalMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          metalness={0.65}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={0.6}
          iridescenceIOR={1.4}
          envMapIntensity={1.4}
        />
      </mesh>
    </group>
  )
}
