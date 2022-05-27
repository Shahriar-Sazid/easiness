import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { smoothExpandCollapse } from 'src/app/core/animations/animations';
import { Payment } from 'src/app/core/models/purchase.model';
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
  paymentForm: FormGroup;
  @Output() onPaymentProcessed = new EventEmitter();
  comma = ',';

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
      formlist: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.accountService.getAllAccount();
    this.addField();
  }

  formData(): FormArray {
    return this.paymentForm.get('formlist') as FormArray;
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
    let payments: Payment[] = [];
    let validForm = true;
    for (let form of this.formData().controls) {
      // console.log(form);
      validForm = this.util.validateForm(form as FormGroup) && validForm;
    }
    if(validForm) {
      this.formData().controls.forEach(element => {
        let payment: Payment = {
          targetAccount: element.value.targetAccount,
          amount: this.mode == 'from'? -this.util.getNumberFromLocalString(element.value.amount):
          this.util.getNumberFromLocalString(element.value.amount)
        }
        payments.push(payment);
      });
      this.onPaymentProcessed.emit(payments);
      console.log(payments);
    }
  }

}
