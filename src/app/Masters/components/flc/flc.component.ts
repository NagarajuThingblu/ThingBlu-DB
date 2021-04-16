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
import { FLCService } from '../../services/flc.service';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-flc',
  templateUrl: './flc.component.html',
  styles: [`
  .clsTableSelection tr.ui-state-highlight {
    background: transparent !important;
    color: #222222 !important;
    cursor: pointer;
  }

  .clsTableSelection tr:nth-child(even).ui-state-highlight {
    background: transparent !important;
    color: #222222 !important;
    cursor: pointer;
  }

  .clsTableSelection .ui-state-highlight a {
      color: #222222 !important;
  }
`]
})
export class FlcComponent implements OnInit {
  flcForm: FormGroup;
  globalResource: any;
  public _cookieService: any;
  selectedCountry: number;
  selectedState: number;
  public msgs: any[];
  submitted: boolean;
  FLCID: any = 0;
  event: any;
  public allcontractorList: any;
  IsActive: boolean;
  PaginationValues: any;
  SaveButtonText = 'Save';
  Clear = 'Clear';
  pageheading = 'Add New FLC';
  Countries: any[];
  States: any[];
  Cities: any[];
  private globalData = {
    Countries: [],
    States: [],
    Cities: [],
  };
  flcResources: any;
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private cookieService: CookieService,
    private flcActionService: FLCService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private AppComponentData: AppComponent,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService
  ) { }

  ngOnInit() {
    this.IsActive = true;
    this.globalResource = GlobalResources.getResources().en;
    this.AppComponentData.setTitle('Farm Labour Contract');
    this._cookieService = this.appCommonService.getUserProfile();
    this.flcResources = MastersResource.getResources().en.flc;
    this.getAllCountries()
    this.getFLCDetailListByClient()
    this.flcForm = this.fb.group({
      'flc': new FormControl(null, Validators.required),
      'cellPhone': new FormControl('', Validators.compose([Validators.maxLength(15)])),
      'primaryEmail': new FormControl(null,Validators.required),
      'secondaryEmail': new FormControl(null),
      'address': new FormControl(null, Validators.required),
      'country': new FormControl({value: this.selectedCountry }, Validators.required),
      'state': new FormControl({value: this.selectedState}, Validators.required),
      'city': new FormControl(null, Validators.required),
      'zipCode': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    })
    this.loaderService.display(false);
  }

  getAllCountries() {
    this.dropdownDataService.getCountryList().subscribe(
      data => {
        this.globalData.Countries = data;
        this.Countries  = this.dropdwonTransformService.transform(data, 'CountryName', 'CountryId', '-- Select --');
        // Get the Clients Country from the Cookie ::: Added by Devdan :: 28-Sep-2018
        this.selectedCountry = this._cookieService.CountryId;
        if (this.selectedCountry > 0) {
          this.flcForm.controls['country'].patchValue(this.selectedCountry);
          this.CountryChange();
        }
      } ,
      error => { console.log(error); },
      () => console.log('Get all country complete'));
  }
  CountryChange() {
    this.flcForm.value.state = null;
    this.flcForm.value.city = null;
    this.getAllStates();
    this.getAllCities();
 }
 getAllStates() {
  this.dropdownDataService.getStatesList().subscribe(
    data => {
      this.globalData.States = data;
      this.States = this.dropdwonTransformService.transform(
        data.filter(x => x.CountryID === this.flcForm.value.country), 'StateName', 'StateId', '-- Select --');
        // Get the Clients State from the Cookie ::: Added by Devdan :: 28-Sep-2018
      this.selectedState = this._cookieService.StateId;
      if (this.selectedState > 0) {
        this.flcForm.controls['state'].patchValue(this.selectedState);
        // this.StateChange();
      }
    } ,
    error => { console.log(error); },
    () => console.log('Get all State complete'));
}
getAllCities() {
  this.dropdownDataService.getCitiesList().subscribe(
    data => {
      this.globalData.Cities = data;
      this.Cities = this.dropdwonTransformService.transform(
        data.filter(x => x.StateId === this.flcForm.value.state), 'CityName', 'CityId', '-- Select --');
    } ,
    error => { console.log(error); },
    () => console.log('Get all State complete')
  );
}
StateChange() {
  this.flcForm.value.city = null;
  this.getAllCities();
}
getFLCDetailListByClient() {
  this.loaderService.display(true);
  this.flcActionService.GetAllFLCListByClient().subscribe(
    data => {
     if (data !== 'No data found!') {
        this.allcontractorList = data;
       
        this.PaginationValues = AppConstants.getPaginationOptions;
        if (this.allcontractorList.length > 20) {
          this.PaginationValues[AppConstants.getPaginationOptions.length] = this.allcontractorList.length;
        }
     } else {
      this.allcontractorList = [];
     }
     this.loaderService.display(false);
    } ,
    error => { console.log(error);  this.loaderService.display(false); },
    () => console.log('getFLCDetailListByClient complete'));
}

ResetForm() {
  this.flcForm.reset({chkIsActive: true });

  this.pageheading = 'Add New FLC';
  this.Clear = 'Clear';
  this.SaveButtonText = 'Save';
  // Resetting country :: Devdan :: 28-Sep-2018
  // this.selectedCountry = JSON.parse(this.appCommonService.Decrypt(this.cookieService.get('userProfile'))).CountryId;
  this.selectedCountry = this._cookieService.CountryId;
  if (this.selectedCountry > 0) {
    this.flcForm.controls['country'].patchValue(this.selectedCountry);
    this.CountryChange();
  }
  // resetting State :: Devdan :: 28-Sep-2018
  // this.selectedState = JSON.parse(this.appCommonService.Decrypt(this.cookieService.get('userProfile'))).StateId;
  this.selectedState = this._cookieService.StateId;
  if (this.selectedState > 0) {
    this.flcForm.controls['state'].patchValue(this.selectedState);
    this.StateChange();
  }
  this.FLCID = 0;
}
onSubmit(value: string){
  this.submitted = true;
  let FlcDetailsForApi;
  FlcDetailsForApi = {
    FLC:{
      FLCId:this.FLCID,
      ClientId:this._cookieService.ClientId,
      FLCName:this.flcForm.value.flc,
      PrimaryEmail:this.flcForm.value.primaryEmail,
      SecondaryEmail:this.flcForm.value.secondaryEmail,
      PhoneNo:this.flcForm.value.cellPhone,
      CityId:this.flcForm.value.city,
      Address:this.flcForm.value.address,
      ZipCode:this.flcForm.value.zipCode,
      Description:this.flcForm.value.description,
      IsActive:this.flcForm.value.chkIsActive ? 1 : 0,
      IsDeleted:0,
      VirtualRoleId:this._cookieService.VirtualRoleId,
      ActiveInactive:0
    },
  };
  if (this.flcForm.valid) {
    this.loaderService.display(true);
    this.flcActionService.addFlcDetails(FlcDetailsForApi)
    .subscribe(
      data => {
        this.msgs = [];
        if (data[0].RESULTKEY === 'SUCCESS') {
          if (this.FLCID === 0 ) {
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.flcResources.contractorsuccess });
          }
          else{
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.flcResources.updateSuccess });
          }
        }
        else if(data[0].RESULTKEY ===' Duplicate record found'){
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.flcResources.duplicate });
        }
        this.ResetForm(),
        this.getFLCDetailListByClient(),
        this.loaderService.display(false);
      }
    )
  }

}

GetFlcOnEdit(FLCId) {
  event.stopPropagation();
  const data = this.allcontractorList.filter(x => x.FLCId === FLCId);
  // var itemlist = this.retailerForm.get('controls');
  if (data !== null) {
    this.FLCID = FLCId;
    // this.retailerForm.controls['retailerType'].patchValue(data[0].RetlrTypeID);
    // this.retailerForm.controls['retailer'].patchValue(data[0].RetailerName);
    // const state =   itemlist[0].controls["state"];
    this.flcForm.patchValue({
     
      flc: data[0].FLCName,
      cellPhone: data[0].PhoneNo,
      primaryEmail: data[0].PrimaryEmail,
      secondaryEmail: data[0].SecondaryEmail,
      address: data[0].Address,
      country: data[0].CountryId,
      state: data[0].StateId,
      city: data[0].CityId,
      zipCode: data[0].ZipCode,
      description: data[0].Description,
      chkIsActive: data[0].IsActive
    });
    this.SaveButtonText = 'Update';
    this.pageheading = 'Edit FLC';
    this.Clear = 'Cancel';
    this.scrolltopservice.setScrollTop();
  } else {
  this.allcontractorList = [];
  }
  this.loaderService.display(false);
}

ShowConformationMessaegForDelete(FLCId, flc, IsDeleted, ActiveInactiveFlag) {
  event.stopPropagation();
  let strMessage: any;

    strMessage = 'Do you want to delete this FLC?';

  
  this.confirmationService.confirm({
    message: strMessage,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
      this.ActivateDeleteFLC(FLCId, flc, IsDeleted, ActiveInactiveFlag);
    },
    reject: () => {
    }
  });
}
ShowConformationMessaegForDeactive(FLCId, flc, rowIndex, IsDeleted, ActiveInactiveFlag) {
  event.stopPropagation();
  let strMessage: any;
  if (this.allcontractorList[rowIndex].IsActive === true) {
      strMessage = 'Do you want to activate this FLC?';
  } else {
      strMessage = 'Do you want to inactivate this FLC?';
  }
  this.confirmationService.confirm({
    message: strMessage,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
       this.ActivateDeleteFLC(FLCId, flc, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
        flc.IsActive = !flc.IsActive;
      }
  });
}


ActivateDeleteFLC(FLCId, flc, IsDeleted, ActiveInactiveFlag) {
  this.submitted = true;
  let FLCDetailsForApi;
  // console.log(this.growerForm.value);

  FLCDetailsForApi = {
    FLC:{
      FLCId:FLCId,
      ClientId:this._cookieService.ClientId,
      VirtualRoleId:this._cookieService.VirtualRoleId,
      IsActive:flc.IsActive,
      IsDeleted:IsDeleted,
      FLCName:flc.FLCName,
      PrimaryEmail:flc.primaryEmail,
      SecondaryEmail:flc.secondaryEmail,
      PhoneNo:flc.cellPhone,
      CityId:flc.city,
      Address:flc.address,
      ZipCode:flc.zipCode,
      Description:flc.description,
      ActiveInactive:ActiveInactiveFlag
    },
  
  };

  this.loaderService.display(true);
  this.flcActionService.addFlcDetails(FLCDetailsForApi)
  .subscribe(
    data => {
      // console.log(data);
      this.msgs = [];
      if (data[0]. RESULTKEY === 'SUCCESS' && ActiveInactiveFlag === 1) {
        if (flc.IsActive !== true) {
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.flcResources.flcinactivated });
          
          this.getFLCDetailListByClient();
          this.loaderService.display(false);
        } else {
          
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.flcResources.activated });
          
          this.getFLCDetailListByClient();
          this.loaderService.display(false);
        }
      } if (data[0]. RESULTKEY === 'SUCCESS' && IsDeleted === 1) {
        
     
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.flcResources.deletedSuccess });
        
          this.getFLCDetailListByClient();
          this.loaderService.display(false);
      } else if (data[0]. RESULTKEY === 'NotUpdated') {
        if (IsDeleted === 1) {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.flcResources.cannotdelete });
          
        } else if (flc.IsActive === 1) {
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.flcResources.cannotInactivate });
          
          flc.IsActive = !flc.IsActive;
        } else {
         
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.flcResources.cannotActivate });
         
          flc.IsActive = !flc.IsActive;
        }
      } else if (data[0]. RESULTKEY === 'Already Deleted') {
        this.msgs = [];
        
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.flcResources.alreadydlt });
        
        
      }else if (data[0]. RESULTKEY === 'InUse') {
        this.msgs = [];
        
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.flcResources.inuse });
        
        
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
onPageChange(e) {
  this.event = e;
}
// onRowSelect(event) {
//   this.selectedRetailer = this.cloneRowData(event.data);
//   this.displayInfoDialog = true;
// }


}
