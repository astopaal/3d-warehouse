import type { SapBinStatus, ZoneType } from '../types';

export const statusColors: Record<SapBinStatus, string> = {
  AVAILABLE: '#3c9dff',
  RESERVED: '#f7ba3e',
  QUALITY: '#b37feb',
  BLOCKED: '#ff5c7a',
  EMPTY: '#49546d',
};

export const zoneColors: Record<ZoneType, string> = {
  STAGING: '#246BFD',
  DOCK: '#13c2c2',
  CHARGING: '#fa8c16',
};

export function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((component) => component.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function blendColors(from: string, to: string, ratio: number) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  return rgbToHex({
    r: start.r + (end.r - start.r) * ratio,
    g: start.g + (end.g - start.g) * ratio,
    b: start.b + (end.b - start.b) * ratio,
  });
}

export function getOccupancyColor(value: number) {
  if (value >= 0.9) return '#ff5c7a';
  if (value >= 0.75) return '#f7ba3e';
  if (value >= 0.55) return '#36cfc9';
  if (value >= 0.3) return '#3c9dff';
  return '#5b8cfa';
}

