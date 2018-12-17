import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { NewClientService } from '../../services/new-client.service';
import { AppComponent } from '../../../app.component';

@Component({
  moduleId : module.id,
  selector: 'app-add-new-client',
  templateUrl: './add-new-client.component.html'
})
export class AddNewClientComponent implements OnInit {
  clientForm: FormGroup;
  clientResources: any;
  globalResource: any;

  countries: any[];
  states: any[];
  cities: any[];
  public msgs: any[];
  public _cookieService: any;
  public clientForm_copy: any;
  public allClientList: any;
  public allUTCTimeZoneList: any;
  public allDateFormatList: any;
  submitted: boolean;

  private globalData = {
    countries: [],
    states: [],
    cities: [],
    utcTimeZones: [],
    dateFormats: []
  };

  ClientDetails = {
    client: null,
    contactPerson: null,
    UTCTimeZone: null,
    officePhone: null,
    cellPhone: null,
    faxPhone: null,
    primaryEmail: null,
    secondaryEmail: null,
    address: null,
    city: null,
    country: null,
    state: null,
    zipCode: null,
    latitude: null,
    longitude: null,
    description: null
  };


  constructor(private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private clientActionService: NewClientService,
    private cookieService: CookieService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private appComponentData: AppComponent,
  ) { this.getAllCountries();
    this.getClientDetailList();
    this.getUTCTimeZoneNameValue();
    this.getDateFormat();
  }

  ngOnInit() {
    this.clientResources = MastersResource.getResources().en.addnewclient;
    this.globalResource = GlobalResources.getResources().en;
    this.appComponentData.setTitle('Client');
    this._cookieService = this.appCommonService.getUserProfile();
    this.clientForm = this.fb.group({
      'client': new FormControl(null, Validators.required),
      'contactPerson': new FormControl(null, Validators.required),
      'UTCTimeZone': new FormControl(null),
      'officePhone': new FormControl(null, Validators.required),
      'cellPhone': new FormControl(null),
      'faxPhone': new FormControl(null),
      'primaryEmail': new FormControl(null, Validators.required),
      'secondaryEmail': new FormControl(null),
      'address': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'state': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'zipCode': new FormControl(null, Validators.required),
      'latitude': new FormControl(null),
      'longitude': new FormControl(null),
      'description': new FormControl(null),
      'dateFormat': new FormControl(null)
    });
    this.loaderService.display(false);
  }

  resetForm() {
    this.clientForm.reset({TrimmedYesNo: false });

    this.ClientDetails = {
      client: null,
      contactPerson: null,
      UTCTimeZone: null,
      officePhone: null,
      cellPhone: null,
      faxPhone: null,
      primaryEmail: null,
      secondaryEmail: null,
      address: null,
      city: null,
      country: null,
      state: null,
      zipCode: null,
      latitude: null,
      longitude: null,
      description: null,
    };
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
    this.clientForm.value.state = null;
    this.clientForm.value.city = null;
    this.getAllStates();
    this.getAllCities();
 }
  stateChange() {
    this.clientForm.value.city = null;
    this.getAllCities();
  }
  getAllStates() {
    this.dropdownDataService.getStatesList().subscribe(
      data => {
        this.globalData.states = data;
        this.states = this.dropdwonTransformService.transform(
          data.filter(x => x.CountryID === this.clientForm.value.country), 'StateName', 'StateId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }

  getAllCities() {
    this.dropdownDataService.getCitiesList().subscribe(
      data => {
        this.globalData.cities = data;
        this.cities = this.dropdwonTransformService.transform(
          data.filter(x => x.StateId === this.clientForm.value.state), 'CityName', 'CityId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }

  onSubmit(value: string) {
    this.submitted = true;
    let clientDetailsForApi;
    console.log(this.clientForm.value);

    clientDetailsForApi = {
      ClientDetails: {
        RetlrId: 0,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          ClientName: this.clientForm.value.client,
          contactPerson: this.clientForm.value.contactPerson,
          UtcTimeId: this.clientForm.value.UTCTimeZone,
          DateFormatId: this.clientForm.value.dateFormat,
          officePhone: this.clientForm.value.officePhone,
          cellPhone: this.clientForm.value.cellPhone,
          faxPhone: this.clientForm.value.faxPhone,
          primaryEmail: this.clientForm.value.primaryEmail,
          secondaryEmail: this.clientForm.value.secondaryEmail,
          address: this.clientForm.value.address,
          zipCode: this.clientForm.value.zipCode,
          CityId: this.clientForm.value.city,
          latitude: this.clientForm.value.latitude,
          longitude: this.clientForm.value.longitude,
          description: this.clientForm.value.description,
          IsDeleted: 0
      },

    };

    this.clientForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.clientForm.value)));

    console.log(clientDetailsForApi);
    if (this.clientForm.valid) {
 // http call starts
 this.loaderService.display(true);
 this.clientActionService.addClientDetails(clientDetailsForApi)
 .subscribe(
     data => {
       console.log(data);

       this.msgs = [];
       if (data === 'Success') {
        console.log(this.clientResources.retailersuccess);
         this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.clientResources.clientsuccess });
         this.resetForm();
         this.getClientDetailList();
         // this.lotEntryForm.controls.get['growerlotno'].invalid = true;
       } else if (data === 'Failure') {
         this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
       } else if (data === 'Duplicate') {
         this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.clientResources.clientexists });
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
      this.appCommonService.validateAllFields(this.clientForm);
    }
  }

  getClientDetailList() {
    this.loaderService.display(true);
    this.clientActionService.getAllClientList().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allClientList = data;
       } else {
        this.allClientList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('GetClientDetailList complete'));
  }

  getUTCTimeZoneNameValue() {
    this.loaderService.display(true);
    this.clientActionService.getUTCTimeZoneNameValue().subscribe(
      data => {
        this.globalData.utcTimeZones = data;
        this.allUTCTimeZoneList = this.dropdwonTransformService.transform(
          data, 'UtcTimeName', 'UtcTimeId', '-- Select --');
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('GetUTCTimeZoneNameValue complete'));
  }

  getDateFormat() {
    this.loaderService.display(true);
    this.clientActionService.getDateFormat().subscribe(
      data => {
        this.globalData.dateFormats = data;
        this.allDateFormatList = this.dropdwonTransformService.transform(
          data, 'DateFormatName', 'DateFormatId', '-- Select --');
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('GetDateFormat complete'));
  }



}
