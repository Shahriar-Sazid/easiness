import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlaceService } from 'src/app/core/services/place.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-save-place',
  templateUrl: './save-place.component.html',
  styleUrls: ['./save-place.component.scss']
})
export class SavePlaceComponent {

  @ViewChild('placeModal') content: any;
  updateMode: boolean;
  placeForm: UntypedFormGroup;
  @Input() callback: () => void;
  @Input() selectedPlace: any;
  constructor(private fb: UntypedFormBuilder,
    public util: UtilService,
    private placeService: PlaceService,
    private toastr: ToastrService,
    private modalService: NgbModal) { }

  openPlaceModal(updateMode: boolean) {
    this.modalService.open(this.content, {
      backdrop: "static",
    });
    if (updateMode) {
      this.updateMode = true;
      this.placeForm = this.fb.group({
        name: [
          this.selectedPlace.name,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        address: [
          this.selectedPlace.address,
          [Validators.minLength(3), Validators.maxLength(100)],
        ],
      });
    } else {
      this.updateMode = false;
      this.placeForm = this.fb.group({
        name: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],

        address: ["", [Validators.minLength(3), Validators.maxLength(100)]],
      });
    }
  }

  addOrUpdatePlace() {
    if (this.util.validateForm(this.placeForm)) {
      console.log(this.placeForm.value);
      if (this.updateMode) {
        // this.spinner.show();
        this.placeService
          .updatePlace({
            id: this.selectedPlace.id,
            ...this.placeForm.value,
          })
          .subscribe(
            (data) => {
              this.callback();
              this.placeForm.reset();
              this.toastr.success('Place updated successfully')
              this.modalService.dismissAll();
            },
            (err) => {
              console.log(err);
              this.toastr.error(err.error.message);
            }
          )
          .add(() => {
            // this.spinner.hide();
          });
      } else {
        // this.spinner.show();
        this.placeService
          .addPlace(this.placeForm.value)
          .subscribe(
            (data) => {
              if (this.callback) {
                this.callback();
              }
              this.toastr.success('Place added successfully')
              this.placeForm.reset();
              this.modalService.dismissAll();
            },
            (err) => {
              console.log(err);
              this.toastr.error(err.error.message);
            }
          )
          .add(() => {
            // this.spinner.hide();
          });
      }
    }
  }


  closePlaceModal() {
    this.placeForm.reset();
    this.modalService.dismissAll();
  }

}
