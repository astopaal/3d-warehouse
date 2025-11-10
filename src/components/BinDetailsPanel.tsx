import { useEffect, useRef, useMemo } from 'react';
import type { SapStorageBin } from '../types';
import { statusColors } from '../utils/colors';
import { formatRatio, formatTimestamp } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

function generateBarcode(code: string): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 200;
  canvas.height = 80;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const barWidth = 2;
  const barHeight = 60;
  let x = 10;
  
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    const pattern = char.toString(2).padStart(8, '0');
    
    for (let j = 0; j < pattern.length; j++) {
      if (pattern[j] === '1') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, 10, barWidth, barHeight);
      }
      x += barWidth;
    }
    x += 1;
  }
  
  ctx.fillStyle = '#000000';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(code, canvas.width / 2, canvas.height - 5);
  
  return canvas.toDataURL();
}

function generateLabelData(bin: SapStorageBin) {
  const labelNumber = `LBL-${bin.id.replace(/-/g, '').substring(0, 8)}`;
  const barcode = bin.handlingUnit;
  const certificationNumber = `CERT-${bin.batch}-${bin.materialId.substring(0, 6)}`;
  const productionDate = new Date(bin.lastMovement).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
  const expiryDate = bin.nextMovement 
    ? new Date(bin.nextMovement).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      })
    : 'N/A';
  
  return {
    labelNumber,
    barcode,
    certificationNumber,
    productionDate,
    expiryDate,
    barcodeImage: generateBarcode(barcode)
  };
}

interface BinDetailsPanelProps {
  bin: SapStorageBin | null;
  onClose: () => void;
}

export function BinDetailsPanel({ bin, onClose }: BinDetailsPanelProps) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const labelData = useMemo(() => bin ? generateLabelData(bin) : null, [bin]);

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

      {/* Scroll edilebilir içerik */}
      <div className="bin-panel-content">
        <div className="bin-panel-grid">
          {/* Sol sütun */}
          <div className="bin-panel-column">
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
          </div>

          {/* Sağ sütun */}
          <div className="bin-panel-column">
            {/* Ürün Etiketi */}
            {labelData && (
              <div className="bin-panel-label-section">
                <div className="bin-panel-label-header">
                  <span className="bin-panel-label-icon">🏷️</span>
                  <span className="bin-panel-label-title">Product Label</span>
                </div>
                <div className="bin-product-label">
                  <div className="bin-label-header">
                    <div className="bin-label-company">INDUSTRIAL WAREHOUSE</div>
                    <div className="bin-label-number">{labelData.labelNumber}</div>
                  </div>
                  
                  <div className="bin-label-content">
                    <div className="bin-label-product-info">
                      <div className="bin-label-material-name">{bin.materialDescription}</div>
                      <div className="bin-label-material-code">Material: {bin.materialId}</div>
                      <div className="bin-label-batch">Batch: {bin.batch}</div>
                    </div>
                    
                    <div className="bin-label-barcode-section">
                      <img 
                        src={labelData.barcodeImage} 
                        alt="Barcode" 
                        className="bin-label-barcode"
                      />
                      <div className="bin-label-barcode-text">{labelData.barcode}</div>
                    </div>
                  </div>
                  
                  <div className="bin-label-certification">
                    <div className="bin-label-cert-header">✓ CERTIFIED</div>
                    <div className="bin-label-cert-number">Cert: {labelData.certificationNumber}</div>
                    <div className="bin-label-cert-dates">
                      <span>Prod: {labelData.productionDate}</span>
                      <span>Exp: {labelData.expiryDate}</span>
                    </div>
                  </div>
                  
                  <div className="bin-label-footer">
                    <div className="bin-label-quantity">Qty: {bin.quantity} {bin.uom}</div>
                    <div className="bin-label-status" style={{ color: statusColors[bin.status] }}>
                      {bin.status}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt ipucu */}
      <div className="bin-panel-hint">
        💡 Press ESC to close
      </div>
    </div>
  );
}

