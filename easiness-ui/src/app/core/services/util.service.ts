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
    const str = [];
    for (const p in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, p)) {
        if (obj[p]) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
    }
    return str.length > 0 ? "?" + str.join("&") : "";
  }

  deepTrim(obj: object) {
    for (const prop in obj) {
      const value = obj[prop],
        type = typeof value;
      if (value && (type == "string" || type == "object") && Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (type == "object") {
          this.deepTrim(obj[prop]);
        } else {
          obj[prop] = obj[prop].trim();
        }
      }
    }
  }

  removeEmpty(obj: object) {
    return Object.entries(obj)
      .filter(([_, v]) => v)
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? this.removeEmpty(v) : v }),
        {}
      );
  }

  buildActiveFilters(obj: any, keyNameMap: any): string {
    let activeFilters = "";
    for (const key in keyNameMap) {
      const value = obj[key],
        type = typeof value;
      if (value && type == "string" && Object.prototype.hasOwnProperty.call(keyNameMap, key)) {
        activeFilters += `${keyNameMap[key]}: ${value}; `;
      }
    }
    if (activeFilters.endsWith("; ")) {
      activeFilters = activeFilters.substr(0, activeFilters.length - 2);
    }
    return activeFilters;
  }

  downLoadFile(data: any, type: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == "undefined") {
      alert("Please disable your Pop-up blocker and try again.");
    }
  }

  getValidationError(form: FormGroup, control: string) {
    const formControl = form.get(control);
    for (const msg of this.validationMessage) {
      if (formControl?.hasError(msg.type) && formControl?.touched === true) {
        return msg.message;
      }
    }
  }

  validateForm(form: FormGroup): boolean {
    let validForm = true;
    for (const [control] of Object.entries(form.controls)) {
      if (form.get(control).invalid) {
        form.get(control).markAsTouched();
        // this.getValidationError(form, control);
        validForm = false;
      }
    }
    return validForm;
  }

  getNgbToday() {
    const now = new Date();
    return new NgbDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
  }

  convertArrayToObject<Type>(arr: Type[], key: string): Record<string, Type> {
    return arr.reduce((acc, curr) => (acc[curr[key]] = curr, acc), {});
  }

  convertObjectToArray(obj: object): any[] {
    return Object.values(obj);
  }

  getNumberFromLocalString(str: string) {
    return parseFloat(str.split(",").join(""));
  }

  mdiv(dividend: number, divisor: number) {
    return [Math.floor(dividend / divisor), dividend % divisor];
  }

  readablePeriod(ms: number, max_units = 2) {
    const [yy, yr] = this.mdiv(ms, 3.154e10);
    const [mm, mr] = this.mdiv(yr, 2.628e9);
    const [dd, dr] = this.mdiv(mr, 8.64e7);
    const [hh, hr] = this.mdiv(dr, 3.6e6);
    const [tt, ss] = this.mdiv(hr, 6e4);

    const text = ['year', 'month', 'day', 'hour', 'minute'];
    const res = [];
    [yy, mm, dd, hh, tt].forEach((tis, ii) => {
      if (res.length === max_units) { return }
      if (tis !== 0) {
        res.push(tis === 1 ? `${tis}${text[ii]}` : `${tis}${text[ii]}s`);
      }
    });
    return res.length === 0 ? '' : res.join(' ') + ' ago';
  }


  clone(target, map = new WeakMap()) {

    // clone primitive types
    if (typeof target != "object" || target == null) {
      return target;
    }

    const type = this.toRawType(target);
    let cloneTarget = null;


    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);

    // clone Set
    if (type == "Set") {
      cloneTarget = new Set();
      target.forEach(value => {
        cloneTarget.add(this.clone(value, map));
      });
      return cloneTarget;
    }

    // clone Map
    if (type == "Map") {
      cloneTarget = new Map();
      target.forEach((value, key) => {
        cloneTarget.set(key, this.clone(value, map));
      });
      return cloneTarget;
    }

    // clone Array
    if (type == "Array") {
      cloneTarget = [];
      this.forEach(target, (value, index) => {
        cloneTarget[index] = this.clone(value, map);
      })
    }

    // clone normal Object
    if (type == "Object") {
      cloneTarget = new Object();
      this.forEach(Object.keys(target), (key, index) => {
        cloneTarget[key] = this.clone(target[key], map);
      })
    }

    return cloneTarget;
  }

  forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
      iteratee(array[index], index);
    }
    return array;
  }

  toRawType(value) {
    const _toString = Object.prototype.toString;
    const str = _toString.call(value)
    return str.slice(8, -1)
  }
  constructor() {
    //implement me
   }
}
