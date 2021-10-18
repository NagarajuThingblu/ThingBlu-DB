import { AppCommonService } from './../../../../shared/services/app-common.service';
import { TaskResources } from './../../../task.resources';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgModel, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { DropdownValuesService } from '../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../services/task-common.service';
import { PositiveIntegerValidator } from '../../../../shared/validators/positive-integer.validator';
import { GlobalResources } from '../../../../global resource/global.resource';
import { QuestionControlService } from '../../../../shared/services/question-control.service';
import { QuestionService } from '../../../../shared/services/question.service';
import { QuestionBase } from '../../../../shared/models/question-base';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../../../shared/models/user.model';
import { DropdwonTransformService } from '../../../../shared/services/dropdown-transform.service';
import { AppConstants } from '../../../../shared/models/app.constants';
import { LotService } from '../../../../lot/services/lot.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../dashboard/services/refresh.service';

@Component({
  moduleId: module.id,
  selector: 'app-trimming',
  templateUrl: 'trimming.component.html',
  styles: [ '.redText{ color: red; } ' ]
})
export class TrimmingComponent implements OnInit, OnChanges {
  TRIMMING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  // tslint:disable-next-line:no-input-rename
  @Input('TaskModel') TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();

  actualtrimweight;
  questions: QuestionBase<any>[];
  public _cookieService: UserModel;
  public taskStatus: any;
  public selectedLotComments: any = [];
  public prscrLotDetailsByLotId: any = [];

  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false,
    LotNoteCount: 0
  };

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
  }

  display = false;

  public lots: any[];
  public strains: any[];
  public employees: any[];
  public priorities: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;
  public clientSkewed: any[];
  public taskReviewModel: any;
  public taskCompletionModel: any;

  public msgs: Message[] = [];
  // TaskActionDetails: any;  // Commented by Devdan :: 26-Oct-2018 :: Unused
  public taskid: any;
  public taskType: any;
  public defaultDate: Date = new Date();
  public showToManager = false;
  en: any;
  private globalData = {
    lots: [],
    employees: [],
    strains: []
  };
  public showPastDateLabel = false;
  public userRoles: any;
  // Added by Devdan :: 08-Oct-2018 :: variable for taskTypeId
  taskTypeId: any;

  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;

  ngOnChanges() {
  }
  ngOnInit() {
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.assignTaskResources.trimmingtitle);
    this.taskStatus =  AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;

    const d = new Date();

    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
      monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
      today: 'Today',
      clear: 'Clear'
  };


    // get Bombay time
    // alert(this.calcTime('India', '+5.30'));

    // // get Singapore time
    // alert(this.calcTime('Singapore', '+8'));

    // // get London time
    // alert(this.calcTime('London', '+1'));

    // get Canada time
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);

    // const d = new Date();
    // this.defaultDate = new Date(new Date().getUTCMinutes() - 480);
    // alert(this.defaultDate);

    this.route.params.forEach((urlParams) => {
      // Added by Devdan :: 09-Oct-2018
      this.taskid = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails !== undefined) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
      // Get the task type id from local storage to edit the task
      // this.taskTypeId = this.appCommonService.getLocalStorage('editTaskID');
    });
    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.TRIMMING = {
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
        empcost: '',
      };

      this.TRIMMING = this.fb.group({
        'strain': new FormControl('', Validators.required),
        'lotno': new FormControl('', Validators.required),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'estimatedenddate': new FormControl('',  Validators.compose([])),
        'endtime': new FormControl('',  Validators.compose([])),
        'esthrs': new FormControl('',  Validators.compose([  ])),
        'emprate': new FormControl(''),
        'actualcost': new FormControl(''),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        'assignwt': new FormControl('', Validators.compose([  ]))
      });

      this.employeeListByClient();
      // this.getLotListByTask();
      this.getStrainListByTask();

      this.priorities =  [
        {label: 'Normal', value: 'Normal'},
        {label: 'Important', value: 'Important'},
        {label: 'Critical', value: 'Critical'}
      ];

      this.ParentFormGroup.addControl('TRIMMING', this.TRIMMING);

      // Added by Devdan :: 09-Oct-2018 :: Load Lot as per the selected strain
      if (this.taskTypeId > 0) {
        this.TaskModel.TRIMMING = {
          lotno: this.TaskModel.TaskDetails.LotId,
          strain: this.TaskModel.TaskDetails.StrainId,
          startdate: this.TaskModel.startdate,
          enddate: '',
          endtime: '',
          employee: this.TaskModel.TaskDetails.EmpId,
          esthrs: this.TaskModel.TaskDetails.ActHrs,
          priority: this.TaskModel.TaskDetails.TaskPriority,
          notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
          notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
          usercomment: this.TaskModel.TaskDetails.TaskComment,
          assignwt: this.TaskModel.TaskDetails.AssignedWt,
          lotweight: this.TaskModel.TaskDetails.LotBalance,
          emprate: this.TaskModel.TaskDetails.EmpHourlyCost,
          empcost: '',
        };
        this.onStrainChange('onLoad');
      }

    } else {
      this.taskReviewModel = {
        wastematerialwt: this.TaskModel.WasteWt ,
        oilmaterialwt: this.TaskModel.OilMaterialWt,
        usablebudwt: this.TaskModel.UsableWt,
        processedwt: this.TaskModel.ProcessedWt,
        assignedwt:  this.TaskModel.AssignedWt,
        actualcost: this.TaskModel.EmpFinalCost,
        misccost: this.TaskModel.MiscCost,
        rprocessedwt: this.TaskModel.RevProcessedWt ? this.TaskModel.RevProcessedWt : this.TaskModel.ProcessedWt,
        rusablebudwt: this.TaskModel.RevUsableWt ? this.TaskModel.RevUsableWt : this.TaskModel.UsableWt,
        roilmaterialwt: this.TaskModel.RevOilMaterialWt ? this.TaskModel.RevOilMaterialWt : this.TaskModel.OilMaterialWt,
        rwastematerialwt: this.TaskModel.RevWasteWt ? this.TaskModel.RevWasteWt : this.TaskModel.WasteWt,
        ractualcost: this.TaskModel.RevEmpEstCost ? this.TaskModel.RevEmpEstCost : this.TaskModel.EmpEstCost,
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
        totallotweight:  this.TaskModel.StartWeight,
        IsLotCompleted:  this.TaskModel.IsLotCompleted  ? 'Yes' : 'No' ,
        islotcompleteyes: this.TaskModel.IsTaskComplete ? true  : false,
        islotcompleteno:  this.TaskModel.IsTaskComplete ? false : true,
        IsRevTrimCompleted: this.TaskModel.IsRevTrimCompleted  ? 'Yes' : 'No'
      };

      // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
      this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      this.taskCompletionModel = {
        wastematerialwt: this.TaskModel.WasteWt,
        oilmaterialwt: this.TaskModel.OilMaterialWt,
        usablebudwt: this.TaskModel.UsableWt,
        processedwt: this.TaskModel.ProcessedWt,
        assignedwt: this.TaskModel.AssignedWt,
        misccost: this.TaskModel.MiscCost,
        actualcost: this.TaskModel.EmpFinalCost,
        misccomment: '',
        IsTaskComplete: this.TaskModel.IsTaskComplete ? 'Yes' : 'No',
        islotcompleteyes: this.TaskModel.islotcompleteyes ? 1 : 0  ,
        islotcompleteno: this.TaskModel.islotcompleteyes ? 0 : 1,
        istrimmedCompleted: this.TaskModel.IsTrimCompleted ? 'Yes' : 'No'
      };

      if (this._cookieService.UserRole === this.userRoles.Manager  && this.TaskModel.IsReview  && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }
      // this.taskReviewModel.assignedwt = JSON.parse(this.TaskModel).AssignedWt;

      this.lotInfo.lotId = this.TaskModel.LotId;
      this.getLotNotes();
      this.getPrscrLotDetailsByLotId();

      this.completionForm = this.fb.group({
        'assignedwt': new FormControl(''),
        'wastematerialwt': new FormControl({ value: 0}),
        'usablebudwt': new FormControl('', Validators.required),
        'oilmaterialwt': new FormControl({ value: 0}),
        'misccost': new FormControl(''),
        'misccomment':  new FormControl(''),
        'islotcompleteyes': new FormControl(),
        'islotcompleteno': new FormControl()
      });
      this.reviewForm = this.fb.group({
        'rwastematerialwt': new FormControl({value: 0, disabled: this.taskReviewModel.islotcompleteyes ? false : true  }),
        'rusablebudwt': new FormControl(''),
        'roilmaterialwt': new FormControl({value: 0, disabled: this.taskReviewModel.islotcompleteyes ? false : true  }),
        'rmisccost': new FormControl(''),
        'rmisccomment': new FormControl(''),
        'ActHrs': new FormControl(null),
        'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        'rvislotcompleteyes': new FormControl(null),
        'rvislotcompleteno': new FormControl(null),
      });

      // this.completionForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));
    }
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.TRIMMING.value.estimatedstartdate)))) {
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
      () => console.log('Get all employees by client complete'));
  }

  getLotListByTask() {
    // let editMode;
    // if (this.taskTypeId > 0) {
    //   editMode = true;
    // } else {
    //   editMode = false;
    // }
    this.dropdownDataService.getLotListByTask(this.TaskModel.task, this.taskid).subscribe(
      data => {
        this.globalData.lots = data;
        if (data !== 'No data found!') {
          this.lots = this.dropdwonTransformService.transform(data.filter(x => x.StrainId === this.TRIMMING.value.strain),
          'GrowerLotNo', 'LotId', '-- Select --', false);
        } else {
          this.lots = [];
        }

        // Setting the lot not count value :: 26-Nov-2018 :: Devdan
        if (this.taskTypeId > 0 && this.TaskModel.TRIMMING.lotno !== null) { // In case of edit task
          let selectedLot;
          selectedLot = this.globalData.lots.filter(x => x.LotId === this.TaskModel.TRIMMING.lotno)[0];
          this.lotInfo.LotNoteCount = selectedLot.LotNoteCount;
        }
      } ,
      error => { console.log(error); },
      () => console.log('GetPrscrLotListByTask complete'));
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
      () => console.log('GetPrscrStrainListByTask complete'));
  }

  onStrainChange(value) {
    if (value === 'frmHTML') {
      this.TaskModel.TRIMMING.lotno = null;
      this.TaskModel.TRIMMING.lotweight = null;
    }
    this.getLotListByTask();
  }

  lotOnChange() {
    // this.lotDetails.brand =  this.growers.filter(data => data.RawSupId === this.lotEntryForm.get('grower').value.RawSupId)[0].BrandName;
    const selectedLot = this.globalData.lots.filter(data => data.LotId === this.TaskModel.TRIMMING.lotno)[0];
    if (selectedLot !== undefined) {
      // this.TaskModel.TRIMMING.brand =  selectedLot.BrandName;
      // this.TaskModel.TRIMMING.strain = selectedLot.StrainName;
      this.TaskModel.TRIMMING.lotweight = selectedLot.LotWeight;

      this.TaskModel.TRIMMING.assignwt = 0;
      this.lotInfo.lotId = this.TaskModel.TRIMMING.lotno;
      this.lotInfo.LotNoteCount = selectedLot.LotNoteCount;

      this.assignWtOnChnage();
      this.getLotNotes();
    } else {
      this.TaskModel.TRIMMING.assignwt = 0;
      this.lotInfo.lotId = this.TaskModel.TRIMMING.lotno;
    }
  }

  empOnChange() {
    const selectedEmp = this.globalData.employees.filter(data => data.EmpId === this.TaskModel.TRIMMING.employee)[0];

    if (selectedEmp !== undefined) {
      this.TaskModel.TRIMMING.emprate =  selectedEmp.HourlyRate;
      this.TaskModel.TRIMMING.empcost =  selectedEmp.HourlyRate * this.TaskModel.TRIMMING.esthrs;
    } else {
      this.TaskModel.TRIMMING.emprate =  0;
      this.TaskModel.TRIMMING.empcost = 0;
    }
  }

  estHrsChange() {
    this.TaskModel.TRIMMING.empcost =  this.TaskModel.TRIMMING.emprate * this.TaskModel.TRIMMING.esthrs;
  }

  assignWtOnChnage() {
    this.TaskModel.TRIMMING.lotBalWt =  (Number(this.TaskModel.TRIMMING.lotweight) - Number(this.TaskModel.TRIMMING.assignwt)).toString();
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
          () => console.log('Get Lot Notes complete')
        );
  }

  getPrscrLotDetailsByLotId() {
    this.lotService.getPrscrLotDetailsByLotId(this.lotInfo.lotId)
      .subscribe(
          data => {
            if (data !== 'No data found!') {
              this.prscrLotDetailsByLotId = data;
            } else {
              this.prscrLotDetailsByLotId = [];
            }
          },
          error => { console.log(error); },
          () => console.log('Get getPrscrLotDetailsByLotId complete')
        );
  }

  onNoteSave(lotComments) {
    this.selectedLotComments = lotComments;
  }
  isTaskCompleteOnChange(flag: string) {

   if (flag === 'YES') {
    this.taskCompletionModel.islotcompleteno = !this.taskCompletionModel.islotcompleteyes;
   } else {
    this.taskCompletionModel.islotcompleteyes = !this.taskCompletionModel.islotcompleteno;
   }
    // else {

      // control1.clearValidators();
      // control1.updateValueAndValidity();

      // control2.clearValidators();
      // control2.updateValueAndValidity();

      // this.completionForm.controls['oilmaterialwt'].disable();
      // this.completionForm.controls['wastematerialwt'].disable();
    // }
  }

  isRVTaskCompleteOnChange(flag: string) {
    if (flag === 'YES') {
     // this.reviewIsTrimCompleted(flag);
     this.taskReviewModel.islotcompleteno = !this.taskReviewModel.islotcompleteyes;
     this.reviewForm.controls['roilmaterialwt'].enable();
     this.reviewForm.controls['rwastematerialwt'].enable();
    } else {
     // this.reviewIsTrimCompleted(flag);
     this.taskReviewModel.islotcompleteyes = !this.taskReviewModel.islotcompleteno;
     this.reviewForm.controls['roilmaterialwt'].patchValue(0);
     this.reviewForm.controls['roilmaterialwt'].disable();
     this.reviewForm.controls['rwastematerialwt'].patchValue(0);
     this.reviewForm.controls['rwastematerialwt'].disable();
    }
  }
  // added by sanjay

  reviewIsTrimCompleted(formModel) {
    const startwt  = this.prscrLotDetailsByLotId.map((item) => item.StartWeight);
    const trimmedwt = this.prscrLotDetailsByLotId.map((item) => item.TrimmedWeight);
    let totalwt = 0;

  const thresholdPlus = Number(this.TaskModel.Threshold);
             const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
             let plustoleranceValue  ;
             let minustoleranceValue  ;
             plustoleranceValue = (Number(this.TaskModel.StartWeight) * Number(thresholdPlus)) / 100;
             minustoleranceValue = (Number(this.TaskModel.StartWeight) * Number(thresholdMinus)) / 100;
             if (this.TaskModel.IsLotCompleted === 'Yes' && formModel.rvislotcompleteyes ) {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.assignTaskResources.lotfullytrimmedmsg});
             return;
             }

    if (formModel.rvislotcompleteyes) {

      totalwt =  Number(formModel.rusablebudwt) +  Number(formModel.roilmaterialwt) + Number( formModel.rwastematerialwt);

            if (this.TaskModel.IsLotCompleted === 'Yes' ) {
                if (totalwt > 0) {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail:  this.assignTaskResources.lotfullytrimmedmsg });
                 return;
                  }
                }

       if (Number(thresholdPlus) === 0 && Number(thresholdMinus) === 0  ) {
         if ( Number(startwt)  !== (Number(totalwt) + Number(trimmedwt)) ) {
           this.msgs = [];
           this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
           detail: this.assignTaskResources.Lotwtnotmatchfortrimcomplete });
           return;
          }
         }

         if (Number(startwt)  < (Number(totalwt) + Number(trimmedwt))) {
            if (Number(thresholdPlus) > 0 ) {
              if ( Math.abs((Number(startwt) - (Number(totalwt) + Number(trimmedwt)))) > plustoleranceValue  ) {
                 this.msgs = [];
                 this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                 detail: this.assignTaskResources.Lotwtnotmatchfortrimcomplete + ' ' + this.assignTaskResources.Thresholdlimitexceeded });
                 return;
            }
           } else if (Number(thresholdPlus) === 0 )  {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.assignTaskResources.Lotwtnotmatchfortrimcomplete  });
            return;
           }
         }

         if (Number(startwt) > (Number(totalwt) + Number(trimmedwt))) {
            if (Number(thresholdMinus) > 0 ) {
              if ( Math.abs((Number(startwt) - (Number(totalwt) + Number(trimmedwt)))) > minustoleranceValue ) {
                   this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                   detail: this.assignTaskResources.Lotwtnotmatchfortrimcomplete + ' ' + this.assignTaskResources.Thresholdlimitexceeded  });
                return;
                }
             } else if (Number(thresholdMinus) === 0 )  {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.assignTaskResources.Lotwtnotmatchfortrimcomplete });
              return;
             }
          }

       this.submitReview(formModel);
       }

      if (formModel.rvislotcompleteno) {

            totalwt =  Number(formModel.rusablebudwt);
            const availablewt = startwt - trimmedwt;
            if (this.TaskModel.IsLotCompleted === 'Yes' ) {
                if (totalwt > 0) {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.assignTaskResources.lotfullytrimmedmsg});
                 return;
                  }
                }

          if (Number(startwt)  < (Number(totalwt) + Number(trimmedwt))) {
            if (Number(thresholdPlus) > 0 ) {
              if ( (plustoleranceValue - Math.abs((Number(startwt) - (Number(totalwt) + Number(trimmedwt))))) < 0 ) {
                   this.msgs = [];
                   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
           detail: 'Completed weight is more than Total Weight'});
                  return;
               }
             }  else if (Number(thresholdPlus) === 0 ) {
                this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: 'Completed weight is more than Total Weight'});
                return;
             }
             }

            if ( Number(startwt) < (Number(totalwt) + Number(trimmedwt))) {
              if (Number(thresholdPlus) > 0 ) {
                if ( plustoleranceValue >= Math.abs((Number(startwt) - (Number(totalwt) + Number(trimmedwt)))) ) {
                   this.msgs = [];
                   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                                    detail: this.assignTaskResources.markyeslotwtcompleted });
                  return;
                }
               }
             }
          //    if ( Number(startwt) > (Number(totalwt) + Number(trimmedwt))) {
          //     if (Number(ThresholdMinus) > 0 ) {
          //         if ( MinustoleranceValue >= Math.abs((Number(startwt) - (Number(totalwt) + Number(trimmedwt)))) ) {
          //           this.msgs = [];
          //           this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          //                           detail: this.assignTaskResources.markyeslotwtcompleted });
          //           return;
          //         }
          //     }
          //   }

          if (this.TaskModel.IsLotCompleted === 'No' ) {
            if ( Number(startwt) === (Number(totalwt) + Number(trimmedwt))) {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                              detail:  this.assignTaskResources.markyeslotwtcompleted });
              return;
            }
          }
             this.submitReview(formModel);
          }
      }

        employeeIsTrimCompleted(formModel) {
          const startwt  = this.prscrLotDetailsByLotId.map((item) => item.StartWeight);
          const trimmedwt = this.prscrLotDetailsByLotId.map((item) => item.TrimmedWeight);
          let totalwt = 0;
          const Avalablewt = startwt - trimmedwt;
             totalwt =  Number(formModel.usablebudwt);
             const thresholdPlus = Number(this.TaskModel.Threshold);
             const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
             let PlustoleranceValue  ;
             let MinustoleranceValue  ;
             PlustoleranceValue = (Number(this.TaskModel.StartWeight) * Number(thresholdPlus)) / 100;
             MinustoleranceValue = (Number(this.TaskModel.StartWeight) * Number(thresholdMinus)) / 100;

             if (this.TaskModel.IsLotCompleted === 'Yes' && formModel.islotcompleteyes ) {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.assignTaskResources.lotfullytrimmedmsg});
             return;
             }

             if (this.TaskModel.IsLotCompleted === 'Yes' ) {
              if (totalwt > 0) {
                this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail:  this.assignTaskResources.lotfullytrimmedmsg});
               return;
                }
              }

             if (Number(formModel.islotcompleteno) === 0 && Number(formModel.islotcompleteyes) === 0) {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: 'Please select Is Lot Completed Flag.'});
              return;
             }

             if (Avalablewt < totalwt) {
              if (Number(thresholdPlus) > 0 ) {
                if ( Math.abs((Number(startwt) - (Number(totalwt) + Number(trimmedwt)))) > PlustoleranceValue ) {
                       this.msgs = [];
                        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.assignTaskResources.Completetaskmaxweight + ' ' + Number(Avalablewt) + this.globalResource.measure });
                    } else {
                      this.completeTask(formModel);
                    }
                  } else if (Number(thresholdPlus) === 0 ) {
                        this.msgs = [];
                        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                        detail: this.assignTaskResources.Completetaskmaxweight + ' ' + Avalablewt + this.globalResource.measure});
                    }  else {
                        this.completeTask(formModel);
                         }
                } else {
                          this.completeTask(formModel);
                        }
                }
  // End added by sanjay
  // Complete Parameter Saving
  completeTask(formModel) {
    let taskCompletionWebApi;

    taskCompletionWebApi = {
      TaskDetails: {
        TaskId : this.taskid,
        VirtualRoleId: 0,
        IsLotComplete: formModel.islotcompleteyes ? 1 : 0,
        LotId: this.lotInfo.lotId,
        MiscCost: 0,
        Comment: formModel.misccomment,
        TaskKeyName: 'TRIM'
      },
      SkewDetails: [
        { SkewKeyName: 'PROCESSED_WT', Weight: Number(formModel.usablebudwt) },
        { SkewKeyName: 'USABLEBUD_WT', Weight: Number(formModel.usablebudwt) },
        { SkewKeyName: 'OIL_WT', Weight: formModel.islotcompleteyes ? 0 : 0 },
        { SkewKeyName: 'WASTE_WT', Weight: formModel.islotcompleteyes ? 0 : 0 }
      ]
    };

    // if ((formModel.usablebudwt + formModel.oilmaterialwt + formModel.wastematerialwt) >  formModel.processedwt) {
    //   this.completionForm.controls['processedwt'].setErrors({incorrectProcessWt: true});
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
                  if (String(data).toLocaleUpperCase() === 'NOCOMPLETE') {
                    this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });

                    if (this.TaskModel.IsReview === true) {
                      this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                    } else {
                      this.TaskModel.TaskStatus = this.taskStatus.Completed;
                    }

                    this.TaskCompleteOrReviewed.emit();
                  } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                    this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });

                    setTimeout( () => {
                      if (this._cookieService.UserRole === this.userRoles.Manager) {
                        this.router.navigate(['home/dashboard/managerdashboard']);
                      } else {
                        this.router.navigate(['home/dashboard/empdashboard']);
                      }
                    }, 1000);
                  } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                      this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                  } else if (String(data).toLocaleUpperCase() === 'THRESHOLDNOTMATCHED') {
                    this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.thresholdnotmatched });
                  } else if (String(data).toLocaleUpperCase() === 'TRIMCOMPLETED') {
                    this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.trimcompleted });
                  } else if (String(data).toLocaleUpperCase() === 'OTHERTRIMTASKINPROCESS') {
                    this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                                    detail: 'Can not mark as Yes as some other trimming task are in process for this lot.'});
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
                        this.router.navigate(['home/dashboard/managerdashboard']);
                      } else {
                        this.router.navigate(['home/dashboard/empdashboard']);
                      }
                    }, 1000);

                    this.PageFlag.showmodal = false;
                  }
                });
                // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
                // this.refreshService.PushChange().subscribe(
                //   msg => {
                //   });
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
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    taskReviewWebApi = {
      TaskDetails: {
        TaskId : this.taskid,
        VirtualRoleId: 0,
        MiscCost: formModel.rmisccost,
        Comment: formModel.rmisccomment,
        // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
        TaskKeyName: 'TRIM',
        IsLotComplete:  formModel.rvislotcompleteyes ? 1 : 0

      },
      SkewDetails: [
       // { SkewKeyName: 'PROCESSED_WT', Weight: (Number(formModel.rusablebudwt) + Number(formModel.roilmaterialwt) + Number(formModel.rwastematerialwt)) },
        { SkewKeyName: 'USABLEBUD_WT', Weight: formModel.rusablebudwt ? formModel.rusablebudwt : 0 },
        { SkewKeyName: 'OIL_WT',       Weight: formModel.roilmaterialwt ? formModel.roilmaterialwt : 0 },
        { SkewKeyName: 'WASTE_WT',     Weight: formModel.rwastematerialwt ? formModel.rwastematerialwt : 0 }
      ]
    };
    if (formModel.rvislotcompleteyes) {
    taskReviewWebApi.SkewDetails.push({ SkewKeyName: 'PROCESSED_WT',
      Weight: (Number(formModel.rusablebudwt) +
      Number(formModel.roilmaterialwt) +
      Number(formModel.rwastematerialwt)) });
    } else {
      taskReviewWebApi.SkewDetails.push({ SkewKeyName: 'PROCESSED_WT',
      Weight: (Number(formModel.rusablebudwt))});
    }

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

          if (String(data).toLocaleUpperCase() === 'NOREVIEW') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadyreviewed });
            this.TaskModel.TaskStatus = this.taskStatus.Completed;

            if (this._cookieService.UserRole === this.userRoles.Manager  && this.TaskModel.IsReview
                && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
              this.showToManager = true;
            }

            setTimeout( () => {
              this.router.navigate(['home/task/taskaction', this.taskType, this.taskid]);
            }, 1000);

          } else if (String(data).toLocaleUpperCase() === 'DELETED') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformR });

            setTimeout( () => {
              if (this._cookieService.UserRole === this.userRoles.Manager) {
                this.router.navigate(['home/dashboard/managerdashboard']);
              } else {
                this.router.navigate(['home/dashboard/empdashboard']);
              }
            }, 1000);
          } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          }  else if (String(data).toLocaleUpperCase() === 'GREATERWEIGHT') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.processwtgreater });
          } else if (String(data).toLocaleUpperCase() === 'THRESHOLDNOTMATCHED') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.thresholdnotmatched });
          } else if (String(data).toLocaleUpperCase() === 'LOTALREADYFULLYTRIMMED') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotfullytrimmedmsg });
          } else if (String(data).toLocaleUpperCase() === 'LOTTRIMMEDCOMPLETEWITHZERO') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotfullytrimmedmsg });
          } else if (String(data).toLocaleUpperCase() === 'LOTWEIGHTCOMPLETEDMARKYES') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.markyeslotwtcompleted });
          } else {
            this.TaskModel.TaskStatus = this.taskStatus.Completed;

            if (this._cookieService.UserRole === this.userRoles.Manager  && this.TaskModel.IsReview
              && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
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
            }, 1000);

            this.PageFlag.showReviewmodal = false;
          }
        });
        // http call ends
        // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
        // this.refreshService.PushChange().subscribe(
        //   msg => {
        //   });
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
        this.employeeIsTrimCompleted(formModel);
       // this.completeTask(formModel);
      } else {
        this.appCommonService.validateAllFields(this.completionForm);
      }
  }

  // Review Parameter Saving
  submitReviewParameter(formModel) {
    if (this.reviewForm.valid) {
      this.reviewIsTrimCompleted(formModel);
     // this.submitReview(formModel);
    } else {
      this.appCommonService.validateAllFields(this.reviewForm);
    }
    // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
    // this.refreshService.PushChange().subscribe(
    //   msg => {
    //   });
}

    // To get all form fields values where dynamic or static
    get diagnostic() { return JSON.stringify(this.completionForm.value); }


  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }
}
