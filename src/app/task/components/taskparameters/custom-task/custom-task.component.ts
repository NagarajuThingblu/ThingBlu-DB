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
import { NewEmployeeActionService } from '../../../services/add-employee';
// import { PTRService } from '../../../../Masters/services/ptr.service';

@Component({
  moduleId: module.id,
  selector: 'app-custom-task',
  templateUrl: 'custom-task.component.html',
  styleUrls: ['./custom-task.component.css']
})
export class CustomTaskComponent implements OnInit {
  CUSTOMTASK: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  public showDefaultEmployees:boolean=true;

  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Input() TaskModel: any;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();
  ngOnChanges()
  {
    console.log(this.TaskModel);
    this.TaskTypeKey=this.TaskModel.TaskTypeKey;
    // this.TaskTypeKey==="INDEPENDENT"?this.ParentFormGroup.addControl('INDEPENDENT',this.CUSTOMTASK):this.ParentFormGroup.addControl('CUSTOMTASK', this.CUSTOMTASK);

  }
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
    private ptrActionService: PTRService,
    private titleService: Title,
    private refreshService: RefreshService,
    private dropdownDataService: DropdownValuesService,
    private newEmployeeActionService: NewEmployeeActionService,
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  display = false;

  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // public Lots: any[];
  // public Employees: any[];
   public priorities: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;
  public clientSkewed: any[];
  public taskReviewModel: any;
  public taskCompletionModel: any;
  public userRoles: any;
  public msgs: Message[] = [];
  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // TaskActionDetails: any;
  //added skills list and multiple emp//
  public skills: SelectItem[];
  public allSkillslist: any;
  public allemplist : any[]
  public skilledempslist: any[]
  public headings: any[];
  plottedSkillItems: any = [];
  public selectedSkillItems: any[];
  public files: any = [];
  public visibility:boolean = false;
  public showUpArrow:boolean = false;
  public employeeArray:any=[];
  public employeeNameToBeDisplayedOnDropdown="--Select--"
  //end of added skills list and multiple emp//
  public taskid: any;
  public taskType: any;
  public defaultDate: Date;
  public showToManager = false;
  public LotCommentsCount = 10;
  public allSubCrewlist: any;
  public crewlist: SelectItem[];
  public subcrewlist: SelectItem[];
  public filteredCrewList:any[];
  public defaultEmployees:any[]
  // Added by Devdan :: 10-Oct-2018
  taskTypeId: any;
  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;
  TaskTypeKey:any;
  public employees: any[];
  private globalData = {
    lots: [],
    employees: [],
    defaultEmployees:[],
    strains: []
  };
  ngOnInit() {
    this.employeeNameToBeDisplayedOnDropdown="--Select--"
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
      this.TaskModel.CUSTOMTASK = {
        startdate: this.TaskModel.startdate,
        employee: '',
        esthrs: '',
        usercomment: '',
        emprate: '',
        empcost: '',
        priority: 'Normal'
      };
      this.TaskTypeKey=this.TaskModel.TaskTypeKey;
      this.CUSTOMTASK = this.fb.group({
        'lotno': new FormControl(0, Validators.required),
        // 'brand': new FormControl(''),
        // 'strain': new FormControl(''),
        'employee': new FormControl(0),
        'employeeList': new FormControl('', Validators.required),
        'crew': new FormControl(''),
        'subcrew': new FormControl(''),
        'skills':new FormControl(''),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl('',  Validators.compose([  ])),
        'emprate': new FormControl(''),
        'actualcost': new FormControl(0),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
      });

     this.TaskTypeKey=="INDEPENDENT"?this.ParentFormGroup.addControl('INDEPENDENT',this.CUSTOMTASK):this.ParentFormGroup.addControl('CUSTOMTASK', this.CUSTOMTASK);

      if (this.taskTypeId > 0) {
          this.TaskModel.CUSTOMTASK = {
            startdate: this.TaskModel.startdate,
            employee: this.TaskModel.TaskDetails.EmpId,
            esthrs: '',
            usercomment: this.TaskModel.TaskDetails.TaskComment,
            emprate: '',
            empcost: '',
            TaskTypeId:this.TaskModel.task,
            priority: this.TaskModel.TaskPriority,
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
    this.employeeListByClient();
    this.getCrewList();
    this.getSkills()
    this.priorities =  [
      {label: 'Normal', value: 'Normal'},
      {label: 'Important', value: 'Important'},
      {label: 'Critical', value: 'Critical'}
    ];
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }

  // Commented by Devdan :: 26-Oct-2018 :: Unused
  // ReturnFormattedDate(dateObject) {
  //   return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  // }

  //skills
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
      skillListApiDetails.SkillList.push({SkillID:this.CUSTOMTASK.value.skills})
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
  onCrewSelect(event:any){
    if(event.value !=null){
      this.showDefaultEmployees=false;
      this.subcrewlist = this.dropdwonTransformService.transform(this.allSubCrewlist.filter(x => x.CrewID === event.value && x.IsActive == true), 'SubCrewName', 'SubCrewID');
    }
  else{
    this.showDefaultEmployees=true;
  }
 
  }
  //on selecting skill
  onSkillsSelect(event:any){
    if(event.value !=null){
      this.showDefaultEmployees=false;
      this.employeeNameToBeDisplayedOnDropdown="--Select--"
  let skillListApiDetails;
  skillListApiDetails = {
    TaskTypeId:Number(this.TaskModel.task),
    CrewId:this.CUSTOMTASK.value.subcrew,
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

  //filtering employees based on skill
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

  //To Show and hide Employees
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
//on selecting an employee

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
        this.CUSTOMTASK.get('employeeList').patchValue(this.selectedSkillItems)
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

  //On Unselecting an employee
  OnUnSelectNode(e) {

    if (e.node.selectable === false) {
     // this.selectedmenuItems.push(e.node.parent);
    }
    this.OnSelectingEmployees(e)
  
  }
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
              if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
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
              if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
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
          if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
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
          if (this._cookieService.UserRole === this.userRoles.Manager ||this._cookieService.UserRole === this.userRoles.SystemAdmin || this._cookieService.UserRole === this.userRoles.SuperAdmin) {
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
    empOnChange() {
      const selectedEmp = this.globalData.employees.filter(data => data.EmpId === this.TaskModel.CUSTOMTASK.employee)[0];
  
      if (selectedEmp !== undefined) {
        this.TaskModel.CUSTOMTASK.emprate =  selectedEmp.HourlyRate;
        this.TaskModel.CUSTOMTASK.empcost =  selectedEmp.HourlyRate * this.TaskModel.CUSTOMTASK.esthrs;
      } else {
        this.TaskModel.CUSTOMTASK.emprate =  0;
        this.TaskModel.CUSTOMTASK.empcost = 0;
      }
    }

}
