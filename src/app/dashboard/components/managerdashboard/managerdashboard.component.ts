import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { TaskCommonService } from '../../../task/services/task-common.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { SelectItem } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RefreshService } from '../../services/refresh.service';
import { environment } from './../../../../environments/environment';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { Router } from '@angular/router';


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
  public showAllManagerForCompleteModel: any;

  // Added by Devdan :: 21-Nov-2018 :: Adding Lot Note Comment
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  constructor(
    private taskCommonService: TaskCommonService,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private loaderService: LoaderService,
    private titleService: Title,
    private fb: FormBuilder,
    private router: Router,
    private refreshService: RefreshService,
    private appCommonService: AppCommonService
  ) { }


  ngOnInit() {
    // this.startTimer();
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.globalResource.ManagerDashboard);
    this.showAllManagerOption = [
      {label: 'Only Me', value: '1'},
      {label: 'Show All', value: '2'},
  ];
      this.getTaskList(0);
      this.getAllTaskTypes();
      this.taskStatus =  AppConstants.getStatusList;
      this.managerdashboardForm = this.fb.group({
        'taskTypes': new FormControl(null),
        'ShowallManager': new FormControl(2),
        'ShowallManagerForTskComplete': new FormControl(1)
      });
      // this.connection = this.chatService.getMessages().subscribe(message => {
     //   this.getTaskList(0);
     //   this.getAllTaskTypes();
    //  } ,
    //  error => { console.log('sms'); console.log(error); this.loaderService.display(false); });
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
            console.log('refresh');
          } else  if ( this.refreshTimeStamp === '' || this.refreshTimeStamp === null) {
            // localStorage.setItem('refreshedTimeStamp', data);
            this.appCommonService.setLocalStorage('refreshedTimeStamp', data);
          }
          console.log('new refresh time(Encrypted) : ' + this.refreshTimeStamp);
          console.log('new refresh time(Decrypted) : ' + this.refreshTimeStamp);
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
    localStorage.removeItem('refreshedTimeStamp');
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
    this.taskCommonService.getTasksList(true, 'DEFAULT').subscribe(
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
          this.assignedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Assigned);
          this.inProcessTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.InProcess);
          this.pausedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Paused);
          this.completedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed);

            this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending);
         }

         this.paginationValuesassignedTasks = AppConstants.getPaginationOptions;
         if (this.assignedTasks.length > 20) {
           this.paginationValuesassignedTasks[AppConstants.getPaginationOptions.length] = this.assignedTasks.length;
         }

         this.paginationValuesinProcessTasks = AppConstants.getPaginationOptions;
         if (this.inProcessTasks.length > 20) {
           this.paginationValuesinProcessTasks[AppConstants.getPaginationOptions.length] = this.inProcessTasks.length;
         }

         this.paginationValuespausedTasks = AppConstants.getPaginationOptions;
         if (this.pausedTasks.length > 20) {
           this.paginationValuespausedTasks[AppConstants.getPaginationOptions.length] = this.pausedTasks.length;
         }

         this.paginationValuesreviewPendingTasks = AppConstants.getPaginationOptions;
         if (this.reviewPendingTasks.length > 20) {
           this.paginationValuesreviewPendingTasks[AppConstants.getPaginationOptions.length] = this.reviewPendingTasks.length;
         }

         this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
         if (this.completedTasks.length > 20) {
           this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
         }
          // this.loadingStatus = false;
          this.loaderService.display(false);
       }

       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => { console.log('Get all strains complete');  this.loaderService.display(false); });
  }

  getAllTaskTypes() {
    this.loaderService.display(true);
    this.dropdownDataService.getAllTask().subscribe(
      data => {
        // console.log(data);
        this.globalData.taskTypes = data;
        this.taskTypes = this.dropdwonTransformService.transform(data, 'TaskTypeName', 'TaskTypeId', '-- Select --', false) ;
        this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('sucess'));
  }

  taskTypeChange() {
    let Taskypeid = 0 ;
    // const SelectValue = this.managerdashboardForm.value.ShowallManager ? this.managerdashboardForm.value.ShowallManager : 1;
    // const SelectValueCompleted = this.managerdashboardForm.value.ShowallManagerForTskComplete ?
    //                               this.managerdashboardForm .value.ShowallManagerForTskComplete : 1;

    const SelectValue = 1;
    const SelectValueCompleted = 1;

   if (!isNaN(Number(this.managerdashboardForm.value.taskTypes))) {
    Taskypeid = Number(this.managerdashboardForm.value.taskTypes);
  }

    // this.getTaskList(Taskypeid);

    if ( Number(SelectValue) === 1) {
      this.getTaskListForOther( Taskypeid, false);
    } else if (  Number(SelectValue) === 2) {
        this.getTaskListForOther( Taskypeid, true);
     }

      if ( Number(SelectValueCompleted) === 1) {
        this.getTaskListForCompleted( Taskypeid, false);
      } else if (  Number(SelectValueCompleted) === 2) {
          this.getTaskListForCompleted( Taskypeid, true);
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
       } else {
        this.getTaskList(Taskypeid);
   }
  }

  showAllManagerCompleteTskChange( ) {
    const SelectValue = this.managerdashboardForm.value.ShowallManagerForTskComplete;
    let Taskypeid = 0 ;
    if (!isNaN(Number(this.managerdashboardForm.value.taskTypes))) {
     Taskypeid = Number(this.managerdashboardForm.value.taskTypes);
   }
    if ( Number(SelectValue) === 1) {
         this.getTaskListForCompleted( Taskypeid, false);
       } else if (  Number(SelectValue) === 2) {
           this.getTaskListForCompleted( Taskypeid, true);
        }
  }

  getTaskListForOther(TaskTypeId, ShowAllForMgr) {
    this.loaderService.display(true);
    // this.loadingStatus = false;
    this.taskCommonService.getTasksList(ShowAllForMgr, 'OTHER').subscribe(
      data => {
        // this.tasks = data;
       if (data !== 'No data found!') {
        this.tasklotDetails = data.Table1;
         if (TaskTypeId) {
            this.reviewPendingTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.ReviewPending && result.TaskTypeId === TaskTypeId);
            this.assignedTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Assigned && result.TaskTypeId === TaskTypeId);
            this.inProcessTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.InProcess && result.TaskTypeId === TaskTypeId);
            this.pausedTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Paused && result.TaskTypeId === TaskTypeId);
            this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending && result.TaskTypeId === TaskTypeId);
         } else {
          this.reviewPendingTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.ReviewPending);
          this.assignedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Assigned);
          this.inProcessTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.InProcess);
          this.pausedTasks = data.Table.filter(result => String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Paused);
            this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending);
         }
          // this.loadingStatus = false;
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
      () => { console.log('Get all strains complete'); this.loaderService.display(false);  });
  }

  getTaskListForCompleted(TaskTypeId, ShowAllForMgr) {
    this.loaderService.display(true);
    // this.loadingStatus = false;
    this.taskCommonService.getTasksList(ShowAllForMgr, 'COMPLETED').subscribe(
      data => {
        // this.tasks = data;
       if (data !== 'No data found!') {
        // this.tasklotDetails = data.Table1;
        this.completetasklotDetails = data.Table1.filter(Result =>  String(Result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed);
         if (TaskTypeId) {
         this.completedTasks = data.Table.filter(result =>
              String(result.TaskStatus).toLocaleUpperCase() === this.taskStatus.Completed && result.TaskTypeId === TaskTypeId);

            this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending && result.TaskTypeId === TaskTypeId);
         } else {
            this.completedTasks = data.Table.filter(result => String(result.taskStatus).toLocaleUpperCase() === this.taskStatus.Completed);

            this.tasks = data.Table.filter(result => result.TaskStatus !== this.taskStatus.ReviewPending);
         }
         this.paginationValuescompletedTasks = AppConstants.getPaginationOptions;
         if (this.completedTasks.length > 20) {
           this.paginationValuescompletedTasks[AppConstants.getPaginationOptions.length] = this.completedTasks.length;
         }
          // this.loadingStatus = false;
          this.loaderService.display(false);
       } else {
        this.completedTasks = null;
        this.tasks = null;
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => { console.log('Get all strains complete');  this.loaderService.display(false); });
  }

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
  if (!this.display) {
    this.router.navigate(['../home/taskaction', e.TaskTypeKey, e.TaskId]);
  }
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
}
