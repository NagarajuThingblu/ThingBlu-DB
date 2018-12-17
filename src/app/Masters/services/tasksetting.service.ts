import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class TaskSettingService {
  private _cookieService: any;

  constructor(private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
   }
   private headers = new Headers({ 'Content-Type': 'application/json' });

   getTaskListByClientForTaskSetting() {
    const url = 'api/TaskType/GetTaskListByClientForTaskSetting';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

    .map(data => {
      console.log('GetTaskListByClientForTaskSetting Service success');
      return data;
    });
  }

  addUpdateTaskSetting(TaskSettingDetails: any) {
    const url = 'api/TaskType/AddUpdateTaskSetting';

    return this.http.post(url, TaskSettingDetails, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }
}
