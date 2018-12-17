import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { NewBrandActionService } from '../../../task/services/new-brand.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-add-new-country',
  templateUrl: './add-new-country.component.html'
})
export class AddNewCountryComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('Country') Country: any;
  @ViewChild('CountryForm') CountryForm;
  @Output() CountrySaved: EventEmitter<any> = new EventEmitter<any>();

  newCountryEntryForm: FormGroup;

  public newCountryResources: any;
  public globalResource: any;

  public _cookieService: any;
  public newCountryForm_copy: any;
    // all form fiels model object
    newCountryDetails = {
      country: null
    };

    public msgs: any[];
    submitted: boolean;

  constructor( private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    // tslint:disable-next-line:no-shadowed-variable
    private cityActionService: CityService, // for saving form details service
    private appCommonService: AppCommonService) { }

  ngOnInit() {
    this.newCountryResources = MastersResource.getResources().en.addnewcountry;
    this.globalResource = GlobalResources.getResources().en;

    this._cookieService = this.appCommonService.getUserProfile();

    this.loaderService.display(false);

  // New country form defination(reactive form)
  this.newCountryEntryForm = this.fb.group({
    'country': new FormControl(null, Validators.required)
  });
  }

  resetForm() {
    this.CountryForm.reset({TrimmedYesNo: false });
    this.newCountryDetails = {
      country: null
    };
  }

  hideCountryPopup() {
    this.CountryForm.reset();
    this.Country.showCountryModal = false;
  }

  getCountryOnSave(countryId) {
    this.CountrySaved.emit(countryId);
    this.Country.showCountryModal = false;
  }

  saveCountryNames(formModel) {
    const countryDetailsForApi = {
      CountryDetails: {
        CountryName: formModel.value.country,
        VirtualRoleId: this._cookieService.VirtualRoleId
      }
    };
    console.log(countryDetailsForApi);
    if (formModel.valid) {
       // http call starts
       this.loaderService.display(true);
      this.cityActionService.addCountryDetails(countryDetailsForApi)
      .subscribe(
          data => {
            console.log(data);
            this.msgs = [];
            if (data[0]['Result'] === 'Success') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.newCountryResources.countrysuccess });
              console.log(data[0]['countryId']);
              this.getCountryOnSave(data[0]['countryId']);
              this.resetForm();
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newCountryResources.countryexists });
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
      this.appCommonService.validateAllFields(this.newCountryEntryForm);
    }
  }
}
