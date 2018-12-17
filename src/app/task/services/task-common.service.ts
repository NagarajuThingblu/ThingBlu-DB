import { Observable } from 'rxjs/observable';
import { Injectable, ViewContainerRef } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { DataService } from '../../shared/services/DataService.service';
import { RequestOptions } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class TaskCommonService {

  private _cookieService: UserModel;
  // constructor(private http: DataService) { }
  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  assignTask(assignTaskDetailsForWebApi: any) {
    const url = 'api/Task/TaskAssign';
    console.log('assign form ');
    console.log(assignTaskDetailsForWebApi);
    return this.http.post(url, assignTaskDetailsForWebApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  /// Crated By : Devdan :: 10-Oct-2018 :: Added method
  updateTask(assignTaskDetailsForWebApi: any) {
    const url = 'api/Task/TaskUpdate';
    console.log('update task form ');
    console.log(assignTaskDetailsForWebApi);
    return this.http.post(url, assignTaskDetailsForWebApi, this.headers)
   .map(data =>  data );
  }

  // for starting the task
  startTask(taskStatusParameters: any) {
    return this.http.post(taskStatusParameters.apiUrl,
      {
        TaskDetails: {
          TaskId: Number(taskStatusParameters.taskId),
          TaskStatus: taskStatusParameters.taskStatus,
          VirtualRoleId: String(this.appCommonService.getUserProfile().VirtualRoleId)
        }
      }, this.headers)
    .map(data =>  data );
  }

  // To resume or pause the task
  resumeOrPauseTask(taskStatusParameters: any) {
    return this.http.post(taskStatusParameters.apiUrl,
      {
        TaskDetails: {
          TaskId: taskStatusParameters.taskId,
          TaskStatus: taskStatusParameters.taskStatus,
          VirtualRoleId: String(this.appCommonService.getUserProfile().VirtualRoleId)
        }
      }, this.headers)
    .map(data =>  data );
  }

  // To Show Task Details
  editTask(apiUrl: string, taskId: string) {
    return this.http.post(apiUrl, { taskId: taskId }, this.headers)
    .map(data =>  data );
  }

  // For deletion of task
  deleteTask(TaskDeleteDetailsForApi) {
    const apiUrl = 'api/Task/TaskDelete';

    TaskDeleteDetailsForApi.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    // apiUrl =  apiUrl + '?TaskId=' + taskId + '&VirtualRoleId=' +  this.appCommonService.getUserProfile().VirtualRoleId;

    return this.http.post(apiUrl, TaskDeleteDetailsForApi, this.headers)
    .map(data =>  data );
  }

  // For completion of task
  completeTask(taskCompletionWebApi: any) {
    const apiUrl = 'api/Task/TaskComplete';

    taskCompletionWebApi.TaskDetails.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
    .map(data =>  data );
  }

  // For Review Sumittion
  submitTaskReview(taskReviewWebApi) {
    const apiUrl = 'api/Task/TaskReview';

    taskReviewWebApi.TaskDetails.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskReviewWebApi, this.headers)
    .map(data =>  data );
  }

  getTaskDetailsByTask(taskId) {
    const url = 'api/Task/TaskGetDetailsByTaskId';

    let params = new HttpParams();
    // params = params.append('ClientId', this._cookieService.ClientId);
    params = params.append('TaskId', taskId);

    return this.http
    .get(url, {params: params})
   .map(data => {
    console.log('GetTaskDetailsByTask Service success');
    return data;
   });
  }
    // Get all tasks list
    getTasksList(ShowForAllMgr, TaskDataKey) {
      const url = 'api/Task/TaskGetListByUserRole';
      let params = new HttpParams();
      // params = params.append('ClientId', this._cookieService.ClientId);
      // alert(this.appCommonService.getUserProfile().VirtualRoleId);
      params = params.append('VirtualRoleId', String(this.appCommonService.getUserProfile().VirtualRoleId));
      params = params.append('ShowForAllMgr', ShowForAllMgr) ;
      params = params.append('TaskDataKey', TaskDataKey) ;

      return this.http
      .get(url, {params: params})

     .map(data => {
      console.log('GetTasksList Service success');
      return data;
     });
    // return [
    //   {task: 'trimming', employee: 'Randy Carroll', taskid: '3', brand: 'Dawg Star', strain: 'Blueberry Kush', lotno: 'Lot100R1', status: 'assigned'},
    //   {task: 'sifting', employee: 'Brandon', taskid: '2', brand: 'Forbidden Garden', strain: 'Blue Dream', lotno: 'Lot100R2', status: 'In-Process'},
    // ];
  }

  getTaskTypeSettings(TaskTypeId) {
    const url = 'api/TaskType/CheckTaskTypeNotification';
    let params = new HttpParams();

    params = params.append('TaskTypeId', TaskTypeId);
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    console.log('GetTaskTypeSettings Service success');
    return data;
   });
  }
// Get all tasks list
getEmployeeTaskListbyUserRole() {
      const url = 'api/Task/GetEmployeeTaskListByUserRole';
      let params = new HttpParams();
      params = params.append('VirtualRoleId', String(this.appCommonService.getUserProfile().VirtualRoleId));
      return this.http
      .get(url, {params: params})

     .map(data => {
      console.log('GetEmployeeTaskListbyUserRole Service success');
      return data;
     });
  }

  getTubingStrainListByClient() {
    const url = 'api/Task/TaskJointsTubingGetStrainList';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    return data;
   });
  }

  getTaskStatusByTaskId(taskId) {
    const url = 'api/Task/TaskStatusByTaskId';
    let params = new HttpParams();
    params = params.append('TaskId', taskId);

    return this.http.get(url, {params: params})
      .map(data => {
        return data;
    });
  }

}
