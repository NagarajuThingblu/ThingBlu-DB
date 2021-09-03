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

  assignPlantTask(plantingDataForApi: any) {
    const url = 'api/Grower/AssignPlantTask';
    console.log('assign form ');
    console.log(plantingDataForApi);
    return this.http.post(url, plantingDataForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  assignHarvestTask(harvestingDataForApi: any) {
    const url = 'api/Grower/AssignHarvestingTask';
    console.log('assign form ');
    console.log(harvestingDataForApi);
    return this.http.post(url, harvestingDataForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  assignPrebuckingTask(prebuckingDataForApi: any) {
    const url = 'api/Grower/PreBuckingTaskAssign';
    console.log('assign form ');
    console.log(prebuckingDataForApi);
    return this.http.post(url, prebuckingDataForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  editEndDate(endDateEditApi: any){
    const url = 'api/Grower/UpdateTaskEndDate';
    console.log('end date edit');
    console.log(endDateEditApi);
    return this.http.post(url, endDateEditApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );

  }
  assignbuckingTask(buckingDataForApi: any) {
    const url = 'api/Grower/BuckingTaskAssign';
    console.log('assign form ');
    console.log(buckingDataForApi);
    return this.http.post(url, buckingDataForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  assignTrimmingTask(trimmingDataForApi: any) {
    const url = 'api/Grower/TrimmingTaskAssign';
    console.log('assign form ');
    console.log(trimmingDataForApi);
    return this.http.post(url, trimmingDataForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  assignPackagingTask(packagingDataForApi: any) {
    const url = 'api/Grower/PackagingTaskAssign';
    console.log('assign form ');
    console.log(packagingDataForApi);
    return this.http.post(url, packagingDataForApi, this.headers)
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
          // TaskId: Number(taskStatusParameters.taskId),
          TaskStatus: taskStatusParameters.taskStatus,
          VirtualRoleId: String(this.appCommonService.getUserProfile().VirtualRoleId)
        },
        TaskIdList : [
          {
          TaskId: taskStatusParameters.taskId,
          }
        ],

      }, this.headers)
    .map(data =>  data );
  }

  // To resume or pause the task
  resumeOrPauseTask(taskStatusParameters: any) {
    return this.http.post(taskStatusParameters.apiUrl,
      {
        TaskDetails: {
          // TaskId: taskStatusParameters.taskId,
          TaskStatus: taskStatusParameters.taskStatus,
          VirtualRoleId: String(this.appCommonService.getUserProfile().VirtualRoleId)
        },
        TaskIdList : [
          {
          TaskId: taskStatusParameters.taskId,
          }
        ],
       

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
  completePackagingCompleteTask(taskCompletionWebApi: any) {
    const apiUrl = 'api/Grower/PackagingTaskComplete';

    // taskCompletionWebApi.TaskDetails.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
    .map(data =>  data );
  }
//For completion of planting task
completePlantTask(taskCompletionWebApi: any){
  const apiUrl = 'api/Grower/CompletePlantTask';

    taskCompletionWebApi.CompletePlant.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
    .map(data =>  data );
}
//for completing prebucking task
completePrebuckingTask(taskCompletionWebApi: any){
  const apiUrl = 'api/Grower/PreBuckingTaskComplete';

    taskCompletionWebApi.PreBucking.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
    .map(data =>  data );
}

//for completing bucking task
completeBuckingTask(taskCompletionWebApi: any){
  const apiUrl = 'api/Grower/BuckingTaskComplete';

    taskCompletionWebApi.Bucking.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
    .map(data =>  data );
}

//for completing trimming task
completeTrimmingTask(taskCompletionWebApi: any){
  const apiUrl = 'api/Grower/TrimmingTaskComplete';

    taskCompletionWebApi.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
    .map(data =>  data );
}

//For submitting harvesting task
completeHarvestTask(taskCompletionWebApi: any){
  const apiUrl = 'api/Grower/CompleteHarvestingTask';

    taskCompletionWebApi.CompleteHarvesting.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
    .map(data =>  data );
}
//For submitting Planting Task
submitPlantTaskReview(taskReviewWebApi) {
  const apiUrl = 'api/Grower/ReviewPlantTask';

  taskReviewWebApi.ReviewPlant.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
  return this.http.post(apiUrl, taskReviewWebApi, this.headers)
  .map(data =>  data );
}

getEmployeeListBasedOnSkills(skillListApiDetails){
  const apiUrl = 'api/Grower/GetEmployee';
  return this.http.post(apiUrl, skillListApiDetails, this.headers)
  .map(data =>  data );
}
// completePackagingCompleteTask(taskCompletionWebApi){
//   const apiUrl = 'api/Grower/PackagingTaskComplete';
//   taskCompletionWebApi.CompleteHarvesting.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
//   return this.http.post(apiUrl, taskCompletionWebApi, this.headers)
//   .map(data =>  data );
// }
//for submitting prebucking task
submitPrebuckingTaskReview(taskReviewWebApi) {
  const apiUrl = 'api/Grower/PreBuckingTaskReview';

  taskReviewWebApi.PreBucking.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
  return this.http.post(apiUrl, taskReviewWebApi, this.headers)
  .map(data =>  data );
}

submitbuckingTaskReview(taskReviewWebApi) {
  const apiUrl = 'api/Grower/BuckingTaskReview';

  taskReviewWebApi.Bucking.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
  return this.http.post(apiUrl, taskReviewWebApi, this.headers)
  .map(data =>  data );
}

submittrimmingTaskReview(taskReviewWebApi) {
  const apiUrl = 'api/Grower/TrimmingTaskReview';

  taskReviewWebApi.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
  return this.http.post(apiUrl, taskReviewWebApi, this.headers)
  .map(data =>  data );
}
//For submitting harvesting Task
submitHarvestTaskReview(taskReviewWebApi) {
  const apiUrl = 'api/Grower/ReviewHarvestingTask';

  taskReviewWebApi.ReviewHarvesting.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
  return this.http.post(apiUrl, taskReviewWebApi, this.headers)
  .map(data =>  data );
}
  // For Review Sumittion
  submitTaskReview(taskReviewWebApi) {
    const apiUrl = 'api/Task/TaskReview';

    taskReviewWebApi.TaskDetails.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, taskReviewWebApi, this.headers)
    .map(data =>  data );
  }
  submitTaskReviewTask(taskReviewWebApi) {
    const apiUrl = 'api/Grower/PackagingTaskReview';

    // taskReviewWebApi.TaskDetails.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
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
    getTasksList(ShowForAllMgr, TaskDataKey, TaskTypeId) {
      const url = 'api/Task/TaskGetListByUserRole';
      let params = new HttpParams();
      // params = params.append('ClientId', this._cookieService.ClientId);
      // alert(this.appCommonService.getUserProfile().VirtualRoleId);
      params = params.append('VirtualRoleId', String(this.appCommonService.getUserProfile().VirtualRoleId));
      params = params.append('ShowForAllMgr', ShowForAllMgr) ;
      params = params.append('TaskDataKey', TaskDataKey) ;
      params = params.append('TaskTypeId', TaskTypeId) ;

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
