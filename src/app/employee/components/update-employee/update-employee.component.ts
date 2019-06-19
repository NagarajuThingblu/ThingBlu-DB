import { DropdwonTransformService } from './../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from './../../../shared/services/dropdown-values.service';
import { Router } from '@angular/router';
import { HttpMethodsService } from './../../../shared/services/http-methods.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { GlobalResources } from '../../../global resource/global.resource';

@Component({
  moduleId: module.id,
  selector: 'app-update-employee',
  templateUrl: 'update-employee.component.html',
  styles: [`
    .list-inline>li {
      display: inline-block;
      margin-right: 10px;
    }
  `]
})
export class UpdateEmployeeComponent implements OnInit {
  model = new UpdateEmployee(null, null, null, null, null, null, null, null, null);
  @ViewChild('updateEmpForm') updateEmpForm: FormGroup;
    public msgs: Message[] = [];
    public globalResource: any;
    public cookie_clientId: number;
    public userRoles: any;
    public genders: any;
    public userData: any;
    public empId: number;

    constructor(
      private loaderService: LoaderService,
      private httpMethodsService: HttpMethodsService,
      private appCommonService: AppCommonService,
      private router: Router,
      private dropdownDataService: DropdownValuesService, // For common used dropdown service
      private dropdwonTransformService: DropdwonTransformService,
    ) { }

    ngOnInit() {
      this.globalResource = GlobalResources.getResources().en;
      this.cookie_clientId = this.appCommonService.getUserProfile().ClientId;
      this.loaderService.display(false);
      this. getAllRoles();

      this.genders = [
        { label: '-- Select --', value: null },
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' }
      ];

      this.userData = this.appCommonService.AzureEmpData;
      this.empId = this.userData.EmpId;
      this.model = new UpdateEmployee(this.userData.FirstName, this.userData.MiddleName,
        this.userData.LastName , this.userData.Gender, null,  this.userData.HireDate,
        this.userData.RoleId, this.userData.HourlyRate, this.userData.PrimaryEmail );
    }

    getAllRoles() {
      this.dropdownDataService.getRoleList().subscribe(
        data => {
          this.userRoles = data;
          this.userRoles = this.dropdwonTransformService.transform(data, 'RoleName', 'RoleId', '-- Select --');
        } ,
        error => { console.log(error); },
        () => console.log('Get all roles complete'));
    }
    backToList() {
      this.router.navigate(['/home/addemployees']);
    }

    updateEmpInfo() {
      if (this.updateEmpForm.valid) {
        let updateUserApiDetails: any;
        updateUserApiDetails = {
                    EmpId: this.empId ,
                    FirstName: this.updateEmpForm.value.firstName || '',
                    MiddleName: this.updateEmpForm.value.middleName || '',
                    LastName: this.updateEmpForm.value.lastName || '',
                    Gender: this.updateEmpForm.value.gender || '',
                    DOB: this.updateEmpForm.value.birthDate || '',
                    PrimaryEmail: this.updateEmpForm.value.email || '',
                    HireDate: this.updateEmpForm.value.hireDate || '',
                    UserRole: this.updateEmpForm.value.userRole || '',
                    HourlyLabourRate: this.updateEmpForm.value.hourlyRate || '',
                    VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId
                };
        this.httpMethodsService.post('api/Employee/UpdateAzureUser', updateUserApiDetails)
        .subscribe((result: any) => {
          if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: 'User updated Successfully.' });
          }
        });
      }
    }
  }
    class UpdateEmployee {
      constructor(
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public gender: string,
        public birthDate: string,
        public hireDate: string,
        public userRole: any,
        public hourlyRate: any,
        public email: string,
      ) {  }
    }
