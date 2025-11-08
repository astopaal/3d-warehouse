import { useMemo } from 'react';
import type { SapWarehouse } from '../types';
import { formatPercentage, formatShift } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  warehouse: SapWarehouse;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
}

export function Dashboard({ warehouse, autoRotate, onToggleAutoRotate }: DashboardProps) {
  const { t, language, setLanguage } = useLanguage();

  const stats = useMemo(() => {
    const totalQuantity = warehouse.shelves.reduce((sum, shelf) => sum + shelf.bins.reduce((s, bin) => s + bin.quantity, 0), 0);
    const totalCapacity = warehouse.shelves.reduce((sum, shelf) => sum + shelf.bins.reduce((s, bin) => s + bin.capacity, 0), 0);
    const occupancy = totalCapacity === 0 ? 0 : totalQuantity / totalCapacity;
    const readyBins = warehouse.shelves.reduce((sum, shelf) => sum + shelf.bins.filter((b) => b.status === 'AVAILABLE').length, 0);
    const avgTemp = warehouse.shelves.reduce((sum, shelf) => sum + shelf.sensors.temperature, 0) / warehouse.shelves.length;

    return { totalQuantity, totalCapacity, occupancy, readyBins, avgTemp };
  }, [warehouse]);

  const orderLabels = {
    INBOUND: t.orders.inbound,
    OUTBOUND: t.orders.outbound,
  };

  const orderStatusLabels = {
    PLANNED: t.orders.planned,
    RELEASED: t.orders.released,
    LOADING: t.orders.loading,
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">{t.dashboard.title}</h1>
          <div className="dashboard-subtitle">
            {warehouse.metadata.description} • {warehouse.metadata.manager}
          </div>
        </div>
        <button className="lang-toggle" onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}>
          {language === 'en' ? '🇹🇷 TR' : '🇬🇧 EN'}
        </button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">{t.dashboard.overallOccupancy}</div>
          <div className="kpi-value">{formatPercentage(stats.occupancy)}</div>
          <div className="kpi-bar">
            <div className="kpi-fill" style={{ width: formatPercentage(stats.occupancy) }} />
          </div>
          <div className="kpi-subtext">
            {stats.totalQuantity.toLocaleString('en-US')} {t.dashboard.unitsStored}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">{t.dashboard.availableCapacity}</div>
          <div className="kpi-value">{(stats.totalCapacity - stats.totalQuantity).toLocaleString('en-US')}</div>
          <div className="kpi-subtext">{stats.readyBins} {t.dashboard.binsReady}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">{t.dashboard.inboundStaging}</div>
          <div className="kpi-value">{warehouse.aisles.length}</div>
          <div className="kpi-subtext">{t.dashboard.aislesMonitored}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">{t.dashboard.ambientTemperature}</div>
          <div className="kpi-value">{stats.avgTemp.toFixed(1)}°C</div>
          <div className="kpi-subtext">{formatPercentage((stats.avgTemp - 15) / 10)} {t.dashboard.filled}</div>
        </div>
      </div>

      <div className="status-indicators">
        <div className="status-badge active">✓ {t.dashboard.autoReplenishment}</div>
        <div className="status-badge active">📡 {t.dashboard.realtimeSensor}</div>
        <div className="status-badge clickable" onClick={onToggleAutoRotate}>
          {autoRotate ? '⏸' : '▶'} {t.dashboard.autoRotate}
        </div>
      </div>

      <div className="transport-section">
        <div className="section-header">{t.dashboard.upcomingMovements}</div>
        <div className="transport-list">
          {warehouse.transportOrders.map((order) => (
            <div key={order.id} className="transport-item">
              <div className="transport-header">
                <span className={`transport-type ${order.type.toLowerCase()}`}>{orderLabels[order.type]}</span>
                <span className={`transport-status ${order.status.toLowerCase()}`}>{orderStatusLabels[order.status]}</span>
              </div>
              <div className="transport-material">{order.materialDescription}</div>
              <div className="transport-details">
                {order.quantity} {order.uom} • {order.dock} • {formatShift(order.plannedTime)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sync-status">
        <span className="sync-icon">🔄</span>
        <span className="sync-text">{t.dashboard.syncedAt}</span>
        <span className="sync-time">{formatShift(warehouse.operations.lastSync)}</span>
      </div>
    </div>
  );
}

