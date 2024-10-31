import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['en', 'es', 'de', 'it', 'ru'];

  constructor(public translate: TranslateService, private cookieService: CookieService) {
    let browserLang;
    this.translate.addLangs(this.languages);
    
    // Check for saved language in cookies or use browser language
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    } else {
      browserLang = translate.getBrowserLang();
    }
    
    translate.use(browserLang.match(/en|es|de|it|ru/) ? browserLang : 'en');
    
    // Sync initial language state with IPC
    (window as any).electronAPI.getLanguage()
      .then((lang: string) => this.setLanguage(lang))
      .catch(() => console.error('Failed to retrieve language from IPC'));
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);

    // Send the new language setting to the main process via IPC
    (window as any).electronAPI.setLanguage(lang)
      .catch(error => console.error('Failed to set language in IPC', error));
  }
}
