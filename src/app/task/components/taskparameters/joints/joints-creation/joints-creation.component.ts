import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
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
import { environment } from './../../../../../../environments/environment';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../../dashboard/services/refresh.service';

// const tolerance = environment.tolerance;

@Component({
  moduleId: module.id,
  selector: 'app-joints-creation',
  templateUrl: 'joints-creation.component.html',
  styles: [
    '.clsCompletionForm div[class*="ui-grid-col"] { border: 1px solid #ddd; padding: 10px; }'
  ]
})
export class JointsCreationComponent implements OnInit, OnDestroy {
  JOINTSCREATION: FormGroup;
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

  // Joint Production Dashboard Redirection Details
  public prodDBRouteParams: any;

  // joint redirection
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
  public userRoles: any;
  private globalData = {
    lots: [],
    strains: [],
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
    this.titleService.setTitle(this.assignTaskResources.jointcreationitle);
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
      this.TaskModel.JOINTSCREATION = {
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

      this.JOINTSCREATION = this.fb.group({
        // 'brand': new FormControl(''),
        'strain': new FormControl('',  Validators.required),
        'lotno': new FormControl('', Validators.required),
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

      this.ParentFormGroup.addControl('JOINTSCREATION', this.JOINTSCREATION);

      // Populate strain & lot by default. Joint production dashboard functionality
      if (this.prodDBRouteParams) {
        this.TaskModel.JOINTSCREATION.strain = this.prodDBRouteParams.StrainId;
        this.TaskModel.JOINTSCREATION.employee = this._cookieService.EmpId;

        if (String(this._cookieService.UserRole) === String(this.userRoles.Employee)) {
          this.readonlyEmployeeFlag = true;
        }
        this.readonlyFlag = true;
        this.onStrainChange('onLoad');
      }
      // End of Populate strain & lot by default. Joint production dashboard functionality

      // Added by Devdan :: 12-Oct-2018 :: Load Stain Change Event
      if (this.taskTypeId > 0) {
        this.setFormInEditMode(0);
        this.onStrainChange('onLoad');
        this.readonlyFlag = true;
      }

    } else {
      this.taskReviewModel = {
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
        ractualcost: this.TaskModel.RevEmpEstCost ? this.TaskModel.RevEmpEstCost : this.TaskModel.EmpEstCost,
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
        rreturnwt: this.TaskModel.RevReturnWt ? this.TaskModel.RevReturnWt : this.TaskModel.ReturnWt
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

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview
        && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }
      // this.taskReviewModel.assignedwt = JSON.parse(this.TaskModel).AssignedWt;

      this.completionForm = this.fb.group({
        'assignedwt': new FormControl(null),
        completeParamArr:  this.fb.array(this.TaskModel['JointPackageSizeDetails'].map(this.generateCompletionParams(this.fb))),
        'misccomment': new FormControl(null),
        'returnwt': new FormControl(null, Validators.required),
      });

      this.reviewForm = this.fb.group({
        'rmisccost': new FormControl(null),
        'rmisccomment': new FormControl(null),
        'returnwt': new FormControl(this.TaskModel.ReturnWt, Validators.required),
        'ActHrs': new FormControl(null),
        'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        'reviewParamArr':  this.fb.array(this.TaskModel['JointsCompRevDetails'].map(this.generateReviewParams(this.fb))),
      });

      this.lotInfo.lotId = this.TaskModel.LotId;
      this.getLotNotes();
      // this.completionForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));
    }
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
    if (value === 'frmHTML') {
      this.TaskModel.JOINTSCREATION.lotno = null;
      this.TaskModel.JOINTSCREATION.lotweight = null;
      this.TaskModel.JOINTSCREATION.assignwt = null;
    }
    this.getLotListByTask();
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

  generateCompletionParams(fb: FormBuilder) {
    return (object, index) => {
      let completedBox;
      completedBox = [null];

      return fb.group({uniqueId: index, packageSize: object.UnitValue, completedQty: completedBox });
    };
  }

  generateReviewParams(fb: FormBuilder) {
    return (object, index) => {
      let reviewBox;

      reviewBox = [object.Qty ? object.Qty : null];
      return fb.group({uniqueId: index, packageSize: object.UnitValue, completedQty: object.Qty, reviewedQty: reviewBox });
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
      new Date(this.JOINTSCREATION.value.estimatedstartdate)))) {
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
          this.lots = this.dropdwonTransformService.transform(data.filter(x => x.StrainId === this.JOINTSCREATION.value.strain),
             'GrowerLotNo', 'LotId', '-- Select --');

          // Added by Devdan :: 12-Oct-2018
          if (this.taskTypeId > 0 && this.TaskModel.JOINTSCREATION.lotno !== null) { // In case of edit task
            let selectedLot;
            selectedLot = this.globalData.lots.filter(x => x.LotId === this.TaskModel.JOINTSCREATION.lotno)[0];
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
    const selectedLot = this.globalData.lots.filter(data => data.LotId === this.TaskModel.JOINTSCREATION.lotno)[0];

    if (selectedLot !== undefined) {
      // this.TaskModel.JOINTSCREATION.brand =  selectedLot.BrandName;
      // this.TaskModel.JOINTSCREATION.strain = selectedLot.StrainName;
      // Modified by Devdan :: 12-Oct-2018
      if (this.taskTypeId > 0 && selectedLot.LotId ===  this.TaskModel.TaskDetails.LotId) { // In case of edit task
        this.TaskModel.JOINTSCREATION.lotweight  = selectedLot.LotWeight + this.TaskModel.JCTaskWeightDetails.AssignedWt;
      } else {
        this.TaskModel.JOINTSCREATION.lotweight  = selectedLot.LotWeight;
      }

      this.TaskModel.JOINTSCREATION.assignwt = 0;
      this.lotInfo.lotId = this.TaskModel.JOINTSCREATION.lotno;
      this.lotInfo.LotNoteCount = selectedLot.LotNoteCount;

      this.assignWtOnChnage();
      this.getLotNotes();
    } else {
      this.TaskModel.JOINTSCREATION.assignwt = 0;
      this.lotInfo.lotId = this.TaskModel.JOINTSCREATION.lotno;
    }
  }

  empOnChange() {
    const selectedEmp = this.globalData.employees.filter(data => data.EmpId === this.TaskModel.JOINTSCREATION.employee)[0];

    if (selectedEmp !== undefined) {
      this.TaskModel.JOINTSCREATION.emprate =  selectedEmp.HourlyRate;
      this.TaskModel.JOINTSCREATION.empcost =  selectedEmp.HourlyRate * this.TaskModel.JOINTSCREATION.esthrs;
    } else {
      this.TaskModel.JOINTSCREATION.emprate =  0;
      this.TaskModel.JOINTSCREATION.empcost = 0;
    }
  }
  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // EstHrsChange() {
  //   this.TaskModel.JOINTSCREATION.empcost =  this.TaskModel.JOINTSCREATION.emprate * this.TaskModel.JOINTSCREATION.esthrs;
  // }

  assignWtOnChnage() {
    this.TaskModel.JOINTSCREATION.lotBalWt =  (Number(this.TaskModel.JOINTSCREATION.lotweight) - Number(this.TaskModel.JOINTSCREATION.assignwt)).toString();
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
   // let toleranceValue ;
    let assignWt = 0;
   // const tolerance = Number(this.TaskModel.Threshold);

   // toleranceValue =  (Number(this.TaskModel.AssignedWt) * Number(tolerance)) / 100;

    taskCompletionWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: 0,
        Comment: formModel.misccomment,
        TaskKeyName: 'B-JOINT',
        ProcessedWt: 0,
        ReturnWt: formModel.returnwt ? formModel.returnwt : 0
      },
      JointDetails: [
      ]
    };

    formModel.completeParamArr.forEach(element => {
      if (Number(element.completedQty) > 0) {
        processedWt += (element.completedQty * element.packageSize);
        taskCompletionWebApi.JointDetails.push({ UnitValue: element.packageSize, Qty: element.completedQty });
      }
    });

    taskCompletionWebApi.TaskDetails.ProcessedWt = processedWt;

        assignWt = Number(this.TaskModel.AssignedWt);
        const thresholdPlus = Number(this.TaskModel.Threshold);
        const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
        let plustoleranceValue  ;
        let minustoleranceValue  ;
        plustoleranceValue = (assignWt) * Number(thresholdPlus) / 100;
        minustoleranceValue = (assignWt) * Number(thresholdMinus) / 100;
        if (Number(assignWt)  < Number(processedWt) + Number(formModel.returnwt)) {
          if (Number(thresholdPlus) > 0 ) {
            if ( Math.abs((Number(assignWt) - Number(processedWt)  + Number(formModel.returnwt))) > plustoleranceValue  ) {
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

       if (Number(assignWt) >   Number(processedWt) + Number(formModel.returnwt)) {
        if (Number(thresholdMinus) > 0 ) {
          if ( Math.abs(Number(assignWt) - (Number(processedWt)  + Number(formModel.returnwt))) > minustoleranceValue ) {
               this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
            return;
            } else {
              taskCompletionWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
               // taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedWt);
            }
         } else if (Number(thresholdMinus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          return;
         } else {
                 taskCompletionWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
                 // taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedWt);
                }
         }

      if (Number(assignWt) ===   Number(processedWt)) {
        taskCompletionWebApi.TaskDetails['ReturnWt'] = 0;
      }

    // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
    // if ( (this.TaskModel.AssignedWt - (processedWt + Number(taskCompletionWebApi.TaskDetails.ReturnWt))) > toleranceValue) {
    //   this.msgs = [];
    //   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
    //     detail: this.assignTaskResources.wtnotmatchedwithtolerance });

    //     const returnbox = this.completionForm.get('returnwt');
    //     // returnbox.setErrors({ thresholdExceed: true });
    //   return;
    // }


    if ( (processedWt + taskCompletionWebApi.TaskDetails.ReturnWt) > this.TaskModel.AssignedWt) {
      this.msgs = [];
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.completewtgreaterthantotal });

      return;
    }

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
                 // if (this._cookieService.UserRole === this.userRoles.Manager) {
                 //  this.router.navigate(['home/managerdashboard']);
                //  } else {
                 //   this.router.navigate(['home/empdashboard']);
                 // }

               // for navigate joint dashboard if employee assign task :: 20-Mar-2019 :: swapnil
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
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
    let processedWt = 0;
    let assignWt = 0;
    let toleranceValue ;
    const tolerance = Number(this.TaskModel.Threshold);
     // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
     const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    toleranceValue =  (Number(this.TaskModel.AssignedWt) * Number(tolerance)) / 100;

    taskReviewWebApi = {
      TaskDetails: {
        TaskId : Number(this.taskid),
        VirtualRoleId: 0,
        MiscCost: Number(formModel.rmisccost),
        // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
        Comment: formModel.rmisccomment,
        TaskKeyName: 'B-JOINT',
        ReturnWt: formModel.returnwt ? formModel.returnwt : 0,
        ProcessedWt: 0
      },
      JointDetails: [
      ]
    };

    formModel.reviewParamArr.forEach(element => {
      processedWt += (element.reviewedQty * element.packageSize);
      taskReviewWebApi.JointDetails.push({ UnitValue: element.packageSize, Qty: element.reviewedQty });
    });

    taskReviewWebApi.TaskDetails.ProcessedWt = processedWt;

    assignWt = Number(this.TaskModel.AssignedWt);
        const thresholdPlus = Number(this.TaskModel.Threshold);
        const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
        let plustoleranceValue  ;
        let minustoleranceValue  ;
        plustoleranceValue = (assignWt) * Number(thresholdPlus) / 100;
        minustoleranceValue = (assignWt) * Number(thresholdMinus) / 100;
        if (Number(assignWt)  <  Number(processedWt) + Number(formModel.returnwt)) {
          if (Number(thresholdPlus) > 0 ) {
            if ( Math.abs((Number(assignWt) - (Number(processedWt)  + Number(formModel.returnwt)))) > plustoleranceValue  ) {
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

       if (Number(assignWt) >   Number(processedWt) + Number(formModel.returnwt)) {
        if (Number(thresholdMinus) > 0 ) {
          if ( Math.abs(Number(assignWt) -  (Number(processedWt)  + Number(formModel.returnwt)) ) > minustoleranceValue ) {
               this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
            return;
            }
           // else {
            //  taskReviewWebApi.TaskDetails['ReturnWt'] = formModel.rreturnwt ? formModel.rreturnwt : 0 ;
             // taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedWt);
           // }
         } else if (Number(thresholdMinus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          return;
         } // else {
           // taskReviewWebApi.TaskDetails['ReturnWt'] = formModel.rreturnwt ? formModel.rreturnwt : 0 ;
               // taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedWt);
           //     }
         }

    //  if (Number(assignWt) ===   Number(processedWt) + Number(formModel.returnwt)) {
    //    taskReviewWebApi.TaskDetails['ReturnWt'] = 0;
    //  }


    if (Number(assignWt) >   Number(processedWt)) {
         taskReviewWebApi.TaskDetails['ReturnWt'] = formModel.returnwt ? formModel.returnwt : 0 ;
  // taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedWt);
        }



      // // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
      // if ( (this.TaskModel.AssignedWt - (processedWt + taskReviewWebApi.TaskDetails.ReturnWt)) > toleranceValue) {
      //   this.msgs = [];
      //   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
      //     detail: this.assignTaskResources.wtnotmatchedwithtolerance });

      //     const returnbox = this.reviewForm.get('returnwt');
      //     // returnbox.setErrors({ thresholdExceed: true });
      //   return;
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

                if (this._cookieService.UserRole === this.userRoles.Manager &&
                  this.TaskModel.IsReview
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
      this.TaskModel.JOINTSCREATION = {
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
        usercomment: this.TaskModel.JCTaskDetails.Comment,
        assignwt: this.TaskModel.JCTaskWeightDetails.AssignedWt,
        lotweight: lot.LotWeight + this.TaskModel.JOINTSCREATION.assignwt,
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
