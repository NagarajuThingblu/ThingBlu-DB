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
  event: any;
  eventdraft: any;
  paginationValues: any;
  draftpaginationValues: any;

  public allOrders: any;
  public showOrderDetailsModel = false;

  public budOrderDetails: any = [];
  public jointsOrderDetails: any = [];
  public oilOrderDetails: any = [];
  public globalResource: any;
  public orderrequestResource: any;
  public allDraftOrders: any;
  public msgs = [];
  public deleteClick = false;
  public draftTabSelected = false;
  public orderTabSelected = true;


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
    this.orderTabSelected = true;
    this.orderrequestResource = OrderResource.getResources().en.orderrequest;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.orderrequestResource.orderlisttitle);
    this.getAllOrders();
     this.getAllDreaftOrders();
     if (this.appCommonService.navDraftOrder.isBackClicked) {
        this.draftTabSelected = true;
        this.orderTabSelected = false;
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
  getAllOrders() {
    this.loaderService.display(true);
    this.orderService.getAllOrders().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allOrders = data;
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
}
