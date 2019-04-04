import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { NewBrandActionService } from '../../../task/services/new-brand.service';
import { AppComponent } from '../../../app.component';
import { CookieService } from 'ngx-cookie-service';
import { NewBrandService } from '../../services/brand.service';
import { ConfirmationService } from 'primeng/api';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { OilService } from '../../../task/services/oil.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { TPPPackageTypeActionService } from '../../../task/services/tpp-package-type-action.service';
import { TPPPackageTypeService } from '../../services/tpp-package-type.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-tpp-package-type-mapping-master',
  templateUrl: './tpp-package-type-mapping-master.component.html',
  styleUrls: ['./tpp-package-type-mapping-master.component.css']
})
export class TppPackageTypeMappingMasterComponent implements OnInit {
  @Input() NewTPPPackageTypeSave: EventEmitter<any> = new EventEmitter<any>();
  // Commented by Devdan :: 31-Oct-2018 :: Unused
  // public newUserInfo: any = {
  //   ShowAddUserRolePopup: null
  // };
  globalData = {
    tpProcessors: []
  };
  tpProcessors: any[];
  tppPackageTypeForm: FormGroup;
  event: any;
  collapsed: any;
  msgs: any[];
  tppdisabled: boolean;
  clear: any;
  chkIsActive: boolean;
  paginationValues: any;
  public allTppPackageTypeList: any;
  public tppPackageTypeOnEdit: any;
  public saveButtonText: any;
  public TPPkgTypeIdForUpdate: any = 0;
  public _cookieService: any;
  public tppPackageTypeResources: any;
  public tppPackageType: any;
  public globalResource: any;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    // tslint:disable-next-line:no-shadowed-variable
    private tppPackageTypeActionService: TPPPackageTypeActionService,
    private appComponentData: AppComponent,
    private cookieService: CookieService,
    private tppPackageTypeService: TPPPackageTypeService,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService,
    private oilService: OilService,
    private dropdwonTransformService: DropdwonTransformService,
    private router: Router
  ) {
    this.getTPPPackageTypeDetails();
    this.getProcessors();
    this.saveButtonText = 'Save';
   }

   brandDetails = {
    tpp: null,
    packagetype: null,
    description: null,
    chkIsActive: 1
  };
  newbrand = {
    IsActive: true
  };

  onPageChange(e) {
    this.event = e;
  }
   // Save the form details
   onSubmit(value: any) {
    if (String(this.tppPackageTypeForm.value.packagetype).trim().length === 0) {
      this.tppPackageTypeForm.controls['packagetype'].setErrors({'whitespace': true});
      this.tppPackageTypeForm.value.packagetype = null;
      return;
    }
    let tppPackageTypeDetailsForApi;
    tppPackageTypeDetailsForApi = {
      TPPPackageType: {
        TPPkgTypeId: this.TPPkgTypeIdForUpdate,
        TPId: this.tppPackageTypeForm.value.tpp,
        TPPkgTypeName: this.appCommonService.trimString(this.tppPackageTypeForm.value.packagetype),
        Description: this.appCommonService.trimString(this.tppPackageTypeForm.value.description),
        IsActive: this.tppPackageTypeForm.value.chkIsActive ? 1 : 0,
        ClientId: Number(this._cookieService.ClientId),
        VirtualRoleId: Number(this._cookieService.VirtualRoleId)
      }
    };
    // console.log(tppPackageTypeDetailsForApi);
    if (this.tppPackageTypeForm.valid) {
       // http call starts
       this.loaderService.display(true);
      this.tppPackageTypeActionService.addNewTPPPackageType(tppPackageTypeDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.tppPackageTypeResources.savedsuccess });
              this.NewTPPPackageTypeSave = data;
              this.resetAll();
              this.getTPPPackageTypeDetails();
            } else if (String(data).toLocaleUpperCase() === 'NOTPRESENT') {
              this.tppPackageTypeForm.controls['tpp'].setErrors({ 'tppnotpresent': true });
              this.loaderService.display(false);
              // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              // detail: this.newSubBrandResources.cannotinsert });
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.tppPackageTypeResources.alreadyexist });
            } else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.tppPackageTypeResources.noupdate });
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
      this.appCommonService.validateAllFields(this.tppPackageTypeForm);
    }
  }
  showConformationMessaegForDeactive(TPPkgTypeId, tpppackagetype, rowIndex, IsDeleted: number, ActiveAction: number) {
    let strMessage: any;
    // console.log(this.allTppPackageTypeList[rowIndex]);
    if (this.allTppPackageTypeList[rowIndex].IsActive === true) {
      strMessage = 'Do you want to activate this TPP package type?';
    } else {
      strMessage = 'Do you want to inactivate this TPP package type?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.brandDeleteEvent(TPPkgTypeId, tpppackagetype, IsDeleted, ActiveAction);
      },
      reject: () => {
        tpppackagetype.IsActive = !tpppackagetype.IsActive;
      }
  });
  }
  showConformationMessaegForDelete(BrandId: any, IsActiveFlag: any, IsDeleted: number, ActiveAction: number) {
    // alert(EmpId);
    let strMessage: any;
    strMessage = 'Do you want to delete this TPP package type?';
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
  brandDeleteEvent(TPPkgTypeId: any, tpppackagetype: any, IsDeleted: number, ActiveAction: number) {
    let tppPackageTypeDetailsForApi;
    tppPackageTypeDetailsForApi = {
      TPPPackageType: {
          TPPkgTypeId: TPPkgTypeId,
          ClientId: Number(this._cookieService.ClientId),
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          IsDeleted: IsDeleted,
          IsActive: tpppackagetype.IsActive,
          ActiveInactive: ActiveAction
      }
    };

    // console.log(tppPackageTypeDetailsForApi);
       this.loaderService.display(true);
      this.tppPackageTypeActionService.addNewTPPPackageType(tppPackageTypeDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && IsDeleted === 1) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.tppPackageTypeResources.deletesuccess });
              this.resetAll();
              this.getTPPPackageTypeDetails();
              this.NewTPPPackageTypeSave = data;
              this.loaderService.display(false);
            } else if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && ActiveAction === 1) {
              if (tpppackagetype.IsActive !== true) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.tppPackageTypeResources.deactivatesuccess });
                this.resetAll();
                this.getTPPPackageTypeDetails();
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.tppPackageTypeResources.activatesuccess });
                this.resetAll();
                this.getTPPPackageTypeDetails();
                this.loaderService.display(false);
              }
            } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
              if (IsDeleted === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.tppPackageTypeResources.notactivated });
                this.loaderService.display(false);
              } else if (tpppackagetype.IsActive === true) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.tppPackageTypeResources.notactivated });
                tpppackagetype.IsActive = !tpppackagetype.IsActive;
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.tppPackageTypeResources.notinactivated });
                tpppackagetype.IsActive = !tpppackagetype.IsActive;
                this.loaderService.display(false);
              }
              // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              // detail: this.tppPackageTypeResources.noupdate });
            } else if (String(data.toLocaleUpperCase()) === 'INUSE') {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.tppPackageTypeResources.tpppackagetypeinuse });
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
  getTPPPackageTypeDetails() {
    this.loaderService.display(true);
    this.tppPackageTypeService.getTPPPackageTypeDetails().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allTppPackageTypeList = data;
          // console.log(this.allTppPackageTypeList);
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allTppPackageTypeList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allTppPackageTypeList.length;
          }
       } else {
        this.allTppPackageTypeList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get Tpp Package Type Details complete'));
  }
  getProcessors() {
    this.loaderService.display(true);
    this.oilService.getProcessors().subscribe(
      data => {
        // console.log(data);
        // this.globalData.Employees = data;
        if (data !== 'No data found!') {
          this.globalData.tpProcessors = data;
          this.tpProcessors = this.dropdwonTransformService.transform(data.filter(x => x.IsActive === true),
            'TPName', 'TPId', '-- Select --');
        } else {
          this.globalData.tpProcessors = [];
          this.tpProcessors = [];
        }
        this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get Processors complete')
    );
  }

  gettpOnEdit(TPPkgTypeId) {
    const data = this.allTppPackageTypeList;
       if (data !== 'No data found!') {
          this.tppdisabled = true;
          this.TPPkgTypeIdForUpdate = TPPkgTypeId;

          this.tppPackageTypeOnEdit = data.filter(x => x.TPPkgTypeId === TPPkgTypeId);
          const tpp = this.tppPackageTypeForm.controls['tpp'];
          const packagetype = this.tppPackageTypeForm.controls['packagetype'];
          const description = this.tppPackageTypeForm.controls['description'];
          const chkIsActive = this.tppPackageTypeForm.controls['chkIsActive'];

          tpp.patchValue(this.tppPackageTypeOnEdit[0].TPId);
          packagetype.patchValue(this.tppPackageTypeOnEdit[0].TPPkgTypeName);
          description.patchValue(this.tppPackageTypeOnEdit[0].Description);
          chkIsActive.patchValue(this.tppPackageTypeOnEdit[0].IsActive);
          this.saveButtonText = 'Update';
          this.clear = 'Cancel';
          this.tppPackageTypeResources.pageheading = 'Edit TPP Package Type';
          // console.log(this.tppPackageTypeOnEdit);
       } else {
        this.allTppPackageTypeList = [];
       }
       this.loaderService.display(false);
       console.log('Get single TPP Package Type for edit complete');
       this.scrolltopservice.setScrollTop();
  }

  doOPenPanel() {
    this.collapsed = false;
    this.resetAll();
  }

  resetAll() {
    this.resetForm();
    this.TPPkgTypeIdForUpdate = 0;
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.tppdisabled = false;
    this.tppPackageTypeResources.pageheading = 'Add New TPP Package Type';
  }
  resetForm() {
    this.tppPackageTypeForm.reset({ chkIsActive: true });
    this.brandDetails = {
      tpp: null,
      packagetype: null,
      description: null,
      chkIsActive: 1
    };
  }

  ngOnInit() {
    this.tppPackageTypeResources = MastersResource.getResources().en.tppPackageType;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this.appComponentData.setTitle('TPP Package Type');
    this._cookieService = this.appCommonService.getUserProfile();
    this.clear = 'Clear';
    this.saveButtonText = 'Save';
    this.tppPackageTypeResources.pageheading = 'Add New TPP Package Type';
    this.chkIsActive = true;
    // alert();
    // new product type form defination(reactive form)
  this.tppPackageTypeForm = this.fb.group({
    'tpp': new FormControl(null, Validators.required),
    'packagetype': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(50)])),
    'description': new FormControl(null),
    'chkIsActive': new FormControl(null)
    });

    if ( this.appCommonService.TPProcessorBackLink && this.appCommonService.TPProcessorFormDetail) {
      this.tppPackageTypeForm = this.appCommonService.TPProcessorFormDetail;
      this.appCommonService.TPProcessorBackLink = false;
      this.appCommonService.TPProcessorFormDetail = null;
    }
  }

  // link changes
  viewTPProcessorList() {
    this.appCommonService.TPProcessorBackLink = true;
    this.appCommonService.TPProcessorFormDetail = this.tppPackageTypeForm;
    this.router.navigate(['../home/tpprocessor']);
  }
  viewTPPackageList() {
    this.appCommonService.TPProcessorBackLink = true;
    this.appCommonService.TPProcessorFormDetail = this.tppPackageTypeForm;
    this.router.navigate(['../home/addnewpackagetype']);
  }
}
