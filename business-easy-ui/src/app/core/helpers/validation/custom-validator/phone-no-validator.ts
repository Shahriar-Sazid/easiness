import { Directive } from "@angular/core";
import { Validator, AbstractControl, NG_VALIDATORS } from "@angular/forms";

export function ValidatePhoneNo(control: AbstractControl): { [key: string]: any } | null {
  if (control.value) {
    let mobileNoExp = /^01[3456789]\d{8}$/;
    let telephoneNoExp = /^02\d{7}$/;
    if (mobileNoExp.test(control.value) == false && telephoneNoExp.test(control.value) == false) {
      return { phoneNumberInvalid: true };
    }
  }
  return null;
}

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
