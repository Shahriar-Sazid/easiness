import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthIpcService {
  async login(email: string, password: string) {
    try {
      const res = await (window as any).electronAPI.login({ email, password });
      return res;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(email: string, password: string) {
    try {
      const res = await (window as any).electronAPI.register({ email, password });
      return res;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  async currentUser() {
    try {
      const res = await (window as any).electronAPI.currentUser();
      return res;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
}
