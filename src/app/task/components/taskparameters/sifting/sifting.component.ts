import { Jsonp } from '@angular/http';
import { AppConstants } from './../../../../shared/models/app.constants';
import { AppComponent } from './../../../../app.component';
import { Component, OnInit, Input, ComponentFactoryResolver, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, NgModel, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { TaskResources } from '../../../task.resources';
import { DropdownValuesService } from '../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../services/task-common.service';
import { PositiveIntegerValidator } from '../../../../shared/validators/positive-integer.validator';
import { GlobalResources } from '../../../../global resource/global.resource';
import { QuestionBase } from '../../../../shared/models/question-base';
import { UserModel } from '../../../../shared/models/user.model';
import { QuestionControlService } from '../../../../shared/services/question-control.service';
import { QuestionService } from '../../../../shared/services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../../shared/services/dropdown-transform.service';
import { TextboxQuestion } from '../../../../shared/models/question-textbox';
import { LotService } from '../../../../lot/services/lot.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../shared/services/app-common.service';
import { environment } from './../../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../dashboard/services/refresh.service';
import { IfObservable } from 'rxjs/observable/IfObservable';

// const tolerance = environment.tolerance;

@Component({
  moduleId: module.id,
  selector: 'app-sifting',
  templateUrl: 'sifting.component.html',
  styles: [ '.redText{ color: red; } ' ]
})
export class SiftingComponent implements OnInit, OnChanges {
  SIFTING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;

  @Input() TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Input() questions: any[];
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();
  actualtrimweight;
  // questions: QuestionBase<any>[];
  // questions: any[];

  public _cookieService: UserModel;
  public taskStatus: any;
  public selectedLotComments: any = [];
  public isReturnWTEnabled: any = 0;

  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false,
    LotNoteCount: 0
  };
  public showPastDateLabel = false;
  public userRoles: any;
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
    private dropdownValuesService: DropdownValuesService,
    private lotService: LotService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
    // this.questions = service.getQuestions();

    // this.questions = [];
    // service.getQuestionsSet().subscribe(
    //   questions => {
    //       this.questions = questions;
    //   },
    //   error => console.error(error)
    // );

    // service.load()
    // .subscribe(
    //     q => { this.questions =  service.buildQuestions(q); },
    //     // error
    //     () => { this.questions = service.getQuestions(); }
    // );
    // console.log(this.questions);

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
  // TaskActionDetails: any;  // Commented by Devdan :: 26-Oct-2018 :: Unused
  public taskid: any;
  public taskType: any;
  public defaultDate: Date = new Date();
  public showToManager = false;
  public skewTypeList: any;
  // Added by Devdan :: 08-Oct-2018 :: variable for taskTypeId
  taskTypeId: any;
  newLotListbyStrain: any;
  private globalData = {
    lots: [],
    strains: [],
    employees: []
  };

  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;

  ngOnChanges() {
  }

  ngOnInit() {
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.assignTaskResources.siftingtitle);
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);

    this.route.params.forEach((urlParams) => {
      // Modified by Devdan :: 05-Oct-2018 :: Getting Tasktype and task id from Edit Task Component
      this.taskid = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    // console.log(this.TaskModel);

    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.SIFTING = {
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
        skewtype: ''
      };

      this.SIFTING = this.fb.group({
        'strain': new FormControl('', Validators.required),
        'lotno': new FormControl('', Validators.required),
        // 'brand': new FormControl(''),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'estimatedenddate': new FormControl(''),
        'endtime': new FormControl(''),
        // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl(''),
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

      this.ParentFormGroup.addControl('SIFTING', this.SIFTING);

      // Added by Devdan :: 08-Oct-2018 :: Load Stain Change Event
      if (this.taskTypeId > 0) {
        this.setFormInEditMode(0);
        this.onStrainChange('onLoad');
      }

    } else {
      this.taskReviewModel = {
        wastematerialwt: this.TaskModel.WasteWt ,
        oilmaterialwt: this.TaskModel.OilMaterialWt,
        usablebudwt: this.TaskModel.UsableWt,
        processedwt: this.TaskModel.ProcessedWt,
        assignedwt:  this.TaskModel.AssignedWt,
        jointsmaterialwt: this.TaskModel.JointsWt,
        actualcost: this.TaskModel.EmpFinalCost,
        misccost: this.TaskModel.MiscCost,
        rprocessedwt: this.TaskModel.RevProcessedWt ? this.TaskModel.RevProcessedWt : 0,
        rusablebudwt: this.TaskModel.RevUsableWt ? this.TaskModel.RevUsableWt : 0,
        roilmaterialwt: this.TaskModel.RevOilMaterialWt ? this.TaskModel.RevOilMaterialWt : 0,
        rwastematerialwt: this.TaskModel.RevWasteWt ? this.TaskModel.RevWasteWt : 0,
        rjointsmaterialwt: this.TaskModel.RevJointsWt ? this.TaskModel.RevJointsWt : 0 ,
        ractualcost: this.TaskModel.RevEmpFinalCost ? this.TaskModel.RevEmpFinalCost : 0,
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : 0,
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
        rreturnwt: this.TaskModel.RevReturnWt ? this.TaskModel.RevReturnWt : this.TaskModel.ReturnWt
      };

      // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
      this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      this.questions.forEach(question => {
        if (question.key === 'BUD_WT') {
          question.value = this.TaskModel.UsableWt;
        } else if (question.key === 'JOINTS_WT') {
          question.value = this.TaskModel.JointsWt;
        } else if (question.key === 'OIL_WT') {
          question.value = this.TaskModel.OilMaterialWt;
        // } else if (question.key === 'WASTE_WT') {
        //   question.value = this.TaskModel.WasteWt;
        }
      });
      // this.completionForm.controls.skewTypeGroup['budmaterialwt'] = this.TaskModel.UsableWt;
      // this.completionForm.controls.skewTypeGroup['jointsmaterialwt'] = this.TaskModel.UsableWt;
      // this.completionForm.controls.skewTypeGroup['oilmaterialwt'] = this.TaskModel.OilMaterialWt;
      // this.completionForm.controls.skewTypeGroup['wastematerialwt'] = this.TaskModel.WasteWt;

      this.lotInfo.lotId = this.TaskModel.LotId;
      this.getLotNotes();

      this.taskCompletionModel = {
        wastematerialwt: this.TaskModel.WasteWt,
        oilmaterialwt: this.TaskModel.OilMaterialWt,
        jointsmaterialwt: this.TaskModel.JointsWt,
        usablebudwt: this.TaskModel.UsableWt,
        processedwt: this.TaskModel.ProcessedWt,
        assignedwt: this.TaskModel.AssignedWt,
        misccost: this.TaskModel.MiscCost,
        misccomment: '',
        islotcomplete: '',
        actualcost: this.TaskModel.EmpFinalCost,
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
        // 'wastematerialwt': new FormControl('', Validators.required),
        // 'usablebudwt': new FormControl('', Validators.required),
        // 'processedwt': new FormControl('', Validators.required),
        // 'oilmaterialwt': new FormControl('', Validators.required),
        'returnwt': new FormControl(null),
        'misccost': new FormControl(''),
        'misccomment':  new FormControl(''),
        'islotcomplete': new FormControl()
      });
      this.questions = this.questions.filter(result => result.key !== 'WASTE_WT');
      this.completionForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));

      this.reviewForm = this.fb.group({
        // 'rwastematerialwt': new FormControl(''),
        // 'rusablebudwt': new FormControl(''),
        // 'rprocessedwt': new FormControl(''),
        // 'roilmaterialwt': new FormControl(''),
        'returnwt': new FormControl(this.TaskModel.ReturnWt),
        'ActHrs': new FormControl(null),
        'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        'rmisccost': new FormControl(null),
        'rmisccomment': new FormControl(null)
      });

      this.reviewForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));
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
      () => console.log('GetPrscrStrainListByTask complete'));
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = [];
        this.globalData.employees = data;
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all employees by client complete'));
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
        this.globalData.lots = [];
        this.globalData.lots = data;
        this.newLotListbyStrain = [];
        for (let i = 0; i < data.length; i++) {
          this.newLotListbyStrain.push({
            'lotValue': data[i].LotId + '_' + data[i].SkewType,
            'lotText': data[i].GrowerLotNo,
            'strainId': data[i].StrainId,
            'lotweight': data[i].LotWeight
          });
        }
        // this.lots = this.dropdwonTransformService.transform(data.filter(x => x.StrainId === this.SIFTING.value.strain),
        // 'GrowerLotNo', 'LotId', '-- Select --', false);
        this.lots = this.dropdwonTransformService.transform(this.newLotListbyStrain.filter(x => x.strainId === this.SIFTING.value.strain),
        'lotText', 'lotValue', '-- Select --', false);
        if (this.taskTypeId > 0 && this.TaskModel.SIFTING.lotno !== null) { // In case of edit task
          // set the selected lot
          let selectedLot;
          // selectedLot = this.newLotListbyStrain.filter(x => x.lotValue.substr(0, x.lotValue.indexOf('_')) === this.TaskModel.SIFTING.lotno);

          selectedLot = this.globalData.lots.filter(x => x.LotId === this.TaskModel.TaskDetails.LotId
                          && x.SkewType === this.TaskModel.TaskDetails.SkewType)[0];
          this.setFormInEditMode(selectedLot);
        }
      } ,
      error => { console.log(error); },
      () => console.log('GetPrscrLotListByTask complete'));
  }

  onStrainChange(value) {
    if (value === 'frmHTML') {
      this.TaskModel.SIFTING.lotno = null;
      this.TaskModel.SIFTING.lotweight = null;

      // comment reset assigned weight :: swapnil :: 08-april-2019
     // this.TaskModel.SIFTING.assignwt = 0;
    }
    this.getLotListByTask();
  }

  lotOnChange(event) {
    // this.lotDetails.brand =  this.growers.filter(data => data.RawSupId === this.lotEntryForm.get('grower').value.RawSupId)[0].BrandName;
    // Added by Devdan :: 10-Oct-2018 :: get the lot id from dropdown value
    let lotid: string;
    // if (this.taskTypeId > 0 && String(this.TaskModel.TaskDetails.TaskTypeName).toLocaleLowerCase() === 'sifting') {
    //   lotid = event.value.substr(0, event.value.indexOf('_'));
    // } else {
    //   lotid = event.value;
    // }
    lotid = event.value.substr(0, event.value.indexOf('_'));
    // Modified by Devdan :: 10-Oct-2018 :: using "data.LotId === lotid" instead of "data.LotId === event.value"
    const selectedLot = this.globalData.lots.filter(data => data.LotId === parseInt(lotid, 10) && data.GrowerLotNo === event.originalEvent.target.innerText)[0];
    if (selectedLot !== undefined) {
      // this.TaskModel.SIFTING.brand =  selectedLot.BrandName;
      // this.TaskModel.SIFTING.strain = selectedLot.StrainName;

      // Modified by Devdan :: 11-Oct-2018
      if (this.taskTypeId > 0 && selectedLot.LotId ===  this.TaskModel.TaskDetails.LotId
            && selectedLot.GrowerLotNo === this.TaskModel.TaskDetails.GrowerLotNo) { // In case of edit task
        this.TaskModel.SIFTING.lotweight  = selectedLot.LotWeight + this.TaskModel.SiftingTaskDetails.AssignedWt;
      } else {
        this.TaskModel.SIFTING.lotweight  = selectedLot.LotWeight;
      }

      this.TaskModel.SIFTING.skewtype = selectedLot.SkewType;

       // comment reset assigned weight :: swapnil :: 08-april-2019
      // this.TaskModel.SIFTING.assignwt = 0;

      // Commented by Dev :: 10-Oct-2018
      // this.lotInfo.lotId = this.TaskModel.SIFTING.lotno;
      this.lotInfo.lotId = lotid;
      this.lotInfo.LotNoteCount = selectedLot.LotNoteCount;

      this.assignWtOnChnage();

     this.getLotNotes();
    } else {
      // comment reset assigned weight :: swapnil :: 08-april-2019
      // this.TaskModel.SIFTING.assignwt = 0;

      // Commented by Dev :: 10-Oct-2018
      // this.lotInfo.lotId = this.TaskModel.SIFTING.lotno;
      this.lotInfo.lotId = lotid;
    }
  }

  empOnChange() {
    const selectedEmp = this.globalData.employees.filter(data => data.EmpId === this.TaskModel.SIFTING.employee)[0];

    if (selectedEmp !== undefined) {
      this.TaskModel.SIFTING.emprate =  selectedEmp.HourlyRate;
      this.TaskModel.SIFTING.empcost =  selectedEmp.HourlyRate * this.TaskModel.SIFTING.esthrs;
    } else {
      this.TaskModel.SIFTING.emprate =  0;
      this.TaskModel.SIFTING.empcost = 0;
    }

  }

  estHrsChange() {
    this.TaskModel.SIFTING.empcost =  this.TaskModel.SIFTING.emprate * this.TaskModel.SIFTING.esthrs;
  }

  assignWtOnChnage() {
    this.TaskModel.SIFTING.lotBalWt =  (Number(this.TaskModel.SIFTING.lotweight) - Number(this.TaskModel.SIFTING.assignwt)).toString();
  }

  showLotNote(LotId) {
    let lotid;
    // Added by D evdan :: 10-Oct-2018 :: get the lot id from dropdown value
    if (this.taskTypeId !== undefined || String(LotId).includes('_')) {
      lotid = LotId.substr(0, LotId.indexOf('_'));
    } else {
      lotid = LotId;
    }
    this.lotInfo.lotId = lotid;
    this.lotInfo.showLotNoteModal = true;
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.SIFTING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  onNoteSave(lotComments) {
    this.selectedLotComments = lotComments;
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

  // Complete Parameter Saving
  completeTask(formModel) {
    let taskCompletionWebApi;
    let processedwt = 0;
    let assignWt = 0;

    // let toleranceValue ;
    // const tolerance = Number(this.TaskModel.Threshold);

    if ( this.completionForm.valid === true) {
      //  toleranceValue =  (Number(this.TaskModel.AssignedWt) * Number(tolerance)) / 100;
        taskCompletionWebApi = {
          TaskDetails: {
            TaskId : this.taskid,
            VirtualRoleId: 0,
            MiscCost: 0,
            Comment: formModel.misccomment,
            TaskKeyName: 'SIFTING',
            SkewKeyName: this.TaskModel.SkewType
          },
          SkewDetails: [
            // ProcessedWt: formModel.processedwt,
            // UsableBudWt: formModel.usablebudwt,
            // OilMaterialWt: formModel.oilmaterialwt,
            // WasteMaterialWt: formModel.wastematerialwt
          ]
        };

        this.questions.forEach(question => {
          // taskCompletionWebApi.SkewDetails[question.key] = formModel.skewTypeGroup[question.key];

          taskCompletionWebApi.SkewDetails.push({ SkewKeyName: question.key, Weight: formModel.skewTypeGroup[question.key] });
          processedwt += Number(formModel.skewTypeGroup[question.key]);
        });
        // Added by Sanjay Implemented at 10-08-2018
        assignWt = Number(this.taskCompletionModel.assignedwt);
        const thresholdPlus = Number(this.TaskModel.Threshold);
        const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
        let plustoleranceValue  ;
        let minustoleranceValue  ;
        plustoleranceValue = (assignWt) * Number(thresholdPlus) / 100;
        minustoleranceValue = (assignWt) * Number(thresholdMinus) / 100;

        if (Number(assignWt)  < Number(processedwt) + Number(formModel.returnwt)) {
          if (Number(thresholdPlus) > 0 ) {
            if ( Math.abs((Number(assignWt) - Number(processedwt) + Number(formModel.returnwt))) > plustoleranceValue  ) {
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
         taskCompletionWebApi.SkewDetails.push(
          {SkewKeyName: 'RETURN_WT' , Weight: 0}
        );
       }

       if (Number(assignWt) >  Number(processedwt) + Number(formModel.returnwt)) {
        if (Number(thresholdMinus) > 0 ) {
          if ( Math.abs(Number(assignWt) - Number(processedwt) + Number(formModel.returnwt) ) > minustoleranceValue ) {
               this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
            return;
            } else {
              if (Number(this.isReturnWTEnabled) === 0) {
                taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
                taskCompletionWebApi.SkewDetails.push(
                  {SkewKeyName: 'RETURN_WT' , Weight:  Number(taskCompletionWebApi.TaskDetails['ReturnWt'])}
                );
              } else {
                  taskCompletionWebApi.SkewDetails.push(
                  {SkewKeyName: 'RETURN_WT' , Weight: formModel.returnwt ? formModel.returnwt : 0}
                );
              }
            }
         } else if (Number(thresholdMinus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          return;
         } else {
                if (Number(this.isReturnWTEnabled) === 0) {
                  taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
                  taskCompletionWebApi.SkewDetails.push(
                    {SkewKeyName: 'RETURN_WT' , Weight:  Number(taskCompletionWebApi.TaskDetails['ReturnWt'])}
                  );
                } else {
                    taskCompletionWebApi.SkewDetails.push(
                    {SkewKeyName: 'RETURN_WT' , Weight: formModel.returnwt ? formModel.returnwt : 0}
                  );
                }
         }
      }

      if (Number(assignWt) ===  Number(processedwt) + Number(formModel.returnwt)) {
        taskCompletionWebApi.SkewDetails.push(
          {SkewKeyName: 'RETURN_WT' , Weight: 0}
        );
      }
       // END Added by Sanjay Implemented at 10-08-2018

        // // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
        // if (Number(tolerance) === 0) {
        //   taskCompletionWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);

        //   taskCompletionWebApi.SkewDetails.push(
        //     {SkewKeyName: 'RETURN_WT' , Weight:  Number(taskCompletionWebApi.TaskDetails['ReturnWt'])}
        //   );
        // } else {
        //   if (
        //       (toleranceValue
        //         -
        //         Math.abs((this.TaskModel.AssignedWt - (processedwt +  Number(formModel.returnwt) )))) < 0
        //     ) {
        //     this.msgs = [];
        //     this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        //       detail: this.assignTaskResources.wtnotmatchedwithtolerance });

        //       const returnbox = this.completionForm.get('returnwt');
        //       // returnbox.setErrors({ thresholdExceed: true });

        //     return;
        //   }

        //   taskCompletionWebApi.SkewDetails.push(
        //     {SkewKeyName: 'RETURN_WT' , Weight: formModel.returnwt ? formModel.returnwt : 0}
        //   );
        // }


        // taskCompletionWebApi.SkewDetails['PROCESSED_WT'] = processedwt;
        taskCompletionWebApi.SkewDetails.push({ SkewKeyName: 'PROCESSED_WT', Weight: processedwt ? processedwt : 0 });
        // console.log(taskCompletionWebApi);
        // if ((formModel.usablebudwt + formModel.oilmaterialwt + formModel.wastematerialwt) >  formModel.processedwt) {
        //   this.completionForm.controls['processedwt'].setErrors({incorrectProcessWt: true});
        // }

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
                    this.TaskModel.TaskStatus =  this.taskStatus.Completed;
                  }
                  this.TaskCompleteOrReviewed.emit();
                  // setTimeout( () => {
                  //   this.router.navigate(['home/taskaction', this.taskType, this.taskid]);
                  // }, 2000);
                } else if (data === 'Deleted') {
                    this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });
                  setTimeout( () => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 1000);
                } else if (data === 'Failure') {
                  this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else {
                  if (this.TaskModel.IsReview === true) {
                    this.TaskModel.TaskStatus =  this.taskStatus.ReviewPending;
                  } else {
                    this.TaskModel.TaskStatus =  this.taskStatus.Completed;
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
                  }, 1000);
                }
              });
              // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
              // this.refreshService.PushChange().subscribe(
              //   msg => {
              //   });

              this.PageFlag.showmodal = false;
              // Commented by DEVDAN :: 25-Sep-2018 :: Unnecessary Code
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
    } else {
      this.appCommonService.validateAllFields(this.completionForm);
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
    let processedwt = 0;
    let assignWt = 0;
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    // let toleranceValue ;
    // const tolerance = Number(this.TaskModel.Threshold);

    if ( this.reviewForm.valid === true) {
     // toleranceValue =  (Number(this.TaskModel.AssignedWt) * Number(tolerance)) / 100;
      taskReviewWebApi = {
        TaskDetails: {
          TaskId : this.taskid,
          VirtualRoleId: 0,
          MiscCost: formModel.rmisccost,
          Comment : formModel.rmisccomment,
          // ActHrs: formModel.ActHrs,
          // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
          RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
          TaskKeyName: 'SIFTING',
          SkewKeyName: this.TaskModel.SkewType,
        },
        SkewDetails: [
          // RevProcessedWt: formModel.rprocessedwt ? formModel.rprocessedwt : 0 ,
          // RevUsableBudWt: formModel.rusablebudwt ? formModel.rusablebudwt : 0,
          // RevOilMaterialWt: formModel.roilmaterialwt ? formModel.roilmaterialwt : 0,
          // RevWasteMaterialWt: formModel.rwastematerialwt ? formModel.rwastematerialwt : 0,
          // RevEmpFinalCost: formModel.rempestcost ? formModel.rempestcost : 0,
          // RevMiscCost: formModel.rmisccost ? formModel.rmisccost : 0
        ]
      };

     // taskReviewWebApi.SkewDetails.push(
     //   {SkewKeyName: 'RETURN_WT' , Weight: formModel.returnwt ? formModel.returnwt : 0}
     // );

      this.questions.forEach(question => {
        // taskReviewWebApi.SkewDetails[question.key] = formModel.skewTypeGroup[question.key] ? formModel.skewTypeGroup[question.key] : 0;
        taskReviewWebApi.SkewDetails.push(
            {
              SkewKeyName: question.key,
              Weight: formModel.skewTypeGroup[question.key] ? formModel.skewTypeGroup[question.key] : 0
            });
        processedwt += Number(formModel.skewTypeGroup[question.key]);
      });

        // Added by Sanjay Implemented at 10-08-2018
        assignWt = Number(this.taskReviewModel.assignedwt);
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

        if (Number(assignWt)  < Number(processedwt) + Number(returnwt)) {
            if (Number(thresholdPlus) > 0 ) {
               if ( Math.abs((Number(assignWt) - Number(processedwt) + Number(returnwt))) > plustoleranceValue  ) {
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
             // taskReviewWebApi.SkewDetails.push(
            //  {SkewKeyName: 'RETURN_WT' , Weight: 0}
            //   );
          }

       if (Number(assignWt) >  Number(processedwt) + Number(returnwt)) {
            if (Number(thresholdMinus) > 0 ) {
                if ( Math.abs(Number(assignWt) - Number(processedwt) + Number(returnwt) ) > minustoleranceValue ) {
                  this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                    detail: this.assignTaskResources.MismatchTotalandassignedwt });
                   return;
                  }
                  // else {
                  //         if (Number(this.isReturnWTEnabled) === 0) {
                  //             taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
                  //             taskReviewWebApi.SkewDetails.push(
                  //             {SkewKeyName: 'RETURN_WT' , Weight:  Number(taskReviewWebApi.TaskDetails['ReturnWt'])}
                  //             );
                  //         } else {
                  //                 taskReviewWebApi.SkewDetails.push(
                  //                 {SkewKeyName: 'RETURN_WT' , Weight: formModel.returnwt ? formModel.returnwt : 0}
                  //                 );
                  //           }
                  //     }
             } else if (Number(thresholdMinus) === 0 )  {
                        this.msgs = [];
                        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                        detail: this.assignTaskResources.MismatchTotalandassignedwt  });
                      return;
                     }// else {
                    //         if (Number(this.isReturnWTEnabled) === 0) {
                    //             taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
                    //             taskReviewWebApi.SkewDetails.push(
                    //             {SkewKeyName: 'RETURN_WT' , Weight:  Number(taskReviewWebApi.TaskDetails['ReturnWt'])}
                    //             );
                    //          } else {
                    //                  taskReviewWebApi.SkewDetails.push(
                    //                 {SkewKeyName: 'RETURN_WT' , Weight: formModel.returnwt ? formModel.returnwt : 0}
                    //                 );
                    //              }
                    //             }
            }

            if (Number(assignWt) >  Number(processedwt)) {
              if (Number(this.isReturnWTEnabled) === 0) {
                taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
                taskReviewWebApi.SkewDetails.push(
                {SkewKeyName: 'RETURN_WT' , Weight:  Number(taskReviewWebApi.TaskDetails['ReturnWt'])}
                );
             } else {
                     taskReviewWebApi.SkewDetails.push(
                    {SkewKeyName: 'RETURN_WT' , Weight: formModel.returnwt ? formModel.returnwt : 0}
                    );
                 }
            } else {
              taskReviewWebApi.SkewDetails.push(
                {SkewKeyName: 'RETURN_WT' , Weight: 0}
                );
            }

        //  if (Number(assignWt) ===  Number(processedwt) + Number(formModel.returnwt)) {
        //       taskReviewWebApi.SkewDetails.push(
        //       {SkewKeyName: 'RETURN_WT' , Weight: 0}
        //       );
        //      }
       // END Added by Sanjay Implemented at 10-08-2018

        // // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
        // if (Number(tolerance) === 0) {
        //   taskReviewWebApi.TaskDetails['ReturnWt'] = Number(this.TaskModel.AssignedWt) - Number(processedwt);
        // } else {
        //   if (
        //       (toleranceValue
        //         -
        //         Math.abs((this.TaskModel.AssignedWt - (processedwt + Number(formModel.returnwt) )))) < 0
        //     ) {
        //     this.msgs = [];
        //     this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        //       detail: this.assignTaskResources.wtnotmatchedwithtolerance });

        //       const returnbox = this.reviewForm.get('returnwt');
        //       // returnbox.setErrors({ thresholdExceed: true });

        //     return;
        //   }
        // }

        // taskReviewWebApi.SkewDetails['PROCESSED_WT'] = processedwt;
        taskReviewWebApi.SkewDetails.push({SkewKeyName: 'PROCESSED_WT', Weight: processedwt ? processedwt : 0 });
        // console.log(taskReviewWebApi);

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
                  this.TaskModel.TaskStatus =  this.taskStatus.Completed;

                  if (this._cookieService.UserRole === this.userRoles.Manager &&
                      this.TaskModel.IsReview &&
                      this.TaskModel.TaskStatus === this.taskStatus.Completed) {
                    this.showToManager = true;
                  }

                  setTimeout( () => {
                    this.router.navigate(['home/taskaction', this.taskType, this.taskid]);
                  }, 1000);

                } else if (data === 'Deleted') {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformR });

                  setTimeout( () => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 1000);
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
                  }, 1000);
                }
              });

              this.PageFlag.showReviewmodal = false;
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
    }  else {
      this.appCommonService.validateAllFields(this.reviewForm);
    }

  }

// Complete Parameter Saving
  submitCompleteParameter(formModel) {
      if (this.completionForm.valid) {
        // this.CheckThreSholdValidation(formModel);
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

    // Created by Devdan :: 10-Oct-2018 :: to set the ng model values
    setFormInEditMode(lot) {
      this.TaskModel.SIFTING = {
        lotno: this.TaskModel.TaskDetails.LotId + '_' + this.TaskModel.TaskDetails.SkewType,
        // brand: '',
        strain: this.TaskModel.TaskDetails.StrainId,
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        employee: this.TaskModel.TaskDetails.EmpId,
        esthrs: '',
        priority: this.TaskModel.TaskDetails.TaskPriority,
        notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
        notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
        usercomment: this.TaskModel.TaskDetails.TaskComment,
        assignwt: this.TaskModel.SiftingTaskDetails.AssignedWt,
        lotweight: lot.LotWeight + this.TaskModel.SIFTING.assignwt,
        emprate: '',
        empcost: '',
        skewtype: this.TaskModel.TaskDetails.SkewType
      };

      // Setting the lot not count value :: 26-Nov-2018 :: Devdan
      this.lotInfo.LotNoteCount = lot.LotNoteCount;
    }

  commentIconClicked(LotId) {
    if (this.taskTypeId !== undefined || String(LotId).includes('_')) {
      this.lotInfo.lotId = LotId.substr(0, LotId.indexOf('_'));
    } else {
      this.lotInfo.lotId = LotId;
    }
    // this.lotInfo.lotId = LotId.substr(0, LotId.indexOf('_'));
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }
}
