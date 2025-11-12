import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConveyorBeltProps {
  position: [number, number, number];
  length: number;
  isRunning?: boolean;
}

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({
  position,
  length,
  isRunning = false
}) => {
  const beltRef = useRef<THREE.Mesh>(null);
  const rollerRefs = useRef<THREE.Mesh[]>([]);

  useFrame((_state, delta) => {
    if (!isRunning) return;

    // Animate belt texture
    if (beltRef.current && beltRef.current.material instanceof THREE.MeshStandardMaterial) {
      if (beltRef.current.material.map) {
        beltRef.current.material.map.offset.x += delta * 0.2;
      }
    }

    // Rotate rollers
    rollerRefs.current.forEach(roller => {
      if (roller) {
        roller.rotation.z += delta * 3;
      }
    });
  });

  const numRollers = Math.floor(length / 0.4);

  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, 0.2, 0.25]} castShadow>
        <boxGeometry args={[length, 0.05, 0.05]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, -0.25]} castShadow>
        <boxGeometry args={[length, 0.05, 0.05]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Belt Surface */}
      <mesh ref={beltRef} position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[length, 0.02, 0.5]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>

      {/* Rollers */}
      {Array.from({ length: numRollers }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) rollerRefs.current[i] = el;
          }}
          position={[-length / 2 + i * 0.4 + 0.2, 0.25, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
          <meshStandardMaterial color="#34495e" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Side Guards */}
      <mesh position={[0, 0.35, 0.28]} castShadow>
        <boxGeometry args={[length, 0.08, 0.02]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.35, -0.28]} castShadow>
        <boxGeometry args={[length, 0.08, 0.02]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Support Legs */}
      {Array.from({ length: Math.floor(length / 2) + 1 }, (_, i) => (
        <group key={`leg-${i}`} position={[-length / 2 + i * 2, 0, 0]}>
          <mesh position={[0, 0.1, 0.2]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.2, 12]} />
            <meshStandardMaterial color="#2c3e50" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, -0.2]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.2, 12]} />
            <meshStandardMaterial color="#2c3e50" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

