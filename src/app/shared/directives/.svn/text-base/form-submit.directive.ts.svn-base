import { Directive, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[formSubmit]'
})
export class FormSubmitDirective {

   constructor() {  }

   @HostListener('submit', ['$event']) onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
