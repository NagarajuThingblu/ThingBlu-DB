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

enum TabIndexName {
  'GRINDING',
  'ROLLING',
  'TAMPING',
  'PACKAGING',
  'LABELING'
}

@Component({
  selector: 'app-joints-dashboard',
  templateUrl: './joints-dashboard.component.html',
  styleUrls: ['./joints-dashboard.component.css']
})
export class JointsDashboardComponent implements OnInit {

  public prodDashboardResource: any;
  public globalResource: any;

  public viewOrdersByValues: SelectItem[] = [];

  public defaultDate: Date;
  public endDate: Date;
  public isDataLoaded = false;
  public selectedTabIndex = null;
  public selectedTabName: string;

  public isPrintClicked = false;
  public filterSectionModels: any = {
    viewOrdersBy: 'DD',
    deliveryDate: null,
    beginDate: null,
    endDate: null
  };

  public dashboardObject = {
    grinding: {
      availableTasks: [],
      upcomingTasks: [],
      availableStrains: [],
      availTasksPagination: [],
      upcomingTasksPagination: [],
      availStrainsPagination: []
    },
    rolling: {
      availableTasks: [],
      upcomingTasks: [],
      availTasksPagination: [],
      upcomingTasksPagination: [],
    },
    tamping: {
      availableTasks: [],
      upcomingTasks: [],
      availTasksPagination: [],
      upcomingTasksPagination: [],
    },
    tubing: {
      availableTasks: [],
      upcomingTasks: [],
      availTasksPagination: [],
      upcomingTasksPagination: [],
    },
    labeling: {
      availableTasks: [],
      upcomingTasks: [],
      availTasksPagination: [],
      upcomingTasksPagination: [],
    }
  };

  tabIndexName = TabIndexName;

  tabCountsData: any;

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

    // check if already any tab selected and load the data
    if (this.appCommonService.getLocalStorage('JPDTabIndex')) {
      this.selectedTabIndex = Number(this.appCommonService.getLocalStorage('JPDTabIndex'));
      this.onTabChange(null);
    } else {
      this.selectedTabIndex = TabIndexName.ROLLING;
      this.onTabChange(null);
    }
  }

  refreshData() {
    // this.getJointsProductionDashboardDetails(this.filterSectionModels);
    this.onTabChange(null);
  }

  getJointsProductionDashboardDetails(filterSectionModels, TaskTypeKey = '') {
    this.loaderService.display(true);
    this.dashboardService.getJointsProductionDashboardDetails(filterSectionModels, TaskTypeKey)
    .subscribe((data: any) => {
      if (data !== 'No data found!') {
        this.dashboardObject = {
          grinding: {
            availableTasks: [],
            upcomingTasks: [],
            availableStrains: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
            availStrainsPagination: AppConstants.getPaginationOptions
          },
          rolling: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          },
          tamping: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          },
          tubing: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          },
          labeling: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          }
        };

        this.tabCountsData = data.Table[0];

        if (TaskTypeKey === 'GRINDING') {
          this.dashboardObject.grinding.availableTasks = data.Table1;
          this.dashboardObject.grinding.upcomingTasks = data.Table2;
          this.dashboardObject.grinding.availableStrains = data.Table3;

          // Grids pagination data
          if (this.dashboardObject.grinding.availableTasks && this.dashboardObject.grinding.availableTasks.length > 20) {
            this.dashboardObject.grinding.availTasksPagination[AppConstants.getPaginationOptions.length] = this.dashboardObject.grinding.availableTasks.length;
          }

          if (this.dashboardObject.grinding.upcomingTasks && this.dashboardObject.grinding.upcomingTasks.length > 20) {
            this.dashboardObject.grinding.upcomingTasksPagination[AppConstants.getPaginationOptions.length] =
              this.dashboardObject.grinding.upcomingTasks.length;
          }

          if (this.dashboardObject.grinding.availableStrains && this.dashboardObject.grinding.availableStrains.length > 20) {
            this.dashboardObject.grinding.availStrainsPagination[AppConstants.getPaginationOptions.length] =
              this.dashboardObject.grinding.availableStrains.length;
          }
          // End Grids pagination data
        } else if (TaskTypeKey === 'JOINTSCREATION') {
          this.dashboardObject.rolling.availableTasks = data.Table1;
          this.dashboardObject.rolling.upcomingTasks = data.Table2;

         // Grids pagination data
          if (this.dashboardObject.rolling.availableTasks && this.dashboardObject.rolling.availableTasks.length > 20) {
            this.dashboardObject.rolling.availTasksPagination[AppConstants.getPaginationOptions.length] = this.dashboardObject.rolling.availableTasks.length;
          }

          if (this.dashboardObject.rolling.upcomingTasks && this.dashboardObject.rolling.upcomingTasks.length > 20) {
            this.dashboardObject.rolling.upcomingTasksPagination[AppConstants.getPaginationOptions.length] =
              this.dashboardObject.rolling.upcomingTasks.length;
          }
           // End Grids pagination data
        } else if (TaskTypeKey === 'TAMPING') {
          this.dashboardObject.tamping.availableTasks = data.Table1;
          this.dashboardObject.tamping.upcomingTasks = data.Table2;

          // Grids pagination data
          if (this.dashboardObject.tamping.availableTasks && this.dashboardObject.tamping.availableTasks.length > 20) {
            this.dashboardObject.tamping.availTasksPagination[AppConstants.getPaginationOptions.length] = this.dashboardObject.tamping.availableTasks.length;
          }

          if (this.dashboardObject.tamping.upcomingTasks && this.dashboardObject.tamping.upcomingTasks.length > 20) {
            this.dashboardObject.tamping.upcomingTasksPagination[AppConstants.getPaginationOptions.length] =
              this.dashboardObject.tamping.upcomingTasks.length;
          }
          // End Grids pagination data
        } else if (TaskTypeKey === 'TUBING') {
          this.dashboardObject.tubing.availableTasks = data.Table1;
          this.dashboardObject.tubing.upcomingTasks = data.Table2;

          // Grids pagination data
          if (this.dashboardObject.tubing.availableTasks && this.dashboardObject.tubing.availableTasks.length > 20) {
            this.dashboardObject.tubing.availTasksPagination[AppConstants.getPaginationOptions.length] = this.dashboardObject.tubing.availableTasks.length;
          }

          if (this.dashboardObject.tubing.upcomingTasks && this.dashboardObject.tubing.upcomingTasks.length > 20) {
            this.dashboardObject.tubing.upcomingTasksPagination[AppConstants.getPaginationOptions.length] =
              this.dashboardObject.tubing.upcomingTasks.length;
          }
          // End Grids pagination data
        } else if (TaskTypeKey === 'TUBELABELING') {
          this.dashboardObject.labeling.availableTasks = data.Table1;
          this.dashboardObject.labeling.upcomingTasks = data.Table2;

          // Grids pagination data
          if (this.dashboardObject.labeling.availableTasks && this.dashboardObject.labeling.availableTasks.length > 20) {
            this.dashboardObject.labeling.availTasksPagination[AppConstants.getPaginationOptions.length] = this.dashboardObject.labeling.availableTasks.length;
          }

          if (this.dashboardObject.labeling.upcomingTasks && this.dashboardObject.labeling.upcomingTasks.length > 20) {
            this.dashboardObject.labeling.upcomingTasksPagination[AppConstants.getPaginationOptions.length] =
              this.dashboardObject.labeling.upcomingTasks.length;
          }
          // End Grids pagination data
        }

        this.isDataLoaded = true;
      } else {
        this.dashboardObject = {
          grinding: {
            availableTasks: [],
            upcomingTasks: [],
            availableStrains: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
            availStrainsPagination: AppConstants.getPaginationOptions
          },
          rolling: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          },
          tamping: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          },
          tubing: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          },
          labeling: {
            availableTasks: [],
            upcomingTasks: [],
            availTasksPagination: AppConstants.getPaginationOptions,
            upcomingTasksPagination: AppConstants.getPaginationOptions,
          }
        };

        this.tabCountsData = [];
      }
      this.loaderService.display(false);
    },
    error => { console.log(error); this.loaderService.display(false); }
    );
  }

  submitFilters() {
    this.isDataLoaded = false;
    this.isPrintClicked = false;
    this.appCommonService.setLocalStorage('JPDFilters', JSON.stringify(this.filterSectionModels));
    // this.getJointsProductionDashboardDetails(this.filterSectionModels, 'TUBELABELING');
    this.onTabChange(null);
  }

  onTabChange(e) {
    this.isDataLoaded = false;
    if (e) {
      this.selectedTabIndex = e.index;
    }
    this.selectedTabName = TabIndexName[this.selectedTabIndex];
    this.appCommonService.setLocalStorage('JPDTabIndex', JSON.stringify(this.selectedTabIndex));

    if (this.selectedTabIndex === TabIndexName.LABELING) {
      this.getJointsProductionDashboardDetails(this.filterSectionModels, 'TUBELABELING');
    } else if (this.selectedTabIndex === TabIndexName.PACKAGING) {
      this.getJointsProductionDashboardDetails(this.filterSectionModels, 'TUBING');
    } else if (this.selectedTabIndex === TabIndexName.TAMPING) {
      this.getJointsProductionDashboardDetails(this.filterSectionModels, 'TAMPING');
    } else if (this.selectedTabIndex === TabIndexName.ROLLING) {
      this.getJointsProductionDashboardDetails(this.filterSectionModels, 'JOINTSCREATION');
    } else if (this.selectedTabIndex === TabIndexName.GRINDING) {
      this.getJointsProductionDashboardDetails(this.filterSectionModels, 'GRINDING');
    }
  }

  print(): void {
    let popupWin;
    let printContents: string;
    this.isPrintClicked = true;
    printContents = document.getElementById('PRINT' + this.selectedTabName).innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <style type = "text/css">
          .ui-widget, body {
            font-family: "Roboto", "Trebuchet MS", Arial, Helvetica, sans-serif;
            font-size: 0.94rem;
          }
          .ui-widget, .ui-widget * {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
            .ui-g-12 {
              width: 100%;
          }
          b, strong {
            font-weight: bolder;
          }
          .ui-md-2 {
            width: 16.6667%;
          }
          .ui-md-5 {
          width: 41.6667%;
          }
          .ui-md-3 {
            width: 25%;
          }
          .ui-md-4 {
            width: 33.3333%;
          }
          .ui-md-1, .ui-md-2, .ui-md-3, .ui-md-4, .ui-md-5, .ui-md-6, .ui-md-7, .ui-md-8, .ui-md-9, .ui-md-10, .ui-md-11, .ui-md-12 {
            padding: .5em;
          }
          .ui-g-1, .ui-g-2, .ui-g-3, .ui-g-4, .ui-g-5, .ui-g-6, .ui-g-7, .ui-g-8, .ui-g-9, .ui-g-10, .ui-g-11, .ui-g-12 {
            float: left;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: .5em;
          }
          .paddingRL {
            padding: 0em .8em;
            position: relative;
          }
          label {
            display: inline-block;
            margin-bottom: .1rem ;
          }
          .ui-table .ui-table-tbody>tr>td {
            word-break: break-word;
          }

          .clsWrapText div.paddingRL div label{
            word-break: break-word;
          }
          @media print {
            body {-webkit-print-color-adjust: exact;}

            .ui-table .ui-table-tbody>tr>td {
              word-break: break-word;
            }

            .clsSectionHeader .clsHeaderTitlebar {
              padding: .1em .75em;
              border: 1px solid #d9d9d9;
              font-weight: normal;
            }
            .clsHeaderTitlebar {
                background-image: none;
                background-color: #0C59CF ;
                color: white;
            }
            .clsSectionHeader * {
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
            }
            span.clsTextTitle {
                margin-top: 10px;
                margin-bottom: 5px;
                font-size: 18px;
            }
            .ui-md-12 {
              width: 100%;
            }
            .ui-md-6 {
              width: 50%;
            }
            .ui-widget, .ui-widget * {
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
            }
            .ui-corner-all {
              border-radius: 0px !important;
            }
            .marginBottom {
            margin-bottom: 10px;
            }
            .ui-card-body {
              padding: 15px;
              border: 1px solid #D5D5D5;
            }
            .ui-table table {
              border-collapse: collapse;
              width: 100%;
              table-layout: fixed;
            }
            .ui-table .ui-table-thead>tr>th, .ui-table .ui-table-tbody>tr>td, .ui-table .ui-table-tfoot>tr>td {
              padding: .25em .5em;
            }
            .ui-table .ui-table-tbody > tr
              .marginBottom {
                margin-bottom: 10px;
            }
            .ui-table .ui-table-thead > tr:first-child {
              /*background-image: none !important;
              background-color: #0C59CF !important;
              color: #FFFFFF !important;
              background: -webkit-gradient(linear, left top, left bottom, from(#f6f7f9), to(#ebedf0));
              background: linear-gradient(to bottom, #f6f7f9 0%, #ebedf0 100%);
              */
              font-weight: bold;
              text-align:left;
              border: 1px solid #D5D5D5;
            }
            .ui-table .ui-table-tbody > tr {
              border: 1px solid #D5D5D5;
              background: inherit;
            }
            .clsRemoveFrmPrint {
              display:none!important;
            }
        }
        </style>
      </head>
      <body onload="window.print();">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }

}
