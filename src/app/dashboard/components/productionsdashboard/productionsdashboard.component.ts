import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../../shared/models/app.constants';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RefreshService } from '../../services/refresh.service';
import { environment } from './../../../../environments/environment';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { Router } from '@angular/router';
import { DashboardResource } from '../../dashboard.resource';
import { Table } from 'primeng/table';
import { DashobardService } from './../../services/dashobard.service';

@Component({
  selector: 'app-productionsdashboard',
  templateUrl: './productionsdashboard.component.html',
  styleUrls: ['./productionsdashboard.component.css']
})
export class ProductionsdashboardComponent implements OnInit {
  ProductionDashboardform: FormGroup;
  public globalresource: any;
  public productionresource: any;
  public allproductiondashboardlist: any;
  public ordercount: any;
  public allYtdlist: any;
  public allProductstatslist: any;
  public ytdlistdist: any;
  public prdctlistdist: any;
  paginationvalues: any;
  TodayDate = new Date();
  public event: any;
  constructor(private loaderService: LoaderService,
    private titleService: Title,
    private fb: FormBuilder,
    private router: Router,
    private refreshService: RefreshService,
    private appCommonService: AppCommonService,
    private dashboardService: DashobardService
  ) {

  }

  ngOnInit() {
    this.globalresource = GlobalResources.getResources().en;
    this.GetProductionDashboardDetails();
    this.GetYtdProductStatsDetails();

  }

  // GetProductionDashboardDetails() {
  //   this.dashboardService.getproductionDashboardDetails().subscribe((data: any) => {
  //     if (data != "No data found") {
  //       this.ordercount = data.Table1;
  //       this.allproductiondashboardlist = data.Table;

  //       this.loaderService.display(false);

  //     }
  //   })
  // }

  GetProductionDashboardDetails() {
    this.dashboardService.getproductionDashboardDetails().subscribe((data: any) => {
      if (data != "No data found") {
        this.ordercount = data.Table1;
        this.allproductiondashboardlist = data.Table;
        this.paginationvalues = AppConstants.getPaginationOptions;
        if (this.allproductiondashboardlist.length > 20) {
          this.paginationvalues[AppConstants.getPaginationOptions.length] = this.allproductiondashboardlist.length;

        }
      }
      else {
        this.allproductiondashboardlist = [];
      }
      this.loaderService.display(false);
    },
    
    error => { console.log(error); this.loaderService.display(false); },
    () => console.log('GetAllRoomTypesbyClient complete'));
  }
  onPageChange(e) {
    this.event = e;
  }
  GetYtdProductStatsDetails() {
    this.dashboardService.getytdprodcutstatsDetails().subscribe((data: any) => {
      if (data != "No data found") {
        this.allYtdlist = data.Table;
        this.ytdlistdist = this.allYtdlist.map(item => item.Category)
          .filter((value, index, self) => self.indexOf(value) === index);


        this.allProductstatslist = data.Table1;
        this.prdctlistdist = this.allProductstatslist.map(item => item.Category)
          .filter((value, index, self) => self.indexOf(value) === index);

      }
    })
  }


}
