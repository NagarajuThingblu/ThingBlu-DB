import { AppConstants } from './../models/app.constants';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'InProcessStatus'
})
export class InprocessStatusPipe implements PipeTransform {

  transform(value: string): any {
    return value === AppConstants.getStatusList.InProcess ? 'IN PROCESS' : value;
  }

}
