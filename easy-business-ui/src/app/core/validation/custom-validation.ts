import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export function ValidatePhoneNo(control: AbstractControl): ValidationErrors | null {
  if (control.value) {
    let mobileNoExp = /^01[3456789]\d{8}$/;
    let telephoneNoExp = /^02\d{7}$/;
    if (mobileNoExp.test(control.value) == false && telephoneNoExp.test(control.value) == false) {
      return { phoneNumberInvalid: true };
    }
  }
  return null;
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
      let convertedQty = converter.convert(sellUnit, stockUnit, sellQty);
      error = convertedQty <= availableQty ? null : { invalidQty: true }
    } catch (e) {
      error = { invalidUnit: true }
    }
  }
  return error
}
export function ValidateSaleQuantityUnit(availableQty: number, stockUnit: number, converter: any) {
  return (form: FormGroup) => {
    let sellQty = form.get('quantity').value;
    let sellUnit = parseInt(form.get('unit').value);

    let error = calcQuantityUnitError(sellUnit, stockUnit, sellQty, availableQty, converter)
    
    form.get('quantity')?.setErrors(error?.invalidQty ? {invalidQty: error?.invalidQty}: null);
    form.get('unit')?.setErrors(error?.invalidUnit ? {invalidUnit: error?.invalidUnit}: null);
    return error;
  };
}