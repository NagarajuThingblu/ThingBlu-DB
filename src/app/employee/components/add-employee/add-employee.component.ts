import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpMethodsService } from './../../../shared/services/http-methods.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { GlobalResources } from '../../../global resource/global.resource';

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
    model = new AddEmp(null, null, null, null);
    @ViewChild('addEmpForm') addEmpForm: FormGroup;
    public msgs: Message[] = [];
    public globalResource: any;
    public cookie_clientId: number;

    constructor(
      private loaderService: LoaderService,
      private httpMethodsService: HttpMethodsService,
      private appCommonService: AppCommonService,
      private router: Router,
      private titleService: Title,
    ) { }

    ngOnInit() {
      this.globalResource = GlobalResources.getResources().en;
      this.titleService.setTitle('Add User');
      this.cookie_clientId = this.appCommonService.getUserProfile().ClientId;
      this.loaderService.display(false);
    }

    sendAddEmp() {
      if (this.addEmpForm.valid) {
        let addEmpApiDetails: any;
        addEmpApiDetails = {
                    HireDate: this.addEmpForm.value.hireDate || '',
                    PrimaryEmail: this.addEmpForm.value.email || '',
                    FirstName: this.addEmpForm.value.firstName || '',
                    LastName: this.addEmpForm.value.lastName || '',
                    ClientId: this.cookie_clientId,
                    VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
                    InviteToken: encodeURIComponent(this.addEmpForm.value.email) || ''
                };
        this.httpMethodsService.post('api/Employee/AddNewAzureUser', addEmpApiDetails)
        .subscribe((result: any) => {
          if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: 'Employee added successfully.' });
          }
        });
      } else {
        this.addEmpForm.controls['hireDate'].markAsDirty();
        this.addEmpForm.controls['email'].markAsDirty();
      }
    }
    backToList() {
      this.router.navigate(['/home/userlist']);
    }
  }
  class AddEmp {
    constructor(
      public hireDate: string,
      public email: string,
      public firstName: string,
      public lastName: string
    ) {  }

  }
