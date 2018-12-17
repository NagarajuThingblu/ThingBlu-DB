import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { NewStrainTypeActionService } from '../../../task/services/new-strain-type-action.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import { StrainTypeService } from '../../services/strain-type.service';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-straintype-master',
  templateUrl: './straintype-master.component.html'
})
export class StraintypeMasterComponent implements OnInit {
  strainTypeMasterForm: FormGroup;
  public newStrainTypeResources: any;
  public globalResource: any;
  submitted: boolean;
  public _cookieService: any;
  public allStrainTypeList: any;
  public msgs: any[];
  public strainTypeOnEdit: any[];
  public strainForUpdate: any = 0;
  public saveButtonText: any = 'Save';
  clear: any = 'Clear';
  paginationValues: any;
  chkIsActive: any;
  public event: any;
    // all form fiels model object
    newStrainTypeDetails = {
      straintype: null,
      description: null
    };

    // public StrainTypeInfo: any = {
    //   StrainTypeName: null
    // };
  pageHeader: any;
  // StrainForm: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  // Strain: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  constructor(  private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private appComponentData: AppComponent,
    private strainTypeService: StrainTypeService,
    // tslint:disable-next-line:no-shadowed-variable
    private newStrainTypeActionService: NewStrainTypeActionService, // for saving form details service
    private confirmationService: ConfirmationService,
    private appCommonService: AppCommonService) { }

  ngOnInit() {
    this.chkIsActive = 1;
    this.pageHeader = 'Add New Strain Type';
    this.appComponentData.setTitle('Strain Type');
    this.newStrainTypeResources = MastersResource.getResources().en.addnewstraintype;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();
    this.getAllStrainsTypes();


  // New StrainType form defination(reactive form)
  this.strainTypeMasterForm = this.fb.group({
    'straintype': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    'description': new FormControl(null, [Validators.maxLength(500)]),
    'chkIsActive': new FormControl(null)
  });
  }

  resetAll() {
    this.strainForUpdate = 0;
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.pageHeader = 'Add New Strain Type';
    this.resetForm();
  }

  resetForm() {
    this.strainTypeMasterForm.reset({chkIsActive: true });

    this.newStrainTypeDetails = {
      straintype: null,
      description: null
    };
  }
  onPageChange(e) {
    this.event = e;
  }
  saveStrainTypeNames(formModel) {
    if (String(this.strainTypeMasterForm.value.straintype).trim().length === 0) {
      this.strainTypeMasterForm.controls['straintype'].setErrors({'whitespace': true});
      this.strainTypeMasterForm.value.straintype = null;
      return;
    }
    const straintypeDetailsForApi = {
      StrainType: {
        StrainTypeId: this.strainForUpdate,
        StrainTypeName: this.appCommonService.trimString(this.strainTypeMasterForm.value.straintype),
        Description: this.appCommonService.trimString(this.strainTypeMasterForm.value.description),
        VirtualRoleId: this._cookieService.VirtualRoleId,
        IsActive: this.strainTypeMasterForm.value.chkIsActive ? 1 : 0,
        ClientId: this._cookieService.ClientId
      }
    };
    // console.log(straintypeDetailsForApi);
    if (this.strainTypeMasterForm.valid) {
       // http call starts
       this.loaderService.display(true);
      this.newStrainTypeActionService.addNewStrainType(straintypeDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (data[0]['Result'] === 'Success') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newStrainTypeResources.newstraintypesavedsuccess });
              // console.log(data[0]['StrainTypeId']);
              this.resetAll();
              this.getAllStrainsTypes();
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newStrainTypeResources.straintypealreadyexist });
            } else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newStrainTypeResources.noupdate });
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
            this.resetAll();
            this.loaderService.display(false);
          });
    } else {
      this.appCommonService.validateAllFields(this.strainTypeMasterForm);
    }
  }

  getAllStrainsTypes() {
    this.loaderService.display(true);
    this.strainTypeService.getStrainTypeDetails().subscribe(
      data => {
      //  console.log(data);
       if (data !== 'No data found!') {
          this.allStrainTypeList = data;
          // console.log(data);
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allStrainTypeList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allStrainTypeList.length;
          }
       } else {
        this.allStrainTypeList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('GetAllStrainsbyClient complete'));
  }

  getStrainOnEdit(StrainTypeId) {
    this.pageHeader = 'Edit Strain Type';
    this.clear = 'Cancel';
    // this.newStrainTypeActionService.GetStrainTypeDetailByStrainTypeId(StrainTypeId).subscribe(

      const data = this.allStrainTypeList.filter(x => x.StrainTypeId === StrainTypeId);
      //  console.log(data);
       if (data !== 'No data found!') {
         this.strainForUpdate = StrainTypeId;
         this.strainTypeOnEdit = data;
         const straintype = this.strainTypeMasterForm.controls['straintype'];
         const description = this.strainTypeMasterForm.controls['description'];
         const chkIsActive = this.strainTypeMasterForm.controls['chkIsActive'];

          straintype.patchValue(this.strainTypeOnEdit[0].StrainTypeName);
          description.patchValue(this.strainTypeOnEdit[0].Description);
          chkIsActive.patchValue(this.strainTypeOnEdit[0].IsActive);
         this.saveButtonText = 'Update';
       } else {
       this.allStrainTypeList = [];
       }
       this.loaderService.display(false);
 }

 showConformationMessaegForDelete(StrainTypeId, StrainType, IsDeleted, ActivateInactivateKey) {
      let strMessage: any;
      strMessage = 'Do you want to delete the strain type?';
      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.activateDeleteStrainType(StrainTypeId, StrainType, IsDeleted , ActivateInactivateKey);
        },
        reject: () => {
        }
    });
    }

    activateDeleteStrainType(StrainTypeId, StrainType, IsDeleted, ActivateInactivateKey) {
      this.submitted = true;
      // tslint:disable-next-line:prefer-const
      let rowSuplierDetailsForApi;
      // console.log(this.strainTypeMasterForm.value);
      const straintypeDetailsForApi = {
        StrainType: {
          StrainTypeId: StrainTypeId,
          StrainTypeName: this.appCommonService.trimString(this.strainTypeMasterForm.value.straintype),
          Description: this.appCommonService.trimString(this.strainTypeMasterForm.value.description),
          VirtualRoleId: this._cookieService.VirtualRoleId,
          IsDeleted: IsDeleted,
          IsActive: StrainType.IsActive,
          ActiveInactive: ActivateInactivateKey
        }
      };

      // console.log(straintypeDetailsForApi);
         this.loaderService.display(true);
        this.newStrainTypeActionService.addNewStrainType(straintypeDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success' && IsDeleted === 1) {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainTypeResources.newstraintypedeleted});
                this.getAllStrainsTypes();
              } else if (String(data[0]['Result']).toLocaleUpperCase() === 'SUCCESS' && ActivateInactivateKey === 1) {
                if (StrainType.IsActive !== true) {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainTypeResources.newstraintypeinactivated });
                  this.resetAll();
                  this.getAllStrainsTypes();
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainTypeResources.newstraintypeactivated });
                  this.resetAll();
                  this.getAllStrainsTypes();
                  this.loaderService.display(false);
                }
              } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
                if (IsDeleted === 1) {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainTypeResources.notdeleted });
                  this.loaderService.display(false);
                } else if (StrainType.IsActive === true) {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainTypeResources.notactivated });
                  StrainType.IsActive = !StrainType.IsActive;
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainTypeResources.notinactivated });
                  StrainType.IsActive = !StrainType.IsActive;
                  this.loaderService.display(false);
                }
              } else if (String(data.toLocaleUpperCase()) === 'STRAINISINACTIVE') {
                // alert('in in use');
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newStrainTypeResources.strainIsInactive });
                StrainType.IsActive = !StrainType.IsActive;
                this.loaderService.display(false);
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (String(data.toLocaleUpperCase()) === 'INUSE') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newStrainTypeResources.straintypeisassigned});
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

    showConformationMessaegForDeactive(StrainTypeId, StrainType, rowIndex, IsDeleted: number, ActiveAction: number) {
      let strMessage: any;
      if (StrainType.IsActive === true) {
        strMessage = 'Do you want to activate strain type?';
      } else {
        strMessage = 'Do you want to inactivate strain type? Strain associated with this strain type will also be inactivated.';
      }

      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

           this.activateDeleteStrainType(StrainTypeId, StrainType, IsDeleted, ActiveAction);
          },
          reject: () => {
            StrainType.IsActive = !StrainType.IsActive;
          }
      });
    }
  }
