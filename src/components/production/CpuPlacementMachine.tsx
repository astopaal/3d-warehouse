import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CpuPlacementMachineProps {
  position: [number, number, number];
  isOperating?: boolean;
  onCycleComplete?: () => void;
}

export const CpuPlacementMachine: React.FC<CpuPlacementMachineProps> = ({
  position,
  isOperating = false,
  onCycleComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const nozzleRef = useRef<THREE.Group>(null);
  
  const [animationState, setAnimationState] = useState<'idle' | 'pickup' | 'move' | 'place' | 'return'>('idle');
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (isOperating && animationState === 'idle') {
      setAnimationState('pickup');
      setProgress(0);
    } else if (!isOperating) {
      setAnimationState('idle');
      setProgress(0);
    }
  }, [isOperating, animationState]);

  useFrame((state, delta) => {
    if (!isOperating || !headRef.current || !nozzleRef.current) return;

    const speed = 0.5;
    setProgress((prev) => prev + delta * speed);

    switch (animationState) {
      case 'pickup':
        // Move to CPU feeder position
        const targetX1 = -0.7;
        const targetY1 = 1.0;
        const targetZ1 = 0.5;
        
        headRef.current.position.x = THREE.MathUtils.lerp(headRef.current.position.x, targetX1, 0.1);
        headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, targetY1 - 0.3, 0.1);
        headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, targetZ1, 0.1);
        
        if (progress > 2) {
          setAnimationState('move');
          setProgress(0);
        }
        break;

      case 'move':
        // Move to PCB placement position
        const targetX2 = 0;
        const targetY2 = 0.95;
        const targetZ2 = 0;
        
        headRef.current.position.x = THREE.MathUtils.lerp(headRef.current.position.x, targetX2, 0.1);
        headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, targetY2, 0.1);
        headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, targetZ2, 0.1);
        
        if (progress > 3) {
          setAnimationState('place');
          setProgress(0);
        }
        break;

      case 'place':
        // Lower and place CPU
        headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 0.6, 0.1);
        
        if (progress > 1.5) {
          setAnimationState('return');
          setProgress(0);
          setCycleCount((prev) => prev + 1);
          if (onCycleComplete) onCycleComplete();
        }
        break;

      case 'return':
        // Return to home position
        headRef.current.position.x = THREE.MathUtils.lerp(headRef.current.position.x, 0, 0.1);
        headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 1.25, 0.1);
        headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, 0, 0.1);
        
        if (progress > 2) {
          setAnimationState('pickup');
          setProgress(0);
        }
        break;
    }

    // Rotation animation for nozzle
    if (nozzleRef.current) {
      nozzleRef.current.rotation.z += delta * 2;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Base Platform */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cycle Counter Display */}
      <mesh position={[0.9, 0.7, 0.85]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.02]} />
        <meshStandardMaterial 
          color="#000000"
          emissive={isOperating ? "#00ff00" : "#333333"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Machine Housing - Main Body */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.3, 1.6]} />
        <meshStandardMaterial color="#34495e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Top Cover */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.1, 1.7]} />
        <meshStandardMaterial color="#1a252f" metalness={0.7} roughness={0.3} />
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

      {/* Feeder Housing (CPU Storage) */}
      <mesh position={[-0.7, 0.9, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.5, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Feeder Tube */}
      <mesh position={[-0.7, 1.2, 0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Movable Head Group */}
      <group ref={headRef} position={[0, 1.25, 0]}>
        {/* Placement Head Housing */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.3, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Placement Head Shaft */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Nozzle Group (rotates) */}
        <group ref={nozzleRef} position={[0, -0.25, 0]}>
          {/* Placement Head Nozzle */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.1, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Vacuum Tip */}
          <mesh position={[0, -0.06, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
            <meshStandardMaterial 
              color="#f59e0b" 
              metalness={0.8} 
              roughness={0.2}
              emissive={animationState === 'pickup' || animationState === 'move' ? "#ff0000" : "#000000"}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* CPU being held (only visible during pickup, move, place) */}
          {(animationState === 'move' || animationState === 'place') && (
            <mesh position={[0, -0.09, 0]} castShadow>
              <boxGeometry args={[0.05, 0.008, 0.05]} />
              <meshStandardMaterial color="#2c2c2c" metalness={0.7} roughness={0.3} />
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

      {/* Linear Guide Rails - Y Axis */}
      <mesh position={[0.85, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.85, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Stepper Motors */}
      <mesh position={[0.95, 1.5, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.85, 1.5, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Pneumatic Connectors */}
      <mesh position={[-0.9, 1.2, 0.8]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.9, 1.3, 0.8]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Cable Management */}
      <mesh position={[0.95, 0.7, -0.75]} castShadow>
        <boxGeometry args={[0.1, 1.3, 0.08]} />
        <meshStandardMaterial color="#1f2937" metalness={0.4} roughness={0.6} />
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

      {/* Top Safety Frame */}
      <mesh position={[0, 2.5, 0.95]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.5, -0.95]} rotation={[0, Math.PI / 2, 0]} castShadow>
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

      {/* Vision System Camera */}
      <mesh position={[0, 1.8, 0]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.85, 0.05]} rotation={[-Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial 
          color="#1e40af"
          emissive="#1e40af"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Machine Label */}
      <mesh position={[0, 0.5, 0.81]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.8, 0.15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

