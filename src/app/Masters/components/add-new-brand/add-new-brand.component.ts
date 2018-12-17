import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NewBrandActionService } from '../../../task/services/new-brand.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-new-brand',
  templateUrl: './add-new-brand.component.html'
})
export class AddNewBrandComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('Brand') Brand: any;
  @ViewChild('BrandForm') BrandForm;
  @Output() BrandSaved: EventEmitter<any> = new EventEmitter<any>();

  newBrandEntryForm: FormGroup;
  chkIsActive: boolean;
  public newBrandResources: any;
  public globalResource: any;

  public _cookieService: any;
  // public newBrandForm_copy: any;   :: Unused
  // all form fiels model object
  newBrandDetails = {
    brand: null,
    description: null,
    chkIsActive: 1
  };

  public msgs: any[];

  submitted: boolean;
   // AddNewSubBrandComponent: any; :: Unused

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    // private cookieService: CookieService, :: Unused
    // tslint:disable-next-line:no-shadowed-variable
    private newBrandActionService: NewBrandActionService, // for saving form details service
    private appCommonService: AppCommonService
  ) {
  }

  ngOnInit() {
    this.chkIsActive = true;
    this.newBrandResources = MastersResource.getResources().en.addnewbrand;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();

    // New Brand form defination(reactive form)
    this.newBrandEntryForm = this.fb.group({
      'brand': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      'description': new FormControl(null, [Validators.minLength(0), Validators.maxLength(500)]),
      'chkIsActive': new FormControl(null)
    });
  }


  resetForm() {
    this.BrandForm.reset({ chkIsActive: true });
    this.newBrandDetails = {
      brand: null,
      description: null,
      chkIsActive: 1
    };

  }

  saveBrandNames(formModel) {
    if (String(this.newBrandEntryForm.value.brand).trim().length === 0) {
      this.newBrandEntryForm.controls['brand'].setErrors({ 'whitespace': true });
      return;
    }
    const brandDetailsForApi = {
      Brand: {
        BrandName: this.appCommonService.trimString(formModel.value.brand),
        Description: this.appCommonService.trimString(formModel.value.description),
        IsActive: this.newBrandEntryForm.value.chkIsActive ? 1 : 0,
        ClientId: this._cookieService.ClientId,
        VirtualRoleId: this._cookieService.VirtualRoleId
      }
    };
    // console.log(brandDetailsForApi);
    if (formModel.valid) {
      // http call starts
      this.loaderService.display(true);
      this.newBrandActionService.addNewBrand(brandDetailsForApi)
        .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (data[0]['Result'] === 'Success') {
              this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: this.newBrandResources.newbrandsavedsuccess });
              // console.log(data[0]['brandId']);
              this.getBrandOnSave(data[0]['brandId']);
              this.resetForm();
            } else if (data === 'Failure') {
              this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newBrandResources.brandalreadyexist });
            } else if (String(data).toLocaleUpperCase() === 'NOTINSERTED') {
              this.newBrandEntryForm.controls['brand'].setErrors({ 'brandnotpresent': true });
              this.loaderService.display(false);
            } else {
              this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
            }
            // http call end
            this.loaderService.display(false);
          },
          error => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            // http call end
            this.resetForm();
            this.loaderService.display(false);
          });
    } else {
      this.appCommonService.validateAllFields(this.newBrandEntryForm);
    }
  }

  hideBrandPopup() {
    this.resetForm();
    this.Brand.showBrandModal = false;
  }

  getBrandOnSave(BrandId) {
    this.BrandSaved.emit(BrandId);
    this.Brand.showBrandModal = false;
  }
}
