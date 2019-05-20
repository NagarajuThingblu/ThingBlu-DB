import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../shared/services/loader.service';
import { AppCommonService } from '../../shared/services/app-common.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styles: [`
  iframe #WoskSpaceDiv {
    width:100% !important;
  }

  .clsframe{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
  }
  `]
})
export class OrderReportComponent implements OnInit {

  public iFrameUrl: any;
  public value = 14;
  public userName: any;
  reportUrl =  {
    rptUrl: null
  };
  video: any;
  constructor(
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    public sanitizer: DomSanitizer

  ) { }

  ngOnInit() {
    this.loaderService.display(true);
    //  setTimeout(() => {
    //   this.loaderService.display(false);
    //  }, 5000);
    this.userName = this.appCommonService.getUserProfile().UserName;
    if (this.userName) {
        // this.iFrameUrl = 'https://demo.navizanalytics.com/NavizUICW/DashboardEmbed/Home.aspx?DashboardName=Order&UserName=' + userName;
        this.iFrameUrl = 'https://demo.navizanalytics.com/NavizUICW/DashboardEmbed/Home.aspx?DashboardName=Order&UserName=' + this.value;
        this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iFrameUrl);
        this.reportUrl.rptUrl = this.iFrameUrl;
        this.loaderService.display(false);
    }
}

getUrl(event) {
  //  if (this.Istrue) {
  //    this.Istrue = false;
  return this.sanitizer.bypassSecurityTrustResourceUrl(this.iFrameUrl);
  //  }

}

}
