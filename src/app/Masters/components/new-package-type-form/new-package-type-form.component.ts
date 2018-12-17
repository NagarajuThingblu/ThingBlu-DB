import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { NewEmployeeActionService } from '../../../task/services/add-employee';
import { NewBrandActionService } from '../../../task/services/new-brand.service';
import { AppComponent } from '../../../app.component';
import { CookieService } from 'ngx-cookie-service';
import { NewEmployeeService } from '../../services/new-employee.service';
import { NewBrandService } from '../../services/brand.service';
import { ConfirmationService } from 'primeng/api';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { NewPackageTypeActionService } from '../../../task/services/new-package-type-action.service';
import { PackagingTypesService } from '../../services/packagingtypes.service';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  selector: 'app-new-package-type-form',
  templateUrl: './new-package-type-form.component.html',
  styleUrls: ['./new-package-type-form.component.css']
})
export class NewPackageTypeFormComponent implements OnInit {
  @Input() NewEmployeeSave: EventEmitter<any> = new EventEmitter<any>();
  public newUserInfo: any = {
    ShowAddUserRolePopup: null
  };

  newEmployeeForm: FormGroup;
  private globaldata = {
    allBrandList: []
  };

  collapsed: any;
  msgs: any[];
  clear: any;
  chkIsActive: any;
  paginationValues: any;
  public allpackagingtypesList: any;
  public allBrandList: any;
  // public EmployeeOnEdit: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  public saveButtonText: any;
  public empIdForUpdate: any = 0;
  public _cookieService: any;
  public brandResources: any;
  public newPackageTypeResources: any;
  public newEmployeeResources: any;
  public globalResource: any;
  event: any;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private newPackageTypeActionService: NewPackageTypeActionService,
    private appComponentData: AppComponent,
    private cookieService: CookieService,
    private packagingTypesService: PackagingTypesService,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService
  ) {
    this.getPackageTypeDetails();
    this.saveButtonText = 'Save';
   }

   employeeDetails = {
    brand: null,
    description: null
  };

   // Save the form details
   onSubmit(value: any) {
    if (String(this.newEmployeeForm.value.packagetype).trim().length === 0) {
      this.newEmployeeForm.controls['packagetype'].setErrors({'whitespace': true});
      this.newEmployeeForm.value.brand = null;
      return;
    }
    let newPackagingTypesDetailsForApi;
    newPackagingTypesDetailsForApi = {
      PackagingTypes: {
        PkgTypeId: this.empIdForUpdate,
        PkgTypeName: this.appCommonService.trimString(this.newEmployeeForm.value.packagetype),
        Description: this.appCommonService.trimString(this.newEmployeeForm.value.description),
        IsActive: this.newEmployeeForm.value.chkIsActive ? 1 : 0,
        ClientId: this._cookieService.ClientId,
        VirtualRoleId: Number(this._cookieService.VirtualRoleId)
      }
    };
    // console.log(newPackagingTypesDetailsForApi);
    if (this.newEmployeeForm.valid) {
       // http call starts
       this.loaderService.display(true);
      this.newPackageTypeActionService.addNewPackageType(newPackagingTypesDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newPackageTypeResources.newpackagetypesavedsuccess });
              this.NewEmployeeSave = data;
              this.empIdForUpdate = null;
              this.resetAll();
              this.getPackageTypeDetails();
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newPackageTypeResources.packagetypealreadyexist });
            } else if (data === 'NoDelete') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newPackageTypeResources.packagetypeinuse });
            } else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newPackageTypeResources.noupdate });
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
      this.appCommonService.validateAllFields(this.newEmployeeForm);
    }
  }
  showConformationMessaegForDeactive(PkgTypeId, newpackagetype, rowIndex, IsDeleted: number, ActiveAction: number) {
    let strMessage: any;
    if (this.allpackagingtypesList[rowIndex].IsActive === true) {
      strMessage = 'Do you want to activate this package type?';
    } else {
      strMessage = 'Do you want to inactivate this package type?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.employeeDeleteEvent(PkgTypeId, newpackagetype, IsDeleted, ActiveAction);
      },
      reject: () => {
        // this.allpackagingtypesList[rowIndex].IsActive = !flag.checked;
        newpackagetype.IsActive = !newpackagetype.IsActive;
      }
  });
  }
  showConformationMessaegForDelete(PkgTypeId: any, IsActiveFlag: any, IsDeleted: number, ActiveAction: number) {
    // alert(EmpId);
    let strMessage: any;
    strMessage = 'Do you want to delete this package type?';
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.employeeDeleteEvent(PkgTypeId, IsActiveFlag, IsDeleted, ActiveAction);
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }
  employeeDeleteEvent(PkgTypeId: any, newpackagetype: any, IsDeleted: number, ActiveAction: number) {
    let newPackagingTypesDetailsForApi;
    newPackagingTypesDetailsForApi = {
      PackagingTypes: {
          PkgTypeId: PkgTypeId,
          ClientId: Number(this._cookieService.ClientId),
          VirtualRoleId: Number(this._cookieService.VirtualRoleId),
          IsDeleted: IsDeleted,
          IsActive: newpackagetype.IsActive,
          ActiveInactive: ActiveAction
      }
    };

    // console.log(newPackagingTypesDetailsForApi);
       this.loaderService.display(true);
       this.newPackageTypeActionService.addNewPackageType(newPackagingTypesDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && IsDeleted === 1) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newPackageTypeResources.packagetypedeletesuccess });
              this.NewEmployeeSave = data;
              this.resetAll();
              this.getPackageTypeDetails();
            } else if (String(data[0].Result).toLocaleUpperCase() === 'SUCCESS' && ActiveAction === 1) {
              if (newpackagetype.IsActive !== true) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newPackageTypeResources.packagetypedeactivatesuccess });
                this.resetAll();
                this.getPackageTypeDetails();
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newPackageTypeResources.packagetypeactivatesuccess });
                this.resetAll();
                this.getPackageTypeDetails();
                this.loaderService.display(false);
              }
            } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
              if (IsDeleted === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newPackageTypeResources.notdeleted });
              this.loaderService.display(false);
              } else if (newpackagetype.IsActive === true) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newPackageTypeResources.notactivated });
                newpackagetype.IsActive = !newpackagetype.IsActive;
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newPackageTypeResources.notinactivated });
                newpackagetype.IsActive = !newpackagetype.IsActive;
                this.loaderService.display(false);
              }
            } else if (String(data.toLocaleUpperCase()) === 'INUSE') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newPackageTypeResources.packagetypeinuse });
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
  onPageChange(e) {
    this.event = e;
  }
  getPackageTypeDetails() {
    this.loaderService.display(true);
    this.packagingTypesService.getPackagingTypesDetails().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allpackagingtypesList = data;
          // console.log(this.allpackagingtypesList);
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allpackagingtypesList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allpackagingtypesList.length;
          }
       } else {
        this.allpackagingtypesList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All  Packaging types List complete'));
  }


  getPackagingTypesOnEdit(packagetypeId) {
    const data: any = this.allpackagingtypesList.filter(x => x.PkgTypeId === packagetypeId);
       if (data !== 'No data found!') {
        // console.log(data);
          this.empIdForUpdate = packagetypeId;
          const packagetype = this.newEmployeeForm.controls['packagetype'];
          const description = this.newEmployeeForm.controls['description'];
          const chkIsActive = this.newEmployeeForm.controls['chkIsActive'];

          packagetype.patchValue(data[0].PkgTypeName);
          description.patchValue(data[0].Description);
          chkIsActive.patchValue(data[0].IsActive);
          this.saveButtonText = 'Update';
          this.clear = 'Cancel';
          this.newPackageTypeResources.pageheading = 'Edit Package Type';
       } else {
        this.allpackagingtypesList = [];
       }
       this.loaderService.display(false);
       this.scrolltopservice.setScrollTop();
      }

  doOPenPanel() {
    this.collapsed = false;
    this.resetAll();
  }

  resetAll() {
    this.empIdForUpdate = 0;
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.newPackageTypeResources.pageheading = 'Add New Package Type';
    this.resetForm();
  }
  resetForm() {
    this.newEmployeeForm.reset({ chkIsActive: true });
    this.employeeDetails = {
      brand: null,
      description: null
    };
  }

  ngOnInit() {
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.chkIsActive = 1;
    this.newPackageTypeResources = MastersResource.getResources().en.addnewpackagetype;
    this.brandResources = MastersResource.getResources().en.addnewbrand;
    this.globalResource = GlobalResources.getResources().en;
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.loaderService.display(false);
    this.appComponentData.setTitle('Package Type');
    this._cookieService = this.appCommonService.getUserProfile();
    // new product type form defination(reactive form)
  this.newEmployeeForm = this.fb.group({
    'packagetype': new FormControl(null, Validators.required),
    'description': new FormControl(null),
    'chkIsActive': new FormControl(null)
    });
  }
}
