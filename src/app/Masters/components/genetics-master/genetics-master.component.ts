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
import { AddGeneticsActionService } from '../../../task/services/add-genetics-action.service';
import { GeneticsService } from '../../services/genetics.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { Router } from '@angular/router';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';

@Component({
  selector: 'app-genetics-master',
  templateUrl: './genetics-master.component.html',
  styleUrls: ['./genetics-master.component.css']
})
export class GeneticsMasterComponent implements OnInit {
  geneticsMasterForm: FormGroup;
  public newStrainTypeResources: any;
  public newGeneticsResources: any;
  public globalResource: any;
  submitted: boolean;
  public _cookieService: any;
  public allGeneticsList: any;
  public msgs: any[];
  public strainTypeOnEdit: any[];
  public geneticsForUpdate: any = 0;
  public saveButtonText: any = 'Save';
  clear: any = 'Clear';
  event: any;
  paginationValues: any;
  chkIsActive: any;
    // all form fiels model object
    newStrainTypeDetails = {
      straintype: null,
      description: null
    };
    straintypes: any[];
    newStrainTypes: any[];
    private globalData = {
      straintypes: [],
 
    };
    // public StrainTypeInfo: any = {
    //   StrainTypeName: null
    // };
  pageHeader: any;
  strainForm: any;
  strain: any;
  public backUrl: boolean;
  constructor(  private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private dropdownDataService: DropdownValuesService, 
    private dropdwonTransformService: DropdwonTransformService,
    private appComponentData: AppComponent,
    private geneticsService: GeneticsService,
    // tslint:disable-next-line:no-shadowed-variable
    private addGeneticsActionService: AddGeneticsActionService,
    private confirmationService: ConfirmationService,
    private appCommonService: AppCommonService,
    private router: Router ) { }

  ngOnInit() {
    this.backUrl = this.appCommonService.strainPageBackLink;
    this.chkIsActive = 1;
    this.pageHeader = 'Add New Species';
    this.appComponentData.setTitle('Species');
    this.newStrainTypeResources = MastersResource.getResources().en.addnewstraintype;
    this.newGeneticsResources = MastersResource.getResources().en.addnewgenetics;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();
    this.getGeneticsDetails();
    this.getAllStrainsType();

  // New StrainType form defination(reactive form)
  this.geneticsMasterForm = this.fb.group({
    'cultivartype':new FormControl(null, [Validators.required]),
    'genetics': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    'description': new FormControl(null, [Validators.maxLength(500)]),
    'chkIsActive': new FormControl(null)
  });
  }

  resetAll() {
    this.geneticsForUpdate = 0;
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.pageHeader = 'Add New Species';
    this.resetForm();
  }

  resetForm() {
    this.geneticsMasterForm.reset({chkIsActive: true });

    this.newStrainTypeDetails = {
      straintype: null,
      description: null
    };
  }
  onPageChange(e) {
    this.event = e;
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
  onSubmit(formModel) {
    if (String(this.geneticsMasterForm.value.genetics).trim().length === 0) {
      this.geneticsMasterForm.controls['genetics'].setErrors({'whitespace': true});
      this.geneticsMasterForm.value.genetics = null;
      return;
    }
    const geneticsDetailsForApi = {
      Genetics: {
        GeneticsId: this.geneticsForUpdate,
        GeneticsCode:0,
        GeneticsName: this.appCommonService.trimString(this.geneticsMasterForm.value.genetics),
        Description: this.appCommonService.trimString(this.geneticsMasterForm.value.description),
        VirtualRoleId: this._cookieService.VirtualRoleId,
        IsDeleted: 0,
        ActiveInactive:0,
        IsActive: this.geneticsMasterForm.value.chkIsActive ? 1 : 0,
        ClientId: this._cookieService.ClientId,
        StrainTypeId:  this.geneticsMasterForm.value.cultivartype
      }
    };
    // console.log(geneticsDetailsForApi);
    if (this.geneticsMasterForm.valid) {
       // http call starts
       this.loaderService.display(true);
      this.addGeneticsActionService.addNewGenetics(geneticsDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (data[0]['Result'] === 'Success' &&  this.geneticsForUpdate === 0) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.newGeneticsResources.newGeneticsSavedSuccess });
              this.resetAll();
              this.getGeneticsDetails();
            }else    if (data[0]['Result'] === 'Success' &&  this.geneticsForUpdate != 0) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: "Species Updated Successfully" });
              this.resetAll();
              this.getGeneticsDetails();
            }else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail:
              this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:
              this.newGeneticsResources.geneticsAlreadyExist });
            } else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newGeneticsResources.noupdate });
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
      this.appCommonService.validateAllFields(this.geneticsMasterForm);
    }
  }

  getGeneticsDetails() {
    //this.allGeneticsList = [];
    this.loaderService.display(true);
    this.geneticsService.getGeneticsDetails().subscribe(
      data => {
      //  console.log(data);
       if (data !== 'No data found!') {
          this.allGeneticsList = data;
          this.allGeneticsList =data.filter(x => x.GeneticId != 0);
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allGeneticsList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allGeneticsList.length;
          }
          // console.log(data);
       } else {
        this.allGeneticsList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('GetGeneticsDetails complete'));
  }

  getGeneticsOnEdit(geneticsId) {
    this.pageHeader = 'Edit Species';
    this.clear = 'Cancel';
    // this.NewStrainTypeActionService.GetStrainTypeDetailByStrainTypeId(StrainTypeId).subscribe(

      const data = this.allGeneticsList.filter(x => x.GeneticsId === geneticsId);
      //  console.log(data);
       if (data !== 'No data found!') {
         this.geneticsForUpdate = geneticsId;
         const cultivar = this.geneticsMasterForm.controls['cultivartype'];
         const genetics = this.geneticsMasterForm.controls['genetics'];
         const description = this.geneticsMasterForm.controls['description'];
         const chkIsActive = this.geneticsMasterForm.controls['chkIsActive'];
         cultivar.patchValue(data[0].StrainTypeID);
         genetics.patchValue(data[0].GeneticsName);
          description.patchValue(data[0].Description);
          chkIsActive.patchValue(data[0].IsActive);
         this.saveButtonText = 'Update';
       } else {
       this.allGeneticsList = [];
       }
       this.loaderService.display(false);
 }

 showConformationMessaegForDelete(strainTypeId, strainType, isDeleted, activateInactivateKey) {
      let strMessage: any;
      strMessage = 'Do you want to delete the Species?';
      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.activateDeleteStrainType(strainTypeId, strainType, isDeleted , activateInactivateKey);
        },
        reject: () => {
        }
    });
    }

    activateDeleteStrainType(GeneticsId, Genetics, IsDeleted, ActivateInactivateKey) {
      this.submitted = true;
      // tslint:disable-next-line:prefer-const
      // console.log(this.geneticsMasterForm.value);
      const geneticsDetailsForApi = {
        Genetics: {
          GeneticsId: GeneticsId,
          GeneticsCode:0,
          GeneticsName: Genetics.GeneticsName,
          Description: Genetics.Description,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          IsDeleted: IsDeleted,
          ClientId: this._cookieService.ClientId,
          IsActive: Genetics.IsActive === true?1:0,
          ActiveInactive: ActivateInactivateKey,
          StrainTypeId:Genetics.StrainTypeID
        }
      };

      // console.log(geneticsDetailsForApi);
         this.loaderService.display(true);
        this.addGeneticsActionService.addNewGenetics(geneticsDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success' && IsDeleted === 1) {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newGeneticsResources.geneticsDeletedSuccess});
                this.getGeneticsDetails();
              } else if (String(data[0]['Result']).toLocaleUpperCase() === 'SUCCESS' && ActivateInactivateKey === 1) {
                if (Genetics.IsActive !== true) {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newGeneticsResources.geneticsInactivateSuccess });
                  this.resetAll();
                  this.getGeneticsDetails();
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newGeneticsResources.geneticsActivateSuccess });
                  this.resetAll();
                  this.getGeneticsDetails();
                  this.loaderService.display(false);
                }
              } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
                if (IsDeleted === 1) {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newGeneticsResources.notdeleted });
                  this.loaderService.display(false);
                } else if (Genetics.IsActive === true) {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newGeneticsResources.notactivated });
                  Genetics.IsActive = !Genetics.IsActive;
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.newGeneticsResources.notinactivated });
                  Genetics.IsActive = !Genetics.IsActive;
                  this.loaderService.display(false);
                }
              } else if (String(data.toLocaleUpperCase()) === 'STRAINISINACTIVE') {
                // alert('in in use');
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newGeneticsResources.strainIsInactive });
                Genetics.IsActive = !Genetics.IsActive;
                this.loaderService.display(false);
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              }  else if (String(data.toLocaleUpperCase()) === 'INUSE') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newGeneticsResources.geneticsIsAssigned});
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

    showConformationMessaegForDeactive(geneticsId, genetics, rowIndex, isDeleted: number, activeAction: number) {
      let strMessage: any;
      if (genetics.IsActive === true) {
        strMessage = 'Do you want to activate Species?';
      } else {
        strMessage = 'Do you want to inactivate Species? Cultivar associated with this Species will also be inactivated.';
      }

      this.confirmationService.confirm({
        message: strMessage,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

           this.activateDeleteStrainType(geneticsId, genetics, isDeleted, activeAction);
          },
          reject: () => {
            genetics.IsActive = !genetics.IsActive;
          }
      });
    }

    // back link redirect to strain page
    backToStrain() {
      this.router.navigate(['../home/strainmaster']);
    }
  }
