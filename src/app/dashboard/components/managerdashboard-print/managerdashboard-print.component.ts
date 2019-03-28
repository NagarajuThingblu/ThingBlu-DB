import { Component, OnInit, Input } from '@angular/core';
import { GlobalResources } from '../../../global resource/global.resource';
import { DashboardResource } from '../../dashboard.resource';

@Component({
  selector: 'app-managerdashboard-print',
  templateUrl: './managerdashboard-print.component.html',
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
export class ManagerdashboardPrintComponent implements OnInit {

  @Input() DashboardData: any;
  @Input() IsPrintClicked: boolean;
  @Input() SelectedTabName: string;
  public globalResource: any;
  public managerResources: any;
  constructor() { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.managerResources = DashboardResource.getResources().en.managerdashboard;
  }

}
