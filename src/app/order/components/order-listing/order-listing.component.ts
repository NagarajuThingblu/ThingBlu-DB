import { LoaderService } from './../../../shared/services/loader.service';
import { TaskResources } from './../../../task/task.resources';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { OrderResource } from '../../order.resource';
import { Title } from '@angular/platform-browser';
import { AppConstants } from '../../../shared/models/app.constants';


@Component({
  moduleId: module.id,
  selector: 'app-order-listing',
  templateUrl: 'order-listing.component.html',
  styleUrls: ['order-listing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListingComponent implements OnInit {

  orderRefId: any;
  retailerName: any;
  ordReqDate: any;
  delvryDate: any;
  event: any;
  paginationValues: any;
  public allOrders: any;
  public showOrderDetailsModel = false;

  public budOrderDetails: any = [];
  public jointsOrderDetails: any = [];
  public oilOrderDetails: any = [];
  public globalResource: any;
  public orderrequestResource: any;

  constructor(
    private orderService: OrderService,
    private loaderService: LoaderService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.orderrequestResource = OrderResource.getResources().en.orderrequest;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.orderrequestResource.orderlisttitle);
    this.getAllOrders();
  }
  onPageChange(e) {
    this.event = e;
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

  getOrderInfo(OrderId, Order) {
    this.loaderService.display(true);
    console.log(Order);
    this.retailerName = Order['RetailerName'];
    this.orderRefId = Order['OrderRefId'];
    this.ordReqDate = Order['OrderDate'];
    this.delvryDate = Order['DeliveryDate'];

    console.log(this.retailerName);
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
}
