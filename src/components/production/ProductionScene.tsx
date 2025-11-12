import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { CpuPlacementMachine } from './CpuPlacementMachine';
import { RamPlacementMachine } from './RamPlacementMachine';
import { SocketPlacementMachine } from './SocketPlacementMachine';
import { PCBBoard } from './PCBBoard';
import { ConveyorBelt } from './ConveyorBelt';

export const ProductionScene: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [cycleCount2, setCycleCount2] = useState(0);
  const [cycleCount3, setCycleCount3] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  type PCBState = {
    x: number;
    hasCpu: boolean;
    hasRam: boolean;
    hasSockets: boolean;
    id: string;
  };
  const [pcbPositions, setPcbPositions] = useState<PCBState[]>([]);
  const [machine1Active, setMachine1Active] = useState(false);
  const [machine2Active, setMachine2Active] = useState(false);
  const [machine3Active, setMachine3Active] = useState(false);
  const processingPcbs = useRef<Set<string>>(new Set());
  const processingPcbs2 = useRef<Set<string>>(new Set());
  const processingPcbs3 = useRef<Set<string>>(new Set());

  const getTimestamp = useCallback(() => new Date().toISOString(), []);

  const createPcbId = useCallback(() => {
    if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  const logEvent = useCallback(
    (source: string, pcbId: string, message: string) => {
      console.log(`[${getTimestamp()}] [${source}] [PCB:${pcbId}] ${message}`);
    },
    [getTimestamp]
  );

  const logSystem = useCallback(
    (context: string, message: string) => {
      console.log(`[${getTimestamp()}] [${context}] ${message}`);
    },
    [getTimestamp]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setProcessingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCycleComplete = () => {
    setCycleCount((prev) => {
      const newCount = prev + 1;
      logSystem('MACHINE 1', `Cycle completed - Total cycles: ${newCount}`);
      return newCount;
    });
  };

  const handleCycleComplete2 = () => {
    setCycleCount2((prev) => {
      const newCount = prev + 1;
      logSystem('MACHINE 2', `Cycle completed - Total cycles: ${newCount}`);
      return newCount;
    });
  };

  const handleCycleComplete3 = () => {
    setCycleCount3((prev) => {
      const newCount = prev + 1;
      logSystem('MACHINE 3', `Cycle completed - Total cycles: ${newCount}`);
      return newCount;
    });
  };

  useEffect(() => {
    let moveInterval: ReturnType<typeof setInterval>;
    let addInterval: ReturnType<typeof setInterval>;
    
    if (isRunning) {
      // Move PCBs on conveyor every 100ms
      moveInterval = setInterval(() => {
        setPcbPositions(prev => {
          return prev
            .map(pcb => {
              // Check if PCB is being processed in any machine (using ref for immediate check)
              const isInMachine1 = processingPcbs.current.has(pcb.id);
              const isInMachine2 = processingPcbs2.current.has(pcb.id);
              const isInMachine3 = processingPcbs3.current.has(pcb.id);
              
              // If PCB is being processed, don't move it
              if (isInMachine1 || isInMachine2 || isInMachine3) {
                return { ...pcb, x: pcb.x };
              }
              
              // Check if PCB is entering machine zone (hasn't been processed and not currently in machine)
              // Check if PCB is in machine zone
              const inMachineZone = pcb.x >= -0.8 && pcb.x <= 0.8;
              const enteringMachine = !pcb.hasCpu && inMachineZone;
              
              // Machine 1: CPU Placement
              if (enteringMachine && !processingPcbs.current.has(pcb.id)) {
                const pcbId = pcb.id;
                const entryTime = Date.now();
                
                logEvent('MACHINE 1', pcbId, `Entered machine zone at x=${pcb.x.toFixed(2)}`);
                logEvent('MACHINE 1', pcbId, 'Cycle started');
                
                setMachine1Active(true);
                processingPcbs.current.add(pcbId);
                
                setTimeout(() => {
                  const processingDuration = ((Date.now() - entryTime) / 1000).toFixed(2);
                  logEvent('MACHINE 1', pcbId, `Cycle completed - CPU placement finished (${processingDuration}s)`);
                  
                  setPcbPositions(current => 
                    current.map(p => 
                      p.id === pcbId 
                        ? { ...p, hasCpu: true }
                        : p
                    )
                  );
                  
                  // Wait a bit for PCB to physically exit before checking
                  setTimeout(() => {
                    processingPcbs.current.delete(pcbId);
                    logEvent('MACHINE 1', pcbId, 'Exiting machine');
                    
                    // Check if another PCB is currently being processed
                    if (processingPcbs.current.size === 0) {
                      logSystem('MACHINE 1', 'No more PCBs in machine - setting inactive');
                      setMachine1Active(false);
                    } else {
                      logSystem('MACHINE 1', `Remaining PCBs in machine: ${processingPcbs.current.size}`);
                    }
                  }, 500); // Wait 0.5s for PCB to exit
                }, 4000); // 4 seconds for Machine 1
                
                return { ...pcb, x: pcb.x };
              }

              // Machine 2: RAM Placement
              const inMachineZone2 = pcb.x >= 5.8 && pcb.x <= 6.2;
              const enteringMachine2 = pcb.hasCpu && !pcb.hasRam && inMachineZone2;
              
              if (enteringMachine2 && !processingPcbs2.current.has(pcb.id)) {
                const pcbId = pcb.id;
                const entryTime = Date.now();
                
                logEvent('MACHINE 2', pcbId, `Entered machine zone at x=${pcb.x.toFixed(2)}`);
                logEvent('MACHINE 2', pcbId, 'Cycle started');
                
                setMachine2Active(true);
                processingPcbs2.current.add(pcbId);
                
                setTimeout(() => {
                  const processingDuration = ((Date.now() - entryTime) / 1000).toFixed(2);
                  logEvent('MACHINE 2', pcbId, `Cycle completed - RAM placement finished (${processingDuration}s)`);
                  
                  setPcbPositions(current => 
                    current.map(p => 
                      p.id === pcbId 
                        ? { ...p, hasRam: true }
                        : p
                    )
                  );
                  
                  // Wait a bit for PCB to physically exit before checking
                  setTimeout(() => {
                    processingPcbs2.current.delete(pcbId);
                    logEvent('MACHINE 2', pcbId, 'Exiting machine');
                    
                    // Check if another PCB is currently being processed
                    if (processingPcbs2.current.size === 0) {
                      logSystem('MACHINE 2', 'No more PCBs in machine - setting inactive');
                      setMachine2Active(false);
                    } else {
                      logSystem('MACHINE 2', `Remaining PCBs in machine: ${processingPcbs2.current.size}`);
                    }
                  }, 500); // Wait 0.5s for PCB to exit
                }, 5000); // 5 seconds for Machine 2
                
                return { ...pcb, x: pcb.x };
              }
              
              // Machine 3: Socket Integration
              const inMachineZone3 = pcb.x >= 11.8 && pcb.x <= 12.2;
              const enteringMachine3 = pcb.hasRam && !pcb.hasSockets && inMachineZone3;
              
              if (enteringMachine3 && !processingPcbs3.current.has(pcb.id)) {
                const pcbId = pcb.id;
                const entryTime = Date.now();
                
                logEvent('MACHINE 3', pcbId, `Entered machine zone at x=${pcb.x.toFixed(2)}`);
                logEvent('MACHINE 3', pcbId, 'Cycle started');
                
                setMachine3Active(true);
                processingPcbs3.current.add(pcbId);
                
                setTimeout(() => {
                  const processingDuration = ((Date.now() - entryTime) / 1000).toFixed(2);
                  logEvent('MACHINE 3', pcbId, `Cycle completed - Socket integration finished (${processingDuration}s)`);
                  
                  setPcbPositions(current => 
                    current.map(p => 
                      p.id === pcbId 
                        ? { ...p, hasSockets: true }
                        : p
                    )
                  );

                  handleCycleComplete3();
                  
                  // Wait a bit for PCB to physically exit before checking
                  setTimeout(() => {
                    processingPcbs3.current.delete(pcbId);
                    logEvent('MACHINE 3', pcbId, 'Exiting machine');
                    
                    // Check if another PCB is currently being processed
                    if (processingPcbs3.current.size === 0) {
                      logSystem('MACHINE 3', 'No more PCBs in machine - setting inactive');
                      setMachine3Active(false);
                    } else {
                      logSystem('MACHINE 3', `Remaining PCBs in machine: ${processingPcbs3.current.size}`);
                    }
                  }, 500); // Wait 0.5s for PCB to exit
                }, 2000); // 2 seconds for Machine 3
                
                return { ...pcb, x: pcb.x };
              }
              
              // Move PCB forward (only if not in any machine)
              return {
                ...pcb,
                x: pcb.x + 0.15,
              };
            })
            .filter(pcb => pcb.x < 22); // Remove PCBs that have passed
        });
      }, 100);

      // Add new PCB every 7 seconds
      addInterval = setInterval(() => {
        const newId = createPcbId();
        logEvent('CONVEYOR', newId, 'PCB created and added to conveyor');
        setPcbPositions(prev => [
          ...prev,
          {
            x: -6,
            hasCpu: false,
            hasRam: false,
            hasSockets: false,
            id: newId
          }
        ]);
      }, 7000);

      // Add first PCB immediately
      const firstId = createPcbId();
      logEvent('CONVEYOR', firstId, 'Initial PCB created and added to conveyor');
      setPcbPositions([{
        x: -6,
        hasCpu: false,
        hasRam: false,
        hasSockets: false,
        id: firstId
      }]);
    } else {
      setPcbPositions([]);
      setMachine1Active(false);
      setMachine2Active(false);
      setMachine3Active(false);
      processingPcbs.current.clear();
      processingPcbs2.current.clear();
      processingPcbs3.current.clear();
    }
    
    return () => {
      clearInterval(moveInterval);
      clearInterval(addInterval);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setCycleCount(0);
    setCycleCount2(0);
    setCycleCount3(0);
    setProcessingTime(0);
    setPcbPositions([]);
    console.log('========================================');
    logSystem('SYSTEM', 'Production line STARTED');
    logSystem('SYSTEM', 'Machine 1 timing: 4 seconds');
    logSystem('SYSTEM', 'Machine 2 timing: 5 seconds');
    logSystem('SYSTEM', 'Machine 3 timing: 2 seconds');
    console.log('========================================');
  };

  const handleStop = () => {
    setIsRunning(false);
    console.log('========================================');
    logSystem('SYSTEM', 'Production line STOPPED');
    logSystem('SYSTEM', `Machine 1 total cycles: ${cycleCount}`);
    logSystem('SYSTEM', `Machine 2 total cycles: ${cycleCount2}`);
    logSystem('SYSTEM', `Machine 3 total cycles: ${cycleCount3}`);
    logSystem('SYSTEM', `Total processing time: ${processingTime} seconds`);
    console.log('========================================');
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0f172a' }}>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ 
          color: '#fff', 
          margin: '0 0 15px 0',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          SMT Üretim Hattı Kontrol Paneli
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ 
            color: '#94a3b8', 
            fontSize: '14px',
            marginBottom: '8px'
          }}>
            Sistem Durumu: 
            <span style={{ 
              color: isRunning ? '#22c55e' : '#ef4444',
              fontWeight: '600',
              marginLeft: '8px'
            }}>
              {isRunning ? 'ÇALIŞIYOR' : 'DURDURULDU'}
            </span>
          </div>
          <div style={{ 
            color: '#94a3b8', 
            fontSize: '13px',
            marginBottom: '4px'
          }}>
            Makine 1: 
            <span style={{ 
              color: machine1Active ? '#f59e0b' : '#64748b',
              fontWeight: '600',
              marginLeft: '8px'
            }}>
              {machine1Active ? 'CPU ÇAKIYOR' : 'BEKLİYOR'}
            </span>
          </div>
          <div style={{ 
            color: '#94a3b8', 
            fontSize: '13px',
          }}>
            Makine 2: 
            <span style={{ 
              color: machine2Active ? '#10b981' : '#64748b',
              fontWeight: '600',
              marginLeft: '8px'
            }}>
              {machine2Active ? 'RAM ÇAKIYOR' : 'BEKLİYOR'}
            </span>
          </div>
          <div style={{ 
            color: '#94a3b8', 
            fontSize: '13px',
            marginTop: '4px'
          }}>
            Makine 3: 
            <span style={{ 
              color: machine3Active ? '#a855f7' : '#64748b',
              fontWeight: '600',
              marginLeft: '8px'
            }}>
              {machine3Active ? 'SOKET ENTEGRE EDİYOR' : 'BEKLİYOR'}
            </span>
          </div>
        </div>

        <div style={{ 
          marginBottom: '15px',
          padding: '10px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
            <strong>Makine 1 Döngü:</strong> {cycleCount}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
            <strong>Makine 2 Döngü:</strong> {cycleCount2}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
            <strong>Makine 3 Döngü:</strong> {cycleCount3}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '4px' }}>
            <strong>İşlem Süresi:</strong> {processingTime}s
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
            <strong>Konveyördeki PCB:</strong> {pcbPositions.length}
          </div>
        </div>

        <button
          onClick={isRunning ? handleStop : handleStart}
          style={{
            width: '100%',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            background: isRunning 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            boxShadow: isRunning
              ? '0 4px 12px rgba(239, 68, 68, 0.4)'
              : '0 4px 12px rgba(34, 197, 94, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isRunning
              ? '0 6px 16px rgba(239, 68, 68, 0.5)'
              : '0 6px 16px rgba(34, 197, 94, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isRunning
              ? '0 4px 12px rgba(239, 68, 68, 0.4)'
              : '0 4px 12px rgba(34, 197, 94, 0.4)';
          }}
        >
          {isRunning ? '⏸ DURDUR' : '▶ BAŞLAT'}
        </button>

        <div style={{ 
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '6px' }}>
            <strong>Makine 1:</strong> CPU Yerleştirme
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>
            Pick & Place | İşlem: 4s
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '6px' }}>
            <strong>Makine 2:</strong> RAM Yerleştirme
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            Dual Head | İşlem: 5s
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '10px', marginBottom: '6px' }}>
            <strong>Makine 3:</strong> Soket Entegrasyonu
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            Fine Pitch | İşlem: 2s
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: '#94a3b8',
        fontSize: '12px',
        maxWidth: '300px'
      }}>
        <div style={{ color: '#fff', fontWeight: '600', marginBottom: '8px' }}>
          Kamera Kontrolleri
        </div>
        <div>🖱️ Sol Tık + Sürükle: Döndür</div>
        <div>🖱️ Sağ Tık + Sürükle: Pan</div>
        <div>⚙️ Tekerlek: Yakınlaştır/Uzaklaştır</div>
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <directionalLight position={[-5, 10, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
        <hemisphereLight args={['#ffffff', '#444444', 0.6]} />

        {/* Environment */}
        <Environment preset="warehouse" />

        {/* Factory Floor */}
        <mesh 
          receiveShadow 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]}
        >
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#1e293b"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>

        {/* Floor Grid */}
        <gridHelper 
          args={[50, 50, '#334155', '#1e293b']} 
          position={[0, 0.01, 0]} 
        />

        {/* Conveyor Belt System */}
        <ConveyorBelt 
          position={[2, 0, 0]}
          length={30}
          isRunning={isRunning}
        />

        {/* Machine 1: CPU Placement */}
        <CpuPlacementMachine 
          position={[0, 0, 0]}
          isOperating={machine1Active}
          onCycleComplete={handleCycleComplete}
        />

        {/* Machine 2: RAM Placement */}
        <RamPlacementMachine 
          position={[6, 0, 0]}
          isOperating={machine2Active}
          onCycleComplete={handleCycleComplete2}
        />

        {/* Machine 3: Socket Integration */}
        <SocketPlacementMachine 
          position={[12, 0, 0]}
          isOperating={machine3Active}
        />

        {/* Moving PCB Boards on Conveyor */}
        {pcbPositions.map((pcb) => (
          <PCBBoard 
            key={pcb.id}
            position={[pcb.x, 0.32, 0]}
            hasCpu={pcb.hasCpu}
            hasRam={pcb.hasRam}
            hasSockets={pcb.hasSockets}
            scale={1.2}
          />
        ))}

        {/* Sample PCB Board (for reference - static) */}
        <group position={[-5, 0.8, 2]}>
          <PCBBoard 
            position={[0, 0, 0]}
            hasCpu={false}
            scale={2}
          />
          <mesh position={[0, -0.1, 0.3]}>
            <planeGeometry args={[0.5, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
        
        <group position={[-3, 0.8, 2]}>
          <PCBBoard 
            position={[0, 0, 0]}
            hasCpu={true}
            hasRam={true}
            hasSockets={true}
            scale={2}
          />
          <mesh position={[0, -0.1, 0.3]}>
            <planeGeometry args={[0.5, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
};

