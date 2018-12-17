import { QuestionService } from './../../../shared/services/question.service';
import { QuestionBase } from './../../../shared/models/question-base';
import { AppConstants } from './../../../shared/models/app.constants';
import { UserModel } from './../../../shared/models/user.model';
import { TaskCommonService } from './../../services/task-common.service';
import { DataService } from './../../../shared/services/DataService.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskResources } from '../../task.resources';
import { GlobalResources } from '../../../global resource/global.resource';
import { CookieService } from 'ngx-cookie-service';
import { Message, ConfirmationService } from 'primeng/api';
import { LoaderService } from '../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { RefreshService } from '../../../dashboard/services/refresh.service';

@Component({
  moduleId: module.id,
  selector: 'app-taskactions',
  templateUrl: 'taskactions.component.html',
  styleUrls: ['taskactions.component.css']
})
export class TaskactionsComponent implements OnInit {

  public taskid;
  public taskType;
  public taskActionDetails1: any;
  public taskStatusHistory: any;

  taskActionDetails = {
    'LotId': '',
    'TaskPriority': '',
    'TaskStatus': '',
    'EmpHourlyCost': 0,
    'EstStartDate': '',
    'EstEndDate': '',
    'EstHrs': 0,
    'EmpEstCost': 0,
    'ActStartDate': null,
    'ActEndDate': null,
    'ActHrs': null,
    'FinalHrs': null,
    'EmpFinalCost': null,
    'MiscCost': null,
    'IsManagerNotify': true,
    'IsEmpNotify': true,
    'Comments': '',
    'EmpName': '',
    'TaskTypeName': '',
    'GrowerLotNo': '',
    'BrandName': '',
    'StrainName': '',
    'AssignedWt': '',
    'TaskTypeKey': null,
    'StartWeight': 0,
    'IsLotCompleted': null,
    // Added by Devdan :: 08-Oct-2018 :: To get task type id
    'TaskTypeId': 0
  };

  public page: any = {
    page: 'TaskAction',
    showmodal: false,
    showReviewmodal: false
  };

  loading;
  empRoomTasks;

  public taskActionResource: any;
  public globalResource: any;
  private apiUrl: string;
  public _cookieService: UserModel;
  public msgs: Message[] = [];
  public TaskStatus: any;
  questions: any[];
  public userRoles: any;
  // Added by Devdan
  taskTypeId: any;

  constructor(
    private route: ActivatedRoute,
    private http: DataService,
    private taskCommonService: TaskCommonService,
    private appCommonService: AppCommonService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private service: QuestionService,
    private loaderService: LoaderService,
    private titleService: Title,
    private refreshService: RefreshService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
    this.route.params.forEach((urlParams) => {
      this.taskid = urlParams['id'];
      this.taskType = urlParams['taskType'];
    });

    this.questions = this.route.snapshot.data.data.sort((a, b) => a.order - b.order);
    // service.getQuestionsSet().subscribe(
    //   questions => {
    //       this.questions = questions;
    //   },
    //   error => console.error(error)
    // );
  }

  getTaskDetaisByTask() {
     // http call starts
     this.loaderService.display(true);
     this.taskActionDetails.TaskTypeKey = null;
    this.taskCommonService.getTaskDetailsByTask(this.taskid).subscribe(
      data => {
        // this.taskActionDetails = data;
        this.taskActionDetails =  data.Table ? data.Table[0] : [];
        this.taskTypeId = this.taskActionDetails.TaskTypeId;

        // Check if task is already deleted and redirect to dashboard
        if (this.taskActionDetails['IsDeleted']) {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskalreadydeleted });

          setTimeout( () => {
            if (this._cookieService.UserRole === this.userRoles.Manager) {
              this.router.navigate(['home/managerdashboard']);
            } else {
              this.router.navigate(['home/empdashboard']);
            }
          }, 2000);
          return;
        }
        // End of  Check if task is already deleted and redirect to dashboard

        this.taskActionDetails1 =  data.Table1 ? data.Table1[0] : [];
        this.taskType = this.taskActionDetails.TaskTypeKey;

        if (this.taskActionDetails.TaskTypeKey === 'BUDPACKAGING') {
          data.Table2 ? this.taskActionDetails['AssignQtyDetails'] = data.Table2 : this.taskActionDetails['AssignQtyDetails'] = [];
          data.Table3 ? this.taskActionDetails['AssignQtyLotDetails'] = data.Table3 : this.taskActionDetails['AssignQtyLotDetails'] = [];
          data.Table4 ? this.taskActionDetails['ReviewQtyLotDetails'] = data.Table4 : this.taskActionDetails['ReviewQtyLotDetails'] = [];
          this.taskActionDetails['MixedLotPkgDetails'] = data.Table5 ? data.Table5 : [] ;


          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
        } else if (this.taskActionDetails.TaskTypeKey === 'GRINDING') {
          this.taskActionDetails1 =  data.Table2[0];
          this.taskActionDetails = Object.assign(this.taskActionDetails, this.taskActionDetails1);

          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
        } else if (this.taskActionDetails.TaskTypeKey === 'JOINTSCREATION') {
          this.taskActionDetails1 =  data.Table2[0];
          this.taskActionDetails = Object.assign(this.taskActionDetails, this.taskActionDetails1);

          this.taskActionDetails['JointsCompRevDetails'] = data.Table3 ? data.Table3 : [];
          this.taskActionDetails['JointPackageSizeDetails'] = data.Table4 ? data.Table4 : [];
          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];

        } else if (this.taskActionDetails.TaskTypeKey === 'TAMPING') {
          // this.taskActionDetails1 =  data.Table2[0];
          // this.taskActionDetails = Object.assign(this.taskActionDetails, this.taskActionDetails1);
          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
          this.taskActionDetails['TampingLotDetails'] = data.Table2;
          this.taskActionDetails['TampingCompletionLotDetails'] = data.Table3;

        } else if (this.taskActionDetails.TaskTypeKey === 'TUBING') {
          this.taskActionDetails['AssignQtyDetails'] =  data.Table2 ?  data.Table2 : [];
          this.taskActionDetails['AssignQtyLotDetails'] = data.Table3 ? data.Table3 : [];
          this.taskActionDetails['ReviewQtyLotDetails'] = data.Table4 ? data.Table4 : [];
          this.taskActionDetails['MixedLotPkgDetails'] = data.Table5 ? data.Table5 : [] ;

          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
        } else  if (this.taskActionDetails.TaskTypeKey === 'OILPACKAGING') {
          this.taskActionDetails =  data.Table[0];
          this.taskActionDetails['AssignQtyDetails'] = data.Table2 ? data.Table2 : [];
          this.taskActionDetails['AssignQtyPkgDetails'] =  data.Table3 ? data.Table3 : [];
          this.taskActionDetails['ReviewQtyPkgDetails'] = data.Table4 ? data.Table4 : [];
          this.taskActionDetails['MixedOilPkgDetails'] = data.Table5 ? data.Table5 : [] ;

          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
        } else if (this.taskActionDetails.TaskTypeKey === 'CUSTOMTASK') {
          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
        } else if (this.taskActionDetails.TaskTypeKey === 'QACHECK') {
          this.taskActionDetails['AssignOrderPkgQtyDetails'] = data.Table2 ? data.Table2 : [];
          this.taskActionDetails['AssignBudPkgDetails'] = data.Table3 ? data.Table3 : [];
          this.taskActionDetails['AssignJointsPkgDetails'] = data.Table4 ? data.Table4 : [];
          this.taskActionDetails['AssignOilPkgDetails'] = data.Table5 ? data.Table5 : [];
          this.taskActionDetails['BudMixPkgLotDetails'] = data.Table6 ? data.Table6 : [];
          this.taskActionDetails['JointsMixPkgLotDetails'] = data.Table7 ? data.Table7 : [];
          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];

        } else if (this.taskActionDetails.TaskTypeKey === 'REPACK') {
          this.taskActionDetails['AssignOrderPkgQtyDetails'] = data.Table2 ? data.Table2 : [];
          this.taskActionDetails['AssignBudPkgDetails'] = data.Table3 ? data.Table3 : [];
          this.taskActionDetails['AssignJointsPkgDetails'] = data.Table4 ? data.Table4 : [];
          this.taskActionDetails['AssignOilPkgDetails'] = data.Table5 ? data.Table5 : [];
          this.taskActionDetails['BudMixPkgLotDetails'] = data.Table6 ? data.Table6 : [];
          this.taskActionDetails['JointsMixPkgLotDetails'] = data.Table7 ? data.Table7 : [];
          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];

        } else if (this.taskActionDetails.TaskTypeKey === 'REBRAND') {
          this.taskActionDetails['AssignOrderPkgQtyDetails'] = data.Table2 ? data.Table2 : [];
          this.taskActionDetails['AssignBudPkgDetails'] = data.Table3 ? data.Table3 : [];
          this.taskActionDetails['AssignJointsPkgDetails'] = data.Table4 ? data.Table4 : [];
          this.taskActionDetails['AssignOilPkgDetails'] = data.Table5 ? data.Table5 : [];
          this.taskActionDetails['BudMixPkgLotDetails'] = data.Table6 ? data.Table6 : [];
          this.taskActionDetails['JointsMixPkgLotDetails'] = data.Table7 ? data.Table7 : [];
          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
        } else if (this.taskActionDetails.TaskTypeKey === 'TUBELABELING') {
          this.taskActionDetails['AssignQtyDetails'] =  data.Table2 ?  data.Table2 : [];
          this.taskActionDetails['AssignQtyLotDetails'] = data.Table3 ? data.Table3 : [];
          this.taskActionDetails['MixPkgQtyDetails'] = data.Table4 ? data.Table4 : [] ;
          this.taskActionDetails['ReviewQtyLotDetails'] = data.Table5 ? data.Table5 : [];

          this.taskStatusHistory =  data.Table1 ? data.Table1 : [];
        } else {
          this.taskActionDetails = Object.assign(this.taskActionDetails, this.taskActionDetails1);
          this.taskStatusHistory =  data.Table2 ? data.Table2 : [];
        }

          // http call starts
          this.loaderService.display(false);
      } ,
      error => { console.log(error); },
      () => {
              console.log('Get all strains complete');
          }
      );
    }

  ngOnInit() {
    this.taskActionResource = TaskResources.getResources().en.taskaction;
    this.globalResource = GlobalResources.getResources().en;
    this.TaskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.titleService.setTitle(this.taskActionResource.title);

    this.getTaskDetaisByTask();

  }

  startTask() {
    this.apiUrl = 'api/Task/TaskUpdateStatus';

    const taskStatusParameters = {
      apiUrl: 'api/Task/TaskUpdateStatus',
      taskId: this.taskid,
      taskStatus: this.TaskStatus.InProcess
    };

  this.confirmationService.confirm({
    message: this.globalResource.saveconfirm,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
          // http call starts
          this.loaderService.display(true);
          this.taskCommonService.startTask(taskStatusParameters)
          .subscribe(data => {
                // http call end
                this.loaderService.display(false);
            if (data === 'NoUpdate') {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskalreadystarted });
              this.taskActionDetails.TaskStatus = this.TaskStatus.InProcess;

              setTimeout( () => {
                this.router.navigate(['home/taskaction', this.taskType, this.taskid]);
              }, 2000);
            } else if (data === 'LOTTRIMCOMPLETED') {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.lottrimcompletedmsg });
            } else if (data === 'Deleted') {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskActionCannotPerformS });

              setTimeout( () => {
                if (this._cookieService.UserRole === this.userRoles.Manager) {
                  this.router.navigate(['home/managerdashboard']);
                } else {
                  this.router.navigate(['home/empdashboard']);
                }
              }, 2000);
            } else {
              this.taskActionDetails.TaskStatus = this.TaskStatus.InProcess;
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskstarted });

              this.getTaskDetaisByTask();
            }
            // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
            // this.refreshService.PushChange().subscribe(
            //       msg => {
            //       });
          });
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });

  }
  resumeOrPauseTask(flag) {
    this.apiUrl = 'api/Task/TaskUpdateStatus';

    const taskStatusParameters = {
      apiUrl: 'api/Task/TaskUpdateStatus',
      taskId: this.taskid,
      taskStatus: flag === 'Pause' ? this.TaskStatus.Paused : this.TaskStatus.InProcess
    };

    // http call start
    this.loaderService.display(true);
    this.taskCommonService.resumeOrPauseTask(taskStatusParameters)
    .subscribe(data => {
        // http call end
        this.loaderService.display(false);
        if (data === 'NoUpdate') {
          this.msgs = [];

          if (flag === 'Pause') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskalreadypaused });
            this.taskActionDetails.TaskStatus = this.TaskStatus.Paused;
          } else {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskalreadyresumed });
            this.taskActionDetails.TaskStatus = this.TaskStatus.InProcess;
          }

          setTimeout( () => {
            this.router.navigate(['home/taskaction', this.taskType, this.taskid]);
          }, 2000);

        } else if (data === 'Deleted') {
          if (flag === 'Pause') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.taskActionResource.taskActionCannotPerformP });
          } else {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskActionCannotPerformR });
          }

          setTimeout( () => {
            if (this._cookieService.UserRole === this.userRoles.Manager) {
              this.router.navigate(['home/managerdashboard']);
            } else {
              this.router.navigate(['home/empdashboard']);
            }
          }, 2000);
        } else if (flag === 'Pause') {
          this.taskActionDetails.TaskStatus = this.TaskStatus.Paused;
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskpaused });
        } else {
          this.taskActionDetails.TaskStatus = this.TaskStatus.InProcess;
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskresumed });
        }

      this.getTaskDetaisByTask();
      // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
      // this.refreshService.PushChange().subscribe(
      //   msg => {
      //   });
    });
  }
  editTask() {

    this.taskCommonService.getTaskStatusByTaskId(this.taskid).subscribe(data => {
      this.msgs = [];
      if (data === 'FAILURE') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Error Occured' });
      } else {
        console.log(data);
        if (data[0].IsDeleted) {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.taskActionResource.taskActionCannotEditDeleted });
        } else if (String(data[0].TaskStatus).toLocaleUpperCase() !== 'ASSIGNED') {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.taskActionResource.taskActionCannotEditStarted });
        } else if (data[0].IsTrimmedCompleted) {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.taskActionResource.lottrimcompletedmsg });
        } else {
          this.router.navigate(['home/assigntask', this.taskid]);
          return;
        }
        setTimeout( () => {
          if (this._cookieService.UserRole === this.userRoles.Manager) {
            this.router.navigate(['home/managerdashboard']);
          } else {
            this.router.navigate(['home/empdashboard']);
          }

          this.loaderService.display(false);
        }, 2000);
      }
    });
  }
  deleteTask() {
    const taskDeleteDetailsForApi = {
      TaskId: Number(this.taskid),
      VirtualRoleId: 0,
      TaskKeyName: ''
    };
    this.confirmationService.confirm({
      message: this.taskActionResource.deleteConfirm,
      header: this.globalResource.applicationmsg,
      icon: 'fa fa-trash',
      accept: () => {
         // http call start
        this.loaderService.display(true);
        this.taskCommonService.deleteTask(taskDeleteDetailsForApi)
        .subscribe(data => {
          // http call end
          if (data === 'NoDelete') {
            this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.taskActionResource.taskActonCannotDeleted });
          } else if (data === 'Success') {
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.taskActionResource.taskDeletedSuccessfully });
          } else if (data === 'Failure') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: 'Error Occured' });
          }
          setTimeout( () => {
            if (this._cookieService.UserRole === this.userRoles.Manager) {
              this.router.navigate(['home/managerdashboard']);
            } else {
              this.router.navigate(['home/empdashboard']);
            }
            this.loaderService.display(false);
          }, 2000);
        });
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }
  // Added by Devdan :: 20-Nov-2018 :: Back button redirect to dashboard
  backToDashboard() {
    if (this._cookieService.UserRole === this.userRoles.Manager) {
      this.router.navigate(['home/managerdashboard']);
    } else {
      this.router.navigate(['home/empdashboard']);
    }
  }
}
