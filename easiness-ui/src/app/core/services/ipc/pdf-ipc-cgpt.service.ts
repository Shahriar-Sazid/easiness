import { Injectable } from '@angular/core';
type PDFMake = typeof import('pdfmake/build/pdfmake');

@Injectable({ providedIn: 'root' })
export class PDFService {
  private pdfMake: PDFMake;
  private fonts: { [file: string]: string };

  constructor() { }

  async loadPDFMaker() {
    if (!this.pdfMake) {
      this.pdfMake = await import('pdfmake/build/pdfmake');
      this.fonts = (await import('pdfmake/build/vfs_fonts')).pdfMake.vfs;
    }
  }

  async open(def: any) {
    if (!this.pdfMake) {
      try {
        await this.loadPDFMaker();
      } catch (error) {
        console.error("Failed to load pdf maker lib");
      }
    }
    this.pdfMake.createPdf(def, null, null, this.fonts).download();
  }

  getListTemplate(headers: object[], rows: object[], filters: string, width: 'auto' | '*') {
    return {
      pageMargins: [40, 60, 40, 60],
      header: [
        {
          margin: [40, 20],
          table: {
            widths: ['75%', '25%'],
            body: [
              [{ text: [{ text: "Active Filters-> ", bold: true }, filters || '<No Filters>'] }, { text: "Date: ".concat(new Date().toDateString()), alignment: 'right', italics: true }]
            ]
          },
          layout: 'noBorders',
        },
      ],
      content: [
        {
          table: {
            headerRows: 1,
            widths: headers.map(el => width),
            body: [
              headers,
              ...rows
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i: any, node: any) {
              return 0;
            },
            hLineColor: function (i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? '#556ee6' : 'lightgray';
            },
            paddingLeft: function (i: any, node: any) { return 8; },
            paddingRight: function (i: any, node: any) { return 8; },
            paddingTop: function (i: any, node: any) { return 6; },
            paddingBottom: function (i: any, node: any) { return 6; },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black'
        }
      }
    }
  }

  // Add IPC method to interact with Electron
  async getPDFDataFromIPC(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (window as any).electronAPI.getPDFData(data)
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error));
    });
  }
}
