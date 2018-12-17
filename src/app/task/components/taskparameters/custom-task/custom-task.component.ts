import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DropdownValuesService } from '../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../services/task-common.service';
import { Message, SelectItem } from 'primeng/api';
import { TaskResources } from '../../../task.resources';
import { PositiveIntegerValidator } from '../../../../shared/validators/positive-integer.validator';
import { GlobalResources } from '../../../../global resource/global.resource';
import { QuestionBase } from '../../../../shared/models/question-base';
import { UserModel } from '../../../../shared/models/user.model';
import { QuestionControlService } from '../../../../shared/services/question-control.service';
import { QuestionService } from '../../../../shared/services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../../shared/services/dropdown-transform.service';
import { LotService } from '../../../../lot/services/lot.service';
import { AppConstants } from '../../../../shared/models/app.constants';
import { AppCommonService } from '../../../../shared/services/app-common.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../dashboard/services/refresh.service';

@Component({
  moduleId: module.id,
  selector: 'app-custom-task',
  templateUrl: 'custom-task.component.html',
})
export class CustomTaskComponent implements OnInit {
  CUSTOMTASK: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;

  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Input() TaskModel: any;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();

  public _cookieService: UserModel;
  public taskStatus: any;
  public selectedLotComments: any = [];
  public showPastDateLabel = false;
  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // public LotInfo: any = {
  //   LotId: 0,
  //   showLotNoteModal: false
  // };

  constructor(
    private fb: FormBuilder,
    private taskCommonService: TaskCommonService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private dropdwonTransformService: DropdwonTransformService,
    private lotService: LotService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private titleService: Title,
    private refreshService: RefreshService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  display = false;

  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // public Lots: any[];
  // public Employees: any[];
  // public Priorities: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;
  public clientSkewed: any[];
  public taskReviewModel: any;
  public taskCompletionModel: any;
  public userRoles: any;
  public msgs: Message[] = [];
  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // TaskActionDetails: any;
  public taskid: any;
  public taskType: any;
  public defaultDate: Date;
  public showToManager = false;
  public LotCommentsCount = 10;
  // Added by Devdan :: 10-Oct-2018
  taskTypeId: any;
  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;
  ngOnInit() {
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.taskStatus =  AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.titleService.setTitle(this.assignTaskResources.custometitle);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.route.params.forEach((urlParams) => {
      // Modified by Devdan :: 09-Oct-2018
      this.taskid = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Added by Devdan :: 09-Oct-2018
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails !== undefined) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });



    if (this.PageFlag.page !== 'TaskAction') {
      alert(this.taskTypeId);
      this.TaskModel.CUSTOMTASK = {
        startdate: this.TaskModel.startdate,
        employee: '',
        esthrs: '',
        usercomment: '',
        emprate: '',
        empcost: ''
      };

      this.CUSTOMTASK = this.fb.group({
        'lotno': new FormControl(0, Validators.required),
        // 'brand': new FormControl(''),
        // 'strain': new FormControl(''),
        'employee': new FormControl(0),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl('',  Validators.compose([  ])),
        'emprate': new FormControl(''),
        'actualcost': new FormControl(0),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(null),
        'notifyemployee': new FormControl(null),
        'comment': new FormControl('', Validators.maxLength(500)),
      });

      this.ParentFormGroup.addControl('CUSTOMTASK', this.CUSTOMTASK);

      if (this.taskTypeId > 0) {
          this.TaskModel.CUSTOMTASK = {
            startdate: this.TaskModel.startdate,
            employee: this.TaskModel.TaskDetails.EmpId,
            esthrs: '',
            usercomment: this.TaskModel.TaskDetails.TaskComment,
            emprate: '',
            empcost: ''
        };
      }

    } else {
      this.taskReviewModel = {
        actualcost: this.TaskModel.EmpFinalCost,
        misccost: this.TaskModel.MiscCost,
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
        ractualcost: this.TaskModel.RevEmpEstCost ? this.TaskModel.RevEmpEstCost : this.TaskModel.EmpEstCost,
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
        rmisccomment: ''
      };

      // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
      this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      this.taskCompletionModel = {
        misccost: this.TaskModel.MiscCost,
        actualcost: this.TaskModel.EmpFinalCost,
        misccomment: '',
        islotcomplete: ''
      };

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }

      this.completionForm = this.fb.group({
        'misccomment':  new FormControl(null, Validators.compose([Validators.maxLength(500)])),
      });

      this.reviewForm = this.fb.group({
        'rmisccost': new FormControl(''),
        'rmisccomment': new FormControl(null, Validators.compose([Validators.maxLength(500)])),
        'ActHrs': new FormControl(null),
        'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)]))
      });

      // this.completionForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));
    }
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // ReturnFormattedDate(dateObject) {
  //   return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  // }

  // Complete Parameter Saving
  completeTask(formModel) {
    let taskCompletionWebApi;

    taskCompletionWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: 0,
        Comment: formModel.misccomment,
        TaskKeyName: 'CUSTOMTASK',
      }
    };

    if ( this.completionForm.valid === true) {
        // http call starts
        this.loaderService.display(true);

        this.taskCommonService.completeTask(taskCompletionWebApi)
        .subscribe(data => {
          if (data === 'NoComplete') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });

            if (this.TaskModel.IsReview === true) {
              this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
            } else {
              this.TaskModel.TaskStatus = this.taskStatus.Completed;
            }
            this.TaskCompleteOrReviewed.emit();
          } else if (data === 'Deleted') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });

            setTimeout( () => {
              if (this._cookieService.UserRole === this.userRoles.Manager) {
                this.router.navigate(['home/managerdashboard']);
              } else {
                this.router.navigate(['home/empdashboard']);
              }
            }, 2000);
          } else if (data === 'Failure') {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          } else {
            if (this.TaskModel.IsReview === true) {
              this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
            } else {
              this.TaskModel.TaskStatus = this.taskStatus.Completed;
            }
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.assignTaskResources.taskcompleteddetailssavesuccess });

            setTimeout( () => {
              if (this._cookieService.UserRole === this.userRoles.Manager) {
                this.router.navigate(['home/managerdashboard']);
              } else {
                this.router.navigate(['home/empdashboard']);
              }
            }, 2000);
          }
        });

        this.PageFlag.showmodal = false;
      // http call ends
      // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
      // this.refreshService.PushChange().subscribe(
      //   msg => {
      //   });
       this.loaderService.display(false);
    }
  }
  // Commented by Devdan :: Sec to Min change :: 06-Nov-2018
  // CaluculateTotalMins(Hours, Mins) {
  //   return (Number(Hours) * 60) + Number(Mins);
  // }
  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
  CaluculateTotalSecs(Hours, Mins, Secs) {
    return (Number(Hours) * 3600) + (Number(Mins) * 60) + Number(Secs);
  }

  // Review Parameter Saving
  submitReview(formModel) {
    let taskReviewWebApi;
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    taskReviewWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: Number(formModel.rmisccost),
        // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
        Comment: formModel.rmisccomment,
        TaskKeyName: 'CUSTOMTASK',
      },
    };

    if ( this.reviewForm.valid === true) {
      // http call starts
      this.loaderService.display(true);

      this.taskCommonService.submitTaskReview(taskReviewWebApi)
      .subscribe(data => {

      if (data === 'NoReview') {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadyreviewed });
        this.TaskModel.TaskStatus = this.taskStatus.Completed;

        if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
          this.showToManager = true;
        }

        setTimeout( () => {
          this.router.navigate(['home/taskaction', this.taskType, this.taskid]);
        }, 2000);

      } else if (data === 'Deleted') {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformR });

        setTimeout( () => {
          if (this._cookieService.UserRole === this.userRoles.Manager) {
            this.router.navigate(['home/managerdashboard']);
          } else {
            this.router.navigate(['home/empdashboard']);
          }
        }, 2000);
      } else if (data === 'Failure') {
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
      } else {
        this.TaskModel.TaskStatus = this.taskStatus.Completed;

        if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
          this.showToManager = true;
        }

        this.msgs = [];
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.reviewsubmittedsuccess });

        setTimeout( () => {
          if (this._cookieService.UserRole === this.userRoles.Manager) {
            this.router.navigate(['home/managerdashboard']);
          } else {
            this.router.navigate(['home/empdashboard']);
          }
        }, 2000);
      }
    });

    this.PageFlag.showReviewmodal = false;
    // http call ends
    // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
    // this.refreshService.PushChange().subscribe(
    //   msg => {
    //   });
    this.loaderService.display(false);
  }
  }
// Complete Parameter Saving
  submitCompleteParameter(formModel) {
      if (this.completionForm.valid) {
        this.completeTask(formModel);
      } else {
        this.appCommonService.validateAllFields(this.completionForm);
      }
  }

  // Review Parameter Saving
  submitReviewParameter(formModel) {
    if (this.reviewForm.valid) {
      this.submitReview(formModel);
    } else {
      this.appCommonService.validateAllFields(this.reviewForm);
    }
}

    // To get all form fields values where dynamic or static
    get diagnostic() { return JSON.stringify(this.completionForm.value); }

}
