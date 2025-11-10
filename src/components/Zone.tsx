import { Html } from '@react-three/drei';
import type { WarehouseZone } from '../types';
import { zoneColors } from '../utils/colors';
import { useLanguage } from '../contexts/LanguageContext';

interface ZoneProps {
  zone: WarehouseZone;
  showLabels: boolean;
}

export function Zone({ zone, showLabels }: ZoneProps) {
  const { t } = useLanguage();
  const [x, z] = zone.position;
  const [width, depth] = zone.size;

  const zoneLabels = {
    STAGING: t.zones.inboundStaging,
    DOCK: t.zones.outboundDock,
    CHARGING: t.zones.agvCharging,
  };

  return (
    <group position={[x + width / 2, 0.02, z + depth / 2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={zoneColors[zone.type]} transparent opacity={0.18} />
      </mesh>
      {showLabels && (
        <Html 
          position={[0, 0.1, 0]} 
          center 
          distanceFactor={12} 
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(13, 22, 40, 0.85)',
              color: zoneColors[zone.type],
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: `1px solid ${zoneColors[zone.type]}`,
              boxShadow: `0 0 12px ${zoneColors[zone.type]}40`,
            }}
          >
            {zoneLabels[zone.type]}
          </div>
        </Html>
      )}
    </group>
  );
}

