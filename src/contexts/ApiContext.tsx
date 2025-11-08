import { createContext, useContext, ReactNode } from 'react';
import { WarehouseService } from '../services/WarehouseService';

interface ApiContextType {
  warehouseService: WarehouseService;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const warehouseService = new WarehouseService();

export function ApiProvider({ children }: { children: ReactNode }) {
  const value: ApiContextType = {
    warehouseService,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}

