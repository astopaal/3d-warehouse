import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { WarehouseScene } from './components/WarehouseScene';
import { Dashboard } from './components/Dashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApiProvider } from './contexts/ApiContext';
import { ProductionScene } from './components/production/ProductionScene';
import { useWarehouse } from './hooks/useWarehouse';
import './App.css';

function WarehouseView() {
  const { warehouse, loading } = useWarehouse();
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [selectedAisleId, setSelectedAisleId] = useState<string | null>(null);
  const [clickedBin, setClickedBin] = useState<any>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const showLabels = true;

  const shelves = useMemo(() => {
    if (!warehouse) return [];
    return warehouse.shelves.map(shelf => {
      const totalQuantity = shelf.bins.reduce((sum, bin) => sum + bin.quantity, 0);
      const totalCapacity = shelf.bins.reduce((sum, bin) => sum + bin.capacity, 0);
      const occupancy = totalCapacity === 0 ? 0 : totalQuantity / totalCapacity;
      
      const statusBreakdown = {
        AVAILABLE: shelf.bins.filter(bin => bin.status === 'AVAILABLE').length,
        RESERVED: shelf.bins.filter(bin => bin.status === 'RESERVED').length,
        QUALITY: shelf.bins.filter(bin => bin.status === 'QUALITY').length,
        BLOCKED: shelf.bins.filter(bin => bin.status === 'BLOCKED').length,
        EMPTY: shelf.bins.filter(bin => bin.status === 'EMPTY').length,
      };

      return {
        ...shelf,
        totalQuantity,
        totalCapacity,
        occupancy,
        statusBreakdown,
      };
    });
  }, [warehouse]);

  if (loading || !warehouse) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1a1a2e',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Canvas 
        shadows 
        camera={{ 
          position: [25, 20, 25], 
          fov: 50,
          near: 0.1,
          far: 1000 
        }}
        style={{ background: '#1a1a2e' }}
      >
        <WarehouseScene 
          warehouse={warehouse}
          shelves={shelves}
          selectedShelfId={selectedShelfId}
          selectedAisleId={selectedAisleId}
          showLabels={showLabels}
          onSelectShelf={setSelectedShelfId}
          onSelectAisle={setSelectedAisleId}
          onBinHover={() => {}}
          onBinClick={setClickedBin}
          clickedBin={clickedBin}
        />
      </Canvas>
      <Dashboard 
        warehouse={warehouse}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
      />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ApiProvider>
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <ProductionScene />
        </div>
      </ApiProvider>
    </LanguageProvider>
  );
}

export default App;
