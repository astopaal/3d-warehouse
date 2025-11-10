import { useEffect, useRef } from 'react';
import type { SapStorageBin } from '../types';
import { statusColors } from '../utils/colors';
import { formatRatio, formatTimestamp } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

interface BinDetailsPanelProps {
  bin: SapStorageBin | null;
  onClose: () => void;
}

export function BinDetailsPanel({ bin, onClose }: BinDetailsPanelProps) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && bin) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [bin, onClose]);

  if (!bin) return null;

  return (
    <div className="bin-details-panel" ref={panelRef}>
      {/* Üst başlık - kapatma butonu ile */}
      <div className="bin-panel-header">
        <div className="bin-panel-title-row">
          <div 
            className="bin-status-dot" 
            style={{ background: statusColors[bin.status] }}
          />
          <h3 className="bin-panel-title">{bin.id}</h3>
        </div>
        <button className="bin-panel-close" onClick={onClose} title="Close (ESC)">
          ✕
        </button>
      </div>

      {/* Materyal bilgisi */}
      <div className="bin-panel-section">
        <div className="bin-panel-material">{bin.materialDescription}</div>
        <div className="bin-panel-material-id">{bin.materialId}</div>
      </div>

      {/* Miktar bilgisi - büyük gösterim */}
      <div className="bin-panel-quantity">
        <div className="bin-panel-quantity-label">{t.shelf.quantity}</div>
        <div className="bin-panel-quantity-value">
          {formatRatio(bin.quantity, bin.capacity, bin.uom)}
        </div>
        <div className="bin-panel-capacity-bar">
          <div 
            className="bin-panel-capacity-fill"
            style={{ 
              width: `${(bin.quantity / bin.capacity) * 100}%`,
              background: statusColors[bin.status]
            }}
          />
        </div>
      </div>

      {/* Detaylı bilgiler - kompakt grid */}
      <div className="bin-panel-details">
        <div className="bin-panel-detail-row">
          <span className="bin-panel-label">{t.shelf.batch}</span>
          <span className="bin-panel-value">{bin.batch}</span>
        </div>
        
        <div className="bin-panel-detail-row">
          <span className="bin-panel-label">{t.shelf.handlingUnit}</span>
          <span className="bin-panel-value">{bin.handlingUnit}</span>
        </div>

        <div className="bin-panel-detail-row">
          <span className="bin-panel-label">Status</span>
          <span 
            className="bin-panel-status-badge"
            style={{ 
              background: `${statusColors[bin.status]}20`,
              color: statusColors[bin.status],
              border: `1px solid ${statusColors[bin.status]}40`
            }}
          >
            {bin.status}
          </span>
        </div>
      </div>

      {/* Zaman bilgileri */}
      <div className="bin-panel-timeline">
        <div className="bin-panel-timeline-item">
          <div className="bin-panel-timeline-icon">📅</div>
          <div className="bin-panel-timeline-content">
            <div className="bin-panel-timeline-label">{t.shelf.lastMovement}</div>
            <div className="bin-panel-timeline-value">{formatTimestamp(bin.lastMovement)}</div>
          </div>
        </div>

        {bin.nextMovement && (
          <div className="bin-panel-timeline-item">
            <div className="bin-panel-timeline-icon">🔜</div>
            <div className="bin-panel-timeline-content">
              <div className="bin-panel-timeline-label">{t.shelf.nextMovement}</div>
              <div className="bin-panel-timeline-value">{formatTimestamp(bin.nextMovement)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Alt ipucu */}
      <div className="bin-panel-hint">
        💡 Press ESC to close
      </div>
    </div>
  );
}

