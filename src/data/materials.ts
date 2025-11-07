export interface Material {
  id: string;
  description: string;
  uom: string;
  batchPrefix: string;
  category: string;
}

export const materials: Material[] = [
  // Electronics & Sensors (20)
  { id: 'MAT-470010', description: 'Hydraulic Pump Assembly', uom: 'EA', batchPrefix: 'HP-', category: 'Hydraulics' },
  { id: 'MAT-552210', description: 'Precision Gear Set', uom: 'EA', batchPrefix: 'GS-', category: 'Mechanical' },
  { id: 'MAT-775540', description: 'Servo Controller', uom: 'EA', batchPrefix: 'SC-', category: 'Electronics' },
  { id: 'MAT-880120', description: 'Optical Sensor Module', uom: 'EA', batchPrefix: 'OS-', category: 'Electronics' },
  { id: 'MAT-991230', description: 'Pressure Sensor', uom: 'EA', batchPrefix: 'PS-', category: 'Electronics' },
  { id: 'MAT-667890', description: 'LED Indicator Panel', uom: 'EA', batchPrefix: 'LP-', category: 'Electronics' },
  { id: 'MAT-445821', description: 'Proximity Sensor', uom: 'EA', batchPrefix: 'PX-', category: 'Electronics' },
  { id: 'MAT-889123', description: 'Temperature Transmitter', uom: 'EA', batchPrefix: 'TT-', category: 'Electronics' },
  { id: 'MAT-334567', description: 'Level Sensor', uom: 'EA', batchPrefix: 'LS-', category: 'Electronics' },
  { id: 'MAT-778901', description: 'Flow Meter', uom: 'EA', batchPrefix: 'FM-', category: 'Electronics' },
  { id: 'MAT-556789', description: 'Encoder Module', uom: 'EA', batchPrefix: 'EM-', category: 'Electronics' },
  { id: 'MAT-223456', description: 'Touch Screen HMI', uom: 'EA', batchPrefix: 'HMI-', category: 'Electronics' },
  { id: 'MAT-667234', description: 'RFID Reader', uom: 'EA', batchPrefix: 'RF-', category: 'Electronics' },
  { id: 'MAT-445678', description: 'Barcode Scanner', uom: 'EA', batchPrefix: 'BC-', category: 'Electronics' },
  { id: 'MAT-889456', description: 'Vision Camera System', uom: 'EA', batchPrefix: 'VC-', category: 'Electronics' },
  { id: 'MAT-112789', description: 'Ultrasonic Sensor', uom: 'EA', batchPrefix: 'US-', category: 'Electronics' },
  { id: 'MAT-334890', description: 'Laser Distance Sensor', uom: 'EA', batchPrefix: 'LDS-', category: 'Electronics' },
  { id: 'MAT-556123', description: 'Weighing Load Cell', uom: 'EA', batchPrefix: 'LC-', category: 'Electronics' },
  { id: 'MAT-778456', description: 'Accelerometer Module', uom: 'EA', batchPrefix: 'AC-', category: 'Electronics' },
  { id: 'MAT-991567', description: 'Gyroscope Sensor', uom: 'EA', batchPrefix: 'GY-', category: 'Electronics' },

  // Motors & Drives (15)
  { id: 'MAT-556720', description: 'Motor Drive Unit', uom: 'EA', batchPrefix: 'MD-', category: 'Motors' },
  { id: 'MAT-223890', description: 'AC Servo Motor 1kW', uom: 'EA', batchPrefix: 'SM1-', category: 'Motors' },
  { id: 'MAT-445234', description: 'AC Servo Motor 2kW', uom: 'EA', batchPrefix: 'SM2-', category: 'Motors' },
  { id: 'MAT-667567', description: 'AC Servo Motor 5kW', uom: 'EA', batchPrefix: 'SM5-', category: 'Motors' },
  { id: 'MAT-889890', description: 'Stepper Motor', uom: 'EA', batchPrefix: 'ST-', category: 'Motors' },
  { id: 'MAT-112456', description: 'Gearbox Reducer 10:1', uom: 'EA', batchPrefix: 'GB10-', category: 'Motors' },
  { id: 'MAT-334123', description: 'Gearbox Reducer 20:1', uom: 'EA', batchPrefix: 'GB20-', category: 'Motors' },
  { id: 'MAT-556890', description: 'Variable Frequency Drive', uom: 'EA', batchPrefix: 'VFD-', category: 'Motors' },
  { id: 'MAT-778123', description: 'Motor Brake Assembly', uom: 'EA', batchPrefix: 'MB-', category: 'Motors' },
  { id: 'MAT-991234', description: 'Motor Cooling Fan', uom: 'EA', batchPrefix: 'MCF-', category: 'Motors' },
  { id: 'MAT-223567', description: 'Coupling Flexible', uom: 'EA', batchPrefix: 'CF-', category: 'Motors' },
  { id: 'MAT-445890', description: 'Motor Mount Bracket', uom: 'EA', batchPrefix: 'MMB-', category: 'Motors' },
  { id: 'MAT-667123', description: 'Linear Actuator', uom: 'EA', batchPrefix: 'LA-', category: 'Motors' },
  { id: 'MAT-889234', description: 'Rotary Actuator', uom: 'EA', batchPrefix: 'RA-', category: 'Motors' },
  { id: 'MAT-112890', description: 'Belt Drive Assembly', uom: 'EA', batchPrefix: 'BDA-', category: 'Motors' },

  // Electrical Components (15)
  { id: 'MAT-123890', description: 'Circuit Breaker', uom: 'EA', batchPrefix: 'CB-', category: 'Electrical' },
  { id: 'MAT-450900', description: 'Safety Relay', uom: 'EA', batchPrefix: 'SR-', category: 'Electrical' },
  { id: 'MAT-112340', description: 'Thermal Relay', uom: 'EA', batchPrefix: 'TR-', category: 'Electrical' },
  { id: 'MAT-223450', description: 'Emergency Stop Button', uom: 'EA', batchPrefix: 'ES-', category: 'Electrical' },
  { id: 'MAT-334678', description: 'Contactor 3-Phase', uom: 'EA', batchPrefix: 'CT-', category: 'Electrical' },
  { id: 'MAT-556234', description: 'Power Supply 24VDC', uom: 'EA', batchPrefix: 'PS24-', category: 'Electrical' },
  { id: 'MAT-778890', description: 'Power Supply 12VDC', uom: 'EA', batchPrefix: 'PS12-', category: 'Electrical' },
  { id: 'MAT-991678', description: 'Terminal Block', uom: 'SET', batchPrefix: 'TB-', category: 'Electrical' },
  { id: 'MAT-223789', description: 'DIN Rail', uom: 'M', batchPrefix: 'DR-', category: 'Electrical' },
  { id: 'MAT-445567', description: 'Cable Gland', uom: 'EA', batchPrefix: 'CG-', category: 'Electrical' },
  { id: 'MAT-778340', description: 'Cable Connector Set', uom: 'SET', batchPrefix: 'CC-', category: 'Electrical' },
  { id: 'MAT-667456', description: 'Industrial Plug', uom: 'EA', batchPrefix: 'IP-', category: 'Electrical' },
  { id: 'MAT-889567', description: 'Socket Outlet', uom: 'EA', batchPrefix: 'SO-', category: 'Electrical' },
  { id: 'MAT-112678', description: 'Busbar Copper', uom: 'M', batchPrefix: 'BB-', category: 'Electrical' },
  { id: 'MAT-334234', description: 'Fuse Holder', uom: 'EA', batchPrefix: 'FH-', category: 'Electrical' },

  // Pneumatics & Hydraulics (15)
  { id: 'MAT-889012', description: 'Pneumatic Valve', uom: 'EA', batchPrefix: 'PV-', category: 'Pneumatics' },
  { id: 'MAT-445670', description: 'Filter Cartridge', uom: 'EA', batchPrefix: 'FC-', category: 'Pneumatics' },
  { id: 'MAT-992410', description: 'Lubricant Cartridge', uom: 'BOX', batchPrefix: 'LC-', category: 'Hydraulics' },
  { id: 'MAT-556456', description: 'Pneumatic Cylinder 50mm', uom: 'EA', batchPrefix: 'PC50-', category: 'Pneumatics' },
  { id: 'MAT-778678', description: 'Pneumatic Cylinder 100mm', uom: 'EA', batchPrefix: 'PC100-', category: 'Pneumatics' },
  { id: 'MAT-991890', description: 'Air Regulator', uom: 'EA', batchPrefix: 'AR-', category: 'Pneumatics' },
  { id: 'MAT-223123', description: 'Air Filter', uom: 'EA', batchPrefix: 'AF-', category: 'Pneumatics' },
  { id: 'MAT-445234', description: 'Solenoid Valve 5/2', uom: 'EA', batchPrefix: 'SV52-', category: 'Pneumatics' },
  { id: 'MAT-667789', description: 'Solenoid Valve 3/2', uom: 'EA', batchPrefix: 'SV32-', category: 'Pneumatics' },
  { id: 'MAT-889678', description: 'Quick Coupling', uom: 'EA', batchPrefix: 'QC-', category: 'Pneumatics' },
  { id: 'MAT-112234', description: 'Pneumatic Hose 6mm', uom: 'M', batchPrefix: 'PH6-', category: 'Pneumatics' },
  { id: 'MAT-334567', description: 'Pneumatic Hose 8mm', uom: 'M', batchPrefix: 'PH8-', category: 'Pneumatics' },
  { id: 'MAT-556678', description: 'Pressure Switch', uom: 'EA', batchPrefix: 'PSW-', category: 'Pneumatics' },
  { id: 'MAT-778234', description: 'Vacuum Pump', uom: 'EA', batchPrefix: 'VP-', category: 'Pneumatics' },
  { id: 'MAT-991456', description: 'Vacuum Gripper', uom: 'EA', batchPrefix: 'VG-', category: 'Pneumatics' },

  // Mechanical Parts (15)
  { id: 'MAT-334520', description: 'Industrial Bearing', uom: 'EA', batchPrefix: 'IB-', category: 'Mechanical' },
  { id: 'MAT-110430', description: 'Stainless Fastener Kit', uom: 'SET', batchPrefix: 'FK-', category: 'Mechanical' },
  { id: 'MAT-556345', description: 'Ball Bearing 6205', uom: 'EA', batchPrefix: 'BB6205-', category: 'Mechanical' },
  { id: 'MAT-778567', description: 'Ball Bearing 6206', uom: 'EA', batchPrefix: 'BB6206-', category: 'Mechanical' },
  { id: 'MAT-991789', description: 'Roller Bearing', uom: 'EA', batchPrefix: 'RB-', category: 'Mechanical' },
  { id: 'MAT-223345', description: 'Thrust Bearing', uom: 'EA', batchPrefix: 'TB-', category: 'Mechanical' },
  { id: 'MAT-445456', description: 'Linear Bearing', uom: 'EA', batchPrefix: 'LB-', category: 'Mechanical' },
  { id: 'MAT-667234', description: 'Shaft 20mm x 500mm', uom: 'EA', batchPrefix: 'SH20-', category: 'Mechanical' },
  { id: 'MAT-889345', description: 'Shaft 30mm x 500mm', uom: 'EA', batchPrefix: 'SH30-', category: 'Mechanical' },
  { id: 'MAT-112567', description: 'Pulley V-Belt', uom: 'EA', batchPrefix: 'PU-', category: 'Mechanical' },
  { id: 'MAT-334789', description: 'Timing Belt', uom: 'M', batchPrefix: 'TMB-', category: 'Mechanical' },
  { id: 'MAT-556234', description: 'Chain Roller', uom: 'M', batchPrefix: 'CH-', category: 'Mechanical' },
  { id: 'MAT-778901', description: 'Sprocket Wheel', uom: 'EA', batchPrefix: 'SP-', category: 'Mechanical' },
  { id: 'MAT-991123', description: 'Keyway Stock', uom: 'M', batchPrefix: 'KW-', category: 'Mechanical' },
  { id: 'MAT-223678', description: 'Set Screw M8', uom: 'BOX', batchPrefix: 'SS8-', category: 'Mechanical' },

  // Cables & Wiring (10)
  { id: 'MAT-218640', description: 'Control Panel Harness', uom: 'EA', batchPrefix: 'CH-', category: 'Cables' },
  { id: 'MAT-445789', description: 'Power Cable 3x2.5mm', uom: 'M', batchPrefix: 'PC25-', category: 'Cables' },
  { id: 'MAT-667345', description: 'Power Cable 3x4mm', uom: 'M', batchPrefix: 'PC4-', category: 'Cables' },
  { id: 'MAT-889123', description: 'Signal Cable 4x0.5mm', uom: 'M', batchPrefix: 'SC05-', category: 'Cables' },
  { id: 'MAT-112890', description: 'Ethernet Cable Cat6', uom: 'M', batchPrefix: 'EC6-', category: 'Cables' },
  { id: 'MAT-334456', description: 'Fiber Optic Cable', uom: 'M', batchPrefix: 'FOC-', category: 'Cables' },
  { id: 'MAT-556567', description: 'Coaxial Cable RG58', uom: 'M', batchPrefix: 'RG58-', category: 'Cables' },
  { id: 'MAT-778678', description: 'USB Cable Type-B', uom: 'EA', batchPrefix: 'USB-', category: 'Cables' },
  { id: 'MAT-991789', description: 'Servo Motor Cable', uom: 'M', batchPrefix: 'SMC-', category: 'Cables' },
  { id: 'MAT-223890', description: 'Encoder Cable', uom: 'M', batchPrefix: 'ENC-', category: 'Cables' },

  // Safety & Protection (10)
  { id: 'MAT-331820', description: 'AGV Battery Pack', uom: 'EA', batchPrefix: 'BP-', category: 'Power' },
  { id: 'MAT-667430', description: 'Smart Sensor Kit', uom: 'KIT', batchPrefix: 'SS-', category: 'Electronics' },
  { id: 'MAT-445123', description: 'Safety Light Curtain', uom: 'EA', batchPrefix: 'SLC-', category: 'Safety' },
  { id: 'MAT-667890', description: 'Safety Mat Sensor', uom: 'EA', batchPrefix: 'SMS-', category: 'Safety' },
  { id: 'MAT-889234', description: 'Safety Interlock Switch', uom: 'EA', batchPrefix: 'SIS-', category: 'Safety' },
  { id: 'MAT-112456', description: 'Warning Beacon LED', uom: 'EA', batchPrefix: 'WB-', category: 'Safety' },
  { id: 'MAT-334789', description: 'Safety Relay Module', uom: 'EA', batchPrefix: 'SRM-', category: 'Safety' },
  { id: 'MAT-556123', description: 'Machine Guard Panel', uom: 'EA', batchPrefix: 'MG-', category: 'Safety' },
  { id: 'MAT-778456', description: 'Lock-out Tag-out Kit', uom: 'KIT', batchPrefix: 'LOTO-', category: 'Safety' },
  { id: 'MAT-991567', description: 'Fire Extinguisher CO2', uom: 'EA', batchPrefix: 'FE-', category: 'Safety' },
];

