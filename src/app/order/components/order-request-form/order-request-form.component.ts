import { CookieService } from 'ngx-cookie-service';
import { PositiveIntegerValidator } from './../../../shared/validators/positive-integer.validator';
import { OrderService } from './../../service/order.service';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, AbstractControl, FormControlName } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { GlobalResources } from '../../../global resource/global.resource';
import { TaskResources } from '../../../task/task.resources';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { OrderResource } from '../../order.resource';
import * as _ from 'lodash';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { Title } from '@angular/platform-browser';
import { UserModel } from '../../../shared/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
// import { HttpMethodsService } from '../../../../shared/services/http-methods.service';

// const originFormControlNgOnChanges = FormControlDirective.prototype.ngOnChanges;
// FormControlDirective.prototype.ngOnChanges = function () {
//     this.form.nativeElement = this.valueAccessor._elementRef.nativeElement;
//     return originFormControlNgOnChanges.apply(this, arguments);
// };

@Component({
  moduleId: module.id,
  selector: 'app-order-request-form',
  templateUrl: 'order-request-form.component.html',
  styleUrls: ['order-request-form.component.css']
})
export class OrderRequestFormComponent implements OnInit {
  orderRequestForm: FormGroup;

  retailers: SelectItem[];
  UBI: any;
  UBIEmpty: any = null;
  retailersNew: any[];
  ABrands: SelectItem[];
  BBrands: SelectItem[];
  CBrands: SelectItem[];

  UBICode: any;
  AData: any;
  BData: any;
  CData: any;
  // Commented by Devdan :: 31-Oct-2018 :: Unused
  // SubBrands: SelectItem[];
  // Strains: SelectItem[];
  // Commented by Devdan :: 31-Oct-2018 :: Unused
  // BudPackageTypes: SelectItem[];
  // JointsPackageTypes: SelectItem[];
  // OilPackageTypes: SelectItem[];
  // Commented by Devdan :: 31-Oct-2018 :: Unused
  // BudPackageSizes: SelectItem[];
  // JointsPackageSizes: SelectItem[];
  // OilPackageSizes: SelectItem[];

  blockSpace: RegExp = /[^\s]/;
  public defaultDate: Date;
  public _cookieService: any;

  public globalData: any = {
    brandStrainDetails: []
  };

  whichControl: any;

  submitted = false;
  public DraftOrderId: number;
  public draftList: any;
  public draftMsg: string;
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dropdwonTransformService: DropdwonTransformService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
   // private httpMethods: HttpMethodsService,

  ) {
      this._cookieService = <UserModel>this.appCommonService.getUserProfile();
  }

  items: FormArray;
  aBudItems = new FormArray([], this.customGroupValidation );
  bJointsItems = new FormArray([], this.customGroupValidation );
  cOilItems = new FormArray([], this.customGroupValidation );

  public msgs: Message[] = [];
  public globalResource: any;
  public orderRequestResource: any;

  createItem(orderFlag): FormGroup {
    if (orderFlag === 'aBudItems') {
      return this.fb.group({
        brand: new FormControl(null, Validators.required),
        subbrand: new FormControl(null),
        strain: new FormControl(null, Validators.required),
        packageType: new FormControl(null, Validators.required),
        packageSize: new FormControl(null, Validators.required),
        itemQty: new FormControl(1, Validators.required),
        orderQty: new FormControl(null, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger]))
      });
    } else if (orderFlag === 'bJointsItems') {
      return this.fb.group({
        brand: new FormControl(null, Validators.required),
        subbrand: new FormControl(null),
        strain: new FormControl(null, Validators.required),
        packageType: new FormControl(null, Validators.required),
        packageSize: new FormControl(null, Validators.required),
        itemQty: new FormControl(null, Validators.required),
        orderQty: new FormControl(null, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger]))
      });
    } else if (orderFlag === 'cOilItems') {
      return this.fb.group({
        brand: new FormControl(null, Validators.required),
        subbrand: new FormControl(null),
        strain: new FormControl(null, Validators.required),
        packageType: new FormControl(null, Validators.required),
        packageSize: new FormControl(null, Validators.required),
        itemQty: new FormControl(1, Validators.required),
        orderQty: new FormControl(null, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger]))
      });
    }
  }

  createCopyItem(orderFlag, currentItem): FormGroup {
    if (orderFlag === 'aBudItems') {
      return this.fb.group({
        brand: new FormControl(currentItem.get('brand').value, Validators.required),
        subbrand: new FormControl(currentItem.get('subbrand').value),
        strain: new FormControl(currentItem.get('strain').value, Validators.required),
        packageType: new FormControl(currentItem.get('packageType').value, Validators.required),
        packageSize: new FormControl(currentItem.get('packageSize').value, Validators.required),
        itemQty: new FormControl(currentItem.get('itemQty').value, Validators.required),
        orderQty: new FormControl(null, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger]))
      });
    } else if (orderFlag === 'bJointsItems') {
      return this.fb.group({
        brand: new FormControl(currentItem.get('brand').value, Validators.required),
        subbrand: new FormControl(currentItem.get('subbrand').value),
        strain: new FormControl(currentItem.get('strain').value, Validators.required),
        packageType: new FormControl(currentItem.get('packageType').value, Validators.required),
        packageSize: new FormControl(currentItem.get('packageSize').value, Validators.required),
        itemQty: new FormControl(currentItem.get('itemQty').value, Validators.required),
        orderQty: new FormControl(null, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger]))
      });
    } else if (orderFlag === 'cOilItems') {
      return this.fb.group({
        brand: new FormControl(currentItem.get('brand').value, Validators.required),
        subbrand: new FormControl(currentItem.get('subbrand').value),
        strain: new FormControl(currentItem.get('strain').value, Validators.required),
        packageType: new FormControl(currentItem.get('packageType').value, Validators.required),
        packageSize: new FormControl(currentItem.get('packageSize').value, Validators.required),
        itemQty: new FormControl(currentItem.get('itemQty').value, Validators.required),
        orderQty: new FormControl(null, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger]))
      });
    }
  }

  addItem(orderFormArray): void {
    this.items = this.orderRequestForm.get(orderFormArray) as FormArray;
    this.items.push(this.createItem(orderFormArray));
  }

  copyCurrentItem(orderFormArray, currentItem) {
    this.items = this.orderRequestForm.get(orderFormArray) as FormArray;
    this.items.push(this.createCopyItem(orderFormArray, currentItem));
  }

  deleteItem(index: number, orderFormArray) {
    // control refers to your formarray
    const control = <FormArray>this.orderRequestForm.controls[orderFormArray];
    // remove the chosen row
    control.removeAt(index);
  }

  ngOnInit() {
    this.DraftOrderId = 0;
    this.draftMsg = 'Order ID Required';
    this.orderRequestResource = OrderResource.getResources().en.orderrequest;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.orderRequestResource.orderrequesttitle);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.defaultDate.setDate( this.defaultDate.getDate() + 1 );
    this.orderRequestForm = this.fb.group({
      retailers: new FormControl(null, Validators.required),
      ubicode: new FormControl(null),
      deliverydate: new FormControl(null, Validators.required),
      orderrefid: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(15)])),
      aBudItems: this.aBudItems,
      bJointsItems: this.bJointsItems,
      cOilItems: this.cOilItems
    });

    // bind redirection draft data
    this.DraftOrderId = this.route.snapshot.params.draftOrderId;
    if (this.DraftOrderId > 0) {
      // this.getRetailers();
     // this.getBrandStrainPackageByClient();
      this.loaderService.display(true);
      const observable1 = this.orderService.getRetailers(true);
      const observable2 = this.orderService.getBrandStrainPackageByClient();
      forkJoin([observable1, observable2]).subscribe(result => {
        this.retailers = this.dropdwonTransformService.transform(result[0], 'RetailerName', 'RetailerId', '-- Select --') ;
        this.retailersNew = result[0];
        this.globalData.brandStrainDetails = result[1];
        let brands;

        // For A Bud
        this.AData = result[1].Table.filter(item => {
          return item.SkewKeyName === 'BUD';
        });
        brands = this.removeDuplicatesById(this.AData);
        this.ABrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');

        // For B Joints
        this.BData = result[1].Table.filter(item => {
          return item.SkewKeyName === 'JOINTS';
        });
        brands = this.removeDuplicatesById(this.BData);
        this.BBrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');

        // For C Oil
        this.CData = result[1].Table.filter(item => {
          return item.SkewKeyName === 'OIL';
        });
        brands = this.removeDuplicatesById(this.CData);
        this.CBrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');
        // assign data
        this.loaderService.display(true);
      this.orderService.getDraftOrdersByDraftId(this.DraftOrderId).subscribe(data => {
        this.getRetailers();
        this.getBrandStrainPackageByClient();
         this.orderRequestForm.controls['orderrefid'].patchValue(data.Table[0].DraftOrderNo);
         this.orderRequestForm.controls['retailers'].patchValue(data.Table[0].RetailerId ? data.Table[0].RetailerId : null);
         if (data.Table[0].RetailerId > 0) { this.getUBICode(); }
         this.draftList = data.Table1;
            data.Table1.map((object, index) => {
              if (object.SkewKeyName === 'BUD') {
              this.items = this.orderRequestForm.get('aBudItems') as FormArray;
              this.items.push(this.createdraftItem(object));
            } else if (object.SkewKeyName === 'JOINTS') {
              this.items = this.orderRequestForm.get('bJointsItems') as FormArray;
              this.items.push(this.createdraftItem(object));
            }  else {
              this.items = this.orderRequestForm.get('cOilItems') as FormArray;
              this.items.push(this.createdraftItem(object));
            }
            });

         /*   if (this.aBudItems.controls.length === 0) {
              this.addItem('aBudItems');
              }
              if (this.bJointsItems.controls.length === 0) {
                this.addItem('bJointsItems');
                }
                if (this.cOilItems.controls.length === 0) {
                  this.addItem('cOilItems');
                  }*/
        });
      });
        this.loaderService.display(false);
    } else {
       const observable1 = this.orderService.getRetailers(true);
       const observable2 = this.orderService.getBrandStrainPackageByClient();
      forkJoin([observable1, observable2]).subscribe(result => {
        this.retailers = this.dropdwonTransformService.transform(result[0], 'RetailerName', 'RetailerId', '-- Select --') ;
        this.retailersNew = result[0];
        this.globalData.brandStrainDetails = result[1];
        let brands;

        // For A Bud
        this.AData = result[1].Table.filter(item => {
          return item.SkewKeyName === 'BUD';
        });
        brands = this.removeDuplicatesById(this.AData);
        this.ABrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');

        // For B Joints
        this.BData = result[1].Table.filter(item => {
          return item.SkewKeyName === 'JOINTS';
        });
        brands = this.removeDuplicatesById(this.BData);
        this.BBrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');

        // For C Oil
        this.CData = result[1].Table.filter(item => {
          return item.SkewKeyName === 'OIL';
        });
        brands = this.removeDuplicatesById(this.CData);
        this.CBrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');
       /* if (this.getCOilItems.controls.length === 0) {
          this.addItem('aBudItems');
          this.addItem('bJointsItems');
          this.addItem('cOilItems');
          } */
          this.loaderService.display(false);
      });


     // this.getRetailers();
     // this.getBrandStrainPackageByClient();

    }

  }
  // get diagnostic() { return JSON.stringify(this.orderRequestForm.value); }

  showErrors(event, overlaypanel: OverlayPanel) {
    overlaypanel.toggle(event);
  }

  get getABudItems(): FormArray {
    return this.orderRequestForm.get('aBudItems') as FormArray;
  }

  get getBJointsItems(): FormArray {
    return this.orderRequestForm.get('bJointsItems') as FormArray;
  }

  get getCOilItems(): FormArray {
    return this.orderRequestForm.get('cOilItems') as FormArray;
  }
  getUBICode() {
    this.UBICode = null;
    const UBI = this.retailersNew.filter(x => x.RetailerId === this.orderRequestForm.value.retailers);
    this.UBI = UBI[0]['UBINo'];
    this.UBICode = this.UBI;
  }

  getRetailers() {
    this.loaderService.display(true);
    this.orderService.getRetailers(true).subscribe(
      data => {
        // console.log(data);
        this.retailers = this.dropdwonTransformService.transform(data, 'RetailerName', 'RetailerId', '-- Select --') ;
        this.retailersNew = data;
        this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('sucess')
    );
  }

  getBrandStrainPackageByClient() {
    this.loaderService.display(true);
    this.orderService.getBrandStrainPackageByClient().subscribe(
      data => {
        // console.log(data);
        if (data !== 'No data found!') {

          this.globalData.brandStrainDetails = data;
          let brands;

          // For A Bud
          this.AData = data.Table.filter(item => {
            return item.SkewKeyName === 'BUD';
          });
          brands = this.removeDuplicatesById(this.AData);
          this.ABrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');

          // For B Joints
          this.BData = data.Table.filter(item => {
            return item.SkewKeyName === 'JOINTS';
          });
          brands = this.removeDuplicatesById(this.BData);
          this.BBrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');

          // For C Oil
          this.CData = data.Table.filter(item => {
            return item.SkewKeyName === 'OIL';
          });
          brands = this.removeDuplicatesById(this.CData);
          this.CBrands = this.dropdwonTransformService.transform(brands, 'BrandName', 'BrandId', '-- Select --');
          // this.Strains = this.dropdwonTransformService.transform(data.Table1, 'StrainName', 'StrainId', '-- Select --');

          // this.BudPackageTypes = this.dropdwonTransformService.transform(
          //       data.Table2.filter(result => result.SkewName === 'Bud'),
          //           'PkgTypeName', 'PkgTypeId', '-- Select --');

          // this.JointsPackageTypes = this.dropdwonTransformService.transform(
          //   data.Table2.filter(result => result.SkewName === 'Joints'),
          //   'PkgTypeName', 'PkgTypeId', '-- Select --');

          // this.OilPackageTypes = this.dropdwonTransformService.transform(
          //  data.Table2.filter(result => result.SkewName === 'Oil'),
          //   'PkgTypeName', 'PkgTypeId', '-- Select --');

          //   console.log(this.globalData.brandStrainDetails.Table3.filter(result => result.PkgTypeName === 'Bag'));
          // this.BudPackageSizes = this.dropdwonTransformService.transform(data.Table3, 'UnitValue', 'UnitValue', '-- Select --');

        } else {
          this.AData = [];
          this.BData = [];
          this.CData = [];

          this.ABrands = [];
          this.BBrands = [];
          this.CBrands = [];
        }
        this.loaderService.display(false);
        // this.retailers = this.dropdwonTransformService.transform(data, 'RetailerName', 'RetailerId', '-- Select --') ;
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('sucess')
    );
  }

  dropdownOnChange(flag, formArrayItem) {
    if (String(flag).toLocaleUpperCase() === 'BRAND') {
      (formArrayItem as FormGroup).patchValue({ subbrand: null, strain: null, packageType: null, packageSize: null });
      (formArrayItem as FormGroup).markAsPristine();
    } else if (String(flag).toLocaleUpperCase() === 'SUBBRAND') {
      (formArrayItem as FormGroup).patchValue({ strain: null, packageType: null, packageSize: null });
      (formArrayItem as FormGroup).markAsPristine();
    } else if (String(flag).toLocaleUpperCase() === 'STRAIN') {
      (formArrayItem as FormGroup).patchValue({ packageType: null, packageSize: null });
      (formArrayItem as FormGroup).markAsPristine();
    } else if (String(flag).toLocaleUpperCase() === 'PKGTYPE') {
      (formArrayItem as FormGroup).patchValue({ packageSize: null });
      (formArrayItem as FormGroup).markAsPristine();
    }
  }

  removeDuplicatesById(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.BrandId === val2.BrandId) { exists = true; }
      });

      if (exists === false && value.BrandId !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  packageTypeChange(skewName, formArrayGroup) {
    // console.log(formArrayGroup.controls['packageSize']);
    // console.log(skewName);
    // const selectedPackageType = formArrayGroup.controls['packageType'].value;
    // const filteredData =  this.globalData.brandStrainDetails.Table3.filter(result => result.PkgTypeId === selectedPackageType);

    // formArrayGroup.value.pkgSizeOptions = this.dropdwonTransformService.transform(filteredData, 'UnitValue', 'UnitValue', '-- Select --');

  }

  bindDynamicPackageSize(fromArrayGroup) {
    // return [
    //     {label: '-- Select --', value: null},
    //     {label: '1 gram', value: '1'},
    //     {label: '2 gram', value: '2'},
    //     {label: '3.4 gram', value: '3'},
    //     {label: '7 gram', value: '4'},
    //   ];
    // console.log(fromArrayGroup.get('packageSize'));
    // setTimeout(() => {
    if (this.globalData.brandStrainDetails.Table3) {
      const selectedPackageType = fromArrayGroup.controls['packageType'].value;
      const filteredData =  this.globalData.brandStrainDetails.Table3.filter(result => result.PkgTypeId === selectedPackageType);

     return this.dropdwonTransformService.transform(filteredData, 'UnitValue', 'UnitValue', '-- Select --');
    } else {
      return { label: '-- Select --', value: null};
    }
  // }, 200);
  }

  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.brand, c.value.subbrand, c.value.strain, c.value.packageType, c.value.packageSize, c.value.itemQty];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && (result[prop][0].controls['packageSize'].value !== '' && result[prop][0].controls['packageType'].value !== '')) {
            isError = true;
            _.forEach(result[prop], function (item: any, index) {
              item._status = 'INVALID';
            });
        } else {
            result[prop][0]._status = 'VALID';
           // console.log(result[prop].length);
        }
    }
    if (isError) { return {'duplicate': 'duplicate entries'}; }
}

clearFormArray = (formArray: FormArray) => {
  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }
}

resetForm() {

   this.UBICode = null;
    // this.orderRequestForm = this.fb.group({
    //   retailers: new FormControl(null, Validators.required),
    //   ubicode: new FormControl(null),
    //   deliverydate: new FormControl(null, Validators.required),
    //   orderrefid: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(15)])),
    //   aBudItems: this.aBudItems,
    //   bJointsItems: this.bJointsItems,
    //   cOilItems: this.cOilItems
    // });
    this.orderRequestForm.reset();
    this.items.reset();

    this.clearFormArray(this.getABudItems);
    this.clearFormArray(this.getBJointsItems);
    this.clearFormArray(this.getCOilItems);
   /* if (this.aBudItems.controls.length === 0) {
      this.addItem('aBudItems');
      }
      if (this.bJointsItems.controls.length === 0) {
        this.addItem('bJointsItems');
        }
        if (this.cOilItems.controls.length === 0) {
          this.addItem('cOilItems');
          } */
          this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
          this.defaultDate.setDate( this.defaultDate.getDate() + 1 );
}

  onSubmit(formModel) {
    this.submitted = true;

    if (this.orderRequestForm.valid) {
        const orderDetailsForApi: any = {
          OrderDetails: {
            RetlrId: formModel.retailers,
            DeliveryDate: new Date(formModel.deliverydate).toLocaleDateString().replace(/\u200E/g, ''),
            OrderRefId: formModel.orderrefid,
            DraftOrderId: this.DraftOrderId ? this.DraftOrderId : 0
          },
          OrderSkewDetails: []
        };
        // orderDetailsForApi.OrderDetails.push();

        if (formModel.aBudItems.length === 0 && formModel.bJointsItems.length === 0 && formModel.cOilItems.length === 0) {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.filloneorderdetails });

          return;
        }

        formModel.aBudItems.forEach((element, index) => {
          orderDetailsForApi.OrderSkewDetails.push({
            'SkewKeyName': 'BUD',
            'BrandId': Number(element.brand),
            'SubBrandId': Number(element.subbrand),
            'StrainId': Number(element.strain),
            'PkgTypeId': Number(element.packageType),
            'UnitValue': Number(element.packageSize),
            'Qty':  Number(element.orderQty),
            'ItemQty': Number(element.itemQty),
            'IndexCode': String(index)
          });
        });

        formModel.bJointsItems.forEach((element, index) => {
          orderDetailsForApi.OrderSkewDetails.push({
            'SkewKeyName': 'JOINTS',
            'BrandId': Number(element.brand),
            'SubBrandId': Number(element.subbrand),
            'StrainId': Number(element.strain),
            'PkgTypeId': Number(element.packageType),
            'UnitValue': Number(element.packageSize),
            'Qty':  Number(element.orderQty),
            'ItemQty': Number(element.itemQty),
            'IndexCode': String(index)
          });
        });

        formModel.cOilItems.forEach((element, index) => {
          orderDetailsForApi.OrderSkewDetails.push({
            'SkewKeyName': 'OIL',
            'BrandId': Number(element.brand),
            'SubBrandId': Number(element.subbrand),
            'StrainId': Number(element.strain),
            'PkgTypeId': Number(element.packageType),
            'UnitValue': Number(element.packageSize),
            'Qty':  Number(element.orderQty),
            'ItemQty': Number(element.itemQty),
            'IndexCode': String(index)
          });
        });


        this.confirmationService.confirm({
          message: this.orderRequestResource.ordersaveconfirm,
          header: 'Confirmation',
          icon: 'fa fa-exclamation-triangle',
          accept: () => {
            this.saveOrder(orderDetailsForApi, 'CheckLotExists');
          },
          reject: () => {
              // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
          }
      });
    } else {
      this.draftMsg = 'Order ID Required';
      this.appCommonService.validateAllFields(this.orderRequestForm);
    }
  }

  saveOrder(orderDetailsForApi, Flag) {
    orderDetailsForApi.OrderDetails['OrderSaveFlag'] = Flag;
    // http call starts
    this.loaderService.display(true);
    this.orderService.saveRetailerOrder(orderDetailsForApi)
    .subscribe(
      data => {

        if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.ordersubmitted });
          setTimeout(() => {
            this.loaderService.display(false);
            this.router.navigate(['../home/orderlisting']);
           }, 2000);
         // this.resetForm();
        } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.duplicates2number });
        } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
        } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'PROTYPENOTPRESENT') {
          // this.msgs = [];
          // this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          data.forEach(dataItem => {
            let formGroup;

            if (dataItem.SkewKeyName === 'BUD') {
               formGroup = (<FormGroup>this.orderRequestForm.get('aBudItems.' + dataItem.ErrRowIndex));

            } else if (dataItem.SkewKeyName === 'JOINTS') {
               formGroup = (<FormGroup>this.orderRequestForm.get('bJointsItems.' + dataItem.ErrRowIndex));

            } else if (dataItem.SkewKeyName === 'OIL') {
               formGroup = (<FormGroup>this.orderRequestForm.get('cOilItems.' + dataItem.ErrRowIndex));
            }
            (formGroup as FormGroup).setErrors({ 'prototypenotpresent': true });
            this.loaderService.display(false);
          });
          return;
        } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'NOLOTPRESENT') {
            this.confirmationService.confirm({
              message: data[0].ResultMessage,
              header: this.globalResource.applicationmsg,
              icon: 'fa fa-trash',
              accept: () => {
                this.saveOrder(orderDetailsForApi, 'SaveOrder');
              },
              reject: () => {
                  // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
              }
            });
        } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'INACTIVERETAILER') {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.inactiveretailer });
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
  }

  // save draft order
  saveDraftOrder(DraftModel) {

    // DraftOrderId is greater than 0 then update item list
    if (this.DraftOrderId > 0) {
      if (this.orderRequestForm.controls['orderrefid'].value !== '' && this.orderRequestForm.controls['orderrefid'].value !== null) {
        const draftOrderApi: any = {
        DraftOrderDetails: {
          DraftOrderId: this.DraftOrderId ,
          ClientId: this.appCommonService.getUserProfile().ClientId,
          VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
          RetailerId: DraftModel.retailers ? DraftModel.retailers : 0,
          DeliveryDate: new Date(DraftModel.deliverydate).toLocaleDateString().replace(/\u200E/g, ''),
          DraftOrderNo: DraftModel.orderrefid,
        },
        DraftOrderSkewDetails: []
      };
      DraftModel.aBudItems.forEach((element, index) => {
        draftOrderApi.DraftOrderSkewDetails.push({
          'ProductItemId': element.productItemId ? element.productItemId : 0,
          'SkewKeyName': 'BUD',
          'BrandId': Number(element.brand),
          'SubBrandId': Number(element.subbrand),
          'StrainId': Number(element.strain),
          'PkgTypeId': Number(element.packageType),
          'UnitValue': Number(element.packageSize),
          'Qty':  Number(element.orderQty),
          'ItemQty': Number(element.itemQty),
          'IndexCode': String(index)
        });
      });
      DraftModel.bJointsItems.forEach((element, index) => {
        draftOrderApi.DraftOrderSkewDetails.push({
          'SkewKeyName': 'JOINTS',
          'BrandId': Number(element.brand),
          'SubBrandId': Number(element.subbrand),
          'StrainId': Number(element.strain),
          'PkgTypeId': Number(element.packageType),
          'UnitValue': Number(element.packageSize),
          'Qty':  Number(element.orderQty),
          'ItemQty': Number(element.itemQty),
          'IndexCode': String(index)
        });
      });
      DraftModel.cOilItems.forEach((element, index) => {
        draftOrderApi.DraftOrderSkewDetails.push({
          'SkewKeyName': 'OIL',
          'BrandId': Number(element.brand),
          'SubBrandId': Number(element.subbrand),
          'StrainId': Number(element.strain),
          'PkgTypeId': Number(element.packageType),
          'UnitValue': Number(element.packageSize),
          'Qty':  Number(element.orderQty),
          'ItemQty': Number(element.itemQty),
          'IndexCode': String(index)
        });
      });
      this.loaderService.display(true);
      this.orderService.saveOrderDraft(draftOrderApi)
      .subscribe(
        data => {
          if (String(data[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.servererror });
          } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'ALREADYEXISTSORDERNO') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.orderidexist });
          }  else {
            setTimeout(() => {
            this.confirmationService.confirm({
              message: this.orderRequestResource.draftsave1 + ' ' + DraftModel.orderrefid +
              ' ' + this.orderRequestResource.draftsave2,
              key: 'draftconfirm',
              rejectVisible: false,
              acceptLabel: 'Ok',
              accept: () => {
                if (this.DraftOrderId > 0) {
                  this.appCommonService.navDraftOrder.isBackClicked = true;
                this.router.navigate(['../home/orderlisting']);
                }
              }
          });
        }, 1000);
          }
          this.loaderService.display(false);
         // this.resetForm();
        });
    } else {
      this.draftMsg = 'Order ID Required to Save as Draft';
      this.orderRequestForm.controls['orderrefid'].markAsDirty();
        }
     } else { // new item insert
    if (this.orderRequestForm.controls['orderrefid'].value !== '' && this.orderRequestForm.controls['orderrefid'].value !== null) {
      const draftOrderApi: any = {
      DraftOrderDetails: {
        DraftOrderId: 0 ,
        ClientId: this.appCommonService.getUserProfile().ClientId,
        VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
        RetailerId: DraftModel.retailers ? DraftModel.retailers : 0,
        DeliveryDate: new Date(DraftModel.deliverydate).toLocaleDateString().replace(/\u200E/g, ''),
        DraftOrderNo: DraftModel.orderrefid,
      },
      DraftOrderSkewDetails: []
    };
    DraftModel.aBudItems.forEach((element, index) => {
      draftOrderApi.DraftOrderSkewDetails.push({
        'SkewKeyName': 'BUD',
        'BrandId': Number(element.brand),
        'SubBrandId': Number(element.subbrand),
        'StrainId': Number(element.strain),
        'PkgTypeId': Number(element.packageType),
        'UnitValue': Number(element.packageSize),
        'Qty':  Number(element.orderQty),
        'ItemQty': Number(element.itemQty),
        'IndexCode': String(index)
      });
    });

    DraftModel.bJointsItems.forEach((element, index) => {
      draftOrderApi.DraftOrderSkewDetails.push({
        'SkewKeyName': 'JOINTS',
        'BrandId': Number(element.brand),
        'SubBrandId': Number(element.subbrand),
        'StrainId': Number(element.strain),
        'PkgTypeId': Number(element.packageType),
        'UnitValue': Number(element.packageSize),
        'Qty':  Number(element.orderQty),
        'ItemQty': Number(element.itemQty),
        'IndexCode': String(index)
      });
    });

    DraftModel.cOilItems.forEach((element, index) => {
      draftOrderApi.DraftOrderSkewDetails.push({
        'SkewKeyName': 'OIL',
        'BrandId': Number(element.brand),
        'SubBrandId': Number(element.subbrand),
        'StrainId': Number(element.strain),
        'PkgTypeId': Number(element.packageType),
        'UnitValue': Number(element.packageSize),
        'Qty':  Number(element.orderQty),
        'ItemQty': Number(element.itemQty),
        'IndexCode': String(index)
      });
    });
    this.orderService.saveOrderDraft(draftOrderApi)
    .subscribe(
      data => {
        if (String(data[0].ResultKey).toLocaleUpperCase() === 'FAILURE') {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.servererror });
        } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'ALREADYEXISTSORDERNO') {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.orderRequestResource.orderidexist });
        }  else {
            this.confirmationService.confirm({
                message: this.orderRequestResource.draftsave1 + ' ' + this.orderRequestForm.controls['orderrefid'].value +
                                                                 ' ' + this.orderRequestResource.draftsave2,
                key: 'draftconfirm',
                rejectVisible: false,
                acceptLabel: 'Ok',
                accept: () => {
                  this.appCommonService.navDraftOrder.isBackClicked = true;
                  this.router.navigate(['../home/orderlisting']);
                }
            });
        }
      //  this.resetForm();

      });

    } else {
      this.draftMsg = 'Order ID Required to Save as Draft';
        this.orderRequestForm.controls['orderrefid'].markAsDirty();
      }
     }
}

// bind draft values to formarray
createdraftItem(element): FormGroup {
  if (element.SkewKeyName === 'BUD') {
    return this.fb.group({
      brand: new FormControl(element.BrandId, Validators.required),
      subbrand: new FormControl(element.SubBrandId),
      strain: new FormControl(element.StrainId, Validators.required),
      packageType: new FormControl(element.PkgTypeId, Validators.required),
      packageSize: new FormControl(element.UnitValue, Validators.required),
      itemQty: new FormControl(element.ItemQty, Validators.required),
      orderQty: new FormControl(element.RequiredQty, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger])),
      productItemId: element.ProductItemId

    });
  } else if (element.SkewKeyName === 'JOINTS') {
    return this.fb.group({
      brand: new FormControl(element.BrandId, Validators.required),
      subbrand: new FormControl(element.SubBrandId),
      strain: new FormControl(element.StrainId, Validators.required),
      packageType: new FormControl(element.PkgTypeId, Validators.required),
      packageSize: new FormControl(element.UnitValue, Validators.required),
      itemQty: new FormControl(element.ItemQty, Validators.required),
      orderQty: new FormControl(element.RequiredQty, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger])),
      productItemId: element.ProductItemId
    });
  } else if (element.SkewKeyName === 'OIL') {
    return this.fb.group({
      brand: new FormControl(element.BrandId, Validators.required),
      subbrand: new FormControl(element.SubBrandId),
      strain: new FormControl(element.StrainId, Validators.required),
      packageType: new FormControl(element.PkgTypeId, Validators.required),
      packageSize: new FormControl(element.UnitValue, Validators.required),
      itemQty: new FormControl(element.ItemQty, Validators.required),
      orderQty: new FormControl(element.RequiredQty, Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger])),
      productItemId: element.ProductItemId
    });
  }
}

// discard order
discardDraftOrder() {
  const  orderdeleteapi: any = {
    DraftOrderDeleteActive: {
    DraftOrderId: this.DraftOrderId,
   VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
   IsActive: 0,
   IsDeleted: 1
   }
  };
  this.loaderService.display(true);
    this.orderService.removeOrderDraft(orderdeleteapi).subscribe(
     data => {
       if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
         this.msgs = [];
         this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: 'Draft deleted successfully' });
         setTimeout(() => {
         this.loaderService.display(false);
         this.appCommonService.navDraftOrder.isBackClicked = true;
         this.router.navigate(['../home/orderlisting']);
        }, 2000);
        } else {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: 'Order draft deleted successfully' });
       }
    });
}

// order remove confirmation
removeOrderDraft() {
  this.confirmationService.confirm({
    key: 'draftdelete',
    message: this.orderRequestResource.deleteconfirm,
    header: this.globalResource.applicationmsg,
    icon: 'fa fa-trash',
    accept: () => {
      this.discardDraftOrder();
    },
    reject: () => {
    }
});
}
BackOrderList() {
  if (this.DraftOrderId > 0) {
    this.appCommonService.navDraftOrder.isBackClicked = true;
    this.router.navigate(['../home/orderlisting']);
  } else {
    this.router.navigate(['../home/orderlisting']);
  }
}
}
