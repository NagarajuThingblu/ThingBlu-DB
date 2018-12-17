
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OrderRequestFormComponent } from '../order/components/order-request-form/order-request-form.component';
import { OrderService } from './service/order.service';
import { OrderReturnComponent } from './components/order-return/order-return.component';
import { OrderListingComponent } from './components/order-listing/order-listing.component';
import { PackageSizePipe } from './pipe/package-size.pipe';
import { DynamicValueFilterPipe } from './pipe/dynamic-value-filter.pipe';

@NgModule({
  declarations: [
    OrderRequestFormComponent,
    OrderReturnComponent,
    OrderListingComponent,
    PackageSizePipe,
    DynamicValueFilterPipe
  ],
  imports: [
    SharedModule
  ],
  providers: [OrderService],
  exports: [
  ]
})

export class OrderModule { }
