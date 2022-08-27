import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tx } from 'src/app/core/models/accounting.model';
import { APP_CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-tx-detail',
  templateUrl: './tx-detail.component.html',
  styleUrls: ['./tx-detail.component.scss']
})
export class TxDetailComponent {
  @ViewChild('txDetail') modal: unknown;

  modalRef: any;
  tx: Tx;
  defaultDateFormat = APP_CONFIG.defaultDateFormat;

  constructor(private modalService: NgbModal) { }

  closeModal() {
    this.modalService.dismissAll();
  }

  openModal(tx: Tx) {
    this.tx = tx;
    this.modalRef = this.modalService.open(this.modal, {
      scrollable: true
    });
    this.modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(reason);
    });

  }


}
