import { OrderResource } from './../../../order.resource';
import { GlobalResources } from './../../../../global resource/global.resource';
import { UserModel } from './../../../../shared/models/user.model';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AppCommonService } from './../../../../shared/services/app-common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { LoaderService } from './../../../../shared/services/loader.service';
import { OrderService } from './../../../service/order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accept-order',
  templateUrl: './accept-order.component.html',
  styles: [`
  :host::ng-deep .clsTabPanelBackground {
      background:#ebebeb !important;
    }
  .markRowAsRed {
    color: #f72c2c !important;
  }
  .ui-table .ui-table-tbody>tr>td {
    word-break: break-word !important;
    height: 30px !important;
  }

  .ui-table .ui-table-thead>tr>th {
     height: 30px !important;
}
  `]
})
export class AcceptOrderComponent implements OnInit {
  acceptOrderForm: FormGroup;
  public incomingOrderId: any;
  public identifiedrderDetails: any;
  public identifiedOrderItems: any;
  public budOrderItems: any;
  public jointOrderItems: any;
  public oilOrderItems: any;
  public _cookieService: any;
  public msgs: Message[] = [];
  public globalResource: any;
  public acceptOrderResource: any;

  public selectedAll = true;
  public selectedAllBud = true;
  public selectedAllJoint = true;
  public selectedAllOil = true;
  public defaultDate: Date;
  public validProductitemCount: number;
  constructor(private orderService: OrderService,
    private loaderService: LoaderService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private appCommonService: AppCommonService,
    private fb: FormBuilder) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
  }

  ngOnInit() {

    this.loaderService.display(true);
    this.globalResource = GlobalResources.getResources().en;
    this.acceptOrderResource = OrderResource.getResources().en.orderrequest;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    this.titleService.setTitle('Accept Order');
    this.acceptOrderForm = this.fb.group({
      'incomingOrderId': new FormControl(null),
      's2OrderNo': new FormControl(null),
      'retailerId': new FormControl(null),
      'retailerName': new FormControl(null),
      'ubiNo': new FormControl(null),
      'orderdate': new FormControl(null),
      'deliveryDate': new FormControl(this.defaultDate, Validators.compose([Validators.required])),
      'orderTotal': new FormControl(null),
      productBudArr: new FormArray([]),
      productJointArr: new FormArray([]),
      productOilArr: new FormArray([])
    });

    if (this.route.snapshot.params.incomingOrderId) {
      this.getIdentifiedOrderDetails();
    }
  }

  createAcceptOrderForm() {
    this.acceptOrderForm = this.fb.group({
      'incomingOrderId': new FormControl(this.identifiedrderDetails[0].IncomingOrderId),
      's2OrderNo': new FormControl(this.identifiedrderDetails[0].S2OrderNo),
      'retailerId': new FormControl(this.identifiedrderDetails[0].RetailerId),
      'retailerName': new FormControl(this.identifiedrderDetails[0].RetailerName),
      'ubiNo': new FormControl(this.identifiedrderDetails[0].UBINo),
      'orderdate': new FormControl(this.identifiedrderDetails[0].CreatedDate),
      'deliveryDate': new FormControl(this.defaultDate, Validators.compose([Validators.required])),
      'orderTotal': new FormControl(this.identifiedrderDetails[0].OrderedQty),
      productBudArr: new FormArray([]),
      productJointArr: new FormArray([]),
      productOilArr: new FormArray([])
    });
  }
  // * Start Flower
  get productBudArr() {
    return this.acceptOrderForm.get('productBudArr') as FormArray;
  }

  addBudItem(): void {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productBudArr') as FormArray;
    this.budOrderItems.forEach(budOrderItems => {
      arrayItem.push(this.createBudItem(budOrderItems));
    });
  }
  createBudItem(budOrderItems): FormGroup {
    return this.fb.group({
      'orderItemId': new FormControl(budOrderItems.OrderItemId),
      'productType': new FormControl(budOrderItems.ProductTypeId),
      'skewType': new FormControl(budOrderItems.SkewType),
      'skewTypeName': new FormControl(budOrderItems.SkewType),
      'brand': new FormControl(budOrderItems.BrandId),
      'brandName': new FormControl(budOrderItems.BrandName),
      'subBrand': new FormControl(budOrderItems.SubBrandId),
      'subBrandName': new FormControl(budOrderItems.SubBrandName),
      'strain': new FormControl(budOrderItems.StrainId),
      'strainName': new FormControl(budOrderItems.StrainName),
      'pkgType': new FormControl(budOrderItems.PkgTypeId),
      'pkgTypeName': new FormControl(budOrderItems.PkgTypeName),
      'pkgSize': new FormControl(budOrderItems.PkgSize),
      'itemQty': new FormControl(budOrderItems.ItemQty),
      'unitPrice': new FormControl(budOrderItems.UnitPrice),
      'orderedQty': new FormControl(budOrderItems.OrderedQty),
      'chkAcceptProductItem': new FormControl(budOrderItems.IsAccepted),
    });
  }
  // End Floer

  // Start Preroll
  get productJointArr() {
    return this.acceptOrderForm.get('productJointArr') as FormArray;
  }

  addJointItem(): void {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productJointArr') as FormArray;
    this.jointOrderItems.forEach(jointOrderItems => {
      arrayItem.push(this.createJointItem(jointOrderItems));
    });
  }
  createJointItem(jointOrderItems): FormGroup {
    return this.fb.group({
      'orderItemId': new FormControl(jointOrderItems.OrderItemId),
      'productType': new FormControl(jointOrderItems.ProductTypeId),
      'skewType': new FormControl(jointOrderItems.SkewType),
      'skewTypeName': new FormControl(jointOrderItems.SkewType),
      'brand': new FormControl(jointOrderItems.BrandId),
      'brandName': new FormControl(jointOrderItems.BrandName),
      'subBrand': new FormControl(jointOrderItems.SubBrandId),
      'subBrandName': new FormControl(jointOrderItems.SubBrandName),
      'strain': new FormControl(jointOrderItems.StrainId),
      'strainName': new FormControl(jointOrderItems.StrainName),
      'pkgType': new FormControl(jointOrderItems.PkgTypeId),
      'pkgTypeName': new FormControl(jointOrderItems.PkgTypeName),
      'pkgSize': new FormControl(jointOrderItems.PkgSize),
      'itemQty': new FormControl(jointOrderItems.ItemQty),
      'unitPrice': new FormControl(jointOrderItems.UnitPrice),
      'orderedQty': new FormControl(jointOrderItems.OrderedQty),
      'chkAcceptProductItem': new FormControl(jointOrderItems.IsAccepted),
    });
  }
  // End preroll

  // Start orther
  get productOilArr() {
    return this.acceptOrderForm.get('productOilArr') as FormArray;
  }

  addOilItem(): void {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productOilArr') as FormArray;
    this.oilOrderItems.forEach(oilOrderItems => {
      arrayItem.push(this.createOilItem(oilOrderItems));
    });
  }
  createOilItem(oilOrderItems): FormGroup {
    return this.fb.group({
      'orderItemId': new FormControl(oilOrderItems.OrderItemId),
      'productType': new FormControl(oilOrderItems.ProductTypeId),
      'skewType': new FormControl(oilOrderItems.SkewType),
      'skewTypeName': new FormControl(oilOrderItems.SkewType),
      'brand': new FormControl(oilOrderItems.BrandId),
      'brandName': new FormControl(oilOrderItems.BrandName),
      'subBrand': new FormControl(oilOrderItems.SubBrandId),
      'subBrandName': new FormControl(oilOrderItems.SubBrandName),
      'strain': new FormControl(oilOrderItems.StrainId),
      'strainName': new FormControl(oilOrderItems.StrainName),
      'pkgType': new FormControl(oilOrderItems.PkgTypeId),
      'pkgTypeName': new FormControl(oilOrderItems.PkgTypeName),
      'pkgSize': new FormControl(oilOrderItems.PkgSize),
      'itemQty': new FormControl(oilOrderItems.ItemQty),
      'unitPrice': new FormControl(oilOrderItems.UnitPrice),
      'orderedQty': new FormControl(oilOrderItems.OrderedQty),
      'chkAcceptProductItem': new FormControl(oilOrderItems.IsAccepted),
    });
  }

  // End Other

  getIdentifiedOrderDetails() {
    this.loaderService.display(true);
    this.orderService.getIdentifiedOrderDetailssById(this.route.snapshot.params.incomingOrderId).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.identifiedrderDetails = data.Table;
          this.identifiedOrderItems = data.Table1;
          if (this.identifiedOrderItems) {
            this.budOrderItems = this.identifiedOrderItems.filter(r => String(r.SkewKeyName) === String('BUD'));
            this.jointOrderItems = this.identifiedOrderItems.filter(r => r.SkewKeyName === 'JOINTS');
            this.oilOrderItems = this.identifiedOrderItems.filter(r => r.SkewKeyName === 'OIL');
          }
          setTimeout(() => {
            this.validProductitemCount = this.identifiedrderDetails[0].ValidProductitemCount;
            this.createAcceptOrderForm();
            if (this.budOrderItems) {
              this.addBudItem();
            }
            if (this.jointOrderItems) {
              this.addJointItem();
            }
            if (this.oilOrderItems) {
              this.addOilItem();
            }
            this.loaderService.display(false);
          }, 500);
        }
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Order Incoming complete'));
  }

  selectAllBud(event) {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productBudArr') as FormArray;
    if (event) {
      arrayItem.controls.forEach(e => {
        e.controls['chkAcceptProductItem'].patchValue(true);
      });
    } else {
      arrayItem.controls.forEach(e => {
        e.controls['chkAcceptProductItem'].patchValue(false);
      });
    }
  }
  checkIfAllSelectedBud() {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productBudArr') as FormArray;
    this.selectedAllBud = arrayItem.controls.every(function (item: any) {
      return item.controls.chkAcceptProductItem.value === true;
    });
  }

  selectAllJoint(event) {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productJointArr') as FormArray;
    if (event) {
      arrayItem.controls.forEach(e => {
        e.controls['chkAcceptProductItem'].patchValue(true);
      });
    } else {
      arrayItem.controls.forEach(e => {
        e.controls['chkAcceptProductItem'].patchValue(false);
      });
    }
  }
  checkIfAllSelectedJoint() {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productJointArr') as FormArray;
    this.selectedAllJoint = arrayItem.controls.every(function (item: any) {
      return item.controls.chkAcceptProductItem.value === true;
    });
  }

  selectAllOil(event) {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productOilArr') as FormArray;
    if (event) {
      arrayItem.controls.forEach(e => {
        e.controls['chkAcceptProductItem'].patchValue(true);
      });
    } else {
      arrayItem.controls.forEach(e => {
        e.controls['chkAcceptProductItem'].patchValue(false);
      });
    }
  }
  checkIfAllSelectedOil() {
    let arrayItem;
    arrayItem = this.acceptOrderForm.get('productOilArr') as FormArray;
    this.selectedAllOil = arrayItem.controls.every(function (item: any) {
      return item.controls.chkAcceptProductItem.value === true;
    });
  }

  backIncomingOrderList() {
    this.appCommonService.navIncomingOrder.isBackClicked = true;
    this.router.navigate(['../home/orderlisting']);
  }

  onSubmit(formModel, isIgnored) {
    if (this.acceptOrderForm.valid) {
      const orderDetailsForApi: any = {
        OrderDetails: {
          IncomingOrderId: formModel.incomingOrderId,
          ClientId: this.appCommonService.getUserProfile().ClientId,
          S2OrderNo: formModel.s2OrderNo,
          RetailerId: formModel.retailerId,
          DeliveryDate: new Date(formModel.deliveryDate).toLocaleDateString().replace(/\u200E/g, ''),
          IsIgnored: isIgnored,
          VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
        },
        OrderSkewDetails: []
      };
      // orderDetailsForApi.OrderDetails.push();

      if (formModel.productBudArr.length === 0 && formModel.productJointArr.length === 0 && formModel.productOilArr.length === 0) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'No product Selected' });

        return;
      }

      formModel.productBudArr.forEach((element, index) => {
        orderDetailsForApi.OrderSkewDetails.push({
          'IncomingOrderItemId': element.orderItemId,
          'SkewKeyName': 'BUD',
          'BrandId': Number(element.brand),
          'SubBrandId': Number(element.subBrand ? element.subBrand : 0),
          'StrainId': Number(element.strain),
          'PkgTypeId': Number(element.pkgType),
          'PkgSize': Number(element.pkgSize),
          'Qty': Number(element.orderedQty),
          'ItemQty': Number(element.itemQty),
          'UnitPrice': Number(element.unitPrice),
          'IsAccepted': Number(element.chkAcceptProductItem),
          'IndexCode': String(index)
        });
      });

      formModel.productJointArr.forEach((element, index) => {
        orderDetailsForApi.OrderSkewDetails.push({
          'IncomingOrderItemId': element.orderItemId,
          'SkewKeyName': 'JOINTS',
          'BrandId': Number(element.brand),
          'SubBrandId': Number(element.subBrand ? element.subBrand : 0),
          'StrainId': Number(element.strain),
          'PkgTypeId': Number(element.pkgType),
          'PkgSize': Number(element.pkgSize),
          'Qty': Number(element.orderedQty),
          'ItemQty': Number(element.itemQty),
          'UnitPrice': Number(element.unitPrice),
          'IsAccepted': Number(element.chkAcceptProductItem),
          'IndexCode': String(index)
        });
      });

      formModel.productOilArr.forEach((element, index) => {
        orderDetailsForApi.OrderSkewDetails.push({
          'IncomingOrderItemId': element.orderItemId,
          'SkewKeyName': 'OIL',
          'BrandId': Number(element.brand),
          'SubBrandId': Number(element.subBrand ? element.subBrand : 0),
          'StrainId': Number(element.strain),
          'PkgTypeId': Number(element.pkgType),
          'PkgSize': Number(element.pkgSize),
          'Qty': Number(element.orderedQty),
          'ItemQty': Number(element.itemQty),
          'UnitPrice': Number(element.unitPrice),
          'IsAccepted': element.chkAcceptProductItem,
          'IndexCode': String(index)
        });
      });
      this.msgs = [];
      if (!isIgnored) {
        if (orderDetailsForApi.OrderSkewDetails) {
          if (orderDetailsForApi.OrderSkewDetails.length <= 0) {
            this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Invalid order. Order should have atleast one product.' });
            this.loaderService.display(false);
            return;
          } else if (orderDetailsForApi.OrderSkewDetails.filter(r => r.IsAccepted === 1 ||  r.IsAccepted === true).length <= 0) {
            this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Accept atleast one product.' });
            this.loaderService.display(false);
            return;
          }
        } else {
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Invalid order. Order should have atleast one product.' });
          this.loaderService.display(false);
          return;
        }
      }

      let cnfMsg = '';
      if (isIgnored) {
        cnfMsg = 'Are you sure you want to ignore this change to Order: ' + formModel.s2OrderNo + '?';
      } else {
        cnfMsg = this.acceptOrderResource.ordersaveconfirm;
      }
      this.confirmationService.confirm({
        message: cnfMsg,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
          this.saveAcceptOrderOrder(orderDetailsForApi, 'SaveOrder');
        },
        reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
        }
      });
    } else {
      this.appCommonService.validateAllFields(this.acceptOrderForm);
    }
  }

  saveAcceptOrderOrder(orderDetailsForApi, Flag) {
    orderDetailsForApi.OrderDetails['OrderSaveFlag'] = Flag;
    // http call starts
    this.loaderService.display(true);
    this.orderService.saveAcceptOrder(orderDetailsForApi)
      .subscribe(
        data => {
          let succsMsg = '';
          if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
            if (orderDetailsForApi.OrderDetails.IsIgnored) {
              succsMsg = 'Order ignored successfully.';
            } else {
              succsMsg = 'Order created successfully.';
            }
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: succsMsg });
            setTimeout(() => {
              this.loaderService.display(false);
              this.appCommonService.navIncomingOrder.isBackClicked = true;
              this.router.navigate(['../home/orderlisting']);
            }, 2000);
          } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Duplicate S2Order' });
          } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'NOLOTPRESENT') {
            this.confirmationService.confirm({
              message: data[0].ResultMessage,
              header: this.globalResource.applicationmsg,
              icon: 'fa fa-trash',
              accept: () => {
                this.saveAcceptOrderOrder(orderDetailsForApi, 'SaveOrder');
              },
              reject: () => {
                this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
              }
            });
          } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'INACTIVERETAILER') {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Selected Retailer is inactive.' });
          } else {
            this.loaderService.display(false);
          }
        },
        error => {
          console.log(error);
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
          // http call ends
          this.loaderService.display(false);
        });
  }

  saveIgnoreOrder(orderDetailsForApi, Flag) {
    orderDetailsForApi.OrderDetails['OrderSaveFlag'] = Flag;
    // http call starts
    this.loaderService.display(true);
    this.orderService.saveAcceptOrder(orderDetailsForApi)
      .subscribe(
        data => {

          if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: 'Order created successfully.' });
            setTimeout(() => {
              this.loaderService.display(false);
              this.appCommonService.navIncomingOrder.isBackClicked = true;
              this.router.navigate(['../home/orderlisting']);
            }, 2000);
          } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          }
          this.loaderService.display(false);
        },
        error => {
          console.log(error);
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
          this.loaderService.display(false);
        });
  }
}
