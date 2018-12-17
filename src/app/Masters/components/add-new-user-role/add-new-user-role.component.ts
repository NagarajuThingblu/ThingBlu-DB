import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { NewRoleActionService } from '../../../task/services/new-role.service';

@Component({
  selector: 'app-add-new-user-role',
  templateUrl: './add-new-user-role.component.html',
  styleUrls: ['./add-new-user-role.component.css']
})
export class AddNewUserRoleComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('NewUser') NewUser: any;
  @ViewChild('UserRoleForm') UserRoleForm;
  @Output() UserRoleSaved: EventEmitter<any> = new EventEmitter<any>();

  newUserRoleForm: FormGroup;

  public newRoleResources: any;
  public globalResource: any;
  chkIsActive: boolean;
  public _cookieService: any;
  public newBrandForm_copy: any;
    // all form fiels model object


    newUserDetails = {
      role: null,
      description: null,
      chkIsActive: 1
    };

    roles: any[];
    public msgs: any[];

    submitted: boolean;
  addNewSubBrandComponent: any;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    // tslint:disable-next-line:no-shadowed-variable
    private newRoleActionService: NewRoleActionService, // for saving form details service
    private appCommonService: AppCommonService
  ) {
  }


  resetForm() {
    this.newUserRoleForm.reset({ chkIsActive: true });
    this.newUserDetails = {
      role: null,
      description: null,
      chkIsActive: 1
    };
  }

    saveRoleNames(formModel) {
      if (String(this.newUserRoleForm.value.role).trim().length === 0) {
        this.newUserRoleForm.controls['role'].setErrors({'whitespace': true});
        return;
      }
      const roleDetailsForApi = {
        Role: {
          RoleName: this.appCommonService.trimString(formModel.value.role),
          Description: this.appCommonService.trimString(formModel.value.description),
          IsActive: this.newUserRoleForm.value.chkIsActive ? 1 : 0,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          ClientId: Number(this._cookieService.ClientId),
        }
      };
      console.log(roleDetailsForApi);
      if (formModel.valid) {
         // http call starts
         this.loaderService.display(true);
        this.newRoleActionService.addNewRole(roleDetailsForApi)
        .subscribe(
            data => {
              console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.newRoleResources.newuserrolesavedsuccess });
                console.log(data[0]['RoleId']);
                this.getRoleOnSave(data[0]['RoleId']);
                this.resetForm();
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (data === 'Duplicate') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newRoleResources.useralreadyexist });
              } else {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
                // http call end
                this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              // http call end
              this.resetForm();
              this.loaderService.display(false);
            });
      } else {
        this.appCommonService.validateAllFields(this.newUserRoleForm);
      }
    }

    getRoleOnSave(RoleId) {
      this.UserRoleSaved.emit(RoleId);
      this.NewUser.ShowAddUserRolePopup = false;
    }
    hideRolePopup() {
      this.resetForm();
      this.NewUser.ShowAddUserRolePopup = false;
    }

  ngOnInit() {
    this.chkIsActive = true;
    this.newRoleResources = MastersResource.getResources().en.addnewrole;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();

  // New NewUser form defination(reactive form)
  this.newUserRoleForm = this.fb.group({
    'role': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    'description': new FormControl(null, [Validators.minLength(0), Validators.maxLength(500)]),
    'chkIsActive': new FormControl(null)
  });
  }

  saveUserRole(formModel) {

  }
}
