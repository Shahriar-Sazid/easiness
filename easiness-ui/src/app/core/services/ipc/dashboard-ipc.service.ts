import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardIpcService {
  async getDashboardData(searchOptions = {}) {
    try {
      const res = await (window as any).electronAPI.getDashboardData(searchOptions);
      return res;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
}
