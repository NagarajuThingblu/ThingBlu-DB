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
import { NewEmployeeActionService } from '../../../services/add-employee';
//import { CrewService } from '../../../../Masters/services/crew.service';
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-planting',
  templateUrl: './planting.component.html',
  styleUrls: ['./planting.component.css']
})
export class PlantingComponent implements OnInit{
  PLANTING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  // tslint:disable-next-line:no-input-rename
  @Input() sectionData: any;
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
  public allemplist : any[]
  public skilledempslist: any[]
  public headings: any[]
  public skills: SelectItem[];
  public termination:SelectItem[];
  public employeeNameToBeDisplayedOnDropdown="--Select--"
  public visibility:boolean = false;
  public showUpArrow:boolean = false;
  public allSubCrewlist: any;
  public crewlist: SelectItem[];
  public subcrewlist: SelectItem[];
  public filteredCrewList:any[];
  public showDefaultEmployees:boolean=true;
  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private qcs: QuestionControlService ,
    private service: QuestionService,
    private taskCommonService: TaskCommonService,
    private route: ActivatedRoute,
    private ptrActionService: PTRService,
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
    // this.questions = service.getQuestions();
  }
  display = false;
  public sectionList = [];
  public totalPlantCount=0;
  public strainList=[];
  public  Fields: any[];
  public TerminatioReasons: any[];
  public fields: any[];
  public workingEmp: any=[];
  public workingemp:boolean =false
  public strains: any[];
  public defaultEmployees:any[]
  public employees: any[];
  public globalResource: any;
  public msgs: Message[] = [];
  public allSkillslist: any;
   public taskid: any;
   taskTypeId: any;
  public taskType: any;
  public employeeArray:any=[];
  public employeeNames: any=[];
  public strainName: '';
  public defaultValueCompletePc: Number = 0;
  public extraPC: Number = 0;
  public defaultValueTerminatedPc: Number = 0;
  public plantCount: any;
  public taskCompletionModel: any;
  public taskReviewModel: any;
  public allsectionslist:any;
  public files: any = [];
  plottedSkillItems: any = [];
  public selectedSkillItems: any[];
  public employeeName:'';
  public cookie_clientId: any = 0;
  public cookie_virtualRoleId: any = 0;
  private globalData = {
    lots: [],
    employees: [],
    defaultEmployees:[],
    strains: [],
    Fields: [],
    TerminationReasons: [],
    workingEmp:[],//array to hold already working emp list
  };
  isRActSecsDisabled: boolean;
  ngOnInit() {
    this.employeeNameToBeDisplayedOnDropdown="--Select--"
    this.getAllFieldsAndSections();
    this.getCrewList()
    this.getSkills();
    // this.getAllsectionlist();
    this.employeeListByClient();
    this.getTerminationReasons();
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.cookie_clientId = this.appCommonService.getUserProfile().ClientId;
    this.cookie_virtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    this.titleService.setTitle('Planting');
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
      this.TaskModel.PLANTING = {
        field: '',
        plantCount:'',
        section: '',
        assignedPC: '',
        strain: '',
        strainName:'',
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
   
    this.PLANTING = this.fb.group({
      'strain': new FormControl('', Validators.required),
      'field' : new FormControl('', Validators.required),
      'section': new FormControl('', Validators.required),
      'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
     'employeeList': new FormControl('', Validators.required),
     'plantCount' : new FormControl('', Validators.required),
     'crew': new FormControl(null),
     'subcrew': new FormControl(null),
     'skills':new FormControl(null),
     'assignedPC' : new FormControl(''),// hem growers don't assign particular number of palnts to emp
      'priority': new FormControl(''),
      'notifymanager': new FormControl(''),
      'notifyemployee': new FormControl(''),
      'comment': new FormControl('', Validators.maxLength(500)),
    });
  

    this.ParentFormGroup.addControl('PLANTING', this.PLANTING);
    }
    else{
      
     this.taskReviewModel = {
      misccost: this.TaskModel.MiscCost,
      CompletedPlantCnt : this.TaskModel.CompletedPlantCnt,
      TerminatedPlantCount : this.TaskModel.TerminatedPlantCnt,
      TerminationReason : this.TaskModel.TerminationReason,
      TerminationReasonId: this.TaskModel.TerminationId,
      comment :'',
      racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
      ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
      ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
     }
      this.taskCompletionModel = {
        CompletedPlantCnt : this.TaskModel.CompletedPlantCnt,
        AssignedPlantCnt : this.TaskModel.AssignedPlantCnt,
        TerminatedPlantCount : this.TaskModel.terminatedtedPC,
        TerminationReason : this.TaskModel.terminationReason,
        comment : this.TaskModel.comment

      }

      this.completionForm = this.fb.group({
        'completedPC': new FormControl(''),
        'terminatedtedPC': new FormControl(''),
        'terminationReason':new FormControl(null),
        // 'extraPC':new FormControl(''),
        'comment':new FormControl(null),
      });

      this.reviewForm = this.fb.group({
        'completedPC': new FormControl(''),
        'terminatedtedPC': new FormControl(''),
        'terminationReason':new FormControl(''),
        'ActHrs': new FormControl(null),
          'ActMins': new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'ActSecs': new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
          'rmisccost': new FormControl(null),
          'rmisccomment': new FormControl(null)
      })
        // const terminationReason = this.reviewForm.controls['terminationReason'];
        // terminationReason.patchValue(this.taskReviewModel.TerminationReasonId);
      
    }

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
  OnUnSelectNode(e) {
 
    if (e.node.selectable === false) {
     // this.selectedmenuItems.push(e.node.parent);
    }
    this.OnSelectingEmployees(e)
  
}
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
  closetaskpopup(){
    this.completionForm.controls['completedPC'].setValue(0),
    this.completionForm.controls['terminatedtedPC'].setValue(0),
    this.completionForm.controls['terminationReason'].setValue(''),
    this.completionForm.controls['comment'].setValue(0)
   this.PageFlag.showmodal=false
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
  onCrewSelect(event:any){
    if(event.value !=null){
      this.showDefaultEmployees=false;
      this.subcrewlist = this.dropdwonTransformService.transform(this.allSubCrewlist.filter(x => x.CrewID === event.value && x.IsActive == true), 'SubCrewName', 'SubCrewID');
    }
  else{
    this.showDefaultEmployees=true;
  }
 
  }
  onSubCrewSelect(event:any){
    if(event.value !=null){
      this.showDefaultEmployees=false;
      this.employeeNameToBeDisplayedOnDropdown="--Select--"
      let skillListApiDetails;
      skillListApiDetails = {
        TaskTypeId:Number(this.TaskModel.task),
        CrewId:event.value,
        SkillList:[]
      };
      skillListApiDetails.SkillList.push({SkillID:this.PLANTING.value.skills})
      this.taskCommonService.getEmployeeListBasedOnSkills(skillListApiDetails)
      .subscribe(data => {
        this.headings = data.Table,
        this.skilledempslist = data.Table1,
        this.allemplist =data.Table2 ? data.Table2 : []
        this.globalData
        this.empfilterBasedOnSkill()
      });
    }
    else{
      this.showDefaultEmployees=true;
    }
  
  }
  onSkillsSelect(event:any){
    if(event.value !=null){
      this.showDefaultEmployees=false;
      this.employeeNameToBeDisplayedOnDropdown="--Select--"
  let skillListApiDetails;
  skillListApiDetails = {
    TaskTypeId:Number(this.TaskModel.task),
    CrewId:this.PLANTING.value.subcrew,
    SkillList:[]
  };
  skillListApiDetails.SkillList.push({SkillID:event.value})
  this.taskCommonService.getEmployeeListBasedOnSkills(skillListApiDetails)
  .subscribe(data => {
    this.headings = data.Table,
    this.skilledempslist = data.Table1,
    this.allemplist =data.Table2 ? data.Table2 : []
    this.globalData
    this.empfilterBasedOnSkill()
  });
    }
    else{
      this.showDefaultEmployees=true;
    }
  }
  
  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
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
      ReviewPlant: {
        TaskId:Number(this.taskid),
        VirtualRoleId: 0,
        // CompletedPlantCount:formModel.completedPC,
        // TerminatedPlantCount: formModel.terminatedtedPC,
        // TerminationId:  formModel.terminationReason?formModel.terminationReason:0,
        Comment: formModel.rmisccomment,
        MiscCost: formModel.rmisccost,
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
      this.taskCommonService.submitPlantTaskReview(taskReviewWebApi)
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
              this.router.navigate(['home/dashboard/managerdashboard']);
            }
            else {
              this.router.navigate(['home/dashboard/empdashboard']);
            }
          }, 1000);
        }
        else if (data[0].RESULTKEY === 'Failure'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
        }
        else if (data === 'This status already exist'){
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'This status already exist' });
          this.PageFlag.showmodal = false;
          this.loaderService.display(false);
        }
        // else  if (data[0].RESULTKEY === 'Invalid Termination Reason'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.invalid });
        // }
        // else  if (data[0].RESULTKEY === 'Please Select Termination Reason'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY});
        // }
        // else  if (data[0].RESULTKEY === 'Invalid Termination Reason'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.invalid });
        // }
        // else if (data[0].RESULTKEY ==='Completed Plant Count Greater Than Available Plant Count'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: "Completed Plant Count Greater Than Available Plant Count" });
        //   this.loaderService.display(false);
        // }
        // else if (data[0].RESULTKEY ==='Completed Plant Count Greater Than Assigned Plant Count'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.plantcountmore });
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
                        this.router.navigate(['home/dashboard/managerdashboard']);
                      } else {
                        this.router.navigate(['home/dashboard/empdashboard']);
                      }
                    }, 1000);
        }
      })
    }
  })

}

completeTask(formModel){
  let taskCompletionWebApi;
  // let assignedPC;
  if ( this.completionForm.valid === true) {
    taskCompletionWebApi = {
      CompletePlant:{
        TaskId:Number(this.taskid),
        // CompletedPlantCount: formModel.completedPC,
        // TerminatedPlantCount: formModel.terminatedtedPC,
        // ExtraPlantCount:formModel.extraPC,
        // TerminationId:  formModel.terminationReason?formModel.terminationReason:0,
        Comment: formModel.comment,
        VirtualRoleId: 0,
      }
    }
  }
  // assignedPC = Number(this.taskCompletionModel.AssignedPlantCnt);
  // if(Number(assignedPC) < Number(this.TaskModel.CompletedPlantCnt) + Number(this.TaskModel.CompletedPlantCnt))
  
  this.confirmationService.confirm({
    message: this.assignTaskResources.taskcompleteconfirm,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',

    accept: () => {
      this.loaderService.display(true);
      this.taskCommonService.completePlantTask(taskCompletionWebApi)
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
        else if (data[0].RESULTKEY === 'Deleted'){
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });
          setTimeout( () => {
            if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin ) {
              this.router.navigate(['home/dashboard/managerdashboard']);
            } else {
              this.router.navigate(['home/dashboard/empdashboard']);
            }
          }, 1000);
        }
        else if (data === 'Failure'){
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          this.PageFlag.showmodal = false;
          this.loaderService.display(false);
        }
        else if (data === 'This status already exist'){
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'This status already exist' });
          this.PageFlag.showmodal = false;
          this.loaderService.display(false);
        }
        // else  if (data[0].RESULTKEY === 'Please Select Termination Reason'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY });
        //   this.PageFlag.showmodal = false;
        //   this.loaderService.display(false);
        // }
        // else  if (data[0].RESULTKEY === 'Completed Plant Count Greater Than Available Plant Count'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data[0].RESULTKEY });
        //   this.PageFlag.showmodal = false;
        //   this.loaderService.display(false);
        // }
        // else if (data[0].RESULTKEY ==='Completed Plant Count Greater Than Assigned Plant Count'){
        //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.plantcountmore });
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
                      if (this._cookieService.UserRole === this.userRoles.Manager||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
                        this.router.navigate(['home/dashboard/managerdashboard']);
                      } else {
                        this.router.navigate(['home/dashboard/empdashboard']);
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
      new Date(this.PLANTING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  getCrewList(){
    this.ptrActionService.getAllSubCrewList().subscribe(data=>{
      if(data!="No Data Found"){
        this.allSubCrewlist=data.Table;
        this.crewlist = this.dropdwonTransformService.transform(this.allSubCrewlist, 'CrewName', 'CrewID', '-- Select --',false);
        const crewfilter = Array.from(this.allSubCrewlist.reduce((m, t) => m.set(t.CrewName, t), new Map()).values())
        this.filteredCrewList = this.dropdwonTransformService.transform(crewfilter,'CrewName', 'CrewID', '-- Select --',false)
       
      }
      else{
        this.allSubCrewlist=[];
      }
      this.loaderService.display(false);
    },
    error => { console.log(error); this.loaderService.display(false); },
    () => console.log('GetAllCrewListbyClient complete'));
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

  // getSectionListByFieldName(event?:any){
  //   this.sectionList = [];
  //     for(let sec of this.globalData.Fields ){
  //       if(event.value === sec.FieldId){
  //         this.sectionList.push({label: sec.SectionName, value: sec.SectionId})
  //       }
  //     }
    
  // }

  onFieldSelect(event?:any){
    this.strainList = [];
      const strainData= this.globalData.Fields.filter(x=>x.FieldId === event.value);
      this.strainList = this.dropdwonTransformService.transform(strainData, 'StrainName', 'StrainId', '-- Select --',false);
      const strainListfilter = Array.from(strainData.reduce((m, t) => m.set(t.StrainName, t), new Map()).values())
      this.strainList = this.dropdwonTransformService.transform(strainListfilter,'StrainName', 'StrainId', '-- Select --',false)
  }
  onStrainSelect(event?:any){
    this.sectionList=[];
    for(let j of event.value){
      for(let i of this.globalData.Fields){
        if((i.StrainId === j|| i.StrainId === event) && (i.FieldId === this.PLANTING.controls.field.value)){
              this.sectionList.push({label: i.SectionName, value:i.SectionId})
        }
      }
    }

  }
  onSectionSelect(event?:any){
    this.plantCount=0;
    for(let j of event.value){
      for(let i of this.globalData.Fields){
        if((i.SectionId === j|| i.SectionId === event)){
          this.plantCount = this.plantCount+ i.AvilablePlantCount;
          this.PLANTING.controls["plantCount"].setValue(this.plantCount)
              // this.sectionList.push({label: i.SectionName, value:i.SectionId})
             this.getWorkingEmpList(event.itemValue);
        }
      }
    }
   
  }
  // getStrainAndPlantCount(event?: any){
  //   this.globalData.workingEmp =[];
  //   this.workingEmp = [];
  //   this.workingemp=false;
  //   for(let sec of this.globalData.Fields ){
  //     if(event.value === sec.SectionId)
  //     {
  //       this.strainName = sec.StrainName;
  //       this.plantCount =sec.AvilablePlantCount;
  //       this.TaskModel.PLANTING.section = sec.SectionName
  //       this.TaskModel.PLANTING.strain =  this.strainName
  //       this.PLANTING.controls["strain"].setValue(this.strainName)
  //       this.TaskModel.PLANTING.totalPC  = this.plantCount
  //       this.PLANTING.controls["plantCount"].setValue(this.plantCount)
  //     }
  //   }
  //   this.getWorkingEmpList(event.value);
   
  // }

  getWorkingEmpList(sectionId){
    this.dropdownDataService.getEmpAlreadyWorkingOnATask(sectionId,this.TaskModel.task,0,0).subscribe(
      data=>{
        if(data != 'No Data Found'){
          this.globalData.workingEmp = data;
          this.getWorkingEmpsList();
        }
        // else{
        //   this.globalData.workingEmp = [];
        //   this.workingEmp = [];
        // }
      }
    )
  }
  getWorkingEmpsList(){
    if(this.globalData.workingEmp != null){
      for(let employee of this.globalData.workingEmp){
        if( this.workingEmp.indexOf(employee.Column1) == -1){
          this.workingEmp.push(employee.Column1)
        }
       
    }
    }
    // else{
    //   this.workingEmp = [];
    // }
 // this.filterEmpList()
  }
  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = data;
        this.globalData.defaultEmployees = data;
        if (data !== 'No data found!') {
        this.defaultEmployees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
        } else {
          this.employees = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('Get all employees by client complete'));
  }
  // filterEmpList(){
  //   for(let j of this.globalData.workingEmp){
  //     // for(let i of this.employees){
  //       // if(i.value === j.EmpId){
  //         let index = this.employees.findIndex(x => x.value === j.EmpId)
          
  //         this.employees.splice(index,1)
  //       // }
  //     // }
  //   }
  // }

  onSelectingDefaultEmp(event: any){
    // for(let i of event.value){
      for(let employee of  this.globalData.defaultEmployees){
        if(event.itemValue=== employee.EmpId && this.employeeArray.indexOf(employee.EmpName) === -1){
          this.employeeArray.push(employee.EmpName)
        }
        else if(event.itemValue=== employee.EmpId && this.employeeArray.indexOf(employee.EmpName) !=-1){
          let index = this.employeeArray.indexOf(employee.EmpName);
          this.employeeArray.splice(index,1)
        }
      }
    //}
  
  }
  OnSelectingEmployees(event: any){
    if(this.employeeNameToBeDisplayedOnDropdown === "--Select--"){
      this.employeeNameToBeDisplayedOnDropdown=""
    }
    let count =0
    for(let employee of  this.globalData.employees){
        if(event.node.id === employee.EmpId && this.employeeArray.indexOf(employee.EmpName) === -1){
          this.employeeArray.push(employee.EmpName)
          for(let i of this.employeeArray){
           count++
            if(count <=4){
              if(this.employeeNameToBeDisplayedOnDropdown.indexOf(i) === -1){
                this.employeeNameToBeDisplayedOnDropdown =this.employeeNameToBeDisplayedOnDropdown+" "+i+"  "
              }
            }
          else{
            this.employeeNameToBeDisplayedOnDropdown =count+" selected"
          }
          }
          //this.employeeNameToBeDisplayedOnDropdown = ""+employee.EmpName
          this.PLANTING.get('employeeList').patchValue(this.selectedSkillItems)
          return;
       }
       else{
      
        // for(let i of this.employeeArray){
        //   count--
        //    if(count <=4){
        //      if(this.employeeNameToBeDisplayedOnDropdown.indexOf(i) != -1){
        //        this.employeeNameToBeDisplayedOnDropdown =this.employeeNameToBeDisplayedOnDropdown+" "+i+"  "
        //      }
        //    }
        //  else{
        //    this.employeeNameToBeDisplayedOnDropdown =count+" selected"
        //  }
        //  }
         if(event.node.id === employee.EmpId){
          this.employeeNameToBeDisplayedOnDropdown=""
           let index = this.employeeArray.indexOf(employee.EmpName);
           this.employeeArray.splice(index,1)
          let count1 = this.employeeArray.length
           for(let i of this.employeeArray){
             if(count1 <=4){
               if(this.employeeNameToBeDisplayedOnDropdown.indexOf(i) === -1){
                 this.employeeNameToBeDisplayedOnDropdown =this.employeeNameToBeDisplayedOnDropdown+" "+i+"  "
               }
             }
           else{
             this.employeeNameToBeDisplayedOnDropdown =count1+" selected"
           }
           }
         }
       }
      }
    
  }
  // removeitem(deleteitem){
  //   this.employeeArray.splice(deleteitem,1)
  //  let element = this.checkedElements.nativeElement
  //  console.log(element)
  // }
 
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
