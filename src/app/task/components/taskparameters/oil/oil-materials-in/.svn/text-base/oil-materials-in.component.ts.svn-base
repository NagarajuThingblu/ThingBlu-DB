import { UserModel } from './../../../../../shared/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { TaskResources } from '../../../../task.resources';
import { GlobalResources } from '../../../../../global resource/global.resource';
import { OilService } from '../../../../services/oil.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { DropdwonTransformService } from '../../../../../shared/services/dropdown-transform.service';
import { Title } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-oil-materials-in',
  templateUrl: 'oil-materials-in.component.html',
  styleUrls: ['oil-materials-in.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OilMaterialsInComponent implements OnInit, OnDestroy {
  oilReturnProcessorForm: FormGroup;
  public lotSelectionForm: FormGroup;
  items: FormArray;

  public processors: SelectItem[];
  public strains: SelectItem[];
  public lots: SelectItem[];
  public pkgtypes: SelectItem[];
  public pkgsizes: SelectItem[];
  public paymentMode: SelectItem[];

  public msgs: Message[] = [];
  public selectedLots: string[] = [];

  public oilReturnProcessingResource: any;
  public globalResource: any;
  public showLotSelectionModel = false;
  public packageCodeLots: any = [];
  public selectedLotsArray: any = [];

  public defaultDate: Date;
  public _cookieService: any;

  public tpPrcsrDetails: any = {
    expYieldPercent: 0,
    materialPaymant: 0
  };

  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  public selectedPaymentKey: any = '';

  private globalData = {
    tpProcessors: [],
    lotDetails: [],
    paymentTypes: []
  };

  public selPkgCodeDetails = {
    StrainId: null,
    StrainName: null,
    PkgReturnWt: null,
    ParentRowIndex: null,
    SelectedRowIndex: null,
    PackageSize: null,
    PackageType: null,
    PackageCode: null
  };

  constructor(
    private fb: FormBuilder,
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

  ngOnDestroy() {
    // localStorage.removeItem('PkgCodeLotArrays');
    this.appCommonService.removeItem('PkgCodeLotArrays');
  }

  ngOnInit() {
    this.oilReturnProcessingResource = TaskResources.getResources().en.oilmaterialsin;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.oilReturnProcessingResource.title);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    // localStorage.removeItem('PkgCodeLotArrays');
    this.appCommonService.removeItem('PkgCodeLotArrays');
    this.oilReturnProcessorForm = this.fb.group({
      processor: new FormControl(null, Validators.compose([Validators.required])),
      oilReturnDate: new FormControl(null, Validators.compose([Validators.required])),
      paymentMode: new FormControl(null, Validators.compose([Validators.required])),
      paymentMoney: new FormControl(null),
      items: this.fb.array([]),
    });

    this.lotSelectionForm = this.fb.group({
      arrLotList: new FormArray([])
    });

    this.getPaymentModes();
    this.getProcessors();
  }

  processorOnChange() {
    this.loaderService.display(true);
    this.oilService.getProcessorDetails(this.oilReturnProcessorForm.get('processor').value).subscribe(
      data => {
        let filtered;
        if (data !== 'No data found!') {
          this.globalData.lotDetails = data.Table;

          filtered = this.removeDuplicatesById(data.Table);

          this.strains = this.dropdwonTransformService.transform(filtered, 'StrainName', 'StrainId', '-- Select --');

          this.pkgtypes = this.dropdwonTransformService.transform(data.Table1, 'TPPkgTypeName', 'TPPkgTypeId', '-- Select --');

          const tpPrcsrDetails = this.globalData.tpProcessors.filter(pData =>
            pData.TPId === this.oilReturnProcessorForm.value.processor
          )[0];

          this.tpPrcsrDetails.expYieldPercent = tpPrcsrDetails.ExpectedYield;
          this.tpPrcsrDetails.materialPaymant = tpPrcsrDetails.MaterialPaymant;

        } else {
          this.globalData.lotDetails = [];
          this.strains = [];
          this.pkgtypes = [];
        }

        this.selectedLotsArray = [];
        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // localStorage.setItem('PkgCodeLotArrays', JSON.stringify(this.selectedLotsArray));
        this.appCommonService.setLocalStorage('PkgCodeLotArrays', JSON.stringify(this.selectedLotsArray));

        this.loaderService.display(false);
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get Oil Processing Lot Details complete')
    );
  }

  paymentModeOnChange() {
    const paymentBox = this.oilReturnProcessorForm.get('paymentMoney');
    const paymentModeBox = this.oilReturnProcessorForm.get('paymentMode');
    let validators;

    this.selectedPaymentKey = this.globalData.paymentTypes.filter(data => data.PaymentTypeId === paymentModeBox.value)[0].PaymentKey;

    validators = String(this.selectedPaymentKey).toLocaleUpperCase() === 'MONEY' ? Validators.compose([Validators.required]) : null;
    paymentBox.setValidators(validators);
    paymentBox.updateValueAndValidity();
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

  getProcessors() {
    this.loaderService.display(true);
    this.oilService.getProcessorsForInward().subscribe(
      data => {
        // console.log(data);
        // this.globalData.Employees = data;
        if (data !== 'No data found!') {
          this.globalData.tpProcessors = data;
          this.processors = this.dropdwonTransformService.transform(data, 'TPName', 'TPId', '-- Select --');
        } else {
          this.globalData.tpProcessors = [];
          this.processors = [];
        }
        this.loaderService.display(false);
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get Processors complete')
    );
  }

  getPaymentModes() {
    this.loaderService.display(true);
    this.oilService.getPaymentModes().subscribe(
      (data: any) => {
        // console.log(data);
        // this.globalData.Employees = data;
        if (data !== 'No data found!') {
          this.globalData.paymentTypes = data;
          // this.paymentMode = data;
          this.paymentMode = this.dropdwonTransformService.transform(data, 'PaymentTypeName', 'PaymentTypeId', '-- Select --');
        } else {
          // this.globalData.tpProcessors = [];
          this.paymentMode = [];
        }
        this.loaderService.display(false);
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get Payment Mode complete')
    );
  }

  addItem(): void {
    // this.items = this.oilReturnProcessorForm.get('items') as FormArray;
    // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
    // const lotDetails = JSON.parse(localStorage.getItem('PkgCodeLotArrays'));
    const lotDetails = JSON.parse(this.appCommonService.getLocalStorage('PkgCodeLotArrays'));
    let lotEmpty = false;

    if (lotDetails !== null) {
      for (let i = 0; i < lotDetails.length; i++) {
          if (lotDetails[i] !== undefined) {
            if (lotDetails[i].length === 0) { lotEmpty = true; break; }
          } else {
            continue;
          }
      }

      if (lotEmpty) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.lotempty });
        return;
      }
    }

    if (this.oilReturnProcessorForm.controls['processor'].valid) {
      this.oilReturnProcessorFormArray.push(this.createItem('items'));
    } else {
      this.oilReturnProcessorForm.controls['processor'].markAsDirty();
    }
  }

  deleteItem(index: number) {
    // control refers to your formarray
    const control = <FormArray>this.oilReturnProcessorForm.controls['items'];
    // remove the chosen row
    control.removeAt(index);
  }

  get oilReturnProcessorFormArray(): FormArray {
    return this.oilReturnProcessorForm.get('items') as FormArray;
  }

  get LotListFormArray(): FormArray {
    return this.lotSelectionForm.get('arrLotList') as FormArray;
  }

  lotInnerFormArray(comp): FormArray {
    return comp.get('LotPackageDetails') as FormArray;
  }

  createItem(orderFlag): FormGroup {
    return this.fb.group({
      strain: new FormControl(null, Validators.compose([Validators.required])),
      pkgtype: new FormControl(null, Validators.compose([Validators.required])),
      pkgsize: new FormControl(null, Validators.compose([Validators.required])),
      pkgreturnqty: new FormControl(null, Validators.compose([Validators.required])),
      packageCode: new FormControl(null, Validators.compose([Validators.required])),
      // LotPackageDetails: this.fb.array([])
    });
  }

  createLotControls(fb: FormBuilder, pkgIndex: Number) {
    let packageCodeBox, lotBox;
    packageCodeBox = [null, Validators.required];
    lotBox = [null];

    return fb.group({
      pkgIndex: pkgIndex,
      packagecode: packageCodeBox,
      lotno: lotBox
    });
  }

  openLotSelection(formArrayItem, rowIndex) {
    console.log('formArrayItem', formArrayItem);
    const packageCode = formArrayItem.controls['packageCode'];
    const objStrain = formArrayItem.controls['strain'];

    const objPkgSize = formArrayItem.controls['pkgsize'];
    const objPkgReturnedQty = formArrayItem.controls['pkgreturnqty'];

    this.packageCodeLots = [];
    this.packageCodeLots = this.globalData.lotDetails.filter(result => result.StrainId === objStrain.value);

    this.selPkgCodeDetails.PackageCode = packageCode.value;
    this.selPkgCodeDetails.ParentRowIndex = 0;
    this.selPkgCodeDetails.SelectedRowIndex = rowIndex;
    this.selPkgCodeDetails.StrainId = objStrain.value;
    this.selPkgCodeDetails.StrainName = this.packageCodeLots[0].StrainName;
    this.selPkgCodeDetails.PkgReturnWt = Number(objPkgSize.value) * Number(objPkgReturnedQty.value);
    this.selPkgCodeDetails.PackageSize = Number(objPkgSize.value);

    this.lotSelectionForm = this.fb.group({
      arrLotList: this.fb.array(this.packageCodeLots.map(this.createLotSelectionControls(this.fb, rowIndex, formArrayItem)))
    });

    // if (packageCode.value === null || String(packageCode.value).trim() === '') {
    //   this.msgs = [];
    //   this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please enter package code.' });

    //   packageCode.markAsDirty();
    // } else { this.showLotSelectionModel = true; }

    this.showLotSelectionModel = true;
  }

  changeValidator(selected, index) {
    const processedbox = this.lotSelectionForm.get('arrLotList.' + index).get('oilprocessedwt');
    const returnedbox = this.lotSelectionForm.get('arrLotList.' + index).get('oilreturnedwt');
    const transferbox = this.lotSelectionForm.get('arrLotList.' + index).get('transferwt');
    let validators;

    validators = selected ? Validators.compose([Validators.required, Validators.min(0.1), Validators.max(transferbox.value)]) : null;
    processedbox.setValidators(validators);

    validators = selected ? Validators.compose([Validators.min(0.1), Validators.max(processedbox.value)]) : null;

    returnedbox.setValidators(validators);
    processedbox.updateValueAndValidity();
    returnedbox.updateValueAndValidity();
  }

  createLotSelectionControls(fb: FormBuilder, parentindex: number, formArrayItem: FormGroup) {
    const packageCode = formArrayItem.controls['packageCode'];
    return (object, index) => {
      let checkbox;
      let oilProcessedBox;
      let oilReturnedBox;

      const lotSelectedDetails = this.selectedLotsArray[this.selPkgCodeDetails.SelectedRowIndex];

      if (lotSelectedDetails) {

        const lotRowDetails = [];

        lotSelectedDetails.forEach(data => {
          //   console.log(index);
          //   console.log(data.Index);

          if (data.Index === index) {
            lotRowDetails.push(data);
          }
        });

        console.log('lotRowDetails', lotRowDetails);
        if (lotRowDetails.length) {
          checkbox = lotRowDetails[0].Selected;
          oilProcessedBox = lotRowDetails[0].Selected
            ? [lotRowDetails[0].ProcessedWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(object.TransferWt)])]
            : null;

          oilReturnedBox = lotRowDetails[0].Selected
            ? [lotRowDetails[0].ReturnedWt, Validators.compose([Validators.min(0.1), Validators.max(lotRowDetails[0].ProcessedWt)])]
            : null;
        } else {
          checkbox = object.selected;
          oilProcessedBox = object.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(object.TransferWt)])]
            : null;

          oilReturnedBox = object.selected ? [null, Validators.compose([Validators.min(0.1), Validators.max(object.TransferWt)])]
            : null;
        }
      } else {
        checkbox = object.selected;
        oilProcessedBox = object.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(object.TransferWt)])]
          : null;

        oilReturnedBox = object.selected ? [null, Validators.compose([Validators.min(0.1), Validators.max(object.TransferWt)])]
          : null;
      }
      return fb.group({
        lotno: checkbox, transferwt: object.TransferWt, questionNumber: index, LotId: object.LotId,
        AvailWt: object.TransferWt, GrowerLotNo: object.GrowerLotNo, oilprocessedwt: oilProcessedBox, oilreturnedwt: oilReturnedBox,
        oilPkgCode: packageCode.value,
        // Added by Devdan :: 20-Nov-2018 :: Lot note count
        LotNoteCount: object.LotNoteCount
      });
    };
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  clearLotSelection(formArrayItem, index, Flag) {
    if (Flag === 'STRAIN') {
      for (let i = 0; i < formArrayItem.get('pkgreturnqty').value; i++) {
        this.selectedLotsArray[index] = [];
      }
    }
    // else if (Flag === 'PKGCODE') {
    //   this.selectedLotsArray[index] = [];
    // }
    // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
    // localStorage.setItem('PkgCodeLotArrays', JSON.stringify(this.selectedLotsArray));
    this.appCommonService.setLocalStorage('PkgCodeLotArrays', JSON.stringify(this.selectedLotsArray));
  }
  resetForm() {
    // this.oilReturnProcessorForm.reset();
    // localStorage.removeItem('PkgCodeLotArrays');
    this.appCommonService.removeItem('PkgCodeLotArrays');

    this.tpPrcsrDetails = {
      expYieldPercent: 0,
      materialPaymant: 0
    };

    this.oilReturnProcessorForm = this.fb.group({
      processor: new FormControl(null, Validators.compose([Validators.required])),
      oilReturnDate: new FormControl(null, Validators.compose([Validators.required])),
      paymentMode: new FormControl(null, Validators.compose([Validators.required])),
      paymentMoney: new FormControl(null),
      items: this.fb.array([]),
    });
  }

  submitLotSelection(formModel) {
    let totalLotWt = 0;
    const lotDetails = [];
    let validationFlag = false;
    let oldLotDetails = [];
    let selectedLotCounts;

    if (this.lotSelectionForm.valid) {
        selectedLotCounts = this.LotListFormArray.value.filter(element => element.lotno === true).length;

        formModel.arrLotList.forEach(result => {
          totalLotWt += result.lotno ? Number(result.oilreturnedwt) : 0;
        });
        // if (totalLotWt !== Number(this.selPkgCodeDetails.PackageSize)) {
        //   this.msgs = [];
        //   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.lotwtgreaterthanpkgwt });

        //   return;
        // }

        // Store old lot details into a variable
        oldLotDetails = this.selectedLotsArray[this.selPkgCodeDetails.SelectedRowIndex];

        // Iterate through all lot and  insert only selected checkbox lot information
        formModel.arrLotList.forEach(result => {
          if (result.lotno === true) {
            lotDetails.push(
              {
                LotNo: result.LotId,
                GrowerLotNo: result.GrowerLotNo,
                TransferWt: result.transferwt,
                ProcessedWt: result.oilprocessedwt,
                ReturnedWt: result.oilreturnedwt,
                Selected: true,
                Index: result.questionNumber,
                StrainId: this.selPkgCodeDetails.StrainId,
                PackageCode: this.selPkgCodeDetails.PackageCode,
                oilPkgCode: this.selPkgCodeDetails.PackageCode,
                // Added by Devdan :: 20-Nov-2018 :: Lot note count
                LotNoteCount: result.LotNoteCount
              }
            );
          }
        });

        // assign whatever new lot information has been inserted into lotDetails object to currect details
        this.selectedLotsArray[this.selPkgCodeDetails.SelectedRowIndex] = lotDetails;
        console.log('this.selectedLotsArraythis.selectedLotsArray', this.selectedLotsArray.length);
        // loop through all lots caluculate total used wt in all packages
        this.LotListFormArray.controls.forEach(result => {
          if (result.value.lotno === true) {
            let lotTotalWt = 0;
            for (let i = 0; i < this.selectedLotsArray.length; i++) {
              if (this.selectedLotsArray[i] === undefined) { continue; }
             // for (let j = 0; j < this.selectedLotsArray[i].length; j++) {
                if (this.selectedLotsArray[i] !== undefined) {
                  this.selectedLotsArray[i].forEach(item => {
                    if (item.LotNo === result.value.LotId) {
                      lotTotalWt += item.ProcessedWt;
                    }
                  });
                }
              // }
            }

            if (lotTotalWt > Number(result.value.transferwt)) {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.lotwtgreaterthantfwt });

              // If error found then restore the object with old lot details that we previously assigned it.
              this.selectedLotsArray[this.selPkgCodeDetails.SelectedRowIndex] = oldLotDetails;
              (<FormGroup>result).controls['oilprocessedwt'].setErrors({ 'TFWTNOTMATCHED': true });
              (<FormGroup>result).controls['oilprocessedwt'].updateValueAndValidity();

              validationFlag = true;
            }

            if (selectedLotCounts === 1) {
              // (<FormGroup>result).controls['oilreturnedwt'].setValidators(Validators.compose(
              //     [Validators.required, Validators.min(0.1), Validators.max(result.value.oilprocessedwt)]));
              // (<FormGroup>result).controls['oilreturnedwt'].setErrors({ 'required': true });
              // (<FormGroup>result).controls['oilreturnedwt'].markAsDirty();
              // (<FormGroup>result).controls['oilreturnedwt'].updateValueAndValidity();

              // if (!(<FormGroup>result).controls['oilreturnedwt'].valid) {

              // }
              if (result.value.oilreturnedwt === null || String(result.value.oilreturnedwt).trim() === '') {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.oilreturnwtrequired });

                validationFlag = true;
                this.selectedLotsArray[this.selPkgCodeDetails.SelectedRowIndex] = oldLotDetails;
                return;
              }
            }
          }
        });

        if (validationFlag) {
          return;
        }
        console.log('PkgCodeLotArrays', this.selectedLotsArray);
        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // localStorage.setItem('PkgCodeLotArrays', JSON.stringify(this.selectedLotsArray));
        this.appCommonService.setLocalStorage('PkgCodeLotArrays', JSON.stringify(this.selectedLotsArray));
        this.showLotSelectionModel = false;
    } else {
        this.appCommonService.validateAllFields(this.lotSelectionForm);
    }
  }

  submitOilReturnDetails(formModel) {
    let oilProcessedDetailsForApi;
    let duplicateEntry = false;
    let lotEmpty = false;

    oilProcessedDetailsForApi = {
      OilInwordDetails: {
        TPId: formModel.processor,
        OilReturnDate: new Date(formModel.oilReturnDate).toLocaleDateString().replace(/\u200E/g, ''),
        PaymentMode: formModel.paymentMode,
        PaymentValue: this.selectedPaymentKey === 'MATERIAL' ? Number(this.tpPrcsrDetails.materialPaymant) : Number(formModel.paymentMoney),
        ExpectedYield: Number(this.tpPrcsrDetails.expYieldPercent),
        VirtualRoleId: 0
      },
      OilPackageDetails: [],
      OilInwordLotDetails: []
    };

    // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
    // const lotDetails = JSON.parse(localStorage.getItem('PkgCodeLotArrays'));
    const lotDetails = JSON.parse(this.appCommonService.getLocalStorage('PkgCodeLotArrays'));

    if (!this.oilReturnProcessorFormArray.controls.length) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.addpkgdetails });
      return;
    }

    this.oilReturnProcessorFormArray.controls.forEach((element, index) => {
     // this.lotInnerFormArray(element).controls.forEach((item, subIndex) => {

        let oilProcessedWt = 0;
        if (String(element.value.packageCode) !== '' && Number(oilProcessedDetailsForApi.OilPackageDetails.filter(data =>
          String(data.OilPkgCode) !== ''
          && String(data.OilPkgCode).toLocaleUpperCase() === String(element.value.packageCode).toLocaleUpperCase()).length) > 0) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.duplicatePackageCode });
          duplicateEntry = true;
          (<FormGroup>element).controls['packageCode'].setErrors({ 'duplicatepkgcode': true });
          (<FormGroup>element).controls['packageCode'].updateValueAndValidity();
        }

        if (this.selectedLotsArray.length) {
          this.selectedLotsArray[index].forEach((DataObject) => {
            if (DataObject) {
              oilProcessedWt += Number(DataObject.ProcessedWt);
            }
          });
        }

        oilProcessedDetailsForApi.OilPackageDetails.push({
          StrainId: element.value.strain,
          TPPkgTypeId: element.value.pkgtype,
          UnitValue: element.value.pkgsize,
          Qty: Number(element.value.pkgreturnqty),
          OilWt: Number(element.value.pkgsize * element.value.pkgreturnqty),
          PaymentOilWt: 0,
          TotalOilWt: Number(element.value.pkgsize * element.value.pkgreturnqty),
          ProcessedWt: oilProcessedWt,
          OilPkgCode: element.value.packageCode,
          IndexCode: index
        });
     // });
    });

    if (duplicateEntry) {
      return;
    }

    if (lotDetails !== null) {
      for (let i = 0; i < lotDetails.length; i++) {
        // for (let j = 0; j < lotDetails[i].length; j++) {
          if (lotDetails[i] !== undefined) {
            if (lotDetails[i].length === 0) { lotEmpty = true; break; }
            lotDetails[i].forEach(item => {
              const uniquecodeBox = (this.oilReturnProcessorForm.get('items.' + i))
              .get('packageCode');

              oilProcessedDetailsForApi.OilInwordLotDetails.push({
                OilPkgCode:  uniquecodeBox.value,
                LotId: item.LotNo,
                ProcessedWt: item.ProcessedWt,
                OilWt: item.ReturnedWt ? item.ReturnedWt : 0
              });
            });
          } else {
            oilProcessedDetailsForApi.OilInwordLotDetails = [];
          // }
          }
      }

      if (lotEmpty) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.lotempty });
        return;
      }
    }
    console.log(oilProcessedDetailsForApi);

    if (this.oilReturnProcessorForm.valid) {
    this.confirmationService.confirm({
      message: this.globalResource.saveconfirm,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
          // http call starts
          this.loaderService.display(true);
        this.oilService.saveOilInWordDetails(oilProcessedDetailsForApi)
        .subscribe(
            data => {

              if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs = [];
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.globalResource.savesuccess });

                this.resetForm();
              } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs = [];
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else {
                if (String(data[0].ResultKey  ).toLocaleUpperCase() === 'DUPLICATE') {
                  data.forEach(dataItem => {
                    const arrIndexCode = String(dataItem.IndexCode);
                    const uniquecodeBox = (this.oilReturnProcessorForm.get('items.' + arrIndexCode))
                    .get('packageCode');

                    // this.msgs = [];
                    // this.msgs.push({severity: 'warn',
                    //   summary: this.globalResource.applicationmsg,
                    //   detail: this.oilReturnProcessingResource.duplicatePackageCode });

                    (uniquecodeBox as FormControl).setErrors({ 'duplicatepkgcode': true });
                    this.loaderService.display(false);
                      return;
                  });
                }
                if (String(data[0].ResultKey  ).toLocaleUpperCase() === 'TPPPKGTYPENOTPRESENT') {
                  data.forEach(dataItem => {
                    // alert(dataItem.ErrRowIndex);
                    const arrIndexCode = String(dataItem.ErrRowIndex);
                    const packagetype = (this.oilReturnProcessorForm.get('items.' + (Number(arrIndexCode))))
                    .get('pkgtype');

                    // this.msgs = [];
                    // this.msgs.push({severity: 'warn',
                    //   summary: this.globalResource.applicationmsg,
                    //   detail: this.oilReturnProcessingResource.duplicatePackageCode });

                    (packagetype as FormControl).setErrors({ 'pkgtypenotexist': true });
                    this.loaderService.display(false);
                      return;
                  });
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
     this.appCommonService.validateAllFields(this.oilReturnProcessorForm);
   }
  }


  // Added by Devdan :: 20-Nov-2018 :: Adding Comnent popup
  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }
}
