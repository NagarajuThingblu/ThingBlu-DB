import { AppCommonService } from './../../../shared/services/app-common.service';
import { DashboardResource } from './../../dashboard.resource';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GlobalResources } from '../../../global resource/global.resource';
import { Router } from '@angular/router';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  selector: 'app-joints-dashboard-data',
  templateUrl: './joints-dashboard-data.component.html',
  styles: [`
      .clsAssignTaskColumn {
        width: 10%;
      }

      td.clsAssignTaskColumn {
        word-break: keep-all;
        white-space: nowrap;
        padding: 2px !important;
      }

      :host::ng-deep .disableGrayButton {
        background: grey !important;
      }
  `]
})
export class JointsDashboardDataComponent implements OnInit {

  @Input() DashboardData: any;
  @Input() IsPrintClicked: boolean;
  @Input() SelectedTabName: string;
  @Input() FilterSectionModels: any;

  public userProfile: any;
  public prodDashboardResource: any;
  public globalResource: any;

  public availableTaskEvent: any;
  public upcomingTaskEvent: any;

  public dashboardGridEvents: any = {
    grinding: {
      availTasksEvent: null,
      upcomingTasksEvent: null,
      availStrainsEvent: null
    },
    rolling: {
      availTasksEvent: null,
      upcomingTasksEvent: null
    },
    tamping: {
      availTasksEvent: null,
      upcomingTasksEvent: null
    },
    tubing: {
      availTasksEvent: null,
      upcomingTasksEvent: null
    },
    labeling: {
      availTasksEvent: null,
      upcomingTasksEvent: null
    }
  };

  constructor(
    private appCommonService: AppCommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.prodDashboardResource = DashboardResource.getResources().en.jointsproductiondashobarddata;
    this.globalResource = GlobalResources.getResources().en;
    this.userProfile = this.appCommonService.getUserProfile();
  }

  onAvailablePageChange(e) {
    if (String(this.SelectedTabName).toLocaleUpperCase() === 'GRINDING') {
      this.dashboardGridEvents.grinding.availTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'ROLLING') {
      this.dashboardGridEvents.rolling.availTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'TAMPING') {
      this.dashboardGridEvents.tamping.availTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'PACKAGING') {
      this.dashboardGridEvents.tubing.availTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'LABELING') {
      this.dashboardGridEvents.labeling.availTasksEvent = e;
    }
  }

  onUpcomingPageChange(e) {
    if (String(this.SelectedTabName).toLocaleUpperCase() === 'GRINDING') {
      this.dashboardGridEvents.grinding.upcomingTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'ROLLING') {
      this.dashboardGridEvents.rolling.upcomingTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'TAMPING') {
      this.dashboardGridEvents.tamping.upcomingTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'PACKAGING') {
      this.dashboardGridEvents.tubing.upcomingTasksEvent = e;
    } else if (String(this.SelectedTabName).toLocaleUpperCase() === 'LABELING') {
      this.dashboardGridEvents.labeling.upcomingTasksEvent = e;
    }
  }

  onAvailableStrainsPageChange(e) {
    this.dashboardGridEvents.grinding.availStrainsEvent = e;
  }

  onLabelingClaim(rowData) {
    this.appCommonService.prodDBRouteParams = rowData;
    if (this.FilterSectionModels) {
      this.appCommonService.prodDBRouteParams['viewOrdersBy'] = this.FilterSectionModels.viewOrdersBy;

      if (this.FilterSectionModels.viewOrdersBy === 'DD') {
        this.appCommonService.prodDBRouteParams['beginDate'] = new Date(this.FilterSectionModels.deliveryDate);
        this.appCommonService.prodDBRouteParams['endDate'] = null;
      } else if (this.FilterSectionModels.viewOrdersBy === 'DDR') {
        this.appCommonService.prodDBRouteParams['beginDate'] =  new Date(this.FilterSectionModels.beginDate);
        this.appCommonService.prodDBRouteParams['endDate'] = new Date(this.FilterSectionModels.endDate);
      } else {
        this.appCommonService.prodDBRouteParams['beginDate'] =  null;
        this.appCommonService.prodDBRouteParams['endDate'] = null;
      }
    }
    if (this.userProfile.UserRole === 'Employee') {
      this.router.navigate(['../home/empassigntask']);
    } else {
      this.router.navigate(['../home/assigntask']);
    }
  }
}
