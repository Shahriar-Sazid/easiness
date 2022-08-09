import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { smoothExpandCollapse } from 'src/app/core/animations/animations';
import { Payment } from 'src/app/core/models/document.model';
import { AccountService } from 'src/app/core/services/account.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss'],
  animations: [
    smoothExpandCollapse(0, 0, 100, 'payInOut')
  ]
})
export class ConfirmPaymentComponent implements OnInit {
  @Input() mode: 'from'| 'to' = 'to';
  @Input() inModal;
  paymentForm: FormGroup;
  @Output() onPaymentProcessed = new EventEmitter<Payment[]>();

  modeOptions = {
    from: {
      label: "From Account",
      cssClass: 'text-danger'
    },
    to: {
      label: "To Account",
      cssClass: 'text-success'
    }
  }

  constructor(private fb: FormBuilder,
    public accountService: AccountService,
    public util: UtilService) {
    this.paymentForm = this.fb.group({
      formList: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.accountService.getAllAccount();
    this.addField();
  }

  formData(): FormArray {
    return this.paymentForm.get('formList') as FormArray;
  }

  field(): FormGroup {
    return this.fb.group({
      targetAccount: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });
  }

  removeField(i: number) {
    this.formData().removeAt(i);
  }

  addField() {
    this.formData().push(this.field());
  }

  getPaymentData() {
    const payments: Payment[] = [];
    let validForm = true;
    for (const form of this.formData().controls) {
      // console.log(form);
      validForm = this.util.validateForm(form as FormGroup) && validForm;
    }
    if(validForm) {
      this.formData().controls.forEach(element => {
        const payment: Payment = {
          amount: this.mode == 'from'? -this.util.getNumberFromLocalString(element.value.amount):
          this.util.getNumberFromLocalString(element.value.amount)
        } as Payment;
        if(this.mode === 'from') {
          payment.fromAccount = element.value.targetAccount;
        } else if(this.mode === 'to') {
          payment.toAccount = element.value.targetAccount;
        }
        payments.push(payment);
      });
      this.onPaymentProcessed.emit(payments);
      console.log(payments);
    }
  }

}
