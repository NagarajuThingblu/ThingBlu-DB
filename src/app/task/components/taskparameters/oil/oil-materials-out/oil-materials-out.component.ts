import { element } from 'protractor';
import { GlobalResources } from './../../../../../global resource/global.resource';
import { PositiveIntegerValidator } from './../../../../../shared/validators/positive-integer.validator';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { TaskResources } from '../../../../task.resources';
import { OilService } from '../../../../services/oil.service';
import { DropdwonTransformService } from '../../../../../shared/services/dropdown-transform.service';
import * as _ from 'lodash';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { Title } from '@angular/platform-browser';
import { UserModel } from '../../../../../shared/models/user.model';
import { CookieService } from '../../../../../../../node_modules/ngx-cookie-service';

@Component({
  moduleId: module.id,
  selector: 'app-oil-materials-out',
  templateUrl: 'oil-materials-out.component.html',
  styleUrls: ['oil-materials-out.component.css']
})
export class OilMaterialsOutComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private oilService: OilService,
    private dropdwonTransformService: DropdwonTransformService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private cookieService: CookieService
  ) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
  }

  oilProcessorForm: FormGroup;
  items = new FormArray([], this.customGroupValidation );

  public processors: SelectItem[];
  public strains: SelectItem[];
  public lots: SelectItem[];

  public msgs: Message[] = [];
  public defaultDate: Date;
  public _cookieService: any;

  public tpPrcsrDetails: any = {
    expYieldPercent: 0,
    materialPaymant: 0,
    turnAroundDays: 0
  };

  public selectedLotInRow: any[] = [];
  public globalResource: any;
  public oilmaterialsout: any;
  private globalData = {
    tpProcessors: [],
    lotDetails: []
  };

  public lotDetailsArr: any[] = [];
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    // Added by Devdan :: 20-Nov-2018
    showLotCommentModal: false
  };

  // Added by Devdan :: 20-Nov-2018
  lotNoteCount;

  ngOnInit() {

    this.oilmaterialsout = TaskResources.getResources().en.oilmaterialsout;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.oilmaterialsout.title);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);

    this.getProcessors();
    this.getOilProcessingLotDetails();
    this.oilProcessorForm = this.fb.group({
      processor: new FormControl(null,  Validators.compose([Validators.required])),
      outwardDate: new FormControl({value: null, disabled: true}),
      expReturnDate: new FormControl({value: this.defaultDate, disabled: true}),
      items: this.items,
    });
  }

  getProcessors() {
    this.loaderService.display(true);
    this.oilService.getProcessors().subscribe(
      data => {
        // console.log(data);
        // this.globalData.Employees = data;
        if (data !== 'No data found!') {
          this.globalData.tpProcessors = data;
          this.processors = this.dropdwonTransformService.transform(data.filter(x => x.IsActive === true),
            'TPName', 'TPId', '-- Select --');
        } else {
          this.globalData.tpProcessors = [];
          this.processors = [];
        }
        this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get Processors complete')
    );
  }

  getOilProcessingLotDetails() {
    this.loaderService.display(true);
    this.oilService.getOilProcessingLotDetails().subscribe(
      data => {
        let filtered;

        if (data !== 'No data found!') {
          this.globalData.lotDetails = data;

          filtered = this.removeDuplicatesById(data);

          this.strains = this.dropdwonTransformService.transform(filtered, 'StrainName', 'StrainId', '-- Select --');
        } else {
          this.globalData.lotDetails = [];
          this.strains = [];
        }
        this.loaderService.display(false);
      } ,
      error => { console.log(error);
        this.loaderService.display(false);
        this.globalData.lotDetails = [];
        this.strains = this.dropdwonTransformService.transform([], 'StrainName', 'StrainId', '-- Select --');
      },
      () => console.log('Get Oil Processing Lot Details complete')
    );
  }

  tpProcessOnChange() {
    if (this.oilProcessorForm.controls['processor'].valid) {
      const tpPrcsrDetails = this.globalData.tpProcessors
          .filter(data => data.TPId === this.oilProcessorForm.value.processor)[0];

      this.tpPrcsrDetails.expYieldPercent = tpPrcsrDetails.ExpectedYield;
      this.tpPrcsrDetails.materialPaymant = tpPrcsrDetails.MaterialPaymant;
      this.tpPrcsrDetails.turnAroundDays = tpPrcsrDetails.TurnAroundDays;

      this.oilProcessorForm.controls['outwardDate'].enable();
      this.oilProcessorForm.controls['expReturnDate'].enable();

      const validators =  Validators.compose([Validators.required]);
      this.oilProcessorForm.controls['outwardDate'].setValidators(validators);
      this.oilProcessorForm.controls['outwardDate'].updateValueAndValidity();

      this.outwardDateOnChange();
    } else {
      this.oilProcessorForm.controls['outwardDate'].clearValidators();
      this.oilProcessorForm.controls['outwardDate'].disable();
      this.oilProcessorForm.controls['expReturnDate'].disable();
    }
  }

  addItem(): void {
    this.items = this.oilProcessorForm.get('items') as FormArray;
    this.items.push(this.createItem('items'));
  }

  deleteItem(index: number) {
    // control refers to your formarray
    const control = <FormArray>this.oilProcessorForm.controls['items'];
    // remove the chosen row
    control.removeAt(index);
  }

  get oilProcessorFormArray(): FormArray {
    return this.oilProcessorForm.get('items') as FormArray;
  }

  getLots(formArrayItem, i) {
        let filtered;
        // formArrayItem.controls['lotno'].patchValue(null);
        // this.selectedLotInRow[i].LotWeight = 0;
        formArrayItem.controls['lotno'].patchValue(null);
        formArrayItem.controls['processortransferweight'].patchValue('');
        // formArrayItem.controls['uniquecode'].patchValue('');
        this.selectedLotInRow[i] = [];

        filtered = this.globalData.lotDetails.filter(item => item.StrainId === formArrayItem.get('strain').value);
        this.lotDetailsArr[i] = this.dropdwonTransformService.transform(filtered, 'GrowerLotNo', 'LotId', '-- Select --');
  }

  lotOnChange(formArrayItem, index) {

    formArrayItem.controls['processortransferweight'].patchValue('');
    // formArrayItem.controls['uniquecode'].patchValue('');
    this.selectedLotInRow[index] = [];

    this.selectedLotInRow[index] = this.globalData.lotDetails.filter(item => item.LotId === formArrayItem.get('lotno').value)[0];

    // Added by Devdan :: 20-No-2018 :: Lot note comment
    this.lotNoteCount = this.selectedLotInRow[index].LotNoteCount;

    formArrayItem.patchValue({ processortransferweight: null });

    const validators =  Validators.compose([Validators.required, Validators.min(0.1), Validators.max(this.selectedLotInRow[index].LotWeight)]);
    formArrayItem.get('processortransferweight').setValidators(validators);
    formArrayItem.get('processortransferweight').updateValueAndValidity();
  }

  outwardDateOnChange() {
    const  oilReturnDate: Date = new Date();

    if (this.oilProcessorForm.controls['processor'].valid) {
      if (this.oilProcessorForm.value.outwardDate) {
        oilReturnDate.setDate(
        new Date(this.oilProcessorForm.value.outwardDate).getDate()
          + Number(this.tpPrcsrDetails.turnAroundDays)
        );

        this.oilProcessorForm.controls['expReturnDate'].patchValue(new Date(oilReturnDate));
      }
    } else {
      this.oilProcessorForm.controls['processor'].markAsDirty();
      this.oilProcessorForm.controls['processor'].updateValueAndValidity();
    }
  }

  createItem(orderFlag): FormGroup {
      return this.fb.group({
        strain: new FormControl(null, Validators.required),
        lotno: new FormControl(null, Validators.required),
        weightoflot: null,
        processortransferweight: new FormControl(null, Validators.compose([Validators.required])),
        // uniquecode: new FormControl(null, Validators.required)
        // uniquecode: new FormControl('')
      });
  }

  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.lotno];
    });
    for (const prop in result) {
        if (result[prop].length > 1 && (result[prop][0].controls['lotno'].value !== '')) {
            isError = true;
            _.forEach(result[prop], function (item: any, index) {
              item._status = 'INVALID';
            });
        } else {
            result[prop][0]._status = 'VALID';
            console.log(result[prop].length);
        }
    }
    if (isError) { return {'duplicate': 'duplicate entries'}; }
}

  removeDuplicatesById(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.StrainId === val2.StrainId) { exists = true; }
      });

      if (exists === false && value.StrainId !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  resetForm() {
    this.oilProcessorForm.reset();
    this.selectedLotInRow = [];

    this.oilProcessorForm.controls['outwardDate'].disable();
    this.oilProcessorForm = this.fb.group({
      processor: new FormControl(null,  Validators.compose([Validators.required])),
      outwardDate: new FormControl({value: this.defaultDate, disabled: true}),
      expReturnDate: new FormControl({value: this.defaultDate, disabled: true}),
      items: new FormArray([], this.customGroupValidation ),
    });

    this.tpPrcsrDetails = {
      expYieldPercent: 0,
      materialPaymant: 0,
      turnAroundDays: 0
    };
  }

  onSubmit(formModel) {
    console.log(formModel);
    const oilProcessingDetailsForApi: any = {
      OilOutwordDetails: {
        TPId: formModel.processor,
        OutwardDate: this.appCommonService.replaceStringChars(new Date(formModel.outwardDate).toLocaleDateString()),
        ExpectedReturnDate: this.appCommonService.replaceStringChars(new Date(this.oilProcessorForm.getRawValue().expReturnDate).toLocaleDateString()),
        VirtualRoleId: 0
      },
      OilOutwordLotDetails: []
    };
    // orderDetailsForApi.OrderDetails.push();
    // let duplicateFlag = false;
    if (formModel.items.length === 0) {
      this.msgs = [];
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilmaterialsout.filloneitematleast });

      return;
    }

    this.oilProcessorFormArray.controls.forEach((elementValue, elementIndex) => {
      oilProcessingDetailsForApi.OilOutwordLotDetails.push({
        'StrainId': Number(elementValue.value.strain),
        'LotId': Number(elementValue.value.lotno),
        'Weight': Number(elementValue.value.processortransferweight),
        'LotOutwordCode':  '',
        'IndexCode': elementIndex
      });

      // if ((elementValue.value.uniquecode || String(elementValue.value.uniquecode) !== '')
      //   && Number(oilProcessingDetailsForApi.OilOutwordLotDetails.filter(data =>
      //     (data.LotOutwordCode || String(data.LotOutwordCode) !== '') &&
      //   String(data.LotOutwordCode).toLocaleUpperCase() === String(elementValue.value.uniquecode).toLocaleUpperCase()).length) > 1) {
      //   // this.msgs = [];
      //   // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilmaterialsout.duplicateuniquecode });

      //   (elementValue as FormGroup).controls['uniquecode'].setErrors({ 'duplicatecode': true });

      //   duplicateFlag = true;
      // }
    });

    // if (duplicateFlag) {
    //   return;
    // }
    console.log(oilProcessingDetailsForApi);

    if (this.oilProcessorForm.valid) {

      this.confirmationService.confirm({
        message: this.globalResource.saveconfirm,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          // http call starts
          this.loaderService.display(true);
          this.oilService.saveOilOutwordDetails(oilProcessingDetailsForApi)
          .subscribe(
              data => {

                if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                  this.msgs = [];
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.globalResource.savesuccess });

                  this.resetForm();
                  this.getOilProcessingLotDetails();
                } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                  this.msgs = [];
                  this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data).toLocaleUpperCase() === 'NOBALANCE') {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilmaterialsout.nobalance });
                } else if (String(data[0].ResultKey).toUpperCase() === 'NOTPRESENT') {
                  if (data[0].NoTPPExist === 1) {
                    this.oilProcessorForm.controls['processor'].setErrors({ 'tppnotpresent': true });
                    this.loaderService.display(false);
                  }
                } else {
                  // if (String(data[0].ResultKey  ).toLocaleUpperCase() === 'DUPLICATE') {

                  //   data.forEach(dataItem => {
                  //     const uniquecodeBox = this.oilProcessorForm.get('items.' + dataItem.IndexCode).get('uniquecode');

                  //     (uniquecodeBox as FormControl).setErrors({ 'duplicatecode': true });
                  //       return;
                  //   });
                  // } else
                  if (String(data[0].ResultKey  ).toLocaleUpperCase() === 'NOBALANCE') {
                    this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilmaterialsout.lotdeleted });
                  }
                }

                // http call ends
                this.loaderService.display(false);
            },
            error => {
                console.log(error);
                this.msgs = [];
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
                // http call ends
                  this.loaderService.display(false);
            });
        },
        reject: () => {
            // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
        }
    });
    } else {
      this.appCommonService.validateAllFields(this.oilProcessorForm);
    }
  }

  // Added by Devdan :: 20-Nov-2018 :: Adding Comnent popup
  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }
}
