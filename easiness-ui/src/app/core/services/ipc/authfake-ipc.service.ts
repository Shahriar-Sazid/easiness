import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthfakeIpcService {
  async login(email: string, password: string) {
    try {
      const res = await (window as any).electronAPI.login({ email, password });
      return res;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const res = await (window as any).electronAPI.logout();
      return res;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  get currentUserValue() {
    return (window as any).electronAPI.currentUserValue();
  }
}
