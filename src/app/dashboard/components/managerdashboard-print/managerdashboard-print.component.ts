import { Component, OnInit } from '@angular/core';
import { GlobalResources } from '../../../global resource/global.resource';
import { DashboardResource } from '../../dashboard.resource';

@Component({
  selector: 'app-managerdashboard-print',
  templateUrl: './managerdashboard-print.component.html',
  styleUrls: ['./managerdashboard-print.component.css']
})
export class ManagerdashboardPrintComponent implements OnInit {

  public globalResource: any;
  public managerResources: any;
  constructor() { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.managerResources = DashboardResource.getResources().en.managerdashboard;
  }

}
