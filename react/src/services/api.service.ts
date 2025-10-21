import { apiUrl } from '../../../shared/config'
import type { Location } from '../../../shared/interfaces'

export const apiService = {
  async fetchLocations(): Promise<Location[]> {
    const response = await fetch(apiUrl.locations);
    return response.json();
  },

  async deleteLocation(id: number): Promise<void> {
    const response = await fetch(`${apiUrl.locations}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}
