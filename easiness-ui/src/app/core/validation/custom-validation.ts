import { AbstractControl, FormGroup, UntypedFormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ValidatePhoneNo(control: AbstractControl): ValidationErrors | null {
  if (control.value) {
    const mobileNoExp = /^01[3456789]\d{8}$/;
    const telephoneNoExp = /^02\d{7}$/;
    if (mobileNoExp.test(control.value) == false && telephoneNoExp.test(control.value) == false) {
      return { phoneNumberInvalid: true };
    }
  }
  return null;
}

export function ValidatePlace(place: number): ValidatorFn | null {

  return (control: AbstractControl) => {
    if(+control.value === +place) {
      return { samePlaceError: true }
    }
    return null;
  }
  
}

export function calcQuantityUnitError(sellUnit: number | string, stockUnit: number | string, sellQty: number | string, availableQty: number | string, converter: any) {
  sellUnit = +sellUnit;
  stockUnit = +stockUnit;
  sellQty = +sellQty;
  availableQty = +availableQty;
  let error: { invalidQty?: boolean; invalidUnit?: boolean; };
  if (sellUnit === stockUnit) {
    error = sellQty <= availableQty ? null : { invalidQty: true }
  } else {
    try {
      const convertedQty = converter.convert(sellUnit, stockUnit, sellQty);
      error = convertedQty <= availableQty ? null : { invalidQty: true }
    } catch (e) {
      error = { invalidUnit: true }
    }
  }
  return error
}

export function ValidateSaleQuantityUnit(availableQty: number, stockUnit: number, converter: any) {
  return (form: UntypedFormGroup) => {
    const sellQty = form.get('quantity').value;
    const sellUnit = parseInt(form.get('unit').value);

    const error = calcQuantityUnitError(sellUnit, stockUnit, sellQty, availableQty, converter)
    
    form.get('quantity')?.setErrors(error?.invalidQty ? {invalidQty: error?.invalidQty}: null);
    form.get('unit')?.setErrors(error?.invalidUnit ? {invalidUnit: error?.invalidUnit}: null);
    return error;
  };
}

export function ValidateBankTransferAccount() {

  return (form: FormGroup) => {
    const err = +form.get('fromAccount')?.value === +form.get('toAccount')?.value;
    form.get('fromAccount')?.setErrors({ invalidFromToAccount:  err });
    form.get('toAccount')?.setErrors({ invalidFromToAccount:  err });
    return null;
  };
}