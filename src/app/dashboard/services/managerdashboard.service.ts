import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { DataService } from '../../shared/services/DataService.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class managerdashboardService {
    private _cookieService: any;
    constructor(
        private http: DataService,
        private appCommonService: AppCommonService
      ) {
        this._cookieService = this.appCommonService.getUserProfile();
      }
      private headers = new Headers({
        'Content-Type': 'application/json'
      });
      private options = new RequestOptions({
        headers: this.headers
      });

      deleteMultipleTasks(TaskDetailsForApi: any){
        const url = 'api/Task/TaskDelete';
  
        return this.http.post(url, TaskDetailsForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }
      pauseMultipleTasks(TaskDetailsForApi: any){
        const url = 'api/Task/TaskUpdateStatus';
  
        return this.http.post(url, TaskDetailsForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }
}