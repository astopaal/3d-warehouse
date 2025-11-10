import type { SapBinStatus } from '../types';

// Stok boyutları - daha gerçekçi oranlar
export const SLOT_WIDTH = 1.3;
export const SLOT_HEIGHT = 0.85;
export const SLOT_GAP = 0.18;        // Stoklar arası boşluk
export const SHELF_DEPTH = 1.4;      // Daha derin raflar

// Raf yapısı
export const POST_THICKNESS = 0.15;  // Daha kalın demirler
export const BASE_HEIGHT = 0.3;      // Daha kalın taban
export const LEVEL_GAP = 0.2;        // Katlar arası boşluk

// Padding - kenarlardan boşluklar
export const HORIZONTAL_PADDING = 0.25; // Sol-sağ boşluk
export const VERTICAL_PADDING = 0.15;   // Üst-alt boşluk
export const BACK_PANEL_THICKNESS = 0.08; // Arka panel kalınlığı

export const statusOrder: SapBinStatus[] = ['AVAILABLE', 'RESERVED', 'QUALITY', 'BLOCKED', 'EMPTY'];

