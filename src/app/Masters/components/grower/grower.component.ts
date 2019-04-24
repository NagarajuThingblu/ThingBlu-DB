import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MastersResource } from '../../master.resource';
import { MenuItem, SelectItem, Message, ConfirmationService } from 'primeng/api';
import { GlobalResources } from '../../../global resource/global.resource';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { CookieService } from 'ngx-cookie-service';
import { GrowerDetailsActionService } from '../../../task/services/grower-details-action.service';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-grower',
  templateUrl: 'grower.component.html',
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
export class GrowerComponent implements OnInit {
  clear: any;
  pageheading = 'Add New Grower';
  growerForm: FormGroup;
  growerResources: any;
  globalResource: any;
  clients: any[];
  countries: any[];
  states: any[];
  cities: any[];
  public msgs: any[];
  public _cookieService: any;
  public growerForm_copy: any;
  public allGrowerList: any;
  public saveButtonText: any;
  public growerForUpdate: any = 0;
  public growerOnEdit: any;
  public event: any;
  paginationValues: any;
  private globalData = {
    clients: [],
    countries: [],
    states: [],
    cities: []
  };

  submitted: boolean;
  chkIsActive: boolean;

  selectedGrower: any;
  displayInfoDialog: boolean;
  public backUrl: boolean;


  constructor(private loaderService: LoaderService,
  private fb: FormBuilder,
  private appCommonService: AppCommonService,
  private growerDetailsActionService: GrowerDetailsActionService, // for saving form details service
  private cookieService: CookieService,
  private dropdwonTransformService: DropdwonTransformService,
  private dropdownDataService: DropdownValuesService, // For common used dropdown service
  private confirmationService: ConfirmationService,
  private appComponentData: AppComponent,
  private scrolltopservice: ScrollTopService,
  private router: Router
  ) {
    this.getAllClients();
    this.getAllCountries();
    this.getRowSuplierDetailListByClient();
    this.saveButtonText = 'Save';
  }

  ngOnInit() {
    this.backUrl = this.appCommonService.lotPageBackLink;
    this.chkIsActive = true;
    this.appComponentData.setTitle('Grower');
    this.clear = 'Clear';
    this.growerResources = MastersResource.getResources().en.grower;
    this.globalResource = GlobalResources.getResources().en;

    this._cookieService = this.appCommonService.getUserProfile();

    this.growerForm = this.fb.group({
      'client': new FormControl(Number(this._cookieService.ClientId), Validators.required),
      'grower': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(30)])),
      'officePhone': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(15)])),
      'cellPhone': new FormControl(null, Validators.compose([Validators.maxLength(15)])),
      'faxPhone': new FormControl(null, Validators.compose([Validators.maxLength(15)])),
      'primaryEmail': new FormControl(null, Validators.maxLength(50)),
      'secondaryEmail': new FormControl(null, Validators.maxLength(50)),
      'contactPerson': new FormControl(null, Validators.maxLength(150)),
      'address': new FormControl(null, Validators.maxLength(500)),
      'country': new FormControl(null, Validators.required), // For showing default value as United State
      'state': new FormControl(null, Validators.required), // For showing default value as Washington
      'city': new FormControl(null, Validators.required),
      'zipCode': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(9)])),
      'latitude': new FormControl(null, Validators.maxLength(20)),
      'longitude': new FormControl(null, Validators.maxLength(20)),
      'description': new FormControl(null, Validators.maxLength(500)),
      'chkIsActive': new FormControl(null)
    });

    setTimeout(() => {
      const countryid = this.globalData.countries.filter(data => data.CountryName === 'United States')[0].CountryId;
      this.growerForm.controls['country'].patchValue(countryid);
      // To showing default state as Washington
      this.countryChange();
    }, 1000);

    this.loaderService.display(false);
  }

  resetForm() {
    this.growerForm.reset({ chkIsActive: true, client: Number(this._cookieService.ClientId)});

    setTimeout(() => {
      const countryid = this.globalData.countries.filter(data => data.CountryName === 'United States')[0].CountryId;
      this.growerForm.controls['country'].patchValue(countryid);
      // To showing default state as Washington
      this.countryChange();
    }, 1000);
    this.pageheading = 'Add New Grower';
    this.clear = 'Clear';
    this.saveButtonText = 'Save';
    this.growerForUpdate = 0;
  }

  getAllClients() {
    this.dropdownDataService.getClientList().subscribe(
      data => {
        this.globalData.clients = data;
        this.clients = this.dropdwonTransformService.transform(data, 'ClientName', 'ClientId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all clients complete'));
  }

  getAllCountries() {
    this.dropdownDataService.getCountryList().subscribe(
      data => {
        this.globalData.countries = data;
        this.countries  = this.dropdwonTransformService.transform(data, 'CountryName', 'CountryId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all country complete'));
  }

  countryChange() {
    this.growerForm.value.state = null;
    this.growerForm.value.city = null;
    this.getAllStates();
    this.getAllCities();
 }
 onPageChange(e) {
  this.event = e;
}
  stateChange() {
    this.growerForm.value.city = null;
    this.getAllCities();
  }

  getAllStates() {
    this.dropdownDataService.getStatesList().subscribe(
      data => {
        this.globalData.states = data;
        this.states = this.dropdwonTransformService.transform(
          data.filter(x => x.CountryID === this.growerForm.value.country), 'StateName', 'StateId', '-- Select --');

          const stateid = this.globalData.states.filter(data1 => data1.StateName === 'Washington')[0].StateId;
          this.growerForm.controls['state'].patchValue(stateid);
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }

  getAllCities() {
    this.dropdownDataService.getCitiesList().subscribe(
      data => {
        this.globalData.cities = data;
        this.cities = this.dropdwonTransformService.transform(
          data.filter(x => x.StateId === this.growerForm.value.state), 'CityName', 'CityId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }

  onSubmit(value: string) {
    if (String(this.growerForm.value.grower).trim().length === 0) {
      this.growerForm.controls['grower'].setErrors({'whitespace': true});
      this.growerForm.value.grower = null;
      return;
    }
    this.submitted = true;
    let rowSuplierDetailsForApi;
    // console.log(this.growerForm.value);
    // alert(this.growerForUpdate);
    rowSuplierDetailsForApi = {
      RowSuplierDetails: {
        RawSupId: this.growerForUpdate,
        VirtualRoleId: this._cookieService.VirtualRoleId,
        // ClientId: this.growerForm.value.client,
        ClientId: Number(this._cookieService.ClientId),
        RawSupplierName: this.appCommonService.trimString(this.growerForm.value.grower),
        RawSuplrCode: 0,
        BrandName: null,
        BrandCode: 0,
        officePhone: this.appCommonService.trimString(this.growerForm.value.officePhone),
        cellPhone: this.appCommonService.trimString(this.growerForm.value.cellPhone),
        faxPhone: '',
        primaryEmail: this.appCommonService.trimString(this.growerForm.value.primaryEmail),
        secondaryEmail: this.appCommonService.trimString(this.growerForm.value.secondaryEmail),
        contactPerson: this.appCommonService.trimString(this.growerForm.value.contactPerson),
        address: this.appCommonService.trimString(this.growerForm.value.address),
        zipCode: this.growerForm.value.zipCode,
        CityId: this.growerForm.value.city,
        latitude: 0,
        longitude: 0,
        description: this.appCommonService.trimString(this.growerForm.value.description),
        IsActive: this.growerForm.value.chkIsActive ? 1 : 0
      },
    };

    this.growerForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.growerForm.value)));

    // console.log(rowSuplierDetailsForApi);
    if (this.growerForm.valid) {
 // http call starts
 this.loaderService.display(true);
 this.growerDetailsActionService.addRowSuplierDetails(rowSuplierDetailsForApi)
 .subscribe(
     data => {
      //  console.log(data);

       this.msgs = [];
       if (data === 'Success') {
        // console.log(this.globalResource.growersavedsuccess);
         this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
         detail: this.growerResources.growersavedsuccess });
         this.resetAll();
         this.getRowSuplierDetailListByClient();
         // this.lotEntryForm.controls.get['growerlotno'].invalid = true;
       } else if (data === 'NotUpdated') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.growerResources.noupdate });
      } else if (data === 'Failure') {
         this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
       } else if (data === 'Duplicate') {
         this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
         detail: this.growerResources.groweralreadyexist });
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
      this.appCommonService.validateAllFields(this.growerForm);
    }
  }

  getRowSuplierDetailListByClient() {
     this.loaderService.display(true);
     this.growerDetailsActionService.getRowSuplierDetailList().subscribe(
       data => {
        // console.log(data);
        if (data !== 'No data found!') {
           this.allGrowerList = data;
           this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allGrowerList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allGrowerList.length;
          }
        } else {
         this.allGrowerList = [];
        }
        this.loaderService.display(false);
       } ,
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getRowSuplierDetailListByClient complete'));
   }
   resetAll() {
    this.growerForUpdate = 0;
    this.saveButtonText = 'Save';
    this.resetForm();
  }

  // Added By Bharat T on 25th-Sept-2018 to show row details
  onRowSelect(event) {
    this.selectedGrower = this.cloneRowData(event.data);
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
  // End of Added By Bharat T on 25th-Sept-2018 to show row details

  getGrowerOnEdit(RawSupId) {
    event.stopPropagation();
    // console.log(this.allGrowerList);
    //  this.growerDetailsActionService.getGrowerListByRawSupId(RawSupId).subscribe(
       const data = this.allGrowerList.filter(x => x.RawSupId === RawSupId);
        // console.log(data);
        if (data !== null) {
          this.growerForUpdate = RawSupId;
          this.growerOnEdit = data;
          const clientname = this.growerForm.controls['client'];
          const grower = this.growerForm.controls['grower'];
          const officephone = this.growerForm.controls['officePhone'];
          const cellphone = this.growerForm.controls['cellPhone'];
          const faxphone = this.growerForm.controls['faxPhone'];
          const primaryemail = this.growerForm.controls['primaryEmail'];
          const secondaryemail = this.growerForm.controls['secondaryEmail'];
          const contactperson = this.growerForm.controls['contactPerson'];
          const address = this.growerForm.controls['address'];
          const country = this.growerForm.controls['country'];
          this.getAllStates();
          const state = this.growerForm.controls['state'];
          this.getAllCities();
          const city = this.growerForm.controls['city'];
          const zipcode = this.growerForm.controls['zipCode'];
          const latitude = this.growerForm.controls['latitude'];
          const longitude = this.growerForm.controls['longitude'];
          const description = this.growerForm.controls['description'];
          const chkIsActive = this.growerForm.controls['chkIsActive'];
          this.getAllClients();
          clientname.patchValue(this.growerOnEdit[0].ClientId);
          grower.patchValue(this.growerOnEdit[0].RawSupplierName);
          cellphone.patchValue(this.growerOnEdit[0].CellPhone);
          officephone.patchValue(this.growerOnEdit[0].OfficePhone);
          faxphone.patchValue(this.growerOnEdit[0].FaxPhone);
          primaryemail.patchValue(this.growerOnEdit[0].PrimaryEmail);
          secondaryemail.patchValue(this.growerOnEdit[0].SecondaryEmail);
          contactperson.patchValue(this.growerOnEdit[0].ContactPerson);
          address.patchValue(this.growerOnEdit[0].Address);
          country.patchValue(this.growerOnEdit[0].CountryId);
          state.patchValue(this.growerOnEdit[0].StateId);
          city.patchValue(this.growerOnEdit[0].CityId);
          zipcode.patchValue(this.growerOnEdit[0].ZipCode);
          latitude.patchValue(this.growerOnEdit[0].Latitude);
          longitude.patchValue(this.growerOnEdit[0].Longitude);
          description.patchValue(this.growerOnEdit[0].Description);
          chkIsActive.patchValue(this.growerOnEdit[0].IsActive);
          this.saveButtonText = 'Update';
          this.pageheading = 'Edit Grower';
          this.clear = 'Cancel';
          this.scrolltopservice.setScrollTop();
        } else {
        this.allGrowerList = [];
        }
        this.loaderService.display(false);
  }

  showConformationMessaegForDelete(RowSupId, grower, IsDeleted, ActiveInactiveFlag) {
    event.stopPropagation();
    let strMessage: any;
    strMessage = 'Do you want to delete this Grower?';
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteGrower(RowSupId, grower, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
  });
  }

  showConformationMessaegForDeactive(RowSupId, grower, rowIndex, IsDeleted, ActiveInactiveFlag) {
    event.stopPropagation();
    let strMessage: any;
    if (this.allGrowerList[rowIndex].IsActive === true) {
      strMessage = 'Do you want to activate this Grower?';
    } else {
      strMessage = 'Do you want to inactivate this Grower?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteGrower(RowSupId, grower, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          grower.IsActive = !grower.IsActive;
        }
    });
  }

  activateDeleteGrower(RowSupId, grower, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    let rowSuplierDetailsForApi;
    // console.log(this.growerForm.value);

    rowSuplierDetailsForApi = {
      RowSuplierDetails: {
        RawSupId: RowSupId,
        VirtualRoleId: this._cookieService.VirtualRoleId,
        ClientId: Number(this._cookieService.ClientId),
        IsDeleted: IsDeleted,
        IsActive: grower.IsActive,
        ActiveInactive: ActiveInactiveFlag
      }
    };

    // console.log(rowSuplierDetailsForApi);
       this.loaderService.display(true);
      this.growerDetailsActionService.addRowSuplierDetails(rowSuplierDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (data === 'Success' && ActiveInactiveFlag === 1) {
              if (grower.IsActive !== true) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.growerResources.inactivated });
                this.getRowSuplierDetailListByClient();
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.growerResources.activated });
                this.getRowSuplierDetailListByClient();
                this.loaderService.display(false);
              }
            } if (data === 'Success' && IsDeleted === 1) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.growerResources.deletedSuccess });
                this.getRowSuplierDetailListByClient();
                this.loaderService.display(false);
            } else if (data === 'NotUpdated') {
              if (IsDeleted === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.growerResources.cannotdelete });
              } else if (grower.IsActive === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.growerResources.cannotInactivate });
                grower.IsActive = !grower.IsActive;
              } else {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.growerResources.cannotActivate });
                grower.IsActive = !grower.IsActive;
              }
            } else if (data === 'InUse') {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: 'Can`t delete. Record is in use.'});
            }
              this.loaderService.display(false);
          },
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            this.loaderService.display(false);
          });
  }

  // back link changes
  backToLot() {
    this.router.navigate(['../home/lotentry']);
  }
}
