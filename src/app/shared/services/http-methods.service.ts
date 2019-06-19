import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/catch';

const baseUrl = environment.apiEndpoint;

declare const ActiveXObject: (type: string) => void;
// tslint:disable-next-line:no-empty-interface
interface ActiveXObject {

}
@Injectable()
export class HttpMethodsService {

  constructor(
    private http: HttpClient) {
  }

  get(url: string, options?: any): Observable<any> {
    return this.http.get<any>(baseUrl + url, options)
      .map(data => data);
  }

  post(url: string, body: any, options?: any): Observable<any> {
    return this.http.post<any>(baseUrl + url, body, options)
      .map(data => data);
  }

  patch(url: string, body: any, options?: any): Observable<any> {
    return this.http.patch<any>(baseUrl + url, body, options)
      .map(data => data);
  }

  put(url: string, body: any, options?: any): Observable<any> {
    return this.http.put<any>(baseUrl + url, body, options)
      .map(data => data);
  }

  delete(url: string, options?: any): Observable<any> {
    return this.http.delete<any>(baseUrl + url, options)
      .map(data => data);
  }

  getGraphApi(url: string, options?: any): Observable<any> {
    return this.http.get<any>(url, options)
      .map(data => data);
  }


  // tslint:disable-next-line:no-shadowed-variable
  AjaxCall(url: string, type: string, async: boolean, callback: any = '') {
    const xhr = this.xhrFactories();
    xhr.open(type, baseUrl + url, async);

    return xhr;
    // // <!-- xhr.withCredentials = true; -->
    // // xhr.setRequestHeader("Authorization", 'Bearer ' + accessToken);
    // xhr.onload = function () {
    //   console.log(xhr.responseText);
    // };
    // xhr.send();
  }

  xhrFactories() { /* returns cross-browser XMLHttpRequest, or null if unable */
    try {
        return new XMLHttpRequest();
    } catch (e) {}
    try {
        // tslint:disable-next-line:quotemark
        return new ActiveXObject("Msxml3.XMLHTTP");
    } catch (e) {}
    try {
       // tslint:disable-next-line:quotemark
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
       // tslint:disable-next-line:quotemark
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
       // tslint:disable-next-line:quotemark
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
       // tslint:disable-next-line:quotemark
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    return null;
}
}
