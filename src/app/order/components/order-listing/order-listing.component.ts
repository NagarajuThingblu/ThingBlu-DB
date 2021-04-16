import { LoaderService } from './../../../shared/services/loader.service';
import { TaskResources } from './../../../task/task.resources';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { OrderResource } from '../../order.resource';
import { Title } from '@angular/platform-browser';
import { AppConstants } from '../../../shared/models/app.constants';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppCommonService } from '../../../shared/services/app-common.service';

@Component({
  moduleId: module.id,
  selector: 'app-order-listing',
  templateUrl: 'order-listing.component.html',
  styleUrls: ['order-listing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListingComponent implements OnInit, OnDestroy {

  orderRefId: any;
  retailerName: any;
  ordReqDate: any;
  delvryDate: any;
  strain: any;
  skewtype: any;
  event: any;
  eventdraft: any;
  paginationValues: any;
  draftpaginationValues: any;
  eventIncomingOrder: any;
  incomingpaginationValues: any;
  ChangeOrderpaginationValues: any;
  eventChangeOrder: any;
  public taskCategory: any;
  public _cookieService: any;
  public allOrders: any;
  public totalData: any;
  public totalData1: any;
  public showOrderDetailsModel = false;

  public budOrderDetails: any = [];
  public jointsOrderDetails: any = [];
  public oilOrderDetails: any = [];
  public globalResource: any;
  public orderrequestResource: any;
  public allDraftOrders: any;
  public allIncomingOrders: any;
  public allChangeOrders: any;
  public msgs = [];
  public deleteClick = false;
  public draftTabSelected = false;
  public orderTabSelected = true;
  public changeTabSelected = false;
  public incomingTabSelected = false;


  constructor(
    private orderService: OrderService,
    private loaderService: LoaderService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private router: Router,
    private appCommonService: AppCommonService
  ) { }

  ngOnInit() {
    this.draftTabSelected = false;
    this.changeTabSelected = false;
    this.incomingTabSelected = false;
    this.orderTabSelected = true;
    this.orderrequestResource = OrderResource.getResources().en.orderrequest;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.orderrequestResource.orderlisttitle);
    this._cookieService = this.appCommonService.getUserProfile();
    this.taskCategory = this._cookieService.TaskCategory,
    this.getAllOrders();
     this.getAllDreaftOrders();
     this.getAllIncomingOrders();
     this.getAllChangeOrders();
     if (this.appCommonService.navDraftOrder.isBackClicked) {
      this.draftTabSelected = true;
      this.orderTabSelected = false;
      this.incomingTabSelected = false;
      this.changeTabSelected = false;
   }

   if (this.appCommonService.navIncomingOrder.isBackClicked) {
      this.draftTabSelected = false;
      this.orderTabSelected = false;
      this.incomingTabSelected = true;
      this.changeTabSelected = false;
 }
 if (this.appCommonService.navChangeOrder.isBackClicked) {
  this.draftTabSelected = false;
  this.orderTabSelected = false;
  this.incomingTabSelected = false;
  this.changeTabSelected = true;
}
  }
  ngOnDestroy() {
    this.appCommonService.navDraftOrder.isBackClicked = false;
  }
  onPageChange(e) {
    this.event = e;
  }
  onDraftPageChange(e) {
    this.eventdraft = e;
  }

  _clearNavCookie() {
    this.draftTabSelected = false;
    this.orderTabSelected = true;
    this.incomingTabSelected = false;
    this.appCommonService.navIncomingOrder.isBackClicked = false;
    this.appCommonService.navDraftOrder.isBackClicked = false;
    this.appCommonService.navChangeOrder.isBackClicked = false;
  }

  getAllOrders() {
    this.loaderService.display(true);
    this.orderService.getAllOrders().subscribe(
      data => {
       if (data !== 'No data found!') {
         this.totalData = data.Table1;
          this.allOrders = data.Table;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allOrders.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allOrders.length;
          }
       } else {
        this.allOrders = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Orders complete'));
  }

  // get all draft orders
  getAllDreaftOrders() {
    this.loaderService.display(true);
    this.orderService.getDraftOrdersByClient().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allDraftOrders = data.Table;
          this.draftpaginationValues = AppConstants.getPaginationOptions;
          if (this.allDraftOrders.length > 20) {
            this.draftpaginationValues[AppConstants.getPaginationOptions.length] = this.allDraftOrders.length;
          }
       } else {
        this.allDraftOrders = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Order draft complete'));

  }
  getOrderInfo(OrderId, Order) {
    this.loaderService.display(true);
    this.retailerName = Order['RetailerName'];
    this.orderRefId = Order['OrderRefId'];
    this.ordReqDate = Order['OrderDate'];
    this.delvryDate = Order['DeliveryDate'];
    if(this.taskCategory === 'GROWING'){
     this.totalData1= this.totalData.filter(d => d.OrderId === OrderId );
      console.log(this.totalData1)
    }
   
    this.orderService.getOrderInfo(OrderId).subscribe(
      (data) => {
       if (data !== 'No data found!') {
          this.budOrderDetails = data.filter(result => String(result.SkewKeyName).toLocaleUpperCase() === 'BUD');
          this.jointsOrderDetails = data.filter(result => String(result.SkewKeyName).toLocaleUpperCase() === 'JOINTS');
          this.oilOrderDetails = data.filter(result => String(result.SkewKeyName).toLocaleUpperCase() === 'OIL');
       } else {
        this.budOrderDetails = [];
        this.jointsOrderDetails = [];
        this.oilOrderDetails = [];
       }
      } ,
      error => { console.log(error);
        this.budOrderDetails = [];
        this.jointsOrderDetails = [];
        this.oilOrderDetails = [];
        this.loaderService.display(false);
      },
      () => { console.log('Get Order Info complete'); this.loaderService.display(false); }
    );

    this.showOrderDetailsModel = true;
  }

  orderDiscard() {
    this.confirmationService.confirm({
      message: 'strMessage',
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        // this.activateDeleteStrainType(StrainTypeId, StrainType, IsDeleted , ActivateInactivateKey);
      },
      reject: () => {
      }
  });

  }

  // on row select order draft
  onDraftOrderSelect(event) {
    if (event.data.DraftOrderId > 0) {
    this.router.navigate(['../home/orderrequestform/' + event.data.DraftOrderId ]);
     }

  }

  // remove order draft
  removeOrderDraft(draftOrderId) {
  //   this.deleteClick = false;
   const  orderdeleteapi: any = {
     DraftOrderDeleteActive: {
     DraftOrderId: draftOrderId,
    VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
    IsActive: 0,
    IsDeleted: 1
    }
   };
     this.orderService.removeOrderDraft(orderdeleteapi).subscribe(
      data => {
        if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: 'Draft deleted successfully' });
          this.getAllDreaftOrders();
        }
     });
  }

  // delete order draft confirmation
  deleteDraft(cEvent, draftOrderId) {
    if (cEvent.stopPropagation) {
      cEvent.stopPropagation();
    } else if (window.event) {
      // this code is for IE
      window.event.cancelBubble = true;
    }
    this.confirmationService.confirm({
      key: 'draftdelete',
      message: this.orderrequestResource.deleteconfirm,
      header: this.globalResource.applicationmsg,
      icon: 'fa fa-trash',
      accept: () => {
        this.removeOrderDraft(draftOrderId);
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }

  // get all draft orders
  getAllIncomingOrders() {
    this.loaderService.display(true);
    this.orderService.getIncomingOrdersByClient().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allIncomingOrders = data.Table;
          this.incomingpaginationValues = AppConstants.getPaginationOptions;
          if (this.allIncomingOrders.length > 20) {
            this.incomingpaginationValues[AppConstants.getPaginationOptions.length] = this.allIncomingOrders.length;
          }
          setTimeout(() => {
            this.loaderService.display(false);
          }, 0);
       } else {
        this.allIncomingOrders = [];
        this.loaderService.display(false);
       }
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Order Incoming complete'));

  }

  onIncomingOrderPageChange(e) {
    this.eventIncomingOrder = e;
  }

  onIncomingOrderSelect(event) {
    if (event.data.IncomingOrderId > 0) {
      this._clearNavCookie();
        if (event.data.IsIdentified === true) {
          this.router.navigate(['../home/acceptorder/' +   event.data.IncomingOrderId]);
        } else {
          this.router.navigate(['../home/identifyorder/' + event.data.IncomingOrderId]);
       }
      }
  }

  // get all draft orders
  getAllChangeOrders() {
    this.loaderService.display(true);
    this.orderService.getChangeOrdersByClient().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allChangeOrders = data.Table;
          this.incomingpaginationValues = AppConstants.getPaginationOptions;
          if (this.allChangeOrders.length > 20) {
            this.incomingpaginationValues[AppConstants.getPaginationOptions.length] = this.allChangeOrders.length;
          }
       } else {
        this.allChangeOrders = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Order Incoming complete'));

  }

  onChangeOrderPageChange(e) {
    this.eventChangeOrder = e;
  }

  onChangeOrderSelect(event) {
    if (event.data.IncomingOrderId > 0) {
      this._clearNavCookie();
        if (event.data.IsIdentified === true && event.data.IsChangeOrder === true) {
          this.router.navigate(['../home/changeOrder/' + event.data.IncomingOrderId]);
        } else {
          this.router.navigate(['../home/identifyorder/' + event.data.IncomingOrderId]);
       }
      }
  }

  deleteIncomingOrder(cEvent, incomingOrderId) {
    if (cEvent.stopPropagation) {
      cEvent.stopPropagation();
    } else if (window.event) {
      // this code is for IE
      window.event.cancelBubble = true;
    }
    this.confirmationService.confirm({
      key: 'draftdelete',
      message: this.orderrequestResource.deleteIncomingConfirm,
      header: this.globalResource.applicationmsg,
      icon: 'fa fa-trash',
      accept: () => {
        this.removeIncomingOrder(incomingOrderId);
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }
  GetOrderOnEdit(order){
   
      this.router.navigate(['../home/orderform' , order]);
    
  }

  removeIncomingOrder(incomingOrderId) {
    //   this.deleteClick = false;
     const  orderdeleteapi: any = {
        IncomingOrderDeleteActive: {
        IncomingOrderId: incomingOrderId,
        VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
        IsActive: 0,
        IsDeleted: 1
      }
     };
       this.orderService.removeIncomingOrder(orderdeleteapi).subscribe(
        data => {
          if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: 'Order deleted successfully' });
            this.getAllIncomingOrders();
            this.getAllChangeOrders();
          }
       });
    }
    tabViewhandleChange(e) {
      const index = e.index;
      if (index === 0) {
        this.getAllOrders();
      } else  if (index === 1) {
        this.getAllDreaftOrders();
      } else  if (index === 2) {
        this.getAllIncomingOrders();
      } else  if (index === 3) {
        this.getAllChangeOrders();
      }
    }
}

