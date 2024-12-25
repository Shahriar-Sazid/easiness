import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentIpcService {
  async searchDocument(searchOptions) {
    try {
      const res = await (window as any).electronAPI.searchDocument(searchOptions);
      return res;
    } catch (error) {
      console.error('Error searching document:', error);
      throw error;
    }
  }

  async getDocumentById(id: number) {
    try {
      const res = await (window as any).electronAPI.getDocumentById(id);
      return res;
    } catch (error) {
      console.error('Error getting document by ID:', error);
      throw error;
    }
  }
}
