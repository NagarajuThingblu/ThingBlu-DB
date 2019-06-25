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
  public submitlabel = 'Add Employee';

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
    private route: ActivatedRoute,
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.cookie_clientId = this.appCommonService.getUserProfile().ClientId;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    this.loaderService.display(false);
    this.getAllRoles();

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
      'cellPhone': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(15)])),
      'emailId': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
      'userName': new FormControl(null, Validators.compose([Validators.required])),
      'hireDate': new FormControl(this.defaultDate, Validators.compose([Validators.required])),
      'userRole': new FormControl(null, Validators.compose([Validators.required])),
      'hourlyRate': new FormControl(null, Validators.compose([Validators.required])),
    });

    if (!this.isUpdateMode) {
      this.titleService.setTitle('Add Employee');
      this.submitlabel = 'Add Employee';
    } else {
      this.titleService.setTitle('Update Employee');
      this.submitlabel = 'Update Employee';
      this.getAzureUserDetailsById();
    }


  }

  addUserForm() {
    this.addEmpForm = this.fb.group({
      'azureUserId': new FormControl(this.userDetails[0].AzureUserId),
      'userId': new FormControl(this.userDetails[0].UserId),
      'firstName': new FormControl(this.userDetails[0].FirstName, Validators.compose([Validators.required])),
      'lastName': new FormControl(this.userDetails[0].LastName, Validators.compose([Validators.required])),
      'gender': new FormControl(this.userDetails[0].Gender , Validators.compose([Validators.required])),
      'birthDate': new FormControl(this.userDetails[0].DOB),
      'cellPhone': new FormControl(this.userDetails[0].CellPhone, Validators.compose([Validators.required, Validators.maxLength(15)])),
      'emailId': new FormControl(this.userDetails[0].PrimaryEmail, Validators.compose([Validators.required, Validators.maxLength(150)])),
      'userName': new FormControl(this.userDetails[0].Username, Validators.compose([Validators.required])),
      'hireDate': new FormControl(this.userDetails[0].HireDate, Validators.compose([Validators.required])),
      'userRole': new FormControl(this.userDetails[0].RoleId, Validators.compose([Validators.required])),
      'hourlyRate': new FormControl(this.userDetails[0].HourlyRate, Validators.compose([Validators.required])),
    });
  }

  getAllRoles() {
    this.dropdownDataService.getRoleList().subscribe(
      data => {
        this.userRoles = data;
        this.userRoles = this.dropdwonTransformService.transform(data, 'RoleName', 'RoleId', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get all roles complete'));
  }

  getAzureUserDetailsById() {
    let params = new HttpParams();
    params = params.append('UserId', String(this.navUserId));

    this.httpMethodsService.get('api/Employee/GetAzureUserDetailsById', { params: params })
      .subscribe(
        (data: any) => {
          this.userDetails = data;
          if ( this.userDetails) {
            this.addUserForm();
          }

          console.log( this.userDetails );
        });
  }

  onSubmit() {
    if (this.isUpdateMode) {
      this.onUpdateSubmit();
    } else {
      this.onAddSubmit();
    }
  }
  onAddSubmit() {
    let employeeForApi;
    if (this.addEmpForm.valid) {
      employeeForApi = {
        addEmpApiDetails: {
          FirstName: this.addEmpForm.value.firstName || '',
          LastName: this.addEmpForm.value.lastName || '',
          Gender: this.addEmpForm.value.gender,
          CellPhone: this.addEmpForm.value.cellPhone,
          PrimaryEmail: this.addEmpForm.value.emailId || '',
          UserName: this.addEmpForm.value.userName,
          DOB:   this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.birthDate).toLocaleDateString()) ,
          HireDate:  this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.hireDate).toLocaleDateString()) ,
          UserRoleId: this.addEmpForm.value.userRole || '',
          HourlyLabourRate: this.addEmpForm.value.hourlyRate || '',
          VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
          ClientId: this.cookie_clientId,
          InviteToken: encodeURIComponent(this.addEmpForm.value.email) || ''
        }
      };

      this.confirmationService.confirm({
        key: 'draftdelete',
        message: 'Are you sure you want create new Employee?',
        header: this.globalResource.applicationmsg,
        icon: 'fa fa-trash',
        accept: () => {
          this.loaderService.display(true);
          this.httpMethodsService.post('api/Employee/AddNewAzureUser', employeeForApi)
            .subscribe((result: any) => {
              if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: 'Employee added successfully.'
                });
                this.resetForm();
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'error', summary: this.globalResource.applicationmsg,
                  detail: 'Faiure.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'BADREQUEST') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'error', summary: this.globalResource.applicationmsg,
                  detail: 'Server side error.'
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

  onUpdateSubmit() {
    let employeeForApi;
    if (this.addEmpForm.valid) {
      employeeForApi = {
        updateEmpApiDetails: {
          AzureUserId : this.addEmpForm.value.azureUserId || '',
          UserId : this.addEmpForm.value.userId || '',
          FirstName: this.addEmpForm.value.firstName || '',
          LastName: this.addEmpForm.value.lastName || '',
          Gender: this.addEmpForm.value.gender,
          CellPhone: this.addEmpForm.value.cellPhone,
          PrimaryEmail: this.addEmpForm.value.emailId || '',
          DOB:   this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.birthDate).toLocaleDateString()) ,
          HireDate:  this.appCommonService.replaceStringChars(new Date(this.addEmpForm.value.hireDate).toLocaleDateString()) ,
          UserRoleId: this.addEmpForm.value.userRole || '',
          HourlyLabourRate: this.addEmpForm.value.hourlyRate || '',
          VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
        }
      };

      this.confirmationService.confirm({
        key: 'draftdelete',
        message: 'Are you sure you want update Employee?',
        header: this.globalResource.applicationmsg,
        icon: 'fa fa-trash',
        accept: () => {
          this.loaderService.display(true);
          this.httpMethodsService.post('api/Employee/updateAzureUser', employeeForApi)
            .subscribe((result: any) => {
              if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: 'Employee updated successfully.'
                });
                this.resetForm();
                this.loaderService.display(false);
                this.router.navigate(['/home/userlist']);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'error', summary: this.globalResource.applicationmsg,
                  detail: 'Faiure.'
                });
                this.loaderService.display(false);
              } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'BADREQUEST') {
                this.msgs = [];
                this.msgs.push({
                  severity: 'error', summary: this.globalResource.applicationmsg,
                  detail: 'Server side error.'
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
                  detail: 'Email Id already registed.'
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
    console.log(this.msalService.getAllUsers());
    // this.resetForm();
  }

  resetForm() {
    this.addEmpForm.reset();
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
  }
}
