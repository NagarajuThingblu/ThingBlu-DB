import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import { StrainTypeService } from '../../services/strain-type.service';
import { AddGeneticsActionService } from '../../../task/services/add-genetics-action.service';
import { GeneticsService } from '../../services/genetics.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { NewEmployeeActionService } from '../../../task/services/add-employee';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-skillset',
  templateUrl: './employee-skillset.component.html',
  styleUrls: ['./employee-skillset.component.css']
})
export class EmployeeSkillsetComponent implements OnInit {
  employeeSkillForm: FormGroup;
  public _cookieService: any;
  public globalResource: any;
  public msgs: any[];
  chkIsActive: any;
  pageHeader: any;
  public tasktypelist:any;
  public tasknames = [];
  public taskcategories:SelectItem[];
  public Skillsarray:any=[ ];
  public dataExist =true;
  public SkillDuplicateerror: String = 'Skill name already exist';
  public saveButtontext = 'Save';
  public clear = 'Clear';
  public allSkillslist: any;
  public paginationValues: any;
  public msg: any[];
  public SkillUpdateId: any = 0;
  public SkillTypeEdit: any;
  public SkillListBox: boolean= true;
  public submitted: boolean;
  skillSetdetails: {
    taskcategory: null,
    tasktype: null,
    skills:null,

  }
  public globalData: any = {
    taskTypes: []
  };
  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private appComponentData: AppComponent,
    private dropdwonTransformService: DropdwonTransformService,
    private confirmationService: ConfirmationService,
    private newEmployeeActionService: NewEmployeeActionService,
    
    private appCommonService: AppCommonService,
    private router: Router
  ) { 
    this.getTaskDetails()
    this.getSkills()
  }

  ngOnInit() {
    this.chkIsActive = 1;
    this.pageHeader = 'Add New Skills';
    this.appComponentData.setTitle('Skills');
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();

    this.employeeSkillForm = this.fb.group({
      'taskcategory': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      'skills':new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      'tasktype':new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      'chkIsActive': new FormControl(null),
    });
  }

  getTaskDetails(){
    this.dropdownDataService.getAllTask().subscribe(
      data => {
        this.globalData.taskTypes = data;
        this.tasktypelist=data;
        console.log(data, 'tasks');
        //this.tasknames = this.dropdwonTransformService.transform(data, 'TaskTypeValue', 'TaskTypeId', '-- Select --', false);
         this.taskcategories=this.dropdwonTransformService.transform(data,'CategoryName','TaskCategoryID');
         const taskCatfilter = Array.from(this.taskcategories.reduce((m, t) => m.set(t.label, t), new Map()).values())
         this.taskcategories = this.dropdwonTransformService.transform(taskCatfilter,'label', 'value', '-- Select --',false)
      }
      
    )
  }
  oncategoryChange(event:any){
    this.tasknames = []
for(let i of this.tasktypelist){
  if(i.TaskCategoryID === event.value || i.TaskCategoryID === event){
      this.tasknames.push({label: i.TaskTypeValue, value:i.TaskTypeId});
  }
}
const tasknamefilter = Array.from(this.tasknames.reduce((m, t) => m.set(t.label, t), new Map()).values())
this.tasknames = this.dropdwonTransformService.transform(tasknamefilter,'label', 'value', '-- Select --',false)
  }

  addSkillslist(skill){
    const taskcCtegory = this.employeeSkillForm.value.taskcategory
   //const skillcheck = this.allZonestypelist.filter(rt => rt.RoomId == proroom &&   rt.ZoneName === prozone.value);
    if (skill.value.length>0){
        this.Skillsarray.push(skill.value);
        skill.value='';
      this.dataExist = true;
    }
    // else if(zonecheck.length!=0){
    //   this.dataExist = false;
    // }
    console.log(this.SkillDuplicateerror);
  }

  removeitem(deleteitem){
    this.Skillsarray.splice(deleteitem,1)
  }
  getSkills() {
    this.loaderService.display(true);
    this.newEmployeeActionService.GetSkillslist().subscribe(data => {
      if (data !== 'No Data found') {
        this.allSkillslist = data;
        this.paginationValues = AppConstants.getPaginationOptions;
        if (this.allSkillslist.length > 20) {
          this.paginationValues[AppConstants.getPaginationOptions.length] = this.allSkillslist.length;

        }
      }
      else {
        this.allSkillslist = [];
      }
      this.loaderService.display(false);
    },

      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('GetAllSkillsList complete'));

  }

  resetAll() {
    this.SkillUpdateId = 0;
    this.saveButtontext = 'save';
    this.pageHeader = 'Add New Zone';
    this.clear = 'Clear';
    this.Skillsarray.length = 0;
    this.resetForm();

  }
  resetForm() {
    this.employeeSkillForm.reset({ chkIsActive: true });
    this.skillSetdetails = {
      taskcategory: null,
      tasktype: null,
      skills:null,
    }
  }
  backToEmpPage() {
    this.router.navigate(['../home/addemployee']);
  }

  //save skillset
  
    onSubmit(value: string) {
      if (String(this.employeeSkillForm.value.skills).trim().length == 0) {
        this.employeeSkillForm.controls['skills'].setErrors({ 'whitespace': true });
        this.employeeSkillForm.value.skills = null;
        return;
      }
      if(this.SkillUpdateId!=0){
        this.Skillsarray.push(this.appCommonService.trimString(this.employeeSkillForm.value.skills));
        this.SkillListBox= false;
       
        }
    let skillDetauilsForApi;
    skillDetauilsForApi = {
          TaskTypeId:this.employeeSkillForm.value.tasktype,
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          IsDeleted:0,
          IsActive: this.employeeSkillForm.value.chkIsActive ? 1 : 0,
          ActiveInactive:0,
          SkillList:[]
      };
      this.Skillsarray.forEach((element, index) => {
        skillDetauilsForApi.SkillList.push({
          SkilId:this.SkillUpdateId,
          SkillName:element,
        });
      });
      if (this.employeeSkillForm.valid) {
        this.loaderService.display(false);
        this.newEmployeeActionService.addNewSkills(skillDetauilsForApi).subscribe(data => {
          this.msg = [];
          if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'SUCCESS') {
            this.msg.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail:"Skill Set Saved Successfully."
            });
            this.SkillUpdateId = 0;
            this.resetAll();
            this.getSkills();
          }
        })
      }
    }

    GetSkillonEdit(SkillID) {
      this.pageHeader = 'Edit Skill';
      this.clear = 'Cancel';
  
      const data = this.allSkillslist.filter(rt => rt.SkillID == SkillID)
      if (data != 'No Data Found') {
        this.SkillUpdateId = SkillID;
        this.SkillTypeEdit = data;
        this.oncategoryChange(this.SkillTypeEdit[0].TaskCategoryID)
        const taskcategory = this.employeeSkillForm.controls['taskcategory'];
        const tasktype = this.employeeSkillForm.controls['tasktype'];
        const skills = this.employeeSkillForm.controls['skills'];
        const chkIsActive = this.employeeSkillForm.controls['chkIsActive'];
  
        taskcategory.patchValue(this.SkillTypeEdit[0].TaskCategoryID);
        tasktype.patchValue(this.SkillTypeEdit[0].TaskTypeId);
        skills.patchValue(this.SkillTypeEdit[0].SkillName);
        chkIsActive.patchValue(this.SkillTypeEdit[0].IsActive);
        this.saveButtontext = 'Update';
      }
      else {
        this.allSkillslist = [];
      }
      this.loaderService.display(false);
    }

    showConformationMessaegForDelete(SkillID, skillset, IsDeleted, ActivateInactivateKey) {
      let strMessage: any;
      strMessage = 'Do you want to delete the Skill?';
      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.activateDeleteSkill(SkillID, skillset, IsDeleted, ActivateInactivateKey);
        },
        reject: () => {
        }
      });
    }
    activateDeleteSkill(SkillID: any, skillset: any, IsDeleted: any, ActivateInactivateKey: any) {
      this.submitted = true;
      let skillDetauilsForApi;
    skillDetauilsForApi = {
          TaskTypeId:skillset.TaskCategoryID,
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          IsDeleted:IsDeleted,
          IsActive:skillset.IsActive ,
          ActiveInactive:ActivateInactivateKey,
          SkillList:[]
      };
     
        skillDetauilsForApi.SkillList.push({
          SkilId:SkillID,
          SkillName:skillset.SkillName,
        });
    
      this.loaderService.display(true);
      this.newEmployeeActionService.addNewSkills(skillDetauilsForApi).subscribe(data => {
        this.msg = [];
        if (data[0]['Result'] === 'success' && IsDeleted == 1) {
          this.msg.push({
            severity: 'success', summary: this.globalResource.applicationmsg,
            detail: "Successfully Deleted"
          });
          this.getSkills();
        }
        else if (String(data[0]['Result']) === 'success' && ActivateInactivateKey === 1) {
          if (skillset.IsActive !== true) {
            this.msg.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: "Successfully Activated"
            });
            this.resetAll();
            this.getSkills();
            this.loaderService.display(false);
          }
          else {
            this.msg.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: "hi"
            });
            this.resetAll();
            this.getSkills();
            this.loaderService.display(false);
          }
        }
        else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
          if (IsDeleted === 1) {
            this.msg.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: "hi"
            });
            this.loaderService.display(false);
          } else if (skillset.IsActive === true) {
            this.msg.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:  "hi"
            });
            skillset.IsActive = !skillset.IsActive;
            this.loaderService.display(false);
          } else {
            this.msg.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:  "hi"
            });
            skillset.IsActive = !skillset.IsActive;
            this.loaderService.display(false);
          }
        }
        else if (String(data.toLocaleUpperCase()) === 'ZoneINACTIVE') {
          // alert('in in use');
          this.msg.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail:  "hi"
          });
          skillset.IsActive = !skillset.IsActive;
          this.loaderService.display(false);
        }
        else if (data === 'Failure') {
          this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
        } else if (String(data.toLocaleUpperCase()) === 'INUSE') {
          this.msg.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail:  "hi"
          });
        } else {
          this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
        }
        // http call end
        this.loaderService.display(false);
  
  
  
      },
        error => {
          this.msg = [];
          this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
          // http call end
          this.loaderService.display(false);
        });
    }
    showConformationMessaegForDeactive(SkillID, skillset, rowIndex, IsDeleted: number, ActiveAction: number) {
      let strMessage: any;
      if (skillset.IsActive === true) {
        strMessage = 'Do you want to activate Skill?';
      } else {
        strMessage = 'Do you want to inactivate Skill?';
      }
  
      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
  
          this.activateDeleteSkill(SkillID, skillset, IsDeleted, ActiveAction);
        },
        reject: () => {
          skillset.IsActive = !skillset.IsActive;
        }
      });
    }
  
}
