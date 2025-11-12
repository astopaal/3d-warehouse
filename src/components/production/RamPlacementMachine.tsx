import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RamPlacementMachineProps {
  position: [number, number, number];
  isOperating?: boolean;
  onCycleComplete?: () => void;
}

export const RamPlacementMachine: React.FC<RamPlacementMachineProps> = ({
  position,
  isOperating = false,
  onCycleComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef1 = useRef<THREE.Group>(null);
  const headRef2 = useRef<THREE.Group>(null);
  const nozzleRef1 = useRef<THREE.Group>(null);
  const nozzleRef2 = useRef<THREE.Group>(null);
  
  const [animationState, setAnimationState] = useState<'idle' | 'pickup1' | 'place1' | 'pickup2' | 'place2' | 'return'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOperating && animationState === 'idle') {
      setAnimationState('pickup1');
      setProgress(0);
    } else if (!isOperating) {
      setAnimationState('idle');
      setProgress(0);
    }
  }, [isOperating, animationState]);

  useFrame((_state, delta) => {
    if (!isOperating || !headRef1.current || !headRef2.current) return;

    const speed = 0.5;
    setProgress((prev) => prev + delta * speed);

    switch (animationState) {
      case 'pickup1':
        // First head picks up first RAM
        headRef1.current.position.x = THREE.MathUtils.lerp(headRef1.current.position.x, -0.7, 0.1);
        headRef1.current.position.y = THREE.MathUtils.lerp(headRef1.current.position.y, 0.7, 0.1);
        
        if (progress > 2) {
          setAnimationState('place1');
          setProgress(0);
        }
        break;

      case 'place1':
        // Place first RAM
        headRef1.current.position.x = THREE.MathUtils.lerp(headRef1.current.position.x, -0.15, 0.1);
        headRef1.current.position.y = THREE.MathUtils.lerp(headRef1.current.position.y, 0.5, 0.1);
        
        if (progress > 2) {
          setAnimationState('pickup2');
          setProgress(0);
        }
        break;

      case 'pickup2':
        // Second head picks up second RAM
        headRef1.current.position.y = THREE.MathUtils.lerp(headRef1.current.position.y, 1.25, 0.1);
        headRef2.current.position.x = THREE.MathUtils.lerp(headRef2.current.position.x, 0.7, 0.1);
        headRef2.current.position.y = THREE.MathUtils.lerp(headRef2.current.position.y, 0.7, 0.1);
        
        if (progress > 2) {
          setAnimationState('place2');
          setProgress(0);
        }
        break;

      case 'place2':
        // Place second RAM
        headRef2.current.position.x = THREE.MathUtils.lerp(headRef2.current.position.x, 0.15, 0.1);
        headRef2.current.position.y = THREE.MathUtils.lerp(headRef2.current.position.y, 0.5, 0.1);
        
        if (progress > 2) {
          setAnimationState('return');
          setProgress(0);
          if (onCycleComplete) onCycleComplete();
        }
        break;

      case 'return':
        // Return to home
        headRef1.current.position.x = THREE.MathUtils.lerp(headRef1.current.position.x, 0, 0.1);
        headRef1.current.position.y = THREE.MathUtils.lerp(headRef1.current.position.y, 1.25, 0.1);
        headRef2.current.position.x = THREE.MathUtils.lerp(headRef2.current.position.x, 0, 0.1);
        headRef2.current.position.y = THREE.MathUtils.lerp(headRef2.current.position.y, 1.25, 0.1);
        
        if (progress > 2) {
          setAnimationState('pickup1');
          setProgress(0);
        }
        break;
    }

    // Rotation animation
    if (nozzleRef1.current) nozzleRef1.current.rotation.z += delta * 2;
    if (nozzleRef2.current) nozzleRef2.current.rotation.z += delta * 2;
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Base Platform */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Machine Housing - Main Body */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.3, 1.6]} />
        <meshStandardMaterial color="#16a34a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Top Cover */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.1, 1.7]} />
        <meshStandardMaterial color="#15803d" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Control Panel */}
      <mesh position={[0.9, 0.9, 0.85]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Screen */}
      <mesh position={[0.9, 0.9, 0.876]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.01]} />
        <meshStandardMaterial 
          color={isOperating ? "#10b981" : "#3b82f6"} 
          emissive={isOperating ? "#10b981" : "#3b82f6"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Status Lights */}
      <mesh position={[0.9, 1.15, 0.85]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial 
          color={isOperating ? "#22c55e" : "#ef4444"}
          emissive={isOperating ? "#22c55e" : "#ef4444"}
          emissiveIntensity={isOperating ? 1 : 0.3}
        />
      </mesh>

      {/* RAM Feeder Left */}
      <mesh position={[-0.7, 0.9, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.5, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* RAM Feeder Right */}
      <mesh position={[0.7, 0.9, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.5, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Movable Head 1 Group */}
      <group ref={headRef1} position={[0, 1.25, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.25, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.35, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        <group ref={nozzleRef1} position={[0, -0.2, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.03, 0.08, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.05, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.025, 12]} />
            <meshStandardMaterial 
              color="#f59e0b" 
              metalness={0.8} 
              roughness={0.2}
              emissive={animationState === 'pickup1' || animationState === 'place1' ? "#ff0000" : "#000000"}
              emissiveIntensity={0.5}
            />
          </mesh>
          {(animationState === 'place1' || animationState === 'pickup2') && (
            <mesh position={[0, -0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <boxGeometry args={[0.12, 0.005, 0.02]} />
              <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.3} />
            </mesh>
          )}
        </group>
      </group>

      {/* Movable Head 2 Group */}
      <group ref={headRef2} position={[0, 1.25, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.25, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.35, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        <group ref={nozzleRef2} position={[0, -0.2, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.03, 0.08, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.05, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.025, 12]} />
            <meshStandardMaterial 
              color="#f59e0b" 
              metalness={0.8} 
              roughness={0.2}
              emissive={animationState === 'pickup2' || animationState === 'place2' ? "#ff0000" : "#000000"}
              emissiveIntensity={0.5}
            />
          </mesh>
          {(animationState === 'place2' || animationState === 'return') && (
            <mesh position={[0, -0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <boxGeometry args={[0.12, 0.005, 0.02]} />
              <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.3} />
            </mesh>
          )}
        </group>
      </group>

      {/* Linear Guide Rails - X Axis */}
      <mesh position={[0, 1.5, 0.6]} castShadow>
        <boxGeometry args={[2, 0.03, 0.03]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.5, -0.6]} castShadow>
        <boxGeometry args={[2, 0.03, 0.03]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Safety Frame Posts */}
      <mesh position={[1, 1.5, 0.95]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-1, 1.5, 0.95]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1, 1.5, -0.95]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-1, 1.5, -0.95]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Conveyor Entry/Exit Slots */}
      <mesh position={[-1.05, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.2, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.05, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.2, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Machine Label Area */}
      <mesh position={[0, 0.5, 0.81]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.8, 0.15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

