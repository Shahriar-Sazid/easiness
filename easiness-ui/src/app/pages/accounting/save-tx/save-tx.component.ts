import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SaveTxRequest, TxOptions, TxType } from 'src/app/core/models/accounting.model';
import { AccountingService } from 'src/app/core/services/accounting.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidateBankTransferAccount } from 'src/app/core/validation/custom-validation';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

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
    public accountingService: AccountingService) { }

  ngOnInit() {
    this.txForm = this.fb.group<SaveTxRequest>({
      fromAccount: new FormControl(undefined, Validators.required),
      toAccount: new FormControl(undefined, Validators.required),
      amount: new FormControl(undefined, Validators.required),
      ref: new FormControl(),
      description: new FormControl(),
      people: new FormControl(),
      tag: new FormControl(),
    } as SaveTxRequest, {validators: [ValidateBankTransferAccount()]});

    this.route.params.subscribe(params => {
      this.options = TxType[params.type];
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

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

    goBack() {
      this.location.back();
    }
}
