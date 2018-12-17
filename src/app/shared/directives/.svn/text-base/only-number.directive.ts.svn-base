import { AppConstants } from './../models/app.constants';

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl, FormControl } from '@angular/forms';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {

  // constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;
  @Input() AllowZero = true;

   // Allow decimal numbers. The \. is only allowed once to occur
   private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);

   // Allow key codes for special events. Reflect :
   // Backspace, tab, end, home
   private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'Delete' ];

   constructor(private el: ElementRef,
    public formControl: NgControl) {
   }

   @HostListener('blur', ['$event']) onBlur(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyNumber) {
        if (String(this.el.nativeElement.value).trim() !== '') {
            // this.el.nativeElement.value = parseFloat(this.el.nativeElement.value).toFixed(Number(AppConstants.decimalPlaces));
            this.formControl.control.setValue(parseFloat(this.el.nativeElement.value).toFixed(Number(AppConstants.decimalPlaces)));
            if (!this.AllowZero && (String(this.el.nativeElement.value).trim() === '0.00' || String(this.el.nativeElement.value).trim() === '0') ) {
                this.formControl.control.setErrors({ zeronotallowed: true});
                event.preventDefault();
            }
            if (this.el.nativeElement.value.length > AppConstants.maxLength) {
                this.formControl.control.setErrors({ maxlengthexceed: true});
                event.preventDefault();
            }
            if (isNaN(this.el.nativeElement.value.trim())) {
                this.formControl.control.setValue(0);
                // event.preventDefault();
            }
            if (!String(this.el.nativeElement.value).match(this.regex)) {
                this.formControl.control.setErrors({ invalidinput: true});
                event.preventDefault();
            }
        } else {
            // this.el.nativeElement.value = '';
            this.formControl.control.setValue('');
        }
    }
  }
}
