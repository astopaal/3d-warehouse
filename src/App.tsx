import { Suspense, useCallback, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, StatsGl } from '@react-three/drei';
import './App.css';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ApiProvider } from './contexts/ApiContext';
import { useWarehouse } from './hooks/useWarehouse';
import { Dashboard } from './components/Dashboard';
import { ShelfDetails } from './components/ShelfDetails';
import { WarehouseScene } from './components/WarehouseScene';
import type { SapStorageBin, DerivedShelf } from './types';

function AppContent() {
  const { t } = useLanguage();
  const { warehouse, loading } = useWarehouse();
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [selectedAisleId, setSelectedAisleId] = useState<string | null>(null);
  const [hoveredBin, setHoveredBin] = useState<SapStorageBin | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

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
  }, []);

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

      <Dashboard warehouse={warehouse} autoRotate={autoRotate} onToggleAutoRotate={() => setAutoRotate(!autoRotate)} />

      <ShelfDetails key={selectedShelf?.id ?? 'empty'} shelf={selectedShelf} hoveredBin={hoveredBin} />

      <button className="readme-button" onClick={() => window.open('/features.html', '_blank')} title="View Feature Roadmap">
        📋 README
      </button>

      <Canvas
        shadows
        onClick={handleClick}
        onPointerDown={handleClick}
        style={{ background: 'linear-gradient(to bottom, #0a0e1a 0%, #0d1628 100%)' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 18, 22]} fov={50} />
          <OrbitControls
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

          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
          <directionalLight position={[-10, 15, -10]} intensity={0.4} />
          <pointLight position={[0, 10, 0]} intensity={0.3} distance={30} />

          <WarehouseScene
            warehouse={warehouse}
            shelves={shelves}
            selectedShelfId={selectedShelfId}
            selectedAisleId={selectedAisleId}
            showLabels={!showWelcome}
            onSelectShelf={handleSelectShelf}
            onSelectAisle={handleSelectAisle}
            onBinHover={setHoveredBin}
          />

          <StatsGl className="stats" />
        </Suspense>
      </Canvas>
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
