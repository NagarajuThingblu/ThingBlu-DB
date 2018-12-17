import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
// import { Observable } from '../../../../node_modules/rxjs';
// import { catchError } from '../../../../node_modules/rxjs/operators';
import {
  HttpErrorResponse, HttpParams
} from '@angular/common/http';
// import { ErrorObservable } from '../../../../node_modules/rxjs/observable/ErrorObservable';
import { DataService } from '../../shared/services/DataService.service';

@Injectable()
export class RefreshService {
  private url = 'http://sigmastride.com/' ;
 // private url = 'https://thingbluapiserver.azurewebsites.net/' ;

  private socket;
  constructor(private http: DataService , private http1: DataService) { }

  // sendMessage(message) {
  //   this.socket.emit('add-message', message);
  // }

  // getMessages() {
  //   // tslint:disable-next-line:prefer-const
  //   let observable = new Observable(observer => {
  //      this.socket = io(this.url);
  //     this.socket.on('message', (data) => {
  //       observer.next(data);
  //     }
  //   );
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   }
  // );
  //   return observable;
  // }

  getRefreshedTime() {
    const url = 'api/Refresh/GetRefreshedTimeStamp';
       return this.http
    .get(url)

   .map(data => {
    return data;
   });
}

pushChange() {
  const url = 'api/Refresh/RefreshTime';
   return this.http1
  .get(url)

 .map(data => {
  return data;
 });
}

}
