import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isSidebarPinned = false;
  isSidebarToggeled = false;

  constructor() { }

  toggleSidebar() {
    this.isSidebarToggeled = !this.isSidebarToggeled;
    this.broadcastSidebarState(); // Broadcast the sidebar state after toggling
  }

  toggleSidebarPin() {
    this.isSidebarPinned = !this.isSidebarPinned;
    this.broadcastSidebarState(); // Broadcast the sidebar state after pinning
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled
    }
  }

  private broadcastSidebarState() {
    // Send the current sidebar state to the main process via IPC
    const sidebarState = this.getSidebarStat();
    (window as any).electronAPI.broadcastEvent({ type: 'sidebarStateChanged', payload: sidebarState })
      .catch(error => console.error('Failed to broadcast sidebar state to IPC', error));
  }
}
