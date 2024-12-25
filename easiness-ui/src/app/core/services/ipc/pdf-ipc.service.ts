import { Injectable } from '@angular/core';
import { PDFService } from '../pdf.service';

@Injectable({
  providedIn: 'root'
})
export class PDFIpcService {
  constructor(private pdfService: PDFService) {}

  async open(def: any) {
    // IPC logic to open PDF
    await this.pdfService.open(def);
  }

  getListTemplate(headers: object[], rows: object[], filters: string, width: 'auto' | '*') {
    // IPC logic to get list template
    return this.pdfService.getListTemplate(headers, rows, filters, width);
  }
}
