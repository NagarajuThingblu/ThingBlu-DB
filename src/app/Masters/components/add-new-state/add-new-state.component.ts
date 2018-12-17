import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-add-new-state',
  templateUrl: './add-new-state.component.html'
})
export class AddNewStateComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('State') State: any;
  @ViewChild('StateForm') StateForm;
  @Output() CountrySavedState: EventEmitter<any> = new EventEmitter<any>();
  @Output() StateSaved: EventEmitter<any> = new EventEmitter<any>();

  newStateEntryForm: FormGroup;
  public newStateResources: any;
  public globalResource: any;
  submitted: boolean;
  public msgs: any[];
  countries: any[];
  public _cookieService: any;
  public NewStateForm_copy: any;

    // all form fiels model object
    newStateDetails = {
      country: null,
      state: null
    };

    private globalData = {
      countries: [],
    };



    public OnStateSave = {
      country: null,
      state: null
    };
  constructor(private fb: FormBuilder,
    private loaderService: LoaderService,
    // private cookieService: CookieService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private dropdwonTransformService: DropdwonTransformService,
    // tslint:disable-next-line:no-shadowed-variable
    private cityActionService: CityService, // for saving form details service
    private appCommonService: AppCommonService) {
      // this.getAllCountries();
      // this.countries=this.State.getAllCountries;
     }

  ngOnInit() {
    this.newStateResources = MastersResource.getResources().en.addnewstate;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();

  // New State form defination(reactive form)
  this.newStateEntryForm = this.fb.group({
    'country': new FormControl(null, Validators.required),
    'state': new FormControl(null, Validators.required)
  });
  }

  getAllCountries() {
    console.log('call');
    this.dropdownDataService.getCountryList().subscribe(
      data => {
        console.log(data);
        this.globalData.countries = data;
        this.countries = this.dropdwonTransformService.transform( data, 'CountryName', 'CountryId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all Countries complete'));
  }

  resetForm() {
    this.StateForm.reset({TrimmedYesNo: false });

    this.newStateDetails = {
      country: null,
      state: null
    };
  }

  hideStatePopup() {
    this.StateForm.reset();
    this.State.showStateModal = false;
  }

  getCountryOnSave(StateId) {
    this.CountrySavedState.emit(StateId);
  }

  getStateOnSave(OnStateSave) {
        this.StateSaved.emit(OnStateSave);
        this.State.showStateModal = false;
      }

    saveStateNames(formModel) {
      const stateDetailsForApi = {
        StateNames: {
          StateId: 0,
          CountryId: formModel.value.country,
          StateName: formModel.value.state,
          Description: null,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          IsDeleted: 0
        }
      };
      console.log(stateDetailsForApi);
      if (formModel.valid) {
         // http call starts
         this.loaderService.display(true);
        this.cityActionService.addStateDetails(stateDetailsForApi)
        .subscribe(
            data => {
              console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.newStateResources.statesuccess });

                this.getCountryOnSave(formModel.value.state);

                this.OnStateSave.country = formModel.value.country;
                this.OnStateSave.state = data[0]['StateId'];
                this.getStateOnSave(this.OnStateSave);
                this.resetForm();
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (data === 'Duplicate') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newStateResources.stateexists });
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
        this.appCommonService.validateAllFields(this.newStateEntryForm);
      }
     }

}
