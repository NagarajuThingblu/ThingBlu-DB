import { Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../../shared/models/app.constants';
import { SelectItem } from 'primeng/api';


//#region Handle Errors Service
@Injectable()
export class DropdwonTransformService {

  constructor() {  }

  transform(array: any[], labelKey: string | string[], valueKey?: string, placeholder?: string, IsSorted: boolean = true): SelectItem[] {
    if (!array || !labelKey) { return undefined; }
    let tmpArray;

    if (labelKey instanceof Array) {
      if (labelKey && valueKey) {
        tmpArray = array.map( (arrayValue) => ({ label: arrayValue[labelKey[1]], value: arrayValue[valueKey] }));
      } else if (labelKey && !valueKey) {
        tmpArray = array.map( (arrayValue) => ({ label: arrayValue[labelKey[1]], value: arrayValue }));
      }
      for (let j = 2; j < labelKey.length; j++) {
        if (labelKey && valueKey) {
          tmpArray = array.map( (arrayValue, i) => ({ label: tmpArray[i].label + labelKey[0] + arrayValue[labelKey[j]], value: arrayValue[valueKey] }));
        } else if (labelKey && !valueKey) {
          tmpArray = array.map( (arrayValue, i) => ({ label: tmpArray[i].label + labelKey[0] + arrayValue[labelKey[j]], value: arrayValue }));
        }
      }
    } else {
      if (labelKey && valueKey) {
        tmpArray = array.map(arrayValue => ({ label: arrayValue[labelKey], value: arrayValue[valueKey] }));
      } else if (!labelKey && valueKey) {
        tmpArray = array.map(arrayValue => ({ label: arrayValue, value: arrayValue[valueKey] }));
      } else if (labelKey && !valueKey) {
        tmpArray = array.map(arrayValue => ({ label: arrayValue[labelKey], value: arrayValue }));
      } else {
        tmpArray = array.map(arrayValue => ({ label: arrayValue, value: arrayValue }));
      }
    }
    if (placeholder) {
      tmpArray.unshift({label: placeholder, value: null});
    }

    if (IsSorted) {
        return tmpArray
            .sort((a, b) => {
          // if (a.label === placeholder || a.label === placeholder) {
          //   return -1;    // changed by sanjay 18-09-2019
          // }
          if (a.label === placeholder || b.label === placeholder) {
            return +1;
          }
          if (!a.label) {
            // Change this values if you want to put `null` values at the end of the array
            return -1;
        }

        if (!b.label) {
            // Change this values if you want to put `null` values at the end of the array
            return +1;
        }
        if (a.label !== null) {
          return String(a.label).localeCompare(String(b.label));
        } else if (b.label !== null) {
            return String(b.label).localeCompare(String(a.label));
        }
      });
    } else {
      return tmpArray;
    }

    // .sort((a , b) => a.label.localeCompare(b.label));
  }
}
// #endregion
