import { HttpMethodsService } from './../../../shared/services/http-methods.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { GlobalResources } from '../../../global resource/global.resource';

@Component({
  moduleId: module.id,
  selector: 'app-invite-new-employee',
  templateUrl: 'invite-new-employee.component.html',
  styles: [`
    .list-inline>li {
      display: inline-block;
      margin-right: 10px;
    }
  `]
})
export class InviteNewEmployeeComponent implements OnInit {

  model = new InviteEmp(null, null, null, null);
  @ViewChild('inviteForm') inviteForm: FormGroup;

  public msgs: Message[] = [];
  public globalResource: any;

  constructor(
    private loaderService: LoaderService,
    private httpMethodsService: HttpMethodsService,
    private appCommonService: AppCommonService
  ) { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
  }

  sendInvite() {
    if (this.inviteForm.valid) {
      let inviteApiDetails: any;
      inviteApiDetails = {
                  HireDate: this.inviteForm.value.hireDate || '',
                  PrimaryEmail: this.inviteForm.value.email || '',
                  FirstName: this.inviteForm.value.firstName || '',
                  LastName: this.inviteForm.value.lastName || '',
                  VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
                  InviteToken: encodeURIComponent(this.inviteForm.value.email) || ''
              };
      this.httpMethodsService.post('api/Employee/SendInvite', inviteApiDetails)
      .subscribe((result: any) => {
        if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: 'Invitation Sent Successfully.' });
        }
      });
    } else {
      this.inviteForm.controls['hireDate'].markAsDirty();
      this.inviteForm.controls['email'].markAsDirty();
    }
  }

}

class InviteEmp {
  constructor(
    public hireDate: string,
    public email: string,
    public firstName: string,
    public lastName: string
  ) {  }

}
