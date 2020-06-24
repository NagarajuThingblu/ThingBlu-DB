import { Injectable } from '@angular/core';
import{ Headers, RequestOptions} from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {DataService} from '../../shared/services/DataService.service';
import{CookieService} from 'ngx-cookie-service';
import{UserModel} from '../../shared/models/user.model';
import{HttpParams} from '@angular/common/http';
import{AppCommonService} from '../../shared/services/app-common.service';

@Injectable()
export class NewTaskActionService {

  private _cookieService: any;

  constructor(
    private http:DataService,
    private appCommonService:AppCommonService
  ) { 
    this._cookieService=this.appCommonService.getUserProfile();
  }

  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  private options= new RequestOptions({
    headers:this.headers
  });

  addNewTask(TaskDetailsForAPi: any){
    const url ='api/TaskType/AddUpdateTasktypelist';
return this.http.post(url,TaskDetailsForAPi,this.headers)
.map(data=>data);  
}

getTaskDetailList(){
  const url ='api/TaskType/GetTaskDetailList'
  let params = new HttpParams();
  params=params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  return this.http
      .get(url, {params: params} )
      .map(data => {
        console.log('GetStrainDetailList Service success');
        return data;
      });
}

}
