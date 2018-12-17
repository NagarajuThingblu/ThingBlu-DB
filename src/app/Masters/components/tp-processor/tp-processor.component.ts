import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { TpprocessorService } from '../../services/tpprocessor.service';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-tp-processor',
  templateUrl: './tp-processor.component.html',
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
export class TpProcessorComponent implements OnInit {
  tpprocessorForm: FormGroup;
  saveButtonText: any;
  pageheading: any;
  paginationValues: any;
  clear: any;
  tpprocessorResources: any;
  globalResources: any;
  chkIsActive: boolean;
  clients: any[];
  countries: any[];
  states: any[];
  cities: any[];
  event: any;
  public msgs: any[];
  public _cookieService: any;
  public tpprocessorForm_copy: any;
  public alltpprocessorList: any;
  tpPForUpdate: any;
  public growerOnEdit: any;
  submitted: boolean;
  private globalData = {
    clients: [],
    countries: [],
    states: [],
    cities: []
  };

  selectedTPProcessor: any;
  displayInfoDialog: boolean;

  constructor(private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private tpProcessorActionService: TpprocessorService,
    private cookieService: CookieService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service) { }
    private appComponentData: AppComponent,
    private scrolltopservice: ScrollTopService,
    private confirmationService: ConfirmationService,
  ) {
    this.getAllClients();
    this.getAllCountries();
    this.getTPProcessorDetailListByClient();

  }
  ngOnInit() {
    this.chkIsActive = true;
    this.pageheading = 'Add New TP Processor';
    this.clear = 'Clear';
    this.saveButtonText = 'Save';
    this.tpprocessorResources = MastersResource.getResources().en.tpprocessor;
    this.globalResources = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.appComponentData.setTitle('TP Processor');
    this.tpprocessorForm = this.fb.group({
      'client': new FormControl(Number(this._cookieService.ClientId), Validators.required),
      'tpprocessor': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(30)])),
      'expectedYeild': new FormControl(null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(100)])),
      'materialaspayment': new FormControl(null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(100)])),
      'expturnaroundtime': new FormControl(null, Validators.compose([Validators.required, Validators.min(0)])),
      'officePhone': new FormControl(null, Validators.compose([ Validators.required, Validators.maxLength(15)])),
      'cellPhone': new FormControl(null, Validators.maxLength(15)),
      'faxPhone': new FormControl(null, Validators.maxLength(15)),
      'primaryEmail': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(50)])),
      'secondaryEmail': new FormControl(null, Validators.maxLength(50)),
      'contactPerson': new FormControl(null, Validators.maxLength(150)),
      'country': new FormControl(null, Validators.required),
      'state': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'zipCode': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(9)])),
      'latitude': new FormControl(null, Validators.maxLength(20)),
      'longitude': new FormControl(null, Validators.maxLength(20)),
      'address': new FormControl(null, Validators.maxLength(500)),
      'description': new FormControl(null, Validators.maxLength(500)),
      'chkIsActive': new FormControl(null)
    });

    setTimeout(() => {
      const countryid = this.globalData.countries.filter(data => data.CountryName === 'United States')[0].CountryId;
      this.tpprocessorForm.controls['country'].patchValue(countryid);
      // To showing default state as Washington
      this.countryChange();
    }, 1000);

    this.loaderService.display(false);
  }

  resetForm() {
    this.tpprocessorForm.reset({ chkIsActive: true, client: Number(this._cookieService.ClientId) });

    setTimeout(() => {
      const countryid = this.globalData.countries.filter(data => data.CountryName === 'United States')[0].CountryId;
      this.tpprocessorForm.controls['country'].patchValue(countryid);
      // To showing default state as Washington
      this.countryChange();
    }, 1000);
    this.clear = 'Clear';
    this.saveButtonText = 'Save';
    this.pageheading = 'Add New TP Processor';
    this.tpPForUpdate = 0;
  }
  showConformationMessaegForDelete(TPId, tpprocessor, IsDeleted, ActiveInactiveFlag) {
    event.stopPropagation();
    let strMessage: any;
    strMessage = 'Do you want to delete this TP Processor?';
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteTPProcessor(TPId, tpprocessor, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
  });
  }
  showConformationMessaegForDeactive(TPId, tpprocessor, rowIndex, IsDeleted, ActiveInactiveFlag) {
    event.stopPropagation();
    let strMessage: any;
    if (this.alltpprocessorList[rowIndex].IsActive === true) {
      strMessage = 'Do you want to activate this TP Processor?';
    } else {
      strMessage = 'Do you want to inactivate this TP Processor?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteTPProcessor(TPId, tpprocessor, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          tpprocessor.IsActive = !tpprocessor.IsActive;
        }
    });
  }

  activateDeleteTPProcessor(TPId, tpprocessor, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    let tpProcessorDetailsForApi;
    // console.log(this.tpprocessorForm.value);

    tpProcessorDetailsForApi = {
      TPProcessorDetails: {
        TPId: TPId,
        VirtualRoleId: this._cookieService.VirtualRoleId,
        ClientId: Number(this._cookieService.ClientId),
        IsActive: tpprocessor.IsActive,
        IsDeleted: IsDeleted,
        ActiveInactive: ActiveInactiveFlag
      }
    };

    // console.log(tpProcessorDetailsForApi);
       this.loaderService.display(true);
      // this.growerDetailsActionService.addRowSuplierDetails(RowSuplierDetailsForApi)
      this.tpProcessorActionService.addTPProcessorDetails(tpProcessorDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (data === 'Success' && ActiveInactiveFlag === 1) {
              if (tpprocessor.IsActive !== true) {
                this.msgs.push({severity: 'success', summary: this.globalResources.applicationmsg,
                detail: this.tpprocessorResources.inactivated });
                this.getTPProcessorDetailListByClient();
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'success', summary: this.globalResources.applicationmsg,
                detail: this.tpprocessorResources.activated });
                this.getTPProcessorDetailListByClient();
                this.loaderService.display(false);
              }
            } if (data === 'Success' && IsDeleted === 1) {
                this.msgs.push({severity: 'success', summary: this.globalResources.applicationmsg,
                detail: this.tpprocessorResources.deletedSuccess });
                this.getTPProcessorDetailListByClient();
                this.loaderService.display(false);
            } else if (data === 'NotUpdated') {
              if (IsDeleted === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResources.applicationmsg,
                detail: this.tpprocessorResources.cannotdelete });
              } else if (tpprocessor.IsActive !== 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResources.applicationmsg,
                detail: this.tpprocessorResources.cannotInactivate });
                tpprocessor.IsActive = !tpprocessor.IsActive;
              } else {
                this.msgs.push({severity: 'warn', summary: this.globalResources.applicationmsg,
                detail: this.tpprocessorResources.cannotActivate });
                tpprocessor.IsActive = !tpprocessor.IsActive;
              }
            } else if (data === 'InUse') {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResources.applicationmsg,
              detail: this.tpprocessorResources.inuse});
            }
              this.loaderService.display(false);
          },
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResources.applicationmsg, detail: error.message });
            this.loaderService.display(false);
          });
  }

  getAllClients() {
    this.dropdownDataService.getClientList().subscribe(
      data => {
        console.log('Get all clients complete');
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
    this.tpprocessorForm.value.state = null;
    this.tpprocessorForm.value.city = null;
    this.getAllStates();
    this.getAllCities();
 }

  stateChange() {
    this.tpprocessorForm.value.city = null;
    this.getAllCities();
  }

  getAllStates() {
    this.dropdownDataService.getStatesList().subscribe(
      data => {
        this.globalData.states = data;
        this.states = this.dropdwonTransformService.transform(
          data.filter(x => x.CountryID === this.tpprocessorForm.value.country), 'StateName', 'StateId', '-- Select --');

          const stateid = this.globalData.states.filter(data1 => data1.StateName === 'Washington')[0].StateId;
          this.tpprocessorForm.controls['state'].patchValue(stateid);
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }

  getAllCities() {
    this.dropdownDataService.getCitiesList().subscribe(
      data => {
        this.globalData.cities = data;
        this.cities = this.dropdwonTransformService.transform(
          data.filter(x => x.StateId === this.tpprocessorForm.value.state), 'CityName', 'CityId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }

  getTPProcessorDetailListByClient() {
    this.loaderService.display(true);
    this.tpProcessorActionService.getAlltpProcessorListByClient().subscribe(
      data => {
        // console.log(data);
       if (data !== 'No data found!') {
          this.alltpprocessorList = data;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.alltpprocessorList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.alltpprocessorList.length;
          }
       } else {
        this.alltpprocessorList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('getTPProcessorDetailListByClient complete'));
  }
  getTppOnEdit(TPId) {
    // console.log(this.tpprocessorForm);
    //  this.growerDetailsActionService.getGrowerListByRawSupId(RawSupId).subscribe(
        event.stopPropagation();
       const data = this.alltpprocessorList.filter(x => x.TPId === TPId);
        // console.log(data);
        if (data !== null) {
          this.tpPForUpdate = TPId;
          this.growerOnEdit = data;
          const clientname = this.tpprocessorForm.controls['client'];
          const tpprocessor = this.tpprocessorForm.controls['tpprocessor'];
          const expectedYeild = this.tpprocessorForm.controls['expectedYeild'];
          const materialaspayment = this.tpprocessorForm.controls['materialaspayment'];
          const expturnaroundtime = this.tpprocessorForm.controls['expturnaroundtime'];
          const officePhone = this.tpprocessorForm.controls['officePhone'];
          const cellphone = this.tpprocessorForm.controls['cellPhone'];
          const faxphone = this.tpprocessorForm.controls['faxPhone'];
          const primaryemail = this.tpprocessorForm.controls['primaryEmail'];
          const secondaryemail = this.tpprocessorForm.controls['secondaryEmail'];
          const contactperson = this.tpprocessorForm.controls['contactPerson'];
          const address = this.tpprocessorForm.controls['address'];
          const country = this.tpprocessorForm.controls['country'];
          this.getAllStates();
          const state = this.tpprocessorForm.controls['state'];
          this.getAllCities();
          const city = this.tpprocessorForm.controls['city'];
          const zipcode = this.tpprocessorForm.controls['zipCode'];
          const latitude = this.tpprocessorForm.controls['latitude'];
          const longitude = this.tpprocessorForm.controls['longitude'];
          const description = this.tpprocessorForm.controls['description'];
          const chkIsActive = this.tpprocessorForm.controls['chkIsActive'];
          this.getAllClients();
          clientname.patchValue(this.growerOnEdit[0].ClientId);
          tpprocessor.patchValue(this.growerOnEdit[0].TPName);
          expectedYeild.patchValue(this.growerOnEdit[0].ExpectedYield);
          materialaspayment.patchValue(this.growerOnEdit[0].MaterialPaymant);
          expturnaroundtime.patchValue(this.growerOnEdit[0].TurnAroundDays);
          officePhone.patchValue(this.growerOnEdit[0].OfficePhone);
          cellphone.patchValue(this.growerOnEdit[0].CellPhone);
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
          this.pageheading = 'Edit TP Processor';
          this.clear = 'Cancel';
          this.scrolltopservice.setScrollTop();
        } else {
        this.alltpprocessorList = [];
        }
        this.loaderService.display(false);
  }
  onPageChange(e) {
    this.event = e;
  }

  // Added By Bharat T on 25th-Sept-2018 to show row details
  onRowSelect(event) {
    this.selectedTPProcessor = this.cloneRowData(event.data);
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

  onSubmit(value: string) {
    if (String(this.tpprocessorForm.value.tpprocessor).trim().length === 0) {
      this.tpprocessorForm.controls['tpprocessor'].setErrors({'whitespace': true});
      this.tpprocessorForm.value.tpprocessor = null;
      return;
    }

    const priEmail = this.tpprocessorForm.value.primaryEmail;
    const secEmail = this.tpprocessorForm.value.secondaryEmail;
    if ((priEmail !== '' || priEmail !== null) && (secEmail !== '' || secEmail !== null)) {
      if (String(priEmail).trim() === String(secEmail).trim()) {
        this.tpprocessorForm.controls['secondaryEmail'].setErrors({'duplicateEmail': true});
        return;
      }
    }
    this.submitted = true;
    let tpProcessorDetailsForApi;
    // console.log(this.tpprocessorForm.value);

    tpProcessorDetailsForApi = {
      TPProcessorDetails: {
          TPId: this.tpPForUpdate,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          // ClientId: this.tpprocessorForm.value.client,
          ClientId: Number(this._cookieService.ClientId),
          TPName: this.appCommonService.trimString(this.tpprocessorForm.value.tpprocessor),
          TPCode: 0,
          ExpectedYield: this.tpprocessorForm.value.expectedYeild,
          MaterialPaymant: this.tpprocessorForm.value.materialaspayment,
          TurnAroundDays: this.tpprocessorForm.value.expturnaroundtime,
          OfficePhone: this.appCommonService.trimString(this.tpprocessorForm.value.officePhone),
          cellPhone: this.appCommonService.trimString(this.tpprocessorForm.value.cellPhone),
          faxPhone: '',
          primaryEmail: this.appCommonService.trimString(this.tpprocessorForm.value.primaryEmail),
          secondaryEmail: this.appCommonService.trimString(this.tpprocessorForm.value.secondaryEmail),
          contactPerson: this.appCommonService.trimString(this.tpprocessorForm.value.contactPerson),
          address: this.appCommonService.trimString(this.tpprocessorForm.value.address),
          zipCode: this.tpprocessorForm.value.zipCode,
          CityId: this.tpprocessorForm.value.city,
          latitude: 0,
          longitude: 0,
          description: this.appCommonService.trimString(this.tpprocessorForm.value.description),
          IsDeleted: 0,
          IsActive: this.tpprocessorForm.value.chkIsActive ? 1 : 0,
      },
    };

    this.tpprocessorForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.tpprocessorForm.value)));
    // console.log(tpProcessorDetailsForApi);
    if (this.tpprocessorForm.valid) {
 // http call starts
 this.loaderService.display(true);
 this.tpProcessorActionService.addTPProcessorDetails(tpProcessorDetailsForApi)
 .subscribe(
     data => {
      //  console.log(data);

       this.msgs = [];
       if (data === 'Success') {
        // console.log(this.tpprocessorResources.tpprocessorsuccess);
         this.msgs.push({severity: 'success', summary: this.globalResources.applicationmsg , detail: this.tpprocessorResources.tpprocessorsuccess });
         this.resetForm();
         this.getTPProcessorDetailListByClient();
         // this.lotEntryForm.controls.get['growerlotno'].invalid = true;
       } else if (data === 'NotUpdated') {
        this.msgs.push({severity: 'warn', summary: this.globalResources.applicationmsg,
        detail: this.tpprocessorResources.noupdate });
      } else if (data === 'Failure') {
         this.msgs.push({severity: 'error', summary: this.globalResources.applicationmsg, detail: this.globalResources.serverError });
       } else if (data === 'Duplicate') {
         this.msgs.push({severity: 'warn', summary: this.globalResources.applicationmsg, detail: this.tpprocessorResources.tpprocessorexists });
       } else {
         this.msgs.push({severity: 'error', summary: this.globalResources.applicationmsg, detail: data });
       }
         // http call end
         this.loaderService.display(false);
     },
     error => {
       this.msgs = [];
       this.msgs.push({severity: 'error', summary: this.globalResources.applicationmsg, detail: error.message });

       // http call end
       this.loaderService.display(false);
     });
    } else {
      this.appCommonService.validateAllFields(this.tpprocessorForm);
    }
  }

}
