# 3D Warehouse Digital Twin

A modern 3D warehouse visualization and management system built with React, Three.js, and TypeScript. This digital twin provides real-time monitoring, interactive 3D visualization, and comprehensive warehouse analytics.

![Warehouse Digital Twin](https://img.shields.io/badge/React-19.1.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.180.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## 🚀 Features

### Current Implementation

- **Interactive 3D Visualization**: Full warehouse model with realistic lighting and shadows
- **Dynamic Shelf Management**: 8 shelves with 128 storage bins
- **100+ Material Types**: Comprehensive inventory across multiple categories
- **Real-time Dashboard**: KPIs, occupancy metrics, and sensor telemetry
- **Clickable Aisles**: Interactive corridor navigation with camera focus
- **Status-based Coloring**: Visual indication of bin status (Available, Reserved, Quality, Blocked, Empty)
- **SAP Integration (Mock)**: Realistic SAP data structure with material master, handling units, and transport orders
- **Hover Details**: Real-time bin information on hover
- **Welcome Screen**: Animated onboarding experience
- **Feature Roadmap**: Comprehensive documentation of future enhancements

### Technology Stack

**Frontend:**
- React 19.1.0
- TypeScript 5.8.3
- Three.js 0.180.0
- React Three Fiber 9.4.0
- React Three Drei 10.7.6
- Vite 6.3.5

**3D Rendering:**
- WebGL
- OrbitControls
- Shadow mapping
- Fog effects
- Grid system

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/astopaal/3d-warehouse.git

# Navigate to project directory
cd 3d-warehouse

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 Usage

1. **Camera Controls**:
   - Left-click + drag to rotate
   - Right-click + drag to pan
   - Scroll to zoom
   - Auto-rotate toggle available

2. **Shelf Interaction**:
   - Click on any shelf to view detailed metrics
   - Hover over bins to see material information
   - Click aisles to focus camera

3. **Dashboard**:
   - View overall warehouse KPIs
   - Monitor sensor telemetry
   - Track transport orders
   - Analyze status breakdown

## 📊 Data Structure

### Materials (100 types)
- Electronics & Sensors (20)
- Motors & Drives (15)
- Electrical Components (15)
- Pneumatics & Hydraulics (15)
- Mechanical Parts (15)
- Cables & Wiring (10)
- Safety & Protection (10)

### Warehouse Layout
- 4 Aisles
- 8 Shelves (2 per aisle)
- 4 Levels per shelf
- 4 Bays per level
- 128 Total bins

## 🎯 Future Enhancements

See [FEATURES.md](FEATURES.md) for comprehensive roadmap including:
- IoT & Real-time Data
- Asset Tracking & Automation
- Workforce Management
- Advanced Analytics & AI
- AR/VR Integration
- Enterprise Integration (SAP EWM, ERP, TMS)
- Sustainability & Energy Monitoring
- Security & Compliance
- Collaboration Tools
- Simulation & Optimization

## 🏗️ Project Structure

```
3d-warehouse/
├── src/
│   ├── data/
│   │   ├── materials.ts      # 100 material definitions
│   │   └── warehouse.ts      # Warehouse data & SAP structure
│   ├── App.tsx               # Main application component
│   ├── App.css               # Styling system
│   ├── main.tsx              # Entry point
│   └── index.css             # Base styles
├── public/
│   ├── FEATURES.md           # Feature documentation
│   └── features.html         # Rendered documentation
├── FEATURES.md               # Comprehensive roadmap
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 👤 Author

**Samet TOPAL**
- Facility: Techmax Üretim Depo (Plant TR01)
- Warehouse ID: WH-TR-3000

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

*This is a demonstration project showcasing modern web technologies for warehouse management and digital twin visualization.*
