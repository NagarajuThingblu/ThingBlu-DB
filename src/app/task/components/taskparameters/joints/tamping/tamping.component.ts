import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DropdownValuesService } from '../../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../../services/task-common.service';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { TaskResources } from '../../../../task.resources';
import { PositiveIntegerValidator } from '../../../../../shared/validators/positive-integer.validator';
import { GlobalResources } from '../../../../../global resource/global.resource';
import { QuestionBase } from '../../../../../shared/models/question-base';
import { UserModel } from '../../../../../shared/models/user.model';
import { QuestionControlService } from '../../../../../shared/services/question-control.service';
import { QuestionService } from '../../../../../shared/services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../../../shared/services/dropdown-transform.service';
import { LotService } from '../../../../../lot/services/lot.service';
import { AppConstants } from '../../../../../shared/models/app.constants';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../../dashboard/services/refresh.service';

@Component({
  moduleId: module.id,
  selector: 'app-tamping',
  templateUrl: './tamping.component.html'
})
export class TampingComponent implements OnInit, OnDestroy {
  TAMPING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;

  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  // tslint:disable-next-line:no-input-rename
  @Input('TaskModel') TaskModel: any;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();
  @Input() AssignRole: any;

  questions: QuestionBase<any>[];
  public _cookieService: UserModel;
  public taskStatus: any;
  public selectedLotComments: any = [];
  public showPastDateLabel = false;
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  // Joint Production Dashboard Redirection Details
  public prodDBRouteParams: any;

  public assignRole: any;

  public readonlyFlag: Boolean = false;
  public readonlyEmployeeFlag: Boolean = false;
  // End Joint Production Dashboard Redirection Details

  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private qcs: QuestionControlService ,
    private service: QuestionService,
    private taskCommonService: TaskCommonService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private dropdwonTransformService: DropdwonTransformService,
    private lotService: LotService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
    this.questions = service.getQuestions();
    this.prodDBRouteParams = this.appCommonService.prodDBRouteParams;
  }

  display = false;

  public lots: any[];
  public employees: any[];
  public priorities: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;
  public clientSkewed: any[];
  public taskReviewModel: any;
  public taskCompletionModel: any;

  public msgs: Message[] = [];
  // TaskActionDetails: any; // Commented by Devdan :: 26-Oct-2018 :: Unused
  public taskid: any;
  public taskType: any;
  public defaultDate: Date;
  public showToManager = false;
  public lotCommentsCount = 10;
  public userRoles: any;

  private globalData = {
    lots: [],
    employees: []
  };
  // Added by devdan :: 12-Oct-2018
  public taskTypeId: any;
  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;
  ngOnDestroy() {
    this.appCommonService.prodDBRouteParams = null;
    this.prodDBRouteParams = null;
  }

  ngOnInit() {

    // for navigate joint dashboard if employee assign task :: 20-Mar-2019 :: swapnil
    this.assignRole = this.AssignRole ? this.AssignRole : null;

    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.taskStatus =  AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.titleService.setTitle(this.assignTaskResources.tampingtitle);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.route.params.forEach((urlParams) => {
      // this.taskid = urlParams['id'];
      // this.taskType = urlParams['taskType'];
      // Modified by Devdan :: 12-Oct-2018 :: Getting Tasktype and task id from Edit Task Component
      this.taskid = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails !== undefined) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.TAMPING = {
        lotno: '',
        brand: '',
        strain: '',
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        employee: '',
        esthrs: '',
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: '',
        // tampingconecount: '',
        lotweight: '',
        emprate: '',
        empcost: ''
      };

      this.TAMPING = this.fb.group({
        // 'lotno': new FormControl('', Validators.required),
        // 'brand': new FormControl(''),
        // 'strain': new FormControl(''),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        // 'estimatedenddate': new FormControl('',  Validators.compose([])),
        // 'endtime': new FormControl('',  Validators.compose([])),
        // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl('',  Validators.compose([  ])),
        'emprate': new FormControl(''),
        'actualcost': new FormControl(''),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        // 'tampingconecount': new FormControl('', Validators.compose([Validators.required, Validators.min(0.1)]))
      });

      this.employeeListByClient();
      this.getLotListByTask();

      this.priorities =  [
        {label: 'Normal', value: 'Normal'},
        {label: 'Important', value: 'Important'},
        {label: 'Critical', value: 'Critical'},
        {label: 'Down Time', value: 'DownTime'},
      ];

      this.ParentFormGroup.addControl('TAMPING', this.TAMPING);

      // Populate strain & lot by default. Joint production dashboard functionality
      if (this.prodDBRouteParams) {
        this.TaskModel.TAMPING.employee = this._cookieService.EmpId;

        if (String(this._cookieService.UserRole) === String(this.userRoles.Employee)) {
          this.readonlyEmployeeFlag = true;
        }
        this.readonlyFlag = true;
      }
      // End of Populate strain & lot by default. Joint production dashboard functionality

      // Added by Devdan :: 12-Oct-2018 :: Load Stain Change Event
      if (this.taskTypeId > 0) {
        this.setFormInEditMode(0);
      }

    } else {
      this.taskReviewModel = {
        processedwt: this.TaskModel.ProcessedWt,
        assignedwt:  this.TaskModel.AssignedWt,
        actualcost: this.TaskModel.EmpFinalCost,
        misccost: this.TaskModel.MiscCost,
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
        rprocessedwt: this.TaskModel.RevProcessedWt ? this.TaskModel.RevProcessedWt : this.TaskModel.ProcessedWt,
        ractualcost: this.TaskModel.RevEmpEstCost ? this.TaskModel.RevEmpEstCost : this.TaskModel.EmpEstCost,
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
        rmisccomment: ''
      };

      // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
      this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      this.taskCompletionModel = {
        processedwt: this.TaskModel.ProcessedWt,
        assignedwt: this.TaskModel.AssignedWt,
        misccost: this.TaskModel.MiscCost,
        actualcost: this.TaskModel.EmpFinalCost,
        misccomment: '',
        islotcomplete: ''
      };

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }
      // this.taskReviewModel.assignedwt = JSON.parse(this.TaskModel).AssignedWt;
      this.clientSkewed = [
        { Id: '1', SkewedCode: 'A', SkewedName: this.assignTaskResources.usablebudwt },
        { Id: '2', SkewedCode: 'B', SkewedName: this.assignTaskResources.jointmaterialwt },
        { Id: '3', SkewedCode: 'C', SkewedName: this.assignTaskResources.oilmaterialwt },
        { Id: '4', SkewedCode: 'D', SkewedName: this.assignTaskResources.wastematerialwt },
      ];

      this.completionForm = this.fb.group({
        'assignedwt': new FormControl(''),
        completeParamArr:  this.fb.array(this.TaskModel.TampingLotDetails.map(this.generateCompletionParams(this.fb))),
        'misccomment':  new FormControl(null, Validators.compose([Validators.maxLength(500)])),
      });

      this.reviewForm = this.fb.group({
        'rmisccost': new FormControl(''),
        'rmisccomment': new FormControl(null, Validators.compose([Validators.maxLength(500)])),
        'ActHrs': new FormControl(null),
        'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        'reviewParamArr':  this.fb.array(this.TaskModel.TampingCompletionLotDetails.map(this.generateReviewParams(this.fb))),
      });

      // this.completionForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));
    }
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

  generateCompletionParams(fb: FormBuilder) {
    return (object, index) => {
      let completedBox;
      completedBox = new FormControl(null, Validators.compose([Validators.max(object.Qty)]));

      return fb.group({uniqueId: index, LotId: object.LotId, GrowerLotNo: object.GrowerLotNo, UnitValue: object.UnitValue,
                  Qty: object.Qty, completedQty: completedBox });
    };
  }

  generateReviewParams(fb: FormBuilder) {
    return (object, index) => {
      let reviewBox;

      reviewBox = [object.Qty ? object.Qty : null];

      return fb.group({uniqueId: index, LotId: object.LotId, GrowerLotNo: object.GrowerLotNo, UnitValue: object.UnitValue,
        Qty: object.Qty, reviewedQty: reviewBox });
    };
  }

  get completeParamArr(): FormArray {
    return this.completionForm.get('completeParamArr') as FormArray;
  }

  get reviewParamArr(): FormArray {
    return this.reviewForm.get('reviewParamArr') as FormArray;
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.TAMPING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = data;

        if (data !== 'No data found!') {
          this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
        } else {
          this.employees = [];
        }

      } ,
      error => { console.log(error); },
      );
  }

  getLotListByTask() {
    this.dropdownDataService.getLotListByTask(this.TaskModel.task).subscribe(
      data => {
        this.globalData.lots = data;

        if (data !== 'No data found!') {
          this.lots = this.dropdwonTransformService.transform(data, 'GrowerLotNo', 'LotId', '-- Select --');
        } else {
          this.lots = [];
        }
      } ,
      error => { console.log(error); },
      );
  }

  lotOnChange() {
    // this.lotDetails.brand =  this.growers.filter(data => data.RawSupId === this.lotEntryForm.get('grower').value.RawSupId)[0].BrandName;
    const selectedLot = this.globalData.lots.filter(data => data.LotId === this.TaskModel.TAMPING.lotno)[0];
    this.TaskModel.TAMPING.brand =  selectedLot.BrandName;
    this.TaskModel.TAMPING.strain = selectedLot.StrainName;
    this.TaskModel.TAMPING.lotweight = selectedLot.LotWeight;

    this.TaskModel.TAMPING.assignwt = 0;
    this.lotInfo.lotId = this.TaskModel.TAMPING.lotno;

    this.assignWtOnChnage();
    this.getLotNotes();
  }

  empOnChange() {
    const selectedEmp = this.globalData.employees.filter(data => data.EmpId === this.TaskModel.TAMPING.employee)[0];

    if (selectedEmp !== undefined) {
      this.TaskModel.TAMPING.emprate =  selectedEmp.HourlyRate;
      this.TaskModel.TAMPING.empcost =  selectedEmp.HourlyRate * this.TaskModel.TAMPING.esthrs;
    } else {
      this.TaskModel.TAMPING.emprate =  0;
      this.TaskModel.TAMPING.empcost =  0;
    }
  }

  // EstHrsChange() { // Commented by Devdan :: 26-Oct-2018 :: Unused
  //   this.TaskModel.TAMPING.empcost =  this.TaskModel.TAMPING.emprate * this.TaskModel.TAMPING.esthrs;
  // }

  assignWtOnChnage() {
    this.TaskModel.TAMPING.lotBalWt =  (Number(this.TaskModel.TAMPING.lotweight) - Number(this.TaskModel.TAMPING.assignwt)).toString();
  }

  getLotNotes() {
    this.lotService.getLotNotes(this.lotInfo.lotId)
      .subscribe(
          data => {
            if (data !== 'No data found!') {
              this.selectedLotComments = data.Table1;
            } else {
              this.selectedLotComments = [];
            }
          },
          error => { console.log(error); },
        );
  }

  // Complete Parameter Saving
  completeTask(formModel) {
    let taskCompletionWebApi;
    let processedWt = 0;

    taskCompletionWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: 0,
        Comment: formModel.misccomment,
        TaskKeyName: 'B-TAMP',
        ProcessedWt: 0
      },
      JointDetails: [

      ]
    };

    formModel.completeParamArr.forEach(element => {
      if (element.completedQty > 0) {
        processedWt += (Number(element.completedQty) * Number(element.UnitValue));
        taskCompletionWebApi.JointDetails.push({ LotId: element.LotId, UnitValue: element.UnitValue, Qty: element.completedQty });
      }
    });

    taskCompletionWebApi.TaskDetails.ProcessedWt = processedWt;

    // if ((formModel.usablebudwt + formModel.oilmaterialwt + formModel.wastematerialwt) >  formModel.processedwt) {
    //   this.completionForm.controls ['processedwt'].setErrors({incorrectProcessWt: true});
    // }

    if ( this.completionForm.valid === true) {

      this.confirmationService.confirm({
        message: this.assignTaskResources.taskcompleteconfirm,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

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
                    this.router.navigate(['home/dashboard/managerdashboard']);
                  } else {
                    this.router.navigate(['home/dashboard/empdashboard']);
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
                 // if (this._cookieService.UserRole === this.userRoles.Manager) {
                  //  this.router.navigate(['home/managerdashboard']);
                 // } else {
                //    this.router.navigate(['home/empdashboard']);
                ///  }
                  // for navigate joint dashboard if employee assign task :: 20-Mar-2019 :: swapnil
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                          this.router.navigate(['home/dashboard/jointsproductiondashboard']);
                        } else {
                          // if employee assign task to self then redirect to joint dashboard else employee dashboard
                          if (this.assignRole.length !== 0) {
                          if (this.assignRole[0].RoleName === 'Employee') {
                            this.router.navigate(['home/dashboard/jointsproductiondashboard']);
                          }
                         } else {
                          this.router.navigate(['home/dashboard/empdashboard']);  }
                        }
                }, 2000);
              }
            });
            // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
            // this.refreshService.PushChange().subscribe(
            //   msg => {
            //   });
            this.PageFlag.showmodal = false;
          // http call ends
          this.loaderService.display(false);
        },
        reject: () => {
            // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
        }
    });
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

    let processedWt = 0;
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    taskReviewWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: formModel.rmisccost ? formModel.rmisccost : 0,
        // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
        Comment: formModel.rmisccomment,
        TaskKeyName: 'B-TAMP',
        ProcessedWt: 0
      },
      JointDetails: [

      ]
    };

    formModel.reviewParamArr.forEach(element => {
      if (element.reviewedQty > 0) {
        processedWt += (Number(element.reviewedQty) * Number(element.UnitValue));
        taskReviewWebApi.JointDetails.push({ LotId: element.LotId, UnitValue: element.UnitValue, Qty: element.reviewedQty });
      }
    });

    taskReviewWebApi.TaskDetails.ProcessedWt = processedWt;
    if ( this.reviewForm.valid === true) {

      this.confirmationService.confirm({
        message: this.assignTaskResources.taskcompleteconfirm,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

              // http call starts
              this.loaderService.display(true);

              this.taskCommonService.submitTaskReview(taskReviewWebApi)
              .subscribe(data => {

              if (data === 'NoReview') {
                this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadyreviewed });
                this.TaskModel.TaskStatus = this.taskStatus.Completed;

                if (this._cookieService.UserRole === this.userRoles.Manager &&
                  this.TaskModel.IsReview &&
                  this.TaskModel.TaskStatus === this.taskStatus.Completed) {
                  this.showToManager = true;
                }

                setTimeout( () => {
                  this.router.navigate(['home/task/taskaction', this.taskType, this.taskid]);
                }, 2000);

              } else if (data === 'Deleted') {
                this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformR });

                setTimeout( () => {
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                    this.router.navigate(['home/dashboard/managerdashboard']);
                  } else {
                    this.router.navigate(['home/dashboard/empdashboard']);
                  }
                }, 2000);
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else {
                this.TaskModel.TaskStatus = this.taskStatus.Completed;

                if (this._cookieService.UserRole === this.userRoles.Manager &&
                  this.TaskModel.IsReview &&
                  this.TaskModel.TaskStatus === this.taskStatus.Completed) {
                  this.showToManager = true;
                }

                this.msgs = [];
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.reviewsubmittedsuccess });

                setTimeout( () => {
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                    this.router.navigate(['home/dashboard/managerdashboard']);
                  } else {
                    this.router.navigate(['home/dashboard/empdashboard']);
                  }
                }, 2000);
              }
            });
            // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
            // this.refreshService.PushChange().subscribe(
            //   msg => {
            //   });
            this.PageFlag.showReviewmodal = false;
            // http call ends
            this.loaderService.display(false);
          },
          reject: () => {
              // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
          }
      });
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

    // Created by Devdan :: 12-Oct-2018 :: to set the ng model values
    setFormInEditMode(lotweight) {
      this.TaskModel.TAMPING = {
        lotno: this.TaskModel.TaskDetails.LotId,
        brand: '',
        strain: this.TaskModel.TaskDetails.StrainId,
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        employee: this.TaskModel.TaskDetails.EmpId,
        esthrs: '',
        priority: this.TaskModel.TaskDetails.TaskPriority,
        notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
        notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
        usercomment: this.TaskModel.TampingTaskDetails.Comment,
        lotweight: lotweight,
        emprate: '',
        empcost: ''
      };
    }

commentIconClicked(LotId) {
  this.lotInfo.lotId = LotId;
  this.lotInfo.showLotCommentModal = true;
  this.loaderService.display(false);
}
}
