import { environment } from './../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/catch';

const baseUrl = environment.apiEndpoint;

@Injectable()
export class DataService {
    constructor(
        private http: HttpClient) {
    }

    get(url, params?: any): Observable<any> {
        return this.http.get<any>(baseUrl + url, params);
    }
    post(url, body, header): Observable<any> {
        return this.http.post<any>(baseUrl + url, body, header);
    }

    patch(url, body): Observable<any> {
        return this.http.patch<any>(baseUrl + url, body);
    }

    put(url, body, header): Observable<any> {
        return this.http.put<any>(baseUrl + url, body, header);
    }

    delete(url, params?: any): Observable<any> {
        return this.http.delete<any>(baseUrl + url, params);
    }
}
