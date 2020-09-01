import { DomSanitizer, Title } from '@angular/platform-browser';
import { AppCommonService } from './../../shared/services/app-common.service';
import { LoaderService } from './../../shared/services/loader.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preroll-report',
  templateUrl: './preroll-report.component.html',
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
export class PrerollReportComponent implements OnInit {
  public iFrameUrl: any;
  public value = 14;
  public userName: any;
  reportUrl = {
    rptUrl: null
  };
  video: any;
  constructor(
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    public sanitizer: DomSanitizer,
    private titleService: Title,

  ) { }

  ngOnInit() {
    this.loaderService.display(true);
    this.titleService.setTitle('Pre-Roll Report');
    //  setTimeout(() => {
    //   this.loaderService.display(false);
    //  }, 5000);
    this.userName = this.appCommonService.getUserProfile().UserName;
    if (this.userName) {
     // this.iFrameUrl = ' https://demo.navizanalytics.com/Thingblu/DashboardEmbed/Home.aspx?DashboardName=Pre-Roll&UserName=' + this.userName; // Production
     // this.iFrameUrl = 'https://demo.navizanalytics.com/NavizUICW/DashboardEmbed/Home.aspx?DashboardName=Pre-Roll&UserName=' + this.userName;   // UAT
     // this.iFrameUrl = 'https://demo.navizanalytics.com/NavizUICW/DashboardEmbed/Home.aspx?DashboardName=Pre-Roll&UserName=' + this.value;
     this.iFrameUrl = 'https://demo.navizanalytics.com/Thingbludemo/DashboardEmbed/Home.aspx?DashboardName=Pre-Roll&UserName='+this.userName;   // UAT
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
