import type { SapBinStatus, SapStorageBin } from '../types';
import { statusColors } from './colors';
import { blendColors } from './colors';

export function getBinColor(bin: SapStorageBin) {
  const fillRatio = bin.capacity === 0 ? 0 : Math.min(1, bin.quantity / bin.capacity);
  return blendColors('#0d1628', statusColors[bin.status], fillRatio);
}

export function calculateStatusBreakdown(bins: SapStorageBin[], statusOrder: SapBinStatus[]) {
  return statusOrder.reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {} as Record<SapBinStatus, number>,
  );
}

