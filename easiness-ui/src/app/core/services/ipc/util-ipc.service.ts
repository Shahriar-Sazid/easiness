import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilIpcService {
  async convertObjToQueryString(obj: any): Promise<string> {
    try {
      const res = await (window as any).electronAPI.convertObjToQueryString(obj);
      return res;
    } catch (error) {
      console.error('Error converting object to query string:', error);
      throw error;
    }
  }

  async deepTrim(obj: object) {
    try {
      const res = await (window as any).electronAPI.deepTrim(obj);
      return res;
    } catch (error) {
      console.error('Error deep trimming object:', error);
      throw error;
    }
  }

  async removeEmpty(obj: object): Promise<object> {
    try {
      const res = await (window as any).electronAPI.removeEmpty(obj);
      return res;
    } catch (error) {
      console.error('Error removing empty properties:', error);
      throw error;
    }
  }

  async buildActiveFilters(obj: any, keyNameMap: any): Promise<string> {
    try {
      const res = await (window as any).electronAPI.buildActiveFilters(obj, keyNameMap);
      return res;
    } catch (error) {
      console.error('Error building active filters:', error);
      throw error;
    }
  }
}
