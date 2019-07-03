import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

  transform(value: string, showMask: boolean): string {
    if (value) {
      value = value.replace(/\D+/g, '');
    if (!showMask || value.length < 10) {
      return value;
    }
  // return 'XXX-XX-' + value.substr(0, value.length - 6);
    return '(' + value.substr(0, 3) + ') ' + value.substr(3, 3) + '-' + value.substr(6, 4) ;
  } else {
  return value;
  }
  }
}
