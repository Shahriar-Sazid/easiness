import { Injectable } from '@angular/core';
import { LanguageService } from '../language.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageIpcService {
  constructor(private languageService: LanguageService) {}

  async setLanguage(lang) {
    try {
      const res = await (window as any).electronAPI.setLanguage(lang);
      return res;
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  }
}
