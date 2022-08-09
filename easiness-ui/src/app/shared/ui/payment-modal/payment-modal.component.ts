import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Payment } from 'src/app/core/models/document.model';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import { ConfirmPaymentComponent } from '../confirm-payment/confirm-payment.component';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent {
  @ViewChild('paymentModal') paymentModal: unknown;
  mode: 'from' | 'to' = 'from';
  modalRef: NgbModalRef;
  docId: number;


  constructor(private modalService: NgbModal, private businessService: BusinessService) { }

  closeModal() {
    this.modalService.dismissAll();
  }

  openModal(mode: 'from' | 'to', docId: number) {
    this.mode = mode;
    this.docId = docId;
    this.modalRef = this.modalService.open(this.paymentModal, {
      backdrop: "static",
      scrollable: true
    });
    this.modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(reason);
    });

  }

  initiatePayment(paymentCmp: ConfirmPaymentComponent) {
    paymentCmp.getPaymentData();
  }

  processPayment(payments: Payment[]) {
    this.businessService.processPayment({ payments, docId: this.docId }).subscribe(
      data => {
        console.log(data);
        this.modalService.dismissAll();
        Swal.fire('Good job!', "Payment has been processed successfully", 'success');
        
      }
    )
  }
}
