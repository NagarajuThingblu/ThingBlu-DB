import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appErrorTooltip]'
})
export class ErrorTooltipDirective {
    public viewHeight: number;
    constructor(element: ElementRef) {
      // element.nativeElement.style.backgroundColor = 'yellow';
       setTimeout(function() {
        this.viewHeight = element.nativeElement.offsetHeight;
       // alert(this.viewHeight);
       const bottom = this.viewHeight + 10;
       // element.nativeElement.style.bottom = - bottom + 'px';
        element.nativeElement.parentNode.style.position = 'relative';
      //  debugger;
        const clientheight =  Number(element.nativeElement.previousElementSibling.clientHeight);
        const offsettop =   Number(element.nativeElement.previousElementSibling.offsetTop);
        const total = clientheight + offsettop + 11;
      element.nativeElement.style.top =  total + 'px';
     // alert(kk);
    }, 10);
    }
}
