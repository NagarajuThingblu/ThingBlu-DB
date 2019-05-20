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
import { AppConstants } from '../../../shared/models/app.constants';


@Component({
  moduleId: module.id,
  selector: 'app-lot-entry-form',
  templateUrl: 'lot-entry-form.component.html',
  providers: [ConfirmationService],
  styles: [`
  .LPadd{
    padding-left:0px !important;
    padding-right:0px !important;
  }
  `]
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
    costperGram: null // add new field by swapnil ::15-april-2019
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

  // add by swapnil for autocomplete grower and strain :: 15-april-2019
  public filteredSuggestionData = {
    growers: [],
    strains: []
  };
  public suggestionData = {
    growers: [],
    strains: []
  };
  public isGrowerSerched = false;
  public isStrainSerched = false;
  public checkIsDirty = true;

  // add to get value of bud and joint weight
  public budValue: number;
  public jointsValue: number;

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
        if (data) {
          this.suggestionData.strains = data;
          // this.productList = this.dropdwonTransformService.transform(data, 'ProductName', 'ProductId', AppConstants.getDDLDefaultText);
        } else {
          this.suggestionData.strains = [];
        }
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
        if (data) {
          this.suggestionData.growers = data;
          // this.productList = this.dropdwonTransformService.transform(data, 'ProductName', 'ProductId', AppConstants.getDDLDefaultText);
        } else {
          this.suggestionData.growers = [];
        }
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
      // { label: '-- Select --', value: null},  // Comment by swapnil
      { label: 'Bud Material', value: 1 },
      { label: 'Other Material', value: 2},
    ];

    this.trimmedYesNo = [
      { label: 'Yes', value: true},
      { label: 'No', value: false},
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
      // 'costoflot': new FormControl(null,  Validators.compose(
      //   [
      //     Validators.required,
      //   ])),

      'costoflot': new FormControl(null),
      'costperGram': new FormControl(null,  Validators.compose(
        [
          Validators.required,
        ])),
      'shortageoverage': new FormControl(null),
      'trimmed': new FormControl({ value: true}),
      'unit': new FormControl(1),
      'notes': new FormControl(null),  // add control notes
    });
    // , {validator: CheckSumValidator.validateSum('startweight', 'budweight', 'jointsweight', 'oilweight', 'wasteweight')}
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
      this.lotDetails.shortageoverage = this.appCommonService.shortageoverage;
      this.lotDetails.costoflot = this.appCommonService.costoflot;
      if (this.lotEntryForm.value.grower) {
      this.backPagefilterSuggestionData('GROWER', this.lotEntryForm.value.grower.RawSupplierName);
      }
      if (this.lotEntryForm.value.strain) {
        this.backPagefilterSuggestionData('STRAIN', this.lotEntryForm.value.strain.StrainName);
      }
    });
    }
  }

  initSkewTypeGroup() {
    // initialize our address
    return  this.qcs.toFormGroup(this.questions);
  }

  // Populate brand on grower changes
  onGrowerChange() {
    // const selectedGrower = this.lotDetails.grower;
    this.lotDetails.strain = null;
    // this.lotDetails.brand =  this.globalData.growers.filter(data => data.RawSupId === this.lotEntryForm.get('grower').value)[0].BrandName;
  }

  // Checks the trimmed dropdown value changed or not if yes then show other controls and set and clear validations dynamnically
  formControlValueChanged() {
    this.lotEntryForm.get('trimmed').valueChanges.subscribe(
        (mode: any) => {
            if (mode === true) {
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
    this.submitted = true;
    let lotDetailsForApi;
    let budJointsWeight = 0;
    lotDetailsForApi = {
      LotDetails: {
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          GrowerId: this.lotEntryForm.value.grower.RawSupId,
          GrowerName: this.filteredSuggestionData.growers.filter(x => x.RawSupplierName === this.lotEntryForm.value.grower.RawSupplierName)[0].RawSupplierName,
          StrainId: this.lotEntryForm.value.strain.StrainId,
          StrainName: this.filteredSuggestionData.strains.filter(x => x.StrainName === this.lotEntryForm.value.strain.StrainName)[0].StrainName,
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
         // Cost: Number(this.lotEntryForm.value.costoflot),
          Cost: Number(this.lotDetails.costoflot),
          ShortageOverage: Number(this.lotDetails.shortageoverage),
          IsTrimmed: this.lotEntryForm.value.trimmed ? this.lotEntryForm.value.trimmed : false,
          Note: this.lotEntryForm.value.notes ? this.lotEntryForm.value.notes : '',
         // CostPerGram: this.lotEntryForm.value.costperGram ? this.lotEntryForm.value.costperGram : 0,
          CostPerGram: this.lotDetails.costperGram ? this.lotDetails.costperGram : 0,
         SendMail: SendMail
      },
      SkewDetails: []
    };

    this.lotEntryForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.lotEntryForm.value)));

    // Object.keys(this.lotEntryForm_copy.skewTypeGroup).forEach(function (child) {
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
    if (this.lotEntryForm.valid) {
    this.confirmationService.confirm({
      message: this.globalResource.saveconfirm,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      key: 'saveconfirm',
      accept: () => {
          // http call starts
          this.loaderService.display(true);
          this.growerDetailsActionService.addLotEntry(lotDetailsForApi)
          .subscribe(
              data => {
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
    this.lotEntryForm.reset({trimmedYesNo: true, lottype: 1 });
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
      budweight: 0,
      jointsweight: 0,
      oilweight: null,
      wasteweight: null,
      thc: null,
      thca: null,
      cbd: null,
      cbda: null,
      totalthc: null,
      costperGram: null // add new field by swapnil ::15-april-2019,
    };
  }
  // Calculate Shortage/Overage depend on start wt and bio track wt
  calShortageOverage() {
    if (Number(this.lotEntryForm.value.startweight !== 0 && Number(this.lotDetails.biotfweight)) !== 0) {
      this.lotDetails.shortageoverage =  parseFloat((Number(this.lotEntryForm.value.startweight)
                 - Number(this.lotDetails.biotfweight)).toString()).toFixed(2);
    }

    // add code for calculate lot cost :: swapnil :: 15-april-2019
    if (Number(this.lotDetails.biotfweight) !== 0 && Number(this.lotDetails.costperGram) !== 0) {
      this.lotDetails.costoflot =  parseFloat((Number(this.lotDetails.biotfweight) * Number(this.lotDetails.costperGram)).toString()).toFixed(2);
    }
  }

  // Calculate Lot cost depends on transfer weight and cost per gram
  // added by swapnil :: 15-april-2019
  calLotCost() {
    if (Number(this.lotDetails.biotfweight) !== 0 && Number(this.lotDetails.costperGram) !== 0) {
      this.lotDetails.costoflot =  parseFloat((Number(this.lotDetails.biotfweight) * Number(this.lotDetails.costperGram)).toString()).toFixed(2);
    }
  }

  changevalue() {

        if (this.lotEntryForm.value.lottype === 1) {
          this.lotEntryForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.lotEntryForm.value)));
          for (const key in this.lotEntryForm_copy.skewTypeGroup) {
            if (this.lotEntryForm_copy.skewTypeGroup.hasOwnProperty(key)) {
              if (key === 'BUD_WT') {
                this.budValue = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
              } else if (key === 'JOINTS_WT') {
                this.jointsValue = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
              }

              if (this.jointsValue !== 0 && this.budValue !== 0) {
                this.lotDetails.startweight = parseFloat((Number(this.budValue) + Number(this.jointsValue)).toString()).toFixed(2);
              }
            }
          }
        }

        if (Number(this.lotEntryForm.value.startweight) !== 0 && Number(this.lotDetails.biotfweight) !== 0) {
          this.lotDetails.shortageoverage =  parseFloat((Number(this.lotEntryForm.value.startweight)
                                             - Number(this.lotDetails.biotfweight)).toString()).toFixed(2);
        }
  }



  // view links changes
  viewGrowerList() {
    this.checkIsDirty = false;
    this.appCommonService.lotFormDetail = this.lotEntryForm;
    this.appCommonService.lotPageBackLink = true;
    this.appCommonService.shortageoverage = this.lotDetails.shortageoverage;
    this.appCommonService.costoflot = this.lotDetails.costoflot;
    this.router.navigate(['../home/grower']);
  }

  viewStrainList() {
    this.checkIsDirty = false;
    this.appCommonService.lotFormDetail = this.lotEntryForm;
    this.appCommonService.lotPageBackLink = true;
    this.appCommonService.shortageoverage = this.lotDetails.shortageoverage;
    this.appCommonService.costoflot = this.lotDetails.costoflot;
    this.router.navigate(['../home/strainmaster']);
   // this.router.navigate([]).then(result => {  window.open('../home/strainmaster', '_blank'); });
  }

  filterSuggestionData(flag, event) {
    if (String(flag).toLocaleUpperCase() === 'GROWER') {
        this.filteredSuggestionData.growers =
        this.suggestionData.growers.filter(data =>
          String(data.RawSupplierName).toLocaleLowerCase().indexOf(String(event.query).toLocaleLowerCase()) >= 0
          );
          this.isGrowerSerched = true;
    } else if (String(flag).toLocaleUpperCase() === 'STRAIN') {
      this.filteredSuggestionData.strains =
      this.suggestionData.strains.filter(data =>
        String(data.StrainName).toLocaleLowerCase().indexOf(String(event.query).toLocaleLowerCase()) >= 0
      );
      this.isStrainSerched = true;
  }
  }

  backPagefilterSuggestionData(flag, event) {
    if (String(flag).toLocaleUpperCase() === 'GROWER') {
        this.filteredSuggestionData.growers =
        this.suggestionData.growers.filter(data =>
          String(data.RawSupplierName).toLocaleLowerCase().indexOf(String(event).toLocaleLowerCase()) >= 0
          );
          this.isGrowerSerched = true;
    } else if (String(flag).toLocaleUpperCase() === 'STRAIN') {
      this.filteredSuggestionData.strains =
      this.suggestionData.strains.filter(data =>
        String(data.StrainName).toLocaleLowerCase().indexOf(String(event).toLocaleLowerCase()) >= 0
      );
      this.isStrainSerched = true;
  }
  }

  // Redirect to grower page
  addGrower() {
    this.appCommonService.LotBackLink = true;
    this.router.navigate(['../home/grower']);
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (!this.checkIsDirty) {
      this.checkIsDirty = true;
      return true;
    }

    if (!this.lotEntryForm.dirty) {
      return true;
    }
    // return this.appCommonService.canDeactivate(this.lotEntryForm);
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
          message: 'You have unsaved changes. Are you sure you want to leave this page?',
          header: 'Confirmation',
          key: 'leavePageConfirmBox',
          icon: 'fa fa-exclamation-triangle',
          accept: () => {
              resolve(true);
          },
          reject: () => {
            resolve(false);
          }
      });
    });
  }
}
