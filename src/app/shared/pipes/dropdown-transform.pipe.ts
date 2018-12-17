import {Pipe, PipeTransform} from '@angular/core';
import {SelectItem} from 'primeng/primeng';

@Pipe({ name: 'dropdownPipe', pure: false })
export class DropdownTransformPipe implements PipeTransform {
   /**
    * Performs the specified action for each element in an array.
    * @param array  The array of objects to convert.
    * @param labelKey  The key of the object to use as the label (can be string or array of strings)
    * @param valueKey  Optional key of the object to use as the value, default is the object
    * @param placeholder  Optional placeholder if there are multiple labels
    */
  transform(array: any[], labelKey: string | string[], valueKey?: string, placeholder?: string): SelectItem[] {
    if (!array || !labelKey) { return undefined; }
    let tmpArray: any;

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
    return tmpArray
    .sort((a, b) => {
      if (a.label === placeholder || a.label === placeholder) {
        return -1;
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
    // .sort((a , b) => String(a.label).localeCompare(String(b.label)));
  }
}
