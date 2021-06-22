import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { RetailerService } from '../../services/retailer.service';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
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
export class RetailerComponent implements OnInit {
  retailerForm: FormGroup;
  retailerResources: any;
  globalResource: any;
  // Removed by Devdan :: 28-Sep-2018
  // Clients: any[];
  Countries: any[];
  States: any[];
  Cities: any[];
  public msgs: any[];
  public _cookieService: any;
  public retailerForm_copy: any;
  public allretailerList: any;
  retailerTypes: any[];
  submitted: boolean;
  // Added by Devdan
  selectedCountry: number;
  selectedState: number;
  selectedCity: number;
  selectedRetailer: any;
  public taskCategory: any;
  displayInfoDialog = false;
  IsActive: boolean;
  SaveButtonText = 'Save';
  Clear = 'Clear';
  pageheading = 'Add New Retailer';
  RetailerID: any = 0;
  event: any;
  PaginationValues: any;
  public priorities:any;
  private globalData = {
    // Removed by Devdan :: 28-Sep-2018
    // Clients: [],
    Countries: [],
    States: [],
    Cities: [],
    RetailTypes: [],
  };

  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private retailerActionService: RetailerService,
    private cookieService: CookieService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private AppComponentData: AppComponent,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService
   ) {
    }

  ngOnInit() {
     // Removed by Devdan :: 28-Sep-2018
    // this.getAllClients();
    this.getAllCountries();
    // Added by Devdan :: 28-Sep-2018
    this.getAllRetailerTypes();
    this.getRetailerDetailListByClient();
    this.priorities =  [
      {label: 'UPS Ground', value: 'UPS Ground'},
      {label: 'UPS 2 Day', value: 'UPS 2 Day'},
      {label: 'UPS 3 Day', value: 'UPS 3 Day'},
      {label: 'UPS Next Day', value: 'UPS Next Day'},
      {label: 'FedEx', value: 'FedEx'},
      {label: 'USPS', value: 'USPS'}
    ];
    // By Defalt Set IsActive = true :: Added by Devdan :: 28-Sep-2018
    this.IsActive = true;
    this.retailerResources = MastersResource.getResources().en.retailer;
    this.globalResource = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.taskCategory = this._cookieService.TaskCategory;
    if(this.taskCategory === 'GROWING'){
      this.AppComponentData.setTitle('Customer');
    }
    else{
      this.AppComponentData.setTitle('Retailer');
    }
    this.retailerForm = this.fb.group({
      // Removed by Devdan :: 28-Sep-2018
      // 'client': new FormControl(null, Validators.required),
      'retailerType': new FormControl(null, Validators.required),
      'retailer': new FormControl(null, Validators.required),
      'licenseNo': new FormControl(null),
      'ubiNo': new FormControl(null),
      'officePhone': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(15)])),
      'cellPhone': new FormControl('', Validators.compose([Validators.maxLength(15)])),
      // Removed by Devdan :: 28-Sep-2018
      // 'faxPhone': new FormControl(null),
      'primaryEmail': new FormControl(null,Validators.required),
      'secondaryEmail': new FormControl(null),
      'contactPerson': new FormControl(null),
      'shippingPre': new FormControl(),
      'address': new FormControl(null, Validators.required),
      'country': new FormControl({value: this.selectedCountry }, Validators.required),
      'state': new FormControl({value: this.selectedState}, Validators.required),
      'city': new FormControl(null, Validators.required),
      'zipCode': new FormControl(null, Validators.required),
      // Removed by Devdan :: 28-Sep-2018
      // 'latitude': new FormControl(null),
      // 'longitude': new FormControl(null),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    });
    this.loaderService.display(false);
  }

  ResetForm() {
    this.retailerForm.reset({TrimmedYesNo: false });

    this.pageheading = 'Add New Retailer';
    this.Clear = 'Clear';
    this.SaveButtonText = 'Save';
    // Resetting country :: Devdan :: 28-Sep-2018
    // this.selectedCountry = JSON.parse(this.appCommonService.Decrypt(this.cookieService.get('userProfile'))).CountryId;
    this.selectedCountry = this._cookieService.CountryId;
    if (this.selectedCountry > 0) {
      this.retailerForm.controls['country'].patchValue(this.selectedCountry);
      this.CountryChange();
    }
    // resetting State :: Devdan :: 28-Sep-2018
    // this.selectedState = JSON.parse(this.appCommonService.Decrypt(this.cookieService.get('userProfile'))).StateId;
    this.selectedState = this._cookieService.StateId;
    if (this.selectedState > 0) {
      this.retailerForm.controls['state'].patchValue(this.selectedState);
      this.StateChange();
    }
    this.RetailerID = 0;
  }

  // Removed by Devdan :: 28-Sep-2018
  // getAllClients() {
  //   this.dropdownDataService.GetClientList().subscribe(
  //     data => {
  //       this.globalData.Clients = data;
  //       this.Clients = this.dropdwonTransformService.transform(data, 'ClientName', 'ClientId', '-- Select --');
  //     } ,
  //     error => { console.log(error); },
  //     () => console.log('Get all clients complete'));
  // }

  getAllCountries() {
    this.dropdownDataService.getCountryList().subscribe(
      data => {
        this.globalData.Countries = data;
        this.Countries  = this.dropdwonTransformService.transform(data, 'CountryName', 'CountryId', '-- Select --');
        // Get the Clients Country from the Cookie ::: Added by Devdan :: 28-Sep-2018
        this.selectedCountry = this._cookieService.CountryId;
        if (this.selectedCountry > 0) {
          this.retailerForm.controls['country'].patchValue(this.selectedCountry);
          this.CountryChange();
        }
      } ,
      error => { console.log(error); },
      () => console.log('Get all country complete'));
  }
  CountryChange() {
    // this.retailerForm.value.state = null;
    // this.retailerForm.value.city = null;
    this.getAllStates();
    this.getAllCities();
 }
  StateChange() {
    // this.retailerForm.value.city = null;
    this.getAllCities();
  }
  getAllStates() {
    this.dropdownDataService.getStatesList().subscribe(
      data => {
        this.globalData.States = data;
        this.States = this.dropdwonTransformService.transform(
          data.filter(x => x.CountryID === this.retailerForm.value.country), 'StateName', 'StateId', '-- Select --');
          // Get the Clients State from the Cookie ::: Added by Devdan :: 28-Sep-2018
        // this.selectedState = this._cookieService.StateId;
        // if (this.selectedState > 0) {
        //   this.retailerForm.controls['state'].patchValue(this.selectedState);
        //   // this.StateChange();
        // }
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }
  getAllCities() {
    this.dropdownDataService.getCitiesList().subscribe(
      data => {
        this.globalData.Cities = data;
        this.Cities = this.dropdwonTransformService.transform(
          data.filter(x => x.StateId === this.retailerForm.value.state), 'CityName', 'CityId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete')
    );
  }
  getAllRetailerTypes() {
    this.dropdownDataService.getRetailerTypeList().subscribe(
      data => {
        this.globalData.RetailTypes = data;
        this.retailerTypes = this.dropdwonTransformService.transform(
          data, 'RType', 'RTypeId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete')
    );
  }

  onSubmit(value: string) {
    this.submitted = true;
    let RetailerDetailsForApi;
    RetailerDetailsForApi = {
      RetailerDetails: {
          RetlrId: this.RetailerID,
          // VirtualRoleId: this._cookieService.VirtualRoleId,
          // Added by Devdan :: 28-Sep-2018 :: Get the client id from User Profile cookie
          ClientId: this._cookieService.ClientId,
          RetailerTypeId: this.retailerForm.value.retailerType,
          RetailerName: this.retailerForm.value.retailer,
          RetailerCode: 0,
          LicenseNo: this.retailerForm.value.licenseNo,
          UBINo: this.retailerForm.value.ubiNo,
          officePhone: this.retailerForm.value.officePhone,
          cellPhone: this.retailerForm.value.cellPhone,
          // Removed by Devdan :: 28-Sep-2018
          // faxPhone: this.retailerForm.value.faxPhone,
          // primaryEmail: this.retailerForm.value.primaryEmail,
          // secondaryEmail: this.retailerForm.value.secondaryEmail,
          ShippingPreference: this.retailerForm.value.shippingPre == null? 'Ground':this.retailerForm.value.shippingPre,
          contactPerson: this.retailerForm.value.contactPerson,
          address: this.retailerForm.value.address,
          zipCode: this.retailerForm.value.zipCode,
          CityId: this.retailerForm.value.city,
          // Removed by Devdan :: 28-Sep-2018
          // latitude: this.retailerForm.value.latitude,
          // longitude: this.retailerForm.value.longitude,
          description: this.retailerForm.value.description,
          IsDeleted: 0,
          IsActive: this.retailerForm.value.chkIsActive ? 1 : 0
      },
      ContactDetails:[]
   
    };
    RetailerDetailsForApi.ContactDetails.push({
      FirstName:this.retailerForm.value.retailer,
      LastName :this.retailerForm.value.retailer,
      JobTitle :null,
      primaryEmail: this.retailerForm.value.primaryEmail,
      secondaryEmail: this.retailerForm.value.secondaryEmail,
      PrimaryPhone:this.retailerForm.value.cellPhone,
      PrimaryPhoneTypeId :0,
    SecondaryPhone :this.retailerForm.value.contactPerson,
      SecondaryPhoneTypeId :0,
     IsDeleted:false,
   VirtualRoleId :this._cookieService.VirtualRoleId,
  IsPrimaryContact :false
    });

    this.retailerForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.retailerForm.value)));

    if (this.retailerForm.valid) {
 // http call starts
 this.loaderService.display(true);
 this.retailerActionService.addRetailerDetails(RetailerDetailsForApi)
 .subscribe(
     data => {

       this.msgs = [];
       if (data === 'Success') {
        if (this.RetailerID === 0 ) {
          if(this.taskCategory == 'GROWING'){
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.retailerResources.customersuccess });
          }
          else{
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.retailerResources.retailersuccess });
          }
        } else {
          if(this.taskCategory == 'GROWING'){
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.retailerResources.custupdateSuccess });
          }
          else{
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.retailerResources.updateSuccess });
          }
        }

      this.ResetForm();
      this.getRetailerDetailListByClient();
       } else if (data === 'Failure') {
         this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
       } else if (data === 'Duplicate') {
        if(this.taskCategory == 'GROWING'){
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.retailerResources.customerexists });
        }
        else{
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.retailerResources.retailerexists });
        }
       } else if (data === 'NotUpdated') {
        if(this.taskCategory == 'GROWING'){
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.retailerResources.custupdateFailure });
        }
        else{
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.retailerResources.updateFailure });
        }
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
      this.appCommonService.validateAllFields(this.retailerForm);
    }
  }

  getRetailerDetailListByClient() {
    this.loaderService.display(true);
    this.retailerActionService.GetAllRetailerListByClient().subscribe(
      data => {
       if (data != 'No data found!') {
          this.allretailerList = data;
         
          this.PaginationValues = AppConstants.getPaginationOptions;
          if (this.allretailerList.length > 20) {
            this.PaginationValues[AppConstants.getPaginationOptions.length] = this.allretailerList.length;
          }
       } else {
        this.allretailerList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('getRetailerDetailListByClient complete'));
  }

  // Added By Devdan :: 28-Sep-2018 :: to show row details
  onRowSelect(event) {
    this.selectedRetailer = this.cloneRowData(event.data);
    this.displayInfoDialog = true;
  }
  cloneRowData(data: any): any {
    const rowData = {};
    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        // code here
        rowData[prop] = data[prop];
      }
    }
    return rowData;
  }
  GetRetailerOnEdit(RetailerId) {
  
    event.stopPropagation();
    const data = this.allretailerList.filter(x => x.RetailerId === RetailerId);
    // var itemlist = this.retailerForm.get('controls');
    if (data !== null) {
      this.RetailerID = RetailerId;
      this.getAllCities();
      this.getAllStates();
      // this.retailerForm.controls['retailerType'].patchValue(data[0].RetlrTypeID);
      // this.retailerForm.controls['retailer'].patchValue(data[0].RetailerName);
      // const state =   itemlist[0].controls["state"];
      this.retailerForm.patchValue({
        retailerType: data[0].RetlrTypeId,
        retailer: data[0].RetailerName,
        licenseNo: data[0].License,
        ubiNo: data[0].UBINo,
        officePhone: data[0].OfficePhone,
        cellPhone: data[0].PrimaryPhone,
        primaryEmail: data[0].PrimaryEmail,
        secondaryEmail: data[0].SecondaryEmail,
        shippingPre: data[0].ShippingPreference,
        contactPerson: data[0].ContactPerson,
        address: data[0].Address,
        country: data[0].CountryId,
       
        state: data[0].StateId,
        
        city: data[0].CityId,
        zipCode: data[0].ZipCode,
        description: data[0].Description,
        chkIsActive: data[0].IsActive
      });
      this.SaveButtonText = 'Update';
      this.pageheading = 'Edit Retailer';
      this.Clear = 'Cancel';
      this.scrolltopservice.setScrollTop();
    } else {
    this.allretailerList = [];
    }
    this.loaderService.display(false);
  }

  ShowConformationMessaegForDelete(RetailerId, retailer, IsDeleted, ActiveInactiveFlag) {
    event.stopPropagation();
    let strMessage: any;
    if(this.taskCategory == 'GROWING'){
      strMessage = 'Do you want to delete this customer?';
    }
    else{
      strMessage = 'Do you want to delete this retailer?';
    }
    
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.ActivateDeleteRetailer(RetailerId, retailer, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
  }

  ShowConformationMessaegForDeactive(RetailerId, retailer, rowIndex, IsDeleted, ActiveInactiveFlag) {
    event.stopPropagation();
    let strMessage: any;
    if (this.allretailerList[rowIndex].IsActive === true) {
      if(this.taskCategory == 'GROWING'){
        strMessage = 'Do you want to activate this Customer?';
      }
      else{
        strMessage = 'Do you want to activate this Retailer?';
      }
      
    } else {
      if(this.taskCategory == 'GROWING'){
        strMessage = 'Do you want to inactivate this Customer?';
      }
      else{
        strMessage = 'Do you want to inactivate this Retailer?';
      }
     
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.ActivateDeleteRetailer(RetailerId, retailer, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          retailer.IsActive = !retailer.IsActive;
        }
    });
  }

  onPageChange(e) {
    this.event = e;
  }

  ActivateDeleteRetailer(RetailerId, retailer, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    let RetailersDetailsForApi;
    // console.log(this.growerForm.value);

    RetailersDetailsForApi = {
      RetailerDeleteActive:{
        RetlrId:RetailerId,
        VirtualRoleId:this._cookieService.VirtualRoleId,
        IsActive:retailer.IsActive,
        IsDeleted:IsDeleted
      },
    
    };

    this.loaderService.display(true);
    this.retailerActionService.RetailerDeleteActive(RetailersDetailsForApi)
    .subscribe(
      data => {
        // console.log(data);
        this.msgs = [];
        if (data === 'Success' && ActiveInactiveFlag === 1) {
          if (retailer.IsActive !== true) {
            if(this.taskCategory == 'GROWING'){
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.retailerResources.custinactivated });
            }
            else{
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.retailerResources.inactivated });
            }
            
            this.getRetailerDetailListByClient();
            this.loaderService.display(false);
          } else {
            if(this.taskCategory == 'GROWING'){
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.retailerResources.custactivated });
            }
            else{
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.retailerResources.activated });
            }
            this.getRetailerDetailListByClient();
            this.loaderService.display(false);
          }
        } if (data === 'Success' && IsDeleted === 1) {
          if(this.taskCategory == 'GROWING'){
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.retailerResources.custdeletedSuccess });
          }
          else{
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.retailerResources.deletedSuccess });
          }
            this.getRetailerDetailListByClient();
            this.loaderService.display(false);
        } else if (data === 'NotUpdated') {
          if (IsDeleted === 1) {
            if(this.taskCategory == 'GROWING'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.retailerResources.custcannotdelete });
            }
            else{
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.retailerResources.cannotdelete });
            }
          } else if (retailer.IsActive === 1) {
            if(this.taskCategory == 'GROWING'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.retailerResources.custcannotInactivate });
            }
            else{
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.retailerResources.cannotInactivate });
            }
            retailer.IsActive = !retailer.IsActive;
          } else {
            if(this.taskCategory == 'GROWING'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.retailerResources.custcannotActivate });
            }
            else{
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.retailerResources.cannotActivate });
            }
           
            retailer.IsActive = !retailer.IsActive;
          }
        } else if (data === 'InUse') {
          this.msgs = [];
          if(this.taskCategory == 'GROWING'){
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.retailerResources.custinuse });
          }
          else{
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.retailerResources.inuse });
          }
          
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
