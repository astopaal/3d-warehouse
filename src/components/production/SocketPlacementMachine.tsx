import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SocketPlacementMachineProps {
  position: [number, number, number];
  isOperating?: boolean;
}

type AnimationPhase = 'idle' | 'lower' | 'press' | 'raise' | 'reset';

export const SocketPlacementMachine: React.FC<SocketPlacementMachineProps> = ({
  position,
  isOperating = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const carouselRef = useRef<THREE.Group>(null);

  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOperating && phase === 'idle') {
      setPhase('lower');
      setProgress(0);
    }

    if (!isOperating) {
      setPhase('idle');
      setProgress(0);
    }
  }, [isOperating, phase]);

  useFrame((_, delta) => {
    if (!armRef.current || !headRef.current || !carouselRef.current) {
      return;
    }

    const lerpFactor = 0.12;

    if (isOperating) {
      setProgress((prev) => prev + delta * 2.5);

      switch (phase) {
        case 'lower': {
          armRef.current.rotation.x = THREE.MathUtils.lerp(
            armRef.current.rotation.x,
            -Math.PI / 4,
            lerpFactor
          );
          headRef.current.position.y = THREE.MathUtils.lerp(
            headRef.current.position.y,
            -0.22,
            lerpFactor
          );
          if (progress > 0.6) {
            setPhase('press');
            setProgress(0);
          }
          break;
        }
        case 'press': {
          const pressAmplitude = 0.03 * Math.sin(progress * Math.PI);
          headRef.current.position.y = -0.22 - pressAmplitude;
          if (progress > 1) {
            setPhase('raise');
            setProgress(0);
          }
          break;
        }
        case 'raise': {
          armRef.current.rotation.x = THREE.MathUtils.lerp(
            armRef.current.rotation.x,
            0,
            lerpFactor
          );
          headRef.current.position.y = THREE.MathUtils.lerp(
            headRef.current.position.y,
            0,
            lerpFactor
          );
          if (progress > 0.6) {
            setPhase('reset');
            setProgress(0);
          }
          break;
        }
        case 'reset': {
          armRef.current.rotation.z = 0.15 * Math.sin(progress * Math.PI);
          if (progress > 1) {
            armRef.current.rotation.z = 0;
            setPhase('lower');
            setProgress(0);
          }
          break;
        }
        case 'idle':
        default:
          break;
      }

      carouselRef.current.rotation.y += delta * 0.6;
    } else {
      armRef.current.rotation.x = THREE.MathUtils.lerp(
        armRef.current.rotation.x,
        0,
        lerpFactor
      );
      armRef.current.rotation.z = THREE.MathUtils.lerp(
        armRef.current.rotation.z,
        0,
        lerpFactor
      );
      headRef.current.position.y = THREE.MathUtils.lerp(
        headRef.current.position.y,
        0,
        lerpFactor
      );
      carouselRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.1, 2]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Lower Housing */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 1.1, 1.6]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Upper Glass Chamber */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[1.8, 0.8, 1.5]} />
        <meshPhysicalMaterial
          color="#1e293b"
          transparent
          opacity={0.35}
          metalness={0.1}
          roughness={0.1}
          transmission={0.7}
          thickness={0.05}
        />
      </mesh>

      {/* Status Light Mast */}
      <mesh position={[0.95, 1.8, 0.75]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.95, 2.1, 0.75]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={isOperating ? '#a855f7' : '#64748b'}
          emissive={isOperating ? '#a855f7' : '#475569'}
          emissiveIntensity={isOperating ? 1 : 0.2}
        />
      </mesh>

      {/* Control Panel */}
      <mesh position={[0.9, 0.9, 0.85]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.05]} />
        <meshStandardMaterial color="#312e81" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.9, 0.9, 0.87]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.4, 0.22, 0.01]} />
        <meshStandardMaterial
          color={isOperating ? '#a855f7' : '#22c55e'}
          emissive={isOperating ? '#a855f7' : '#22c55e'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Socket Feeder Carousel */}
      <group ref={carouselRef} position={[-0.75, 0.85, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.12, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={`socket-slot-${i}`}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 0.28,
              0.1,
              Math.sin((i / 8) * Math.PI * 2) * 0.28,
            ]}
          >
            <boxGeometry args={[0.12, 0.04, 0.06]} />
            <meshStandardMaterial color="#6366f1" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Robotic Arm */}
      <group ref={armRef} position={[0.4, 1.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
        </mesh>

        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.15, 0.3, 0.15]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* End Effector */}
        <mesh ref={headRef} position={[0, -0.55, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 20]} />
          <meshStandardMaterial color="#cbd5f5" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Socket Grippers */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh
            key={`gripper-${i}`}
            position={[
              Math.cos((i / 4) * Math.PI * 2) * 0.08,
              -0.62,
              Math.sin((i / 4) * Math.PI * 2) * 0.08,
            ]}
            rotation={[Math.PI / 2, 0, (i / 4) * Math.PI * 2]}
          >
            <boxGeometry args={[0.02, 0.12, 0.02]} />
            <meshStandardMaterial color="#a855f7" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Conveyor Tunnel */}
      <mesh position={[1.1, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.3, 0.9]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Machine Label */}
      <mesh position={[0, 0.5, 0.82]}>
        <planeGeometry args={[0.9, 0.18]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};


