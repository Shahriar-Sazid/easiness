import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Account } from 'src/app/core/models/accounting.model';
import { AccountingService } from 'src/app/core/services/accounting.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-save-account',
  templateUrl: './save-account.component.html',
  styleUrls: ['./save-account.component.scss']
})
export class SaveAccountComponent {
  @ViewChild('accountModal') accountModal: any;
  updateMode: boolean;
  @Input() selectedAccount: Account;
  @Output() onAccountSaved: EventEmitter<void> = new EventEmitter();
  accountForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,
    public util: UtilService,
    private accountService: AccountingService,
    private modalService: NgbModal) { }

  addOrUpdateAccount() {
    if (this.util.validateForm(this.accountForm)) {
      console.log(this.accountForm.value);
      if (this.updateMode) {
        // this.spinner.show();
        this.accountService
          .updateAccount({
            id: this.selectedAccount.id,
            ...this.accountForm.value,
          })
          .subscribe(
            (data) => {
              this.onAccountSaved.emit();
              Swal.fire('Good job!', 'Account updated successfully', 'success');
              this.accountForm.reset();
              this.modalService.dismissAll();
            },
            (err) => {
              console.log(err);
              Swal.fire('Failed!', err.error.message, 'error');
            }
          )
          .add(() => {
            // this.spinner.hide();
          });
      } else {
        // this.spinner.show();
        this.accountService
          .addAccount(this.accountForm.value)
          .subscribe(
            (data) => {
              this.onAccountSaved.emit();
              Swal.fire('Good job!', 'Account updated successfully', 'success');
              this.accountForm.reset();
              this.modalService.dismissAll();
            },
            (err) => {
              console.log(err);
              Swal.fire('Failed!', err.error.message, 'error');
            }
          )
          .add(() => {
            // this.spinner.hide();
          });
      }
    }
  }

  closeAccountModal() {
    this.accountForm.reset();
    this.modalService.dismissAll();
  }

  openAccountModal(updateMode: boolean) {
    this.modalService.open(this.accountModal, {
      backdrop: "static",
    });
    if (updateMode) {
      this.updateMode = true;
      this.accountForm = this.fb.group({
        accountName: [
          this.selectedAccount.accountName,
          [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
        ],
        holderName: [this.selectedAccount.holderName, [Validators.minLength(3), Validators.maxLength(30)]],
        bank: [this.selectedAccount.bank, [Validators.minLength(2), Validators.maxLength(30)]],
        branch: [this.selectedAccount.branch, [Validators.minLength(8), Validators.maxLength(30)]],
        accountNo: [this.selectedAccount.accountNo, [Validators.minLength(5), Validators.maxLength(30)]],
        balance: [
          this.selectedAccount.balance,
          [Validators.required, Validators.min(-100000000), Validators.max(100000000)],
        ],
      });
    } else {
      this.updateMode = false;
      this.accountForm = this.fb.group({
        accountName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        holderName: ["", [Validators.minLength(3), Validators.maxLength(30)]],
        bank: ["", [Validators.minLength(2), Validators.maxLength(30)]],
        branch: ["", [Validators.minLength(8), Validators.maxLength(30)]],
        accountNo: ["", [Validators.minLength(5), Validators.maxLength(30)]],
        balance: [0, [Validators.required, Validators.min(-100000000), Validators.max(100000000)]],
      });
    }
  }
}
