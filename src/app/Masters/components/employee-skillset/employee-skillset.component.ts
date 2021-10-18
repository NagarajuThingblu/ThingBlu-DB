import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, FormArrayName } from '@angular/forms';
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
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-skillset',
  templateUrl: './employee-skillset.component.html',
  styleUrls: ['./employee-skillset.component.css']
})
export class EmployeeSkillsetComponent implements OnInit {
  public employeeSkillForm: FormGroup;
  public _cookieService: any;
  public globalResource: any;
  public msgs: any[];
  chkIsActive: any;
  pageHeader: any;
  chkSelectAll: any;
  public tasktypelist:any;
  public tasknames = [];
  public event: any;
  public taskcategories:SelectItem[];
  public Skillsarray:any=[ ];
  public plusOnEdit: boolean = true;
  public IsDeletedForUpdate: any =0;
  public ActiveInActiveForUpdate: any = 0;
  public dataExist =true;
  public SkillDuplicateerror: String = 'Skill name already exist';
  public saveButtontext = 'Save';
  public clear = 'Clear';
  public allSkillslist: any;
  public paginationValues: any;
  public msg: any[];
  public SkillUpdateId: any = 0;
  public SkillTaskTypeMapId: any = 0;
  public SkillTypeEdit: any;
  public SkillListBox: boolean= true;
  public submitted: boolean;
  public backUrl: boolean;
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
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
  ngOnInit() {
    this.backUrl = this.appCommonService.employeePageBackLink;
    this.chkIsActive = 1;
    this.pageHeader = 'Add New Skills';
    this.appComponentData.setTitle('Skills');
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();

    this.employeeSkillForm = this.fb.group({
      'taskcategory': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      'tasktype':new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      items: new FormArray([], this.customGroupValidation),
    });
    this.addItem();
  }
  get skillDetailsArr(): FormArray {
    return this.employeeSkillForm.get('items') as FormArray;
  }
  createItem(): FormGroup {
    return this.fb.group({
      skills:new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      description: new FormControl(null, [Validators.maxLength(500)]),
      chkRequired:new FormControl(false),
      chkSelectAll: new FormControl(true)
    });
    
  }
  addItem(): void {
  
   // this.count++; 
  
     //console.log(this.count)
     this.arrayItems = this.employeeSkillForm.get('items') as FormArray;
     this.arrayItems.push(this.createItem());
   }
  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.skills];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['skills'].value !== null) {
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
      if (data !== 'No Data Found') {
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
  onPageChange(e) {
    this.event = e;
  }
  resetAll() {
    this.SkillUpdateId = 0;
    this.saveButtontext = 'save';
    this.pageHeader = 'Add New Skills';
    this.clear = 'Clear';
 this.plusOnEdit=  true;
    this.Skillsarray.length = 0;
    this.resetForm();

  }
  resetForm() {
    this.employeeSkillForm.reset({ chkSelectAll: true });
  
    this.skillSetdetails = {
      taskcategory: null,
      tasktype: null,
      skills:null,
    }

    const control = <FormArray>this.employeeSkillForm.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
    this.addItem();
  }
  deleteItemAll(index: number) {
   
    const control = <FormArray>this.employeeSkillForm.controls['items'];
    control.removeAt(index);
  }
  deleteItem(index: number) {
    
    const control = <FormArray>this.employeeSkillForm.controls['items'];
   
    if (control.length !== 1) {
      control.removeAt(index);
    }
    console.log(this.employeeSkillForm.get('items'))
   
  }
  backToEmpPage() {
    this.router.navigate(['../home/master/addemployee']);
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
          SkillTaskMapId:this.SkillTaskTypeMapId,
          // IsDeleted:0,
          // IsActive: this.employeeSkillForm.value.chkIsActive ? 1 : 0,
          // ActiveInactive:0,
          SkillList:[]
      };
      // this.Skillsarray.forEach((element, index) => {
      //   skillDetauilsForApi.SkillList.push({
      //     SkilId:this.SkillUpdateId,
      //     SkillName:element,
      //   });
      // });
      this.skillDetailsArr.controls.forEach((element, index) => 
    {
      
      skillDetauilsForApi.SkillList.push({
        SkilId:this.SkillUpdateId,
         SkillName: element.value.skills,
          Description:element.value.description ,
          IsActive: element.value.chkSelectAll ? 1 : 0,
          IsDeleted:this.IsDeletedForUpdate,
          IsTaskOnlyForSkillEmployee:element.value.chkRequired ? 1 : 0,
          ActiveInactive:this.ActiveInActiveForUpdate
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
            this.SkillTaskTypeMapId = 0
            this.resetAll();
            this.getSkills();
          }
          else   if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'UPDATED') {
            this.msg.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail:"Skill Set Updated Successfully."
            });
            this.SkillUpdateId = 0;
            this.SkillTaskTypeMapId = 0;
            this.resetAll();
            this.getSkills();
          }
          else   if (String(data[0].RESULTKEY)=== 'Duplicate') {
            this.msg.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:data[0].ResultMsg+" is duplicate"
            });
            // this.SkillUpdateId = 0;
            // this.resetAll();
            // this.getSkills();
          }
          else if (data === 'Failure') {
            this.msg.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          }
        })
      }
    }

    GetSkillonEdit(SkillTaskTypeMapId) {
      this.pageHeader = 'Edit Skill';
      this.clear = 'Cancel';
  this.plusOnEdit = false;
      const data = this.allSkillslist.filter(rt => rt.SkillTaskTypeMapId == SkillTaskTypeMapId)
      var itemlist = this.employeeSkillForm.get('items')['controls'];
      if (data != 'No Data Found') {
        this.SkillTaskTypeMapId = SkillTaskTypeMapId;
        this.SkillUpdateId = data[0].SkillId;
        this.SkillTypeEdit = data;
        this.oncategoryChange(this.SkillTypeEdit[0].TaskCategoryID)
        const taskcategory = this.employeeSkillForm.controls['taskcategory'];
        const tasktype = this.employeeSkillForm.controls['tasktype'];
        const skills = itemlist[0].controls['skills'];
        const description =  itemlist[0].controls['description'];
        const chkIsActive = itemlist[0].controls['chkSelectAll'];
        const chkRequired = itemlist[0].controls['chkRequired'];

        taskcategory.patchValue(this.SkillTypeEdit[0].TaskCategoryID);
        tasktype.patchValue(this.SkillTypeEdit[0].TaskTypeId);
        skills.patchValue(this.SkillTypeEdit[0].SkillName);
        description.patchValue(this.SkillTypeEdit[0].Description);
        chkIsActive.patchValue(this.SkillTypeEdit[0].IsActive);
        chkRequired.patchValue(this.SkillTypeEdit[0].Required);
        this.saveButtontext = 'Update';
      }
      else {
        this.allSkillslist = [];
      }
      this.loaderService.display(false);
    }

    showConformationMessaegForDelete(SkillId, skillset, IsDeleted, ActivateInactivateKey) {
      let strMessage: any;
      strMessage = 'Do you want to delete the Skill?';
      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.activateDeleteSkill(SkillId, skillset, IsDeleted, ActivateInactivateKey);
        },
        reject: () => {
        }
      });
    }
    activateDeleteSkill(SkillId: any, skillset: any, IsDeleted: any, ActivateInactivateKey: any) {
      this.submitted = true;
      let skillDetauilsForApi;
    skillDetauilsForApi = {
          TaskTypeId:skillset.TaskTypeId,
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          SkillTaskMapId:skillset.SkillTaskTypeMapId,
          SkillList:[]
      };
     
        skillDetauilsForApi.SkillList.push({
          SkilId:SkillId,
          SkillName:skillset.SkillName,
          IsDeleted:IsDeleted,
          IsTaskOnlyForSkillEmployee:skillset.skillset ? 1 : 0,
          IsActive:skillset.IsActive? 1:0,
          ActiveInactive:ActivateInactivateKey,
        });
    
      this.loaderService.display(true);
      this.newEmployeeActionService.addNewSkills(skillDetauilsForApi).subscribe(data => {
        this.msg = [];
        if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'UPDATED' && IsDeleted == 1) {
          this.msg.push({
            severity: 'success', summary: this.globalResource.applicationmsg,
            detail: "Successfully Deleted"
          });
          this.getSkills();
        }
        else if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'UPDATED' && ActivateInactivateKey === 1) {
          if (skillset.IsActive !== true) {
            this.msg.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: "Successfully InActivated"
            });
            this.resetAll();
            this.getSkills();
            this.loaderService.display(false);
          }
          else {
            this.msg.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: "Successfully Activated"
            });
            this.resetAll();
            this.getSkills();
            this.loaderService.display(false);
          }
        }
        else if (String(data[0].RESULTKEY) === 'NOTUPDATED') {
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
        else if (String(data[0].RESULTKEY) === 'ZoneINACTIVE') {
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
        } else if (String(data[0].RESULTKEY) === 'INUSE') {
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
    showConformationMessaegForDeactive(SkillId, skillset, IsDeleted: number, ActiveAction: number) {
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
  
          this.activateDeleteSkill(SkillId, skillset, IsDeleted, ActiveAction);
        },
        reject: () => {
          skillset.IsActive = !skillset.IsActive;
        }
      });
    }
  
}
