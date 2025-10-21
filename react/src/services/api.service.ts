import { apiUrl } from '../../../shared/config';
import type { Location } from '../../../shared/interfaces';

export const apiService = {
  async fetchLocations(): Promise<Location[]> {
    const response = await fetch(apiUrl.locations);
    return response.json();
  },

  async createLocation(data: { name: string; lat: number; lon: number }): Promise<Location[]> {
    console.log('Sending data:', data);
    const response = await fetch(apiUrl.locations, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteLocation(id: number): Promise<void> {
    const response = await fetch(`${apiUrl.locations}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};
