import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { CanDeactivateGuard } from "../guards/can-deactivate.guard";
import { RoleGuard } from "../guards/role.guard";
import { SkewListResolver } from "../task/resolvers/skew-list.resolver";
import { LotTrackingComponent } from "./components/lot-tracking/lot-tracking.component";
import { LotEntryFormComponent } from "./components/lotentryform/lot-entry-form.component";
import { LotlistingComponent } from "./components/lotlisting/lotlisting.component";


const routes:Routes =[
    {
        path: 'lotentry', component: LotEntryFormComponent, resolve: { data: SkewListResolver }, canActivate: [AuthGuard, RoleGuard],
        canDeactivate: [CanDeactivateGuard]
      },
    { path: 'lotlisting', component: LotlistingComponent, canActivate: [AuthGuard, RoleGuard], resolve: { data: SkewListResolver } },
    { path: 'lottracking', component: LotTrackingComponent, canActivate: [AuthGuard] },
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class LotRoutingModule{}