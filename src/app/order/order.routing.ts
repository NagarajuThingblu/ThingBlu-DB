import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { AcceptOrderComponent } from "./components/order-automation/accept-order/accept-order.component";
import { ChangeOrderComponent } from "./components/order-automation/change-order/change-order.component";
import { IdentifyOrderComponent } from "./components/order-automation/identify-order/identify-order.component";
import { OrderListingComponent } from "./components/order-listing/order-listing.component";
import { OrderRequestFormComponent } from "./components/order-request-form/order-request-form.component";
import { OrderReturnComponent } from "./components/order-return/order-return.component";
import { OrderformComponent } from "./components/orderform/orderform.component";


const routes:Routes =[
    { path: 'orderrequestform', component: OrderRequestFormComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'orderrequestform/:draftOrderId', component: OrderRequestFormComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'orderreturn', component: OrderReturnComponent, canActivate: [AuthGuard] },
    { path: 'orderlisting', component: OrderListingComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'identifyorder', component: IdentifyOrderComponent, canActivate: [AuthGuard] },
    { path: 'identifyorder/:incomingOrderId', component: IdentifyOrderComponent, canActivate: [AuthGuard]},
    { path: 'acceptorder', component: AcceptOrderComponent, canActivate: [AuthGuard] },
    { path: 'acceptorder/:incomingOrderId', component: AcceptOrderComponent, canActivate: [AuthGuard] },
    { path: 'changeOrder/:incomingOrderId', component: ChangeOrderComponent, canActivate: [AuthGuard] },
    {path:'orderform', component:OrderformComponent, canActivate: [AuthGuard, RoleGuard]},
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class OrdersRoutingModule{}