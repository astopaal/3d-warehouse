import { useMemo } from 'react';
import type { SapShelf, DerivedShelf, SapBinStatus } from '../types';
import { statusOrder } from '../constants';

export function useShelfCalculations(shelf: SapShelf): DerivedShelf {
  return useMemo(() => {
    const totalQuantity = shelf.bins.reduce((sum, bin) => sum + bin.quantity, 0);
    const totalCapacity = shelf.bins.reduce((sum, bin) => sum + bin.capacity, 0);
    const occupancy = totalCapacity === 0 ? 0 : totalQuantity / totalCapacity;

    const statusBreakdown = statusOrder.reduce(
      (acc, status) => {
        acc[status] = shelf.bins.filter((bin) => bin.status === status).length;
        return acc;
      },
      {} as Record<SapBinStatus, number>,
    );

    return {
      ...shelf,
      totalQuantity,
      totalCapacity,
      occupancy,
      statusBreakdown,
    };
  }, [shelf]);
}

