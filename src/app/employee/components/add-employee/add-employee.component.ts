import { MsalService } from './../../../azureb2c/msal.service';
import { UserModel } from './../../../shared/models/user.model';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpMethodsService } from './../../../shared/services/http-methods.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Message, ConfirmationService } from 'primeng/api';
import { GlobalResources } from '../../../global resource/global.resource';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { GrowerDetailsActionService } from '../../../task/services/grower-details-action.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { HttpParams } from '@angular/common/http';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-add-employee',
  templateUrl: 'add-employee.component.html',
  styles: [`
    .list-inline>li {
      display: inline-block;
      margin-right: 10px;
    }
  `]
})
export class AddEmployeeComponent implements OnInit {
  addEmpForm: FormGroup;
  // model = new AddEmp(null, null, null, null, null, null, null, null, null, null);
  // @ViewChild('addEmpForm') addEmpForm: FormGroup;
  public msgs: Message[] = [];
  public globalResource: any;
  public cookie_clientId: number;
  public defaultDate: Date;
  public _cookieService: UserModel;
  public userRoles: any;
  public genders: any;
  public userData: any;
  public empId: number;
  public isUpdateMode = false;
  public userDetails: any;
  public navUserId: any;
  public submitlabel = 'Add User';
  blockSpace: RegExp = /[^\s]/;
  public PhoneNoName = 'Phone No';
  public EmailIdlbName = 'Email Id';
  public Managerlist:any;
  public flclist:any;
  public selectedRole:any;
  public constantusrRole:any;

  constructor(
    private loaderService: LoaderService,
    private httpMethodsService: HttpMethodsService,
    private appCommonService: AppCommonService,
    private titleService: Title,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private dropdwonTransformService: DropdwonTransformService,
    private fb: FormBuilder,
    private growerDetailsActionService: GrowerDetailsActionService, // for saving form details service
    private cookieService: CookieService,
    private confirmationService: ConfirmationService,
    private appComponentData: AppComponent,
    private scrolltopservice: ScrollTopService,
    private msalService: MsalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  ngOnInit() {
    this.loaderService.display(true);
    this.globalResource = GlobalResources.getResources().en;
    this.cookie_clientId = this.appCommonService.getUserProfile().ClientId;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    this.getAllRoles();
    this.GetManagerlist();
    this.GetFLClist();
    this.constantusrRole=  AppConstants.getUserRoles;

    this.genders = [
      { label: '-- Select --', value: null },
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    ];

    if (this.route.snapshot.params) {
      this.navUserId = this.route.snapshot.params.UserId;
      if (this.navUserId > 0) {
        this.isUpdateMode = true;
      }
    }

    this.addEmpForm = this.fb.group({
      'azureUserId': new FormControl(null),
      'UserId': new FormControl(null),
      'firstName': new FormControl(null, Validators.compose([Validators.required])),
      'lastName': new FormControl(null, Validators.compose([Validators.required])),
      'gender': new FormControl(null, Validators.compose([Validators.required])),
      'birthDate': new FormControl(null),
      'cellPhone': new FormControl(null, Validators.compose([Validators.required])),
      'emailId': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
      'userName': new FormControl(null, Validators.compose([Validators.required])),
      'hireDate': new FormControl(this.defaultDate),
      'userRole': new FormControl(null, Validators.compose([Validators.required])),
      'hourlyRate': new FormControl(null, Validators.compose([Validators.required])),
      'Managerlist': new FormControl(null),
      'flclist':new FormControl(null),
    });

    if (!this.isUpdateMode) {
      this.titleService.setTitle('Add User');
      this.submitlabel = 'Add User';
      this.PhoneNoName = 'Phone No';
      this.EmailIdlbName = 'Email Id';
      this.loaderService.display(false);
    } else {
      this.titleService.setTitle('Update User');
      this.submitlabel = 'Update User';
      this.EmailIdlbName = 'Email Address';
      this.PhoneNoName = 'Phone Number';
      this.getAzureUserDetailsById();
    }


  }

  addUserForm() {
    this.addEmpForm = this.fb.group({
      'azureUserId': new FormControl(this.userDetails[0].AzureUserId),
      'userId': new FormControl(this.userDetails[0].UserId),
      'firstName': new FormControl(this.userDetails[0].FirstName, Validators.compose([Validators.required])),
      'lastName': new FormControl(this.userDetails[0].LastName, Validators.compose([Validators.required])),
      'gender': new FormControl(this.userDetails[0].Gender, Validators.compose([Validators.required])),
      'birthDate': new FormControl(this.userDetails[0].DOB),
      'cellPhone': new FormControl(this.userDetails[0].CellPhone, Validators.compose([Validators.required])),
      'emailId': new FormControl(this.userDetails[0].PrimaryEmail, Validators.compose([Validators.required, Validators.maxLength(150)])),
      'userName': new FormControl(this.userDetails[0].Username, Validators.compose([Validators.required])),
      'hireDate': new FormControl(this.userDetails[0].HireDate),
      'userRole': new FormControl(this.userDetails[0].RoleId, Validators.compose([Validators.required])),
      'hourlyRate': new FormControl(this.userDetails[0].HourlyRate, Validators.compose([Validators.required])),
      'Managerlist': new FormControl(this.userDetails[0].ManagerId),
      'flclist': new FormControl(this.userDetails[0].FLCId),
      
    });
    const managerdata = this.addEmpForm.get('Managerlist');
    const flcdata =this.addEmpForm.get('flclist');
if( this.addEmpForm.get('userRole').value == 10 || this.addEmpForm.get('userRole').value == 14 )
{
  if(this.addEmpForm.get('userRole').value == 10){
    this.selectedRole ='Employee'
  }
  else{
    this.selectedRole ='Temp'
  }
 
managerdata.setValidators(Validators.required);
flcdata.setValidators(Validators.required);
}
  }

  getAllRoles() {
    this.dropdownDataService.getRoleList().subscribe(
      data => {
        this.userRoles = data;
        this.userRoles = this.dropdwonTransformService.transform(data, 'RoleName', 'RoleId', '-- Select --');
      },
      error => { console.log(error);
        this.loaderService.display(false); },
      () => console.log('Get all roles complete'));
  }

  getAzureUserDetailsById() {
    let params = new HttpParams();
    params = params.append('UserId', String(this.navUserId));

    this.httpMethodsService.get('api/Employee/GetAzureUserDetailsById', { params: params })
      .subscribe(
        (data: any) => {
          this.userDetails = data;
          if (this.userDetails) {
            this.addUserForm();
            this.loaderService.display(false);
          }
        });
  }

  onSubmit(model) {
    if (this.isUpdateMode) {
      this.onUpdateSubmit();
    } else {
      this.onAddSubmit();
    }
  }
  onAddSubmit() {
    let employeeForApi;
    if (this.addEmpForm.value.cellPhone) {
      if (this.addEmpForm.value.cellPhone.replace(/\D+/g, '').length !== 10) {
        this.addEmpForm.controls['cellPhone'].reset();
      }
    }
   if (this.addEmpForm.valid) {
      employeeForApi = {
        addEmpApiDetails: {
          AzureUserId:null,
          FirstName: this.addEmpForm.value.firstName || '',
          LastName: this.addEmpForm.value.lastName || '',
          Gender: this.addEmpForm.value.gender,
         // CellPhone: this.addEmpForm.value.cellPhone,
          CellPhone: this.addEmpForm.value.cellPhone ? this.addEmpForm.value.cellPhone.replace(/\D+/g, '') : null,
          PrimaryEmail: this.addEmpForm.value.emailId || '',
          UserName: this.addEmpForm.value.userName,
          // tslint:disable-next-line:max-line-length
          DOB: this.addEmpForm.value.birthDate ? this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.birthDate).toLocaleDateString()) : null,
          // tslint:disable-next-line:max-line-length
          HireDate: this.addEmpForm.value.hireDate ? this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.hireDate).toLocaleDateString()) : null,
          UserRoleId: this.addEmpForm.value.userRole || '',
          HourlyLabourRate: this.addEmpForm.value.hourlyRate || 0,
          VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
          ClientId: this.cookie_clientId,
          // InviteToken: encodeURIComponent(this.addEmpForm.value.emailId) || '',
          ManagerId:this.addEmpForm.value.Managerlist,
          FLCId:this.addEmpForm.value.flclist,
        }
      };

      this.confirmationService.confirm({
        key: 'draftdelete',
        message: 'Are you sure you want create new user?',
        header: this.globalResource.applicationmsg,
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.loaderService.display(true);
          this.httpMethodsService.post('api/Employee/AddNewAzureUser', employeeForApi)
            .subscribe((result: any) => {
                // console.log(result);
                // this.msgs = []; 
              if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: 'An account creation email has been sent to: ' + this.addEmpForm.value.emailId
                });
                this.resetForm();
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'error', summary: this.globalResource.applicationmsg,
                  detail: 'Failure.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'BADREQUEST') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail:  String(result[0].ResultMessage)
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'USERNAMEEXISTS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Username already used.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'EMAILADDRESSEXISTS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Email Id already registered.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'ACCOUNTEXISTS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Account already exists.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'EMAILREGISTERED') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Email Id already registered.'
                });
                this.loaderService.display(false);
              }
            },
              error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
                this.loaderService.display(false);
              });
        },
        reject: () => {
        }
      });
    } else {
      this.appCommonService.validateAllFields(this.addEmpForm);
      this.loaderService.display(false);
    }
  }
  // onAddSubmit(){
  //   let employeeForApi;
  //   if (this.addEmpForm.value.cellPhone) {
  //     if (this.addEmpForm.value.cellPhone.replace(/\D+/g, '').length !== 10) {
  //           this.addEmpForm.controls['cellPhone'].reset();
  //         }
  //   }

  //   if (this.addEmpForm.valid) {
  //     employeeForApi = {
  //             addEmpApiDetails: {
  //               FirstName: this.addEmpForm.value.firstName || '',
  //               LastName: this.addEmpForm.value.lastName || '',
  //               Gender: this.addEmpForm.value.gender,
  //              // CellPhone: this.addEmpForm.value.cellPhone,
  //               CellPhone: this.addEmpForm.value.cellPhone ? this.addEmpForm.value.cellPhone.replace(/\D+/g, '') : null,
  //               PrimaryEmail: this.addEmpForm.value.emailId || '',
  //               UserName: this.addEmpForm.value.userName,
  //               // tslint:disable-next-line:max-line-length
  //               DOB: this.addEmpForm.value.birthDate ? this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.birthDate).toLocaleDateString()) : null,
  //               // tslint:disable-next-line:max-line-length
  //               HireDate: this.addEmpForm.value.hireDate ? this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.hireDate).toLocaleDateString()) : null,
  //               UserRoleId: this.addEmpForm.value.userRole || '',
  //               HourlyLabourRate: this.addEmpForm.value.hourlyRate || 0,
  //               VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
  //               ClientId: this.cookie_clientId,
  //               InviteToken: encodeURIComponent(this.addEmpForm.value.email) || '',
  //               ManagerId:this.addEmpForm.value.Managerlist,
  //               FLCId:this.addEmpForm.value.flclist,
  //             }
  //           };
  //           this.confirmationService.confirm({
  //             key: 'draftdelete',
  //              message: 'Are you sure you want create new user?',
  //               header: this.globalResource.applicationmsg,
  //               icon: 'fa fa-exclamation-triangle',
  //               accept: () => {
  //                 this.loaderService.display(true);
  //                 this.growerDetailsActionService.addNewUser(employeeForApi)
  //                 .subscribe(
  //                   data => {
  //                     this.msgs = [];
  //                     if (data[0]. RESULTKEY === 'SUCCESS') {
  //                       this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg,
  //                       detail: 'An account creation email has been sent to: ' + this.addEmpForm.value.emailId});
                      
  //                     }
  //                   }
  //                 )
  //               }
  //           })
  //   }
  // }

  onUpdateSubmit() {
    let employeeForApi;

    if (this.addEmpForm.value.cellPhone) {
      if (this.addEmpForm.value.cellPhone.replace(/\D+/g, '').length !== 10) {
        this.addEmpForm.controls['cellPhone'].reset();
      }
    }

    if (this.addEmpForm.valid) {
      employeeForApi = {
        updateEmpApiDetails: {
          AzureUserId: this.addEmpForm.value.azureUserId || this.userDetails[0].AzureUserId,
          UserId: this.addEmpForm.value.userId || '',
          FirstName: this.addEmpForm.value.firstName || '',
          LastName: this.addEmpForm.value.lastName || '',
          Gender: this.addEmpForm.value.gender,
          // CellPhone: this.addEmpForm.value.cellPhone,
          CellPhone: this.addEmpForm.value.cellPhone ? this.addEmpForm.value.cellPhone.replace(/\D+/g, '') : null,
          UserName: this.addEmpForm.value.userName,
          PrimaryEmail: this.addEmpForm.value.emailId || '',
          // tslint:disable-next-line:max-line-length
          DOB: this.addEmpForm.value.birthDate ? this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.birthDate).toLocaleDateString()) : null,
          // tslint:disable-next-line:max-line-length
          HireDate: this.addEmpForm.value.hireDate ? this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.hireDate).toLocaleDateString()) : null,
          UserRoleId: this.addEmpForm.value.userRole || '',
          HourlyLabourRate: this.addEmpForm.value.hourlyRate || 0,
          VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
          ManagerId:this.addEmpForm.value.Managerlist
        }
      };

      this.confirmationService.confirm({
        key: 'draftdelete',
        message: 'Are you sure you want update user?',
        header: this.globalResource.applicationmsg,
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.loaderService.display(true);
          this.httpMethodsService.post('api/Employee/updateAzureUser', employeeForApi)
            .subscribe((result: any) => {
              if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: 'User updated successfully.'
                });
                this.resetForm();
                this.loaderService.display(false);
                setTimeout(() => {
                this.router.navigate(['/home/userlist']);
              }, 500);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'error', summary: this.globalResource.applicationmsg,
                  detail: 'Failure.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'BADREQUEST') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail:  String(result[0].ResultMessage)
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'USERNAMEEXISTS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Username already used'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'EMAILADDRESSEXISTS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Email Id already registered.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'ACCOUNTEXISTS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Account already exists.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'EMAILREGISTERED') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: 'Email already registered.'
                });
                this.loaderService.display(false);
              }
            },
              error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
                this.loaderService.display(false);
              });
        },
        reject: () => {
        }
      });
    } else {
      this.appCommonService.validateAllFields(this.addEmpForm);
      this.loaderService.display(false);
    }
  }
  backToList() {
    this.router.navigate(['/home/userlist']);
  }
  onCancel() {
    if (this.isUpdateMode) {
this.backToList();
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    // this.addEmpForm.reset();
    this.addEmpForm = this.fb.group({
      'azureUserId': new FormControl(null),
      'UserId': new FormControl(null),
      'firstName': new FormControl(null, Validators.compose([Validators.required])),
      'lastName': new FormControl(null, Validators.compose([Validators.required])),
      'gender': new FormControl(null, Validators.compose([Validators.required])),
      'birthDate': new FormControl(null),
      'cellPhone': new FormControl(null, Validators.compose([Validators.required])),
      'emailId': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
      'userName': new FormControl(null, Validators.compose([Validators.required])),
      'hireDate': new FormControl(this.defaultDate),
      'userRole': new FormControl(null, Validators.compose([Validators.required])),
      'hourlyRate': new FormControl(null, Validators.compose([Validators.required])),
      'Managerlist': new FormControl(null),
      'flclist':new FormControl(null),
      
    });
  }

  omit_special_char(event) {
   let k;
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57) || (k === 95) || (k === 35));
}

reSendUserDetails() {

  // this.confirmationService.confirm({
  //   key: 'draftdelete',
  //   message: 'This action will send a password reset to: ' + this.addEmpForm.value.emailId  + '. Continue?',
  //   header: this.globalResource.applicationmsg,
  //   icon: 'fa fa-exclamation-triangle',
  //   accept: () => {
  //   },
  //   reject: () => {
  //   }
  // });
}

onResetPassword() {
  let employeeForApi;


  if (this.addEmpForm.controls['emailId'].valid) {
    employeeForApi = {
      updateEmpApiDetails: {
        AzureUserId: this.addEmpForm.value.azureUserId || this.userDetails[0].AzureUserId,
        UserId: this.addEmpForm.value.userId || '',
        UserName: this.addEmpForm.value.userName,
        PrimaryEmail: this.addEmpForm.value.emailId || '',
        VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
      }
    };

    this.confirmationService.confirm({
      key: 'draftdelete',
      message: 'This action will send a password reset to: ' + this.addEmpForm.value.emailId  + '. Continue?',
      header: this.globalResource.applicationmsg,
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.loaderService.display(true);
        this.httpMethodsService.post('api/Employee/ReserAzureUserPassword', employeeForApi)
          .subscribe((result: any) => {
            if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs = [];
              this.msgs.push({
                severity: 'success', summary: this.globalResource.applicationmsg,
                detail: 'Reset Password sent successfully.'
              });
            } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
              this.msgs = [];
              this.msgs.push({
                severity: 'error', summary: this.globalResource.applicationmsg,
                detail: 'Failure.'
              });
              this.loaderService.display(false);
            } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'BADREQUEST') {
              this.msgs = [];
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail:  String(result[0].ResultMessage)
              });
              this.loaderService.display(false);
            }  else if (String(result[0].ResultKey).toLocaleUpperCase() === 'EMAILADDRESSNOTEXISTS') {
              this.msgs = [];
              this.msgs.push({
                severity: 'warn', summary: 'Email address not matching with this account.',
                detail:  String(result[0].ResultMessage)
              });
              this.loaderService.display(false);
            }
          },
            error => {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              this.loaderService.display(false);
            });
      },
      reject: () => {
      }
    });
  } else {
    this.appCommonService.validateAllFields(this.addEmpForm);
    this.loaderService.display(false);
  }
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

GetFLClist(){
  this.dropdownDataService.GetFLClist().subscribe(data=>{
    this.flclist=this.dropdwonTransformService.transform(data,'FLCName','FLCId','--Select--');
  },
  error => { console.log(error);
    this.loaderService.display(false); },
  () => console.log('Get all FLClist complete'));
}

Managerdrpdwnchng(event)
{
const selectedRole=this.userRoles.filter(ur=>ur.value==event.value);
this.selectedRole=selectedRole[0].label;
const managerdata = this.addEmpForm.get('Managerlist');
if(this.constantusrRole.Employee==this.selectedRole ||this.constantusrRole.Temp==this.selectedRole)
{

managerdata.setValidators(Validators.required);

}
else{
managerdata.clearValidators();
}
managerdata.updateValueAndValidity();
}
}
