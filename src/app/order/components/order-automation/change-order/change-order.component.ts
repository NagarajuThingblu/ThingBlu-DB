import { DropdwonTransformService } from './../../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from './../../../../shared/services/dropdown-values.service';
import { SelectItem } from 'primeng/primeng';
import { OrderResource } from './../../../order.resource';
import { GlobalResources } from './../../../../global resource/global.resource';
import { UserModel } from './../../../../shared/models/user.model';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, FormControlName } from '@angular/forms';
import { AppCommonService } from './../../../../shared/services/app-common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { LoaderService } from './../../../../shared/services/loader.service';
import { OrderService } from './../../../service/order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-order',
  templateUrl: './change-order.component.html'
})
export class ChangeOrderComponent implements OnInit {
  changeOrderForm: FormGroup;
  public _cookieService: any;
  public msgs: Message[] = [];
  public globalResource: any;
  public acceptOrderResource: any;
  defaultDate: any;
  public showProductInfoModel = false;
  public productTypeData: any;

  public additionOrderItems: any;
  public substractionOrderItems: any;
  public noActionOrderItems: any;

  public changerderDetails: any;
  public changeOrderItemsAddition: any;
  public changeOrderItemsSubstraction: any;
  public changeOrderItemsNoAction: any;
  public actionNameValue: SelectItem[];
  public employees: SelectItem[];
  public changeOrderDetails = {
    orderDetails: []
  };

  otherData = {
    orderId: 0, // this.route.snapshot.params.incomingOrderId,
    employees: []
  };

  constructor(private orderService: OrderService,
    private loaderService: LoaderService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private appCommonService: AppCommonService,
    private fb: FormBuilder,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
  }

  ngOnInit() {
    this.loaderService.display(false);
    this.globalResource = GlobalResources.getResources().en;
    this.acceptOrderResource = OrderResource.getResources().en.orderrequest;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    this.titleService.setTitle('Change Order');
    if ( this.appCommonService.getSessionStorage('selectedLotsArray')) {
        this.appCommonService.removeSessionItem('selectedLotsArray');
    }

    if (this.appCommonService.getSessionStorage('selectedReleaseLotsArray')) {
      this.appCommonService.removeSessionItem('selectedReleaseLotsArray');
    }
    this.changeOrderForm = this.fb.group({
      'incomingOrderId': new FormControl(null),
      'orderId': new FormControl(null),
      's2OrderNo': new FormControl(null),
      'retailerId': new FormControl(null),
      'retailerName': new FormControl(null),
      'ubiNo': new FormControl(null),
      'updatedDate': new FormControl(null),
      'deliveryDate': new FormControl(null),
      'modifiedDate': new FormControl(null),
      productAdditionArr: new FormArray([]),
      productSubstractionArr: new FormArray([]),
      productNoActionArr: new FormArray([])
    });

    if (this.route.snapshot.params.incomingOrderId) {
      this.getChangeOrderDetails();
      this.employeeListByClient();
    }

    this.actionNameValue = [
      {label: 'None', value: 'None'},
      { label: 'Create Task(s)', value: 'CreateTask'},
      { label: 'Add to Current Task(s)', value: 'AddToCurrentTask'},
      { label: 'Release Material', value: 'ReleaseMaterial'},
  ];
  }

  createChangeOrderForm() {
    this.changeOrderForm = this.fb.group({
      'incomingOrderId': new FormControl(this.changerderDetails[0].IncomingOrderId),
      'orderId': new FormControl(this.changerderDetails[0].OrderId),
      's2OrderNo': new FormControl(this.changerderDetails[0].S2OrderNo),
      'retailerId': new FormControl(this.changerderDetails[0].RetailerId),
      'retailerName': new FormControl(this.changerderDetails[0].RetailerName),
      'ubiNo': new FormControl(this.changerderDetails[0].UBINo),
      'updatedDate': new FormControl(this.changerderDetails[0].UpdatedDate),
      'deliveryDate': new FormControl(this.defaultDate, Validators.compose([Validators.required])),
      'modifiedDate': new FormControl(this.changerderDetails[0].ModifiedDate),
      productAdditionArr: new FormArray([]),
      productSubstractionArr: new FormArray([]),
      productNoActionArr: new FormArray([])
    });
  }

  get productAdditionArr() {
    return this.changeOrderForm.get('productAdditionArr') as FormArray;
  }

  addProductAdditionItem(): void {
    let arrayItem;
    arrayItem = this.changeOrderForm.get('productAdditionArr') as FormArray;
    this.changeOrderItemsAddition.forEach(additionOrderItems => {
      arrayItem.push(this.createProductaddtionItem(additionOrderItems));
    });
  }
  createProductaddtionItem(additionOrderItems): FormGroup {
    return this.fb.group({
      'orderItemId': new FormControl(additionOrderItems.OrderItemId),
      'productType': new FormControl(additionOrderItems.ProductTypeId),
      'skewkeyName': new FormControl(additionOrderItems.SkewKeyName),
      'skewTypeName': new FormControl(additionOrderItems.SkewType),
      'taskName': new FormControl(additionOrderItems.TaskName),
      'brand': new FormControl(additionOrderItems.BrandId),
      'brandName': new FormControl(additionOrderItems.BrandName),
      'subBrand': new FormControl(additionOrderItems.SubBrandId),
      'subBrandName': new FormControl(additionOrderItems.SubBrandName),
      'strain': new FormControl(additionOrderItems.StrainId),
      'strainName': new FormControl(additionOrderItems.StrainName),
      'geneticsId': new FormControl(additionOrderItems.GeneticsId),
      'geneticsName': new FormControl(additionOrderItems.GeneticsName),
      'pkgType': new FormControl(additionOrderItems.PkgTypeId),
      'pkgTypeName': new FormControl(additionOrderItems.PkgTypeName),
      'pkgSize': new FormControl(additionOrderItems.PkgSize),
      'itemQty': new FormControl(additionOrderItems.ItemQty),
      'unitPrice': new FormControl(additionOrderItems.UnitPrice),
      'changeOrderQty': new FormControl(additionOrderItems.OrderedChangeQty),
      'totalAssignedQty': new FormControl(additionOrderItems.TotalAssignedQty),
      'orderedQty': new FormControl(additionOrderItems.OrderedQty),
      'orderPreviousQty': new FormControl(additionOrderItems.OrderPreviousQty),
      'unassignedQty': new FormControl(additionOrderItems.UnassignedQty),
      'taskCount': new FormControl(additionOrderItems.TaskCount),
      'taskAction': new FormControl(null),
      tasksArr: new FormArray([])
    });
  }

  get productSubstractionArr() {
    return this.changeOrderForm.get('productSubstractionArr') as FormArray;
  }

  addProductSubstractionItem(): void {
    let arrayItem;
    arrayItem = this.changeOrderForm.get('productSubstractionArr') as FormArray;
    this.changeOrderItemsSubstraction.forEach(substractionOrderItems => {
      arrayItem.push(this.createProductSubstractionItem(substractionOrderItems));
    });
  }

  createProductSubstractionItem(substractionOrderItems): FormGroup {
    return this.fb.group({
      'orderItemId': new FormControl(substractionOrderItems.OrderItemId),
      'productType': new FormControl(substractionOrderItems.ProductTypeId),
      'skewkeyName': new FormControl(substractionOrderItems.SkewKeyName),
      'skewTypeName': new FormControl(substractionOrderItems.SkewType),
      'taskName': new FormControl(substractionOrderItems.TaskName),
      'brand': new FormControl(substractionOrderItems.BrandId),
      'brandName': new FormControl(substractionOrderItems.BrandName),
      'subBrand': new FormControl(substractionOrderItems.SubBrandId),
      'subBrandName': new FormControl(substractionOrderItems.SubBrandName),
      'strain': new FormControl(substractionOrderItems.StrainId),
      'strainName': new FormControl(substractionOrderItems.StrainName),
      'geneticsId': new FormControl(substractionOrderItems.GeneticsId),
      'geneticsName': new FormControl(substractionOrderItems.GeneticsName),
      'pkgType': new FormControl(substractionOrderItems.PkgTypeId),
      'pkgTypeName': new FormControl(substractionOrderItems.PkgTypeName),
      'pkgSize': new FormControl(substractionOrderItems.PkgSize),
      'itemQty': new FormControl(substractionOrderItems.ItemQty),
      'unitPrice': new FormControl(substractionOrderItems.UnitPrice),
      'changeOrderQty': new FormControl(substractionOrderItems.OrderedChangeQty),
      'totalAssignedQty': new FormControl(substractionOrderItems.TotalAssignedQty),
      'orderedQty': new FormControl(substractionOrderItems.OrderedQty),
      'orderPreviousQty': new FormControl(substractionOrderItems.OrderPreviousQty),
      'unassignedQty': new FormControl(substractionOrderItems.UnassignedQty),
      'taskCount': new FormControl(substractionOrderItems.TaskCount),
      'taskAction': new FormControl(null),
      tasksArr: new FormArray([])
    });
  }

  get productNoActionArr() {
    return this.changeOrderForm.get('productNoActionArr') as FormArray;
  }

  addProductNoActionItem(): void {
    let arrayItem;
    arrayItem = this.changeOrderForm.get('productNoActionArr') as FormArray;
    this.changeOrderItemsNoAction.forEach(noActionOrderItems => {
      arrayItem.push(this.createProductNoActionItem(noActionOrderItems));
    });
  }
  createProductNoActionItem(noActionOrderItems): FormGroup {
    return this.fb.group({
      'orderItemId': new FormControl(noActionOrderItems.OrderItemId),
      'productType': new FormControl(noActionOrderItems.ProductTypeId),
      'skewkeyName': new FormControl(noActionOrderItems.SkewKeyName),
      'skewTypeName': new FormControl(noActionOrderItems.SkewType),
      'taskName': new FormControl(noActionOrderItems.TaskName),
      'brand': new FormControl(noActionOrderItems.BrandId),
      'brandName': new FormControl(noActionOrderItems.BrandName),
      'subBrand': new FormControl(noActionOrderItems.SubBrandId),
      'subBrandName': new FormControl(noActionOrderItems.SubBrandName),
      'strain': new FormControl(noActionOrderItems.StrainId),
      'strainName': new FormControl(noActionOrderItems.StrainName),
      'geneticsId': new FormControl(noActionOrderItems.GeneticsId),
      'geneticsName': new FormControl(noActionOrderItems.GeneticsName),
      'pkgType': new FormControl(noActionOrderItems.PkgTypeId),
      'pkgTypeName': new FormControl(noActionOrderItems.PkgTypeName),
      'pkgSize': new FormControl(noActionOrderItems.PkgSize),
      'itemQty': new FormControl(noActionOrderItems.ItemQty),
      'unitPrice': new FormControl(noActionOrderItems.UnitPrice),
      'changeOrderQty': new FormControl(noActionOrderItems.OrderedChangeQty),
      'totalAssignedQty': new FormControl(noActionOrderItems.TotalAssignedQty),
      'orderedQty': new FormControl(noActionOrderItems.OrderedQty),
      'orderPreviousQty': new FormControl(noActionOrderItems.OrderPreviousQty),
      'unassignedQty': new FormControl(noActionOrderItems.UnassignedQty),
      'taskCount': new FormControl(noActionOrderItems.TaskCount),
      'taskAction': new FormControl('NoAction'),
      tasksArr: new FormArray([])
    });
  }


  getChangeOrderDetails() {
    this.loaderService.display(true);
    this.orderService.getChangeOrderDetailssById(this.route.snapshot.params.incomingOrderId).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.changerderDetails = data.Table;
          this.changeOrderItemsAddition = data.Table1.filter(r => r.OrderedChangeQty > 0 &&   r.OrderedQty - r.TotalAssignedQty > 0 );
          // tslint:disable-next-line:max-line-length
          this.changeOrderItemsSubstraction = data.Table1.filter(r => (r.OrderedChangeQty < 0 || r.OrderedChangeQty > 0)  && r.TaskCount > 0 && r.OrderedQty - r.TotalAssignedQty < 0);
          // tslint:disable-next-line:max-line-length
          this.changeOrderItemsNoAction = data.Table1.filter(r => (r.OrderedChangeQty <= 0 && r.TaskCount <= 0) || (r.OrderedChangeQty <= 0 && r.OrderedQty - r.TotalAssignedQty >= 0) || (r.OrderedChangeQty > 0 && r.OrderedQty - r.TotalAssignedQty === 0));
          setTimeout(() => {
            this.otherData.orderId = this.changerderDetails[0].OrderId;
            this.createChangeOrderForm();
            this.addProductAdditionItem();
            this.addProductSubstractionItem();
            this.addProductNoActionItem();
            if (this.changerderDetails.length > 0) {
              this.getSelectedOrderDetails(this.changerderDetails[0].OrderId);
            }
            this.loaderService.display(false);
          }, 500);
        }
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Order Incoming complete'));
  }

  getSelectedOrderDetails(OrderId) {
    this.orderService.getSelectedOrderDetails(OrderId, 'BUD', false, 0).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.changeOrderDetails.orderDetails = data;
      }
    },
      error => { console.log(error); },
      () => console.log('sucess'));
  }

  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
        this.otherData.employees = this.employees;
      },
      error => { console.log(error); },
      () => console.log('Get all Employees by client complete'));
    }

  backIncomingOrderList() {
    this.appCommonService.navChangeOrder.isBackClicked = true;
    this.router.navigate(['../home/orderlisting']);
  }

  onChange_Action(orderId, event, index) {

  }

  viewProductDetails(rowData) {
    const taskControls = (rowData as FormGroup).controls;
    this.productTypeData = taskControls;
    this.showProductInfoModel = true;
  }

  onSubmit () {

    if (this.changeOrderForm.valid) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        console.log(this.changeOrderForm, 'test');
      },
      reject: () => {
        // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
  } else {
    this.appCommonService.validateAllFields(this.changeOrderForm);
  }
  }

  onIgnoreOrderChange () {
    this.confirmationService.confirm({
      message: 'Are you sure you want to ignore this change to Order: ' + this.changerderDetails[0].S2OrderNo + '?',
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {

      },
      reject: () => {

      }
    });
  }
}

