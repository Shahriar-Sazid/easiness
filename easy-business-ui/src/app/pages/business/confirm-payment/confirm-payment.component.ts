import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss'],
  animations: [
    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0
        })
      ),
      transition("void <=> *", animate(200))
    ])
  ]
})
export class ConfirmPaymentComponent implements OnInit {
  @Input() mode: 'from'| 'to' = 'to';
  form: FormGroup;
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

  constructor(private fb: FormBuilder, public accountService: AccountService) {
    this.form = this.fb.group({
      formlist: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.accountService.getAllAccount();
    this.addField();
  }

  formData(): FormArray {
    return this.form.get('formlist') as FormArray;
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

}
