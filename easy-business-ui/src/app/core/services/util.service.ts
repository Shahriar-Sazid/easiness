import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { validationMessages } from "../helpers/validation/validation-message";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  validationMessage = validationMessages;

  convertObjToQueryString(obj: any): string {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (obj[p]) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
    }
    return str.length > 0 ? "?" + str.join("&") : "";
  }

  deepTrim(obj: object) {
    for (let prop in obj) {
      let value = obj[prop],
        type = typeof value;
      if (value && (type == "string" || type == "object") && obj.hasOwnProperty(prop)) {
        if (type == "object") {
          this.deepTrim(obj[prop]);
        } else {
          obj[prop] = obj[prop].trim();
        }
      }
    }
  }

  buildActiveFilters(obj: any, keyNameMap: any): string {
    let activeFilters = "";
    for (let key in keyNameMap) {
      let value = obj[key],
        type = typeof value;
      if (value && type == "string" && keyNameMap.hasOwnProperty(key)) {
        activeFilters += `${keyNameMap[key]}: ${value}; `;
      }
    }
    if (activeFilters.endsWith("; ")) {
      activeFilters = activeFilters.substr(0, activeFilters.length - 2);
    }
    return activeFilters;
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == "undefined") {
      alert("Please disable your Pop-up blocker and try again.");
    }
  }

  getValidationError(form: FormGroup, control: string) {
    let formControl = form.get(control);
    for (let msg of this.validationMessage) {
      if (formControl.hasError(msg.type) && formControl.touched === true) {
        return msg.message;
      }
    }
  }

  validateForm(form: FormGroup): boolean {
    let isValidForm = true;
    for (let [control] of Object.entries(form.controls)) {
      if (form.get(control).invalid) {
        form.get(control).markAsTouched();
        this.getValidationError(form, control);
        isValidForm = false;
      }
    }
    return isValidForm;
  }

  getNgbToday() {
    let now = new Date();
    return new NgbDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
  }

  convertArrayToObject<Type>(arr: Type[], key: string) : Record<string, Type> {
    return arr.reduce((acc, curr) => (acc[curr[key]] = curr, acc), {});
  }

  convertObjectToArray(obj: object): any[] {
    return Object.values(obj);
  }

  constructor() { }
}
