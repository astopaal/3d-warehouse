import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import type { DerivedShelf, SapStorageBin } from '../types';
import { SLOT_WIDTH, SLOT_HEIGHT, SLOT_GAP, SHELF_DEPTH, POST_THICKNESS, BASE_HEIGHT, LEVEL_GAP } from '../constants';
import { getBinColor } from '../utils/calculations';

interface ShelfProps {
  shelf: DerivedShelf;
  selected: boolean;
  showLabels: boolean;
  onSelect: () => void;
  onBinHover: (bin: SapStorageBin | null) => void;
}

export function Shelf({ shelf, selected, showLabels, onSelect, onBinHover }: ShelfProps) {
  const { bayCount, levelCount, position } = shelf;

  const shelfWidth = useMemo(() => bayCount * SLOT_WIDTH + (bayCount - 1) * SLOT_GAP, [bayCount]);
  const shelfHeight = useMemo(() => levelCount * SLOT_HEIGHT + (levelCount - 1) * LEVEL_GAP + BASE_HEIGHT, [levelCount]);

  const bins = useMemo(() => {
    return shelf.bins.map((bin) => {
      const x = bin.bay * (SLOT_WIDTH + SLOT_GAP) - shelfWidth / 2 + SLOT_WIDTH / 2;
      const y = bin.level * (SLOT_HEIGHT + LEVEL_GAP) + BASE_HEIGHT + SLOT_HEIGHT / 2;
      return { ...bin, x, y };
    });
  }, [shelf.bins, shelfWidth]);

  return (
    <group position={[position.x, 0, position.z]} onClick={onSelect}>
      {showLabels && (
        <Html position={[0, shelfHeight + 0.6, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: selected ? 'rgba(60, 157, 255, 0.92)' : 'rgba(13, 22, 40, 0.88)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: selected ? '2px solid rgba(60, 157, 255, 1)' : '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: selected ? '0 0 16px rgba(60, 157, 255, 0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {shelf.label}
          </div>
        </Html>
      )}

      <mesh position={[0, BASE_HEIGHT / 2, 0]}>
        <boxGeometry args={[shelfWidth, BASE_HEIGHT, SHELF_DEPTH]} />
        <meshStandardMaterial color="#1a2332" metalness={0.6} roughness={0.4} />
      </mesh>

      {Array.from({ length: 4 }).map((_, i) => {
        const x = i < 2 ? -shelfWidth / 2 + POST_THICKNESS / 2 : shelfWidth / 2 - POST_THICKNESS / 2;
        const z = i % 2 === 0 ? -SHELF_DEPTH / 2 + POST_THICKNESS / 2 : SHELF_DEPTH / 2 - POST_THICKNESS / 2;
        return (
          <mesh key={i} position={[x, shelfHeight / 2, z]}>
            <boxGeometry args={[POST_THICKNESS, shelfHeight, POST_THICKNESS]} />
            <meshStandardMaterial color="#1a2332" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}

      {bins.map((bin) => (
        <mesh
          key={bin.id}
          position={[bin.x, bin.y, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            onBinHover(bin);
          }}
          onPointerOut={() => onBinHover(null)}
        >
          <boxGeometry args={[SLOT_WIDTH - 0.08, SLOT_HEIGHT - 0.08, SHELF_DEPTH - 0.3]} />
          <meshStandardMaterial color={getBinColor(bin)} metalness={0.2} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

