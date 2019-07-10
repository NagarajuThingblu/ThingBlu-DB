import { GlobalResources } from './../../../global resource/global.resource';
import { AppConstants } from './../../../shared/models/app.constants';
import { MsalService } from './../../../azureb2c/msal.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { DropdwonTransformService } from './../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from './../../../shared/services/dropdown-values.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpMethodsService } from './../../../shared/services/http-methods.service';
import { HttpParams } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, Message } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { UserModel } from '../../../shared/models/user.model';
import { ReturnStatement } from '@angular/compiler';

@Component({
  moduleId: module.id,
  selector: 'app-employees',
  templateUrl: 'employees.component.html',
})
export class EmployeesComponent implements OnInit {
  public newCannabisStrainForm: FormGroup;
  public employeeList: any;
  public UserRoleList: any;
  public viewEmployeeEvent: any;
  public defaultPageSize: number;
  public getPageConstants: any;
  paginationValues: any;
  public chkStatusBox: any;
  public rowcheckboxcheckdisplay = false;
  public filterInActiveData: any = false;

  public msgs: Message[] = [];
  public globalResource: any;
  public cookie_clientId: number;
  public defaultDate: Date;
  public _cookieService: UserModel;
  public cookie_virtualRoleId: any;

  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private fb: FormBuilder,
    private titleService: Title,
    private msalService: MsalService,
    private httpMethodsService: HttpMethodsService,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,


    private cookieService: CookieService,
    private confirmationService: ConfirmationService,
    private appComponentData: AppComponent,
    private scrolltopservice: ScrollTopService,
  ) {
  }

  ngOnInit() {
    this.loaderService.display(true);
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle('User List');
    this.defaultPageSize = this.appCommonService.getDefaultPageSize();
    this.getPageConstants = AppConstants.getPageConstants;
    this.cookie_virtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    this.getEmployeeList(false);
    this.getAllRoles();
  }

  addNewEmployee() {
    this.router.navigate(['/home/adduser']);
  }

  getEmployeeList(flag) {
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    params = params.append('ShowAll', flag);

    this.httpMethodsService.get('api/Employee/GetAzureUserList', { params: params })
      .subscribe(
        (data: any) => {
          this.employeeList = data;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.employeeList.length > AppConstants.maxPageValue) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.employeeList.length;
          }
          if (this.employeeList) {
            if (this.employeeList.filter(r => r.IsActive === false).length > 0) {
              // this.chkStatusBox = 0;
            } else {
              // this.chkStatusBox = true;
            }
          }
         // console.log(this.employeeList);
        });
  }

  getAllRoles() {
    this.loaderService.display(true);
    this.dropdownDataService.getRoleList().subscribe(
      data => {
        if (data !== 'No data found!') {
          this.UserRoleList = this.dropdwonTransformService.transform(data, 'RoleName', 'RoleId', '-- Select --');
        } else {
          this.UserRoleList = [];
        }
        this.loaderService.display(false);
      },
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get all roles complete'));
    this.loaderService.display(false);
  }
  onRowSelect(event) {
    if (!this.rowcheckboxcheckdisplay) {
      if (event.UserId > 0) {
        this.router.navigate(['../home/adduser/' + event.UserId]);
      }
    }
  }

  onPageChange(e) {
    this.viewEmployeeEvent = e;
  }

  filterData(dtStrainList, event) {
    if (event) {
      this.filterInActiveData = true;
      this.getEmployeeList(true);
    } else {
      this.filterInActiveData = false;
      this.getEmployeeList(false);
    }
    this.loaderService.display(false);
  }

  isActiveCheckboxListChange(event, rowIndex, rowData) {
    this.rowcheckboxcheckdisplay = true;
    // event.stopPropagation();
    let cofirmmsg = '';
    if (event) {
      cofirmmsg = 'Are you sure you want to activate this user?';
    } else {
      cofirmmsg = 'Are you sure you want to inactivate this user?';
    }

    let AzureUserDeleteActiveForApi;
    AzureUserDeleteActiveForApi = {
      AzureUserDeleteActive: {
        AzureUserId: rowData.AzureUserId || 0,
        UserId: rowData.UserId || '',
        VirtualRoleId: this.cookie_virtualRoleId || 0,
        IsActive: event,
        IsDeleted: 0
      }
    };

    this.confirmationService.confirm({
      key: 'draftdelete1',
      message: cofirmmsg,
      header: 'Application message',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.loaderService.display(true);
        this.httpMethodsService.post('api/Employee/AzureUserDeleteActive', AzureUserDeleteActiveForApi)
          .subscribe((result: any) => {
            if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs = [];
              this.msgs.push({
                severity: 'success', summary: this.globalResource.applicationmsg,
                detail: 'User updated successfully.'
              });
              this.loaderService.display(false);
              this.rowcheckboxcheckdisplay = false;
            } else if (String(result[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
              rowData.IsActive = !event;
              this.msgs = [];
              this.msgs.push({
                severity: 'error', summary: this.globalResource.applicationmsg,
                detail: 'Faiure.'
              });
              this.loaderService.display(false);
              this.rowcheckboxcheckdisplay = false;
            }
          },
            error => {
              rowData.IsActive = !event;
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              this.loaderService.display(false);
              this.rowcheckboxcheckdisplay = false;
            });
      },
      reject: () => {
        rowData.IsActive = !event;
      }
    });
  }
}
