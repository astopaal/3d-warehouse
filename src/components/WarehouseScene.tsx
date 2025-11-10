import { Grid } from '@react-three/drei';
import type { SapWarehouse, DerivedShelf, Aisle } from '../types';
import { Shelf } from './Shelf';
import { Zone } from './Zone';
import { AisleFloor } from './AisleFloor';

interface WarehouseSceneProps {
  warehouse: SapWarehouse;
  shelves: DerivedShelf[];
  selectedShelfId: string | null;
  selectedAisleId: string | null;
  showLabels: boolean;
  onSelectShelf: (shelfId: string) => void;
  onSelectAisle: (aisleId: string) => void;
  onBinHover: (bin: any) => void;
  onBinClick: (bin: any) => void;
  clickedBin: any;
}

export function WarehouseScene({
  warehouse,
  shelves,
  selectedShelfId,
  selectedAisleId,
  showLabels,
  onSelectShelf,
  onSelectAisle,
  onBinHover,
  onBinClick,
  clickedBin,
}: WarehouseSceneProps) {
  return (
    <>
      <Grid
        args={[60, 60]}
        cellSize={1.2}
        cellThickness={0.8}
        cellColor="#1a2332"
        sectionSize={6}
        sectionThickness={1.2}
        sectionColor="#246BFD"
        fadeDistance={50}
        fadeStrength={1.5}
      />

      {warehouse.aisles.map((aisle: Aisle) => (
        <AisleFloor key={aisle.id} aisle={aisle} selected={selectedAisleId === aisle.id} onSelect={() => onSelectAisle(aisle.id)} />
      ))}

      {shelves.map((shelf) => (
        <Shelf
          key={shelf.id}
          shelf={shelf}
          selected={selectedShelfId === shelf.id}
          showLabels={showLabels}
          onSelect={() => onSelectShelf(shelf.id)}
          onBinHover={onBinHover}
          onBinClick={onBinClick}
          clickedBin={clickedBin}
        />
      ))}

      {warehouse.zones.map((zone) => (
        <Zone key={zone.id} zone={zone} showLabels={showLabels} />
      ))}
    </>
  );
}

