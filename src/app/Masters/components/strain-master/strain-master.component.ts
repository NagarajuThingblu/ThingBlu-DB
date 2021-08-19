import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { NewStrainActionService } from '../../../task/services/new-strain-action.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { StrainMasterService } from '../../services/strain-master.service';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import { AppConstants } from '../../../shared/models/app.constants';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-strain-master',
  templateUrl: './strain-master.component.html',
  })
export class StrainMasterComponent implements OnInit {
  pageheading: any;
  strainmasterForm: FormGroup;
  straintypes: any[];
  newStrainTypes: any[];
  newGenetics: any[];
  public newStrainResources: any;
  public globalResource: any;
  public allStrainList: any;
  public _cookieService: any;
  // public NewStrainForm_copy: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  public genetics: any[];
  public strainForUpdate: any = 0;
  public strainOnEdit: any;
  public saveButtonText: any;
  // Clients: any[]; // Commented by Devdan :: 31-Oct-2018 :: Unused
  chkIsActive: boolean;
  clear: any;
  public event: any;
  paginationValues: any;
    // all form fiels model object
    newStrainDetails = {
      straintype: null,
      strain: null,
      straincode:null,
      description: null,
      genetics: null,
      chkIsActive: 1
    };

    public strainTypeInfo: any = {
      straintype: null,
      description: null,
      showStrainTypeModal: false
    };

    private globalData = {
      straintypes: [],
      genetics: [],
    };
    public msgs: any[];
    strainTypeDisabled: any;
    geneticsDisabled: any;
    submitted: boolean;
    public backUrl: boolean;
  // StrainForm: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  // strain: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  constructor( private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    // tslint:disable-next-line:no-shadowed-variable
    private newStrainActionService: NewStrainActionService, // for saving form details service
    private dropdwonTransformService: DropdwonTransformService,
    private strainMasterAppService: StrainMasterService,
    private confirmationService: ConfirmationService,
    private appComponentData: AppComponent,
    private appCommonService: AppCommonService,
    private router: Router
  ) { }

    ngOnInit() {
      if (this.appCommonService.lotPageBackLink) {
      this.backUrl = this.appCommonService.lotPageBackLink;
      }
      if (this.appCommonService.ProductTypeBackLink) {
        this.backUrl = this.appCommonService.ProductTypeBackLink;
      }
      this.strainmasterForm = this.fb.group({
        'straintype': new FormControl(null, Validators.required),
        'genetics': new FormControl(null),
        'straincode':new FormControl(null, Validators.required),
        'strain': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        'description': new FormControl(null),
        // 'thc': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
        // 'thca': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
        // 'cbd': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
        // 'cbda': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
        // 'total': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
        'chkIsActive': new FormControl(null)
      });

      this.newStrainResources = MastersResource.getResources().en.addnewstrain;
      this.globalResource = GlobalResources.getResources().en;
      this.loaderService.display(false);
      this._cookieService = this.appCommonService.getUserProfile();
      this.getAllStrainsType();
      this.getAllGenetics();
      this.getAllStrainsbyClient();
      this.saveButtonText = 'Save';
      this.pageheading = 'Add New Cultivar';
      this.clear = 'Clear';
      this.appComponentData.setTitle('Strain');
      this.chkIsActive = true;
      this.strainTypeDisabled = false;
      this.geneticsDisabled = false;

      // check click on back link of Genetics :: swapnil :: 02-april-2019
      if (this.appCommonService.strainPageBackLink && this.appCommonService.strainFormDetail) {
        this.strainmasterForm = this.appCommonService.strainFormDetail;
        this.appCommonService.strainPageBackLink = false;
        this.appCommonService.strainFormDetail = null;
      }
    // New Strain form defination(reactive form)
    }

    resetForm() {
      this.strainmasterForm.reset({chkIsActive: true});
      this.newStrainDetails = {
        straintype: null,
        strain: null,
        description: null,
        genetics: null,
        straincode:null,
        chkIsActive: 1
      };
    }

    getAllStrainsType() {
      this.dropdownDataService.getStrainType().subscribe(
        data => {
          this.globalData.straintypes = data;
          this.newStrainTypes = this.dropdwonTransformService.transform(data, 'StrainTypeName', 'StrainTypeId', '-- Select --');
          this.straintypes = this.dropdwonTransformService.transform(data, 'StrainTypeName', 'StrainTypeId', '-- Select --');
          // this.straintypes = this.newStrainTypes;
        } ,
        error => { console.log(error); },
        () => console.log('Get all strains types complete'));
    }

    onSubmit(value: string) {
      if (String(this.strainmasterForm.value.strain).trim().length === 0) {
        this.strainmasterForm.controls['strain'].setErrors({'whitespace': true});
        this.strainmasterForm.value.strain = null;
        return;
      }
      // alert('');
        const strainDetailsForApi = {
          Strain: {
            StrainId: this.strainForUpdate,
            StrainTypeId: this.strainmasterForm.value.straintype,
            StrainName: this.appCommonService.trimString(this.strainmasterForm.value.strain),
            StrainCode: this.appCommonService.trimString(this.strainmasterForm.value.straincode),
            Description: this.appCommonService.trimString(this.strainmasterForm.value.description),
            // THC: this.strainmasterForm.value.thc,
            // THCA: this.strainmasterForm.value.thca,
            // CBD: this.strainmasterForm.value.cbd,
            // CBDA: this.strainmasterForm.value.cbda,
            // Total: this.strainmasterForm.value.total,
            VirtualRoleId: this._cookieService.VirtualRoleId,
            GeneticsId: this.strainmasterForm.value.genetics?this.strainmasterForm.value.genetics:0,
            IsActive: this.strainmasterForm.value.chkIsActive ? 1 : 0,
            ClientId: Number(this._cookieService.ClientId)
          }
        };
        // console.log(strainDetailsForApi);
        if (this.strainmasterForm.valid) {
           // http call starts
           this.loaderService.display(true);
          this.newStrainActionService.addNewStrain(strainDetailsForApi)
          .subscribe(
              data => {
                // console.log(data);
                // alert(data[0]['Result']);
                this.msgs = [];
                if (data[0]['Result'] === 'Success') {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.newStrainResources.newstrainsavedsuccess });

                  // console.log(data[0]['StrainId']);
                 // this.GetStrainOnSave(data[0]['StrainId']);
                 this.resetAll();
                  this.getAllStrainsbyClient();
                } else if (data === 'NotUpdated') {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainResources.noupdate });
                } else if (data[0]['Result'] === 'NotInserted') {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainResources.cannotinsert });
                } else if (String(data[0].ResultKey).toUpperCase() === 'NOTPRESENT') {
                  if (data[0]['NoStrainType'] === 1) {
                    this.strainmasterForm.controls['straintype'].setErrors({ 'straintypenotpresent': true });
                    this.loaderService.display(false);
                  }
                  if (data[0]['NoGenetics'] === 1) {
                    this.strainmasterForm.controls['genetics'].setErrors({ 'geneticsnotpresent': true });
                    this.loaderService.display(false);
                  }
                } else if (String(data[0].ResultKey).toUpperCase() === 'STRAINTYPEDELETED') {

                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainResources.straintypedeleted });

                    this.loaderService.display(false);
                } 
                else if (String(data[0].RESULTKEY) === 'Duplicate Strain Code') {

                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail:"Strain Code already exists"});

                    this.loaderService.display(false);
                }else if (data === 'Failure') {
                  this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (data === 'Duplicate') {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newStrainResources.strainalreadyexist });
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
          this.appCommonService.validateAllFields(this.strainmasterForm);
        }
      }
      onPageChange(e) {
        this.event = e;
      }
      getAllStrainsbyClient() {
        this.loaderService.display(true);
        this.newStrainActionService.getStrainDetailList().subscribe(
          data => {
          //  console.log(data);
           if (data !== 'No data found!') {
              this.allStrainList = data;
              this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allStrainList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allStrainList.length;
          }
           } else {
            this.allStrainList = [];
           }
           this.loaderService.display(false);
          } ,
          error => { console.log(error);  this.loaderService.display(false); },
          () => console.log('getAllStrainsbyClient complete'));
      }

      getAllGenetics() {
        this.strainMasterAppService.getGeneticsList().subscribe(
          data => {
            this.globalData.genetics = data;
            this.newGenetics = this.dropdwonTransformService.transform(data, 'GeneticsName', 'GeneticsId', '-- Select --');
            this.genetics = this.newGenetics;
            // console.log(data);
          } ,
          error => { console.log(error); },
          () => console.log('Get all clients complete'));
      }

      getStrainOnEdit(StrainId) {
        // this.strainMasterAppService.getStrainListByStrainId(StrainId).subscribe(
          const data = this.allStrainList.filter(x => x.StrainId === StrainId);
          console.log(data);
           if (data !== 'No data found!') {
             this.strainForUpdate = StrainId;
             this.strainOnEdit = data;
             const straintype = this.strainmasterForm.controls['straintype'];
             const genetics = this.strainmasterForm.controls['genetics'];
             const strain = this.strainmasterForm.controls['strain'];
             const straincode = this.strainmasterForm.controls['straincode'];
             const description = this.strainmasterForm.controls['description'];
            //  const thc = this.strainmasterForm.controls['thc'];
            //  const cbd = this.strainmasterForm.controls['cbd'];
            //  const thca = this.strainmasterForm.controls['thca'];
            //  const cbda = this.strainmasterForm.controls['cbda'];
            //  const total = this.strainmasterForm.controls['total'];
             const chkIsActive = this.strainmasterForm.controls['chkIsActive'];
              // this.getAllStrainsType();
              // straintype.patchValue(this.strainOnEdit[0].StrainTypeId);
              // this.getAllGenetics();
              strain.patchValue(this.strainOnEdit[0].StrainName);
              straincode.patchValue(this.strainOnEdit[0].StrainCode)
              // genetics.patchValue(this.strainOnEdit[0].GeneticsId);
              // thc.patchValue(this.strainOnEdit[0].THC);
              // cbd.patchValue(this.strainOnEdit[0].CBD);
              // thca.patchValue(this.strainOnEdit[0].THCA);
              // cbda.patchValue(this.strainOnEdit[0].CBDA);
              // total.patchValue(this.strainOnEdit[0].Total);
              chkIsActive.patchValue(this.strainOnEdit[0].IsActive);
              description.patchValue(this.strainOnEdit[0].Description);
              this.clear = 'Cancel';
             this.saveButtonText = 'Update';
             this.pageheading = 'Edit Cultivar';

             // Modified By Bharat T on 26th-Sept-2018 for showing straintype enable in edit mode
             // let strainTypeNewData: any;

             if (!this.straintypes.filter(item => item.value === this.strainOnEdit[0].StrainTypeId).length) {
              this.straintypes.push({ label: this.strainOnEdit[0].StrainTypeName, value: this.strainOnEdit[0].StrainTypeId });
             }
            //  strainTypeNewData = [
            //    { label: this.strainOnEdit[0].StrainTypeName, value: this.strainOnEdit[0].StrainTypeId }
            //   ];
            //   this.straintypes = strainTypeNewData;
            // End of Modified By Bharat T on 26th-Sept-2018 for showing straintype enable in edit mode

              straintype.patchValue(this.strainOnEdit[0].StrainTypeId);

              let geneticsNewData: any;
              geneticsNewData = [
               { label: this.strainOnEdit[0].GeneticsName, value: this.strainOnEdit[0].GeneticsId }
              ];
              this.genetics = [];
              this.genetics = geneticsNewData;
              genetics.patchValue(this.strainOnEdit[0].GeneticsId);
             this.strainTypeDisabled = true;
             this.geneticsDisabled = true;
           } else {
           this.allStrainList = [];
           }
           this.loaderService.display(false);
     }

     resetAll() {
      this.strainForUpdate = 0;
      this.saveButtonText = 'Save';
      this.pageheading = 'Add New Cultivar';
      this.clear = 'Clear';
      this.strainTypeDisabled = false;
      this.geneticsDisabled = false;
      this.resetForm();
      this.straintypes  = this.newStrainTypes;
      this.genetics  = this.newGenetics;
    }

    showConformationMessaegForDelete(StrainId, Strain, IsDeleted, ActiveInactiveFlag) {
      let strMessage: any;
      strMessage = this.newStrainResources.deletestrainmsg;
      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.activateDeleteStrain(StrainId, Strain, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
        }
    });
    }

    activateDeleteStrain(StrainId, Strain, IsDeleted, ActiveInactiveFlag) {
      this.submitted = true;
      // tslint:disable-next-line:prefer-const
      // console.log(Strain);

        const strainDetailsForApi = {
        Strain: {
          StrainId: StrainId,
          StrainTypeId: Strain.StrainTypeId,
          GeneticsId: Strain.GeneticsId,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          IsDeleted: IsDeleted,
          IsActive: Strain.IsActive,
          ActiveInactive: ActiveInactiveFlag,
          ClientId: Number(this._cookieService.ClientId)
        }
      };
        // console.log(strainDetailsForApi);
        this.loaderService.display(true);
        this.newStrainActionService.addNewStrain(strainDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success' && ActiveInactiveFlag === 1) {
                if (Strain.IsActive === true) {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail:  this.newStrainResources.strainActivated});
                  this.resetAll();
                  this.getAllStrainsbyClient();
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail:  this.newStrainResources.strainInactivated});
                  this.resetAll();
                  this.getAllStrainsbyClient();
                  this.loaderService.display(false);
                }
              } else if (data[0]['Result'] === 'Success' && IsDeleted === 1) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:  this.newStrainResources.strainDeletedSuccess});
                this.resetAll();
                this.getAllStrainsbyClient();
                this.loaderService.display(false);
              } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
                if (IsDeleted === 1) {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainResources.notdeleted });
                  this.loaderService.display(false);
                } else if (Strain.IsActive === true) {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainResources.notactivated });
                  Strain.IsActive = !Strain.IsActive;
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainResources.notinactivated });
                  Strain.IsActive = !Strain.IsActive;
                  this.loaderService.display(false);
                }
              } else if (String(data.toLocaleUpperCase()) === 'STRAINTYPEORGENETICSISINACTIVE') {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newStrainResources.straintypeOrGeneticsIsInactive });
                  Strain.IsActive = !Strain.IsActive;
                  this.loaderService.display(false);
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (data === 'Duplicate') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newStrainResources.strainalreadyexist });
              } else if (data === 'InUse') {
                this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: 'Can`t delete. Record is in use.'});
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
    }

    showConformationMessaegForDeactive(StrainId, Strain, rowIndex, IsDeleted, ActiveInactiveFlag) {
      console.log(Strain);
      let strMessage: any;
      if (this.allStrainList[rowIndex].IsActive === true) {
        strMessage = this.newStrainResources.activestrainmsg ;
      } else {
        strMessage = this.newStrainResources.deactivatestrainmsg ;
      }

      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
           this.activateDeleteStrain(StrainId, Strain, IsDeleted, ActiveInactiveFlag);
          },
          reject: () => {
            Strain.IsActive = !Strain.IsActive;
          }
      });
    }

    // Add view link changes
    viewGeneticList() {
      this.appCommonService.strainFormDetail = this.strainmasterForm;
      this.appCommonService.strainPageBackLink = true;
      this.router.navigate(['../home/addnewsgenetics']);
    }

    backToLot() {
      if (this.appCommonService.lotPageBackLink) {
        this.router.navigate(['../home/lotentry']);
        }
        if (this.appCommonService.ProductTypeBackLink) {
          this.router.navigate(['../home/newproducttype']);
        }
    }
}
