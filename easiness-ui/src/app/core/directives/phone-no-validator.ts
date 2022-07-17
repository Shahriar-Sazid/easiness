import { Directive } from "@angular/core";
import { Validator, AbstractControl, NG_VALIDATORS } from "@angular/forms";
import { ValidatePhoneNo } from "../validation/custom-validation";



@Directive({
  selector: "[validPhoneNoDirective]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PhoneNoValidator,
      multi: true,
    },
  ],
})
export class PhoneNoValidator implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return ValidatePhoneNo(control);
  }
}
