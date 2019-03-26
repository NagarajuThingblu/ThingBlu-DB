import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DropdownValuesService } from '../../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../../services/task-common.service';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { TaskResources } from '../../../../task.resources';
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
import { environment } from './../../../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../../dashboard/services/refresh.service';

// const tolerance = environment.tolerance;
@Component({
  selector: 'app-grinding',
  templateUrl: './grinding.component.html',
})
export class GrindingComponent implements OnInit, OnChanges, OnDestroy {
  GRINDING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  // tslint:disable-next-line:no-input-rename
  @Input('TaskModel') TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
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
    showLotCommentModal: false,
    LotNoteCount: 0
  };
  public userRoles: any;

  // Joint Production Dashboard Redirection Details
  public prodDBRouteParams: any;

  public readonlyFlag: Boolean = false;
  public readonlyEmployeeFlag: Boolean = false;
  // End Joint Production Dashboard Redirection Details

  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;
  public assignRole: any;
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
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
    this.questions = service.getQuestions();
    this.prodDBRouteParams = this.appCommonService.prodDBRouteParams;
  }

  display = false;

  public lots: any[];
  public employees: any[];
  public priorities: SelectItem[];
  public strains: any[];

  public assignTaskResources: any;
  public globalResource: any;
  public clientSkewed: any[];
  public taskReviewModel: any;
  public taskCompletionModel: any;

  public msgs: Message[] = [];
  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // TaskActionDetails: any;
  public taskid: any;
  public taskType: any;
  public defaultDate: Date;
  public showToManager = false;
  public isReturnWTEnabled: any = 0;
  // Added by devdan :: 11-Oct-2018
  public taskTypeId: any;
  private globalData = {
    lots: [],
    employees: [],
    strains: []
  };

  ngOnChanges() {
  }

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
    this.titleService.setTitle(this.assignTaskResources.grindingtitle);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.route.params.forEach((urlParams) => {
      // Modified by Devdan :: 05-Oct-2018 :: Getting Tasktype and task id from Edit Task Component
      // this.taskid = urlParams.taskId;
      // this.taskType = urlParams.taskTypeId;
      this.taskid = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails !== undefined) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.GRINDING = {
        lotno: '',
        // brand: '',
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
        assignwt: '',
        lotweight: '',
        emprate: '',
        empcost: ''
      };

      this.GRINDING = this.fb.group({
        'strain': new FormControl('', Validators.required),
        'lotno': new FormControl('', Validators.required),
        // 'brand': new FormControl(''),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'estimatedenddate': new FormControl('',  Validators.compose([])),
        'endtime': new FormControl('',  Validators.compose([])),
        // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl('',  Validators.compose([  ])),
        'emprate': new FormControl(''),
        'actualcost': new FormControl(''),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        'assignwt': new FormControl('', Validators.compose([Validators.required, Validators.min(0.1)]))
      });

      this.employeeListByClient();
      // this.getLotListByTask();
      this.getStrainListByTask();

      this.priorities =  [
        {label: 'Normal', value: 'Normal'},
        {label: 'Important', value: 'Important'},
        {label: 'Critical', value: 'Critical'}
      ];

      this.ParentFormGroup.addControl('GRINDING', this.GRINDING);

      // Populate strain & lot by default. Joint production dashboard functionality
      if (this.prodDBRouteParams) {
        this.TaskModel.GRINDING.strain = this.prodDBRouteParams.StrainId;
        this.TaskModel.GRINDING.employee = this._cookieService.EmpId;

        if (String(this._cookieService.UserRole) === String(this.userRoles.Employee)) {
          this.readonlyEmployeeFlag = true;
        }
        this.readonlyFlag = true;
        this.onStrainChange('onLoad');
      }
      // End of Populate strain & lot by default. Joint production dashboard functionality

      // Added by Devdan :: 08-Oct-2018 :: Load Stain Change Event
      if (this.taskTypeId > 0) {
        this.setFormInEditMode(0);
        this.onStrainChange('onLoad');
        this.readonlyFlag = true;
      }
    } else {
      this.taskReviewModel = {
        completedwt: this.TaskModel.ProcessedWt,
        wastewt: this.TaskModel.WasteWt,
        assignedwt:  this.TaskModel.AssignedWt,
        actualcost: this.TaskModel.EmpFinalCost,
        misccost: this.TaskModel.MiscCost,
        rcompletedwt: this.TaskModel.RevProcessedWt ? this.TaskModel.RevProcessedWt : this.TaskModel.ProcessedWt,
        rwastewt: this.TaskModel.RevWasteWt ? this.TaskModel.RevWasteWt : this.TaskModel.WasteWt,
        ractualcost: this.TaskModel.RevEmpFinalCost ? this.TaskModel.RevEmpFinalCost : this.TaskModel.EmpFinalCost,
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
        rmisccomment: '',
        rreturnwt: this.TaskModel.RevReturnWt ? this.TaskModel.RevReturnWt : this.TaskModel.ReturnWt
      };

      // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
       this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      this.taskCompletionModel = {
        // Added by sanjay on 11-09-2018 for display default assigned weight
        // completedwt: this.TaskModel.ProcessedWt,
        completedwt: this.TaskModel.ProcessedWt === 0 ? this.TaskModel.AssignedWt : this.TaskModel.ProcessedWt ,
        // END Added by sanjay on 11-09-2018 for display default assigned weight
        assignedwt: this.TaskModel.AssignedWt,
        wastewt: this.TaskModel.WasteWt,
        misccost: this.TaskModel.MiscCost,
        actualcost: this.TaskModel.EmpFinalCost,
        misccomment: '',
        islotcomplete: ''
      };

      this.lotInfo.lotId = this.TaskModel.LotId;
      this.getLotNotes();

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }

      this.completionForm = this.fb.group({
        'assignedwt': new FormControl(''),
        'returnwt': new FormControl(null),
        'completedwt': new FormControl('', Validators.required),
        'wastewt':  new FormControl('', Validators.compose([Validators.required])),
        'misccomment':  new FormControl(''),
      });

      this.reviewForm = this.fb.group({
        'completedwt': new FormControl('', Validators.required),
        'revwastewt':  new FormControl('', Validators.compose([Validators.required])),
        'returnwt': new FormControl(this.TaskModel.ReturnWt),
        'misccost': new FormControl(''),
        'misccomment': new FormControl(''),
        'ActHrs': new FormControl(null),
        'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
      });

      // this.completionForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));
    }
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  removeDuplicatesById(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.StrainId === val2.StrainId) { exists = true; }
      });

      if (exists === false && value.StrainId !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  getStrainListByTask() {
    this.dropdownDataService.getLotListByTask(this.TaskModel.task).subscribe(
      data => {
        let newdata: any[];
        newdata = this.removeDuplicatesById(data);
        this.globalData.strains = newdata;
        if (data !== 'No data found!') {
          this.strains = this.dropdwonTransformService.transform(newdata, 'StrainName', 'StrainId', '-- Select --');
        } else {
          this.strains = [];
        }
      } ,
      error => { console.log(error); },
      );
  }

  onStrainChange(value) {
    this.getLotListByTask();
    if (value === 'frmHTML') {
      this.TaskModel.GRINDING.lotno = null;
      this.TaskModel.GRINDING.lotweight = null;
      this.TaskModel.GRINDING.assignwt = 0;
    }
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.GRINDING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
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
      error => { console.log(error); }
    );
  }

  getLotListByTask() {
    // check if task is in edit mode or assign mode
    // let editMode;
    // if (this.taskTypeId > 0) { // In case of edit task
    //   editMode = true;
    // } else {
    //   editMode = false;
    // }
    this.dropdownDataService.getLotListByTask(this.TaskModel.task, this.taskid).subscribe(
      data => {
        this.globalData.lots = data;
        if (data !== 'No data found!') {
          this.lots = this.dropdwonTransformService.transform(data.filter(x => x.StrainId === this.GRINDING.value.strain),
          'GrowerLotNo', 'LotId', '-- Select --');
          // Added by Devdan :: 11-Oct-2018
          if (this.taskTypeId > 0 && this.TaskModel.GRINDING.lotno !== null) { // In case of edit task
            let selectedLot;
            selectedLot = this.globalData.lots.filter(x => x.LotId === this.TaskModel.GRINDING.lotno)[0];
            this.setFormInEditMode(selectedLot);
          }
        } else {
          this.lots = [];
        }
      } ,
      error => { console.log(error); },
    );
  }

  lotOnChange() {
    // this.lotDetails.brand =  this.growers.filter(data => data.RawSupId === this.lotEntryForm.get('grower').value.RawSupId)[0].BrandName;
    const selectedLot = this.globalData.lots.filter(data => data.LotId === this.TaskModel.GRINDING.lotno)[0];

    if (selectedLot !== undefined) {
      // this.TaskModel.GRINDING.brand =  selectedLot.BrandName;
      // this.TaskModel.GRINDING.strain = selectedLot.StrainName;
      // Modified by Devdan :: 11-Oct-2018
      if (this.taskTypeId > 0 && selectedLot.LotId ===  this.TaskModel.TaskDetails.LotId) { // In case of edit task
        this.TaskModel.GRINDING.lotweight  = selectedLot.LotWeight + this.TaskModel.GrindingTaskWeightDetails.AssignedWt;
      } else {
        this.TaskModel.GRINDING.lotweight  = selectedLot.LotWeight;
      }

      this.TaskModel.GRINDING.assignwt = 0;
      this.lotInfo.lotId = this.TaskModel.GRINDING.lotno;
      this.lotInfo.LotNoteCount = selectedLot.LotNoteCount;

      this.assignWtOnChnage();
      this.getLotNotes();
    } else {
      this.TaskModel.GRINDING.assignwt = 0;
      this.lotInfo.lotId = this.TaskModel.GRINDING.lotno;
    }
  }

  empOnChange() {
    const selectedEmp = this.globalData.employees.filter(data => data.EmpId === this.TaskModel.GRINDING.employee)[0];

    if (selectedEmp !== undefined) {
      this.TaskModel.GRINDING.emprate =  selectedEmp.HourlyRate;
      this.TaskModel.GRINDING.empcost =  selectedEmp.HourlyRate * this.TaskModel.GRINDING.esthrs;
    } else {
      this.TaskModel.GRINDING.emprate =  0;
      this.TaskModel.GRINDING.empcost = 0;
    }
  }

  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // EstHrsChange() {
  //   this.TaskModel.GRINDING.empcost =  this.TaskModel.GRINDING.emprate * this.TaskModel.GRINDING.esthrs;
  // }

  assignWtOnChnage() {
    this.TaskModel.GRINDING.lotBalWt =  (Number(this.TaskModel.GRINDING.lotweight) - Number(this.TaskModel.GRINDING.assignwt)).toString();
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
    let processedwt = 0;
    let assignWt = 0;
    let taskCompletionWebApi;
   // let toleranceValue ;
   // const tolerance = Number(this.TaskModel.Threshold);

   // toleranceValue =  (Number(this.TaskModel.AssignedWt) * Number(tolerance)) / 100;
    taskCompletionWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: 0,
        Comment: formModel.misccomment,
        TaskKeyName: 'B-GRIND',
        ProcessedWt: Number(formModel.completedwt) ? Number(formModel.completedwt) : 0,
        WasteWt: Number(formModel.wastewt) ? Number(formModel.wastewt) : 0,
        ReturnWt: 0 // formModel.returnwt ? formModel.returnwt : 0
      },
    };

    assignWt = Number(this.TaskModel.AssignedWt);
    processedwt = Number(formModel.completedwt) +  Number(formModel.wastewt);
        const thresholdPlus = Number(this.TaskModel.Threshold);
        const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
        let plustoleranceValue  ;
        let minustoleranceValue  ;
        plustoleranceValue = (assignWt) * Number(thresholdPlus) / 100;
        minustoleranceValue = (assignWt) * Number(thresholdMinus) / 100;
        if (Number(assignWt)  < Number(processedwt) + Number(formModel.returnwt)) {
          if (Number(thresholdPlus) > 0 ) {
            if ( Math.abs((Number(assignWt) -  Number(processedwt) + Number(formModel.returnwt))) > plustoleranceValue  ) {
               this.msgs = [];
               this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
               return;
          }
         } else if (Number(thresholdPlus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          return;
         }
         taskCompletionWebApi.TaskDetails['ReturnWt'] = 0;
       }

       if (Number(assignWt) >   Number(processedwt) + Number(formModel.returnwt)) {
        if (Number(thresholdMinus) > 0 ) {
          if ( Math.abs(Number(assignWt) -  Number(processedwt) + Number(formModel.returnwt) ) > minustoleranceValue ) {
            this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
            return;
            } else {
              if (Number(this.isReturnWTEnabled) === 0  ) {
                taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
              } else {
                taskCompletionWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
              }
            }
         } else if (Number(thresholdMinus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          return;
         } else {
                if (Number(this.isReturnWTEnabled) === 0  ) {
                    taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
                } else {
                    taskCompletionWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
                }
         }
      }
      if (Number(assignWt) ===   Number(processedwt) + Number(formModel.returnwt)) {
        taskCompletionWebApi.TaskDetails['ReturnWt'] = 0;
      }

       // END Added by Sanjay Implemented at 10-08-2018

    // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
    // if (Number(tolerance) === 0) {
    //   taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(formModel.completedwt);
    // } else {
    //   if (
    //       (toleranceValue
    //         -
    //         Math.abs((this.TaskModel.AssignedWt - (Number(formModel.completedwt) + taskCompletionWebApi.TaskDetails.ReturnWt)))) < 0
    //     ) {
    //     this.msgs = [];
    //     this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
    //       detail: this.assignTaskResources.wtnotmatchedwithtolerance });

    //       const returnbox = this.completionForm.get('returnwt');
    //       // ({ thresholdExceed: true });

    //     return;
    //   }
    // }

    // return;
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
                     // this.router.navigate(['home/managerdashboard']);
                     // change navigation to joint dashboard
                      this.router.navigate(['home/jointsproductiondashboard']);

                    } else {

                      // if employee assign task to self then redirect to joint dashboard else employee dashboard
                      if (this.assignRole.length !== 0) {
                      if (this.assignRole[0].RoleName === 'Employee') {
                        this.router.navigate(['home/jointsproductiondashboard']);
                      }
                     } else {
                      this.router.navigate(['home/empdashboard']);  }
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
    let toleranceValue ;
    let assignWt = 0;
    let processedwt = 0;
    const tolerance = Number(this.TaskModel.Threshold);
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    toleranceValue =  (Number(this.TaskModel.AssignedWt) * Number(tolerance)) / 100;
    taskReviewWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: formModel.misccost,
        Comment: formModel.misccomment,
        TaskKeyName: 'B-GRIND',
        // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
        ProcessedWt: Number(formModel.completedwt) ? Number(formModel.completedwt) : 0,
        WasteWt: Number(formModel.revwastewt) ? Number(formModel.revwastewt) : 0,
        ReturnWt: 0 // formModel.returnwt ? formModel.returnwt : 0,
      },
    };
    assignWt = Number(this.TaskModel.AssignedWt);
    processedwt = Number(formModel.completedwt) +  Number(formModel.revwastewt);
        const thresholdPlus = Number(this.TaskModel.Threshold);
        const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
        let plustoleranceValue  ;
        let minustoleranceValue  ;
        let returnwt = 0;
        plustoleranceValue = (assignWt) * Number(thresholdPlus) / 100;
        minustoleranceValue = (assignWt) * Number(thresholdMinus) / 100;
        returnwt = Number(formModel.returnwt);
        if (Number(this.isReturnWTEnabled) === 0) {
          this.reviewForm.controls['returnwt'].patchValue(0);
          returnwt = 0;
        }

        if (Number(assignWt)  <  (Number(processedwt) + Number(returnwt))) {
          if (Number(thresholdPlus) > 0 ) {
            if ( Math.abs((Number(assignWt) -  Number(processedwt) + Number(returnwt))) > plustoleranceValue  ) {
               this.msgs = [];
               this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
               return;
          }
         } else if (Number(thresholdPlus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          return;
         }
        // taskReviewWebApi.TaskDetails['ReturnWt'] = 0;
       }
       if (Number(assignWt) >   Number(processedwt) + Number(returnwt)) {
        if (Number(thresholdMinus) > 0 ) {
          // alert(thresholdMinus);
          //   alert(Math.abs(Number(assignWt) -  Number(processedwt) + Number(returnwt) ));
          //   alert(minustoleranceValue);
          if ( Math.abs(Number(assignWt) -  Number(processedwt) + Number(returnwt) ) > minustoleranceValue ) {
            this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
            return;
            }
            // else {
            //   if (Number(this.isReturnWTEnabled) === 1  ) {
            //     taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
            //   } else {
            //     taskReviewWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
            //   }
            // }
         } else if (Number(thresholdMinus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          return;
         }
        //  else {
        //         if (Number(this.isReturnWTEnabled) === 0  ) {
        //           taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
        //         } else {
        //           taskReviewWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
        //         }
        //  }
      }

      if (Number(assignWt) >   Number(processedwt) ) {
        if (Number(this.isReturnWTEnabled) === 0  ) {
          taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
        } else {
          taskReviewWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
        }
      } else {
        taskReviewWebApi.TaskDetails['ReturnWt'] = 0;
      }
      // if (Number(assignWt) ===   Number(processedwt) + Number(formModel.returnwt)) {
      //   taskReviewWebApi.TaskDetails['ReturnWt'] = 0;
      // }

    // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
    // if (Number(tolerance) === 0) {
    //   taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(formModel.completedwt);
    // } else {
    //   if (
    //       (toleranceValue
    //         -
    //         Math.abs((this.TaskModel.AssignedWt - (Number(formModel.completedwt) + taskReviewWebApi.TaskDetails.ReturnWt)))) < 0
    //     ) {
    //     this.msgs = [];
    //     this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
    //       detail: this.assignTaskResources.wtnotmatchedwithtolerance });

    //       const returnbox = this.reviewForm.get('returnwt');
    //       // returnbox.setErrors({ thresholdExceed: true });
    //     return;
    //   }
    // }

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

              if (this._cookieService.UserRole === this.userRoles.Manager
                && this.TaskModel.IsReview
                && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
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

              if (this._cookieService.UserRole === this.userRoles.Manager &&
                this.TaskModel.IsReview &&
                this.TaskModel.TaskStatus === this.taskStatus.Completed) {
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
    setFormInEditMode(lot) {
      this.TaskModel.GRINDING = {
        lotno: this.TaskModel.TaskDetails.LotId,
        strain: this.TaskModel.TaskDetails.StrainId,
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        employee: this.TaskModel.TaskDetails.EmpId,
        esthrs: '',
        priority: this.TaskModel.TaskDetails.TaskPriority,
        notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
        notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
        usercomment: this.TaskModel.GrindingTaskDetails.Comment,
        assignwt: this.TaskModel.GrindingTaskWeightDetails.AssignedWt,
        lotweight: lot.LotWeight + this.TaskModel.GRINDING.assignwt,
        emprate: '',
        empcost: ''
      };

      // Setting the lot not count value :: 23-Nov-2018 :: Devdan
      this.lotInfo.LotNoteCount = lot.LotNoteCount;

    }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }
}
