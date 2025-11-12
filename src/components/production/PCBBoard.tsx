import React, { useRef } from 'react';
import * as THREE from 'three';

interface PCBBoardProps {
  position: [number, number, number];
  hasCpu?: boolean;
  hasRam?: boolean;
  hasSockets?: boolean;
  scale?: number;
}

export const PCBBoard: React.FC<PCBBoardProps> = ({
  position,
  hasCpu = false,
  hasRam = false,
  hasSockets = false,
  scale = 1
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main PCB Board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.015, 0.25]} />
        <meshStandardMaterial 
          color="#1e7f3d" 
          metalness={0.2} 
          roughness={0.8}
        />
      </mesh>

      {/* Copper Traces - Horizontal */}
      <mesh position={[0, 0.008, 0.08]}>
        <boxGeometry args={[0.3, 0.001, 0.005]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.008, 0.04]}>
        <boxGeometry args={[0.25, 0.001, 0.005]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.008, -0.04]}>
        <boxGeometry args={[0.28, 0.001, 0.005]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.008, -0.08]}>
        <boxGeometry args={[0.32, 0.001, 0.005]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Copper Traces - Vertical */}
      <mesh position={[-0.12, 0.008, 0]}>
        <boxGeometry args={[0.005, 0.001, 0.2]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.12, 0.008, 0]}>
        <boxGeometry args={[0.005, 0.001, 0.2]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* CPU Socket Area */}
      <mesh position={[0, 0.009, 0]}>
        <boxGeometry args={[0.12, 0.005, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Socket Pins Grid */}
      {Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => (
          <mesh
            key={`pin-${i}-${j}`}
            position={[
              -0.045 + i * 0.013,
              0.012,
              -0.045 + j * 0.013
            ]}
          >
            <cylinderGeometry args={[0.002, 0.002, 0.01, 8]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      )}

      {/* CPU Chip - Only if hasCpu is true */}
      {hasCpu && (
        <>
          {/* CPU Package */}
          <mesh position={[0, 0.022, 0]} castShadow>
            <boxGeometry args={[0.1, 0.015, 0.1]} />
            <meshStandardMaterial color="#2c2c2c" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* CPU Die (visible part) */}
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.06, 0.001, 0.06]} />
            <meshStandardMaterial 
              color="#1e3a8a"
              metalness={0.9} 
              roughness={0.1}
              emissive="#1e3a8a"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* CPU Text Marking */}
          <mesh position={[0, 0.031, 0.03]}>
            <planeGeometry args={[0.05, 0.008]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Resistors */}
      <mesh position={[-0.08, 0.012, 0.08]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.025, 12]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[-0.08, 0.012, 0.05]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.025, 12]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Capacitors */}
      <mesh position={[0.08, 0.015, 0.08]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.03, 16]} />
        <meshStandardMaterial color="#1e40af" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.08, 0.015, 0.05]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.03, 16]} />
        <meshStandardMaterial color="#1e40af" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.08, 0.015, -0.05]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.03, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* IC Chips */}
      <mesh position={[-0.08, 0.013, -0.06]} castShadow>
        <boxGeometry args={[0.035, 0.01, 0.025]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.08, 0.013, -0.08]} castShadow>
        <boxGeometry args={[0.04, 0.01, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mounting Holes */}
      <mesh position={[-0.15, 0, 0.11]}>
        <cylinderGeometry args={[0.008, 0.008, 0.016, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.15, 0, 0.11]}>
        <cylinderGeometry args={[0.008, 0.008, 0.016, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.15, 0, -0.11]}>
        <cylinderGeometry args={[0.008, 0.008, 0.016, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.15, 0, -0.11]}>
        <cylinderGeometry args={[0.008, 0.008, 0.016, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* RAM Slots */}
      {hasRam && (
        <>
          {/* RAM 1 */}
          <mesh position={[-0.15, 0.018, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <boxGeometry args={[0.12, 0.008, 0.025]} />
            <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* RAM 1 Chips */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={`ram1-chip-${i}`}
              position={[-0.15 + i * 0.014, 0.022, -0.008]}
              castShadow
            >
              <boxGeometry args={[0.01, 0.005, 0.015]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}

          {/* RAM 2 */}
          <mesh position={[0.15, 0.018, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <boxGeometry args={[0.12, 0.008, 0.025]} />
            <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* RAM 2 Chips */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={`ram2-chip-${i}`}
              position={[0.15 - i * 0.014, 0.022, -0.008]}
              castShadow
            >
              <boxGeometry args={[0.01, 0.005, 0.015]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </>
      )}

      {/* Socket Connectors */}
      {hasSockets && (
        <>
          {Array.from({ length: 4 }, (_, i) => (
            <mesh
              key={`socket-${i}`}
              position={[-0.06 + i * 0.04, 0.02, 0.1]}
              castShadow
            >
              <boxGeometry args={[0.03, 0.02, 0.03]} />
              <meshStandardMaterial 
                color="#7c3aed" 
                metalness={0.6} 
                roughness={0.3}
                emissive="#7c3aed"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </>
      )}

      {/* LED Indicator */}
      <mesh position={[-0.15, 0.012, 0.08]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.015, 12]} />
        <meshStandardMaterial 
          color={hasSockets ? "#a855f7" : hasRam ? "#3b82f6" : hasCpu ? "#22c55e" : "#ef4444"}
          emissive={hasSockets ? "#a855f7" : hasRam ? "#3b82f6" : hasCpu ? "#22c55e" : "#ef4444"}
          emissiveIntensity={hasSockets ? 0.9 : hasRam ? 0.8 : hasCpu ? 0.8 : 0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Solder Pads */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={`pad-${i}`}
          position={[0.14, 0.008, -0.08 + i * 0.032]}
        >
          <cylinderGeometry args={[0.004, 0.004, 0.001, 12]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
};

