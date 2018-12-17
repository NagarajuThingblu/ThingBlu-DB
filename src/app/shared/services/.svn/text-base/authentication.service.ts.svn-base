import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DataService } from './DataService.service';
import { RequestOptions } from '@angular/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../models/user.model';
import { AppCommonService } from './app-common.service';

const baseUrl = environment.apiEndpoint;

@Injectable()
export class AuthenticationService {
    constructor(
        private http: DataService,
        private _http: HttpClient,
        private cookieService: CookieService,
        private appCommonService: AppCommonService
    ) { }
    private headers1 = new Headers({ 'Content-Type': 'application/json' });
    private headers = new Headers({
        'Content-Type': 'application/x-www-urlencoded'
      });

    //   getIpAddress() {
    //     return this.http
    //         .get('https://api.ipify.org?format=json', {headers: this.headers1})
    //         .map(response => response );
    // }
    login(model: any) {
    const url = 'token';
    const data = 'username=' + model.username + '&password=' + model.password +
                '&grant_type=password&IpAddress=' + model.IpAddress;
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'true' });

    return this.http.post(url, data, {headers: reqHeaders})
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
    // tslint:disable-next-line:no-shadowed-variable
    .map(data =>  {
        return data;
    });
    }

    getBuildNumber(clientCode) {
        const url = 'api/Login/BuildDetails';
        const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'true' });
        let params = new HttpParams();
        params = params.append('ClientCode', clientCode);

       return this._http.get(baseUrl + url, {params: params, headers: reqHeaders})
        .map(data =>  {
            return data;
        });
    }

    logOut() {
        const url = 'api/Login/AddUpdateUserLog';

        const logOutObject = {
            'UserLog': {
                     'Id': 1,
                     'VirtualRoleId': String(this.appCommonService.getUserProfile().VirtualRoleId),
                     'TokenKey': String(this.appCommonService.getCurrentUser().access_token)
               }
        };

        return this.http.post(url, logOutObject, this.headers)
        .map(data =>  data );
      }
      signOut(LogOutObject) {
        const url = 'api/Login/SignOutUser';
        const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'true' });

        return this.http.post(url, LogOutObject, {headers: reqHeaders})
        .map(data =>  data );
      }

      validateUser(model: any) {
        const url = 'api/Login/ValidateUser';
        const data = {
                'VirtualRoleId': String(this.appCommonService.getUserProfile().VirtualRoleId),
                'Password':  model.password
        };

       return this.http.post(url, data, this.headers)
       // .do(data =>console.log('All : ' + JSON.stringify(data)))
        // tslint:disable-next-line:no-shadowed-variable
        .map(data =>  {
            return data;
        });
    }

    getUserProfile() {
        const url = 'api/login/GetUserDetails';
        return this.http
        .get(url)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data => {
            return data;
       })
       .catch(this.handleError);
    }

    public isAuthenticated(): boolean {
        return this.appCommonService.checkCurrentUser();
    }

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
