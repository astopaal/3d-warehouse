import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Float, Grid, Html, OrbitControls, PerspectiveCamera, StatsGl, useCursor } from '@react-three/drei';
import './App.css';
import { sapWarehouse, type SapBinStatus, type SapStorageBin, type SapShelf, type ZoneType, type WarehouseZone, type Aisle } from './data/warehouse';

const SLOT_WIDTH = 1.55;
const SLOT_HEIGHT = 0.92;
const SLOT_GAP = 0.14;
const SHELF_DEPTH = 1.2;
const POST_THICKNESS = 0.12;
const BASE_HEIGHT = 0.26;
const LEVEL_GAP = 0.18;

const statusOrder: SapBinStatus[] = ['AVAILABLE', 'RESERVED', 'QUALITY', 'BLOCKED', 'EMPTY'];

const statusColors: Record<SapBinStatus, string> = {
  AVAILABLE: '#3c9dff',
  RESERVED: '#f7ba3e',
  QUALITY: '#b37feb',
  BLOCKED: '#ff5c7a',
  EMPTY: '#49546d',
};

const zoneColors: Record<ZoneType, string> = {
  STAGING: '#246BFD',
  DOCK: '#13c2c2',
  CHARGING: '#fa8c16',
};

type DerivedShelf = SapShelf & {
  totalQuantity: number;
  totalCapacity: number;
  occupancy: number;
  statusBreakdown: Record<SapBinStatus, number>;
};

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((component) => component.toString(16).padStart(2, '0'))
    .join('')}`;
}

function blendColors(from: string, to: string, ratio: number) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  return rgbToHex({
    r: start.r + (end.r - start.r) * ratio,
    g: start.g + (end.g - start.g) * ratio,
    b: start.b + (end.b - start.b) * ratio,
  });
}

function getBinColor(bin: SapStorageBin) {
  const fillRatio = bin.capacity === 0 ? 0 : Math.min(1, bin.quantity / bin.capacity);
  return blendColors('#0d1628', statusColors[bin.status], fillRatio);
}

function getOccupancyColor(value: number) {
  if (value >= 0.9) return '#ff5c7a';
  if (value >= 0.75) return '#f7ba3e';
  if (value >= 0.55) return '#36cfc9';
  if (value >= 0.3) return '#3c9dff';
  return '#5b8cfa';
}

function formatPercentage(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatRatio(quantity: number, capacity: number, uom?: string) {
  return `${quantity.toLocaleString('en-US')} / ${capacity.toLocaleString('en-US')}${uom ? ` ${uom}` : ''}`;
}

function formatTimestamp(value?: string) {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

function formatShift(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length === 0) {
    return null;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = 100 - ((value - min) / span) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="sparkline" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="#9eb7ff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy={100 - ((data[data.length - 1] - min) / span) * 100} r={4.5} fill="#9eb7ff" />
    </svg>
  );
}

function Shelf({
  shelf,
  onSelect,
  isSelected,
  onHoverBin,
  showLabels,
}: {
  shelf: DerivedShelf;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onHoverBin: (bin: SapStorageBin | null) => void;
  showLabels: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered || isSelected);

  const width = useMemo(() => shelf.bayCount * SLOT_WIDTH + (shelf.bayCount - 1) * SLOT_GAP, [shelf.bayCount]);
  const height = useMemo(() => shelf.levelCount * SLOT_HEIGHT + (shelf.levelCount - 1) * LEVEL_GAP, [shelf.levelCount]);
  const occupancyColor = useMemo(() => getOccupancyColor(shelf.occupancy), [shelf.occupancy]);
  const binMap = useMemo(() => {
    const map = new Map<string, SapStorageBin>();
    shelf.bins.forEach((bin) => {
      map.set(`${bin.level}-${bin.bay}`, bin);
    });
    return map;
  }, [shelf.bins]);

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (event.intersections.length === 0) {
        setHovered(false);
        onHoverBin(null);
      }
    },
    [onHoverBin],
  );

  return (
    <group
      position={[shelf.position.x, 0, shelf.position.z]}
      scale={isSelected ? 1.02 : 1}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(shelf.id);
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh position={[0, BASE_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[width + 0.8, BASE_HEIGHT, SHELF_DEPTH + 1.4]} />
        <meshStandardMaterial color="#0f182a" metalness={0.15} roughness={0.85} />
      </mesh>

      {[
        [-width / 2 + POST_THICKNESS / 2, height / 2 + BASE_HEIGHT, -shelf.depth / 2],
        [width / 2 - POST_THICKNESS / 2, height / 2 + BASE_HEIGHT, -shelf.depth / 2],
        [-width / 2 + POST_THICKNESS / 2, height / 2 + BASE_HEIGHT, shelf.depth / 2],
        [width / 2 - POST_THICKNESS / 2, height / 2 + BASE_HEIGHT, shelf.depth / 2],
      ].map((position) => (
        <mesh key={position.join('-')} position={position as [number, number, number]} castShadow>
          <boxGeometry args={[POST_THICKNESS, height + BASE_HEIGHT + 0.35, POST_THICKNESS]} />
          <meshStandardMaterial color={isSelected ? '#f6a63b' : '#4d5f7d'} metalness={isSelected ? 0.6 : 0.3} roughness={0.45} />
        </mesh>
      ))}

      {Array.from({ length: shelf.levelCount + 1 }).map((_, levelIndex) => {
        const y = BASE_HEIGHT + levelIndex * (SLOT_HEIGHT + LEVEL_GAP);
        return (
          <group key={`beam-${levelIndex}`}>
            <mesh position={[0, y, -shelf.depth / 2]} castShadow>
              <boxGeometry args={[width, 0.08, 0.08]} />
              <meshStandardMaterial color={occupancyColor} metalness={0.5} roughness={0.35} />
            </mesh>
            <mesh position={[0, y, shelf.depth / 2]} castShadow>
              <boxGeometry args={[width, 0.08, 0.08]} />
              <meshStandardMaterial color={occupancyColor} metalness={0.5} roughness={0.35} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: shelf.levelCount }).map((_, level) => {
        const levelY = BASE_HEIGHT + SLOT_HEIGHT / 2 + level * (SLOT_HEIGHT + LEVEL_GAP);
        return Array.from({ length: shelf.bayCount }).map((__, bay) => {
          const bin = binMap.get(`${level}-${bay}`);
          if (!bin) {
            return null;
          }
          const x = -width / 2 + SLOT_WIDTH / 2 + bay * (SLOT_WIDTH + SLOT_GAP);
          return (
            <mesh
              key={bin.id}
              position={[x, levelY, 0]}
              castShadow
              onPointerOver={(event) => {
                event.stopPropagation();
                setHovered(true);
                onHoverBin(bin);
              }}
              onPointerOut={(event) => {
                event.stopPropagation();
                if (event.intersections.length === 0) {
                  onHoverBin(null);
                }
              }}
            >
              <boxGeometry args={[SLOT_WIDTH, SLOT_HEIGHT * 0.92, shelf.depth * 0.94]} />
              <meshStandardMaterial
                color={getBinColor(bin)}
                metalness={0.35}
                roughness={0.45}
                emissive={isSelected ? occupancyColor : '#060b16'}
                emissiveIntensity={isSelected ? 0.25 : 0.06}
              />
            </mesh>
          );
        });
      })}

      {showLabels && (
        <Float floatIntensity={0.5} speed={2.2}>
          <Html center distanceFactor={14} className={`shelf-label${isSelected ? ' active' : ''}`}>
            <div>{shelf.label}</div>
            <div>{formatPercentage(shelf.occupancy)}</div>
          </Html>
        </Float>
      )}
    </group>
  );
}

function AisleFloor({
  aisle,
  isSelected,
  onSelect,
}: {
  aisle: Aisle;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group position={[aisle.position.x, 0, aisle.position.z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelect(aisle.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <planeGeometry args={[aisle.width, aisle.length]} />
        <meshStandardMaterial
          color={isSelected ? '#246BFD' : hovered ? '#1a4a9e' : '#0a1628'}
          transparent
          opacity={isSelected ? 0.35 : hovered ? 0.25 : 0.15}
          emissive={isSelected ? '#246BFD' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      {isSelected && (
        <Float floatIntensity={0.4} speed={1.8}>
          <Html position={[0, 0.05, 0]} center distanceFactor={20} className="aisle-label">
            <span>{aisle.label}</span>
          </Html>
        </Float>
      )}
    </group>
  );
}

function WarehouseScene({
  shelves,
  aisles,
  zones,
  selectedShelfId,
  selectedAisleId,
  onSelectShelf,
  onSelectAisle,
  onHoverBin,
  showLabels,
}: {
  shelves: DerivedShelf[];
  aisles: Aisle[];
  zones: WarehouseZone[];
  selectedShelfId: string | null;
  selectedAisleId: string | null;
  onSelectShelf: (id: string) => void;
  onSelectAisle: (id: string) => void;
  onHoverBin: (bin: SapStorageBin | null) => void;
  showLabels: boolean;
}) {
  return (
    <>
      <color attach="background" args={['#050912']} />
      <fog attach="fog" args={['#050912', 45, 150]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[24, 32, 18]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={5}
        shadow-camera-far={80}
      />
      <spotLight position={[-26, 18, 14]} angle={0.45} penumbra={0.4} intensity={0.8} color="#88aaff" />
      <pointLight position={[0, 12, -8]} intensity={0.6} color="#5bc0f8" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120, 1, 1]} />
        <meshStandardMaterial color="#070d19" />
      </mesh>

      <Grid
        position={[0, 0.01, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#0f1c33"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#1f3d68"
        fadeDistance={80}
        fadeStrength={1}
      />

      {aisles.map((aisle) => (
        <AisleFloor key={aisle.id} aisle={aisle} isSelected={aisle.id === selectedAisleId} onSelect={onSelectAisle} />
      ))}

      {zones.map((zone) => (
        <group key={zone.id} position={[zone.position[0], 0, zone.position[1]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
            <planeGeometry args={[zone.size[0], zone.size[1]]} />
            <meshStandardMaterial color={zoneColors[zone.type]} transparent opacity={0.22} />
          </mesh>
          {showLabels && (
            <Float floatIntensity={0.45} speed={1.6}>
              <Html position={[0, 0.05, 0]} center distanceFactor={24} className="zone-label">
                <span>{zone.label}</span>
              </Html>
            </Float>
          )}
        </group>
      ))}

      {shelves.map((shelf) => (
        <Shelf key={shelf.id} shelf={shelf} onSelect={onSelectShelf} isSelected={shelf.id === selectedShelfId} onHoverBin={onHoverBin} showLabels={showLabels} />
      ))}
    </>
  );
}

function ShelfDetails({ shelf, hoveredBin }: { shelf: DerivedShelf | null; hoveredBin: SapStorageBin | null }) {
  if (!shelf) {
    return (
      <section className="panel empty">
        <div className="empty-icon">📦</div>
        <h3>Click a shelf to show details</h3>
        <p>Select any shelf in the warehouse to inspect real-time metrics, inventory levels, and sensor data</p>
      </section>
    );
  }

  const capacityUsage = shelf.totalCapacity === 0 ? 0 : shelf.totalQuantity / shelf.totalCapacity;

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>{shelf.label}</h2>
          <p>
            Shelf ID {shelf.id} • {formatPercentage(capacityUsage)} utilized
          </p>
        </div>
        <div className="panel-metric">
          <strong>{shelf.totalQuantity.toLocaleString('en-US')}</strong>
          <span>Units in stock</span>
        </div>
      </header>

      <div className="status-metrics">
        {statusOrder.map((status) => {
          const count = shelf.statusBreakdown[status] ?? 0;
          const share = shelf.bins.length === 0 ? 0 : (count / shelf.bins.length) * 100;
          return (
            <div key={status} className="status-chip">
              <span className={`chip-dot status-${status.toLowerCase()}`} />
              <span className="chip-label">{status}</span>
              <span className="chip-value">{count}</span>
              <div className="chip-bar">
                <div style={{ width: `${share}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sensor-grid">
        <article>
          <span>Temperature</span>
          <strong>{shelf.sensors.temperature.toFixed(1)}°C</strong>
        </article>
        <article>
          <span>Humidity</span>
          <strong>{shelf.sensors.humidity.toFixed(0)}%</strong>
        </article>
        <article>
          <span>Vibration</span>
          <strong>{shelf.sensors.vibration.toFixed(3)} g</strong>
        </article>
      </div>

      {hoveredBin && hoveredBin.shelfId === shelf.id && (
        <div className="hover-card">
          <header>
            <strong>{hoveredBin.id}</strong>
            <span className={`status-pill small ${hoveredBin.status.toLowerCase()}`}>{hoveredBin.status}</span>
          </header>
          <p>{hoveredBin.materialDescription}</p>
          <div className="hover-grid">
            <div>
              <span>Quantity</span>
              <strong>
                {hoveredBin.quantity} / {hoveredBin.capacity} {hoveredBin.uom}
              </strong>
            </div>
            <div>
              <span>Batch</span>
              <strong>{hoveredBin.batch}</strong>
            </div>
            <div>
              <span>Handling Unit</span>
              <strong>{hoveredBin.handlingUnit}</strong>
            </div>
            <div>
              <span>Last Movement</span>
              <strong>{formatTimestamp(hoveredBin.lastMovement)}</strong>
            </div>
            <div>
              <span>Next Movement</span>
              <strong>{formatTimestamp(hoveredBin.nextMovement)}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="bin-list">
        {shelf.bins
          .slice()
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 8)
          .map((bin) => {
            const fill = bin.capacity === 0 ? 0 : Math.min(1, bin.quantity / bin.capacity);
            return (
              <div key={bin.id} className="bin-row">
                <div>
                  <strong>{bin.id}</strong>
                  <span>{bin.materialDescription}</span>
                </div>
                <div className="bin-row-meta">
                  <span className={`status-pill small ${bin.status.toLowerCase()}`}>{bin.status}</span>
                  <span>{formatRatio(bin.quantity, bin.capacity, bin.uom)}</span>
                  <div className="bin-progress">
                    <div style={{ width: `${fill * 100}%`, background: statusColors[bin.status] }} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

function App() {
  const derivedShelves = useMemo<DerivedShelf[]>(
    () =>
      sapWarehouse.shelves.map((shelf) => {
        const totalCapacity = shelf.bins.reduce((acc, bin) => acc + bin.capacity, 0);
        const totalQuantity = shelf.bins.reduce((acc, bin) => acc + bin.quantity, 0);
        const statusBreakdown = statusOrder.reduce(
          (acc, status) => {
            acc[status] = 0;
            return acc;
          },
          {} as Record<SapBinStatus, number>,
        );
        shelf.bins.forEach((bin) => {
          statusBreakdown[bin.status] += 1;
        });
        return {
          ...shelf,
          totalCapacity,
          totalQuantity,
          occupancy: totalCapacity === 0 ? 0 : totalQuantity / totalCapacity,
          statusBreakdown,
        };
      }),
    [],
  );

  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [selectedAisleId, setSelectedAisleId] = useState<string | null>(null);
  const [hoveredBin, setHoveredBin] = useState<SapStorageBin | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [throughputHistory, setThroughputHistory] = useState<number[]>([312, 328, 321, 337, 344, 339, 351]);
  const [inboundFill, setInboundFill] = useState(0.64);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const throughputTimer = setInterval(() => {
      setThroughputHistory((prev) => {
        const nextValue = Math.max(280, Math.min(420, prev[prev.length - 1] + (Math.random() - 0.5) * 14));
        return [...prev.slice(-6), Math.round(nextValue)];
      });
    }, 5200);
    return () => clearInterval(throughputTimer);
  }, []);

  useEffect(() => {
    const fillTimer = setInterval(() => {
      setInboundFill((prev) => {
        const delta = (Math.random() - 0.5) * 0.08;
        const value = Math.min(0.98, Math.max(0.2, prev + delta));
        return Number(value.toFixed(2));
      });
    }, 6100);
    return () => clearInterval(fillTimer);
  }, []);

  const overallCapacity = useMemo(() => derivedShelves.reduce((acc, shelf) => acc + shelf.totalCapacity, 0), [derivedShelves]);
  const overallQuantity = useMemo(() => derivedShelves.reduce((acc, shelf) => acc + shelf.totalQuantity, 0), [derivedShelves]);
  const overallOccupancy = overallCapacity === 0 ? 0 : overallQuantity / overallCapacity;

  const availableBins = useMemo(
    () => derivedShelves.reduce((acc, shelf) => acc + shelf.bins.filter((bin) => bin.status === 'AVAILABLE' || bin.status === 'EMPTY').length, 0),
    [derivedShelves],
  );

  const avgTemperature = useMemo(
    () => (derivedShelves.length === 0 ? 0 : derivedShelves.reduce((acc, shelf) => acc + shelf.sensors.temperature, 0) / derivedShelves.length),
    [derivedShelves],
  );

  const selectedShelf = useMemo(
    () => derivedShelves.find((shelf) => shelf.id === selectedShelfId) ?? null,
    [derivedShelves, selectedShelfId],
  );

  const sortedOrders = useMemo(
    () =>
      sapWarehouse.transportOrders
        .slice()
        .sort((a, b) => new Date(a.plannedTime).getTime() - new Date(b.plannedTime).getTime()),
    [],
  );

  const selectedAisle = useMemo(
    () => sapWarehouse.aisles.find((aisle) => aisle.id === selectedAisleId) ?? null,
    [selectedAisleId],
  );

  const handleHoverBin = useCallback((bin: SapStorageBin | null) => {
    setHoveredBin(bin);
  }, []);

  const handleSelectAisle = useCallback((aisleId: string) => {
    setSelectedAisleId((prev) => (prev === aisleId ? null : aisleId));
    setSelectedShelfId(null);
  }, []);

  const handleSelectShelf = useCallback((shelfId: string) => {
    setSelectedShelfId(shelfId);
    setSelectedAisleId(null);
    setShowWelcome(false);
    setHasInteracted(true);
  }, []);

  const handleInteraction = useCallback(() => {
    if (hasInteracted) {
      setShowWelcome(false);
    }
  }, [hasInteracted]);

  const handleClick = useCallback(() => {
    setShowWelcome(false);
    setHasInteracted(true);
  }, []);

  return (
    <div className="app">
      <div className="scene-container">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [18, 14, 24], fov: 55, near: 0.1, far: 200 }}
          onPointerMissed={() => {
            setSelectedShelfId(null);
            setSelectedAisleId(null);
            setHoveredBin(null);
          }}
          onClick={handleClick}
          onPointerDown={() => setHasInteracted(true)}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[18, 14, 24]} />
            <WarehouseScene
              shelves={derivedShelves}
              aisles={sapWarehouse.aisles}
              zones={sapWarehouse.zones}
              selectedShelfId={selectedShelfId}
              selectedAisleId={selectedAisleId}
              onSelectShelf={handleSelectShelf}
              onSelectAisle={handleSelectAisle}
              onHoverBin={handleHoverBin}
              showLabels={!showWelcome}
            />
          </Suspense>
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={10}
            maxDistance={60}
            target={selectedAisle ? [selectedAisle.position.x, 3.8, selectedAisle.position.z] : [0, 3.8, 0]}
            autoRotate={autoRotate}
            autoRotateSpeed={0.45}
            onStart={() => setHasInteracted(true)}
            onChange={handleInteraction}
          />
          <StatsGl className="stats-overlay" />
        </Canvas>
        {showWelcome && (
          <div className="welcome-overlay">
            <div className="welcome-content">
              <h1 className="welcome-title">Hold and slide to move the camera</h1>
              <p className="welcome-subtitle">Click shelfs to inspect</p>
            </div>
            <p className="welcome-hint">Press F11 for fullscreen • Best experience</p>
          </div>
        )}
        <div className="scene-overlay">
          <div className="legend">
            {statusOrder.map((status) => (
              <div key={status} className="legend-item">
                <span className={`legend-dot status-${status.toLowerCase()}`} />
                <span>{status}</span>
              </div>
            ))}
          </div>
          <button
            className="readme-button"
            onClick={() => window.open('/features.html', '_blank')}
            title="View Feature Roadmap"
          >
            📋 README
          </button>
        </div>
      </div>

      <aside className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Warehouse Digital Twin</h1>
            <p>
              {sapWarehouse.metadata.description} • Plant {sapWarehouse.metadata.plant} • Managed by {sapWarehouse.metadata.manager}
            </p>
          </div>
          <div className={`status-pill ${sapWarehouse.operations.status.toLowerCase()}`}>
            {sapWarehouse.operations.status} • Synced {formatShift(sapWarehouse.operations.lastSync)}
          </div>
        </header>

        <div className="kpi-grid">
          <article className="kpi-card">
            <header>Overall Occupancy</header>
            <div className="kpi-main">
              <strong>{formatPercentage(overallOccupancy)}</strong>
              <MiniSparkline data={throughputHistory} />
            </div>
            <footer>{overallQuantity.toLocaleString('en-US')} units stored</footer>
          </article>
          <article className="kpi-card">
            <header>Available Capacity</header>
            <div className="kpi-main">
              <strong>{availableBins}</strong>
              <span>bins ready</span>
            </div>
            <footer>{sapWarehouse.shelves.length} aisles monitored</footer>
          </article>
          <article className="kpi-card">
            <header>Inbound Staging</header>
            <div className="kpi-main">
              <strong>{formatPercentage(inboundFill)}</strong>
              <span>filled</span>
            </div>
            <footer>Auto-replenishment active</footer>
          </article>
          <article className="kpi-card">
            <header>Ambient Temperature</header>
            <div className="kpi-main">
              <strong>{avgTemperature.toFixed(1)}°C</strong>
              <span>{sapWarehouse.operations.shift}</span>
            </div>
            <footer>Realtime sensor telemetry</footer>
          </article>
        </div>

        <label className="toggle">
          <input type="checkbox" checked={autoRotate} onChange={(event) => setAutoRotate(event.target.checked)} />
          <span className="toggle-switch" />
          <span className="toggle-label">Auto rotate camera</span>
        </label>

        <ShelfDetails key={selectedShelf?.id ?? 'empty'} shelf={selectedShelf} hoveredBin={hoveredBin} />

        <section className="panel orders">
          <header className="panel-header">
            <div>
              <h2>Upcoming Movements</h2>
              <p>SAP TM queue synced {formatShift(sapWarehouse.operations.lastSync)}</p>
            </div>
          </header>
          <div className="orders-list">
            {sortedOrders.map((order) => (
              <article key={order.id} className="order-row">
                <div className="order-primary">
                  <span className={`order-type ${order.type.toLowerCase()}`}>{order.type}</span>
                  <strong>{order.materialDescription}</strong>
                  <span>{order.materialId}</span>
                </div>
                <div className="order-meta">
                  <span>
                    {order.quantity} {order.uom}
                  </span>
                  <span>{order.dock}</span>
                  <span className={`status-pill small ${order.status.toLowerCase()}`}>{order.status}</span>
                  <span>{formatTimestamp(order.plannedTime)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

export default App;