import { AppConstants } from './../models/app.constants';

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[PositiveIntegers]'
})
export class OnlyNumberWithoutZeroDirective {

  // constructor(private el: ElementRef) { }

  @Input() OnlyNumberWithoutZero: boolean;

   // Allow decimal numbers. The \. is only allowed once to occur
//    private regex: RegExp = new RegExp(/^([0-9]\.\d+)|([1-9]\d*\.?\d*)$/g);
    private regex: RegExp = new RegExp(/^(?=\d*[1-9])\d+$/g);

   // Allow key codes for special events. Reflect :
   // Backspace, tab, end, home
   private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'Delete', '.'];

   constructor(private el: ElementRef,
        public formControl: NgControl
    ) {
    }

//    @HostListener('keypress', [ '$event' ])
//    onkeypress(event: KeyboardEvent) {

//     if (this.OnlyNumberWithoutZero) {
       // Allow Backspace, tab, end, and home keys
    //    if (this.specialKeys.indexOf(event.key) !== -1 ||
    //         // Allow: Ctrl+A
    //         (event.keyCode === 65 && event.ctrlKey === true) ||
    //         // Allow: Ctrl+C
    //         (event.keyCode === 67 && event.ctrlKey === true) ||
    //         // Allow: Ctrl+X
    //         (event.keyCode === 88 && event.ctrlKey === true) ||
    //         // Allow: home, end, left, right
    //         (event.keyCode >= 35 && event.keyCode <= 39)
    //             // let it happen, don't do anything
    //     ) {
    //        return;
    //    }

       // Do not use event.keycode this is deprecated.
       // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
       // const current: string = this.el.nativeElement.value;
       // We need this because the current value on the DOM element
       // is not yet updated with the value from this event
       // const next: string = current.concat(event.key);

//        if (current.length > AppConstants.maxLength) {
//            event.preventDefault();
//        }
//       }
//    }

   @HostListener('blur', ['$event']) onBlur(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyNumberWithoutZero) {
        if (String(this.el.nativeElement.value) === '0' ||  String(this.el.nativeElement.value).trim() === '') {
            // this.el.nativeElement.value = '';
            this.formControl.control.setValue('');
            this.formControl.control.setErrors({ required: true});
        } else {
            // this.el.nativeElement.value = Math.floor(Number(this.el.nativeElement.value));
            this.formControl.control.setValue(Math.floor(Number(this.el.nativeElement.value)));
        }
    }
  }
}
