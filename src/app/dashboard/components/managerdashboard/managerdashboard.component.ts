import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { TaskCommonService } from '../../../task/services/task-common.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { SelectItem } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RefreshService } from '../../services/refresh.service';
import { environment } from './../../../../environments/environment';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { Router } from '@angular/router';
import { DashboardResource } from '../../dashboard.resource';
import {managerdashboardService} from '../../services/managerdashboard.service'
import { Table } from 'primeng/table';

// create enum for managerdashboard tabs :: swapnil :: 22-Mar-2019
enum TabIndexName {
'REVIEWPENDING',
'ASSIGNED',
'INPROCESS',
'PAUSED',
'COMPLETED'
}

@Component({
  moduleId: module.id,
  selector: 'app-managerdashboard',
  templateUrl: 'managerdashboard.component.html',
  styleUrls: ['managerdashboard.component.css']
})

export class ManagerdashboardComponent implements OnInit , OnDestroy {
  managerdashboardForm: FormGroup;
  public tasks: any;
  public reviewPendingTasks: any;

  public assignedTasks: any;
  public inProcessTasks: any;
  public  display = false;
  public pausedTasks: any;
  public completedTasks: any;
  assignedTasksevent: any;
  inProcessTasksevent: any;
  pausedTasksevent: any;
  public showButton: boolean = false;
  tasklotDetails: any;
  public tasklotDetailsBytaskId: any;
  completetasklotDetails: any;
  reviewPendingTasksevent: any;
  completedTasksevent: any;
  refreshTimeStamp: any;
  id: any;
  paginationValuesassignedTasks: any;
  paginationValuesinProcessTasks: any;
  paginationValuespausedTasks: any;
  paginationValuesreviewPendingTasks: any;
  paginationValuescompletedTasks: any;
  // connection;
  public taskTypes: SelectItem[];
  public showAllManagerOption: any[];
  public taskTypeModel: any;
  public dataViewModel: any;
  public taskStatus: any;
  public globalData: any = {
    taskTypes: []
  };
  public loadingStatus = false;
  public globalResource: any;
  public managerResources: any;
  public showAllManagerForCompleteModel: any;

  // Added by Devdan :: 21-Nov-2018 :: Adding Lot Note Comment
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  // add for tab
  public selectedTabIndex = null;
  public selectedTabName: string;
  tabIndexName = TabIndexName;
  public selectedTaskTypeId = 0;
  public reviewCount: number;
  public assignCount: number;
  public inProcessCount: number;
  public pauseCount: number;
  public completeCount: number;
  public showMgr: boolean;
  public selectedShowMgr: number;
  public taskCount: any;
  public msgs: any[];
  public isPrintClicked = false;
  public selectedCheckBoxes:any=[];
  public _cookieService: any;
  public chooseCheckBox: boolean = true;
  public chooseRow: boolean = true
  public dashboardObject = {
      reviewPending: [],
      assigned: [],
      inProcess: [],
      paused: [],
      completed: [],
  };




  constructor(
    private taskCommonService: TaskCommonService,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private loaderService: LoaderService,
    private titleService: Title,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private managerdashboardService:managerdashboardService,
    private refreshService: RefreshService,
    private appCommonService: AppCommonService
  ) { }


  ngOnInit() {
    // this.startTimer();
    this.globalResource = GlobalResources.getResources().en;
    this.managerResources = DashboardResource.getResources().en.managerdashboard;
    this._cookieService = this.appCommonService.getUserProfile();
    this.titleService.setTitle(this.globalResource.ManagerDashboard);
    this.showAllManagerOption = [
      {label: 'Only Me', value: '1'},
      {label: 'Show All', value: '2'},
  ];
    //  this.getTaskList(0);
    this.selectedShowMgr = 2;
     this.loaderService.display(true);
      this.getAllTaskTypes();
      this.taskStatus =  AppConstants.getStatusList;
      this.managerdashboardForm = this.fb.group({
        'taskTypes': new FormControl(null),
        'ShowallManager': new FormControl(2),
        'ShowallManagerForTskComplete': new FormControl(1),
       
      });
      // this.connection = this.chatService.getMessages().subscribe(message => {
     //   this.getTaskList(0);
     //   this.getAllTaskTypes();
    //  } ,
    //  error => { console.log('sms'); console.log(error); this.loaderService.display(false); });

    // tab selected
   // this.getCount(true);
    if (this.appCommonService.getLocalStorage('MDTabIndex')) {
      this.selectedTabIndex = Number(this.appCommonService.getLocalStorage('MDTabIndex'));
      this.onTabChange(null);
    } else {
    this.selectedTabIndex = TabIndexName.REVIEWPENDING;
    this.onTabChange(null); }
  }
  startTimer() {
    this.id = setInterval(() => {
      this.refreshService.getRefreshedTime().subscribe(
        data => {
          // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
          // this.refreshTimeStamp = localStorage.getItem('refreshedTimeStamp');
          this.refreshTimeStamp = this.appCommonService.getLocalStorage('refreshedTimeStamp');
          if ( this.refreshTimeStamp !== '' && this.refreshTimeStamp !== null && this.refreshTimeStamp !== data) {
            // localStorage.setItem('refreshedTimeStamp', data);
            this.appCommonService.setLocalStorage('refreshedTimeStamp', data);
            this.updateChange();
            // console.log('refresh');
          } else  if ( this.refreshTimeStamp === '' || this.refreshTimeStamp === null) {
            // localStorage.setItem('refreshedTimeStamp', data);
            this.appCommonService.setLocalStorage('refreshedTimeStamp', data);
          }
          // console.log('new refresh time(Encrypted) : ' + this.refreshTimeStamp);
          // console.log('new refresh time(Decrypted) : ' + this.refreshTimeStamp);
        });
    }, 1000 * 60 * environment.refreshTime );
  }

  updateChange() {
    this.getTaskList(0);
    this.getAllTaskTypes();
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }

    this.appCommonService.removeItem('refreshedTimeStamp');
  }
  assignedTasksonPageChange(e1) {
    this.assignedTasksevent = e1;
  }
  inProcessTasksonPageChange(e2) {
    this.inProcessTasksevent = e2;
  }
  pausedTasksonPageChange(e3) {
    this.pausedTasksevent = e3;
  }
  reviewPendingTasksonPageChange(e4) {
    this.reviewPendingTasksevent = e4;
  }
  completedTasksonPageChange(e5) {
    this.completedTasksevent = e5;
  }
  getTaskList(TaskTypeId) {
    this.loaderService.display(true);
    // this.loadingStatus = false;
   // this.loaderService.display(true);
    this.taskCommonService.getTasksList(this.selectedTaskTypeId, true, 'DEFAULT').subscribe(
      data => {
        // this.tasks = data;
       if (data !== 'No data found!') {
         this.tasklotDetails = data.Table1.filter(Result =>  String(Result.TaskStatus).toLocaleUpperCase() !== this.taskStatus.Completed);
         this.completetasklotDetails = data.Table1.filter(Result =>  String(Result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed);
         if (TaskTypeId) {
            this.reviewPendingTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.ReviewPending && result.TaskTypeId === TaskTypeId);
            this.assignedTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Assigned && result.TaskTypeId === TaskTypeId);

            this.inProcessTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.InProcess && result.TaskTypeId === TaskTypeId);

            this.pausedTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Paused && result.TaskTypeId === TaskTypeId);

              this.completedTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed && result.TaskTypeId === TaskTypeId);

            this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending && result.TaskTypeId === TaskTypeId);
         } else {
          this.reviewPendingTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.ReviewPending);
        //  this.assignedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Assigned);
        //  this.inProcessTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.InProcess);
        //  this.pausedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Paused);
        //  this.completedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed);

            this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending);
            this.paginationValuesreviewPendingTasks = AppConstants.getPaginationOptions;
            if (this.reviewPendingTasks.length > 20) {
              this.paginationValuesreviewPendingTasks[AppConstants.getPaginationOptions.length] = this.reviewPendingTasks.length;
            }
            this.loaderService.display(false);
          }

        //  this.paginationValuesassignedTasks = AppConstants.getPaginationOptions;
        //  if (this.assignedTasks.length > 20) {
        //    this.paginationValuesassignedTasks[AppConstants.getPaginationOptions.length] = this.assignedTasks.length;
        //  }

        //  this.paginationValuesinProcessTasks = AppConstants.getPaginationOptions;
        //  if (this.inProcessTasks.length > 20) {
        //    this.paginationValuesinProcessTasks[AppConstants.getPaginationOptions.length] = this.inProcessTasks.length;
        //  }

        //  this.paginationValuespausedTasks = AppConstants.getPaginationOptions;
        //  if (this.pausedTasks.length > 20) {
        //    this.paginationValuespausedTasks[AppConstants.getPaginationOptions.length] = this.pausedTasks.length;
        //  }


        //  this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
        //  if (this.completedTasks.length > 20) {
        //    this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
        //  }
          // this.loadingStatus = false;
          this.loaderService.display(false);
       }

       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => { // console.log('Get all strains complete');
      this.loaderService.display(false); });
  }

  getAllTaskTypes() {
   // this.loaderService.display(true);
    this.dropdownDataService.getAllTask().subscribe(
      data => {
        // console.log(data);
        this.globalData.taskTypes = data;
        this.taskTypes = this.dropdwonTransformService.transform(data, 'TaskTypeValue', 'TaskTypeId', 'Show All', false) ;
       // this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      );
  }

  taskTypeChange() {
    let Taskypeid = 0 ;
    const SelectValue = this.managerdashboardForm.value.ShowallManager;
    const SelectValueCompleted = this.managerdashboardForm.value.ShowallManagerForTskComplete;

   if (!isNaN(Number(this.managerdashboardForm.value.taskTypes))) {
    Taskypeid = Number(this.managerdashboardForm.value.taskTypes);
    this.selectedTabName = TabIndexName[this.selectedTabIndex];
  }
    if ( Number(SelectValue) === 1) {
      this.getTaskListForOther( Taskypeid, false);
    } else if (  Number(SelectValue) === 2) {
        this.getTaskListForOther( Taskypeid, true);
     }
 }

  showAllManagerChange() {
   const SelectValue = this.managerdashboardForm.value.ShowallManager;
   let Taskypeid = 0 ;
   if (!isNaN(Number(this.managerdashboardForm.value.taskTypes))) {
    Taskypeid = Number(this.managerdashboardForm.value.taskTypes);
  }

   if ( Number(SelectValue) === 1) {
        this.getTaskListForOther( Taskypeid, false);
      } else if (  Number(SelectValue) === 2) {
          this.getTaskListForOther( Taskypeid, true);
        //  this.getCount(true);
       } else {
      //  this.getTaskList(Taskypeid);
   }
   this.selectedShowMgr = Number(SelectValue);
  }

  showAllManagerCompleteTskChange( ) {
    const SelectValue = this.managerdashboardForm.value.ShowallManagerForTskComplete;
    let Taskypeid = 0 ;
    if (!isNaN(Number(this.managerdashboardForm.value.taskTypes))) {
     Taskypeid = Number(this.managerdashboardForm.value.taskTypes);
   }
    if ( Number(SelectValue) === 1) {
       //  this.getTaskListForCompleted( Taskypeid, false);
       } else if (  Number(SelectValue) === 2) {
        //   this.getTaskListForCompleted( Taskypeid, true);
        }
  }

  getTaskListForOther(TaskTypeId, ShowAllForMgr) {
    this.loaderService.display(true);
    this.selectedTabName = TabIndexName[this.selectedTabIndex];
    const TaskId = TaskTypeId ? TaskTypeId : 0;

    this.reviewPendingTasks = [];
    this.assignedTasks = [];
    this.pausedTasks = [];
    this.completedTasks = [];
    this.inProcessTasks = [];

    this.taskCommonService.getTasksList(ShowAllForMgr, this.selectedTabName, TaskId).subscribe(
      data => {
       if (data !== 'No data found!') {
         this.taskCount = data.Table[0];
        this.tasklotDetails = data.Table2;
        this.completetasklotDetails = data.Table2;
         if (TaskTypeId) {
          if (this.selectedTabIndex === TabIndexName.REVIEWPENDING) {
           this.reviewPendingTasksevent = null;
           this.dashboardObject.reviewPending = data.Table1;
            this.reviewPendingTasks = data.Table1;
            this.paginationValuesreviewPendingTasks = AppConstants.getPaginationOptions;
            if (this.reviewPendingTasks.length > 20) {
              this.paginationValuesreviewPendingTasks[AppConstants.getPaginationOptions.length] = this.reviewPendingTasks.length;
            }
           } else if (this.selectedTabIndex === TabIndexName.ASSIGNED) {
            this.assignedTasksevent = null;
            this.dashboardObject.assigned = data.Table1;
              this.assignedTasks = data.Table1;
              this.paginationValuesassignedTasks = AppConstants.getPaginationOptions;
            if (this.assignedTasks.length1 > 20) {
              this.paginationValuesassignedTasks[AppConstants.getPaginationOptions.length] = this.assignedTasks.length;
            }
             } else if (this.selectedTabIndex === TabIndexName.INPROCESS) {
               this.inProcessTasksevent = null;
               this.dashboardObject.inProcess = data.Table1;
              this.inProcessTasks = data.Table1;
              this.paginationValuesinProcessTasks = AppConstants.getPaginationOptions;
            if (this.inProcessTasks.length > 20) {
              this.paginationValuesinProcessTasks[AppConstants.getPaginationOptions.length] = this.inProcessTasks.length;
            }
             } else if (this.selectedTabIndex === TabIndexName.PAUSED) {
              this.pausedTasksevent = null;
              this.dashboardObject.paused = data.Table1;
              this.pausedTasks = data.Table1;
              this.paginationValuespausedTasks = AppConstants.getPaginationOptions;
              if (this.pausedTasks.length > 20) {
                this.paginationValuespausedTasks[AppConstants.getPaginationOptions.length] = this.pausedTasks.length;
              }
             } else if (this.selectedTabIndex === TabIndexName.COMPLETED) {
              this.completedTasksevent = null;
              this.dashboardObject.completed = data.Table1;
              this.completedTasks = data.Table1;
              this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
            if (this.completedTasks.length > 20) {
              this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
            }
             }
              this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending && result.TaskTypeId === TaskTypeId);

        } else {
          if (this.selectedTabIndex === TabIndexName.REVIEWPENDING) {
            this.reviewPendingTasksevent = null;
          this.reviewPendingTasks = data.Table1;
          this.dashboardObject.reviewPending = data.Table1;
          this.paginationValuesreviewPendingTasks = AppConstants.getPaginationOptions;
          if (this.reviewPendingTasks.length > 20) {
            this.paginationValuesreviewPendingTasks[AppConstants.getPaginationOptions.length] = this.reviewPendingTasks.length;
          }
        } else if (this.selectedTabIndex === TabIndexName.ASSIGNED) {
          this.assignedTasksevent = null;
          this.dashboardObject.assigned = data.Table1;
          this.assignedTasks = data.Table1;
          this.paginationValuesassignedTasks = AppConstants.getPaginationOptions;
            if (this.assignedTasks.length1 > 20) {
              this.paginationValuesassignedTasks[AppConstants.getPaginationOptions.length] = this.assignedTasks.length;
            }
         } else if (this.selectedTabIndex === TabIndexName.INPROCESS) {
           this.inProcessTasksevent = null;
           this.dashboardObject.inProcess = data.Table1;
          this.inProcessTasks = data.Table1;
          this.paginationValuesinProcessTasks = AppConstants.getPaginationOptions;
            if (this.inProcessTasks.length > 20) {
              this.paginationValuesinProcessTasks[AppConstants.getPaginationOptions.length] = this.inProcessTasks.length;
            }
         } else if (this.selectedTabIndex === TabIndexName.PAUSED) {
           this.pausedTasksevent = null;
           this.dashboardObject.paused = data.Table1;
          this.pausedTasks = data.Table1;
          this.paginationValuespausedTasks = AppConstants.getPaginationOptions;
          if (this.pausedTasks.length > 20) {
            this.paginationValuespausedTasks[AppConstants.getPaginationOptions.length] = this.pausedTasks.length;
          }
         } else if (this.selectedTabIndex === TabIndexName.COMPLETED) {
          this.completedTasksevent = null;
          this.dashboardObject.completed = data.Table1;
          this.completedTasks = data.Table1;
          this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
            if (this.completedTasks.length > 20) {
              this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
            }
         }
          this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending);
         }
          this.loaderService.display(false);
       } else {
        this.reviewPendingTasks = null;
        this.assignedTasks = null;
        this.inProcessTasks = null;
        this.pausedTasks = null;
        this.tasks = null;
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => {  this.loaderService.display(false);  });
  }

  // getTaskListForCompleted(TaskTypeId, ShowAllForMgr) {
  //   this.loaderService.display(true);
  //   this.taskCommonService.getTasksList(ShowAllForMgr, 'COMPLETED').subscribe(
  //     data => {
  //      if (data !== 'No data found!') {
  //       this.completetasklotDetails = data.Table1.filter(Result =>  String(Result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed);
  //        if (TaskTypeId) {

  //        this.completedTasks = data.Table.filter(result =>
  //             String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed && result.TaskTypeId === TaskTypeId);
  //        this.completeCount = this.completedTasks.length;
  //           this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending && result.TaskTypeId === TaskTypeId);
  //        } else {
  //           this.completedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed);
  //           this.completeCount = this.completedTasks.length;

  //           this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending);
  //        }
  //        this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
  //        if (this.completedTasks.length > 20) {
  //          this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
  //        }

  //         this.loaderService.display(false);
  //      } else {
  //       this.completedTasks = null;
  //       this.tasks = null;
  //      }
  //      this.loaderService.display(false);
  //     } ,
  //     error => { console.log(error); this.loaderService.display(false); },
  //     () => {   this.loaderService.display(false); });
  // }

  resetTable(dataTable) {
    dataTable.reset();
  }

  showDialog(TaskId, TaskStatus) {
    this.display = false;
    if ( String(TaskStatus).toLocaleUpperCase() !== this.taskStatus.Completed) {
      this.tasklotDetailsBytaskId = this.tasklotDetails.filter(Result => Result.Taskid === TaskId);
    } else {
      this.tasklotDetailsBytaskId = this.completetasklotDetails.filter(Result => Result.Taskid === TaskId);
    }

    this.display = true;
    // event.stopPropagation();
    //  return;
  }

onRowSelect(e) {
  // this.chooseRow = true
  // if((this.chooseRow && this.chooseCheckBox) === true){
    if (!this.display) {
      this.router.navigate(['../home/taskaction', e.TaskTypeKey, e.TaskId]);
    }
  // }
 
}
// selectrow(event: any){
//   // var value =this.managerdashboardForm.controls.checkbox
//   if(this.managerdashboardForm.controls.checkbox.value === true){
//     this.chooseCheckBox = false;
//   }
//   else{
//     this.chooseCheckBox = true;
//     this.chooseRow=false
//   }
  
//   console.log("hi")
// }
selectrow(task){

  if(this.selectedCheckBoxes.indexOf(task.TaskId)=== -1){
    this.showButton = true;
    this.selectedCheckBoxes.push(task.TaskId)
  }
  else{
    let index = this.selectedCheckBoxes.indexOf(task.TaskId);
    this.selectedCheckBoxes.splice(index,1)
  }
  if(this.selectedCheckBoxes.length === 0){
    this.showButton = false;
  }
  
}
showConfirmationMessage(value){
  let strMessage: any;
  if(value[0].TaskStatus ==='ASSIGNED'){
    strMessage ='Do you want to Delete these tasks?' ;
  }
  else{
    strMessage ='Do you want to Pause these tasks?' ;
  }
  this.confirmationService.confirm({
    message: strMessage,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
      if(value[0].TaskStatus ==='ASSIGNED'){
       this.deleteTasks();
      }
      else{
        this.pausetask();
      }
      },
      reject: () => {
       
      }
  });

}
deleteTasks(){

  let TaskDetailsForApi;
  TaskDetailsForApi = {
  
    VirtualRoleId:this._cookieService.VirtualRoleId,
    TaskIdList : [],
  };
for(let value of this.selectedCheckBoxes){
  TaskDetailsForApi.TaskIdList.push({
    TaskId:value
  })
};
this.loaderService.display(true);
this.managerdashboardService.deleteMultipleTasks(TaskDetailsForApi).subscribe(
  data => {
    this.msgs = [];
    if (String(data).toLocaleUpperCase() === 'SUCCESS') {
      this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
      detail:'Tasks Successfully Deleted' });
      this.showButton = false;
      this.selectedCheckBoxes = []
      this.selectedTaskTypeId = 1
      this.onTabChange(null)
    }
    else if(String(data) === 'NoDelete') {
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
      detail:'Tasks already Deleted' });
      this.selectedCheckBoxes = []
    }
    else if(String(data) === 'Failure'){
      this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
      detail:'Something Went Wrong At Server Side' });
      this.selectedCheckBoxes = []
    }
    this.loaderService.display(false);
  }
)
}
pausetask(){
  
  let TaskDetailsForApi;
  TaskDetailsForApi = {
    TaskDetails:{
      TaskStatus:"PAUSED",
      VirtualRoleId:this._cookieService.VirtualRoleId,
    },
  
    TaskIdList : [],
  };
for(let value of this.selectedCheckBoxes){
  TaskDetailsForApi.TaskIdList.push({
    TaskId:value
  })
};
this.loaderService.display(true);
this.managerdashboardService.pauseMultipleTasks(TaskDetailsForApi).subscribe(
  data => {
    this.msgs = [];
    if (String(data.Table[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
      this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
      detail:'Tasks Successfully Paused' });
      this.selectedCheckBoxes = []
      this.showButton = false;
      this.selectedTaskTypeId = 1
      this.onTabChange(null)
    
    }
    else if (String(data.Table[0].ResultKey) === 'Record already Updated'){
      this.selectedCheckBoxes = []
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
      detail:'Tasks Already Paused' });
    }
    else if(String(data.Table[0].ResultKey) === 'Record Deleted'){
      this.selectedCheckBoxes = []
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
      detail:'Tasks Deleted' });
    }
    this.loaderService.display(false);
  }
)
  console.log(this.selectedCheckBoxes)
}
closeDailog() {
  this.display = false;
  this.display = false;
}


  // Added by Devdan :: 21-Nov-2018 :: Adding Lot Note Comment
  ShowLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }
  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

  // Tab change load data
  onTabChange(e) {
    if (e) {
      this.selectedTabIndex = e.index;
    }
    this.reviewPendingTasks = [];
    this.assignedTasks = [];
    this.pausedTasks = [];
    this.completedTasks = [];
    this.inProcessTasks = [];
    this.reviewPendingTasksevent = null;
    this.assignedTasksevent = null;
    this.inProcessTasksevent = null;
    this.pausedTasksevent = null;
    this.completedTasksevent = null;

    this.selectedTaskTypeId = this.managerdashboardForm.value.taskTypes;
    this.selectedTabName = TabIndexName[this.selectedTabIndex];
    this.showMgr = this.selectedShowMgr === 1 ? false : true;
    const TaskTypeId = this.selectedTaskTypeId ? this.selectedTaskTypeId : 0;
    this.appCommonService.setLocalStorage('MDTabIndex', JSON.stringify(this.selectedTabIndex));
    this.loaderService.display(true);
    this.taskCommonService.getTasksList(this.showMgr, this.selectedTabName, TaskTypeId).subscribe(
    data => {
      if (data !== 'No data found!') {
        this.taskCount = data.Table[0];
        this.tasklotDetails = data.Table2;
        this.completetasklotDetails = data.Table2;
    if (this.selectedTaskTypeId) {
      if (this.selectedTabIndex === TabIndexName.REVIEWPENDING) {
        this.dashboardObject.reviewPending = data.Table1;
        this.reviewPendingTasks = data.Table1;
        this.paginationValuesreviewPendingTasks = AppConstants.getPaginationOptions;
         if (this.reviewPendingTasks.length > 20) {
           this.paginationValuesreviewPendingTasks[AppConstants.getPaginationOptions.length] = this.reviewPendingTasks.length;
         }
         this.loaderService.display(false);
      } else if (this.selectedTabIndex === TabIndexName.ASSIGNED) {
        this.dashboardObject.assigned = data.Table1;
        this.dashboardObject.assigned = data.Table1;
        this.assignedTasks = data.Table1;
        this.paginationValuesassignedTasks = AppConstants.getPaginationOptions;
         if (this.assignedTasks.length > 20) {
           this.paginationValuesassignedTasks[AppConstants.getPaginationOptions.length] = this.assignedTasks.length;
         }
         this.loaderService.display(false);
      } else if (this.selectedTabIndex === TabIndexName.INPROCESS) {
        this.dashboardObject.inProcess = data.Table1;
        this.inProcessTasks = data.Table1;
        this.paginationValuesinProcessTasks = AppConstants.getPaginationOptions;
         if (this.inProcessTasks.length > 20) {
           this.paginationValuesinProcessTasks[AppConstants.getPaginationOptions.length] = this.inProcessTasks.length;
         }
         this.loaderService.display(false);
      } else if (this.selectedTabIndex === TabIndexName.PAUSED) {
        this.dashboardObject.paused = data.Table1;
        this.pausedTasks = data.Table1 ;
        this.paginationValuespausedTasks = AppConstants.getPaginationOptions;
         if (this.pausedTasks.length > 20) {
           this.paginationValuespausedTasks[AppConstants.getPaginationOptions.length] = this.pausedTasks.length;
         }
         this.loaderService.display(false);
      } else if (this.selectedTabIndex === TabIndexName.COMPLETED) {
        this.dashboardObject.completed = data.Table1;
        this.completedTasks = data.Table1;
        this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
          if (this.completedTasks.length > 20) {
            this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
          }
          this.loaderService.display(false);
    }

    } else {
        if (this.selectedTabIndex === TabIndexName.REVIEWPENDING) {
          this.dashboardObject.reviewPending = data.Table1;
            this.reviewPendingTasks = data.Table1;
            this.paginationValuesreviewPendingTasks = AppConstants.getPaginationOptions;
            if (this.reviewPendingTasks.length > 20) {
              this.paginationValuesreviewPendingTasks[AppConstants.getPaginationOptions.length] = this.reviewPendingTasks.length;
            }
            this.loaderService.display(false);
        } else if (this.selectedTabIndex === TabIndexName.ASSIGNED) {
          this.dashboardObject.assigned = data.Table1;
            this.assignedTasks = data.Table1;
            this.paginationValuesassignedTasks = AppConstants.getPaginationOptions;
            if (this.assignedTasks.length1 > 20) {
              this.paginationValuesassignedTasks[AppConstants.getPaginationOptions.length] = this.assignedTasks.length;
            }
            this.loaderService.display(false);
        } else if (this.selectedTabIndex === TabIndexName.INPROCESS) {
          this.dashboardObject.inProcess = data.Table1;
            this.inProcessTasks = data.Table1;
            this.paginationValuesinProcessTasks = AppConstants.getPaginationOptions;
            if (this.inProcessTasks.length > 20) {
              this.paginationValuesinProcessTasks[AppConstants.getPaginationOptions.length] = this.inProcessTasks.length;
            }
            this.loaderService.display(false);
        } else if (this.selectedTabIndex === TabIndexName.PAUSED) {
          this.dashboardObject.paused = data.Table1;
            this.pausedTasks = data.Table1;
            this.paginationValuespausedTasks = AppConstants.getPaginationOptions;
            if (this.pausedTasks.length > 20) {
              this.paginationValuespausedTasks[AppConstants.getPaginationOptions.length] = this.pausedTasks.length;
            }
            this.loaderService.display(false);
        } else if (this.selectedTabIndex === TabIndexName.COMPLETED) {
          this.dashboardObject.completed = data.Table1;
            this.completedTasks = data.Table1;
            this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
            if (this.completedTasks.length > 20) {
              this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
            }
            this.loaderService.display(false);
        }
      }
    } else {
      this.reviewPendingTasks = null;
      this.assignedTasks = null;
      this.inProcessTasks = null;
      this.pausedTasks = null;
      this.tasks = null;
     }

  });
  }

  // print

   print(): void {
    let popupWin;
    let printContents: string;
    this.isPrintClicked = true;
    printContents = document.getElementById('PRINT' + this.selectedTabName).innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <style type = "text/css">
          @page {
            size: auto;
            margin: 10mm 0 10mm 0;
        }
          .ui-widget, body {
            font-family: "Roboto", "Trebuchet MS", Arial, Helvetica, sans-serif;
            font-size: 0.94rem;
          }
          .ui-widget, .ui-widget * {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
            .ui-g-12 {
              width: 100%;
          }
          b, strong {
            font-weight: bolder;
          }
          .ui-md-2 {
            width: 16.6667%;
          }
          .ui-md-5 {
          width: 41.6667%;
          }
          .ui-md-3 {
            width: 25%;
          }
          .ui-md-4 {
            width: 33.3333%;
          }
          .ui-md-1, .ui-md-2, .ui-md-3, .ui-md-4, .ui-md-5, .ui-md-6, .ui-md-7, .ui-md-8, .ui-md-9, .ui-md-10, .ui-md-11, .ui-md-12 {
            padding: .5em;
          }
          .ui-g-1, .ui-g-2, .ui-g-3, .ui-g-4, .ui-g-5, .ui-g-6, .ui-g-7, .ui-g-8, .ui-g-9, .ui-g-10, .ui-g-11, .ui-g-12 {
            float: left;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: .5em;
          }
          .paddingRL {
            padding: 0em .8em;
            position: relative;
          }
          label {
            display: inline-block;
            margin-bottom: .1rem ;
          }
          .ui-table .ui-table-tbody>tr>td {
            word-break: break-word;
          }

          .clsWrapText div.paddingRL div label{
            word-break: break-word;
          }
          @media print {
            body {-webkit-print-color-adjust: exact;}

            .ui-table .ui-table-tbody>tr>td {
              word-break: break-word;
            }

            .clsSectionHeader .clsHeaderTitlebar {
              padding: .1em .75em;
              border: 1px solid #d9d9d9;
              font-weight: normal;
            }
            .clsHeaderTitlebar {
                background-image: none;
                background-color: #0C59CF ;
                color: white;
            }
            .clsSectionHeader * {
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
            }
            span.clsTextTitle {
                margin-top: 10px;
                margin-bottom: 5px;
                font-size: 18px;
            }
            .ui-md-12 {
              width: 100%;
            }
            .ui-md-6 {
              width: 50%;
            }
            .ui-widget, .ui-widget * {
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
            }
            .ui-corner-all {
              border-radius: 0px !important;
            }
            .marginBottom {
            margin-bottom: 10px;
            }
            .ui-card-body {
              padding: 15px;
              border: 1px solid #D5D5D5;
            }
            .ui-table table {
              border-collapse: collapse;
              width: 100%;
              table-layout: fixed;
            }
            .ui-table .ui-table-thead>tr>th, .ui-table .ui-table-tbody>tr>td, .ui-table .ui-table-tfoot>tr>td {
              padding: .25em .5em;
            }
            .ui-table .ui-table-tbody > tr
              .marginBottom {
                margin-bottom: 10px;
            }
            .ui-table .ui-table-thead > tr:first-child {
              /*background-image: none !important;
              background-color: #0C59CF !important;
              color: #FFFFFF !important;
              background: -webkit-gradient(linear, left top, left bottom, from(#f6f7f9), to(#ebedf0));
              background: linear-gradient(to bottom, #f6f7f9 0%, #ebedf0 100%);
              */
              font-weight: bold;
              text-align:left;
              border: 1px solid #D5D5D5;
            }
            .ui-table .ui-table-tbody > tr {
              border: 1px solid #D5D5D5;
              background: inherit;
            }
            .clsRemoveFrmPrint {
              display:none!important;
            }
        }
        </style>
      </head>
      <body onload="window.print();">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }

}
