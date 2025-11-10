import { useRef } from 'react';
import { Text } from '@react-three/drei';
import type { SapStorageBin } from '../types';
import { SLOT_WIDTH, SLOT_HEIGHT, SHELF_DEPTH } from '../constants';
import { getBinColor } from '../utils/calculations';
import * as THREE from 'three';

interface BinProps {
  bin: SapStorageBin & { x: number; y: number };
  selected: boolean;
  isClicked: boolean;
  onBinHover: (bin: SapStorageBin | null) => void;
  onBinClick: (bin: SapStorageBin) => void;
  binOutlineRef: (mesh: THREE.Mesh | null) => void;
}

export function Bin({ bin, selected, isClicked, onBinHover, onBinClick, binOutlineRef }: BinProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={[bin.x, bin.y, 0]}>
      {/* Ana bin kutusu */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onBinHover(bin);
          if (selected) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          onBinHover(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          if (selected) {
            e.stopPropagation();
            onBinClick(bin);
          }
        }}
      >
        <boxGeometry args={[SLOT_WIDTH - 0.15, SLOT_HEIGHT - 0.12, SHELF_DEPTH - 0.4]} />
        <meshStandardMaterial 
          color={getBinColor(bin)} 
          metalness={0.3} 
          roughness={0.7}
          emissive={getBinColor(bin)}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Materyal ismi - üstte, kameraya dönük yüzde */}
      {selected && bin.materialDescription && (
        <Text
          position={[0, SLOT_HEIGHT / 2 - 0.15, (SHELF_DEPTH - 0.4) / 2 + 0.01]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          maxWidth={SLOT_WIDTH - 0.15}
          outlineWidth={0.004}
          outlineColor="#000000"
        >
          {bin.materialDescription}
        </Text>
      )}

      {/* Miktar - sağ alt köşe, kameraya dönük yüzde */}
      {selected && bin.quantity > 0 && (
        <Text
          position={[SLOT_WIDTH / 2 - 0.12, -SLOT_HEIGHT / 2 + 0.12, (SHELF_DEPTH - 0.4) / 2 + 0.01]}
          fontSize={0.09}
          color="#3c9dff"
          anchorX="right"
          anchorY="bottom"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {`${bin.quantity} ${bin.uom}`}
        </Text>
      )}

      {/* Seçili bin için parlayan outline */}
      {isClicked && (
        <>
          <mesh ref={binOutlineRef}>
            <boxGeometry args={[SLOT_WIDTH - 0.02, SLOT_HEIGHT - 0.02, SHELF_DEPTH - 0.2]} />
            <meshBasicMaterial
              color="#ffd700"
              transparent
              opacity={0.5}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
          
          {/* Ekstra parlak çerçeve */}
          <mesh>
            <boxGeometry args={[SLOT_WIDTH + 0.05, SLOT_HEIGHT + 0.05, SHELF_DEPTH - 0.15]} />
            <meshBasicMaterial
              color="#ffec8b"
              transparent
              opacity={0.3}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
          
          {/* Parlayan noktalar */}
          <pointLight
            position={[0, 0, SHELF_DEPTH / 2]}
            color="#ffd700"
            intensity={1.2}
            distance={1.5}
          />
        </>
      )}
    </group>
  );
}

