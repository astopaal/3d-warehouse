import type { DerivedShelf, SapStorageBin } from '../types';
import { statusOrder } from '../constants';
import { statusColors } from '../utils/colors';
import { formatPercentage, formatRatio, formatTimestamp } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

interface ShelfDetailsProps {
  shelf: DerivedShelf | null;
  hoveredBin: SapStorageBin | null;
  clickedBin?: SapStorageBin | null;
}

export function ShelfDetails({ shelf, hoveredBin, clickedBin }: ShelfDetailsProps) {
  const { t } = useLanguage();
  
  // Tıklanmış bin varsa onu göster, yoksa hover edilen bin'i göster
  const displayBin = clickedBin || hoveredBin;

  if (!shelf) {
    return (
      <div className="shelf-details">
        <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.6 }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{t.shelf.selectToInspect}</h3>
          <p style={{ fontSize: '13px', color: '#8a94a6', lineHeight: '1.5' }}>{t.shelf.selectDescription}</p>
        </div>
      </div>
    );
  }

  const statusLabels = {
    AVAILABLE: t.legend.available,
    RESERVED: t.legend.reserved,
    QUALITY: t.legend.quality,
    BLOCKED: t.legend.blocked,
    EMPTY: t.legend.empty,
  };

  return (
    <div className="shelf-details">
      <div className="detail-header">
        <div className="detail-title">{shelf.label}</div>
        <div className="detail-subtitle">
          {t.shelf.shelfId}: <span style={{ color: '#3c9dff' }}>{shelf.id}</span>
        </div>
      </div>

      <div className="detail-metric">
        <div className="metric-label">Occupancy</div>
        <div className="metric-value">{formatPercentage(shelf.occupancy)}</div>
        <div className="metric-bar">
          <div className="metric-fill" style={{ width: formatPercentage(shelf.occupancy) }} />
        </div>
        <div className="metric-subtext">
          {shelf.totalQuantity.toLocaleString('en-US')} / {shelf.totalCapacity.toLocaleString('en-US')} {t.shelf.utilized}
        </div>
      </div>

      <div className="detail-section">
        <div className="section-title">{t.shelf.unitsInStock}</div>
        <div className="status-grid">
          {statusOrder.map((status) => (
            <div key={status} className="status-item">
              <div className="status-indicator" style={{ background: statusColors[status] }} />
              <div className="status-label">{statusLabels[status]}</div>
              <div className="status-count">{shelf.statusBreakdown[status]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <div className="section-title">Sensors</div>
        <div className="sensor-grid">
          <div className="sensor-item">
            <div className="sensor-icon">🌡️</div>
            <div className="sensor-label">{t.shelf.temperature}</div>
            <div className="sensor-value">{shelf.sensors.temperature.toFixed(1)}°C</div>
          </div>
          <div className="sensor-item">
            <div className="sensor-icon">💧</div>
            <div className="sensor-label">{t.shelf.humidity}</div>
            <div className="sensor-value">{shelf.sensors.humidity}%</div>
          </div>
          <div className="sensor-item">
            <div className="sensor-icon">📳</div>
            <div className="sensor-label">{t.shelf.vibration}</div>
            <div className="sensor-value">{shelf.sensors.vibration.toFixed(3)}g</div>
          </div>
        </div>
      </div>

      {displayBin && (
        <div className={`detail-section ${clickedBin ? 'bin-clicked' : 'bin-hover'}`}>
          <div className="section-title" style={{ color: statusColors[displayBin.status] }}>
            {displayBin.id}
            {clickedBin && <span style={{ marginLeft: '8px', fontSize: '11px', opacity: 0.7 }}>📌 {t.shelf.pinned || 'Pinned'}</span>}
          </div>
          <div className="bin-info">
            <div className="bin-material">{displayBin.materialDescription}</div>
            <div className="bin-row">
              <span className="bin-label">{t.shelf.quantity}:</span>
              <span className="bin-value">{formatRatio(displayBin.quantity, displayBin.capacity, displayBin.uom)}</span>
            </div>
            <div className="bin-row">
              <span className="bin-label">{t.shelf.batch}:</span>
              <span className="bin-value">{displayBin.batch}</span>
            </div>
            <div className="bin-row">
              <span className="bin-label">{t.shelf.handlingUnit}:</span>
              <span className="bin-value">{displayBin.handlingUnit}</span>
            </div>
            <div className="bin-row">
              <span className="bin-label">{t.shelf.lastMovement}:</span>
              <span className="bin-value">{formatTimestamp(displayBin.lastMovement)}</span>
            </div>
            {displayBin.nextMovement && (
              <div className="bin-row">
                <span className="bin-label">{t.shelf.nextMovement}:</span>
                <span className="bin-value">{formatTimestamp(displayBin.nextMovement)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

