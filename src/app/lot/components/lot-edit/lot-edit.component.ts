import { forEach } from '@angular/router/src/utils/collection';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { DropdownValuesService } from './../../../shared/services/dropdown-values.service';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem, SelectItem, Message, ConfirmationService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { GlobalResources } from '../../../global resource/global.resource';
import { QuestionBase } from '../../../shared/models/question-base';
import { QuestionControlService } from '../../../shared/services/question-control.service';
import { QuestionService } from '../../../shared/services/question.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { ActivatedRoute } from '@angular/router';
import { GrowerDetailsActionService } from '../../../task/services/grower-details-action.service';
import { LotResources } from '../../lot.resource';
import { LoaderService } from '../../../shared/services/loader.service';
import { LotService } from '../../services/lot.service';

@Component({
  moduleId: module.id,
  selector: 'app-lot-edit',
  templateUrl: 'lot-edit.component.html',
  styles: [`
  .LPadd{
    padding-left:0px !important;
    padding-right:0px !important;
  }
  `]
})
export class LotEditComponent implements OnInit {

  @Input() Lot: any;
  @Input() questions: QuestionBase<any>[];
  @Input() LotEditDetails: any;
  @Output() LotUpdate: EventEmitter<any> = new EventEmitter<any>();

  lotEntryForm: FormGroup;
  growers: any[];
  strains: any[];
  lottypes: SelectItem[];
  trimmedYesNo: SelectItem[];
  clientUnits: SelectItem[];
  brands;

  // all form fiels model object
  lotDetails = {
    shortageoverage: null,
    costoflot: null,
    startweight: null
  };

  submitted: boolean;

  shortageoverage: number;

  taskResources: LotResources;
  public editLotResources: any;
  public lotEntryResources: any;
  public globalResource: any;

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

  // get value of bud and joint weight
  public budValue: any;
  public jointValue: any;

  constructor(
    private fb: FormBuilder,
    private growerDetailsActionService: GrowerDetailsActionService, // for saving form details service
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private qcs: QuestionControlService,
    private service: QuestionService,
    private dropdwonTransformService: DropdwonTransformService,
    private route: ActivatedRoute,
    // tslint:disable-next-line:no-shadowed-variable
    private LotService: LotService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
  ) {
    // http call starts
    this.loaderService.display(true);

    // this.getAllBrand();
    // this.getAllStrains();
    // this.questions = this.route.snapshot.data.data.sort((a, b) => a.order - b.order);
    // this.questions = service.getQuestions();
  }

  getAllStrains() {
    const strainid = this.LotEditDetails ? this.LotEditDetails.StrainId : 0;
    this.dropdownDataService.getStrainsForLotEdit(strainid).subscribe(
      data => {
        this.globalData.strains = data;
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get all strains complete'));
  }

  getAllGrowers() {
    const growerid = this.LotEditDetails ? this.LotEditDetails.RawSupId : 0;
    this.dropdownDataService.getGrowers(growerid).subscribe(
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
      strMessage = 'Threshold is less than ' + tolerance + ' %. Do you want to continue?';
    } else {
      strMessage = 'Threshold is more than ' + tolerance + ' %. Do you want to continue?';
    }

    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      key: 'lotedit',
      accept: () => {
        this.onSubmit('value', 'Yes');
      },
      reject: () => {
        // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
  }

  calculate_TreasholdValueByPercentage() {
    // console.log(this.lotEntryForm.getRawValue());
    // if (String(this.lotEntryForm.getRawValue().growerLotNo).trim() === '') {
    //   this.lotEntryForm.controls['growerLotNo'].setErrors({ whitespace: true });
    // }
    if (String(this.lotEntryForm.getRawValue().growerlotno).trim().length === 0) {
      this.lotEntryForm.controls['growerlotno'].setErrors({'required': true});
      return;
    }
    if (this.lotEntryForm.valid) {
      let tolerance = 0;
      this.LotService.getThreasholdForLot().subscribe(
        data => {
          tolerance = data.Threshold;
        });
      let toleranceValue = 0;
      let minPercentage = 0;
      let maxPercentage = 0;

      toleranceValue = (Number(this.lotEntryForm.getRawValue().startweight) / Number(this.lotEntryForm.getRawValue().biotrweight)) * 100;
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
    this.editLotResources = LotResources.getResources().en.editlot;
    this.globalResource = GlobalResources.getResources().en;

    this._cookieService = this.appCommonService.getUserProfile();

    this.getAllGrowers();
    this.getAllStrains();
    this.lottypes = [
      // { label: '-- Select --', value: null }, //comment by swapnil
      { label: 'Bud Material', value: 1 },
      { label: 'Other Material', value: 2 },
    ];

    this.trimmedYesNo = [
      { label: 'No', value: false },
      { label: 'Yes', value: true },
    ];

    this.clientUnits = [
      { label: 'Gram', value: 1 },
      { label: 'Kg', value: 1 }
    ];
    // Lotentry form defination(reactive form)
    this.lotDetails.costoflot =  this.LotEditDetails.Cost;
    this.lotEntryForm = this.fb.group({
      'grower': new FormControl({ value: this.LotEditDetails.RawSupId, disabled: !this.LotEditDetails.FlagRawSupId }, Validators.required),
      'strain': new FormControl({ value: this.LotEditDetails.StrainId, disabled: !this.LotEditDetails.FlagStrainId }, Validators.required),
      'thc': new FormControl({ value: Number(this.LotEditDetails.THC), disabled: !this.LotEditDetails.FlagTHC }),
      'thca': new FormControl({ value: Number(this.LotEditDetails.THCA), disabled: !this.LotEditDetails.FlagTHCA }),
      'cbd': new FormControl({ value: Number(this.LotEditDetails.CBD), disabled: !this.LotEditDetails.FlagCBD }),
      'cbda': new FormControl({ value: Number(this.LotEditDetails.CBDA), disabled: !this.LotEditDetails.FlagCBDA }),
      'totalthc': new FormControl({ value: Number(this.LotEditDetails.TotalTHC), disabled: !this.LotEditDetails.FlagTotalTHC }),
      'growerlotno': new FormControl({ value: this.LotEditDetails.GrowerLotNo, disabled: !this.LotEditDetails.FlagGrowerLotNo },
        Validators.compose([Validators.required])),
      'lottype': new FormControl({ value: this.LotEditDetails.LotType, disabled: !this.LotEditDetails.FlagLotType }, Validators.required),
      'biotrweight': new FormControl({ value: Number(this.LotEditDetails.BioTrackWeight), disabled: !this.LotEditDetails.FlagBioTrackWeight },
        Validators.compose(
          [
            Validators.required,
          ])),
        'startweight': new FormControl({ value: Number(this.LotEditDetails.StartWeight), disabled: !this.LotEditDetails.FlagStartWeight },
        Validators.compose(
          [
            Validators.required,
            // CheckSumValidator.validateSum('budweight', 'jointsweight', 'oilweight', 'wasteweight')
          ])),
        'costoflot': new FormControl({ value: Number(this.lotDetails.costoflot), disabled: !this.LotEditDetails.FlagCost },
          Validators.compose(
          [
            Validators.required,
          ])),
          'costperGram': new FormControl({ value: Number(this.LotEditDetails.CostPerGram), disabled: !this.LotEditDetails.FlagCostPerGram },
        Validators.compose(
          [
            Validators.required,
          ])),
      'shortageoverage': new FormControl({ value: Number(this.LotEditDetails.ShortageOverage), disabled: !this.LotEditDetails.FlagShortageOverage }),
      'trimmed': new FormControl({ value: this.LotEditDetails.IsTrimmed, disabled: !this.LotEditDetails.FlagIsTrimmed }),
      'unit': new FormControl(1)
    });

    // , {validator: CheckSumValidator.validateSum('startweight', 'budweight', 'jointsweight', 'oilweight', 'wasteweight')}
    // console.log(this.lotEntryForm.getRawValue());
    this.questions = this.questions.filter(result => {
      if (this.lotEntryForm.getRawValue().trimmed === false) {
        result.required = false;
      }
      if (String(result.key).toLocaleUpperCase() === 'JOINTS_WT') {
        result.value = Number(this.LotEditDetails.JOINTS_WT);
      } else if (String(result.key).toLocaleUpperCase() === 'BUD_WT') {
        result.value = Number(this.LotEditDetails.BUD_WT);
      }
      return result.key === 'BUD_WT' || result.key === 'JOINTS_WT';
    });

    this.calShortageOverage();
    this.lotEntryForm.addControl('skewTypeGroup', this.qcs.toFormGroup(this.questions));

    if (!this.LotEditDetails.FlagStartWeight) {
      let control = (<FormGroup>this.lotEntryForm.controls.skewTypeGroup).controls['BUD_WT'];
      control.disable();

       control = (<FormGroup>this.lotEntryForm.controls.skewTypeGroup).controls['JOINTS_WT'];
      control.disable();
    }
    // To set dynamic validations
    this.formControlValueChanged();

    // http call ends
    setTimeout(() => {
      this.loaderService.display(false);
    }, 500);
  }

  initSkewTypeGroup() {
    // initialize our address
    return this.qcs.toFormGroup(this.questions);
  }

  // To get all form fields values where dynamic or static
  get diagnostic() { return JSON.stringify(this.lotEntryForm.getRawValue()); }

  // Populate brand on grower changes
  onGrowerChange() {
    // const selectedGrower = this.lotDetails.grower;
    // console.log(this.globalData.strains);
    // this.lotEntryForm.controls['strain'].patchValue(null);
    // this.lotDetails.brand =  this.globalData.growers.filter(data => data.RawSupId === this.lotEntryForm.get('grower').value)[0].BrandName;
  }

  // Checks the trimmed dropdown value changed or not if yes then show other controls and set and clear validations dynamnically
  formControlValueChanged() {
    this.lotEntryForm.get('trimmed').valueChanges.subscribe(
      (mode: any) => {
        if (mode === true) {
          // set validation to controls

          for (const field in this.lotEntryForm.getRawValue().skewTypeGroup) { // 'field' is a string
            if (this.lotEntryForm.getRawValue().skewTypeGroup.hasOwnProperty(field)) {
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
           for (const field in this.lotEntryForm.getRawValue().skewTypeGroup) { // 'field' is a string
            if (this.lotEntryForm.getRawValue().skewTypeGroup.hasOwnProperty(field)) {
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
    const formValue = this.lotEntryForm.getRawValue();

    lotDetailsForApi = {
      LotDetails: {
        ClientId: this._cookieService.ClientId,
        VirtualRoleId: this._cookieService.VirtualRoleId,
        LotId: this.Lot.lotId,
        GrowerId: formValue.grower,
        GrowerName: this.growers.filter(x => x.value === formValue.grower)[0].label,
        StrainId: formValue.strain,
        StrainName: this.strains.filter(x => x.value === formValue.strain)[0].label,
        GrowerLotNo: formValue.growerlotno,
        THC: Number(formValue.thc),
        THCA: Number(formValue.thca),
        CBD: Number(formValue.cbd),
        CBDA: Number(formValue.cbda),
        TotalTHC: Number(formValue.totalthc),
        LotType: formValue.lottype,
        LotTypeName: this.lottypes.filter(x => x.value === formValue.lottype)[0].label,
        BioTrackWt: formValue.biotrweight,
        StartWt: formValue.startweight,
        Cost: Number(formValue.costoflot),
        ShortageOverage: Number(this.lotDetails.shortageoverage),
        IsTrimmed: formValue.trimmed ? formValue.trimmed : false,
        CostPerGram: formValue.costperGram,
        SendMail: SendMail
      },
      SkewDetails: []
    };

    this.lotEntryForm_copy = JSON.parse(JSON.stringify(Object.assign({}, formValue)));

    // Object.keys(this.lotEntryForm_copy.skewTypeGroup).forEach(function (child) {
    // });
    if (formValue.lottype === 1) {
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

      if (formValue.trimmed && Number(budJointsWeight) !== Number(formValue.startweight)) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.editLotResources.startwtnotmatch });

        return;
      }
    } else if (formValue.lottype === 2) {
      // lotDetailsForApi.SkewDetails['OIL_WT'] = formValue.startweight;
      lotDetailsForApi.SkewDetails.push({ SkewKeyName: 'OIL_WT', Weight: Number(formValue.startweight) });
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

                if (String(data[0].ResultKey).toLocaleUpperCase() === 'NOUPDATE') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: data[0].ResultMessage });
                } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                  this.msgs = [];
                  this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                  this.LotUpdate.emit(data[0]);

                  this.msgs = [];
                  this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: data[0].ResultMessage });

                  // this.GetAllLotListByClient();
                } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'NOTPRESENT') {
                  if (data[0].NoRawSup === 1) {
                    this.lotEntryForm.controls['grower'].setErrors({ 'growernotpresent': true });
                    this.loaderService.display(false);
                  } if (data[0].NoStrain === 1) {
                    this.lotEntryForm.controls['strain'].setErrors({ 'strainnotpresent': true });
                    this.loaderService.display(false);
                  }
                } else {
                  this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg,
                  detail: 'Inactive'});
                }

                // http call end
                this.loaderService.display(false);
              },
              error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });

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
    this.lotEntryForm.reset({ trimmedYesNo: false });

    this.lotDetails = {
      shortageoverage: null,
      costoflot: null,
      startweight: null
    };
  }
  // Calculate Shortage/Overage depend on start wt and bio track wt
  calShortageOverage() {
    if (Number(this.lotEntryForm.getRawValue().startweight) !== 0 && Number(this.lotEntryForm.getRawValue().startweight) !== 0) {
      this.lotDetails.shortageoverage = parseFloat((Number(this.lotEntryForm.getRawValue().startweight) -
        Number(this.lotEntryForm.getRawValue().biotrweight)).toString()).toFixed(2);
    }

    // calculate lot cost
    if (Number(this.lotEntryForm.getRawValue().biotrweight) !== 0 && Number(this.lotEntryForm.getRawValue().costperGram) !== 0) {
      this.lotDetails.costoflot = parseFloat((Number(this.lotEntryForm.getRawValue().biotrweight) *
        Number(this.lotEntryForm.getRawValue().costperGram)).toString()).toFixed(2);
    }
  }

  // calculate lot cost :: added by swapnil :: 16-april-2019
  calLotCost() {
    if (Number(this.lotEntryForm.getRawValue().biotrweight) !== 0 && Number(this.lotEntryForm.getRawValue().costperGram) !== 0) {
      this.lotDetails.costoflot = parseFloat((Number(this.lotEntryForm.getRawValue().biotrweight) *
        Number(this.lotEntryForm.getRawValue().costperGram)).toString()).toFixed(2);
    }
  }

  // calculate received weight :: added by swapnil :: 16-april-2019
  calReceivedWeight() {

    const formValue = this.lotEntryForm.getRawValue();
    this.lotEntryForm_copy = JSON.parse(JSON.stringify(Object.assign({}, formValue)));
    if (formValue.lottype === 1) {
      for (const key in this.lotEntryForm_copy.skewTypeGroup) {
        if (this.lotEntryForm_copy.skewTypeGroup.hasOwnProperty(key)) {

          if (key === 'BUD_WT') {
           this.budValue = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
          } else if (key === 'JOINTS_WT') {
           this.jointValue = Number(this.lotEntryForm_copy.skewTypeGroup[key]);
          }
        }
      }
      if (Number(this.budValue !== 0) && Number(this.jointValue !== 0)) {
        const result = (parseFloat((Number(this.budValue) +
        Number(this.jointValue)).toString()).toFixed(2));
        this.lotEntryForm.controls['startweight'].patchValue(result);
      }
    }

    if (Number(this.lotEntryForm.getRawValue().startweight) !== 0 && Number(this.lotEntryForm.getRawValue().startweight) !== 0) {
      this.lotDetails.shortageoverage = parseFloat((Number(this.lotEntryForm.getRawValue().startweight) -
        Number(this.lotEntryForm.getRawValue().biotrweight)).toString()).toFixed(2);
    }
  }

  cancelLotNoteModal() {
    this.lotEntryForm.reset({ trimmedYesNo: false });
    this.Lot.showLotEditModal = false;
    this.Lot.lotId = 0;
  }
}
