export type SapBinStatus = 'AVAILABLE' | 'RESERVED' | 'QUALITY' | 'BLOCKED' | 'EMPTY';

export interface SapStorageBin {
  id: string;
  shelfId: string;
  aisleId: string;
  level: number;
  bay: number;
  materialId: string;
  materialDescription: string;
  quantity: number;
  capacity: number;
  uom: string;
  batch: string;
  status: SapBinStatus;
  lastMovement: string;
  nextMovement?: string;
  handlingUnit: string;
}

export interface SapShelf {
  id: string;
  aisleId: string;
  label: string;
  bayCount: number;
  levelCount: number;
  depth: number;
  position: { x: number; z: number };
  bins: SapStorageBin[];
  sensors: {
    temperature: number;
    humidity: number;
    vibration: number;
  };
}

export type ZoneType = 'STAGING' | 'DOCK' | 'CHARGING';

export interface WarehouseZone {
  id: string;
  label: string;
  type: ZoneType;
  position: [number, number];
  size: [number, number];
}

export interface TransportOrder {
  id: string;
  type: 'INBOUND' | 'OUTBOUND';
  materialId: string;
  materialDescription: string;
  quantity: number;
  uom: string;
  plannedTime: string;
  dock: string;
  status: 'PLANNED' | 'RELEASED' | 'LOADING';
}

export interface Aisle {
  id: string;
  label: string;
  position: { x: number; z: number };
  width: number;
  length: number;
  shelfIds: string[];
}

export interface SapWarehouse {
  metadata: {
    id: string;
    plant: string;
    storageLocation: string;
    description: string;
    timezone: string;
    manager: string;
  };
  operations: {
    lastSync: string;
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    shift: string;
  };
  shelves: SapShelf[];
  aisles: Aisle[];
  zones: WarehouseZone[];
  transportOrders: TransportOrder[];
}

export interface DerivedShelf extends SapShelf {
  totalQuantity: number;
  totalCapacity: number;
  occupancy: number;
  statusBreakdown: Record<SapBinStatus, number>;
}

