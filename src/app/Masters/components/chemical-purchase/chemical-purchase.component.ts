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
  selector: 'app-chemical-purchase',
  templateUrl: './chemical-purchase.component.html',
  styleUrls: ['./chemical-purchase.component.css']
})
export class ChemicalPurchaseComponent implements OnInit {
  pageheading = 'Add Chemical Purchase';
  chemicalPurchaseForm:FormGroup;
  globalResource: any;
  public _cookieService: any;
  public msgs: any[];
  submitted: boolean;
  IsActive: boolean;
  SaveButtonText = 'Save';
  event: any;
  Clear = 'Clear';
  PaginationValues: any;
  chemicaltypes: any[];
  uom: any[];
  public allchemicalpurchaseList: any;
  ChemicalPurchaseId: any = 0;
  chemicalPurchaseResources: any;
  private globalData = {
    chemicaltypes: [],
    uom: []
  };
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
   this.getAllChemicalType();
   this.getAllUOM();
   this.getChemicalPurchaseDetailListByClient();
    this.globalResource = GlobalResources.getResources().en;
    this.AppComponentData.setTitle('Chemical Purchase');
    this._cookieService = this.appCommonService.getUserProfile();
    this.chemicalPurchaseResources = MastersResource.getResources().en.chemicalpurchase;
    this.chemicalPurchaseForm = this.fb.group({
      'chemicalname': new FormControl(null, Validators.required),
      'quantity': new FormControl(null, Validators.required),
      'uom': new FormControl(null, Validators.required),
      'cost':new FormControl(null, Validators.required),
      'chkIsActive': new FormControl(null)
    })
    this.loaderService.display(false);
  }
  ResetForm(){
    this.chemicalPurchaseForm.reset({ chkIsActive: true });
    this.pageheading = 'Add  Chemical Purchase';
  this.Clear = 'Clear';
  this.SaveButtonText = 'Save';
//   this.newPtrdetails = {
//     description: null,
//     terminationReason:null
// }
  }
  
  getAllChemicalType() {
    this.dropdownDataService.getChemicalTypes().subscribe(
      data => {
        if(data != "No Data Found"){
          this.globalData.chemicaltypes = data;
          this.chemicaltypes = this.dropdwonTransformService.transform(data, 'ChemicalTypeName', 'ChemicalTypeId', '-- Select --');
        }
        else{
          this.chemicaltypes = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('Get all strains types complete'));
  }

  getAllUOM() {
    this.dropdownDataService.getUOM().subscribe(
      data => {
        if(data != "No Data Found"){
          this.globalData.uom = data;
          this.uom = this.dropdwonTransformService.transform(data, 'UOMName', 'UOMId', '-- Select --');
        }
       else{
         this.uom=[];
       }
      } ,
      error => { console.log(error); },
      () => console.log('Get all strains types complete'));
  }

  navigateToChemicalTypePage(){
    this.router.navigate(['home/chemicalType/']);
  }

  getChemicalPurchaseDetailListByClient(){
    this.loaderService.display(true);
    this.ChemicalMasterService.GetAllChemicalPurchaseListByClient().subscribe(
      data => {
        if (data !== 'No Data Found') {
           this.allchemicalpurchaseList = data;
          
           this.PaginationValues = AppConstants.getPaginationOptions;
           if (this.allchemicalpurchaseList.length > 20) {
             this.PaginationValues[AppConstants.getPaginationOptions.length] = this.allchemicalpurchaseList.length;
           }
        } else {
         this.allchemicalpurchaseList = [];
        }
        this.loaderService.display(false);
       } ,
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getChemicalTypeDetailListByClient complete'));
  }
  onPageChange(e) {
    this.event = e;
  }
  onSubmit(value: string){
    this.submitted = true;
    let ChemicalpurchaseDetailsForApi;
    ChemicalpurchaseDetailsForApi = {
      ChemicalPurchaseData: {
        ChemicalPurchaseId: this.ChemicalPurchaseId,
        ChemicalTypeId:this.chemicalPurchaseForm.value.chemicalname,
        Qty:this.chemicalPurchaseForm.value.quantity,
        ClientId:this._cookieService.ClientId,
        UOMId:this.chemicalPurchaseForm.value.uom,
        TotalChemicalCost:this.chemicalPurchaseForm.value.cost,
        IsActive:this.chemicalPurchaseForm.value.chkIsActive,
        IsDeleted:0,
        VirtualRoleId:this._cookieService.VirtualRoleId,
        ActiveInactive:0
    },
    };
    if (this.chemicalPurchaseForm.valid) {
      this.loaderService.display(true);
      this.ChemicalMasterService.addChemicalPurchaseDetails(ChemicalpurchaseDetailsForApi)
      .subscribe(
        data => {
          this.msgs = [];
          if (data[0].RESULTKEY === 'SUCCESS') {
            if (this.ChemicalPurchaseId === 0 ) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.chemicalPurchaseResources.success});
            }
            else{
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.chemicalPurchaseResources.updated });
            }
          this.ResetForm();
          this.getChemicalPurchaseDetailListByClient();
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
  GetCPOnEdit(ChemicalPurchaseId){
    event.stopPropagation();
    const data = this.allchemicalpurchaseList.filter(x => x.ChemicalPurchaseId === ChemicalPurchaseId);
    if (data !== null) {
      this.ChemicalPurchaseId = ChemicalPurchaseId
      this.chemicalPurchaseForm.patchValue({
        chemicalname:data[0].ChemicalTypeId,
        quantity: data[0].Qty,
        uom:data[0].UOMId,
        cost:data[0].TotalChemicalCost,
        chkIsActive: data[0].IsActive
      });
      this.SaveButtonText = 'Update';
      this.pageheading = 'Edit Chemical Purchase';
      this.Clear = 'Cancel';
      this.scrolltopservice.setScrollTop();
    } else {
      this.allchemicalpurchaseList = [];
      }
      this.loaderService.display(false);
  }

  ShowConformationMessaegForDelete(ChemicalPurchaseId, chemicaltype, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
  
      strMessage = 'Do you want to delete this Chemical Purchase?';
  
    
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.ActivateDeleteChemicalType(ChemicalPurchaseId, chemicaltype, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
  }

  ShowConformationMessaegForDeactive(ChemicalPurchaseId, chemicaltype, rowIndex, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
    if (this.allchemicalpurchaseList[rowIndex].IsActive === true) {
        strMessage = 'Do you want to activate this Chemical Purchase?';
    } else {
        strMessage = 'Do you want to inactivate this Chemical Purchase?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.ActivateDeleteChemicalType(ChemicalPurchaseId, chemicaltype, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          chemicaltype.IsActive = !chemicaltype.IsActive;
        }
    });
  }

  ActivateDeleteChemicalType(ChemicalPurchaseId, chemicaltype, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    let ChemicalpurchaseDetailsForApi;
    // console.log(this.growerForm.value);
  
    ChemicalpurchaseDetailsForApi = {
      ChemicalPurchaseData:{

        ChemicalPurchaseId:ChemicalPurchaseId,
        ChemicalTypeId:chemicaltype.ChemicalTypeId,
        Qty:chemicaltype.Qty,
        ClientId:this._cookieService.ClientId,
        UOMId:chemicaltype.UOMId,
        TotalChemicalCost:chemicaltype.TotalChemicalCost,
        IsActive:chemicaltype.IsActive ? 1 : 0,
        IsDeleted:IsDeleted,
        VirtualRoleId:this._cookieService.VirtualRoleId,
        ActiveInactive:ActiveInactiveFlag
           
          },
    };
  
    this.loaderService.display(true);
    this.ChemicalMasterService.addChemicalPurchaseDetails(ChemicalpurchaseDetailsForApi)
    .subscribe(
      data => {
        // console.log(data);
        this.msgs = [];
        if (data[0]. RESULTKEY === 'SUCCESS' && ActiveInactiveFlag === 1) {
          if (chemicaltype.IsActive !== true) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.chemicalPurchaseResources.inactivated });
            
            this.getChemicalPurchaseDetailListByClient();
            this.loaderService.display(false);
          } else {
            
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.chemicalPurchaseResources.activated });
            
            this.getChemicalPurchaseDetailListByClient();
            this.loaderService.display(false);
          }
        } if (data[0]. RESULTKEY === 'SUCCESS' && IsDeleted === 1) {
          
       
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.chemicalPurchaseResources.deletedSuccess });
          
            this.getChemicalPurchaseDetailListByClient();
            this.loaderService.display(false);
        } else if (data[0]. RESULTKEY === 'NotUpdated') {
          if (IsDeleted === 1) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.chemicalPurchaseResources.cannotdelete });
            
          } else if (chemicaltype.IsActive === 1) {
            
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.chemicalPurchaseResources.cannotInactivate });
            
            chemicaltype.IsActive = !chemicaltype.IsActive;
          } else {
           
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.chemicalPurchaseResources.cannotActivate });
           
              chemicaltype.IsActive = !chemicaltype.IsActive;
          }
        } else if (data[0]. RESULTKEY === 'Already Deleted') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.chemicalPurchaseResources.alreadydlt });
          
          
        }else if (data[0]. RESULTKEY === 'InUse') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.chemicalPurchaseResources.inuse });
          
          
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

}
