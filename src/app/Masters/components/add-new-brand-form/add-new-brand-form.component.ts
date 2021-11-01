import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, EventEmitter } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { ConfirmationService } from 'primeng/api';
import { NewBrandActionService } from '../../../task/services/new-brand.service';
import { NewBrandService } from '../../services/brand.service';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { Alert } from 'selenium-webdriver';
import { AppConstants } from '../../../shared/models/app.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-brand-form',
  templateUrl: './add-new-brand-form.component.html',
  styleUrls: ['./add-new-brand-form.component.css']
})
export class AddNewBrandFormComponent implements OnInit {
  @Input() NewEmployeeSave: EventEmitter<any> = new EventEmitter<any>();
  // public NewUserInfo: any = {
  //   ShowAddUserRolePopup: null
  // };   :: unused

  newBrandForm: FormGroup;

  paginationValues: any;
  collapsed: any;
  msgs: any[];
  pageinationcount: any;
  clear: any;
  chkIsActive: boolean;
  public allBrandList: any;
  public brandOnEdit: any;
  public saveButtonText: any;
  public brandIdForUpdate: any = 0;
  public _cookieService: any;
  public brandResources: any;
  public newEmployeeResources: any;
  public globalResource: any;

  public event: any;
  public backUrl = false;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private newBrandActionService: NewBrandActionService,
    private appComponentData: AppComponent,
    // private cookieService: CookieService, :: unused
    private newBrandService: NewBrandService,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService,
    private router: Router,
  ) {
    this.getBrandDetails();
    this.saveButtonText = 'Save';
  }

  brandDetails = {
    brand: null,
    description: null,
    chkIsActive: 1
  };
  newbrand = {
    IsActive: true
  };

  ngOnInit() {
    this.backUrl = this.appCommonService.ProductTypeBackLink;
    this.brandResources = MastersResource.getResources().en.addnewbrand;
    this.globalResource = GlobalResources.getResources().en;
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.loaderService.display(false);
    this.appComponentData.setTitle('Brand');
    this._cookieService = this.appCommonService.getUserProfile();
    this.clear = 'Clear';
    this.saveButtonText = 'Save';
    this.chkIsActive = true;
    // alert();
    // new product type form defination(reactive form)
    this.newBrandForm = this.fb.group({
      'brand': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    });
  }

  // Save the form details
  onSubmit(value: any) {
    if (String(this.newBrandForm.value.brand).trim().length === 0) {
      this.newBrandForm.controls['brand'].setErrors({ 'whitespace': true });
      this.newBrandForm.value.brand = null;
      return;
    }
    let newRoleDetailsForApi;
    newRoleDetailsForApi = {
      Brand: {
        BrandId: this.brandIdForUpdate,
        BrandName: this.appCommonService.trimString(this.newBrandForm.value.brand),
        Description: this.appCommonService.trimString(this.newBrandForm.value.description),
        IsActive: this.newBrandForm.value.chkIsActive ? 1 : 0,
        ClientId: Number(this._cookieService.ClientId),
        VirtualRoleId: Number(this._cookieService.VirtualRoleId)
      }
    };
    // console.log(newRoleDetailsForApi);
    if (this.newBrandForm.valid) {
      // http call starts
      this.loaderService.display(true);
      this.newBrandActionService.addNewBrand(newRoleDetailsForApi)
        .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({
                severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.newbrandsavedsuccess
              });
              this.NewEmployeeSave = data;
              this.resetAll();
              this.getBrandDetails();
            } else if (data === 'InUse') {
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.brandinuse
              });
            } else if (data === 'Failure') {
              this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.brandalreadyexist
              });
            } else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.noupdate
              });
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
            this.loaderService.display(false);
          });
    } else {
      this.appCommonService.validateAllFields(this.newBrandForm);
    }
  }
  showConformationMessaegForDeactive(BrandId, newBrand, rowIndex, IsDeleted: number, ActiveAction: number) {
    let strMessage: any;
    // console.log(this.allBrandList[rowIndex]);
    if (newBrand.IsActive === true) {
      strMessage = 'Do you want to activate this brand?';
    } else {
      strMessage = 'Do you want to inactivate this brand? Sub brand associated with this brand will also be inactivated.';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.brandDeleteEvent(BrandId, newBrand, IsDeleted, ActiveAction);
      },
      reject: () => {
        newBrand.IsActive = !newBrand.IsActive;
      }
    });
  }
  showConformationMessaegForDelete(BrandId: any, IsActiveFlag: any, IsDeleted: number, ActiveAction: number) {
    // alert(EmpId);
    let strMessage: any;
    strMessage = 'Do you want to delete this brand?';
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.brandDeleteEvent(BrandId, IsActiveFlag, IsDeleted, ActiveAction);
      },
      reject: () => {
        // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
  }
  brandDeleteEvent(BrandId: any, newBrand: any, IsDeleted: number, ActiveAction: number) {
    let newRoleDetailsForApi;
    newRoleDetailsForApi = {
      Brand: {
        BrandId: BrandId,
        ClientId: Number(this._cookieService.ClientId),
        VirtualRoleId: Number(this._cookieService.VirtualRoleId),
        IsDeleted: IsDeleted,
        IsActive: newBrand.IsActive,
        ActiveInactive: ActiveAction
      }
    };

    console.log(newRoleDetailsForApi);
    this.loaderService.display(true);
    this.newBrandActionService.addNewBrand(newRoleDetailsForApi)
      .subscribe(
        data => {
          // console.log(data);
          this.msgs = [];
          if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && IsDeleted === 1) {
            this.msgs.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.brandResources.branddeletesuccess
            });
            this.resetAll();
            this.getBrandDetails();
            this.NewEmployeeSave = data;
            this.loaderService.display(false);
          } else if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && ActiveAction === 1) {
            if (newBrand.IsActive !== true) {
              this.msgs.push({
                severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.branddeactivatesuccess
              });
              this.resetAll();
              this.getBrandDetails();
              this.loaderService.display(false);
            } else {
              this.msgs.push({
                severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.brandactivatesuccess
              });
              this.resetAll();
              this.getBrandDetails();
              this.loaderService.display(false);
            }
          } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
            if (IsDeleted === 1) {
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.notdeleted
              });
              this.loaderService.display(false);
            } else if (newBrand.IsActive === true) {
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.notactivated
              });
              newBrand.IsActive = !newBrand.IsActive;
              this.loaderService.display(false);
            } else {
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.brandResources.notinactivated
              });
              newBrand.IsActive = !newBrand.IsActive;
              this.loaderService.display(false);
            }
          } else if ((String(data).toLocaleUpperCase()) === 'INUSE') {
            this.msgs.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.brandResources.brandinuse
            });
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
          this.loaderService.display(false);
        });
  }
  getBrandDetails() {
    this.loaderService.display(true);
    this.newBrandService.getBrandDetails().subscribe(
      data => {
        if (data !== 'No data found!') {
          this.allBrandList = data.filter(x => x.ParentId === 0);
          // console.log(this.allBrandList);

          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allBrandList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allBrandList.length;
          }
        } else {
          this.allBrandList = [];
        }
        this.loaderService.display(false);
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get Brand Details complete'));
  }
  onPageChange(e) {
    this.event = e;
  }

  getBrandOnEdit(BrandId) {
    const data = this.allBrandList;
    if (data !== null) {
      this.brandIdForUpdate = BrandId;

      this.brandOnEdit = data.filter(x => x.BrandId === BrandId);
      const brand = this.newBrandForm.controls['brand'];
      const description = this.newBrandForm.controls['description'];
      const chkIsActive = this.newBrandForm.controls['chkIsActive'];

      brand.patchValue(this.brandOnEdit[0].BrandName);
      description.patchValue(this.brandOnEdit[0].Decsription);
      chkIsActive.patchValue(this.brandOnEdit[0].IsActive);
      this.saveButtonText = 'Update';
      this.clear = 'Cancel';
      this.brandResources.pageheading = 'Edit Brand';
      // console.log(this.brandOnEdit);
    } else {
      this.allBrandList = [];
    }
    this.loaderService.display(false);
    console.log('Get single Brand for edit complete');
    this.scrolltopservice.setScrollTop();
  }

  doOPenPanel() {
    this.collapsed = false;
    this.resetAll();
  }

  resetAll() {
    this.resetForm();
    this.brandIdForUpdate = 0;
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.brandResources.pageheading = 'Add New Brand';
  }
  resetForm() {
    this.newBrandForm.reset({ chkIsActive: true });
    this.brandDetails = {
      brand: null,
      description: null,
      chkIsActive: 1
    };
  }

  // Link changes
  backPackageType() {
    this.router.navigate(['../home/newproducttype']);
  }
}
