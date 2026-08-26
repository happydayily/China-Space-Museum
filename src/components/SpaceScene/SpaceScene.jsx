import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Earth() {
  const ref = useRef()
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.08 })
  return <group ref={ref}><mesh><sphereGeometry args={[2.1, 64, 64]} /><meshStandardMaterial color="#173c75" roughness={0.9} metalness={0.05} /></mesh><mesh scale={1.02}><sphereGeometry args={[2.1, 32, 32]} /><meshBasicMaterial color="#4db7ff" wireframe transparent opacity={0.12} /></mesh><mesh rotation={[0.1, 0.8, 0]}><torusGeometry args={[2.65, 0.008, 8, 128]} /><meshBasicMaterial color="#67d4ff" transparent opacity={0.55} /></mesh></group>
}

function Stars() { const points = Array.from({ length: 900 }, (_, i) => { const r = 7 + Math.random() * 9; const a = Math.random() * Math.PI * 2; const b = Math.acos(2 * Math.random() - 1); return [r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), r * Math.cos(b)] }).flat(); return <points><bufferGeometry><bufferAttribute attach="attributes-position" count={points.length / 3} array={new Float32Array(points)} itemSize={3} /></bufferGeometry><pointsMaterial color="#c5e8ff" size={0.025} sizeAttenuation transparent opacity={0.75} /></points> }

export default function SpaceScene() { return <div className="space-scene"><Canvas camera={{ position: [0, 0.2, 8], fov: 42 }}><ambientLight intensity={0.3} /><pointLight position={[4, 3, 5]} intensity={16} color="#b8d8ff" /><pointLight position={[-4, -2, 2]} intensity={5} color="#253caa" /><Earth /><Stars /></Canvas><div className="scene-vignette" /></div> }
