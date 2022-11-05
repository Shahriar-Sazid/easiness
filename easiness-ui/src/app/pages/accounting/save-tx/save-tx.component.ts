import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SaveTxRequest, TxOptions, TxType } from 'src/app/core/models/accounting.model';
import { Payment } from 'src/app/core/models/document.model';
import { PaymentTx } from 'src/app/core/models/payment.model';
import { AccountingService } from 'src/app/core/services/accounting.service';
import { BusinessService } from 'src/app/core/services/business.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidateBankTransferAccount } from 'src/app/core/validation/custom-validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-save-tx',
  templateUrl: './save-tx.component.html',
  styleUrls: ['./save-tx.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveTxComponent implements OnInit {
  options: TxOptions = {} as TxOptions;
  txForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public util: UtilService,
    public peopleService: PeopleService,
    private route: ActivatedRoute,
    private location: Location,
    private businessService: BusinessService,
    public accountingService: AccountingService) { }

  ngOnInit() {
    this.txForm = this.fb.group<SaveTxRequest>({
      fromAccount: new FormControl(undefined, Validators.required),
      toAccount: new FormControl(undefined, Validators.required),
      amount: new FormControl(undefined, Validators.required),
      ref: new FormControl(),
      description: new FormControl(),
      people: new FormControl(),
    } as SaveTxRequest, { validators: [ValidateBankTransferAccount()] });

    this.route.params.subscribe(params => {
      this.options = TxType[params.type];
      for (const key in this.options.view) {
        if (Object.prototype.hasOwnProperty.call(this.options.view, key)) {
          if (!this.options.view[key]) {
            this.txForm.removeControl(key);
          }
        }
      }
    })
  }

  goBack() {
    this.location.back();
  }

  save() {
    let req: PaymentTx
    switch (this.options.key) {
      case TxType.INCOME.key:
        req = {
          peopleId: this.txForm.value.people,
          ref: this.txForm.value.ref,
          purpose: this.txForm.value.description,
          payments: [{
            toAccount: +this.txForm.value.toAccount,
            amount: +(this.txForm.value.amount.replaceAll(",", "")),
          } as Payment],
        } as PaymentTx
        break
      case TxType.EXPENSE.key:
        req = {
          peopleId: this.txForm.value.people,
          ref: this.txForm.value.ref,
          purpose: this.txForm.value.description,
          payments: [{
            fromAccount: +this.txForm.value.fromAccount,
            amount: +(this.txForm.value.amount.replaceAll(",", "")),
          } as Payment],
        } as PaymentTx
        break
      case TxType.BANK_TRANSFER.key:
        req = {
          peopleId: this.txForm.value.people,
          ref: this.txForm.value.ref,
          purpose: this.txForm.value.description,
          payments: [{
            fromAccount: +this.txForm.value.fromAccount,
            toAccount: +this.txForm.value.toAccount,
            amount: +(this.txForm.value.amount.replaceAll(",", "")),
          } as Payment],
        } as PaymentTx
        break
      default:
        break;
    }
    this.businessService.processPayment(req).subscribe(
      data => {
        console.log(data);
        Swal.fire('Good job!', "Transaction recorded successfully", 'success').then(() => {
          this.goBack()
        });
      })
  }
}
