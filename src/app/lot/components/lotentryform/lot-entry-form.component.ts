import { AppCommonService } from './../../../shared/services/app-common.service';
import { delay } from 'rxjs/operators';
import { DropdownValuesService } from './../../../shared/services/dropdown-values.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { MenuItem, SelectItem, Message, ConfirmationService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { DateValidators } from '../../../shared/validators/dateCheck.validator';
import { PositiveIntegerValidator } from '../../../shared/validators/positive-integer.validator';
import { GlobalResources } from '../../../global resource/global.resource';
import { CheckSumValidator } from '../../../shared/validators/check-sum.validator';
import { PanelModule } from 'primeng/panel';
import { QuestionBase } from '../../../shared/models/question-base';
import { QuestionControlService } from '../../../shared/services/question-control.service';
import { QuestionService } from '../../../shared/services/question.service';
import { forEach } from '@angular/router/src/utils/collection';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskResources } from '../../../task/task.resources';
import { GrowerDetailsActionService } from '../../../task/services/grower-details-action.service';
import { LotResources } from '../../lot.resource';
import { LoaderService } from '../../../shared/services/loader.service';
import { LotService } from '../../services/lot.service';
import { Title } from '@angular/platform-browser';
import { UserModel } from '../../../shared/models/user.model';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Component({
  moduleId: module.id,
  selector: 'app-lot-entry-form',
  templateUrl: 'lot-entry-form.component.html',
  providers: [ConfirmationService]
})
export class LotEntryFormComponent implements OnInit {

  lotEntryForm: FormGroup;
  growers: any[];
  strains: any[];
  lottypes: SelectItem[];
  trimmedYesNo: SelectItem[];
  clientUnits: SelectItem[];
  brands;

  // all form fiels model object
  lotDetails = {
    grower: null,
    biotfweight: null,
    startweight: null,
    shortageoverage: null,
    strain: null,
    growerlotno: null,
    lottype: 1,
    costoflot: null,
    trimmed: true,
    budweight: null,
    jointsweight: null,
    oilweight: null,
    wasteweight: null,
    thc: null,
    thca: null,
    cbd: null,
    cbda: null,
    totalthc: null,
  };

  submitted: boolean;

  shortageoverage: number;

  taskResources: LotResources;
  public lotEntryResources: any;
  public globalResource: any;

  questions: QuestionBase<any>[];
  public payLoad: any;
  public skewFormGroupName = 'skewTypeGroup';
  public regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]{1,2})?$/g);

  public lotEntryForm_copy: any;
  public msgs: Message[] = [];
  public _cookieService: any;
  public num;
  private globalData = {
    strains: [],
    growers: []
  };
  taskActionResource: any;
  taskCommonService: any;

  constructor(
      private fb: FormBuilder,
      private growerDetailsActionService: GrowerDetailsActionService, // for saving form details service
      private dropdownDataService: DropdownValuesService, // For common used dropdown service
      private qcs: QuestionControlService ,
      private service: QuestionService,
      private cookieService: CookieService,
      private dropdwonTransformService: DropdwonTransformService,
      private route: ActivatedRoute,
      // tslint:disable-next-line:no-shadowed-variable
      private LotService: LotService,
      private loaderService: LoaderService,
      private appCommonService: AppCommonService,
      private confirmationService: ConfirmationService,
      private titleService: Title,
      private router: Router
    ) {
      // http call starts
      this.loaderService.display(true);

      this.getAllGrowers();
      // this.getAllBrand();
      this.getAllStrains();
      this.questions = this.route.snapshot.data.data.sort((a, b) => a.order - b.order);
      // this.questions = service.getQuestions();
    }

  getAllStrains() {
    this.dropdownDataService.getStrains().subscribe(
      data => {
        this.globalData.strains = data;
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all strains complete'));
  }

  getAllGrowers() {
    this.dropdownDataService.getGrowers(0).subscribe(
      data => {
        // this.globalData.push({ growers: data});
        this.globalData.growers = data;
        // this.growers = data;
        this.growers = this.dropdwonTransformService.transform(data, 'RawSupplierName', 'RawSupId', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get all Growers complete'));
  }

  showConformationMessaeg(moreless, tolerance) {
    let strMessage: any;
    if (moreless === 'less') {
      strMessage = 'Threshold is less than ' + tolerance + ' %. Do you want to continue?' ;
    } else {
      strMessage = 'Threshold is more than ' + tolerance + ' %. Do you want to continue?';
    }

    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      key: 'threshold',
      accept: () => {
        this.onSubmit('value', 'Yes');
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }

  calculate_TreasholdValueByPercentage() {
    if (String(this.lotEntryForm.getRawValue().growerlotno).trim().length === 0) {
      this.lotEntryForm.controls['growerlotno'].setErrors({'required': true});
      return;
      }

    if (this.lotEntryForm.valid) {
    let tolerance = 0;
    // this.LotService.GetThreasholdForLot().subscribe(
    //   data => {
    //     console.log(data.Threshold);
    //     tolerance = data.Threshold;
    //   });
    tolerance = Number(this.appCommonService.getUserProfile().LotTresholdValue);

    let toleranceValue = 0;
    let minPercentage = 0;
    let maxPercentage = 0;

    toleranceValue =  (Number(this.lotEntryForm.value.startweight) / Number(this.lotEntryForm.value.biotrweight)) * 100;
    minPercentage = 100 - Number(tolerance);
    maxPercentage = 100 + Number(tolerance);
      // To check tolerance value
      if (toleranceValue < minPercentage) {
        this.showConformationMessaeg('less', tolerance);
      } else if (toleranceValue > maxPercentage) {
          this.showConformationMessaeg('more', tolerance);
        } else {
          this.onSubmit('value', 'No');
        }
      } else {
        this.appCommonService.validateAllFields(this.lotEntryForm);
      }
    }



  ngOnInit() {
    // Resource File Object : Do not provide hard coded label anywhere
    this.lotEntryResources = LotResources.getResources().en.lotentryform;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.lotEntryResources.Title);


    this._cookieService = this.appCommonService.getUserProfile();

    this.lottypes = [
      { label: '-- Select --', value: null},
      { label: 'Bud Material', value: 1 },
      { label: 'Other Material', value: 2},
    ];

    this.trimmedYesNo = [
      { label: 'No', value: false},
      { label: 'Yes', value: true},
    ];

    this.clientUnits = [
      { label: 'Gram', value: 1 },
      { label: 'Kg', value: 1 }
    ];
  // Lotentry form defination(reactive form)
    this.lotEntryForm = this.fb.group({
      'grower': new FormControl(null, Validators.required),
      'strain': new FormControl(null, Validators.required),
      'thc': new FormControl(null),
      'thca': new FormControl(null),
      'cbd': new FormControl(null),
      'cbda': new FormControl(null),
      'totalthc': new FormControl(null),
      'growerlotno': new FormControl(null, Validators.compose([Validators.required])),
      'lottype': new FormControl(null, Validators.required),
      'biotrweight': new FormControl(null,  Validators.compose(
          [
            Validators.required,
          ])),
      'startweight': new FormControl(null,  Validators.compose(
          [
            Validators.required,
           // CheckSumValidator.validateSum('budweight', 'jointsweight', 'oilweight', 'wasteweight')
          ])),
      'costoflot': new FormControl(null,  Validators.compose(
        [
          Validators.required,
        ])),
      'shortageoverage': new FormControl(null),
      'trimmed': new FormControl({ value: false}),
      'unit': new FormControl(1)
    });
    // , {validator: CheckSumValidator.validateSum('startweight', 'budweight', 'jointsweight', 'oilweight', 'wasteweight')}
    // console.log(this.lotEntryForm.value);
    this.questions = this.questions.filter(result => result.key === 'BUD_WT' || result.key === 'JOINTS_WT' );
    this.lotEntryForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));
    // To set dynamic validations
    this.formControlValueChanged();

     // http call ends
     setTimeout(() => {
      this.loaderService.display(false);
    }, 500);

    // load data when click on back link of grower and strain :: swapnil :: 02-april-2019
    if ( this.appCommonService.lotFormDetail && this.appCommonService.lotPageBackLink) {
      const observable1 = this.dropdownDataService.getGrowers(0);
      const observable2 =  this.dropdownDataService.getStrains();
      forkJoin([observable1, observable2]).subscribe(result => {
      this.lotEntryForm = this.appCommonService.lotFormDetail;
      this.appCommonService.lotPageBackLink = false;
      this.appCommonService.lotFormDetail = null;
      this.lotDetails.lottype = this.lotEntryForm.value.lottype;
      this.lotDetails.trimmed = this.lotEntryForm.value.trimmed;
    });
    }
  }

  initSkewTypeGroup() {
    // initialize our address
    return  this.qcs.toFormGroup(this.questions);
  }

  // To get all form fields values where dynamic or static
  get diagnostic() { return JSON.stringify(this.lotEntryForm.value); }

  // Populate brand on grower changes
  onGrowerChange() {
    // const selectedGrower = this.lotDetails.grower;
    // console.log(this.globalData.strains);
    this.lotDetails.strain = null;
    // this.lotDetails.brand =  this.globalData.growers.filter(data => data.RawSupId === this.lotEntryForm.get('grower').value)[0].BrandName;
  }

  // Checks the trimmed dropdown value changed or not if yes then show other controls and set and clear validations dynamnically
  formControlValueChanged() {
    this.lotEntryForm.get('trimmed').valueChanges.subscribe(
        (mode: any) => {
            if (mode === true) {
              // console.log(mode);
              // set validation to controls

              for (const field in this.lotEntryForm.value.skewTypeGroup) { // 'field' is a string
                if (this.lotEntryForm.value.skewTypeGroup.hasOwnProperty(field)) {
                 //  if (field === 'budmaterialwt' || field === 'jointsmaterialwt') {
                    const control = this.lotEntryForm.controls.skewTypeGroup.get(field); // 'control' is a FormControl

                    control.setValidators(Validators.compose([Validators.required,
                    Validators.minLength(0)
                  ]));

                    // update form control changes to form
                    control.updateValueAndValidity();
                  }
                // }
              }
            } else if (mode !== true) {
              // console.log(mode);

              for (const field in this.lotEntryForm.value.skewTypeGroup) { // 'field' is a string
                if (this.lotEntryForm.value.skewTypeGroup.hasOwnProperty(field)) {
                 // if (field === 'budmaterialwt' || field === 'jointsmaterialwt') {
                    const control = this.lotEntryForm.controls.skewTypeGroup.get(field); // 'control' is a FormControl

                    // clear validators and update form control changes to form
                    control.clearValidators();
                    control.updateValueAndValidity();
                  }
                // }
              }
            }
        });
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
            control.markAsDirty({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            this.validateAllFields(control);
        }
    });
}
  // Save the form details
  onSubmit(value: string, SendMail: string) {
    // console.log('Entered ngSubmit');
    this.submitted = true;
    let lotDetailsForApi;
    // console.log(this.lotEntryForm.value);
    // console.log(JSON.parse(JSON.stringify(this.lotEntryForm_copy)));
    let budJointsWeight = 0;
    lotDetailsForApi = {
      LotDetails: {
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          GrowerId: this.lotEntryForm.value.grower,
          GrowerName: this.growers.filter(x => x.value === this.lotEntryForm.value.grower)[0].label,
          StrainId: this.lotEntryForm.value.strain,
          StrainName: this.strains.filter(x => x.value === this.lotEntryForm.value.strain)[0].label,
          GrowerLotNo: this.lotEntryForm.value.growerlotno,
          THC: Number(this.lotEntryForm.value.thc),
          THCA: Number(this.lotEntryForm.value.thca),
          CBD: Number(this.lotEntryForm.value.cbd),
          CBDA: Number(this.lotEntryForm.value.cbda),
          TotalTHC: Number(this.lotEntryForm.value.totalthc),
          LotType: this.lotEntryForm.value.lottype,
          LotTypeName: this.lottypes.filter(x => x.value === this.lotEntryForm.value.lottype)[0].label,
          BioTrackWt: this.lotEntryForm.value.biotrweight,
          StartWt: this.lotEntryForm.value.startweight,
          Cost: Number(this.lotEntryForm.value.costoflot),
          ShortageOverage: Number(this.lotDetails.shortageoverage),
          IsTrimmed: this.lotEntryForm.value.trimmed ? this.lotEntryForm.value.trimmed : false,
          SendMail: SendMail
      },
      SkewDetails: []
    };

    this.lotEntryForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.lotEntryForm.value)));

    // Object.keys(this.lotEntryForm_copy.skewTypeGroup).forEach(function (child) {
    //   console.log(this.lotEntryForm_copy);
    // });
    if (this.lotEntryForm.value.lottype === 1) {
      for (const key in this.lotEntryForm_copy.skewTypeGroup) {
        if (this.lotEntryForm_copy.skewTypeGroup.hasOwnProperty(key)) {

          if (key === 'BUD_WT') {
            lotDetailsForApi.SkewDetails.push({ SkewKeyName: 'BUD_WT', Weight: Number(this.lotEntryForm_copy.skewTypeGroup[key]) });
            budJointsWeight += Number(this.lotEntryForm_copy.skewTypeGroup[key]);
            // lotDetailsForApi.SkewDetails['BUD_WT'] = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
          } else if (key === 'JOINTS_WT') {
            lotDetailsForApi.SkewDetails.push({ SkewKeyName: 'JOINTS_WT', Weight: Number(this.lotEntryForm_copy.skewTypeGroup[key]) });
            budJointsWeight += Number(this.lotEntryForm_copy.skewTypeGroup[key]);
            // lotDetailsForApi.SkewDetails['JOINTS_WT'] = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
          }
          // else if (key === 'oilmaterialwt') {
          //   // lotDetailsForApi.SkewDetails.push({ OilMaterialWt: Number(this.lotEntryForm_copy.skewTypeGroup[key]) });
          //   lotDetailsForApi.SkewDetails['OilMaterialWt'] = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
          // } else if (key === 'wastematerialwt') {
          //   // lotDetailsForApi.SkewDetails.push({ WasteMaterialWt: Number(this.lotEntryForm_copy.skewTypeGroup[key]) });
          //   lotDetailsForApi.SkewDetails['WasteMaterialWt'] = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
          // }
          // console.log(this.lotEntryForm_copy.skewTypeGroup[key]);
        }
      }

      if (this.lotEntryForm.value.trimmed && Number(budJointsWeight) !== Number(this.lotEntryForm.value.startweight)) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.lotEntryResources.startwtnotmatch });

        return;
      }
    } else if (this.lotEntryForm.value.lottype === 2) {
      // lotDetailsForApi.SkewDetails['OIL_WT'] = this.lotEntryForm.value.startweight;
      lotDetailsForApi.SkewDetails.push({ SkewKeyName: 'OIL_WT', Weight: Number(this.lotEntryForm.value.startweight) });
    }

    // console.log(lotDetailsForApi);

    if (this.lotEntryForm.valid) {
    //   alert(this.lotEntryForm.valid);

    this.confirmationService.confirm({
      message: this.globalResource.saveconfirm,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      key: 'saveconfirm',
      accept: () => {
    //     alert('sadf');
          // http call starts
          this.loaderService.display(true);
          this.growerDetailsActionService.addLotEntry(lotDetailsForApi)
          .subscribe(
              data => {
                // console.log(data);

                this.msgs = [];

                if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: this.lotEntryResources.lotsavedsuccess });
                  this.resetForm();
                } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                  this.msgs = [];
                  this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data[0].ResultMessage).toUpperCase() === 'NOTPRESENT') {
                  if (data[0].NoStrain === 1) {
                    this.lotEntryForm.controls['strain'].setErrors({ 'strainnotpresent': true });
                    this.loaderService.display(false);
                  }
                  if (data[0].NoGrower === 1) {
                    this.lotEntryForm.controls['grower'].setErrors({ 'growernotpresent': true });
                    this.loaderService.display(false);
                  }
                } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.lotEntryResources.growerlotalreadyexist });
                  // this.GetAllLotListByClient();
                } else {
                  this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
                }

                // if (data === 'Success') {
                //   this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.lotEntryResources.lotsavedsuccess });
                //   this.resetForm();
                // } else if (data === 'Failure') {
                //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                // } else if (data === 'Duplicate') {
                //   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.lotEntryResources.growerlotalreadyexist });
                // } else {
                //   this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
                // }
                  // http call end
                  this.loaderService.display(false);
              },
              error => {
                this.msgs = [];
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });

                // http call end
                this.loaderService.display(false);
              });
            },
            reject: () => {
                // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
            }
          });
    } else {
      this.appCommonService.validateAllFields(this.lotEntryForm);
    }
  }

  resetForm() {
    this.lotEntryForm.reset({trimmedYesNo: false, lottype: 1, trimmed: true });

    this.lotDetails = {
      grower: null,
      biotfweight: null,
      startweight: null,
      shortageoverage: null,
      strain: null,
      growerlotno: null,
      lottype: 1,
      costoflot: null,
      trimmed: true,
      budweight: null,
      jointsweight: null,
      oilweight: null,
      wasteweight: null,
      thc: null,
      thca: null,
      cbd: null,
      cbda: null,
      totalthc: null,
    };
  }
  // Calculate Shortage/Overage depend on start wt and bio track wt
  calShortageOverage() {
    if (Number(this.lotDetails.startweight) !== 0 && Number(this.lotDetails.startweight) !== 0) {
      this.lotDetails.shortageoverage =  parseFloat((Number(this.lotDetails.startweight) - Number(this.lotDetails.biotfweight)).toString()).toFixed(2);
    }
  }

  // view links changes
  viewGrowerList() {
    this.appCommonService.lotFormDetail = this.lotEntryForm;
    this.appCommonService.lotPageBackLink = true;
    this.router.navigate(['../home/grower']);
  }


  viewStrainList() {
    this.appCommonService.lotFormDetail = this.lotEntryForm;
    this.appCommonService.lotPageBackLink = true;
    this.router.navigate(['../home/strainmaster']);
  }
}
