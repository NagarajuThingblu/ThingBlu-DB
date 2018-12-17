import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { GlobalResources } from '../../../global resource/global.resource';

@Component({
  selector: 'app-number-validation-msgs',
  templateUrl: './number-validation-msgs.component.html'
})
export class NumberValidationMsgsComponent implements OnInit {

  @Input() formControl: FormControl;
  public globalResource: any;
  constructor() { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
  }

}
