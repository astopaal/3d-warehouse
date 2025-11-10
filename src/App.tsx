import { Suspense, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, StatsGl } from '@react-three/drei';
import './App.css';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ApiProvider } from './contexts/ApiContext';
import { useWarehouse } from './hooks/useWarehouse';
import { Dashboard } from './components/Dashboard';
import { ShelfDetails } from './components/ShelfDetails';
import { BinDetailsPanel } from './components/BinDetailsPanel';
import { WarehouseScene } from './components/WarehouseScene';
import type { SapStorageBin, DerivedShelf } from './types';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { Vector3, PerspectiveCamera as ThreePerspectiveCamera } from 'three';

function AppContent() {
  const { t } = useLanguage();
  const { warehouse, loading } = useWarehouse();
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [selectedAisleId, setSelectedAisleId] = useState<string | null>(null);
  const [hoveredBin, setHoveredBin] = useState<SapStorageBin | null>(null);
  const [clickedBin, setClickedBin] = useState<SapStorageBin | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const controlsRef = useRef<OrbitControlsType>(null);
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const defaultCameraPos = useRef(new Vector3(0, 18, 22));
  const defaultTargetPos = useRef(new Vector3(0, 3.8, 0));

  const shelves: DerivedShelf[] = useMemo(() => {
    if (!warehouse) return [];
    return warehouse.shelves.map((shelf) => {
      const totalQuantity = shelf.bins.reduce((sum, bin) => sum + bin.quantity, 0);
      const totalCapacity = shelf.bins.reduce((sum, bin) => sum + bin.capacity, 0);
      const occupancy = totalCapacity === 0 ? 0 : totalQuantity / totalCapacity;
      const statusBreakdown = shelf.bins.reduce(
        (acc, bin) => {
          acc[bin.status] = (acc[bin.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      return { ...shelf, totalQuantity, totalCapacity, occupancy, statusBreakdown } as DerivedShelf;
    });
  }, [warehouse]);

  const selectedShelf = useMemo(() => {
    return shelves.find((s) => s.id === selectedShelfId) || null;
  }, [shelves, selectedShelfId]);

  const selectedAisle = useMemo(() => {
    if (!warehouse || !selectedAisleId) return null;
    return warehouse.aisles.find((a) => a.id === selectedAisleId) || null;
  }, [warehouse, selectedAisleId]);

  const handleSelectShelf = useCallback((shelfId: string) => {
    setSelectedShelfId(shelfId);
    setSelectedAisleId(null);
  }, []);

  const handleSelectAisle = useCallback((aisleId: string) => {
    setSelectedAisleId(aisleId);
    setSelectedShelfId(null);
    setClickedBin(null);
  }, []);

  const handleBinClick = useCallback((bin: SapStorageBin | null) => {
    // Sadece raf seçili ise bin'e tıklama aktif
    if (selectedShelfId) {
      setClickedBin(bin);
    }
  }, [selectedShelfId]);

  const handleInteraction = useCallback(() => {
    if (hasInteracted) {
      setShowWelcome(false);
    }
  }, [hasInteracted]);

  const handleClick = useCallback(() => {
    setHasInteracted(true);
    setShowWelcome(false);
  }, []);

  const handleControlStart = useCallback(() => {
    setHasInteracted(true);
  }, []);

  // Cinematic kamera odaklama - Raf seçildiğinde
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;

    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const duration = 1500; // 1.5 saniye - daha yavaş ve sinematik
    const startTime = Date.now();
    
    if (selectedShelf) {
      // Raf seçildiğinde - yakından ve ideal açıdan göster
      const { position, bayCount, levelCount } = selectedShelf;
      const shelfWidth = bayCount * 1.2 + (bayCount - 1) * 0.1;
      const shelfHeight = levelCount * 0.8 + (levelCount - 1) * 0.15 + 0.2;
      
      // Rafın merkezi (y=0'dan başlayarak hesapla)
      const targetPos = new Vector3(
        position.x, 
        shelfHeight / 2 + 1, 
        position.z
      );
      
      // Kamera pozisyonu - rafın önünde, hafif yukarıdan, ideal açı
      const cameraDistance = Math.max(shelfWidth * 1.5, 10); // Minimum 10 birim uzaklık
      const cameraPos = new Vector3(
        position.x + cameraDistance * 0.4,  // Hafif sağdan
        shelfHeight / 2 + 4,                // Yukarıdan
        position.z + cameraDistance * 0.9   // Önden - daha yakın
      );
      
      const startCameraPos = camera.position.clone();
      const startTargetPos = controls.target.clone();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cinematic easing (ease-in-out cubic)
        const easeProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Kamera pozisyonunu ve hedefini birlikte animasyon yap
        camera.position.lerpVectors(startCameraPos, cameraPos, easeProgress);
        controls.target.lerpVectors(startTargetPos, targetPos, easeProgress);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
      
    } else {
      // Raf seçimi kaldırıldığında - varsayılan konuma dön
      const startCameraPos = camera.position.clone();
      const startTargetPos = controls.target.clone();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        camera.position.lerpVectors(startCameraPos, defaultCameraPos.current, easeProgress);
        controls.target.lerpVectors(startTargetPos, defaultTargetPos.current, easeProgress);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [selectedShelf]);

  if (loading || !warehouse) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">Loading warehouse data...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h1 className="welcome-title">{t.welcome.title}</h1>
            <p className="welcome-subtitle">{t.welcome.subtitle}</p>
          </div>
          <p className="welcome-hint">{t.welcome.hint}</p>
        </div>
      )}

      <div className="left-controls">
        <button className="readme-button" onClick={() => window.open('/features.html', '_blank')} title="View Feature Roadmap">
          📋 README
        </button>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#3c9dff' }} />
            <span className="legend-label">{t.legend.available}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f7ba3e' }} />
            <span className="legend-label">{t.legend.reserved}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#b37feb' }} />
            <span className="legend-label">{t.legend.quality}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#ff5c7a' }} />
            <span className="legend-label">{t.legend.blocked}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#49546d' }} />
            <span className="legend-label">{t.legend.empty}</span>
          </div>
        </div>
      </div>

      <Canvas
        shadows
        onClick={handleClick}
        onPointerDown={handleClick}
        style={{ background: 'linear-gradient(to bottom, #0a0e1a 0%, #0d1628 100%)' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 18, 22]} fov={50} />
          <OrbitControls
            ref={controlsRef}
            target={selectedAisle ? [selectedAisle.position.x, 3.8, selectedAisle.position.z] : [0, 3.8, 0]}
            enableDamping
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={45}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            onStart={handleControlStart}
            onChange={handleInteraction}
          />

          {/* Daha parlak ambient ışık - genel aydınlatma */}
          <ambientLight intensity={0.6} color="#f5f8ff" />
          
          {/* Ana güneş ışığı - daha güçlü */}
          <directionalLight 
            position={[10, 25, 15]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
            color="#ffffff"
          />
          
          {/* Dolgu ışığı - karanlık köşeleri aydınlat */}
          <directionalLight 
            position={[-10, 18, -10]} 
            intensity={0.7} 
            color="#e8f0ff"
          />
          
          {/* Üstten genel ışık */}
          <pointLight 
            position={[0, 15, 0]} 
            intensity={0.8} 
            distance={40} 
            decay={1.5}
            color="#ffffff"
          />
          
          {/* Yan aydınlatma - sağ */}
          <pointLight 
            position={[20, 10, 0]} 
            intensity={0.5} 
            distance={35} 
            decay={2}
            color="#f0f4ff"
          />
          
          {/* Yan aydınlatma - sol */}
          <pointLight 
            position={[-20, 10, 0]} 
            intensity={0.5} 
            distance={35} 
            decay={2}
            color="#f0f4ff"
          />

          <WarehouseScene
            warehouse={warehouse}
            shelves={shelves}
            selectedShelfId={selectedShelfId}
            selectedAisleId={selectedAisleId}
            showLabels={!showWelcome && !clickedBin}
            onSelectShelf={handleSelectShelf}
            onSelectAisle={handleSelectAisle}
            onBinHover={setHoveredBin}
            onBinClick={handleBinClick}
            clickedBin={clickedBin}
          />

          <StatsGl className="stats" />
        </Suspense>
      </Canvas>

      {/* Floating Bin Details Panel */}
      <BinDetailsPanel 
        bin={clickedBin} 
        onClose={() => setClickedBin(null)} 
      />

      <div className="right-sidebar">
        <Dashboard warehouse={warehouse} autoRotate={autoRotate} onToggleAutoRotate={() => setAutoRotate(!autoRotate)} />
        <ShelfDetails 
          key={selectedShelf?.id ?? 'empty'} 
          shelf={selectedShelf} 
          hoveredBin={hoveredBin}
          clickedBin={clickedBin}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ApiProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ApiProvider>
  );
}
