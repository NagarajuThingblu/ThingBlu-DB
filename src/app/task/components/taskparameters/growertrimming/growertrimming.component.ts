import { AppCommonService } from './../../../../shared/services/app-common.service';
import { TaskResources } from './../../../task.resources';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, NgModel, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
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
import { FormArray } from '@angular/forms';


@Component({
  selector: 'app-growertrimming',
  templateUrl: './growertrimming.component.html',
  styleUrls: ['./growertrimming.component.css']
})
export class GrowertrimmingComponent implements OnInit {
  GROWERTRIMMING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  //input and output decorators
  @Input() BinData: any;
  @Input() inpubinData:any;
  @Input() TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Input() questions: any[];
  @ViewChild('checkedItems') private checkedElements: ElementRef;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();

  public _cookieService: UserModel;
  public assignTaskResources: any;
  public userRoles: any;
  public taskid: any;
  arrayItems: FormArray;
  public taskCompletionModel: any;
  public sectionslist = [];
  
  public employeeArray:any=[];
  public lightdepts = [];
  public saveAsDraft =0;
  public LD= [];
  public fields = [];
  public showBinData:boolean = false
  public completeDataBasedOnTaskType : any;
  public taskReviewModel: any;
  public taskStatus: any;
  public defaultDate: Date = new Date();
  public showPastDateLabel = false;
  public strains: any[];
  public batchId : any;
  public priorities: SelectItem[];
  public tm : any[];
  public workingEmp: any=[];
  public workingemp:boolean =false
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
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService,
    private render: Renderer2,
    private elref: ElementRef
  ) { 
    this._cookieService = this.appCommonService.getUserProfile();
  }

  display = false;
  public bins: any[];
  public binslist: any[];
  public globalResource: any;
   public msgs: Message[] = [];
   public employees: any[];
   public binsArray:any=[];
 
    taskTypeId: any;
   public taskType: any;
   private globalData = {
    bins: [],
    employees:[],
    sections: [],
    workingEmp:[],
  };
  isRActSecsDisabled: boolean;
  public inputBinDetails :any[];

  ngOnInit() {
    console.log(this.inpubinData)
    // if(this.inpubinData.length === 0){
    //   this.showBinData = false
    // }
    // else{
    //   this.showBinData = true
    // }
    this.getStrainListByTask();
    this.binsListByClient();
    this.employeeListByClient();
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle('Trimming');
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
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
    
    this.priorities =  [
      {label: 'Normal', value: 'Normal'},
      {label: 'Important', value: 'Important'},
      {label: 'Critical', value: 'Critical'}
    ];
    this.tm = [
      { label: 'HT', value:'HT'},
      { label: 'MT', value:'MT'}
    ];
    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.GROWERTRIMMING = {
        bins:'',
        employeeList:'',
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        esthrs: '',
        employee: '',
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: '',
      };
      this.GROWERTRIMMING = this.fb.group({
        'tm':new FormControl(null,Validators.required),
        'section': new FormControl(null,Validators.required),
        'strain': new FormControl(null, Validators.required),
        'field':new FormControl(null,Validators.required),
        'strainid':new FormControl(''),
        'batchId':new FormControl(''),
        'lightdept': new FormControl(null,Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'employeeList': new FormControl('', Validators.required),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
      });
      this.ParentFormGroup.addControl('TRIM', this.GROWERTRIMMING);
    }
    else{
      this.getAllBins();
      this.taskCompletionModel = {
        BinName: this.TaskModel.IPLabelName,
        BinWeight: this.TaskModel.IPBinWt,
        CompletedBinWt:'', 
        WasteWt:'',
        binId: this.TaskModel.binId,
        binsId:'',
        weight:'',
        binFull: this.TaskModel.binFull,

      }
      this.taskReviewModel = {
        misccost: this.TaskModel.MiscCost,
        BinName: this.TaskModel.IPLabelName,
        BinWeight: this.TaskModel.IPBinWt,
        CompletedBinWt:this.TaskModel.IPBinWt, 
        WasteWt:this.TaskModel.WasteWt,
        binId: this.TaskModel.InputBinId,
        binsId: this.TaskModel.binId,
        weight:this.TaskModel.dryweight,
        binFull: this.TaskModel.binFull,
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
       }

      this.completionForm = this.fb.group({
        // 'inputBin': new FormControl(null),
        // 'binWt': new FormControl(''),
        // 'completeWt':new FormControl('',Validators.compose([Validators.required])),
        // 'wasteWt':new FormControl(''),
        'items': new FormArray([
          this.createItem()
        ], this.customGroupValidation),
       
      });

      this.reviewForm = this.fb.group({
        // 'inputBin': new FormControl(null),
        // 'binWt': new FormControl(''),
        // 'completeWt':new FormControl('',Validators.compose([Validators.required])),
        // 'wasteWt':new FormControl(''),
        'items': new FormArray([
          this.createItem()
        ], this.customGroupValidation),
        'isStrainComplete': new FormControl(''),
        'ActHrs': new FormControl(null),
          'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'rmisccost': new FormControl(null),
          'rmisccomment': new FormControl(null)
      })
    }

  //  if(this.BinData != null){
  //    this.inputBinDetails = []
  //    for(let i =0; i<1; i++){
  //     this.inputBinDetails[i] = this.BinData[i]
  //   }
  //  }
   
// if(this.BinData != null){
//   this.inputBinDetails.inputBinName = this.BinData[0].IPLabelName;
//   this.inputBinDetails.totalWeight = this.BinData[0].IPBinWt;
//   this.wastewt = this.BinData[0].WasteWt
// for (let i of this.BinData){
//   this.completedWt = this.completedWt +i.OPBinWt
// }
// }
  }

  createItem(): FormGroup {
    return this.fb.group({
      'weight':new FormControl(null),
        'binId': new FormControl(null, Validators.compose([Validators.required])),
    }); 
  }
  resetForm() {
    
    this.completionForm.reset({ isStrainComplete: false });
//this.defaulDryWeight = 0;

    const control = <FormArray>this.completionForm.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
   
    this.addItem();
  }
  deleteItemAll(index: number) {
   
    const control = <FormArray>this.completionForm.controls['items'];
    control.removeAt(index);
  }
  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.binId];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['binId'].value !== null) {
          isError = true;
            _.forEach(result[prop], function (item: any, index) {
              // alert(index);
              item._status = 'INVALID';
            });
        } else {
            result[prop][0]._status = 'VALID';
            // console.log(result[prop].length);
        }
    }
    if (isError) { return {'duplicate': 'duplicate entries'}; }
  }

  get trimmingDetailsArr(): FormArray {
    return this.completionForm.get('items') as FormArray;
  }
  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }
 //method to get strains based on task
 getStrainListByTask() {
  this.globalData.workingEmp =[];
  this.workingEmp = [];
  this.workingemp=false;
  let TaskTypeId = this.ParentFormGroup != undefined?
  this.ParentFormGroup.controls.taskname.value : this.TaskModel.TaskTypeId
  this.dropdownDataService. getStrainsByTaskType(TaskTypeId).subscribe(
    data => {
      this.completeDataBasedOnTaskType = data;
      this.globalData.sections = data;
      if (data !== 'No Data Found') {
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');
        const strainsfilter = Array.from(this.strains.reduce((m, t) => m.set(t.label, t), new Map()).values())
        this.strains = this.dropdwonTransformService.transform(strainsfilter,'label', 'value')
      } else {
        this.strains = [];
      }
    } ,
    error => { console.log(error); },
    () => console.log('GetPrscrStrainListByTask complete'));
}



//method to get ld by selecting strain
onStrainSelect(event?: any){
  this.sectionslist = []
  this.lightdepts = []
  this.globalData.workingEmp=[]
  this.workingEmp = []
  this.LD = []
//this.LD = null
  for(let i of this.completeDataBasedOnTaskType){
    if(i.StrainId === event.value){
      this.lightdepts.push({label:i.IsLightDeprevation,value: i.IsLightDeprevation});
    }
  }
  const ldfilter = Array.from(this.lightdepts.reduce((m, t) => m.set(t.label, t), new Map()).values())
  this.lightdepts = this.dropdwonTransformService.transform(ldfilter,'label', 'value','-- Select --')
  if(this.lightdepts.length === 3){
    this.LD=[
      {label: "-- Select --", value: null},
      {label: 'true', value: true},
      {label: 'false', value: false},
    ]
  }
    else if(this.lightdepts[1].value === true)
    {
      this.LD=[
        {label: "-- Select --", value: null},
        {label: 'true', value: true},
      ]
      // this.newLabelsEntryForm.controls.lightdept.patchValue(this.LD[0].value)
    }
    else 
    {
      this.LD=[
        {label: "-- Select --", value: null},
        {label: 'false', value: false},
      ]
      // this.newLabelsEntryForm.controls.lightdept.patchValue(this.LD[0].value)
    }
    if(this.GROWERTRIMMING.controls['lightdept'].value !=null){
      this.onLdSelect(this.GROWERTRIMMING.controls['lightdept'].value);
    }
    if(this.GROWERTRIMMING.controls['lightdept'].value !=null){
      this.onLdSelect(this.GROWERTRIMMING.controls['lightdept'].value);
    }
}

//method to get fields and sections on ld select
onLdSelect(event?: any){
  this.fields = []
  for(let i of this.completeDataBasedOnTaskType){
    if(i.StrainId === this.GROWERTRIMMING.controls['strain'].value && (i.IsLightDeprevation === event.value || i.IsLightDeprevation === event)){
      this.fields.push({label:i.Fields,value: i.FieldUniqueId});
    }
  }
  const fieldfilter = Array.from(this.fields.reduce((m, t) => m.set(t.label, t), new Map()).values())
  this.fields = this.dropdwonTransformService.transform(fieldfilter,'label', 'value','-- Select --',false)
  if(this.GROWERTRIMMING.controls['field'].value !=null){
    this.onFieldSelect(this.GROWERTRIMMING.controls['field'].value);
  }
}

//method to get sections on selecting fields
onFieldSelect(event?: any){
  this.sectionslist = []
  for(let i of this.completeDataBasedOnTaskType){
    if(i.StrainId === this.GROWERTRIMMING.controls['strain'].value && i.IsLightDeprevation ===this.GROWERTRIMMING.controls['lightdept'].value && (i.FieldUniqueId === event.value || i.FieldUniqueId === event)){
      this.sectionslist.push({label:i.Sections,value: i.SectionUniqueId});
      this.GROWERTRIMMING.controls['batchId'].patchValue(i.BatchId);
    }
  }
  const sectionfilter = Array.from(this.sectionslist.reduce((m, t) => m.set(t.label, t), new Map()).values())
  this.sectionslist = this.dropdwonTransformService.transform(sectionfilter,'label', 'value','-- Select --',false)
}


//methods to select multiple employees
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
//on selecting section to get employees already working on that task
getWorkingEmpList(event?: any){
  this.dropdownDataService.getEmpAlreadyWorkingOnATask(0,this.TaskModel.task,this.GROWERTRIMMING.controls['batchId'].value).subscribe(
    data=>{
      if(data != 'No Data Found'){
        this.globalData.workingEmp = data;
        this.getWorkingEmpsList();
      }
      else{
        this.globalData.workingEmp = [];
        this.workingEmp = [];
      }
    }
  )
}
getWorkingEmpsList(){
  if(this.globalData.workingEmp != null){
    for(let employee of this.globalData.workingEmp){
      this.workingEmp.push(employee.Column1)
  }
  }
  else{
    this.workingEmp = [];
  }
this. filterEmpList()
}

filterEmpList(){
  for(let j of this.globalData.workingEmp){
    // for(let i of this.employees){
      // if(i.value === j.EmpId){
        let index = this.employees.findIndex(x => x.value === j.EmpId)
        
        this.employees.splice(index,1)
      // }
    // }
  }
}
  //method to get bins dropdown
  binsListByClient() {
    
    let TaskTypeId = this.ParentFormGroup != undefined?
    this.ParentFormGroup.controls.taskname.value : this.TaskModel.TaskTypeId
    this.dropdownDataService. getStrainsByTaskType(TaskTypeId).subscribe(
      data => {
       
        if (data !== 'No Data Found') {
          this.bins = this.dropdwonTransformService.transform(data, 'LabelName', 'BinId', '-- Select --');
        } else {
          this.bins = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('GetPrscrStrainListByTask complete'));
  }

  //method to get bins dropdown in complete page
  getAllBins(){
    let TaskId =this.TaskModel.TaskId
    this.dropdownDataService.getBins(TaskId).subscribe(
      data => {
        // let newdata: any[];
        // newdata = this.removeDuplicatesById(data);
   
        if (data !== 'No Data Found!') {
          this.binslist = this.dropdwonTransformService.transform(data, 'BinName', 'BinId', '-- Select --');
        } else {
          this.binslist = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('Get all bins complete'));
  }
  //method to get employes dropdown
  employeeListByClient(){
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
  deleteItem(index: number) {
    
    const control = <FormArray>this.completionForm.controls['items'];
   
    if (control.length !== 1) {
      control.removeAt(index);
    }
    console.log(this.completionForm.get('items'))
   
  }
  viewBinsList(e){
    this.router.navigate(['../home/labels', e]);
  }
  CaluculateTotalSecs(Hours, Mins, Secs) {
    return (Number(Hours) * 3600) + (Number(Mins) * 60) + Number(Secs);
  }
  addItem(): void {
    this.arrayItems = this.completionForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
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

submitReview(formModel) {
  const ActSeconds = this.reviewForm.getRawValue().ActSecs;
  let taskReviewWebApi;
  if ( this.reviewForm.valid === true) {
    taskReviewWebApi = {
      Bucking: {
        TaskId:Number(this.taskid),
        VirtualRoleId:Number(this._cookieService.VirtualRoleId),
        Comment: formModel.rmisccomment === null? "": formModel.rmisccomment,
        IsStrainCompleted:formModel.isStrainComplete === ""?0:1,
        MiscCost: Number(formModel.rmisccost) === null?0:Number(formModel.rmisccost) ,
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
      },
      InputBinDetails:[],
      OutputBinDetails:[]
    };
   
      // this.duplicateSection = element.value.section
      this.inpubinData.forEach((element, index) => {
        taskReviewWebApi.InputBinDetails.push({
          BinId:element.InputBinId,
          DryWt: element.IPBinWt,
          WetWt: 0,
          WasteWt: element.Wastewt,
              
           });
      })
     
    
   
     this.BinData.forEach((element, index) => {
      // this.duplicateSection = element.value.section
      taskReviewWebApi.OutputBinDetails.push({
        BinId:element.OPBinId,
        DryWt: element.OPBinWt,
        WetWt: 0,
        WasteWt: element.WasteWt,
        IsOpBinFilledCompletely: element.IsOpBinFilledCompletely == true?1:0
            
         });
    
     });
  }
  this.confirmationService.confirm({
    message: this.assignTaskResources.taskcompleteconfirm,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
      this.loaderService.display(true);
      this.taskCommonService.submitbuckingTaskReview(taskReviewWebApi)
      .subscribe(data => {
        if (data === 'NoComplete'){
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
        else  if (data[0].RESULTKEY === 'Failure'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
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
SaveAsDraft(formModel){
this.saveAsDraft =1;
this.completeTask(formModel)
}

completeTask(formModel){
  let taskCompletionWebApi;
  if ( this.completionForm.valid === true) {
    taskCompletionWebApi = {
    
        TaskId:Number(this.taskid),
        Comment:" ",
        VirtualRoleId: Number(this._cookieService.VirtualRoleId),
        SaveAsDraft: this.saveAsDraft,
     
    
     BinDetails:[]
    };
    this.trimmingDetailsArr.controls.forEach((element, index) =>
    {
      taskCompletionWebApi.BinDetails.push({
        BinId:Number(element.value.binId),
        DryWt: Number(element.value.weight),
        IsOpBinFilledCompletely:0
            
         });
    });
      // this.duplicateSection = element.value.section
  }
  // assignedPC = Number(this.taskCompletionModel.AssignedPlantCnt);
  // if(Number(assignedPC) < Number(this.TaskModel.CompletedPlantCnt) + Number(this.TaskModel.CompletedPlantCnt))
  
  this.confirmationService.confirm({
    message: this.assignTaskResources.taskcompleteconfirm,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',

    accept: () => {
      this.loaderService.display(true);
      this.taskCommonService.completeTrimmingTask(taskCompletionWebApi)
      .subscribe(data => {
        this.msgs = [];
        if (data[0].RESULTKEY  === 'This status already exist') {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskCompleted });
          if (this.TaskModel.IsReview === true) {
            this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
          } else {
            this.TaskModel.TaskStatus =  this.taskStatus.Completed;
          }
          this.TaskCompleteOrReviewed.emit();
        }
       else    if (data[0].RESULTKEY  === 'Completed weight is greater than Assigned bin weight') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.completewtgreaterthantotal });
        this.PageFlag.showmodal = false;
        this.loaderService.display(false);
      }
      else if (data[0].RESULTKEY  === 'Output Bin weight is greater than Completed weight') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY});
        this.PageFlag.showmodal = false;
        this.loaderService.display(false);
       
      }else if (data[0].RESULTKEY  === 'Output Bin weight and Input Bin Completed weight Not Same') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY});
        this.PageFlag.showmodal = false;
        this.loaderService.display(false);
       
      }
        else if (data === 'Failure'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          this.PageFlag.showmodal = false;
          this.loaderService.display(false);
        }
      
        else if (data[0].RESULTKEY ==='Success'){
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskcompleteddetailssavesuccess });
          setTimeout( () => {
            if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
              this.router.navigate(['home/managerdashboard']);
            } else {
              this.router.navigate(['home/empdashboard']);
            }
          }, 1000);
          this.PageFlag.showmodal = false;
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
        
      });
      this.PageFlag.showmodal = false;
      this.loaderService.display(false);

    },
    reject: () =>{

    }
  });
}
}
