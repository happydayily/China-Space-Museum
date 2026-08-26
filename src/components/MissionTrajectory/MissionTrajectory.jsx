import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function TrajectoryScene({ nodes, color }) {
  const movingPoint = useRef()
  const progressLine = useRef()
  const { camera } = useThree()
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(nodes.map((node) => new THREE.Vector3(...node.position))),
    [nodes],
  )
  const curvePoints = useMemo(() => curve.getPoints(220), [curve])
  const baseGeometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(curvePoints),
    [curvePoints],
  )
  const progressGeometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(curvePoints),
    [curvePoints],
  )

  useEffect(() => () => {
    baseGeometry.dispose()
    progressGeometry.dispose()
  }, [baseGeometry, progressGeometry])

  useFrame(({ clock }) => {
    const progress = (clock.getElapsedTime() * 0.075) % 1
    const point = curve.getPointAt(progress)
    movingPoint.current?.position.copy(point)
    progressLine.current?.geometry.setDrawRange(0, Math.max(2, Math.floor(progress * curvePoints.length)))
    const cameraTarget = new THREE.Vector3(point.x * 0.13, point.y * 0.08 + 0.1, 6.4)
    camera.position.lerp(cameraTarget, 0.018)
    camera.lookAt(0, 0, 0)
  })

  return (
    <group>
      <line>
        <primitive object={baseGeometry} attach="geometry" />
        <lineBasicMaterial color="#294868" transparent opacity={0.65} />
      </line>
      <line ref={progressLine}>
        <primitive object={progressGeometry} attach="geometry" />
        <lineBasicMaterial color={color} />
      </line>
      {nodes.map((node, index) => (
        <group position={node.position} key={node.label}>
          <mesh>
            <sphereGeometry args={[index === 0 ? 0.22 : 0.12, 24, 24]} />
            <meshBasicMaterial color={index === 0 ? '#58a9e8' : color} />
          </mesh>
          <mesh scale={1.7}>
            <sphereGeometry args={[index === 0 ? 0.22 : 0.12, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.12} />
          </mesh>
        </group>
      ))}
      <mesh ref={movingPoint}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color={color} intensity={4} distance={1.8} />
      </mesh>
    </group>
  )
}

export default function MissionTrajectory({ hall }) {
  return (
    <section className="trajectory-panel" style={{ '--hall-color': hall.color }}>
      <div className="trajectory-heading">
        <span className="section-kicker">任务轨迹 · 动态演示</span>
        <h2>任务轨迹</h2>
        <p>光点沿任务关键阶段循环飞行，镜头随轨迹缓慢移动。</p>
      </div>
      <div className="trajectory-canvas">
        <Canvas camera={{ position: [0, 0, 6.4], fov: 46 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#050b16']} />
          <fog attach="fog" args={['#050b16', 5, 10]} />
          <TrajectoryScene nodes={hall.trajectory} color={hall.color} />
        </Canvas>
        <div className="trajectory-labels">
          {hall.trajectory.map((node, index) => (
            <span key={node.label}><b>{String(index + 1).padStart(2, '0')}</b>{node.label}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
