import { AppCommonService } from './../../../../shared/services/app-common.service';
import { TaskResources } from './../../../task.resources';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
import { NewSectionDetailsActionService } from '../../../services/add-section-details.service';
import { filter } from 'rxjs/operator/filter';
import { NewClientService } from '../../../../Masters/services/new-client.service';
import { PTRService } from '../../../../Masters/services/ptr.service';

@Component({
  moduleId: module.id,
  selector: 'app-harvesting',
  templateUrl: './harvesting.component.html',
  styleUrls: ['./harvesting.component.css']
})
export class HarvestingComponent implements OnInit{
  HARVESTING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  // tslint:disable-next-line:no-input-rename
  @Input() TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Input() questions: any[];
  @ViewChild('checkedItems') private checkedElements: ElementRef;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();


  // questions: QuestionBase<any>[];
  public _cookieService: UserModel;
  public assignTaskResources: any;
  public userRoles: any;
  public taskStatus: any;
  public defaultDate: Date = new Date();
  public showPastDateLabel = false;
  public priorities: SelectItem[];
  public termination:SelectItem[];
  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private qcs: QuestionControlService ,
    private service: QuestionService,
    private taskCommonService: TaskCommonService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private newSectionDetailsActionService: NewSectionDetailsActionService, 
    private router: Router,
    private dropdwonTransformService: DropdwonTransformService,
    private lotService: LotService,
    private loaderService: LoaderService,
    private ptrActionService: PTRService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService,
    private render: Renderer2,
    private elref: ElementRef
  ) { 
    this._cookieService = this.appCommonService.getUserProfile();
    // this.questions = service.getQuestions();
  }
  display = false;
  public sectionList = [];
  public  Fields: any[];
  public fields: any[];
  public strains: any[];
  public employees: any[];
  public globalResource: any;
  public msgs: Message[] = [];
   public taskid: any;
   taskTypeId: any;
  public taskType: any;
  public employeeArray:any=[];
  public strain: any;
  public defaultValueCompletePc: Number = 0;
  public defaultValueTerminatedPc: Number = 0;
  public defaultWetWt: Number = 0;
  public defaultDryWt: Number = 0;
  public defaultWasteWt: Number = 0;
  public plantCount: any;
  public taskCompletionModel: any;
  public taskReviewModel: any;
  public allsectionslist:any;
  public TerminatioReasons: any[];
  private globalData = {
    lots: [],
    employees: [],
    strains: [],
    Fields: [],
    TerminationReasons: [],
  };

 
  isRActSecsDisabled: boolean;
  ngOnInit() {
    this.getAllFieldsAndSections();
    // this.getAllsectionlist();
    this.employeeListByClient();
    this.getTerminationReasons();
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle('Harvesting');
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
  
    
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.priorities =  [
      {label: 'Normal', value: 'Normal'},
      {label: 'Important', value: 'Important'},
      {label: 'Critical', value: 'Critical'}
    ];

    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.HARVESTING = {
        field: '',
        plantCount:'',
        section: '',
        assignedPC: '',
        strain: '',
        employeeList:'',
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        employee: '',
        esthrs: '',
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: '',
      };
   
    this.HARVESTING = this.fb.group({
      'strain': new FormControl(null, Validators.required),
      'field' : new FormControl('', Validators.required),
      'section': new FormControl('', Validators.required),
      'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
      // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
      'employeeList': new FormControl('', Validators.required),
     'plantCount' : new FormControl('', Validators.required),
     'assignedPC' : new FormControl('', Validators.required),
      'priority': new FormControl(''),
      'notifymanager': new FormControl(''),
      'notifyemployee': new FormControl(''),
      'comment': new FormControl('', Validators.maxLength(500)),
    });
  

    this.ParentFormGroup.addControl('HARVESTING', this.HARVESTING);
    }
    else{
     this.taskReviewModel = {
      misccost: this.TaskModel.MiscCost,
      CompletedPlantCnt : this.TaskModel.CompletedPlantCnt,
      TerminatedPlantCount : this.TaskModel.TerminatedPlantCnt,
      TerminationReason : this.TaskModel.TerminationReason,
      comment :'',
      wetweight : this.TaskModel.WetWt,
      driweight : this.TaskModel.DryWt,
      wasteweight : this.TaskModel.WasteWt,
      racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
      ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
      ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
     }
      this.taskCompletionModel = {
        CompletedPlantCnt : this.TaskModel.CompletedPlantCnt,
        AssignedPlantCnt : this.TaskModel.AssignedPlantCnt,
        TerminatedPlantCount : this.TaskModel.TerminatedPlantCount,
        TerminationReason : this.TaskModel.TerminationReason,
        comment : this.TaskModel.comment,
        wetweight : this.TaskModel.wetweight,
        driweight : this.TaskModel.dryweight,
        wasteweight : this.TaskModel.wasteweight

      }

      this.completionForm = this.fb.group({
        'completedPC': new FormControl(''),
        'terminatedtedPC': new FormControl(''),
        'terminationReason':new FormControl(null),
        'comment':new FormControl(null),
        'wetweight': new FormControl(''),
        'dryweight': new FormControl(''),
        'wasteweight': new FormControl('')
      });

      this.reviewForm = this.fb.group({
        'completedPC': new FormControl(''),
        'terminatedtedPC': new FormControl(''),
        'terminationReason':new FormControl(''),
        'ActHrs': new FormControl(null),
          'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'rmisccost': new FormControl(null),
          'rmisccomment': new FormControl(null),
          'wetweight': new FormControl(''),
          'dryweight': new FormControl(''),
          'wasteweight': new FormControl('')
      })
    }

  }

  // getAllFieldsAndSections() {
  //   this.fields = [];

  //   let TaskTypeId = this.ParentFormGroup != undefined?
  //   this.ParentFormGroup.controls.taskname.value : this.TaskModel.TaskTypeId
  //   this.dropdownDataService.getFieldsSectionsInGrowers(TaskTypeId).subscribe(
  //     data => {
  //       this.globalData.Fields = data;
  //       this.Fields = this.dropdwonTransformService.transform(data, 'FieldName', 'FieldId', '-- Select --',false);
  //       const fieldsfilter = Array.from(data.reduce((m, t) => m.set(t.FieldName, t), new Map()).values())
  //       this.fields = this.dropdwonTransformService.transform(fieldsfilter,'FieldName', 'FieldId', '-- Select --',false)
  //       console.log("fields"+JSON.stringify(this.Fields));
  //     } ,
  //     error => { console.log(error); },
  //     () => console.log('Get all brands complete'));
  // }

  
  getAllFieldsAndSections() {
    this.fields = [];

    let TaskTypeId = this.ParentFormGroup != undefined?
    this.ParentFormGroup.controls.taskname.value : this.TaskModel.TaskTypeId
    this.dropdownDataService.getFieldsSectionsInGrowers(TaskTypeId).subscribe(
      data => {
        if(data != 'No Data Found'){
          this.globalData.Fields = data;
          this.Fields = this.dropdwonTransformService.transform(data, 'FieldName', 'FieldId', '-- Select --',false);
          const fieldsfilter = Array.from(data.reduce((m, t) => m.set(t.FieldName, t), new Map()).values())
          this.fields = this.dropdwonTransformService.transform(fieldsfilter,'FieldName', 'FieldId', '-- Select --',false)
          console.log("fields"+JSON.stringify(this.Fields));
        }
        else{
          this.globalData.Fields = [];
          this.fields = [];
        }
       
      } ,
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }
  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }
  getTerminationReasons(){
    this.ptrActionService.GetAllPTRListByClient().subscribe(
      data => {
        if(data != 'No Data Found!'){
          this.globalData.TerminationReasons = data;
          this.TerminatioReasons = this.dropdwonTransformService.transform(data, 'TerminationReason', 'TerminationId', '-- Select --',false);
        }
        else{
          this.globalData.TerminationReasons = [];
          this.TerminatioReasons = [];
        }
      
       } ,
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getTerminationReasons complete'));

  }
  submitCompleteParameter(formModel) {
    if (this.completionForm.valid) {
      // this.CheckThreSholdValidation(formModel);
       this.completeTask(formModel);
    } else {
      this.appCommonService.validateAllFields(this.completionForm);
    }
}

submitReviewParameter(formModel) {
  if (this.reviewForm.valid) {
    this.submitReview(formModel);
  } else {
    this.appCommonService.validateAllFields(this.reviewForm);
  }
}
CaluculateTotalSecs(Hours, Mins, Secs) {
  return (Number(Hours) * 3600) + (Number(Mins) * 60) + Number(Secs);
}
submitReview(formModel) {
  const ActSeconds = this.reviewForm.getRawValue().ActSecs;
  let taskReviewWebApi;
  if ( this.reviewForm.valid === true) {
    taskReviewWebApi = {
      ReviewHarvesting: {
        TaskId:Number(this.taskid),
        VirtualRoleId: 0,
        CompletedPlantCount:formModel.completedPC,
        TerminatedPlantCount: formModel.terminatedtedPC,
        TerminationId:  formModel.terminationReason?formModel.terminationReason:0,
        Comment: formModel.comment,
        MiscCost: formModel.rmisccost,
        WetWt: formModel.wetweight,
        DryWt: formModel.dryweight,
        WasteWt: formModel.wasteweight,
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
      }
    }
  }
  this.confirmationService.confirm({
    message: this.assignTaskResources.taskcompleteconfirm,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
      this.loaderService.display(true);
      this.taskCommonService.submitHarvestTaskReview(taskReviewWebApi)
      .subscribe(data => {
        if (data[0].RESULTKEY === 'NoComplete'){
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });
          if (this.TaskModel.IsReview === true) {
            this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
          } 
          else {
            this.TaskModel.TaskStatus =  this.taskStatus.Completed;
          }
          this.TaskCompleteOrReviewed.emit();
        }
        else if (data[0].RESULTKEY === 'Deleted'){
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });
          setTimeout( () => {
            if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
              this.router.navigate(['home/managerdashboard']);
            }
            else {
              this.router.navigate(['home/empdashboard']);
            }
          }, 1000);
        }
        else if (data[0].RESULTKEY === 'Failure'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
        }
        else  if (data[0].RESULTKEY === 'Please Select Termination Reason'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY });
        }
        else  if (data[0].RESULTKEY === 'Invalid Termination Reason'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.invalid });
        }
        else if (data[0].RESULTKEY ==='Completed Plant Count Greater Than Assigned Plant Count'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.plantcountmore });
          this.loaderService.display(false);
        }
        else{
          if (this.TaskModel.IsReview === true) {
            this.TaskModel.TaskStatus =  this.taskStatus.ReviewPending;
          } 
          else {
            this.TaskModel.TaskStatus =  this.taskStatus.Completed;
          }
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.taskcompleteddetailssavesuccess });
           setTimeout( () => {
                      if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
                        this.router.navigate(['home/managerdashboard']);
                      } else {
                        this.router.navigate(['home/empdashboard']);
                      }
                    }, 1000);
        }
      })
    }
  })

}

completeTask(formModel){
  let taskCompletionWebApi;
  let assignedPC;
  if ( this.completionForm.valid === true) {
    taskCompletionWebApi = {
      CompleteHarvesting:{
        TaskId:Number(this.taskid),
        CompletedPlantCount: formModel.completedPC,
        TerminatedPlantCount: formModel.terminatedtedPC,
        TerminationId:  formModel.terminationReason?formModel.terminationReason:0,
        Comment: formModel.comment,
        VirtualRoleId: 0,
        WetWt: formModel.wetweight,
        DryWt: formModel.dryweight,
        WasteWt: formModel.wasteweight
      }
    }
  }
  assignedPC = Number(this.taskCompletionModel.AssignedPlantCnt);
  // if(Number(assignedPC) < Number(this.TaskModel.CompletedPlantCnt) + Number(this.TaskModel.CompletedPlantCnt))
  
  this.confirmationService.confirm({
    message: this.assignTaskResources.taskcompleteconfirm,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',

    accept: () => {
      this.loaderService.display(true);
      this.taskCommonService.completeHarvestTask(taskCompletionWebApi)
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
        }
        else if (data[0].RESULTKEY  === 'Deleted'){
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });
          setTimeout( () => {
            if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
              this.router.navigate(['home/managerdashboard']);
            } else {
              this.router.navigate(['home/empdashboard']);
            }
          }, 1000);
        }
        else if (data[0].RESULTKEY  === 'Failure'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
        }
        else  if (data[0].RESULTKEY  === 'Please Select Termination Reason'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY  });
        }
        else  if (data[0].RESULTKEY === 'Invalid Termination Reason'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.invalid });
        }
        else if (data[0].RESULTKEY ==='Completed Plant Count Greater Than Assigned Plant Count'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.plantcountmore });
        }
        else{
          if (this.TaskModel.IsReview === true) {
            this.TaskModel.TaskStatus =  this.taskStatus.ReviewPending;
          } 
          else {
            this.TaskModel.TaskStatus =  this.taskStatus.Completed;
          }
          this.msgs = [];
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                    detail: this.assignTaskResources.taskcompleteddetailssavesuccess });
                    setTimeout( () => {
                      if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
                        this.router.navigate(['home/managerdashboard']);
                      } else {
                        this.router.navigate(['home/empdashboard']);
                      }
                    }, 1000);
        }
        
      });
      this.PageFlag.showmodal = false;
      this.loaderService.display(false);

    },
    reject: () =>{

    }
  });
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

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.HARVESTING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
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

  getSectionListByFieldName(event?:any){
    this.sectionList = [];
      for(let sec of this.globalData.Fields ){
        if(event.value === sec.FieldId){
          this.sectionList.push({label: sec.SectionName, value: sec.SectionId})
        }
      }
    
  }
  getStrainAndPlantCount(event?: any){
    for(let sec of this.globalData.Fields ){
      if(event.value === sec.SectionId)
      {
        this.strain = sec.StrainName;
        this.plantCount =sec.AvilablePlantCount;
        this.TaskModel.HARVESTING.section = sec.SectionName
        this.TaskModel.HARVESTING.strain =  this.strain
        this.HARVESTING.controls["strain"].setValue(this.strain)
        this.TaskModel.HARVESTING.totalPC  = this.plantCount
        this.HARVESTING.controls["plantCount"].setValue(this.plantCount)
      }
    }
   
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

  OnSelectingEmployees(event: any, checkedItem: any){
    for(let employee of this.globalData.employees){
      if(event.itemValue === employee.EmpId && this.employeeArray.indexOf(employee.EmpName) === -1){
        this.employeeArray.push(employee.EmpName)
        return;
     }
     else{
       if(event.itemValue === employee.EmpId){
         let index = this.employeeArray.indexOf(employee.EmpName);
         this.employeeArray.splice(index,1)

       }
     }
    }
  }
  // removeitem(deleteitem){
  //   this.employeeArray.splice(deleteitem,1)
  //  let element = this.checkedElements.nativeElement
  //  console.log(element)
  // }
 
}
