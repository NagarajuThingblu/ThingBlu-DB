import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdownTransformPipe } from '../../../shared/pipes/dropdown-transform.pipe';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { Router } from '@angular/router';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import{ NewTaskActionService } from '../../../task/services/new-task-action.service';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  selector: 'app-add-new-task',
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.css']
})
export class AddNewTaskComponent implements OnInit {
pageheading: any;
TaskmasterForm: FormGroup;
Tasktypes: any[];
newTaskTypes: any[];
public newTaskResources: any;
public globalResource: any;
public allTaskList: any;
public _cookieService: any;

public taskForUpdate: any=0;
public taskOnEdit: any;
public saveButtonText: any;

chkIsActive: boolean;
clear: any;
public event: any;
paginationValues: any;

//all form fields model object
newTaskDetails={
  tasktype:null,
  task:null,
  description:null,
  chkISActive:1
};
private globalData={
  tasktypes:[]
}
public msgs: any[];
taskTypeDisabled: any;
submitted: boolean;
public backUrl: boolean;

  constructor(
  private fb:FormBuilder,
  private loaderService: LoaderService,
  private cookieService: CookieService,
  private dropdownDataService: DropdownValuesService,
  private dropdownTransformService: DropdwonTransformService,
  private confirmationService:ConfirmationService,
  private appComponentData: AppComponent,
  private appCommonService:AppCommonService,
  private router:Router,
  private newTaskActionService: NewTaskActionService


  ) { }

  ngOnInit() {

    this.TaskmasterForm = this.fb.group({
      'tasktype': new FormControl(null,Validators.required),
      'task': new FormControl(null,[Validators.required,Validators.maxLength(50)]),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    });

    this.newTaskResources = MastersResource.getResources().en.addnewtasktype;
    this.globalResource=GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService=this.appCommonService.getUserProfile();
    this.getAllTaskType();
    this.getAllTasksbyClient();
    this.saveButtonText='Save';
    this.pageheading='Add New Task';
    this.clear='Clear';
    this.appComponentData.setTitle('Task');
    this.chkIsActive=true;
    this.taskTypeDisabled=false;
  }

  resetForm()
  {
    this.TaskmasterForm.reset({chkISActive:true});
    this.newTaskDetails={
      tasktype:null,
      task:null,
      description:null,
      chkISActive:1
    };
  }

  getAllTasksbyClient() {
    this.loaderService.display(true);
    this.newTaskActionService.getTaskDetailList().subscribe(
      data=>{
        if(data!=='No data found')
        {
          this.allTaskList=data;
          this.paginationValues=AppConstants.getPaginationOptions;
          if(this.allTaskList.length>20)
          {
            this.paginationValues[AppConstants.getPaginationOptions.length]=this.allTaskList.length;

          }
          
        }
        else{
          this.allTaskList=[];
        }
        this.loaderService.display(false);
      },
      error=>{ console.log(error);  this.loaderService.display(false); },
      () => console.log('getAllTasksbyClient complete'));
    
  }
  getAllTaskType() {
    this.dropdownDataService.getNewTaskType().subscribe(
      data=>{
        this.globalData.tasktypes=data;
        this.newTaskTypes= this.dropdownTransformService.transform(data, 'CategoryName','TaskCategoryID','-- Select --');
        this.Tasktypes= this.dropdownTransformService.transform(data, 'CategoryName','TaskCategoryID','-- Select --');
      },
      error=>{console.log(error);},
      ()=> console.log('Get all Tasks types complete')
    );
  }
  onPageChange(e) {
    this.event = e;
  }
  onSubmit(value:string){
    if(String(this.TaskmasterForm.value.task).trim().length===0)
    {
      this.TaskmasterForm.controls['task'].setErrors({'whitespace':true});
      this.TaskmasterForm.value.task=null;
      return;
    }

    const TasskDetailsForApi={
      Task:{
        TaskId:this.taskForUpdate,
        TaskTypeId:this.TaskmasterForm.value.tasktype,
        TaskName: this.appCommonService.trimString(this.TaskmasterForm.value.task),
        Description: this.appCommonService.trimString(this.TaskmasterForm.value.description),
        VirtualRoleId: this._cookieService.VirtualRoleId,
        IsActive:this.TaskmasterForm.value.chkIsActive?1:0,
        ClientId: Number(this._cookieService.ClientId)
      }
    };

    if(this.TaskmasterForm.valid){
      this.loaderService.display(true);
      this.newTaskActionService.addNewTask(TasskDetailsForApi)
      .subscribe(
        data=>{
          this.msgs=[];
          if(data[0]['Result']==='Success'){
            this.msgs.push({severity:'success', summary: this.globalResource.applicationmsg, detail: this.newTaskResources.newTasksavedsuccess});

             this.resetAll();
             this.getAllTasksbyClient();
          }else if (data === 'NotUpdated') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newTaskResources .noupdate });
          } else if (data[0]['Result'] === 'NotInserted') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newTaskResources.cannotinsert });
          } else if (String(data[0].ResultKey).toUpperCase() === 'NOTPRESENT') {
            if (data[0]['NoTaskType'] === 1) {
              this.TaskmasterForm.controls['Tasktype'].setErrors({ 'tasktypenotpresent': true });
              this.loaderService.display(false);
            }
            
          } else if (String(data[0].ResultKey).toUpperCase() === 'TaskTYPEDELETED') {

            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newTaskResources.straintypedeleted });

              this.loaderService.display(false);
          } else if (data === 'Failure') {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          } else if (data === 'Duplicate') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newTaskResources.taskalreadyexist });
          } else {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
          }
            // http call end
            this.loaderService.display(false);
        },
        error => {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
          // http call end
          this.resetForm();
          this.loaderService.display(false);
        }
        
      );
    }
  }

  getTaskOnEdit(TaskId)
  {
 const data = this.allTaskList.filter(x=>x.Id==TaskId);
 if(data!=='No data found!'){
   this.taskForUpdate=TaskId;
   this.taskOnEdit=data;
   const tasktype=this.TaskmasterForm.controls['tasktype'];
   const task = this.TaskmasterForm.controls['task'];
   const description = this.TaskmasterForm.controls['description'];
   const chkIsActive = this.TaskmasterForm.controls['chkIsActive'];
   task.patchValue(this.taskOnEdit[0].TaskTypeName);
   chkIsActive.patchValue(this.taskOnEdit[0].Active);
   description.patchValue(this.taskOnEdit[0].Description);
   this.clear='Cancel';
   this.saveButtonText='Update';
   this.pageheading='Edit Task';

   if(!this.Tasktypes.filter(item=>item.value==this.taskOnEdit[0].TaskTypeId).length){
     this.Tasktypes.push({label:this.taskOnEdit[0].Tasktypename,value: this.taskOnEdit[0].TaskCategoryID});
   }

   tasktype.patchValue(this.taskOnEdit[0].TaskCategoryID);
   this.taskTypeDisabled=true;

 }
 else{
   this.allTaskList=[];
 }
 this.loaderService.display(false);
  }
  resetAll() {
    this.taskForUpdate=0;
    this.saveButtonText='save';
    this.pageheading='Add New Task';
    this.clear='Clear';
    this.taskTypeDisabled=false;
    this.resetForm();
    this.Tasktypes= this.newTaskTypes;
  }
  showConformationMessaegForDelete(TaskId, Task, IsDeleted, ActiveInactiveFlag) {
    let strMessage: any;
    strMessage = this.newTaskResources.deletetaskmsg;
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteTask(TaskId, Task, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
  });
  }
  activateDeleteTask(TaskId, Task, IsDeleted, ActiveInactiveFlag)
  {
this.submitted = true;
 const TasskDetailsForApi={
   Task:{
     TaskId:TaskId,
     TaskTypeId:Task.TaskTypeId,
     VirtualRoleId:this._cookieService.VirtualRoleId,
     IsDeleted:IsDeleted,
     IsActive:Task.IsActive,
     ActiveInactive:ActiveInactiveFlag
   }
 };
 this.loaderService.display(true);
 this.newTaskActionService.addNewTask(TasskDetailsForApi)
 .subscribe(
   data=>{
     this.msgs=[];
     if(data[0]['Result'] === 'Success' && ActiveInactiveFlag === 1){
       if(Task.IsActive===true){
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
        detail:  this.newTaskResources.taskActivated});
        this.resetAll();
        this.getAllTasksbyClient();
        this.loaderService.display(false);
       }else{
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
        detail:  this.newTaskResources.taskInactivated});
        this.resetAll();
        this.getAllTasksbyClient();
        this.loaderService.display(false);
       }
     }else if(data[0]['Result'] === 'Success' && IsDeleted === 1){
      this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
      detail:  this.newTaskResources.TaskDeletedSuccess});
      this.resetAll();
      this.getAllTasksbyClient();
      this.loaderService.display(false);
     }
     else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
      if (IsDeleted === 1) {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.newTaskResources.notdeleted });
        this.loaderService.display(false);
      } else if (Task.IsActive === true) {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.newTaskResources.notactivated });
        Task.IsActive = !Task.IsActive;
        this.loaderService.display(false);
      } else {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.newTaskResources.notinactivated });
        Task.IsActive = !Task.IsActive;
        this.loaderService.display(false);
      }
    } else if (data === 'Failure') {
      this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
    } else if (data === 'Duplicate') {
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newTaskResources.taskalreadyexist });
    } else if (data === 'InUse') {
      this.msgs = [];
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
      detail: 'Can`t delete. Record is in use.'});
    } else {
      this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
    }
      // http call end
      this.loaderService.display(false);
  },
  error => {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
    // http call end
    this.resetAll();
    this.loaderService.display(false);
  });
  }
  showConformationMessaegForDeactive(TaskId, Task, rowIndex, IsDeleted, ActiveInactiveFlag) {
    console.log(Task);
    let strMessage: any;
    if (this. allTaskList[rowIndex].IsActive === true) {
      strMessage = this.newTaskResources.activetaskmsg ;
    } else {
      strMessage = this.newTaskResources.deactivatetaskmsg ;
    }

    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteTask(TaskId, Task, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          Task.IsActive = !Task.IsActive;
        }
    });
  }

}
