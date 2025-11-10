export type Language = 'en' | 'tr';

export interface Translations {
  welcome: {
    title: string;
    subtitle: string;
    hint: string;
  };
  legend: {
    available: string;
    reserved: string;
    quality: string;
    blocked: string;
    empty: string;
  };
  dashboard: {
    title: string;
    overallOccupancy: string;
    availableCapacity: string;
    inboundStaging: string;
    ambientTemperature: string;
    unitsStored: string;
    binsReady: string;
    aislesMonitored: string;
    filled: string;
    autoReplenishment: string;
    realtimeSensor: string;
    autoRotate: string;
    upcomingMovements: string;
    syncedAt: string;
  };
  shelf: {
    selectToInspect: string;
    selectDescription: string;
    shelfId: string;
    utilized: string;
    unitsInStock: string;
    temperature: string;
    humidity: string;
    vibration: string;
    quantity: string;
    batch: string;
    handlingUnit: string;
    lastMovement: string;
    nextMovement: string;
    pinned: string;
  };
  zones: {
    inboundStaging: string;
    outboundDock: string;
    agvCharging: string;
  };
  orders: {
    inbound: string;
    outbound: string;
    planned: string;
    released: string;
    loading: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    welcome: {
      title: 'Hold and slide to move the camera',
      subtitle: 'Click shelfs to inspect',
      hint: 'Press F11 for fullscreen • Best experience',
    },
    legend: {
      available: 'AVAILABLE',
      reserved: 'RESERVED',
      quality: 'QUALITY',
      blocked: 'BLOCKED',
      empty: 'EMPTY',
    },
    dashboard: {
      title: 'Warehouse Digital Twin',
      overallOccupancy: 'Overall Occupancy',
      availableCapacity: 'Available Capacity',
      inboundStaging: 'Inbound Staging',
      ambientTemperature: 'Ambient Temperature',
      unitsStored: 'units stored',
      binsReady: 'bins ready',
      aislesMonitored: 'aisles monitored',
      filled: 'filled',
      autoReplenishment: 'Auto-replenishment active',
      realtimeSensor: 'Realtime sensor telemetry',
      autoRotate: 'Auto rotate camera',
      upcomingMovements: 'Upcoming Movements',
      syncedAt: 'SAP TM queue synced',
    },
    shelf: {
      selectToInspect: 'Click a shelf to show details',
      selectDescription: 'Select any shelf in the warehouse to inspect real-time metrics, inventory levels, and sensor data',
      shelfId: 'Shelf ID',
      utilized: 'utilized',
      unitsInStock: 'Units in stock',
      temperature: 'Temperature',
      humidity: 'Humidity',
      vibration: 'Vibration',
      quantity: 'Quantity',
      batch: 'Batch',
      handlingUnit: 'Handling Unit',
      lastMovement: 'Last Movement',
      nextMovement: 'Next Movement',
      pinned: 'Pinned',
    },
    zones: {
      inboundStaging: 'Inbound Staging',
      outboundDock: 'Outbound Dock',
      agvCharging: 'AGV Charging',
    },
    orders: {
      inbound: 'INBOUND',
      outbound: 'OUTBOUND',
      planned: 'PLANNED',
      released: 'RELEASED',
      loading: 'LOADING',
    },
  },
  tr: {
    welcome: {
      title: 'Kamerayı hareket ettirmek için tutup sürükle',
      subtitle: 'Detayları görmek için raflara tıkla',
      hint: 'Tam ekran için F11 • En iyi deneyim',
    },
    legend: {
      available: 'MÜSAIT',
      reserved: 'REZERVE',
      quality: 'KALİTE',
      blocked: 'BLOKE',
      empty: 'BOŞ',
    },
    dashboard: {
      title: 'Depo Dijital İkizi',
      overallOccupancy: 'Genel Doluluk',
      availableCapacity: 'Müsait Kapasite',
      inboundStaging: 'Giriş Alanı',
      ambientTemperature: 'Ortam Sıcaklığı',
      unitsStored: 'birim depolanmış',
      binsReady: 'bin hazır',
      aislesMonitored: 'koridor izleniyor',
      filled: 'dolu',
      autoReplenishment: 'Otomatik ikmal aktif',
      realtimeSensor: 'Gerçek zamanlı sensör telemetrisi',
      autoRotate: 'Otomatik döndür',
      upcomingMovements: 'Yaklaşan Hareketler',
      syncedAt: 'SAP TM kuyruğu senkronize',
    },
    shelf: {
      selectToInspect: 'Detayları görmek için bir rafa tıkla',
      selectDescription: 'Gerçek zamanlı metrikleri, envanter seviyelerini ve sensör verilerini incelemek için depodaki herhangi bir rafı seçin',
      shelfId: 'Raf ID',
      utilized: 'kullanılıyor',
      unitsInStock: 'Stokta birim',
      temperature: 'Sıcaklık',
      humidity: 'Nem',
      vibration: 'Titreşim',
      quantity: 'Miktar',
      batch: 'Parti',
      handlingUnit: 'Taşıma Birimi',
      lastMovement: 'Son Hareket',
      nextMovement: 'Sonraki Hareket',
      pinned: 'Sabitlendi',
    },
    zones: {
      inboundStaging: 'Giriş Alanı',
      outboundDock: 'Çıkış Rıhtımı',
      agvCharging: 'AGV Şarj',
    },
    orders: {
      inbound: 'GİRİŞ',
      outbound: 'ÇIKIŞ',
      planned: 'PLANLI',
      released: 'SERBEST',
      loading: 'YÜKLEME',
    },
  },
};

