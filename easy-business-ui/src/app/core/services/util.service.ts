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
      if (formControl?.hasError(msg.type) && formControl?.touched === true) {
        return msg.message;
      }
    }
  }

  validateForm(form: FormGroup): boolean {
    let validForm = true;
    for (let [control] of Object.entries(form.controls)) {
      if (form.get(control).invalid) {
        form.get(control).markAsTouched();
        // this.getValidationError(form, control);
        validForm = false;
      }
    }
    return validForm;
  }

  getNgbToday() {
    let now = new Date();
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
    let [yy, yr] = this.mdiv(ms, 3.154e10);
    let [mm, mr] = this.mdiv(yr, 2.628e9);
    let [dd, dr] = this.mdiv(mr, 8.64e7);
    let [hh, hr] = this.mdiv(dr, 3.6e6);
    let [tt, ss] = this.mdiv(hr, 6e4);

    var ymdht = ['year', 'month', 'day', 'hour', 'minute'];
    let res = [];
    [yy, mm, dd, hh, tt].forEach((tis, ii) => {
      if (res.length === max_units) { return };
      if (tis !== 0) {
        res.push(tis === 1 ? `${tis}${ymdht[ii]}` : `${tis}${ymdht[ii]}s`);
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
      cloneTarget = new Array();
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
    let _toString = Object.prototype.toString;
    let str = _toString.call(value)
    return str.slice(8, -1)
  }
  constructor() { }
}
