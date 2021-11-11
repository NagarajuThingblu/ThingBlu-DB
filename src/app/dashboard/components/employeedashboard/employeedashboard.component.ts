import { environment } from './../../../../environments/environment';
import { DashboardModule } from './../../dashboard.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { TaskResources } from '../../../task/task.resources';
import { GlobalResources } from '../../../global resource/global.resource';
import { SelectItem } from 'primeng/api';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../task/services/task-common.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConstants } from '../../../shared/models/app.constants';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppComponent } from '../../../app.component';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../services/refresh.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-employeedashboard',
  templateUrl: 'employeedashboard.component.html',
  styleUrls: ['employeedashboard.component.css']
})
export class EmployeedashboardComponent implements OnInit, OnDestroy {

  id: any;
  refreshTimeStamp: any;
  public empDashboardForm: FormGroup;

  public tasknames: SelectItem[];
  public lots: SelectItem[];
  public employees: SelectItem[];
  public priorities: SelectItem[];
  public brands: SelectItem[];
  public strains: SelectItem[];
  public status: SelectItem[];

  public submitted: boolean;
  public tasks: any;
  public todaysTasks: any;
  public delayedTasks: any;
  public inProgressTasks: any;
  public futureTasks: any;
  public completedTasks: any;

  public searchTaskResource: any;
  public globalResource: any;
  public taskStatus: any;
  paginationValuesTodaysData: any;
  paginationValuesInprogressData: any;
  paginationValuesDelayedData: any;
  paginationValuesCompletedData: any;
  paginationValuesFutureData: any;
  public  display = false;
  public tasklotDetailsBytaskId: any;

  todaysDataevent: any;
  inprogressDataevent: any;
  delayedDataevent: any;
  completedDataevent: any;
  futureDataevent: any;

  public globalData = {
    todaysData: [],
    inprogressData: [],
    delayedData: [],
    futureData: [],
    completedData: [],
    tasklotDetails: []
  };

  // Added by Devdan :: 21-Nov-2018 :: Adding Lot Note Comment
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private taskCommonService: TaskCommonService,
    // private cookieService: CookieService,
    private loaderService: LoaderService,
    // private AppComponentData: AppComponent,
    private titleService: Title,
    private refreshService: RefreshService,
    private appCommonService: AppCommonService,
    private router: Router
  ) {
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
        });
    }, 1000 * 60 * environment.refreshTime );
  }
  updateChange() {
    this.getAllTasks();
  }
  ngOnInit() {
    this.startTimer();
    this.searchTaskResource = TaskResources.getResources().en.searchtask;
    this.globalResource = GlobalResources.getResources().en;
    this.taskStatus =  AppConstants.getStatusList;
    this.titleService.setTitle(this.searchTaskResource.Title);

    // console.log(new Date(new Date().toLocaleDateString()));
    // console.log(new Date().toLocaleString());
    // console.log(Date.now().toString());
    // this.tasks = this.taskCommonService.GetTodaysTasksList();
    // this.GetTaskList();
    this.getAllTasks();
    // this.GetEmployeeListByClient();
    // this.GetAllTask();

    this.empDashboardForm = this.fb.group({
      'taskname': new FormControl(''),
      // 'brand': new FormControl(''),
      // 'strain': new FormControl(''),
      // 'employee': new FormControl(''),
      // // 'estimatedstartdatetime': new FormControl('',  Validators.compose([Validators.required])),
      // 'estimatedstartdate': new FormControl(''),
      // 'estimatedenddate': new FormControl(''),
      // 'priority': new FormControl(''),
      // 'status': new FormControl(''),
    });
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
    // localStorage.removeItem('refreshedTimeStamp');
    this.appCommonService.removeItem('refreshedTimeStamp');
  }
  todaysDataonPageChange(e1) {
    this.todaysDataevent = e1;
  }
  inprogressDataonPageChange(e2) {
    this.inprogressDataevent = e2;
  }
  delayedDataonPageChange(e3) {
    this.delayedDataevent = e3;
  }
  futureDataonPageChange(e4) {
    this.futureDataevent = e4;
  }
  completedDataonPageChange(e5) {
    this.completedDataevent = e5;
  }
returnFormattedDate(dateObject) {
  return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
}

getEmployeeListByClient() {
  this.dropdownDataService.getEmployeeListByClient().subscribe(
    data => {
      // console.log(data);
      this.employees = data;
      this.loaderService.display(false);
    } ,
    error => { console.log(error); this.loaderService.display(false); },
    () => console.log('Get all Employees by client complete'));
}
// GetAllTask() {
//   this.dropdownDataService.getAllTask().subscribe(
//     data => {
//       console.log(data);
//       this.tasknames = data;
//       this.loaderService.display(false);
//     } ,
//     error => { console.log(error); this.loaderService.display(false); },
//     () => console.log('Get all strains complete'));

// }
// GetTaskList() {
//   this.taskCommonService.GetTasksList().subscribe(
//     data => {
//       this.tasks = data;
//       this.loaderService.display(false);
//       this.todaysTasks = this.tasks.filter(result => {
//         return ((this.ReturnFormattedDate(new Date(this.ReturnFormattedDate(new Date()))) === this.ReturnFormattedDate(new Date(result.EstStartDate))));
//       });
//       // alert(this.appCommonService.getUserProfile().VirtualRoleId);
//       this.delayedTasks = this.tasks.filter(result => {
//         return ((new Date(result.EstStartDate) < new Date(this.ReturnFormattedDate(new Date())))
//           && (String(result.TaskStatus).toLocaleUpperCase() === this.TaskStatus.Assigned) );
//       });

//       this.inProgressTasks = this.tasks.filter(result => {
//                  return (new Date(result.ActStartDate) <= new Date(this.ReturnFormattedDate(new Date()))
//           && (String(result.TaskStatus).toLocaleUpperCase() === this.TaskStatus.InProcess
//           || String(result.TaskStatus).toLocaleUpperCase() === this.TaskStatus.Paused));
//       });

//       this.futureTasks = this.tasks.filter(result => {
//         // console.log('result.EstStartDate', result.EstStartDate);
//         return new Date(result.EstStartDate) > new Date(this.ReturnFormattedDate(new Date()));
//       });

//       this.completedTasks = this.tasks.filter(result => {
//         return String(result.TaskStatus).toLocaleUpperCase() === this.TaskStatus.Completed
//               || String(result.TaskStatus).toLocaleUpperCase() === this.TaskStatus.ReviewPending;
//       });
//     } ,
//     error => { console.log(error); this.loaderService.display(false); },
//     () => { console.log('Get all strains complete'); this.loaderService.display(false); });
// }
  onSubmit(assignTaskFormValues: string) {
    this.submitted = true;
    // console.log(assignTaskFormValues);
    if (this.empDashboardForm.valid) {

      // this.TaskCommonService.AssignTask(this.empDashboardForm.value)
      // .subscribe(
      //     data => {
      //       // this.router.navigate(['']);
      //       console.log(data);
      //     },
      //     error => {
      //         console.log(error);
      //     });


      // this.assignTaskForm.reset();
    }
  }

  onRowSelect(e) {
    if (!this.display) {
      this.router.navigate(['../home/taskaction', e.TaskTypeKey, e.TaskId]);
    }
  }

  getAllTasks() {
    this.taskCommonService.getEmployeeTaskListbyUserRole().subscribe(
      data => {
       // console.log(data);
        this.globalData.todaysData =  data.Table;
        this.globalData.delayedData =  data.Table1;
        this.globalData.inprogressData =  data.Table2;
        this.globalData.futureData =  data.Table3;
        this.globalData.completedData =  data.Table4;
        this.globalData.tasklotDetails = data.Table5;

        this.paginationValuesTodaysData = AppConstants.getPaginationOptions;
        if (this.globalData.todaysData.length > 20) {
          this.paginationValuesTodaysData[AppConstants.getPaginationOptions.length] = this.globalData.todaysData.length;
        }

        this.paginationValuesInprogressData = AppConstants.getPaginationOptions;
        if (this.globalData.delayedData.length > 20) {
          this.paginationValuesInprogressData[AppConstants.getPaginationOptions.length] = this.globalData.delayedData.length;
        }
        this.paginationValuesDelayedData = AppConstants.getPaginationOptions;
        if (this.globalData.inprogressData.length > 20) {
          this.paginationValuesDelayedData[AppConstants.getPaginationOptions.length] = this.globalData.inprogressData.length;
        }
        this.paginationValuesFutureData = AppConstants.getPaginationOptions;
        if (this.globalData.futureData.length > 20) {
          this.paginationValuesFutureData[AppConstants.getPaginationOptions.length] = this.globalData.futureData.length;
        }
        this.paginationValuesCompletedData = AppConstants.getPaginationOptions;
        if (this.globalData.completedData.length > 20) {
          this.paginationValuesCompletedData[AppConstants.getPaginationOptions.length] = this.globalData.completedData.length;
        }
       // console.log(this.globalData.todaysData);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => { console.log('Get all Cultivar complete'); this.loaderService.display(false); });
  }
  showDialog(TaskId) {
    // event.stopPropagation();
    this.display = false;
    this.tasklotDetailsBytaskId = this.globalData.tasklotDetails.filter(Result => Result.Taskid === TaskId);
    this.display = true;
}
  get diagnostic() { return JSON.stringify(this.empDashboardForm.value); }

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
