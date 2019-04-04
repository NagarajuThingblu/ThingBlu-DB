import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, EventEmitter } from '@angular/core';
import { AppComponent } from '../../../app.component';
import {  ConfirmationService } from 'primeng/api';
import { NewBrandService } from '../../services/brand.service';
import { NewSubBrandActionService } from '../../../task/services/new-sub-brand-action.service';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { Router } from '@angular/router';
declare function unescape(s: string): string;
@Component({
  selector: 'app-add-new-sub-brand-form',
  templateUrl: './add-new-sub-brand-form.component.html',
  styleUrls: ['./add-new-sub-brand-form.component.css']
})
export class AddNewSubBrandFormComponent implements OnInit {
  @Input() NewSubBrandSave: EventEmitter<any> = new EventEmitter<any>();
  public newUserInfo: any = {
    showAddUserRolePopup: null
  };
  public event: any;
  newSubBrandForm: FormGroup;
  private globaldata = {
    allBrandList: []
  };
  branddisabled: boolean;
  brands: any[];
  newbrandlist: any[];
  collapsed: any;
  msgs: any[];
  private globalData = {
    brands: []
  };
  clear: any;
  chkIsActive: any;
  public allSubBrandList: any;
  paginationValues: any;
  public subBrandOnEdit: any;
  public saveButtonText: any;
  public subBrandIdForUpdate: any = 0;
  public _cookieService: any;
  public brandResources: any;
  public newSubBrandResources: any;
  public newEmployeeResources: any;
  public globalResource: any;
  public backUrl =  false;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private newSubBrandActionService: NewSubBrandActionService,
    private appComponentData: AppComponent,
    // private cookieService: CookieService,
    private newBrandService: NewBrandService,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService,
    private router: Router,
  ) {
    this.getBrandList();
    this.getAllBrands();
    this.saveButtonText = 'Save';
   }

   employeeDetails = {
    brand: null,
    subbrand: null,
    description: null
  };

   // Save the form details
   onSubmit(value: any) {
    if (String(this.newSubBrandForm.value.subbrand).trim().length === 0) {
      this.newSubBrandForm.controls['subbrand'].setErrors({'whitespace': true});
      this.newSubBrandForm.value.brand = null;
      return;
    }
    let newRoleDetailsForApi;
    newRoleDetailsForApi = {
      Brand: {
        BrandId: this.subBrandIdForUpdate,
        ParentId: this.newSubBrandForm.value.brand,
        BrandName: this.appCommonService.trimString(this.newSubBrandForm.value.subbrand),
        Description: this.appCommonService.trimString(this.newSubBrandForm.value.description),
        IsActive: this.newSubBrandForm.value.chkIsActive ? 1 : 0,
        ClientId: this._cookieService.ClientId,
        VirtualRoleId: this._cookieService.VirtualRoleId
      }
    };
    // console.log(newRoleDetailsForApi);
    if (this.newSubBrandForm.valid) {
       // http call starts
       this.loaderService.display(true);
      this.newSubBrandActionService.addNewSubBrand(newRoleDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newSubBrandResources.newsubbrandsavedsuccess });
              this.NewSubBrandSave = data;
              this.resetAll();
              this.getBrandList();
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newSubBrandResources.subbrandalreadyexist });
            } else if (String(data).toLocaleUpperCase() === 'NOTPRESENT') {
              this.newSubBrandForm.controls['brand'].setErrors({ 'brandnotpresent': true });
              this.loaderService.display(false);
            } else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newSubBrandResources.noupdate });
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
            this.loaderService.display(false);
          });
    } else {
      this.appCommonService.validateAllFields(this.newSubBrandForm);
    }
  }
  onPageChange(e) {
    this.event = e;
  }
  showConformationMessaegForDeactive(brandId, subBrand, parentId, rowIndex, isDeleted: number, activeAction: number) {
    let strMessage: any;
    if (this.allSubBrandList[rowIndex].IsActive === true) {
      strMessage = 'Do you want to activate this sub brand?';
    } else {
      strMessage = 'Do you want to inactivate this sub brand?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.subBrandDeleteEvent(brandId, subBrand, parentId, isDeleted, activeAction);
      },
      reject: () => {
        // this.allSubBrandList[rowIndex].IsActive = !flag.checked;
        subBrand.IsActive = !subBrand.IsActive;
      }
  });
  }
  showConformationMessaegForDelete(brandId: any, isActive: any, parentId: any, isDeleted: number, activeAction: number) {
    // alert(EmpId);
    let strMessage: any;
    strMessage = 'Do you want to delete this sub brand?';
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.subBrandDeleteEvent(brandId, isActive, parentId, isDeleted, activeAction);
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }
  subBrandDeleteEvent(value: any, subBrand: any, parentId: number, isDeleted: number, activeAction: number) {
    let newRoleDetailsForApi;
    newRoleDetailsForApi = {
      Brand: {
          BrandId: value,
          ParentId: parentId,
          ClientId: Number(this._cookieService.ClientId),
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          IsDeleted: isDeleted,
          IsActive: subBrand.IsActive,
          ActiveInactive: activeAction
      }
    };

    // console.log(newRoleDetailsForApi);
       this.loaderService.display(true);
       this.newSubBrandActionService.addNewSubBrand(newRoleDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && isDeleted === 1) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newSubBrandResources.subbranddeletesuccess });
              this.NewSubBrandSave = data;
              this.resetAll();
              this.getBrandList();
            } else if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && activeAction === 1) {
              if (subBrand.IsActive !== true) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newSubBrandResources.subbranddeactivatesuccess });
                this.resetAll();
                this.getBrandList();
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newSubBrandResources.subbrandactivatesuccess });
                this.resetAll();
                this.getBrandList();
                this.loaderService.display(false);
              }
            } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
              if (isDeleted === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newSubBrandResources.notdeleted });
                this.loaderService.display(false);
              } else if (subBrand.IsActive === true) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newSubBrandResources.notactivated });
                subBrand.IsActive = !subBrand.IsActive;
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newSubBrandResources.notinactivated });
                subBrand.IsActive = !subBrand.IsActive;
                this.loaderService.display(false);
              }
            } else if (String(data.toLocaleUpperCase()) === 'INUSE') {
              // alert('in in use');
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newSubBrandResources.subbrandinuse });
            } else if (String(data.toLocaleUpperCase()) === 'BRANDISINACTIVE') {
              // alert('in in use');
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newSubBrandResources.brandIsInactive });
              subBrand.IsActive = !subBrand.IsActive;
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
            this.loaderService.display(false);
          });
  }
  getBrandList() {
    this.loaderService.display(true);
    this.newBrandService.getBrandDetails().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allSubBrandList = data.filter(x => x.ParentId !== 0);
          // console.log(this.allSubBrandList);
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allSubBrandList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allSubBrandList.length;
          }
       } else {
        this.allSubBrandList = [];
       }
       this.loaderService.display(false);
      } ,
      error => {
        console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All  Sub Brand List complete'));
  }


  getSubBrandOnEdit(SubBrandId) {
      const data = this.allSubBrandList.filter(x => x.SubBrandId === SubBrandId);
       if (data !== 'No data found!') {
          this.subBrandIdForUpdate = SubBrandId;

          this.subBrandOnEdit = data.filter(x => x.SubBrandId === SubBrandId);
          const brand = this.newSubBrandForm.controls['brand'];
          const subbrand = this.newSubBrandForm.controls['subbrand'];
          const description = this.newSubBrandForm.controls['description'];
          const chkIsActive = this.newSubBrandForm.controls['chkIsActive'];

          // brand.patchValue(this.subBrandOnEdit[0].BrandId);
          subbrand.patchValue(this.subBrandOnEdit[0].SubBrandName);
          description.patchValue(this.subBrandOnEdit[0].Decsription);
          chkIsActive.patchValue(this.subBrandOnEdit[0].IsActive);
          this.saveButtonText = 'Update';
          this.clear = 'Cancel';

          this.newSubBrandResources.pageheading = 'Edit Sub Brand';

          let datanew: any;
          datanew = [
               { label: this.subBrandOnEdit[0].BrandName, value: this.subBrandOnEdit[0].BrandId }
          ];
          this.brands = [];
          this.brands = datanew;
          brand.patchValue(this.subBrandOnEdit[0].BrandId);
          this.branddisabled = true;
       } else {
        this.allSubBrandList = [];
       }
       this.loaderService.display(false);
       this.scrolltopservice.setScrollTop();
  }

  doOPenPanel() {
    this.collapsed = false;
    this.resetAll();
  }

  resetAll() {
    this.subBrandIdForUpdate = 0;
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.branddisabled = false;
    this.newSubBrandResources.pageheading = 'Add New Sub Brand';
    this.resetForm();
    this.brands = [];
    this.brands = this.newbrandlist;
  }
  resetForm() {
    this.newSubBrandForm.reset({chkIsActive: true});
    this.employeeDetails = {
      brand: null,
      subbrand: null,
      description: null
    };
  }

  removeDuplicatesById(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.Brand === val2.BrandId) { exists = true; }
      });

      if (exists === false && value.BrandId !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }
    getAllBrands() {
    this.dropdownDataService.getBrands().subscribe(
      data => {
        this.globalData.brands = data;
        this.newbrandlist = this.dropdwonTransformService.transform(data.filter(x => x.ParentId === 0), 'BrandName', 'BrandId', '-- Select --');
        this.brands = this.newbrandlist;
        // this.brands = this.dropdwonTransformService.transform(data.filter(x => x.ParentId === 0), 'BrandName', 'BrandId', '-- Select --');
         console.log(this.brands);
      } ,
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }

  ngOnInit() {
    this.backUrl = this.appCommonService.ProductTypeBackLink;
    this.newSubBrandResources = MastersResource.getResources().en.addnewsubbrand;
    this.brandResources = MastersResource.getResources().en.addnewbrand;
    this.globalResource = GlobalResources.getResources().en;
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.loaderService.display(false);
    this.appComponentData.setTitle('Sub Brand');
    this._cookieService = this.appCommonService.getUserProfile();
    this.newSubBrandResources.pageheading = 'Add New Sub Brand';
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.subBrandIdForUpdate = 0;
    this.chkIsActive = 1;
    this.branddisabled = false;
    // new product type form defination(reactive form)
  this.newSubBrandForm = this.fb.group({
    'brand': new FormControl(null, Validators.required),
    'subbrand': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(50)])),
    'description': new FormControl(null, Validators.compose([Validators.maxLength(100)])),
    'chkIsActive': new FormControl(null)
    });
  }

  // link changes

  backPackageType() {
    this.router.navigate(['../home/newproducttype']);
  }
}
