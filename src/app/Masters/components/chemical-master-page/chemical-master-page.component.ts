import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';
import { Router } from '@angular/router';
import { ChemicalMasterService } from '../../services/chemicalmaster.service';

@Component({
  moduleId: module.id,
  selector: 'app-chemical-master-page',
  templateUrl: './chemical-master-page.component.html',
  styleUrls: ['./chemical-master-page.component.css']
})
export class ChemicalMasterPageComponent implements OnInit {
  pageheading = 'Add Chemical Type';
  chemicalMasterForm:FormGroup;
  globalResource: any;
  public _cookieService: any;
  public msgs: any[];
  submitted: boolean;
  IsActive: boolean;
  SaveButtonText = 'Save';
  event: any;
  Clear = 'Clear';
  PaginationValues: any;
  ChemicalTypeId: any = 0;
  chemicalMasterResources: any;
  public allchemicaltypeList: any;
  public backUrl: boolean;
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private cookieService: CookieService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private AppComponentData: AppComponent,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService,
    private router: Router,
    private ChemicalMasterService: ChemicalMasterService,
  ) { }

  ngOnInit() {
    this.IsActive = true;
    this.backUrl = this.appCommonService.ChemicalPurchasePageBackLink;
    this.getChemicalTypeDetailListByClient();
    this.globalResource = GlobalResources.getResources().en;
    this.AppComponentData.setTitle('Chemical Types');
    this._cookieService = this.appCommonService.getUserProfile();
    this.chemicalMasterResources = MastersResource.getResources().en.chemicalmaster;
    this.chemicalMasterForm = this.fb.group({
      'chemicalname': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    })
    this.loaderService.display(false);
  }
  ResetForm(){
    this.chemicalMasterForm.reset({ chkIsActive: true });
    this.pageheading = 'Add Chemical Type';
  this.Clear = 'Clear';
  this.SaveButtonText = 'Save';
//   this.newPtrdetails = {
//     description: null,
//     terminationReason:null
// }
  }
  getChemicalTypeDetailListByClient(){
    this.loaderService.display(true);
    this.ChemicalMasterService.GetAllChemicalTypeListByClient().subscribe(
      data => {
        if (data !== 'No Data Found!') {
           this.allchemicaltypeList = data;
          
           this.PaginationValues = AppConstants.getPaginationOptions;
           if (this.allchemicaltypeList.length > 20) {
             this.PaginationValues[AppConstants.getPaginationOptions.length] = this.allchemicaltypeList.length;
           }
        } else {
         this.allchemicaltypeList = [];
        }
        this.loaderService.display(false);
       } ,
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getChemicalTypeDetailListByClient complete'));
  }
  onSubmit(value: string){
    this.submitted = true;
    let ChemicalDetailsForApi;
    ChemicalDetailsForApi = {
      ChemicalData:{
        ChemicalTypeId: this.ChemicalTypeId,
        ClientId: this._cookieService.ClientId,
        ChemicalTypeName: this.chemicalMasterForm.value.chemicalname,
        Description:this.chemicalMasterForm.value.description,
        IsActive: this.chemicalMasterForm.value.chkIsActive ? 1 : 0,
        IsDeleted: 0,
        VirtualRoleId: this._cookieService.VirtualRoleId,
        ActiveInactive: 0
      },
    };
    if (this.chemicalMasterForm.valid) {
      this.loaderService.display(true);
      this.ChemicalMasterService.addChemicalMasterDetails(ChemicalDetailsForApi)
      .subscribe(
        data => {
          this.msgs = [];
          if (data[0].RESULTKEY === 'SUCCESS') {
            if (this.ChemicalTypeId === 0 ) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.chemicalMasterResources.success});
            }
            else{
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.chemicalMasterResources.updated });
            }
          this.ResetForm();
          this.getChemicalTypeDetailListByClient();
          }
          else if(data === "Failure"){
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg , detail: data });
          }
          else if(data ==="Something went wrong at server side!"){
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg , detail: data });
          }
          this.loaderService.display(false);
        }
      )
    }
  }

  GetCTOnEdit(ChemicalTypeId){
    event.stopPropagation();
    const data = this.allchemicaltypeList.filter(x => x.ChemicalTypeId === ChemicalTypeId);
    if (data !== null) {
      this.ChemicalTypeId = ChemicalTypeId
      this.chemicalMasterForm.patchValue({
        chemicalname:data[0].ChemicalTypeName,
        description: data[0].Description,
        chkIsActive: data[0].IsActive
      });
      this.SaveButtonText = 'Update';
      this.pageheading = 'Edit Chemical Type';
      this.Clear = 'Cancel';
      this.scrolltopservice.setScrollTop();
    } else {
      this.allchemicaltypeList = [];
      }
      this.loaderService.display(false);
  }

  onPageChange(e) {
    this.event = e;
  }
  ShowConformationMessaegForDelete(ChemicalTypeId, chemicaltype, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
  
      strMessage = 'Do you want to delete this Chemical Type?';
  
    
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.ActivateDeleteChemicalType(ChemicalTypeId, chemicaltype, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
  }

  ShowConformationMessaegForDeactive(ChemicalTypeId, chemicaltype, rowIndex, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
    if (this.allchemicaltypeList[rowIndex].IsActive === true) {
        strMessage = 'Do you want to activate this Chemical Type?';
    } else {
        strMessage = 'Do you want to inactivate this Chemical Type?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.ActivateDeleteChemicalType(ChemicalTypeId, chemicaltype, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          chemicaltype.IsActive = !chemicaltype.IsActive;
        }
    });
  }

  ActivateDeleteChemicalType(ChemicalTypeId, chemicaltype, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    let ChemicalDetailsForApi;
    // console.log(this.growerForm.value);
  
    ChemicalDetailsForApi = {
          ChemicalData:{
            ChemicalTypeId:ChemicalTypeId,
            ClientId: this._cookieService.ClientId,
            ChemicalTypeName: chemicaltype.ChemicalTypeName,
            Description:chemicaltype.Description,
            IsActive: chemicaltype.IsActive ? 1 : 0,
            IsDeleted:IsDeleted,
            VirtualRoleId: this._cookieService.VirtualRoleId,
            ActiveInactive: ActiveInactiveFlag
          },
    };
  
    this.loaderService.display(true);
    this.ChemicalMasterService.addChemicalMasterDetails(ChemicalDetailsForApi)
    .subscribe(
      data => {
        // console.log(data);
        this.msgs = [];
        if (data[0]. RESULTKEY === 'SUCCESS' && ActiveInactiveFlag === 1) {
          if (chemicaltype.IsActive !== true) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.chemicalMasterResources.inactivated });
            
            this.getChemicalTypeDetailListByClient();
            this.loaderService.display(false);
          } else {
            
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.chemicalMasterResources.activated });
            
            this.getChemicalTypeDetailListByClient();
            this.loaderService.display(false);
          }
        } if (data[0]. RESULTKEY === 'SUCCESS' && IsDeleted === 1) {
          
       
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.chemicalMasterResources.deletedSuccess });
          
            this.getChemicalTypeDetailListByClient();
            this.loaderService.display(false);
        } else if (data[0]. RESULTKEY === 'NotUpdated') {
          if (IsDeleted === 1) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.chemicalMasterResources.cannotdelete });
            
          } else if (chemicaltype.IsActive === 1) {
            
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.chemicalMasterResources.cannotInactivate });
            
            chemicaltype.IsActive = !chemicaltype.IsActive;
          } else {
           
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.chemicalMasterResources.cannotActivate });
           
              chemicaltype.IsActive = !chemicaltype.IsActive;
          }
        } else if (data[0]. RESULTKEY === 'Already Deleted') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.chemicalMasterResources.alreadydlt });
          
          
        }else if (data[0]. RESULTKEY === 'InUse') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.chemicalMasterResources.inuse });
          
          
        }
          this.loaderService.display(false);
      },
      error => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
        this.loaderService.display(false);
      }
    );
  }
  backToChemicalPurchase(){
    this.router.navigate(['../home/master/chemicalsaddupdate']);
  }

}
