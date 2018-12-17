import { AppCommonService } from './../../../shared/services/app-common.service';
import { DashobardService } from './../../services/dashobard.service';
import { DashboardResource } from './../../dashboard.resource';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalResources } from '../../../global resource/global.resource';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router } from '@angular/router';
import { AppConstants } from '../../../shared/models/app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-joints-production-dashboard',
  templateUrl: 'joints-production-dashboard.component.html',
  styles: [`
    .clsAssignTaskColumn {
      width: 60px;
    }

    td.clsAssignTaskColumn {
      text-align: center;
      word-break: keep-all;
      white-space: nowrap;
      padding: 2px !important;
    }
  `]
})
export class JointsProductionDashboardComponent implements OnInit {

  public prodDashboardResource: any;
  public globalResource: any;

  public rowGroupMetadataStrain: any = [];

  grindingevent: any;
  jointsCreationevent: any;
  tampingevent: any;
  tubingevent: any;

  paginationValuesgrinding: any;
  paginationValuesjointsCreation: any;
  paginationValuestamping: any;
  PaginationValuestubing: any;

  public dashboardObject = {
    grinding: [],
    jointsCreation: [],
    tamping: [],
    tubing: []
  };

  constructor(
    private titleService: Title,
    private dashboardService: DashobardService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.prodDashboardResource = DashboardResource.getResources().en.jointsproductiondashobard;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.prodDashboardResource.title);

    this.getJointsProductionDashboardDetails();
  }

  claimTask(rowData: any) {
    this.refreshData();
    // let rowRecordData;

    // setTimeout(() => {
    //   if (rowData.TaskTypeKey === 'GRINDING') {
    //     rowRecordData = this.dashboardObject.grinding.filter(data => data.StrainId === rowData.StrainId);
    //   } else if (rowData.TaskTypeKey === 'JOINTSCREATION') {
    //     rowRecordData = this.dashboardObject.jointsCreation.filter(data => {
    //       return data.StrainId === rowData.StrainId && data.UnitValue === rowData.UnitValue;
    //     });
    //   } else if (rowData.TaskTypeKey === 'TAMPING') {
    //     rowRecordData = this.dashboardObject.tamping.filter(data => {
    //       return data.StrainId === rowData.StrainId && data.UnitValue === rowData.UnitValue;
    //     });
    //   } else if (rowData.TaskTypeKey === 'TUBING') {
    //     rowRecordData = this.dashboardObject.tubing.filter(data => {
    //       return data.StrainId === rowData.StrainId && data.UnitValue === rowData.UnitValue;
    //     });
    //   }

    //   this.appCommonService.prodDBRouteParams = rowRecordData[0];
    //   this.router.navigate(['../home/assigntask']);
    // }, 500);

    this.appCommonService.prodDBRouteParams = rowData;
    this.router.navigate(['../home/assigntask']);
  }

  refreshData() {
    this.getJointsProductionDashboardDetails();
  }

  grindingonPageChange(e1) {
    this.grindingevent = e1;
  }
  jointsCreationonPageChange(e2) {
    this.jointsCreationevent = e2;
  }
  tampingonPageChange(e3) {
    this.tampingevent = e3;
  }
  tubingonPageChange(e4) {
    this.tubingevent = e4;
  }
  getJointsProductionDashboardDetails() {
    this.loaderService.display(true);

    this.dashboardService.getJointsProductionDashboardDetails()
    .subscribe((data: any) => {

      if (data !== 'No data found!') {
        this.dashboardObject.grinding = data.Table3;
        this.dashboardObject.jointsCreation = data.Table2;
        this.dashboardObject.tamping = data.Table1;
        this.dashboardObject.tubing = data.Table;

        for (let i = 0; i < data.Table1.length; i++) {
          const rowData = data.Table1[i];
          if (this.rowGroupMetadataStrain[rowData.StrainId]) {
            this.rowGroupMetadataStrain[rowData.StrainId].size++;
          } else {
            this.rowGroupMetadataStrain[rowData.StrainId] = [];
            this.rowGroupMetadataStrain[rowData.StrainId] = { index: i, size: 1 };
          }
        }

        this.paginationValuesgrinding = AppConstants.getPaginationOptions;
        if (this.dashboardObject.grinding.length > 20) {
          this.paginationValuesgrinding[AppConstants.getPaginationOptions.length] = this.dashboardObject.grinding.length;
        }

        this.paginationValuesjointsCreation = AppConstants.getPaginationOptions;
        if (this.dashboardObject.jointsCreation.length > 20) {
          this.paginationValuesjointsCreation[AppConstants.getPaginationOptions.length] = this.dashboardObject.jointsCreation.length;
        }

        this.paginationValuestamping = AppConstants.getPaginationOptions;
        if (this.dashboardObject.tamping.length > 20) {
          this.paginationValuestamping[AppConstants.getPaginationOptions.length] = this.dashboardObject.tamping.length;
        }

        this.PaginationValuestubing = AppConstants.getPaginationOptions;
        if (this.dashboardObject.tubing.length > 20) {
          this.PaginationValuestubing[AppConstants.getPaginationOptions.length] = this.dashboardObject.tubing.length;
        }
        // this.rowGroupMetadataStrain = {};
        // if (this.dashboardObject.jointsCreation) {
        //     for (let i = 0; i < this.dashboardObject.jointsCreation.length; i++) {
        //         const rowData = this.dashboardObject.jointsCreation[i];
        //         const strainId = rowData.StrainId;
        //         if (i === 0) {
        //             this.rowGroupMetadataStrain[strainId] = { index: 0, size: 1 };
        //         } else {
        //             const previousRowData = this.dashboardObject.jointsCreation[i - 1];
        //             const previousRowGroup = previousRowData.strainId;
        //             if (strainId === previousRowGroup) {
        //                 this.rowGroupMetadataStrain[strainId].size++;
        //             } else {
        //                 this.rowGroupMetadataStrain[strainId] = { index: i, size: 1 };
        //             }
        //         }
        //     }
        // }
      } else {
        this.dashboardObject = {
          grinding: [],
          jointsCreation: [],
          tamping: [],
          tubing: []
        };
      }
      this.loaderService.display(false);
    },
    error => { console.log(error); this.loaderService.display(false); }
    );
  }

}
