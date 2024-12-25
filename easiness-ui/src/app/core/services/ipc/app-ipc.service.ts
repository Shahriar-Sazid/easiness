import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppIpcService {
  async toggleSidebar() {
    try {
      const res = await (window as any).electronAPI.toggleSidebar();
      return res;
    } catch (error) {
      console.error('Error toggling sidebar:', error);
      throw error;
    }
  }

  async toggleSidebarPin() {
    try {
      const res = await (window as any).electronAPI.toggleSidebarPin();
      return res;
    } catch (error) {
      console.error('Error toggling sidebar pin:', error);
      throw error;
    }
  }

  async getSidebarStat() {
    try {
      const res = await (window as any).electronAPI.getSidebarStat();
      return res;
    } catch (error) {
      console.error('Error getting sidebar status:', error);
      throw error;
    }
  }
}
