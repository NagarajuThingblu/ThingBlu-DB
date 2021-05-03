// tslint:disable-next-line:max-line-length
import { PkgAllocateSubstractionEmployeeComponent } from './components/order-automation/change-order/pkg-allocate-substraction-employee/pkg-allocate-substraction-employee.component';
import { PkgAllocateEmployeeComponent } from './components/order-automation/change-order/pkg-allocate-employee/pkg-allocate-employee.component';
import { MastersModule } from './../Masters/Masters.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OrderRequestFormComponent } from '../order/components/order-request-form/order-request-form.component';
import { OrderService } from './service/order.service';
import { OrderReturnComponent } from './components/order-return/order-return.component';
import { OrderListingComponent } from './components/order-listing/order-listing.component';
import { PackageSizePipe } from './pipe/package-size.pipe';
import { DynamicValueFilterPipe } from './pipe/dynamic-value-filter.pipe';
import { IdentifyOrderComponent } from './components/order-automation/identify-order/identify-order.component';
import { AcceptOrderComponent } from './components/order-automation/accept-order/accept-order.component';
import { ChangeOrderComponent } from './components/order-automation/change-order/change-order.component';
import { OrderformComponent } from './components/orderform/orderform.component';
import { OrdersRoutingModule } from './order.routing';

@NgModule({
  declarations: [
    OrderRequestFormComponent,
    OrderReturnComponent,
    OrderListingComponent,
    PackageSizePipe,
    DynamicValueFilterPipe,
    IdentifyOrderComponent,
    AcceptOrderComponent,
    ChangeOrderComponent,
    PkgAllocateEmployeeComponent,
    PkgAllocateSubstractionEmployeeComponent,
    OrderformComponent,
    
 
  ],
  imports: [
    CommonModule,
    SharedModule,
    MastersModule,
    OrdersRoutingModule
  ],
  providers: [OrderService],
  exports: [
  ]
})

export class OrderModule { }
