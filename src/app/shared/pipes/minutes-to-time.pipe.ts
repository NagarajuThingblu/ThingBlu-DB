import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToTime'
})
export class MinutesToTimePipe implements PipeTransform {

  constructor() {}
  // Old Code :: Commented by Devdan :: 06-Nov-2018
  // transform(minutes: string): string {
  //   const min = Number(minutes);
  //   const hours = Math.floor(min / 60);
  //   const remainingMinutes = min % 60;
  //   return this.padLeft(String(hours), '0', 2) + ':' + this.padLeft(String(remainingMinutes), '0', 2);
  // }

  // New Code to convert Seconds into HH:MM:SS format :: Modified by Devdan
  transform(seconds: string): string {
    const sec = Number(seconds);
    const hours = Math.floor(sec / 3600);
    const min = Math.floor((sec % 3600) / 60);
    const remainingSecs = Math.floor((sec % 3600) % 60);
    return this.padLeft(String(hours), '0', 2) + ':' + this.padLeft(String(min), '0', 2) + ':'
    + this.padLeft(String(remainingSecs), '0', 2);
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

}
