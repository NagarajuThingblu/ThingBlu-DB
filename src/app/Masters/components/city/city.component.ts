import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { CityService } from '../../services/city.service';
import { AppComponent } from '../../../app.component';

@Component({
  moduleId : module.id,
  selector: 'app-city',
  templateUrl: './city.component.html'
})
export class CityComponent implements OnInit {
  cityForm: FormGroup;
  cityResources: any;
  globalResource: any;
  countries: any[];
  states: any[];
  cities: any[];
  public msgs: any[];
  public _cookieService: any;
  public cityForm_copy: any;
  public allCityList: any;
  public cityListActionService: CityService;
  submitted: boolean;

  public CountryInfo: any = {
    CountryName: null,
    showCountryModal: false
  };

  public StateInfo: any = {
    StateName: null,

    showStateModal: false,
    allCountries: []
  };

  cityDetails = {
    city: null,
    country: null,
    state: null
  };

  constructor(private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private cityActionService: CityService,
    // private cookieService: CookieService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service) { }
    private appComponentData: AppComponent,
  ) {
    this.getAllCountries();
    this.getCityDetailList();
  }

  private globalData = {
    clients: [],
    countries: [],
    states: [],
    cities: []
  };
  ngOnInit() {
    this.cityResources = MastersResource.getResources().en.addnewcity;
    this.globalResource = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.appComponentData.setTitle('City');
    this.cityForm = this.fb.group({
      'country': new FormControl(null, Validators.required ),
      'state': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required)
    });
    this.loaderService.display(false);
  }

  resetForm() {
    this.cityForm.reset({TrimmedYesNo: false });

    this.cityDetails = {
      city: null,
      country: null,
      state: null
    };
  }

  getAllCountries() {
    this.dropdownDataService.getCountryList().subscribe(
      data => {
        this.globalData.countries = data;
        this.countries  = this.dropdwonTransformService.transform(data, 'CountryName', 'CountryId', '-- Select --');
        this.StateInfo.allCountries = this.countries;
        this.getAllStates();
      } ,
      error => { console.log(error); },
      () => console.log('Get all country complete'));
  }

  countryChange() {
    this.cityForm.value.state = null;
    this.cityForm.value.city = null;
    this.getAllStates();
 }

  stateChange() {
    this.cityForm.value.city = null;
  }

  getAllStates() {
    this.dropdownDataService.getStatesList().subscribe(
      data => {
        this.globalData.states = data;
        this.states = this.dropdwonTransformService.transform(
          data.filter(x => x.CountryID === this.cityForm.value.country), 'StateName', 'StateId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all State complete'));
  }

  showCountryPopup() {
    this.CountryInfo.country = null;
    this.CountryInfo.showCountryModal = true;
    this.loaderService.display(false);
  }

  showStatePopup() {
    this.StateInfo.state = null;
    this.StateInfo.getAllCountries = this.globalData.countries;
    this.StateInfo.showStateModal = true;
    this.getAllCountries();
    this.loaderService.display(false);
  }

  OnStateSave(OnCountrySave) {
    this.getAllCountries();
    const country = this.cityForm.controls['country'];
    country.patchValue(OnCountrySave.country);
    console.log(OnCountrySave);
    this.getAllStates();
    const state = this.cityForm.controls['state'];
    state.patchValue(OnCountrySave.state);
  }

  onSubmit(value: string) {
    this.submitted = true;
    let cityDetailsForApi;
    console.log(this.cityForm.value);

    cityDetailsForApi = {
      CityNames: {
        CityId: 0,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          StateId: this.cityForm.value.state,
          CityName: this.cityForm.value.city,
          Description: null,
          IsDeleted: 0
      },

    };

    this.cityForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.cityForm.value)));

    console.log(cityDetailsForApi);
    if (this.cityForm.valid) {
 // http call starts
 this.loaderService.display(true);
 this.cityActionService.addCityDetails(cityDetailsForApi)
 .subscribe(
     data => {
       console.log(data);

       this.msgs = [];
       if (data === 'Success') {
        console.log(this.cityResources.retailersuccess);
         this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.cityResources.citysuccess });
         this.resetForm();
         this.getCityDetailList();
         // this.lotEntryForm.controls.get['growerlotno'].invalid = true;
       } else if (data === 'Failure') {
         this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
       } else if (data === 'Duplicate') {
         this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.cityResources.cityexists });
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
      this.appCommonService.validateAllFields(this.cityForm);
    }
  }

  getCityDetailList() {
  this.loaderService.display(true);
  this.cityActionService.getAllCityList().subscribe(
    data => {
     if (data !== 'No data found!') {
        this.allCityList = data;
     } else {
      this.allCityList = [];
     }
     this.loaderService.display(false);
    } ,
    error => { console.log(error);  this.loaderService.display(false); },
    () => console.log('GetCityDetailList complete'));
}

OnCountrySave(CountryId) {
  console.log(CountryId);
  this.getAllCountries();
  const country = this.cityForm.controls['country'];
  country.patchValue(CountryId);
}
}
