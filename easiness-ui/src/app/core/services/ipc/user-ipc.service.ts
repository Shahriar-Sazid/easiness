import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserIpcService {
  async getAll() {
    try {
      const res = await (window as any).electronAPI.getAllUsers();
      return res;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async register(user) {
    try {
      const res = await (window as any).electronAPI.registerUser(user);
      return res;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
