import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { NewPackageTypeActionService } from '../../../task/services/new-package-type-action.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';

@Component({
  selector: 'app-add-new-packagetype',
  templateUrl: './add-new-packagetype.component.html',
  styleUrls: ['./add-new-packagetype.component.css']
})
export class AddNewPackagetypeComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('PackageType') PackageType: any;
  @ViewChild('PackageTypeForm') PackageTypeForm;
  @Output() PackageTypeSaved: EventEmitter<any> = new EventEmitter<any>();

  newPackageTypeEntryForm: FormGroup;
  chkIsActive: boolean;
  public newPackageTypeResources: any;
  public globalResource: any;

  public _cookieService: any;
  public newPackageTypeForm_copy: any;
    // all form fiels model object
    newPackageTypeDetails = {
      packagetype: null,
      description: null,
      chkIsActive: 1
    };

    public msgs: any[];

    submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    // private cookieService: CookieService, :: unused
    // tslint:disable-next-line:no-shadowed-variable
    private newPackageTypeActionService: NewPackageTypeActionService, // for saving form details service
    private appCommonService: AppCommonService
  ) {
  }



  resetForm() {
    this.PackageTypeForm.reset({ chkIsActive: true });

    this.newPackageTypeDetails = {
      packagetype: null,
      description: null,
      chkIsActive: 1
    };
  }

    savePackageTypeNames(formModel) {
      if (String(this.newPackageTypeEntryForm.value.packagetype).trim().length === 0) {
        this.newPackageTypeEntryForm.controls['packagetype'].setErrors({'whitespace': true});
        return;
      }
      const packagetypeDetailsForApi = {
        PackagingTypes: {
          PkgTypeName: this.appCommonService.trimString( formModel.value.packagetype),
          Description: this.appCommonService.trimString(formModel.value.description),
          IsActive: this.newPackageTypeEntryForm.value.chkIsActive ? 1 : 0,
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: this._cookieService.VirtualRoleId
        }
      };
      // console.log(packagetypeDetailsForApi);
      if (formModel.valid) {
         // http call starts
         this.loaderService.display(true);
        this.newPackageTypeActionService.addNewPackageType(packagetypeDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg ,
                detail: this.newPackageTypeResources.newpackagetypesavedsuccess });

                // console.log(data[0]['PkgTypeId']);
                this.getPackageTypeOnSave(data[0]['PkgTypeId']);

                this.resetForm();
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (data === 'Duplicate') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newPackageTypeResources.packagetypealreadyexist });
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
        this.appCommonService.validateAllFields(this.newPackageTypeEntryForm);
      }
    }

    getPackageTypeOnSave(PkgTypeId) {
      this.PackageTypeSaved.emit(PkgTypeId);
      this.PackageType.showPackageTypeModal = false;
    }


    hidePackageTypePopup() {
      this.resetForm();
      this.PackageType.showPackageTypeModal = false;
    }

  ngOnInit() {
    this.newPackageTypeResources = MastersResource.getResources().en.addnewpackagetype;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();
    this.chkIsActive = true;

  // New PackageType form defination(reactive form)
  this.newPackageTypeEntryForm = this.fb.group({
    'packagetype': new FormControl(null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])),
    'description': new FormControl(null, Validators.compose([Validators.maxLength(500)])),
    'chkIsActive': new FormControl(null)
  });
  }
}
