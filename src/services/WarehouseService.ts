import type { SapWarehouse } from '../types';
import { generateWarehouseData } from '../data/warehouse';

export class WarehouseService {
  private mockDelay = 800;

  private simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.mockDelay));
  }

  async getWarehouseData(): Promise<SapWarehouse> {
    await this.simulateNetworkDelay();
    return generateWarehouseData();
  }

  async refreshWarehouseData(): Promise<SapWarehouse> {
    await this.simulateNetworkDelay();
    return generateWarehouseData();
  }

  async updateShelfSensor(shelfId: string, sensorType: string, value: number): Promise<void> {
    await this.simulateNetworkDelay();
    console.log(`Updated ${sensorType} for shelf ${shelfId} to ${value}`);
  }

  async getShelfDetails(shelfId: string): Promise<any> {
    await this.simulateNetworkDelay();
    const data = generateWarehouseData();
    return data.shelves.find((s) => s.id === shelfId);
  }
}

