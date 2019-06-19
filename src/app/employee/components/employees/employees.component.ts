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
public filterInActiveData: any  = false;

  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private fb: FormBuilder,
    private titleService: Title,
    private msalService: MsalService,
    private httpMethodsService: HttpMethodsService,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService
  ) {
   }

  ngOnInit() {
    this.loaderService.display(false);
    this.titleService.setTitle('User List');
    this.defaultPageSize  = this.appCommonService.getDefaultPageSize();
    this.getPageConstants = AppConstants.getPageConstants;
    this.getEmployeeList(false);
    this. getAllRoles();
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
          console.log(this.employeeList);
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
      },
      error => { console.log(error); },
      () => console.log('Get all roles complete'));
      this.loaderService.display(false);
  }
  onRowSelect(emp) {
    this.appCommonService.AzureEmpData = emp;
    this.router.navigate(['/home/updateemployee']);
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
}
