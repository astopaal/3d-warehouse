import { materials } from './materials';
import type { SapWarehouse, SapShelf, SapStorageBin, SapBinStatus } from '../types';

// Helper functions for deterministic randomization
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getRandomMaterial(shelfId: string, binIndex: number) {
  const seed = hashString(shelfId + '-' + binIndex) + binIndex * 997;
  const index = Math.floor(seededRandom(seed) * materials.length);
  return materials[index];
}

function getRandomLoad(shelfId: string, binIndex: number): number {
  const seed = hashString(shelfId + '-load-' + binIndex) + binIndex * 1009;
  return 0.2 + seededRandom(seed) * 0.75; // 20% to 95%
}

function getRandomStatus(shelfId: string, binIndex: number): SapBinStatus {
  const seed = hashString(shelfId + '-status-' + binIndex) + binIndex * 1013;
  const rand = seededRandom(seed);
  
  if (rand < 0.45) return 'AVAILABLE';
  if (rand < 0.65) return 'RESERVED';
  if (rand < 0.78) return 'QUALITY';
  if (rand < 0.88) return 'BLOCKED';
  return 'EMPTY';
}

function getRandomCapacity(level: number, shelfId: string, bay: number): number {
  const seed = hashString(shelfId + '-cap-' + level + '-' + bay);
  const baseCapacity = 80 - level * 8;
  const variation = Math.floor(seededRandom(seed) * 24) - 12;
  return Math.max(20, baseCapacity + variation);
}

function buildShelf({
  id,
  aisleId,
  label,
  origin,
  bayCount,
  levelCount,
  temperature,
  humidity,
  vibration,
}: {
  id: string;
  aisleId: string;
  label: string;
  origin: [number, number];
  bayCount: number;
  levelCount: number;
  temperature: number;
  humidity: number;
  vibration: number;
}): SapShelf {
  const bins: SapStorageBin[] = [];
  
  for (let level = 0; level < levelCount; level += 1) {
    for (let bay = 0; bay < bayCount; bay += 1) {
      const index = level * bayCount + bay;
      const material = getRandomMaterial(id, index);
      const capacity = getRandomCapacity(level, id, bay);
      const fill = getRandomLoad(id, index);
      const quantity = Math.max(0, Math.round(capacity * fill));
      const status = quantity === 0 ? 'EMPTY' : getRandomStatus(id, index);

      bins.push({
        id: `${id}-L${(level + 1).toString().padStart(2, '0')}-B${(bay + 1).toString().padStart(2, '0')}`,
        shelfId: id,
        aisleId,
        level,
        bay,
        materialId: material.id,
        materialDescription: material.description,
        quantity,
        capacity,
        uom: material.uom,
        batch: `${material.batchPrefix}${(index + 7 + id.charCodeAt(0)).toString().padStart(4, '0')}`,
        status,
        lastMovement: new Date(Date.UTC(2025, 10, 6, 6 + (index % 6), (index * 7) % 55)).toISOString(),
        nextMovement: quantity > 0 ? new Date(Date.UTC(2025, 10, 7, 8 + (index % 4), (index * 5) % 55)).toISOString() : undefined,
        handlingUnit: `HU-${id.replace(/-/g, '').toUpperCase()}-${(120 + index).toString().padStart(3, '0')}`,
      });
    }
  }

  return {
    id,
    aisleId,
    label,
    bayCount,
    levelCount,
    depth: 1.2,
    position: { x: origin[0], z: origin[1] },
    bins,
    sensors: {
      temperature,
      humidity,
      vibration,
    },
  };
}

export function generateWarehouseData(): SapWarehouse {
  return {
  metadata: {
    id: 'WH-TR-3000',
    plant: 'TR01',
    storageLocation: '0001',
    description: 'Techmax Üretim Depo',
    timezone: 'TRT',
    manager: 'Samet TOPAL',
  },
  operations: {
    lastSync: '2025-11-07T08:45:00Z',
    status: 'HEALTHY',
    shift: 'Morning 06:00 - 14:00',
  },
  aisles: [
    {
      id: 'A1',
      label: 'Aisle 1',
      position: { x: -6.4, z: 4.2 },
      width: 3.2,
      length: 13.2,
      shelfIds: ['A1-S1', 'A1-S2'],
    },
    {
      id: 'A2',
      label: 'Aisle 2',
      position: { x: 6.4, z: 4.2 },
      width: 3.2,
      length: 13.2,
      shelfIds: ['A2-S1', 'A2-S2'],
    },
    {
      id: 'A3',
      label: 'Aisle 3',
      position: { x: -6.4, z: -4.2 },
      width: 3.2,
      length: 13.2,
      shelfIds: ['A3-S1', 'A3-S2'],
    },
    {
      id: 'A4',
      label: 'Aisle 4',
      position: { x: 6.4, z: -4.2 },
      width: 3.2,
      length: 13.2,
      shelfIds: ['A4-S1', 'A4-S2'],
    },
  ],
  shelves: [
    buildShelf({
      id: 'A1-S1',
      aisleId: 'A1',
      label: 'Aisle 1 • Bay 1',
      origin: [-9.6, 4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 18.6,
      humidity: 44,
      vibration: 0.022,
    }),
    buildShelf({
      id: 'A1-S2',
      aisleId: 'A1',
      label: 'Aisle 1 • Bay 2',
      origin: [-3.2, 4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 19.1,
      humidity: 47,
      vibration: 0.019,
    }),
    buildShelf({
      id: 'A2-S1',
      aisleId: 'A2',
      label: 'Aisle 2 • Bay 1',
      origin: [3.2, 4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 19.4,
      humidity: 45,
      vibration: 0.024,
    }),
    buildShelf({
      id: 'A2-S2',
      aisleId: 'A2',
      label: 'Aisle 2 • Bay 2',
      origin: [9.6, 4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 18.9,
      humidity: 46,
      vibration: 0.026,
    }),
    buildShelf({
      id: 'A3-S1',
      aisleId: 'A3',
      label: 'Aisle 3 • Bay 1',
      origin: [-9.6, -4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 17.8,
      humidity: 42,
      vibration: 0.028,
    }),
    buildShelf({
      id: 'A3-S2',
      aisleId: 'A3',
      label: 'Aisle 3 • Bay 2',
      origin: [-3.2, -4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 18.1,
      humidity: 43,
      vibration: 0.021,
    }),
    buildShelf({
      id: 'A4-S1',
      aisleId: 'A4',
      label: 'Aisle 4 • Bay 1',
      origin: [3.2, -4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 19.7,
      humidity: 48,
      vibration: 0.018,
    }),
    buildShelf({
      id: 'A4-S2',
      aisleId: 'A4',
      label: 'Aisle 4 • Bay 2',
      origin: [9.6, -4.2],
      bayCount: 4,
      levelCount: 4,
      temperature: 19.3,
      humidity: 47,
      vibration: 0.02,
    }),
  ],
  zones: [
    { id: 'Z-INBOUND', label: 'Inbound Staging', type: 'STAGING', position: [-12, -12], size: [12, 6] },
    { id: 'Z-OUTBOUND', label: 'Outbound Dock', type: 'DOCK', position: [12, -12], size: [12, 6] },
    { id: 'Z-CHARGE', label: 'AGV Charging', type: 'CHARGING', position: [0, 12], size: [14, 5] },
  ],
  transportOrders: [
    {
      id: 'TO-500872',
      type: 'INBOUND',
      materialId: 'MAT-470010',
      materialDescription: 'Hydraulic Pump Assembly',
      quantity: 48,
      uom: 'EA',
      plannedTime: '2025-11-07T09:30:00Z',
      dock: 'Dock 03',
      status: 'RELEASED',
    },
    {
      id: 'TO-500921',
      type: 'OUTBOUND',
      materialId: 'MAT-552210',
      materialDescription: 'Precision Gear Set',
      quantity: 32,
      uom: 'EA',
      plannedTime: '2025-11-07T10:15:00Z',
      dock: 'Dock 01',
      status: 'PLANNED',
    },
    {
      id: 'TO-500947',
      type: 'OUTBOUND',
      materialId: 'MAT-331820',
      materialDescription: 'AGV Battery Pack',
      quantity: 24,
      uom: 'EA',
      plannedTime: '2025-11-07T11:05:00Z',
      dock: 'Dock 05',
      status: 'LOADING',
    },
    {
      id: 'TO-500993',
      type: 'INBOUND',
      materialId: 'MAT-450900',
      materialDescription: 'Safety Relay',
      quantity: 60,
      uom: 'EA',
      plannedTime: '2025-11-07T12:20:00Z',
      dock: 'Dock 04',
      status: 'PLANNED',
    },
  ],
  };
}

