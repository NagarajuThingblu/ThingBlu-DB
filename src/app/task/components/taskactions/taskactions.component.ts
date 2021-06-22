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
import { PlantingComponent } from '../taskparameters/planting/planting.component';
import { FormGroup, NgModel, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-taskactions',
  templateUrl: 'taskactions.component.html',
  styleUrls: ['taskactions.component.css']
})
export class TaskactionsComponent implements OnInit {
  EndDateEditForm: FormGroup;
  public taskid;
  public taskType;
  public taskActionDetails1: any;
  public taskStatusHistory: any;
  public binDetails: any;
  public inputbinDetails: any;
  public taskCategory: any;
  public popup:boolean = false;
  public BinData: any[];
  public editEndDateAndTime: boolean = false;
  public enddate;
  public minHeight;
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
    'RevHrs':null,
    'EmpFinalCost': null,
    'MiscCost': null,
    'IsManagerNotify': true,
    'IsEmpNotify': true,
    'Comments': '',
    'EmpId':'',
    'EmpName': '',
    'TaskTypeName': '',
    'GrowerLotNo': '',
    'BrandName': '',
    'StrainName': null,
    'AssignedWt': '',
    'TaskTypeKey': null,
    'StartWeight': 0,
    'IsLotCompleted': null,
    // Added by Devdan :: 08-Oct-2018 :: To get task type id
    'TaskTypeId': 0,
    'RevCompletedPlantCnt':0,
    'FieldName': '',
    'SectionName': '',
    'AssignedPlantCnt':'',
    'CompletedPlantCnt': '',
    'TerminatedPlantCnt': '',
    'TerminationReason': null,
    'comment': '',
    'WetWt':0,
    'dryweight':0,
    'OPBinWt':0,
    'WasteWt':0,
    'binId':'',
    'binFull': true,
    'isStrainComplete': true,
   'IPLabelName':'',
   'IPBinWt':0,
   'BinWt':0,
   'InputBinId':'',
   'IsLightDeprevation':''
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
  public AssignRole: any;
  constructor(
    private fb: FormBuilder,
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
        }else if (this.taskActionDetails.TaskTypeKey === 'GRINDING') {
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
        } else if (this.taskActionDetails.TaskTypeKey === 'CUSTOMTASK'|| this.taskActionDetails.TaskTypeKey === 'INDEPENDENT') {
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
          this.binDetails = data.Table1? data.Table1 : [];
          this.inputbinDetails = data.Table3?data.Table3 : [];
        }
        this.AssignRole = this.taskStatusHistory.filter(d => d.RoleName === 'Employee' && d.TaskStatus === 'ASSIGNED' );
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
    this.taskCategory = this._cookieService.TaskCategory,

    this.getTaskDetaisByTask();
    this.BinData =[
      {TaskName:'Planting', TaskId:123},
      {TaskName:'Harvesting', TaskId:456}
    ]
    
      this.EndDateEditForm = this.fb.group({
        'editenddate': new FormControl('',  Validators.compose([Validators.required])),
      });
    
  
  }
  pausetask(TaskModel){
      this.apiUrl = 'api/Task/TaskUpdateStatus';
  var flag = "Pause"
      const taskStatusParameter = {
        apiUrl: 'api/Task/TaskUpdateStatus',
        taskId: TaskModel.TaskId,
        taskStatus: flag === 'Pause' ? this.TaskStatus.Paused : this.TaskStatus.InProcess
      };
  
      // http call start
      this.loaderService.display(true);
      this.taskCommonService.resumeOrPauseTask(taskStatusParameter)
      .subscribe(data => {
          // http call end
          this.loaderService.display(false);
          if (data === 'NoUpdate') {
            this.msgs = [];
  
            if (flag === 'Pause') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskalreadypaused });
              this.taskActionDetails.TaskStatus = this.TaskStatus.Paused;
              this.popup = false;
             
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
            this.popup = false;
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
  startTask() {
    this.apiUrl = 'api/Task/TaskUpdateStatus';
    const taskStatusParameters = {
      apiUrl: 'api/Task/TaskUpdateStatus',
      taskId: this.taskid,
      taskStatus: this.TaskStatus.InProcess
    };

  // this.confirmationService.confirm({
  //   message: this.globalResource.saveconfirm,
  //   header: 'Confirmation',
  //   icon: 'fa fa-exclamation-triangle',
  //   accept: () => {
          // http call starts
          this.loaderService.display(true);
          this.taskCommonService.startTask(taskStatusParameters)
          .subscribe(data => {
                // http call end
                this.loaderService.display(false);
                if(data.Table[0].ResultKey === "success" && this.taskCategory === "GROWING"){
                  this.taskActionDetails.TaskStatus = this.TaskStatus.InProcess;
              this.getTaskDetaisByTask();
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskstarted });
                }
                else if(data.Table[0].ResultKey !=""&& this.taskCategory === "GROWING"){
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data.Table[0].ResultKey+" Please Finish those tasks to start this task." });
                  this.popup = false;
                }
               else if(data.Table[0].ResultKey ===""&& this.taskCategory === "GROWING"){
                  this.popup = true;
                  this.BinData =data.Table1 
                }
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
            } else if (data === 'Success'){
              this.taskActionDetails.TaskStatus = this.TaskStatus.InProcess;
              this.getTaskDetaisByTask();
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.taskActionResource.taskstarted });
            }
            // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
            // this.refreshService.PushChange().subscribe(
            //       msg => {
            //       });
          });
    //   },
    //   reject: () => {
    //       // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
    //   }
    // });

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
        } 
        else if(data.Table[0].ResultKey ===""){
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: "Finish the tasks in INPROCESS stage to resume this task." });
        

        }
        else {
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
  editEndDtae(){
    this.editEndDateAndTime = true;
  }
  updateEndDate(formModel){
    let endDateEditApi;
    if ( this.EndDateEditForm.valid === true) {
      endDateEditApi = {
        "TaskData": {
          "TaskId": this.taskid,
          "ClientId":this._cookieService.ClientId,
          "VirtualRoleId": this._cookieService.VirtualRoleId,
          "EmpId": this.taskActionDetails.EmpId,
           "ActEndDate":String(formModel.editenddate),
          // "ActEndDate": new Date(formModel.editenddate).toLocaleDateString().replace(/\u200E/g, ''),
        }
      }
    }
    this.taskCommonService.editEndDate(endDateEditApi)
    .subscribe(data => {
      if (data === 'Record Updated Successfully') {
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
        detail:"Record Updated Successfully"});
        setTimeout( () => {
          this.router.navigate(['home/managerdashboard']);
        }, 2000);
        // this.router.navigate(['home/managerdashboard']);
      }
     else if(data ==="Task End Date Less Than Start Date"){
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail:"Task End Date Less Than Start Date"});
      }
    else  if(data === 'Failure'){
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
        detail:"Failed To update" });
      }
      else{
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
        detail:"Record Updated Successfully"});
        this.router.navigate(['home/managerdashboard']);
      }
    })
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
            detail: this.taskActionResource.lottrimcompletedmsgForEdit });
        } else {
          this.router.navigate(['home/assigntask', this.taskid]);
          return;
        }
        // setTimeout( () => {
        //   if (this._cookieService.UserRole === this.userRoles.Manager) {
        //     this.router.navigate(['home/managerdashboard']);
        //   } else {
        //     this.router.navigate(['home/empdashboard']);
        //   }

        this.loaderService.display(false);
        // }, 2000);
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

            setTimeout( () => {
              if (this._cookieService.UserRole === this.userRoles.Manager) {
                this.router.navigate(['home/managerdashboard']);
              } else {
                this.router.navigate(['home/empdashboard']);
              }
              this.loaderService.display(false);
            }, 2000);
          } else if (data === 'Failure') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: 'Error Occured' });
          }
          this.loaderService.display(false);
        });
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }
  // Added by Devdan :: 20-Nov-2018 :: Back button redirect to dashboard
  backToDashboard() {
    if (this._cookieService.UserRole === this.userRoles.Manager || this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
      this.router.navigate(['home/managerdashboard']);
    } else {
      this.router.navigate(['home/empdashboard']);
    }
  }

  incHeight(){
    this.minHeight = 700;
  }
  resetHeight(){
    this.minHeight = 100;
  }
}
