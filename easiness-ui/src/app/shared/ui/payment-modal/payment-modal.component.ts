import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPaymentComponent } from '../confirm-payment/confirm-payment.component';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent {
  @ViewChild(ConfirmPaymentComponent) paymentCmp: ConfirmPaymentComponent;
  @ViewChild('paymentModal') paymentModal: unknown;
  mode: 'from'| 'to' = 'from';
  modalRef: NgbModalRef;


  constructor(private modalService: NgbModal) { }

  closeModal() {
    this.modalService.dismissAll();
  }

  openModal(mode: 'from'| 'to') {
    this.mode = mode;

    this.modalRef = this.modalService.open(this.paymentModal, {
      backdrop: "static",
      scrollable: true
    });
    this.modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
      this.paymentCmp.paymentForm.reset();
    }, (reason) => {
      console.log(reason);
    });

  }
}
