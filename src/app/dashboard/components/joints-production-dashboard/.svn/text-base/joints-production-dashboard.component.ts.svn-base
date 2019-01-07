import { AppCommonService } from './../../../shared/services/app-common.service';
import { DashobardService } from './../../services/dashobard.service';
import { DashboardResource } from './../../dashboard.resource';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalResources } from '../../../global resource/global.resource';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router } from '@angular/router';
import { AppConstants } from '../../../shared/models/app.constants';
import { SelectItem } from 'primeng/api';
import { UserModel } from '../../../shared/models/user.model';

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
  public userRoles: any;

  paginationValuesgrinding: any;
  paginationValuesjointsCreation: any;
  paginationValuestamping: any;
  PaginationValuestubing: any;
  public _cookieService: UserModel;

  public viewOrdersByValues: SelectItem[] = [];

  public defaultDate: Date;
  public endDate: Date;

  public filterSectionModels: any = {
    viewOrdersBy: 'DD',
    deliveryDate: null,
    beginDate: null,
    endDate: null
  };

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
    this._cookieService = this.appCommonService.getUserProfile();
    this.userRoles = AppConstants.getUserRoles;

    this.defaultDate = this.appCommonService.calcTime(this.appCommonService.getUserProfile().UTCTime);
    this.endDate = this.appCommonService.calcTime(this.appCommonService.getUserProfile().UTCTime);

    this.endDate.setDate( this.endDate.getDate() + 2 );
    this.defaultDate.setDate( this.defaultDate.getDate() + 1 );

    if (this.appCommonService.getLocalStorage('JPDFilters')) {
      const filterObjectDetails = JSON.parse(this.appCommonService.getLocalStorage('JPDFilters'));

      // console.log(filterObjectDetails);
      this.filterSectionModels.viewOrdersBy = filterObjectDetails.viewOrdersBy;

      this.filterSectionModels.deliveryDate = new Date(filterObjectDetails.deliveryDate);
      this.filterSectionModels.beginDate = new Date(filterObjectDetails.beginDate);

      this.filterSectionModels.endDate = new Date(filterObjectDetails.endDate);
    } else {
      this.filterSectionModels.deliveryDate = this.defaultDate;
      this.filterSectionModels.beginDate = this.defaultDate;

      this.filterSectionModels.endDate = this.endDate;
    }

    this.viewOrdersByValues = [
      { label: 'Delivery Date', value: 'DD' },
      { label: 'Delivery Date Range', value: 'DDR' },
      { label: 'All Pending', value: 'AP' }
    ];

    this.getJointsProductionDashboardDetails(this.filterSectionModels);
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
    if (String(this._cookieService.UserRole) === String(this.userRoles.Employee)) {
      this.router.navigate(['../home/empassigntask']);
    } else {
      this.router.navigate(['../home/assigntask']);
    }
  }

  refreshData() {
    this.getJointsProductionDashboardDetails(this.filterSectionModels);
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
  getJointsProductionDashboardDetails(filterSectionModels) {
    this.loaderService.display(true);

    this.dashboardService.getJointsProductionDashboardDetails(filterSectionModels)
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

  submitFilters() {
    this.appCommonService.setLocalStorage('JPDFilters', JSON.stringify(this.filterSectionModels));

    this.getJointsProductionDashboardDetails(this.filterSectionModels);
  }
}
