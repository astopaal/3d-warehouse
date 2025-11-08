import { useState, useEffect } from 'react';
import type { SapWarehouse } from '../types';
import { useApi } from '../contexts/ApiContext';

export function useWarehouse() {
  const { warehouseService } = useApi();
  const [warehouse, setWarehouse] = useState<SapWarehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadWarehouse();
  }, []);

  const loadWarehouse = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseService.getWarehouseData();
      setWarehouse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setError(null);
      const data = await warehouseService.refreshWarehouseData();
      setWarehouse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  return {
    warehouse,
    loading,
    error,
    refresh,
  };
}

