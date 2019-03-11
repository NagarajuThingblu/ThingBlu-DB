import { Directive, ElementRef, HostListener, Input, AfterContentInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appErrorTooltip]'
})
export class ErrorTooltipDirective implements AfterContentInit {
  @Input() appErrorTooltip: any;
  @Input() tooltipPosition = 'bottom';

  public viewHeight: number;
  public outerTop: number;
  public outerLeft: number;
  public errorbox: any;
  public viewwidth: any;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef) {
    //   // element.nativeElement.style.backgroundColor = 'yellow';
    //    setTimeout(function() {
    //     this.viewHeight = element.nativeElement.offsetHeight;
    //    // alert(this.viewHeight);
    //    const bottom = this.viewHeight + 10;
    //    // element.nativeElement.style.bottom = - bottom + 'px';
    //     element.nativeElement.parentNode.style.position = 'relative';
    //   //  debugger;
    //     const clientheight =  Number(element.nativeElement.previousElementSibling.clientHeight);
    //     const offsettop =   Number(element.nativeElement.previousElementSibling.offsetTop);
    //     const total = clientheight + offsettop + 11;
    //   element.nativeElement.style.top =  total + 'px';
    //  // alert(kk);
    // }, 10);
  }

  ngAfterContentInit() {
    this.errorbox = this.elementRef.nativeElement;
    // alert(this.tooltipPosition);
    if (this.appErrorTooltip === 'popup') {
      this.outerTop = this.errorbox.parentNode.getBoundingClientRect().top;
      this.outerLeft = this.errorbox.parentNode.getBoundingClientRect().left;
      // alert(this.outerTop + "this is popup" + this.outerLeft);
      const clientheight = Number(this.errorbox.previousElementSibling.clientHeight);
      const clientwidth = Number(this.errorbox.previousElementSibling.clientWidth);
      const offsettop = Number(this.errorbox.previousElementSibling.offsetTop);
      this.errorbox.style.position = 'fixed';
      this.viewHeight = this.errorbox.offsetHeight;
      this.viewwidth = this.errorbox.offsetWidth;
      const bottom = this.viewHeight + 10;

      if (this.tooltipPosition === 'bottom') {
        this.errorbox.style.top = this.outerTop + clientheight + offsettop + 11 + 'px';
        this.errorbox.style.left = this.outerLeft + 'px';
        this.renderer.addClass(this.errorbox, 'popbottom');
      }
      if (this.tooltipPosition === 'top') {
        this.errorbox.style.top = this.outerTop - (clientheight + 11) + 'px';
        this.errorbox.style.left = this.outerLeft + 'px';
        this.renderer.addClass(this.errorbox, 'poptop');
      }
      if (this.tooltipPosition === 'left') {
        this.errorbox.style.top = this.outerTop + offsettop + 'px';
        this.errorbox.style.left = (this.outerLeft) - (this.viewwidth + 8) + 'px';
        this.renderer.addClass(this.errorbox, 'popleft');
      }
      if (this.tooltipPosition === 'right') {
        this.errorbox.style.top = this.outerTop + offsettop + 'px';
        this.errorbox.style.left = this.outerLeft + clientwidth + 16 + 'px';
        this.renderer.addClass(this.errorbox, 'popright');
      }
    } else {
      this.viewHeight = this.errorbox.offsetHeight;
      this.viewwidth = this.errorbox.offsetWidth;
      const bottom = this.viewHeight + 10;
      this.errorbox.parentNode.style.position = 'relative';
      const clientheight = Number(this.errorbox.previousElementSibling.clientHeight);
      const clientwidth = Number(this.errorbox.previousElementSibling.clientWidth);
      const offsettop = Number(this.errorbox.previousElementSibling.offsetTop);

      if (this.tooltipPosition === 'bottom') {
        const total = clientheight + offsettop + 11;
        this.errorbox.style.top = total + 'px';
      }
      if (this.tooltipPosition === 'top') {
        const total = -offsettop;
        this.errorbox.style.top = total + 'px';
        this.renderer.addClass(this.errorbox, 'top');
      }
      if (this.tooltipPosition === 'left') {
        const total = clientheight - 28;
        this.errorbox.style.top = total + 'px';
        const totalLeft = this.viewwidth + 4;
        this.errorbox.style.left = '-' + totalLeft + 'px';
        this.renderer.addClass(this.errorbox, 'left');
      }
      if (this.tooltipPosition === 'right') {
        const total = clientheight - 11;
        this.errorbox.style.top = total + 'px';
        const totalLeft = clientwidth + 22;
        this.errorbox.style.left = totalLeft + 'px';
        this.renderer.addClass(this.errorbox, 'right');
      }
    }
  }
}
