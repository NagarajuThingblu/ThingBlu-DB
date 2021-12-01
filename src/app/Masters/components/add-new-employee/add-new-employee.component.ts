import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { SelectItem } from 'primeng/api';
import { NewEmployeeActionService } from '../../../task/services/add-employee';
import { NewEmployeeService } from '../../services/new-employee.service';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { Router } from '@angular/router';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';
// import {messageService} from 'primeng/api';


declare function unescape(s: string): string;
@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.css']
})
export class AddNewEmployeeComponent implements OnInit {

  @Input() NewEmployeeSave: EventEmitter<any> = new EventEmitter<any>();
  public newUserInfo: any = {
    ShowAddUserRolePopup: null,
    role: null
  };
  paginationValues: any;
  showEmpTaskModal: any;
  dateTime = new Date();

  newEmployeeForm: FormGroup;
  private globaldata = {
    clients: [],
    countries: [],
    states: [],
    cities: [],
    gender: [],
    userroles: [],
    roles: []
  };
  showTextbox: any = true;
  showPWbox: any = true;
  clear: any;
  msgs: any[];
  clients: any[];
  countries: any[];
  states: any[];
  cities: any[];
  roles:  any[];
  genders: SelectItem[];
  sampleData:any[]
  sampleDataChild:any[]
  stringEscapeRegex: any = /[^ a-zA-Z0-9]/g;
  chkIsActive: boolean;
  public allEmployeeList: any;
  public allSkillsList :any;
  public allSkillslistforBelowList : any
  public getInventoryList: any;
  public employeeOnEdit: any;
  public saveButtonText: any;
  public empIdForUpdate: any = 0;
  public _cookieService: any;
  public newEmployeeResources: any;
  public minusEnable:boolean = false
  public showeye: boolean = true;
public hideeye: boolean = false;
passwordShown: boolean= true;
passwordType: string = 'text';
  public constantusrRole:any;
  public alltaskslist: any;
  public allSkillslist: any;
  public displatSkillSet: boolean = false;
  public selectedRole:any;
  public Managerlist:any;
  public Skilllist:TreeNode[];
  selectedFile:  TreeNode[];
  public ManagerlistOptional : boolean = false;
  public flclist:any;
  public othersourceList:any
  public files: any = [];
  public showMang: boolean =false;
  public showFlc: boolean =false;
  public globalResource: any;
  public showTerminationDate: boolean = false;
  public star:boolean = false;
  plottedSkillItems: any = [];
  public selectedSkillItems: any[];
  public HoldingSelectedHeadings:any[];
  collapsed: any;
public WhenToDisplayPWField: boolean = false
  public visibility:boolean = false;
  public showUpArrow:boolean = false;
   public makeFlcOptional:boolean=false;
    public makeOSOptional:boolean=false;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private newEmployeeActionService: NewEmployeeActionService,
    private appComponentData: AppComponent,
   // private cookieService: CookieService, ::unused
    private newEmployeeService: NewEmployeeService,
    private scrolltopservice: ScrollTopService,
    private router: Router,
  
  //  private MessageService: messageService
    // private TreeModule :TreeModule,
    // private Tree:Tree,
    // private TreeNode:TreeNode,
  ) {
    this.getClientList();
    this.getAllRoles();
    this.getCountryList();
    this.getStateList();
    this.getCityList();
    this.GetManagerlist();
    this.getAllEmployee();
    this.GetFLClist();
    this.GetOtherSourceList()
    this.getSkills();
    this.saveButtonText = 'Save';
    this.dateTime.setDate(this.dateTime.getDate());
   }

   ngOnInit() {
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.chkIsActive = true;
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this.appComponentData.setTitle('Employee');
    this._cookieService = this.appCommonService.getUserProfile();
    this.constantusrRole=  AppConstants.getUserRoles;
    // new product type form defination(reactive form)
  this.newEmployeeForm = this.fb.group({
    'clientname': new FormControl(null, Validators.required),
    'firstname': new FormControl(null, Validators.required),
    'middlename': new FormControl(null),
    'lastname': new FormControl(null, Validators.required),
    'gender': new FormControl(null),
    'dob': new FormControl(null, Validators.compose([Validators.maxLength(15)])),
    'hiredate': new FormControl(null, Validators.compose([ Validators.required,Validators.maxLength(15)])),
    'terminationdate': new FormControl(null),
    'cellphone': new FormControl(null, Validators.compose([ Validators.maxLength(15)])),
    'homephone': new FormControl(null, Validators.compose([Validators.maxLength(15)])),
    'primaryemail': new FormControl(null,{validators: [
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")], updateOn: 'blur'}),
      'secondaryemail': new FormControl(null,{validators: [
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")], updateOn: 'blur'}),
  
    'address': new FormControl(null, Validators.compose([ Validators.maxLength(50)])),
    'country': new FormControl(null, Validators.compose([Validators.maxLength(13)])),
    'state': new FormControl(null, Validators.compose([ Validators.maxLength(13)])),
    'city': new FormControl(null, Validators.compose([ Validators.maxLength(13)])),
    'zipcode': new FormControl(null, Validators.compose([ Validators.maxLength(9)])),
    'empusername': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(20)])),
    'emppassword': new FormControl(null, Validators.compose([Validators.minLength(6), Validators.maxLength(20)])),
    'userrole': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(13)])),
    'hourlylabourrate': new FormControl(0, Validators.compose([ Validators.maxLength(13)])),
    'chkIsActive': new FormControl(null),
    'Managerlist': new FormControl(null),
    'flclist':new FormControl(null),
    'oslist':new FormControl(null),
    'skills':new FormControl(null),
  });
  // const managerdata = this.newEmployeeForm.get('Managerlist');
  const clientname = this.newEmployeeForm.controls['clientname'];
  clientname.patchValue(Number(this._cookieService.ClientId));
  // this.sampleData = [
  //   { ClientId:4, Id:62, IsParent:true, label:"Planting", Num:1,parentId:0 },
   
  //   { ClientId:4, Id:65, IsParent:true, label:"Harvesting", Num:4,parentId:0 },
 
  // ];
  // this.sampleDataChild = [
  //   { ClientId:4, Id:1, IsParent:false, label:"good at plants selection", Num:2,parentId:62 },
  //   { ClientId:4, Id:2, IsParent:false, label:"good at pestisides", Num:3,parentId:62 },
  //   { ClientId:4, Id:3, IsParent:false, label:"good at xyz", Num:5,parentId:65 },
  //   { ClientId:4, Id:4, IsParent:false, label:"good at zbc", Num:6,parentId:65 },
  // ]
  this.genders = [
    { label: '-- Select --', value: null },
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' }
  ];
  const Country = this.newEmployeeForm.controls['country'];
  Country.patchValue(31);
  const state = this.newEmployeeForm.controls['state'];
  state.patchValue(16);
 
  //this.plotSkillData()
  if (this.appCommonService.employeePageBackLink) {
    this.appCommonService.employeePageBackLink = false;
  }
  }
MakeFlcOrOsOptional(event:any){
  if(event.value==this.newEmployeeForm.controls['flclist'].value && event.value != null){
    this.newEmployeeForm.controls['oslist'].patchValue(null);
    this.makeOSOptional= true;
    this.makeFlcOptional=false;
  }
  else if(event.value== this.newEmployeeForm.controls['oslist'].value && event.value != null){
   this.newEmployeeForm.controls['flclist'].patchValue(null);
  this.makeFlcOptional= true;
  this.makeOSOptional=false;
  }
}
  doOPenPanel() {
    this.collapsed = false;
    this.resetAll();
  }
   // Save the form details
   onSubmit(value: any) {
    
    if (String(this.newEmployeeForm.value.firstname).trim().length === 0) {
      this.newEmployeeForm.controls['firstname'].setErrors({'whitespace': true});
      this.newEmployeeForm.value.firstname = null;
      return;
    }
    if (String(this.newEmployeeForm.value.lastname).trim().length === 0) {
      this.newEmployeeForm.controls['lastname'].setErrors({'whitespace': true});
      this.newEmployeeForm.value.lastname = null;
      return;
    }

    
    const primaryemail = this.newEmployeeForm.value.primaryemail;
    const secondaryemail = this.newEmployeeForm.value.secondaryemail;
    if (primaryemail !== '' && primaryemail !== null) {
      if (secondaryemail !== '' && secondaryemail !== null) {
        if (String(primaryemail).trim() === String(secondaryemail).trim()) {
          this.newEmployeeForm.controls['secondaryemail'].setErrors({'sameEmailAddr': true});
        }
      }
    }
    if(this.newEmployeeForm.value.emppassword != null){
      var encryptedPwd = this.encode64(String(this.newEmployeeForm.value.emppassword).trim());
    }
   
    let newRoleDetailsForApi;
    newRoleDetailsForApi = {
      Employee: {
          EmpId: this.empIdForUpdate,
          ClientId: this._cookieService.ClientId,
          FirstName: this.appCommonService.trimString(this.newEmployeeForm.value.firstname),
          MiddleName: this.appCommonService.trimString(this.newEmployeeForm.value.middlename),
          LastName: this.appCommonService.trimString(this.newEmployeeForm.value.lastname),
          Gender: this.newEmployeeForm.value.gender,
          DOB: new Date(this.newEmployeeForm.value.dob).toLocaleDateString().replace(/\u200E/g, ''),
          CellPhone: this.newEmployeeForm.value.cellphone,
          HomePhone: this.newEmployeeForm.value.homephone,
          PrimaryEmail: this.appCommonService.trimString(this.newEmployeeForm.value.primaryemail),
          SecondaryEmail: this.appCommonService.trimString(this.newEmployeeForm.value.secondaryemail),
          Address: this.appCommonService.trimString(this.newEmployeeForm.value.address),
          CountryId: this.newEmployeeForm.value.country,
          StateId: this.newEmployeeForm.value.state,
          CityId: this.newEmployeeForm.value.city,
          ZipCode: this.newEmployeeForm.value.zipcode,
          UserName: this.appCommonService.trimString(this.newEmployeeForm.value.empusername),
          Password: encryptedPwd ? encryptedPwd : null ,
          PasswordText: this.appCommonService.trimString(this.newEmployeeForm.value.emppassword),
          UserRoleId: this.newEmployeeForm.value.userrole,
          UserRole: (this.roles.filter(x => x.value === this.newEmployeeForm.value.userrole))[0].label,
          HourlyLabourRate: this.newEmployeeForm.value.hourlylabourrate,
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          IsActive: this.newEmployeeForm.value.chkIsActive ? 1 : 0,
          HireDate: new Date(this.newEmployeeForm.value.hiredate).toLocaleDateString().replace(/\u200E/g, ''),

          TerminationDate: new Date(this.newEmployeeForm.value.terminationdate).toLocaleDateString().replace(/\u200E/g, ''),
          EditorType: this._cookieService.UserRole,
          ManagerId:this.newEmployeeForm.value.Managerlist,
          FLCId:this.newEmployeeForm.value.flclist,
          OSID:this.newEmployeeForm.value.oslist,

      },
      SkillList:[]
    };
    this.selectedSkillItems.forEach((element, index) => {
      if(element.SkillTaskTypeMapId != 0){
        newRoleDetailsForApi.SkillList.push({
          SkilId: element.SkillTaskTypeMapId,
        });
      }
    });
    // this.NewProductTypeForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.newEmployeeForm.value)));

    // console.log(newRoleDetailsForApi);
    if (this.newEmployeeForm.valid) {
       // http call starts
       this.loaderService.display(true);
      this.newEmployeeActionService.addNewEmployee(newRoleDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newEmployeeResources.newemployeesavedsuccess });
              // this.newEmployeeForm.controls['state'].clearValidators()
              // this.newEmployeeForm.controls['city'].clearValidators()
              this.NewEmployeeSave = data;
              this.resetForm();
              this.showTerminationDate = false;
              this.getAllEmployee();
            }  else if(String(data[0].RESULTKEY) === 'Termination Date less Than HireDate'){
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            }
            else if(String(data[0].RESULTKEY) === 'Manager Is Empty'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            } else if(String(data[0].RESULTKEY) === 'Select Atleast One FLC or OtherSource'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            }else if(String(data[0].RESULTKEY) === 'Select Either FLC or OtherSource'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            }else if(String(data[0].RESULTKEY) === 'The HireDate Is Less Than the Date Of Birth'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            }else if(String(data[0].RESULTKEY) === 'Already Deleted'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            }else if(String(data[0].RESULTKEY) === 'Termination Date less Than HireDate'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            }else if(String(data[0].RESULTKEY) === 'Date Of Birth Greater Than The HireDate'){
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail:data[0].RESULTKEY });
            }else if (String(data).toLocaleUpperCase() === 'NOTUPDATED') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newEmployeeResources.noupdate });
                this.showTerminationDate = false;
                this.loaderService.display(false);
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (String(data[0].ResultKey).toUpperCase() === 'DUPLICATE') {
              // if (data[0].FirstName !== 0) {
              //   this.newEmployeeForm.controls['firstname'].setErrors({ 'duplicatefirstname': true });
              //   this.loaderService.display(false);
              // } if (data[0].LastName !== 0) {
              //   this.newEmployeeForm.controls['lastname'].setErrors({ 'duplicatelastname': true });
              //   this.loaderService.display(false);
              // }
           if (data[0].Email !== 0) {
                this.newEmployeeForm.controls['primaryemail'].setErrors({ 'duplicateemail': true });
                this.loaderService.display(false);
              } if (data[0].Username !== 0) {
                this.newEmployeeForm.controls['empusername'].setErrors({ 'duplicateusername': true });
                this.loaderService.display(false);
              }
            } else {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
            }
            // else if (data === 'Duplicate') {
            //   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            //       detail: this.newEmployeeResources.employeealreadyexist });
            // }
              // http call end
              this.loaderService.display(false);
          },
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            // http call end
            this.loaderService.display(false);
          });
    } else {
      this.appCommonService.validateAllFields(this.newEmployeeForm);
    }
  }
  EmployeeDeleteEvent(AllValues) {
    let newRoleDetailsForApi;
    newRoleDetailsForApi = {
      Employee: {
          EmpId: AllValues.EmpId,
          ClientId: Number(this._cookieService.ClientId),
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          IsDeleted: AllValues.IsDeleted,
          IsActive: AllValues.newemployee.IsActive,
          ActiveInactive: AllValues.ActiveInactiveFlag,
          // EditorType: 'Manager'
          EditorType: this._cookieService.UserRole
      },
      SkillList:[]
    };
    this.selectedSkillItems.forEach((element, index) => {
      newRoleDetailsForApi.SkillList.push({
        SkilId: element.SkillTaskTypeMapId,

      });
    });
    // this.NewProductTypeForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.newEmployeeForm.value)));

    // console.log(newRoleDetailsForApi);
       // http call starts
       this.loaderService.display(true);
      this.newEmployeeActionService.addNewEmployee(newRoleDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            // console.log(AllValues);
            this.msgs = [];
            if (data[0].Result === 'Success' && AllValues.IsDeleted === 1) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newEmployeeResources.newemployeedeletesuccess });
              this.NewEmployeeSave = data;
              this.getAllEmployee();
              this.resetForm();
              this.loaderService.display(false);
            } else if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && AllValues.ActiveInactiveFlag === 1) {
              if (AllValues.newemployee.IsActive !== true) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newEmployeeResources.employeedeactivated });
                // this.getAllEmployee();
                this.resetForm();
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newEmployeeResources.employeeactivated });
                // this.getAllEmployee();
                this.resetForm();
                this.loaderService.display(false);
              }
            } else if (String(data).toLocaleUpperCase() === 'NOTUPDATED') {
              if (AllValues.IsDeleted === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newEmployeeResources.employeehavetasks });
                this.loaderService.display(false);
              } else if (AllValues.newemployee.IsActive === true) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newEmployeeResources.notactivated });
                AllValues.newemployee.IsActive = !AllValues.newemployee.IsActive;
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newEmployeeResources.notinactivated });
                AllValues.newemployee.IsActive = !AllValues.newemployee.IsActive;
                this.loaderService.display(false);
              }
            } else if (String(data).toLocaleUpperCase() === 'INUSE' && AllValues.IsDeleted === 1) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newEmployeeResources.employeehavetasks });
              this.loaderService.display(false);
            } else if (String(data).toLocaleUpperCase() === 'INUSE' && AllValues.ActiveInactiveFlag === 1) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newEmployeeResources.employeehavetasksForInactivate });
              AllValues.newemployee.IsActive = !AllValues.newemployee.IsActive;
              this.loaderService.display(false);
            } else if (String(data[0].ResultKey).toUpperCase() === 'TASKASSIGNED') {
              this.getInventoryList = data;
              AllValues.newemployee.IsActive = !AllValues.newemployee.IsActive;
              this.showEmpTaskModal = true;
              this.loaderService.display(false);
            } else {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              this.loaderService.display(false);
              }
              // http call end
          },
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            this.loaderService.display(false);
          });
  }
  getAllEmployee() {
    this.loaderService.display(true);
    this.newEmployeeService.getAllEmployeeList().subscribe(
      data => {
       if (data != 'No data found!') {
          this.allEmployeeList = data.Table;
          this.allSkillslistforBelowList = data.Table1;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allEmployeeList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allEmployeeList.length;
          }
       } else {
        this.allEmployeeList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All  Employee List complete'));
  }
  GetManagerlist()
{
  this.dropdownDataService.getManagerList().subscribe(data=>{
    this.Managerlist=this.dropdwonTransformService.transform(data,'ManagerName','ManagerId','--Select--');
  }
  ,
      error => { console.log(error);
        this.loaderService.display(false); },
      () => console.log('Get all Managerlist complete'));
  
}
getSkills(){
  this.newEmployeeActionService.SkillslistForEmp().subscribe(data => {
    if (data !== 'No Data found') {
      this.displatSkillSet = true;
      this.alltaskslist = data.Table,
      this.allSkillslist = data.Table1
      if(this.allSkillslist){
         this.plotSkillData()
      }
     // this.Skilllist=this.dropdwonTransformService.transform(this.allSkillslist,'SkillName','SkillID');
    }
    else {
      this.displatSkillSet = false;
      this.Skilllist = [];
      this.allSkillslist = [];
    }
  
  },

    error => { console.log(error); this.loaderService.display(false); },
    () => console.log('GetAllSkillsList complete'));
}

plotSkillData(){
  this.plottedSkillItems = [];
  this.selectedSkillItems = [];
  this.alltaskslist.forEach(element => {
    const NewSkill: any = {};
    NewSkill.id = element.TaskTypeID;
    NewSkill.label = element.TaskTypeValue;
    NewSkill.children = [];
    //NewSkill.Num  = element.Num
NewSkill.isParent = element.IsParent;
NewSkill.ParentId = element.ParentId;
NewSkill.SkillTaskTypeMapId = 0
NewSkill.Selectable = true;
if (element.IsParent === false || element.IsParent === "False" ) {
  this.selectedSkillItems.push(NewSkill)
}
  
    if(NewSkill.isParent === true || NewSkill.isParent === "True"){
      this.plottedSkillItems.push(NewSkill)
    }
  });
  this.allSkillslist.forEach(element => {
    const NewSkillchild: any = {};
    NewSkillchild.id = element.SkillTaskTypeMapId;
    NewSkillchild.label = element.SkillName;
    NewSkillchild.children = [];
    NewSkillchild.SkillTaskTypeMapId  = element.SkillTaskTypeMapId
    NewSkillchild.isParent = element.IsParent;
    NewSkillchild.ParentId = element.ParentId;
   NewSkillchild.selectable = true;
    if (element.IsParent === false ||element.IsParent === "False") {
      if (this.plottedSkillItems.length) {
        this.plottedSkillItems.forEach(parent => {
          if (parent.id === element.ParentId) {
            parent.children.push(NewSkillchild);
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
  
}
onNodeSelect(e){
  if(e.node.selectable === true){
    console.log(e)
  }
}
// nodeSelect(event) {
//   this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
// }
  decode64 (input) {
    let output = '';
    let chr1: any = '', chr2: any = '', chr3: any = '' ;
    let enc1: any = '', enc2: any = '', enc3: any = '', enc4: any = '' ;
    let i = 0;
    const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    const base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert('There were invalid base64 characters in the input text.\n'
          + 'Valid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\n' + 'Expect errors in decoding.');
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';

    } while (i < input.length);
    // Return decoded string
     return unescape(output);
    // return output;
  }
  GetEmployeeOnEdit(EmpId) {
    
   this.resetForm();
      // this.showMang = false;
      // this.showFlc = false;
      // this.showTextbox = false;
      this.WhenToDisplayPWField = true;
      var decryptedpwd
       this.showPWbox = false;
      this.showTerminationDate = true;
      const password = this.newEmployeeForm.controls['emppassword'];
      password.clearValidators();
      const data = this.allEmployeeList.filter(x => x.EmpId === EmpId);
      const data1 = this.allSkillslistforBelowList.filter(x => x.EmpId === EmpId)
       if (data !== 'No data found!') {
          this.empIdForUpdate = EmpId;
          this.getStateList();
          this.getCityList();

          this.employeeOnEdit = data.filter(x => x.EmpId === EmpId);
          if( this.employeeOnEdit[0].FLCId != null){
            //  this. showMang = true
            //  this. showFlc = true
          }
          if( this.employeeOnEdit[0].ManagerId != null){
            // this. showMang = true
          
         }
         if( this.employeeOnEdit[0].Role === "Temp"){
          this.selectedRole= "Temp"
       }
       else{
         this.selectedRole=this.employeeOnEdit[0].Role
       }
       if(this.employeeOnEdit[0].Password != null){
         decryptedpwd = this.decode64(this.employeeOnEdit[0].Password);
         if(decryptedpwd.length >= 6){
          password.patchValue(decryptedpwd);
        }
       }
          
          const clientname = this.newEmployeeForm.controls['clientname'];
          const firstname = this.newEmployeeForm.controls['firstname'];
          const middlename = this.newEmployeeForm.controls['middlename'];
          const lastname = this.newEmployeeForm.controls['lastname'];
          const gender = this.newEmployeeForm.controls['gender'];
          const dob = this.newEmployeeForm.controls['dob'];
          const hiredate = this.newEmployeeForm.controls['hiredate'];
          const terminationdate = this.newEmployeeForm.controls['terminationdate'];
          const cellphone = this.newEmployeeForm.controls['cellphone'];
          const homephone = this.newEmployeeForm.controls['homephone'];
          const primaryemail = this.newEmployeeForm.controls['primaryemail'];
          const secondaryemail = this.newEmployeeForm.controls['secondaryemail'];
          const address = this.newEmployeeForm.controls['address'];
          const country = this.newEmployeeForm.controls['country'];
          const state = this.newEmployeeForm.controls['state'];
          const city = this.newEmployeeForm.controls['city'];
          const zipcode = this.newEmployeeForm.controls['zipcode'];
          const username = this.newEmployeeForm.controls['empusername'];
         
          const userrole = this.newEmployeeForm.controls['userrole'];
          const managerlist = this.newEmployeeForm.controls['Managerlist'];
          const flclist = this.newEmployeeForm.controls['flclist'];
          const oslist = this.newEmployeeForm.controls['oslist'];
          const hourlylabourrate = this.newEmployeeForm.controls['hourlylabourrate'];
          const chkIsActive = this.newEmployeeForm.controls['chkIsActive'];

          clientname.patchValue(this.employeeOnEdit[0].ClientId);
          firstname.patchValue(this.employeeOnEdit[0].FirstName);
          middlename.patchValue(this.employeeOnEdit[0].MiddleName);
          lastname.patchValue(this.employeeOnEdit[0].LastName);
          gender.patchValue(this.employeeOnEdit[0].Gender);
          if(this.employeeOnEdit[0].DOB != null){
            dob.patchValue(new Date(this.employeeOnEdit[0].DOB));
          }
         
          hiredate.patchValue(new Date(this.employeeOnEdit[0].HireDate));
          if(this.employeeOnEdit[0].TerminationDate != null){
            terminationdate.patchValue(new Date(this.employeeOnEdit[0].TerminationDate));
          }
          cellphone.patchValue(this.employeeOnEdit[0].CellPhone);
          homephone.patchValue(this.employeeOnEdit[0].HomePhone);
          primaryemail.patchValue(this.employeeOnEdit[0].PrimaryEmail);
          secondaryemail.patchValue(this.employeeOnEdit[0].SecondaryEmail);
          address.patchValue(this.employeeOnEdit[0].Address);
          country.patchValue(this.employeeOnEdit[0].CountryId);
          state.patchValue(this.employeeOnEdit[0].StateId);
          city.patchValue(this.employeeOnEdit[0].CityId);
          zipcode.patchValue(this.employeeOnEdit[0].ZipCode);
          username.patchValue(this.employeeOnEdit[0].Username);
         
        
          userrole.patchValue(this.employeeOnEdit[0].RoleId);
          managerlist.patchValue(this.employeeOnEdit[0].ManagerId);
          if(this.employeeOnEdit[0].FLCId !=null){
            flclist.patchValue(this.employeeOnEdit[0].FLCId);
            this.makeFlcOptional=false;
            this.makeOSOptional=true;
          }
        if(this.employeeOnEdit[0].OSID!=null){
   oslist.patchValue(this.employeeOnEdit[0].OSID);
     this.makeFlcOptional=true;
            this.makeOSOptional=false;
        }
       
          hourlylabourrate.patchValue(this.employeeOnEdit[0].HourlyRate);
          chkIsActive.patchValue(this.employeeOnEdit[0].IsActive);
          this.saveButtonText = 'Update';
          this.clear = 'Cancel';
          this.newEmployeeResources.pageheading = 'Edit Employee';
       } else {
        this.allEmployeeList = [];
       }
       if(data1 !== 'No data found!'){
      this.HoldingSelectedHeadings =[];
          this.plottedSkillItems = [];
           this.selectedSkillItems = [];
           this.alltaskslist.forEach(element => {
             const NewSkill: any = {};
             NewSkill.id = element.TaskTypeID;
             NewSkill.label = element.TaskTypeValue;
             NewSkill.children = [];
            // NewSkill.expandedIcon  = "far fa-minus-square",
         NewSkill.isParent = element.IsParent;
         NewSkill.ParentId = element.ParentId;
         NewSkill.SkillTaskTypeMapId = 0
         NewSkill.Selectable = true;
         if (NewSkill.isParent === false || NewSkill.isParent === "False" ) {
          this.selectedSkillItems.push(NewSkill)
        }
          
           
             if(NewSkill.isParent === true || NewSkill.isParent === "True"){
               this.plottedSkillItems.push(NewSkill)
               for(let j of data1){
               if(j.TaskTypeId ===   NewSkill.id){
                NewSkill.partialSelected= false
                 this.HoldingSelectedHeadings.push(NewSkill)
               }
              }
             }
           });
           this.allSkillslist.forEach(element => {
             const NewSkillchild: any = {};
             NewSkillchild.id = element.SkillTaskTypeMapId;
             NewSkillchild.label = element.SkillName;
             NewSkillchild.children = [];
             NewSkillchild.SkillTaskTypeMapId  = element.SkillTaskTypeMapId
             NewSkillchild.isParent = element.IsParent;
             NewSkillchild.ParentId = element.ParentId;
            NewSkillchild.selectable = true;
             if (element.IsParent === false ||element.IsParent === "False") {
               if (this.plottedSkillItems.length) {
                 this.plottedSkillItems.forEach(parent => {
                   if (parent.id === element.ParentId) {
                     parent.children.push(NewSkillchild);
                   } 
                 })
              
               }
             }
             for(let i of data1){
              if(i.SkillTaskTypeMapId === NewSkillchild.id){
                // this.OnUnSelectNode(NewSkillchild)
                NewSkillchild.partialSelected= false
                this.selectedSkillItems.push(NewSkillchild)
                
                // this.minusEnable =true
              }
            }
          
           
           })
           for(let j of this.selectedSkillItems){
            for(let k of this.plottedSkillItems) {
              if(j.ParentId === k.id){
                var count1 = this.selectedSkillItems.filter(ur=>ur.ParentId === j.ParentId)
             var count2 = this.plottedSkillItems.filter(ur=>ur.id === k.id)
             if( count2[0].children.length ===count1.length){
              for(let circle of this.HoldingSelectedHeadings){
                if(circle.id === count2[0].id){
                  this.selectedSkillItems.push(circle)
                }
              }
              }
              else{
               count2[0].partialSelected = true;
               count2[0].selectable = true
             }
              }
            } 
        }
        // if( count2[0].children.length ===count1.length){
        //  for(let circle of this.HoldingSelectedHeadings){
        //    if(circle.id === count2[0].id){
        //      this.selectedSkillItems.push(circle)
        //    }
        //  }
        //  }
        //  else{
        //   count2[0].partialSelected = true;
        //   count2[0].selectable = true
        // }
           this.files = this.plottedSkillItems;
         }
        
      
       
       this.loaderService.display(false);
      this.scrolltopservice.setScrollTop();
  }
  encode64(input) {
    input = this.escape(input);
    let output = '';
    let chr1: any = '', chr2: any = '', chr3: any = '' ;
    let enc1: any = '', enc2: any = '', enc3: any = '', enc4: any = '' ;
    let i = 0;
    const keyStr: string = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
    } while (i < input.length);

    // Return encoded string
    return output;
  }
  stringEscapeFn(c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  }
  // getcityName(){
  //   console.log(this.newEmployeeForm.controls['city'].value)
  // }
  escape(value) {
    if (this.isString(value)) {
        return '' + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + '';
    }

    if (this.isNumber(value)) {
      return value.toString();
    }

    if (value === true) {
      return 'true';
    }

    if (value === false) {
      return 'false';
    }

    if (value === null) {
      return 'null';
    }
    if (typeof value === 'undefined') {
      return 'undefined';
    }

  // throw $parseMinErr('esc', 'IMPOSSIBLE');
  throw new Error('IMPOSSIBLE');
}
  isString(value) {return typeof value === 'string'; }
  isNumber(value) {return typeof value === 'number'; }

  resetAll() {
    // this.showFlc = false
  
   this.passwordType='text';
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.showTerminationDate = false;
    this.newEmployeeResources.pageheading = 'Add New Employee';
    this.resetForm();
    // this.showTextbox = true;
    // this.showPWbox = true;
    this.states = null;
    this.cities = null;
    this.star = false;
  }
  resetForm() {
    // this.showTextbox = true;
      this.makeOSOptional=false;
    this.makeFlcOptional=false;
    this.passwordType = 'text';
    this.WhenToDisplayPWField = false;
    this.showUpArrow = false;
    this.visibility = false;
    this.selectedSkillItems = []
    this.empIdForUpdate = 0;
     this.showPWbox = true;
    this.selectedRole = ""
    this.newEmployeeForm.reset({ chkIsActive: true });
    // this.showFlc = false;
    const password = this.newEmployeeForm.get('emppassword')
    password.clearValidators();
    const clientname = this.newEmployeeForm.controls['clientname'];
    clientname.patchValue(Number(this._cookieService.ClientId));
    const Country = this.newEmployeeForm.controls['country'];
    Country.patchValue(31);
    const state = this.newEmployeeForm.controls['state'];
    state.patchValue(16);
  }

  getAllRoles() {
    this.dropdownDataService.getRoleList().subscribe(
      data => {
        this.globaldata.roles = data;
        this.roles = this.dropdwonTransformService.transform(data, 'RoleName', 'RoleId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all roles complete'));
  }


  Managerdrpdwnchng(event)
{
  // this.showMang = false;
  // this.showFlc = false;
  //this.showTextbox = false;
  const selectedRole=this.roles.filter(ur=>ur.value==event.value);
  this.selectedRole=selectedRole[0].label;
const managerdata = this.newEmployeeForm.get('Managerlist');
const password = this.newEmployeeForm.get('emppassword')
const flc = this.newEmployeeForm.get('flclist')
const os = this.newEmployeeForm.get('oslist')
this.newEmployeeForm.controls['flclist'].patchValue("") 
this.newEmployeeForm.controls['oslist'].patchValue("")
this.newEmployeeForm.controls['Managerlist'].patchValue("")
// if(this.selectedRole != 'Temp'){
//   this.showTextbox = true;
// }
if(!this.WhenToDisplayPWField){
  if(this.selectedRole != 'Temp'){
    this.showPWbox = true
   password.setValidators(Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)]));
  }
}
if(this.WhenToDisplayPWField){
  if(this.employeeOnEdit[0].Role === "Temp" &&  this.selectedRole != "Temp"){
    this.showPWbox = true
   password.setValidators(Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)]));
  }
}
if(this.constantusrRole.Employee==this.selectedRole )
{
 
    // this.showPWbox = true;
  managerdata.setValidators(Validators.required);
 
  flc.clearValidators();
  os.clearValidators();
  //flc.updateValueAndValidity();
  // this.showMang = true;
  
}
else if(this.constantusrRole.Temp==this.selectedRole){
  this.showPWbox = false
  password.setValidators(Validators.compose([Validators.minLength(6), Validators.maxLength(20)]));
  managerdata.setValidators(Validators.required);
  //flc.setValidators(Validators.required);
  //password.updateValueAndValidity();

  // this.showFlc = true;
}
else{
  managerdata.clearValidators();
  //password.clearValidators();
  flc.clearValidators();
  }
  managerdata.updateValueAndValidity();
  password.updateValueAndValidity();
  flc.updateValueAndValidity();
}

 

  



  getClientList() {
this.dropdownDataService.getClientList().subscribe(
  data => {
    this.globaldata.clients = data;
    this.clients = this.dropdwonTransformService.transform(data, 'ClientName', 'ClientId', '-- Select --');
  }
);
}

getCountryList() {
  this.dropdownDataService.getCountryList().subscribe(
    data => {
      // console.log(data);
      this.globaldata.countries = data;
      this.countries = this.dropdwonTransformService.transform(data, 'CountryName', 'CountryId', '-- Select --');
    }
  );
}
// ValidateEmail(event:any){
//   var regex= ^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$
//   if(!regex.test(event.target.value))
//   this.newEmployeeForm.controls['primaryemail'].setValidators
// }
getStateList() {
this.dropdownDataService.getStatesList().subscribe(
  data => {
    // console.log(data);
    this.globaldata.states = data;
    this.states = this.dropdwonTransformService.transform(data.filter(x => x.CountryID === this.newEmployeeForm.value.country),
    'StateName', 'StateId', '-- Select --');
  }
);
}

getCityList() {
  this.dropdownDataService.getCitiesList().subscribe(
    data => {
      // console.log(data);
      this.globaldata.cities = data;
      this.cities = this.dropdwonTransformService.transform(data.filter(x => x.StateId === this.newEmployeeForm.value.state),
      'CityName', 'CityId', '-- Select --');
    }
  );
}
GetFLClist(){
  this.dropdownDataService.GetFLClist().subscribe(data=>{
    if(data != 'No Data Found'){
      this.flclist=this.dropdwonTransformService.transform(data,'FLCName','FLCId','--Select--');
    }
   else{
    this.flclist = [];
   }
  },
  error => { console.log(error);
    this.loaderService.display(false); },
  () => console.log('Get all FLClist complete'));
}
GetOtherSourceList(){
  this.dropdownDataService.GetAllosListByClient().subscribe(data=>{
    if(data != 'No Data Found'){
      this.othersourceList=this.dropdwonTransformService.transform(data,'OSName','OSId','--Select--');
    }
   else{
    this.othersourceList = [];
   }
  },
  error => { console.log(error);
    this.loaderService.display(false); },
  () => console.log('Get all othersource complete'));
}
OnUserRoleSave(RoleId: any) {
this.getAllRoles();
const userrole = this.newEmployeeForm.controls['userrole'];
userrole.patchValue(RoleId);
}

getStatesOnCountryChange() {
  this.newEmployeeForm.value.state = null;
  this.getStateList();
}

getCityOnStateChange() {
  this.newEmployeeForm.value.city = null;
  this.getCityList();
}

  showUserRolePopup() {
    this.newUserInfo.role = null;
    this.newUserInfo.ShowAddUserRolePopup = true;
  }

  public  togglepw(){
    if(!this.passwordShown){
      this.passwordShown = true;
      this.passwordType = 'password';
      this.showeye = false
      this.hideeye = true;
    }
    else{
      this.passwordShown = false;
      this.passwordType = 'text';
      this.showeye = true
      this.hideeye = false;
    }
    }

    NavigateToSkillsPage(){
      this.appCommonService.skillFormDetail = this.newEmployeeForm;
      this.appCommonService.employeePageBackLink = true;
      this.router.navigate(['../home/skills']);
    }
    showSkills(event: any){
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
