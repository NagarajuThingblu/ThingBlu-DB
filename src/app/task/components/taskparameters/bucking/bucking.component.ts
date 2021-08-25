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
import { NewEmployeeActionService } from '../../../services/add-employee';


@Component({
  moduleId: module.id,
  selector: 'app-bucking',
  templateUrl: './bucking.component.html',
  styleUrls: ['./bucking.component.css']
})
export class BuckingComponent implements OnInit {
  BUCKING: FormGroup;
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
  public taskReviewModel: any;
  public taskStatus: any;
  public defaultDate: Date = new Date();
  public showPastDateLabel = false;
  public priorities: SelectItem[];
  public workingEmp: any=[];
  public workingemp:boolean =false
  public skills: SelectItem[];
  public allSkillslist: any;
  public visibility:boolean = false;
  public showUpArrow:boolean = false;
  public allemplist : any[]
  public skilledempslist: any[]
  public headings: any[];
  plottedSkillItems: any = [];
  public selectedSkillItems: any[];
  public files: any = [];
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
    private elref: ElementRef,
    private newEmployeeActionService: NewEmployeeActionService,
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
   public employeeArray:any=[];
   public completeDataBasedOnTaskType : any;
   public strainid: any[];
   public sections: any[];
   public strains: any[];
   public lightdepts = [];
   public fields = [];
   public sectionslist = [];
   public batchId : any;
   public LD= [];
    taskTypeId: any;
   public taskType: any;
   private globalData = {
    employees: [],
    sections: [],
    workingEmp:[],
  };
  isRActSecsDisabled: boolean;
  // public inputBinDetails :any[];
  ngOnInit() {
    this.getStrainListByTask();
    this.binsListByClient();
    this.employeeListByClient();
    this.getSkills();
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle('Bucking');
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
 
    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.BUCKING = {
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
      this.BUCKING = this.fb.group({
        'section': new FormControl(null,Validators.required),
        'strain': new FormControl(null, Validators.required),
        'field':new FormControl(null,Validators.required),
        'strainid':new FormControl(''),
        'batchId':new FormControl(''),
        'lightdept': new FormControl(null,Validators.required),
        'skills':new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'employeeList': new FormControl('', Validators.required),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
      });
      this.ParentFormGroup.addControl('BUCKING', this.BUCKING);
    }
    else{
      this.getAllBins();
      this.taskCompletionModel = {
        BinName: this.TaskModel.IPLabelName,
        BinWeight: this.TaskModel.IPBinWt,
        CompletedBinWt:'', 
        WasteWt:'',
       // binId: this.TaskModel.binId,
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
        // 'strain': new FormControl(null),
        // 'inputBin': new FormControl(null),
        // 'binWt': new FormControl(''),
        // 'completeWt':new FormControl('',Validators.compose([Validators.required])),
        // 'wasteWt':new FormControl(''),
        'binId': new FormControl(null, Validators.compose([Validators.required])),
        // 'items': new FormArray([
        //   this.createItem()
        // ], this.customGroupValidation),
      });

      this.reviewForm = this.fb.group({
        'binId': new FormControl(null, Validators.compose([Validators.required])),
        // 'inputBin': new FormControl(null),
        // 'binWt': new FormControl(''),
        // 'completeWt':new FormControl('',Validators.compose([Validators.required])),
        // 'wasteWt':new FormControl(''),
        // 'items': new FormArray([
        //   this.createItem()
        // ], this.customGroupValidation),
        'isStrainComplete': new FormControl(''),
        'ActHrs': new FormControl(null),
          'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'rmisccost': new FormControl(null),
          'rmisccomment': new FormControl(null)
      })

      if(!this.PageFlag.showReviewmodal){
        this.reviewForm.controls['binId'].patchValue(this.BinData[0].OutPutBinId)
      }
    }
    // if(this.BinData != null){
    //   this.inputBinDetails = []
    //   for(let i =0; i<1; i++){
    //    this.inputBinDetails[i] = this.BinData[i]
    //  }
    // }
   // this.empfilterBasedOnSkill()
  }

  createItem(): FormGroup {
    return this.fb.group({
      'binsId': new FormControl(null, Validators.compose([Validators.required])),
      'weight': new FormControl('',Validators.compose([Validators.required])),
      'binFull': new FormControl(''),
    }); 
  }

  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.binsId];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['binsId'].value !== null) {
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

  get buckingDetailsArr(): FormArray {
    return this.completionForm.get('items') as FormArray;
  }
  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

 
  //method to get bins dropdown in assign page
  binsListByClient() {
    
    let TaskTypeId = this.ParentFormGroup != undefined?
    this.ParentFormGroup.controls.taskname.value : this.TaskModel.TaskTypeId
    this.dropdownDataService. getStrainsByTaskType(TaskTypeId).subscribe(
      data => {
        // let newdata: any[];
        // // newdata = this.removeDuplicatesById(data);
        // this.globalData.bins = newdata;
        if (data !== 'No Data Found') {
          this.bins = this.dropdwonTransformService.transform(data, 'LabelName', 'BinId', '-- Select --');
        } else {
          this.bins = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('GetPrscrStrainListByTask complete'));
  }
  empfilterBasedOnSkill(){
    this.plottedSkillItems = [];
    this.selectedSkillItems = [];
    this.headings.forEach(element => {
      const NewEmpList: any = {};
      NewEmpList.id = element.ID;
      NewEmpList.label = element.HeadingName;
      NewEmpList.children = [];
      NewEmpList.Num  = element.Num
      NewEmpList.isParent = element.IsParent;
      NewEmpList.ParentId = element.ParentID;
      NewEmpList.Selectable = true;
      if(element.IsParent === false || element.IsParent === "False"){
        this.selectedSkillItems.push(NewEmpList)
      }
      if(NewEmpList.isParent === true || NewEmpList.isParent === "True"){
        this.plottedSkillItems.push(NewEmpList)
      }
    });
    this.allemplist.forEach(element => {
      const NewAllEmpList: any = {};
      NewAllEmpList.id = element.EmpID;
      NewAllEmpList.label = element.EmpName;
      NewAllEmpList.children = [];
     // NewAllEmpList.Num  = element.Num
      NewAllEmpList.isParent = element.IsParent;
      NewAllEmpList.ParentId = element.ParentID;
      NewAllEmpList.Selectable = true;
      if (element.IsParent === false || element.IsParent === "False" ) {
        if (this.plottedSkillItems.length) {
          this.plottedSkillItems.forEach(parent => {
            if (parent.id === element.ParentId) {
              parent.children.push(NewAllEmpList);
            } 
          })
       
        }
      }
    })
    this.skilledempslist.forEach(element => {
      const NewAllEmpList: any = {};
      NewAllEmpList.id = element.EmpID;
      NewAllEmpList.label = element.EmpName;
      NewAllEmpList.children = [];
     // NewAllEmpList.Num  = element.Num
      NewAllEmpList.isParent = element.IsParent;
      NewAllEmpList.ParentId = element.ParentId;
      NewAllEmpList.Selectable = true;
      if (element.IsParent === false || element.IsParent === "False") {
        if (this.plottedSkillItems.length) {
          this.plottedSkillItems.forEach(parent => {
            if (parent.id === element.ParentId) {
              parent.children.push(NewAllEmpList);
            } 
          })
       
        }
      }
    })
    this.files = this.plottedSkillItems;
  }
  getSkills(){
    let TaskTypeId = this.ParentFormGroup != undefined?
    this.ParentFormGroup.controls.taskname.value : this.TaskModel.TaskTypeId
    this.newEmployeeActionService.GetSkillslist().subscribe(data => {
      if (data !== 'No Data found') {
        this.allSkillslist = data;
       
        this.skills = this.dropdwonTransformService.transform(this.allSkillslist.filter(x => x.TaskTypeId === TaskTypeId), 'SkillName', 'SkillTaskTypeMapId');
      }
      else{
        this.allSkillslist = [];
        this.skills = []
      }
    },
    error => { console.log(error); },
    () => console.log('skillslistbytasktype complete'));
  }
  onSkillsSelect(event:any){
    let skillListApiDetails;
    skillListApiDetails = {
      TaskTypeId:Number(this.TaskModel.task),
    
      SkillList:[]
    };
    for(let j of this.BUCKING.value.skills){
          
      skillListApiDetails.SkillList.push({
        SkillID: j,
       
      })
    };
    this.taskCommonService.getEmployeeListBasedOnSkills(skillListApiDetails)
    .subscribe(data => {
      this.headings = data.Table,
      this.skilledempslist = data.Table1,
      this.allemplist = data.Table2
      this.globalData
      this.empfilterBasedOnSkill()
    });
      }
      
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
      if(this.BUCKING.controls['lightdept'].value !=null){
        this.onLdSelect(this.BUCKING.controls['lightdept'].value);
      }
      if(this.BUCKING.controls['lightdept'].value !=null){
        this.onLdSelect(this.BUCKING.controls['lightdept'].value);
      }
  }

  onLdSelect(event?: any){
    this.fields = []
    for(let i of this.completeDataBasedOnTaskType){
      if(i.StrainId === this.BUCKING.controls['strain'].value && (i.IsLightDeprevation === event.value || i.IsLightDeprevation === event)){
        this.fields.push({label:i.Fields,value: i.FieldUniqueId});
      }
    }
    const fieldfilter = Array.from(this.fields.reduce((m, t) => m.set(t.label, t), new Map()).values())
    this.fields = this.dropdwonTransformService.transform(fieldfilter,'label', 'value','-- Select --',false)
    if(this.BUCKING.controls['field'].value !=null){
      this.onFieldSelect(this.BUCKING.controls['field'].value);
    }
  }
  onFieldSelect(event?: any){
    this.sectionslist = []
    for(let i of this.completeDataBasedOnTaskType){
      if(i.StrainId === this.BUCKING.controls['strain'].value && i.IsLightDeprevation ===this.BUCKING.controls['lightdept'].value && (i.FieldUniqueId === event.value || i.FieldUniqueId === event)){
        this.sectionslist.push({label:i.Sections,value: i.SectionUniqueId});
        this.BUCKING.controls['batchId'].patchValue(i.BatchId);
      }
    }
    const sectionfilter = Array.from(this.sectionslist.reduce((m, t) => m.set(t.label, t), new Map()).values())
    this.sectionslist = this.dropdwonTransformService.transform(sectionfilter,'label', 'value','-- Select --',false)
  }

  getWorkingEmpList(event?: any){
    this.dropdownDataService.getEmpAlreadyWorkingOnATask(0,this.TaskModel.task,this.BUCKING.controls['batchId'].value).subscribe(
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

  
  OnSelectingEmployees(event: any){
    
    for(let employee of  this.globalData.employees){
        if(event.node.id === employee.EmpId && this.employeeArray.indexOf(employee.EmpName) === -1){
          this.employeeArray.push(employee.EmpName)
          this.BUCKING.get('employeeList').patchValue(this.selectedSkillItems)
          return;
       }
       else{
         if(event.node.id === employee.EmpId){
           let index = this.employeeArray.indexOf(employee.EmpName);
           this.employeeArray.splice(index,1)

         }
       }
      }
    
  }

  OnUnSelectNode(e) {
 
    if (e.node.selectable === false) {
     // this.selectedmenuItems.push(e.node.parent);
    }
    this.OnSelectingEmployees(e)
  
  }
//method to get bins dropdown in complete page
  getAllBins(){
    let TaskId =this.TaskModel.TaskId
    this.dropdownDataService.getBins(TaskId).subscribe(
      data => {
        // let newdata: any[];
        // newdata = this.removeDuplicatesById(data);
   
        if (data !== 'No Data Found!') {
          this.binslist = this.dropdwonTransformService.transform(data,'BinName', 'BinId', '-- Select --');
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

  resetForm() {
    
    this.completionForm.reset({ isStrainComplete: false });
 
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
        BinId:this.reviewForm.controls['binId'].value,
        MiscCost: formModel.rmisccost === null?0:formModel.rmisccost,
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
      },
      // InputBinDetails:[],
      // OutputBinDetails:[]
    };
    // this.inpubinData.forEach((element, index) => {
    //   // this.duplicateSection = element.value.section
    //   taskReviewWebApi.InputBinDetails.push({
    //     BinId:element.InputBinId,
    //     DryWt: element.IPBinWt,
    //     WetWt: 0,
    //     WasteWt: element.TotalWasteWt,
            
    //      });
    
    //  });
    //  this.BinData.forEach((element, index) => {
    //   // this.duplicateSection = element.value.section
    //   taskReviewWebApi.OutputBinDetails.push({
    //     BinId:element.OPBinId,
    //     DryWt: element.OPBinWt,
    //     WetWt: 0,
    //     WasteWt: element.WasteWt,
    //     IsOpBinFilledCompletely: element.IsOpBinFilledCompletely == true?1:0
            
    //      });
    
    //  });
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
        else if (data[0].RESULTKEY ==='Output Bin weight and Input Bin Completed weight Not Same'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY });
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
  if ( this.completionForm.valid === true) {
    taskCompletionWebApi = {
      Bucking:{
        TaskId:Number(this.taskid),
        Comment:" ",
        VirtualRoleId: Number(this._cookieService.VirtualRoleId),
        BinId:this.completionForm.controls['binId'].value,
      },
      // InputBinDetails:[],
      // OutputBinDetails:[]
    };
   
      // this.duplicateSection = element.value.section
      // taskCompletionWebApi.InputBinDetails.push({
      //   BinId:this.TaskModel.InputBinId,
      //   DryWt: Number(formModel.completeWt),
      //   WetWt: 0,
      //   WasteWt:Number(formModel.wasteWt) ,
            
      //    });
        
   
    
    //  this.buckingDetailsArr.controls.forEach((element, index) => {
    //   // this.duplicateSection = element.value.section
    //   taskCompletionWebApi.OutputBinDetails.push({
    //     BinId:element.value.binsId,
    //     DryWt: element.value.weight,
    //     IsOpBinFilledCompletely: element.value.binFull == true?1:0
            
    //      });
        
    //  });
   
     

  }
  // assignedPC = Number(this.taskCompletionModel.AssignedPlantCnt);
  // if(Number(assignedPC) < Number(this.TaskModel.CompletedPlantCnt) + Number(this.TaskModel.CompletedPlantCnt))
  
  this.confirmationService.confirm({
    message: this.assignTaskResources.taskcompleteconfirm,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',

    accept: () => {
      this.loaderService.display(true);
      this.taskCommonService.completeBuckingTask(taskCompletionWebApi)
      .subscribe(data => {
        if (data[0].RESULTKEY  === 'This status already exist') {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskCompleted });
          if (this.TaskModel.IsReview === true) {
            this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
          } else {
            this.TaskModel.TaskStatus =  this.taskStatus.Completed;
          }
          this.TaskCompleteOrReviewed.emit();
        }
       else    if (data[0].RESULTKEY  === 'Completed weight is greater than Assigned bin weight') {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.completewtgreaterthantotal });
        this.PageFlag.showmodal = false;
        this.loaderService.display(false);
      }
      else    if (data[0].RESULTKEY  === 'Output Bin weight is greater than Completed weight') {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY });
        this.PageFlag.showmodal = false;
        this.loaderService.display(false);
      }
      else    if (data[0].RESULTKEY  === 'Output Bin weight and Input Bin Completed weight Not Same') {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY });
        this.PageFlag.showmodal = false;
        this.loaderService.display(false);
      }
      else    if (data[0].RESULTKEY  === 'Output Bin weight is greater than Input Bin weight') {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.morebinweight });
        // if (this.TaskModel.IsReview === true) {
        //   this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
        // } else {
        //   this.TaskModel.TaskStatus =  this.taskStatus.Completed;
        // }
        // this.TaskCompleteOrReviewed.emit();
        // this.PageFlag.showmodal = false;
        // this.loaderService.display(false);
      }
        else if (data === 'Failure'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          this.PageFlag.showmodal = false;
          this.loaderService.display(false);
        }
      
        // else if (data[0].RESULTKEY ==='Success'){
        //   this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskcompleteddetailssavesuccess });
        //   setTimeout( () => {
        //     if (this._cookieService.UserRole === this.userRoles.Manager) {
        //       this.router.navigate(['home/managerdashboard']);
        //     } else {
        //       this.router.navigate(['home/empdashboard']);
        //     }
        //   }, 1000);
        //   this.PageFlag.showmodal = false;
        //   this.loaderService.display(false);
        // }
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
showEmps(event: any){
  if(this.visibility === true){
    this.visibility = false;
    this.showUpArrow = false
  }
  else{
    this.visibility = true;
    this.showUpArrow = true
  }

console.log(event)
}
}
