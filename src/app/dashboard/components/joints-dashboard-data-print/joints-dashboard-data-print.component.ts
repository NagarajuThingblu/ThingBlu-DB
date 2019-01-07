import { AppCommonService } from './../../../shared/services/app-common.service';
import { DashboardResource } from './../../dashboard.resource';
import { Component, OnInit, Input } from '@angular/core';
import { GlobalResources } from '../../../global resource/global.resource';
import { Router } from '@angular/router';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  selector: 'app-joints-dashboard-data-print',
  templateUrl: './joints-dashboard-data-print.component.html',
  styles: [`
  .clsAssignTaskColumn {
    width: 10%;
  }

  td.clsAssignTaskColumn {
    text-align: center;
    word-break: keep-all;
    white-space: nowrap;
    padding: 2px !important;
  }

  :host::ng-deep .disableGrayButton {
    background: grey !important;
  }
`]
})
export class JointsDashboardDataPrintComponent implements OnInit {

  @Input() DashboardData: any;
  @Input() IsPrintClicked: boolean;
  @Input() SelectedTabName: string;

  public userProfile: any;
  public prodDashboardResource: any;
  public globalResource: any;


  constructor(
    private appCommonService: AppCommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.prodDashboardResource = DashboardResource.getResources().en.jointsproductiondashobarddata;
    this.globalResource = GlobalResources.getResources().en;
    this.userProfile = this.appCommonService.getUserProfile();
  }
}
