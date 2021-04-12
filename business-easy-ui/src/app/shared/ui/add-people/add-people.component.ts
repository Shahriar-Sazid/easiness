import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Validators, FormArray, FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ValidatePhoneNo } from "src/app/core/helpers/validation/custom-validator/phone-no-validator";
import { PeopleService } from "src/app/core/services/people.service";
import { UtilService } from "src/app/core/services/util.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-people",
  templateUrl: "./add-people.component.html",
  styleUrls: ["./add-people.component.scss"],
})
export class AddPeopleComponent implements OnInit {
  @ViewChild('peopleModal') content: any;
  updateMode: boolean;
  peopleForm: FormGroup;
  @Input('callback') callback: Function;
  @Input('selectedPeople') selectedPeople: any;
  constructor(private fb: FormBuilder,
    public util: UtilService,
    private peopleService: PeopleService,
    private modalService: NgbModal) {}

  ngOnInit(): void {}
  openPeopleModal(updateMode: boolean) {
    this.modalService.open(this.content, {
      backdrop: "static",
    });
    if (updateMode) {
      this.updateMode = true;
      this.peopleForm = this.fb.group({
        name: [
          this.selectedPeople.name,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        address: [
          this.selectedPeople.address,
          [Validators.minLength(3), Validators.maxLength(100)],
        ],
        email: [this.selectedPeople.email, [Validators.email]],
        type: [this.selectedPeople.type, [Validators.required]],

        companyName: [
          this.selectedPeople.companyName,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],

        balance: [
          this.selectedPeople.balance,
          [
            Validators.required,
            Validators.min(-100000000),
            Validators.max(100000000),
          ],
        ],

        contactNo: new FormArray(
          this.selectedPeople.contactNoList.map(
            (contactNo) =>
              new FormControl(contactNo.contactNo, [
                Validators.required,
                ValidatePhoneNo,
              ])
          )
        ),
      });
    } else {
      this.updateMode = false;
      this.peopleForm = this.fb.group({
        name: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        companyName: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        address: ["", [Validators.minLength(3), Validators.maxLength(100)]],
        email: ["", [Validators.email]],
        type: ["BOTH", [Validators.required]],
        balance: [
          0,
          [
            Validators.required,
            Validators.min(-100000000),
            Validators.max(100000000),
          ],
        ],

        contactNo: new FormArray([
          new FormControl("", [Validators.required, ValidatePhoneNo]),
        ]),
      });
    }
  }

  addOrUpdatePeople() {
    if (this.util.validateForm(this.peopleForm)) {
      console.log(this.peopleForm.value);
      if (this.updateMode) {
        // this.spinner.show();
        this.peopleService
          .updatePeople({
            id: this.selectedPeople.id,
            ...this.peopleForm.value,
          })
          .subscribe(
            (data) => {
              this.callback();
              this.peopleForm.reset();
              Swal.fire('Good job!', 'People updated successfully', 'success');
              this.modalService.dismissAll();
            },
            (err) => {
              console.log(err);
              Swal.fire('Failed!', 'err.error.message', 'error');
            }
          )
          .add(() => {
            // this.spinner.hide();
          });
      } else {
        // this.spinner.show();
        this.peopleService
          .addPeople(this.peopleForm.value)
          .subscribe(
            (data) => {
              this.callback();
              Swal.fire('Good job!', 'People added successfully', 'success');
              this.peopleForm.reset();
              this.modalService.dismissAll();
            },
            (err) => {
              console.log(err);
              Swal.fire('Failed!', 'err.error.message', 'error');
            }
          )
          .add(() => {
            // this.spinner.hide();
          });
      }
    }
  }


  closePeopleModal() {
    this.peopleForm.reset();
    this.modalService.dismissAll();
  }

  get phoneNo() {
    return this.peopleForm.get("contactNo") as FormArray;
  }

  addPhoneNo() {
    this.phoneNo.push(
      new FormControl("", [Validators.required, ValidatePhoneNo])
    );
  }
}
