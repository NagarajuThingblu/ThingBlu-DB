import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';


const apiEndpoint = environment.apiEndpoint;
@Injectable()
export class ForgotPasswordService {
  constructor(
    private http: HttpClient
  ) {
  }
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  private options = new RequestOptions({
    headers: this.headers
  });

  validateEmpForgotPassword(ForgotPasswordForApi: any) {
      const url = apiEndpoint + 'api/Employee/EmpValidateForgotPassword';
      const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'true' });

      return this.http.post(url, ForgotPasswordForApi, { headers: reqHeaders })
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }

    changeEmpPassword(ChangePasswordForApi: any) {
      const url = apiEndpoint + 'api/Employee/EmpChangePassword';
      const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'true' });

      return this.http.post(url, ChangePasswordForApi, { headers: reqHeaders })
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }
}
