import { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { DerivedShelf, SapStorageBin } from '../types';
import { 
  SLOT_WIDTH, 
  SLOT_HEIGHT, 
  SLOT_GAP, 
  SHELF_DEPTH, 
  POST_THICKNESS, 
  BASE_HEIGHT, 
  LEVEL_GAP,
  HORIZONTAL_PADDING,
  VERTICAL_PADDING,
  BACK_PANEL_THICKNESS
} from '../constants';
import { getBinColor } from '../utils/calculations';
import * as THREE from 'three';

function createTextTexture(text: string, fontSize: number = 32, color: string = '#ffffff', bgColor: string = 'transparent'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 512;
  
  if (bgColor !== 'transparent') {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  context.font = `bold ${fontSize}px Arial`;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createQuantityTexture(quantity: number, uom: string, fontSize: number = 24): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 128;
  
  // Arka plan
  context.fillStyle = 'rgba(60, 157, 255, 0.85)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Border
  context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  context.lineWidth = 2;
  context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  
  // Text
  context.font = `bold ${fontSize}px Arial`;
  context.fillStyle = '#ffffff';
  context.textAlign = 'right';
  context.textBaseline = 'bottom';
  const text = `${quantity} ${uom}`;
  context.fillText(text, canvas.width - 8, canvas.height - 8);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface ShelfProps {
  shelf: DerivedShelf;
  selected: boolean;
  showLabels: boolean;
  onSelect: () => void;
  onBinHover: (bin: SapStorageBin | null) => void;
  onBinClick: (bin: SapStorageBin | null) => void;
  clickedBin: SapStorageBin | null;
}

export function Shelf({ shelf, selected, showLabels, onSelect, onBinHover, onBinClick, clickedBin }: ShelfProps) {
  const { bayCount, levelCount, position } = shelf;
  const binOutlineRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const textureCache = useRef<Map<string, THREE.CanvasTexture>>(new Map());

  // Raf boyutları - padding dahil
  const contentWidth = useMemo(() => bayCount * SLOT_WIDTH + (bayCount - 1) * SLOT_GAP, [bayCount]);
  const contentHeight = useMemo(() => levelCount * SLOT_HEIGHT + (levelCount - 1) * LEVEL_GAP, [levelCount]);
  const shelfWidth = useMemo(() => contentWidth + 2 * HORIZONTAL_PADDING, [contentWidth]);
  const shelfHeight = useMemo(() => contentHeight + BASE_HEIGHT + VERTICAL_PADDING, [contentHeight]);

  const bins = useMemo(() => {
    return shelf.bins.map((bin) => {
      // Padding dahil pozisyon hesaplama
      const x = bin.bay * (SLOT_WIDTH + SLOT_GAP) - contentWidth / 2 + SLOT_WIDTH / 2;
      const y = bin.level * (SLOT_HEIGHT + LEVEL_GAP) + BASE_HEIGHT + VERTICAL_PADDING / 2 + SLOT_HEIGHT / 2;
      return { ...bin, x, y };
    });
  }, [shelf.bins, contentWidth]);

  // Minimal zarif animasyon
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Seçili bin animasyonu
    if (clickedBin) {
      const binMesh = binOutlineRefs.current.get(clickedBin.id);
      if (binMesh) {
        const material = binMesh.material as THREE.MeshBasicMaterial;
        // Çok hızlı ve belirgin pulse
        material.opacity = 0.5 + Math.sin(time * 5) * 0.3;
        // Hafif scale bounce
        const scale = 1.0 + Math.sin(time * 6) * 0.03;
        binMesh.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group position={[position.x, 0, position.z]} onClick={onSelect}>
      {showLabels && (
        <Html 
          position={[0, shelfHeight + 0.6, 0]} 
          center 
          distanceFactor={8} 
          style={{ pointerEvents: 'none' }}
          className="shelf-label-wrapper"
        >
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

      {/* Dikey postlar - 4 köşe */}
      {Array.from({ length: 4 }).map((_, i) => {
        const x = i < 2 ? -shelfWidth / 2 + POST_THICKNESS / 2 : shelfWidth / 2 - POST_THICKNESS / 2;
        const z = i % 2 === 0 ? -SHELF_DEPTH / 2 + POST_THICKNESS / 2 : SHELF_DEPTH / 2 - POST_THICKNESS / 2;
        return (
          <mesh key={i} position={[x, shelfHeight / 2, z]}>
            <boxGeometry args={[POST_THICKNESS, shelfHeight, POST_THICKNESS]} />
            <meshStandardMaterial color="#2a3442" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Arka panel - daha açık ve parlak */}
      <mesh position={[0, shelfHeight / 2, -SHELF_DEPTH / 2 + BACK_PANEL_THICKNESS / 2]} receiveShadow>
        <boxGeometry args={[shelfWidth - POST_THICKNESS * 2, shelfHeight, BACK_PANEL_THICKNESS]} />
        <meshStandardMaterial 
          color="#384454" 
          metalness={0.5} 
          roughness={0.5}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Yan paneller - sol ve sağ, daha açık */}
      <mesh position={[-shelfWidth / 2 + POST_THICKNESS + BACK_PANEL_THICKNESS / 2, shelfHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[BACK_PANEL_THICKNESS, shelfHeight, SHELF_DEPTH - POST_THICKNESS * 2]} />
        <meshStandardMaterial 
          color="#384454" 
          metalness={0.5} 
          roughness={0.5}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh position={[shelfWidth / 2 - POST_THICKNESS - BACK_PANEL_THICKNESS / 2, shelfHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[BACK_PANEL_THICKNESS, shelfHeight, SHELF_DEPTH - POST_THICKNESS * 2]} />
        <meshStandardMaterial 
          color="#384454" 
          metalness={0.5} 
          roughness={0.5}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Horizontal raflar - her kat için, daha açık renk */}
      {Array.from({ length: levelCount }).map((_, level) => {
        const y = BASE_HEIGHT + level * (SLOT_HEIGHT + LEVEL_GAP);
        return (
          <mesh key={`shelf-${level}`} position={[0, y, 0]} receiveShadow>
            <boxGeometry args={[shelfWidth - POST_THICKNESS * 2, 0.04, SHELF_DEPTH - POST_THICKNESS * 2]} />
            <meshStandardMaterial 
              color="#3d4a5e" 
              metalness={0.6} 
              roughness={0.4}
              envMapIntensity={1.2}
            />
          </mesh>
        );
      })}

      {/* Yeni minimal kenar çizgileri - seçili raf için */}
      {selected && (
        <>
          {/* Üst kenar - parlayan çizgi */}
          <mesh position={[0, shelfHeight, 0]}>
            <boxGeometry args={[shelfWidth + 0.1, 0.05, SHELF_DEPTH + 0.1]} />
            <meshBasicMaterial
              color="#3c9dff"
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
          
          {/* Alt kenar */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[shelfWidth + 0.1, 0.05, SHELF_DEPTH + 0.1]} />
            <meshBasicMaterial
              color="#3c9dff"
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
          
          {/* Ön kenarlar - dikey */}
          <mesh position={[-shelfWidth / 2, shelfHeight / 2, SHELF_DEPTH / 2]}>
            <boxGeometry args={[0.05, shelfHeight, 0.05]} />
            <meshBasicMaterial
              color="#3c9dff"
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[shelfWidth / 2, shelfHeight / 2, SHELF_DEPTH / 2]}>
            <boxGeometry args={[0.05, shelfHeight, 0.05]} />
            <meshBasicMaterial
              color="#3c9dff"
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
          
          {/* İnce ambient glow */}
          <pointLight
            position={[0, shelfHeight / 2, SHELF_DEPTH / 2 + 0.2]}
            color="#3c9dff"
            intensity={0.3}
            distance={shelfHeight}
            decay={2}
          />
        </>
      )}

      {bins.map((bin) => {
        const isClicked = clickedBin?.id === bin.id;
        
        let nameTexture: THREE.CanvasTexture | null = null;
        if (selected && bin.materialDescription) {
          const cacheKey = `name-${bin.materialDescription}`;
          if (!textureCache.current.has(cacheKey)) {
            textureCache.current.set(cacheKey, createTextTexture(bin.materialDescription, 28, '#ffffff', 'rgba(0, 0, 0, 0.7)'));
          }
          nameTexture = textureCache.current.get(cacheKey)!;
        }
        
        let quantityTexture: THREE.CanvasTexture | null = null;
        if (selected && bin.quantity > 0) {
          const cacheKey = `qty-${bin.quantity}-${bin.uom}`;
          if (!textureCache.current.has(cacheKey)) {
            textureCache.current.set(cacheKey, createQuantityTexture(bin.quantity, bin.uom, 20));
          }
          quantityTexture = textureCache.current.get(cacheKey)!;
        }
        
        return (
          <group key={bin.id} position={[bin.x, bin.y, 0]}>
            {/* Ana bin mesh */}
            <mesh
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
            
            {/* Bin üzerine isim - yüzeyde */}
            {selected && nameTexture && (
              <mesh position={[0, SLOT_HEIGHT / 2 - 0.06, (SHELF_DEPTH - 0.4) / 2 + 0.001]}>
                <planeGeometry args={[SLOT_WIDTH - 0.2, 0.08]} />
                <meshBasicMaterial map={nameTexture} transparent />
              </mesh>
            )}
            
            {/* Sağ alt köşeye miktar - yüzeyde */}
            {selected && quantityTexture && (
              <mesh position={[SLOT_WIDTH / 2 - 0.12, -SLOT_HEIGHT / 2 + 0.06, (SHELF_DEPTH - 0.4) / 2 + 0.001]}>
                <planeGeometry args={[0.12, 0.06]} />
                <meshBasicMaterial map={quantityTexture} transparent />
              </mesh>
            )}
            
            {/* Seçili bin için parlayan outline */}
            {isClicked && (
              <>
                <mesh
                  ref={(mesh) => {
                    if (mesh) binOutlineRefs.current.set(bin.id, mesh);
                  }}
                >
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
      })}
    </group>
  );
}

