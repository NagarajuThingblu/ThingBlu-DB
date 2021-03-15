import { Observable } from 'rxjs/Observable';
import { MsalService } from './../azureb2c/msal.service';
import { LoaderService } from './../shared/services/loader.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpSentEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { AppCommonService } from '../shared/services/app-common.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private msalService: MsalService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.get('No-Auth') === 'true') {
      return next.handle(req.clone());
    }

    if (this.appCommonService.checkCurrentUser() !== false) {
      const clonerequest = req.clone({
        // tslint:disable-next-line:max-line-length
        headers: req.headers.set('Authorization', 'bearer ' + this.appCommonService.getCurrentUser().access_token + '')
        // setHeaders: {
        //     'Authorization': 'Bearer '+ localStorage.getItem("currentUser") +'}'
        // }
      });

      // return next.handle(clonerequest)
      return next.handle(clonerequest).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
            this.loaderService.display(false);
          }
        }
      })
        .catch((response: any) => {
          this.handleError(response);
          return Observable.throw(response);
        });
    } else {
      this.router.navigate(['/login']);
      this.loaderService.display(false);
    }
  }

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     if (req.headers.get('No-Auth') === 'true') {
//         return next.handle(req.clone());
//     }

//     if (this.msalService.isOnline()) {

//     return Observable.fromPromise(this.msalService.getAuthenticationToken())
//         .switchMap(token => {

//       // const token = localStorage.getItem(this.msalService.B2CTodoAccessTokenKey);
//             req = req.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             return next.handle(req)
//             .do((event: HttpEvent<any>) => {
//               if (event instanceof HttpResponse) {
//                 // do stuff with response if you want
//                 // alert(event);
//               }
//             }, (err: any) => {
//               if (err instanceof HttpErrorResponse) {
//                 if (err.status === 401) {
//                   if (this.msalService.isOnline()) {
//                     this.msalService.logout();
//                   } else {
//                     this.msalService.login();
//                   }
//                  // this.router.navigate(['/login']);

//                   // Set Loader to false
//                   this.loaderService.display(false);
//                 }
//               }
//             })
//             .catch((response: any) => {
//               this.handleError(response);
//               return Observable.throw(response);
//             });
//         });
//       } else {
//         this.msalService.login();
//       }
// }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof Response) {
      return Observable.throw(error.error.json() || 'backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    } else if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }
}
