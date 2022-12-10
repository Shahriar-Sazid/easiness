import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { People } from 'src/app/core/models/people.model';
import { Document, DocumentOptions, DocumentType } from 'src/app/core/models/document.model';
import { PeopleService } from 'src/app/core/services/people.service';
import { PDFService } from 'src/app/core/services/pdf.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DatePipe } from '@angular/common';
import { UnitPipe } from 'src/app/core/pipes/unit.pipe';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
  providers: [UnitPipe]
})
export class DocumentHeaderComponent implements OnDestroy, OnInit {
  @Input() viewOptions: DocumentOptions;
  @Input() doc: Document;
  @Input() people: People;
  @Input() editPermission: boolean;
  constructor(private peopleService: PeopleService,
    private pdfService: PDFService,
    private utils: UtilService,
    private datePipe: DatePipe,
    private unitPipe: UnitPipe
  ) { }

  ngOnInit() {
    if (!this.people.id) {
      this.peopleService.initSupplierSelectedSubject();
      this.peopleService.peopleSelected.subscribe(
        res => {
          this.peopleService.getPeopleById(+res).subscribe(
            data => {
              this.people.contactNumber = data.contactNoList.map(el => el.number).join("\n");
              this.people = data;
            }
          )
        }
      )
    } else {
      this.people.contactNumber = this.people.contactNoList.map(el => el.number).join("\n");
    }
  }

  ngOnDestroy(): void {
    this.peopleService.peopleSelected?.unsubscribe();
  }

  download(): void {
    const isInvoice = this.doc.type === DocumentType.INVOICE

    const primaryColor = isInvoice ? '#34c38f' : '#f46a6a'
    const secondaryColor = isInvoice ? '#5a5555' : '#5a5555'
    const bgColor = isInvoice ? '#ebf9f5' : '#fdf0f0'
    let rows = []
    for (const item of this.doc.items) {
      if (isInvoice) {
        rows.push([
          this.utils.filterAndJoin([
            item.entity.name, item.entity.type, item.entity.brand, item.entity.country, item.entity.size
          ]),
          item.price,
          `${item.quantity} ${this.unitPipe.transform(item.unit)}`,
          (item.price * item.quantity).toFixed(2),
        ])
      } else {
        rows.push([
          this.utils.filterAndJoin([
            item.entity.name, item.entity.type, item.entity.brand, item.entity.country, item.entity.size
          ]),
          item.cost,
          `${item.quantity} ${this.unitPipe.transform(item.unit)}`,
          (item.cost * item.quantity).toFixed(2),
        ])
      }
    }


    let date = this.datePipe.transform(this.doc.date, 'MMM dd, yyyy hh:mm a')
    let today = this.datePipe.transform(new Date(), 'MMM dd, yyyy hh:mm a')
    let invoiceNo = this.doc?.id?.toString().padStart(7, '0')

    let docMetaRows = [[{ text: 'ABDULLAH TOOLS', style: 'boldText', fontSize: 14, color: primaryColor }, { text: this.people.name, style: 'boldText', fontSize: 14, color: primaryColor }],
    [{ text: 'Nawabpur, Dhaka Tower\nDhaka, 1100\nPhone: 017704882270', style: 'boldText', color: secondaryColor }, {
      text: this.utils.filterAndJoin([this.people.companyName, this.people.address, this.people.contactNumber], '\n'), style: 'boldText', color: secondaryColor
    }]]

    if (!isInvoice) {
      for (let i = 0; i < docMetaRows.length; i++) {
        const element = docMetaRows[i];
        let temp = element[0]
        element[0] = element[1]
        element[1] = temp
      }
    }

    const grandTotal = this.doc.items.reduce((prev, cur) => {
      prev = prev + ((isInvoice ? +cur.price : +cur.cost) * +cur.quantity)
      return prev
    }, 0)
    rows.push([{ text: "TOTAL", style: "boldText", colSpan: 3, alignment: 'right' }, {}, {}, { text: grandTotal, colSpan: 1 }])

    let dd = {
      pageMargins: [40, 240, 40, 60],
      header: (currentPage: number, pageCount: number, pageSize: number) => {
        console.log(currentPage, pageCount, pageSize);
        return [
          {
            margin: [40, 20],
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    image: 'logo',
                    fit: [145, 115]
                  },
                  {
                    table: {
                      widths: ['auto', '*'],
                      body: [
                        [{ text: `${isInvoice ? "INVOICE" : "PURCHASE ORDER"} #${invoiceNo}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, ''],
                        [{ text: 'Page', style: 'boldText' }, { text: `${currentPage.toString()} of  ${pageCount}`, color: secondaryColor, fontSize: 10, alignment: 'right' }],
                        [{ text: 'Date', style: 'boldText' }, { text: date, color: secondaryColor, fontSize: 10, alignment: 'right' }],
                        [{ text: 'Generated On', style: 'boldText' }, { text: today, color: secondaryColor, fontSize: 10, alignment: 'right' }],
                      ]
                    },
                    layout: {
                      hLineWidth: function (i: number, node: any) {
                        return i === 0 ? 0 : 1;
                      },
                      vLineWidth: function (i: any, node: any) {
                        return 0;
                      },
                      hLineColor: function (i: number, node: any) {
                        return primaryColor;
                      },
                      paddingTop: function (i: any, node: any) { return 5; },
                      paddingBottom: function (i: any, node: any) { return 5; },
                    }
                  },
                ],
                [
                  {
                    colSpan: 2,
                    table: {
                      widths: ['50%', '50%'],
                      body: [
                        ...docMetaRows
                      ]
                    },
                    layout: {
                      hLineWidth: function (i: number, node: any) {
                        return 0
                      },
                      vLineWidth: function (i: any, node: any) {
                        return 0
                      },
                      paddingLeft: function (i: any, node: any) { return 8; },
                      paddingRight: function (i: any, node: any) { return 8; },
                      paddingTop: function (i: any, node: any) { return i === 0 ? 10 : 1; },
                      paddingBottom: function (i: any, node: any) { return i === (node.table.widths.length - 1) ? 10 : 1; },
                      fillColor: function (rowIndex, node, columnIndex) { return bgColor }
                    }
                  }, {},
                ],
              ],
            },
            layout: 'noBorders',
          },
        ]
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: ["50%", "16%", "16%", "18%"],
            color: 'gray',
            body: [
              [{ text: "Details", style: "tableHeader" },
              { text: `Unit ${isInvoice ? 'Price' : 'Cost'}`, style: "tableHeader" },
              { text: "Quantity", style: "tableHeader" },
              { text: "Total", style: "tableHeader" }],
              ...rows,
            ],
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? 1.25 : .5;
            },
            vLineWidth: function (i: any, node: any) {
              return 0;
            },
            hLineColor: function (i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? primaryColor : 'lightgray';
            },
            paddingLeft: function (i: any, node: any) { return 8; },
            paddingRight: function (i: any, node: any) { return 8; },
            paddingTop: function (i: any, node: any) { return 6; },
            paddingBottom: function (i: any, node: any) { return 6; },
          },
        },
      ],

      styles: {
        boldText: {
          bold: true,
          fontSize: 10,
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          fillColor: bgColor,
          color: primaryColor
        }
      },
      images: {
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAADmCAIAAAD+0h/3AAAG+GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjMwIgogICB0aWZmOkltYWdlV2lkdGg9IjI5MCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIKICAgeG1wOkNyZWF0b3JUb29sPSJDYW52YSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjItMTEtMDFUMTA6Mzk6MzUrMDY6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMTEtMDFUMTA6Mzk6MzUrMDY6MDAiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyOTAiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMzAiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4KICAgPEF0dHJpYjpBZHM+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIEF0dHJpYjpDcmVhdGVkPSIyMDIyLTExLTAxIgogICAgICBBdHRyaWI6RXh0SWQ9ImU3NGMxMDQ3LTY0YjYtNDMzYy04M2FjLTVlNWE0ZTk4NzM2NCIKICAgICAgQXR0cmliOkZiSWQ9IjUyNTI2NTkxNDE3OTU4MCIKICAgICAgQXR0cmliOlRvdWNoVHlwZT0iMiIvPgogICAgPC9yZGY6U2VxPgogICA8L0F0dHJpYjpBZHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5TaGFocmlhciBBaG1lZDwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+QWJkdWxsYWggdG9vbHMgLSAxPC9yZGY6bGk+CiAgICA8L3JkZjpBbHQ+CiAgIDwvZGM6dGl0bGU+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InByb2R1Y2VkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZmZpbml0eSBQaG90byAxLjEwLjQiCiAgICAgIHN0RXZ0OndoZW49IjIwMjItMTEtMDFUMTA6Mzk6MzUrMDY6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1w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"
      }
    }
    this.pdfService.open(dd)
  }
}
