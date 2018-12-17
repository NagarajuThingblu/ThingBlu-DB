
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { NewStrainActionService } from '../../../task/services/new-strain-action.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { StrainMasterService } from '../../services/strain-master.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-add-new-strain',
  templateUrl: './add-new-strain.component.html',
  styleUrls: ['./add-new-strain.component.css']
})
export class AddNewStrainComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('Strain') Strain: any;
  @ViewChild('StrainForm') StrainForm;
  @Output() StrainSaved: EventEmitter<any> = new EventEmitter<any>();
  chkIsActive: boolean;
  newStrainEntryForm: FormGroup;
  straintypes: any[];
  genetics: any[];
  public newStrainResources: any;
  public globalResource: any;

  public _cookieService: any;
  public newStrainForm_copy: any;
    // all form fiels model object
    newStrainDetails = {
      straintype: null,
      strain: null,
      description: null,
      thc: null,
      thca: null,
      cbd: null,
      cbda: null,
      total: null,
      genetics: null,
      chkIsActive: 1
    };

    public StrainTypeInfo: any = {
      straintype: null,
      description: null,
      showStrainTypeModal: false
    };

    private globalData = {
      straintypes: [],
      genetics: []
    };
    public msgs: any[];

    submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    // private cookieService: CookieService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    // tslint:disable-next-line:no-shadowed-variable
    private newStrainActionService: NewStrainActionService, // for saving form details service
    private dropdwonTransformService: DropdwonTransformService,
    private strainMasterAppService: StrainMasterService,
    private appCommonService: AppCommonService,
    private appComponentData: AppComponent,
  ) {
    this.getAllStrainsType();
  }




  resetForm() {
    this.StrainForm.reset({ chkIsActive: true });

    this.newStrainDetails = {
      straintype: null,
      strain: null,
      description: null,
      thc: null,
      thca: null,
      cbd: null,
      cbda: null,
      total: null,
      genetics: null,
      chkIsActive: 1
    };
  }


  getAllStrainsType() {
    this.dropdownDataService.getStrainType().subscribe(
      data => {
        this.globalData.straintypes = data;
        this.straintypes = this.dropdwonTransformService.transform(data, 'StrainTypeName', 'StrainTypeId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all strains types complete'));
  }

  showstraintypePopup() {
    this.StrainTypeInfo.strain = null;
    this.StrainTypeInfo.showStrainTypeModal = true;
    this.loaderService.display(false);
  }
    saveStrainNames(formModel) {
      if (String(this.newStrainEntryForm.value.strain).trim().length === 0) {
        this.newStrainEntryForm.controls['strain'].setErrors({'whitespace': true});
        return;
      }
      const strainDetailsForApi = {
        Strain: {
          StrainTypeId: formModel.value.straintype,
          StrainName: this.appCommonService.trimString(this.newStrainEntryForm.value.strain),
          Description: this.appCommonService.trimString(this.newStrainEntryForm.value.description),
          // THC: formModel.value.thc,
          // THCA: formModel.value.thca,
          // CBD: formModel.value.cbd,
          // CBDA: formModel.value.cbda,
          // Total: formModel.value.total,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          GeneticsId: this.newStrainEntryForm.value.genetics,
          IsActive: this.newStrainEntryForm.value.chkIsActive ? 1 : 0,
          ClientId: Number(this._cookieService.ClientId)
        }
      };
      // console.log(strainDetailsForApi);
      if (this.newStrainEntryForm.valid) {
         // http call starts
         this.loaderService.display(true);
        this.newStrainActionService.addNewStrain(strainDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.newStrainResources.newstrainsavedsuccess });

                // console.log(data[0]['StrainId']);
                this.getStrainOnSave(data[0]['StrainId']);

                this.resetForm();
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (data === 'Duplicate') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newStrainResources.strainalreadyexist });
              } else if (data[0]['ResultKey'] === 'NotPresent') {
                if (data[0].NoStrainType === 1) {
                  this.newStrainEntryForm.controls['straintype'].setErrors({ 'straintypenotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoGenetics === 1) {
                  this.newStrainEntryForm.controls['genetics'].setErrors({ 'geneticsnotpresent': true });
                  this.loaderService.display(false);
                }
              } else if (data === 'NotInserted') {
                this.newStrainEntryForm.controls['straintype'].setErrors({ 'straintypenotpresent': true });
                this.loaderService.display(false);
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
        this.appCommonService.validateAllFields(this.newStrainEntryForm);
      }
    }

    hideStrainPopup() {
      this.resetForm();
      this.Strain.showStrainModal = false;
    }

    getStrainOnSave(StrainId) {
      this.StrainSaved.emit(StrainId);
      this.Strain.showStrainModal = false;
    }


    OnStrainTypeSave(StrainTypeId) {
      this.getAllStrainsType();
      const straintype = this.newStrainEntryForm.controls['straintype'];
      straintype.patchValue(StrainTypeId);
    }


  ngOnInit() {
    this.chkIsActive = true;
    this.appComponentData.setTitle('Strain');
    this.newStrainResources = MastersResource.getResources().en.addnewstrain;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();
    this.getAllGenetics();

  // New Strain form defination(reactive form)
  this.newStrainEntryForm = this.fb.group({
    'straintype': new FormControl(null, Validators.required),
    'genetics': new FormControl(null, Validators.required),
    'strain': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    'description': new FormControl(null),
    // 'thc': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
    // 'thca': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
    // 'cbd': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
    // 'cbda': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
    // 'total': new FormControl(null, [Validators.required, Validators.maxLength(5)]),
    'chkIsActive': new FormControl(null)
  });
  }
  getAllGenetics() {
    this.strainMasterAppService.getGeneticsList().subscribe(
      data => {
        this.globalData.genetics = data;
        this.genetics = this.dropdwonTransformService.transform(data, 'GeneticsName', 'GeneticsId', '-- Select --');
        // console.log(data);
      } ,
      error => { console.log(error); },
      () => console.log('Get all clients complete'));
  }

}
