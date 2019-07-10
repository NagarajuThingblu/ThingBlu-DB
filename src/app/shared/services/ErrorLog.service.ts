import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from './app-common.service';
import { DataService } from './DataService.service';
import { Injectable, Injector, ErrorHandler} from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../models/app.constants';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

//#region Handle Errors Service
@Injectable()
export class ErrorLogService  {

  constructor(
    private http: DataService,
    private appCommonService: AppCommonService,
    private cookieService: CookieService,
    private injector: Injector
  ) {  }

  private headers = new Headers({ 'Content-Type': 'application/json' });
  // Log error method
  logError(error: any) {
    const location = this.injector.get(LocationStrategy);
    const componentName = (this.injector as any)._bootstrapComponents[0].__source;
    const message = error.message ? error.message : error.toString();
    let locationUrl = location instanceof PathLocationStrategy
        ? location.path() : '';

    locationUrl =  locationUrl === '' ? location.path() !== '' ? location.path() : location._platformLocation.hash : locationUrl;

    const exceoptionObject = {
      Exception: {
          ExceptionDate: this.appCommonService.getUserProfile() ? this.appCommonService.calcTime(this.appCommonService.getUserProfile().UTCTime)
                              : new Date().toLocaleDateString(),
          ExceptionType: '',
          Message: '',
          StackTrace: '',
          Status: '',
          URL: locationUrl + ' (' + (String(componentName)) + ')',
          LineNo: 0
      }
    };
    // Returns a date converted to a string using Universal Coordinated Time (UTC).
    const date = new Date().toUTCString();

    if (error instanceof HttpErrorResponse) {
      // The response body may contain clues as to what went wrong,
      console.error(date, AppConstants.httpError, error.message, 'Status code:',
                                                  (<HttpErrorResponse>error).status);
      exceoptionObject.Exception.ExceptionType = AppConstants.httpError;
      exceoptionObject.Exception.Message = error.message;
      exceoptionObject.Exception.StackTrace = '';
      exceoptionObject.Exception.Status = String(error.status);
      // exceoptionObject.Exception.URL = error.url;
    } else if (error instanceof TypeError) {
      console.error(date, AppConstants.typeError, error.message, error.stack);
      exceoptionObject.Exception.ExceptionType = AppConstants.typeError;
      exceoptionObject.Exception.Message = error.message;
      exceoptionObject.Exception.StackTrace = error.stack;
    } else if (error instanceof Error) {
       console.error(date, AppConstants.generalError, error.message, error.stack );
       exceoptionObject.Exception.ExceptionType = AppConstants.generalError;
       exceoptionObject.Exception.Message = error.message;
       exceoptionObject.Exception.StackTrace = error.stack;
    } else if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(date, AppConstants.generalError, error.message);
      exceoptionObject.Exception.ExceptionType = AppConstants.generalError;
      exceoptionObject.Exception.Message = error.message;
      exceoptionObject.Exception.StackTrace = '';
      exceoptionObject.Exception.LineNo = error.lineno;
    } else {
      console.error(date, AppConstants.somethingHappened, error.message, error.stack);

      exceoptionObject.Exception.ExceptionType = AppConstants.somethingHappened;
      exceoptionObject.Exception.Message = error.message;
      exceoptionObject.Exception.StackTrace = error.stack;
    }

    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'true' });
    const url = 'api/ExceptionLog/AddException';
    return this.http.post(url, exceoptionObject, {headers: reqHeaders})
    .map(data =>  data )
    .subscribe(data => {
      console.log('Exception Logged');
    });
  }
}
// #endregion
