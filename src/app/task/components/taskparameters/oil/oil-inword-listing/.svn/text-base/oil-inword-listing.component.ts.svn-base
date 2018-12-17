import { OilService } from './../../../../services/oil.service';
import { Component, OnInit } from '@angular/core';
import { GlobalResources } from '../../../../../global resource/global.resource';
import { TaskResources } from '../../../../task.resources';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { AppConstants } from '../../../../../shared/models/app.constants';

@Component({
  selector: 'app-oil-inword-listing',
  templateUrl: 'oil-inword-listing.component.html',
})
export class OilInwordListingComponent implements OnInit {

  public allOilInwordRequests: any;
  public showTPPkgDetailsModel = false;
  paginationValues: any;
  event: any;
  // public BudOrderDetails: any = [];  // Commented by Devdan :: 31-Oct-2018 :: Unused
  // public JointsOrderDetails: any = []; // Commented by Devdan :: 31-Oct-2018 :: Unused
  // public OilOrderDetails: any = []; // Commented by Devdan :: 31-Oct-2018 :: Unused
  public globalResource: any;
  public oilInwordResource: any;
  public selectedTPDetails: any = {
    tpDetails: [],
    tpPkgDetails: [],
    tpPkgLotDetails: []
  };
  public globalData = {
    tpDetails: [],
    tpPkgDetails: [],
    tpPkgLotDetails: []
  };

    // Added by Devdan :: 20-Nov-2018 :: Adding Lot Icon n Comnent
    public lotInfo: any = {
      lotId: 0,
      showLotNoteModal: false,
      showLotCommentModal: false
    };

  constructor(
    private oilService: OilService,
    private loaderService: LoaderService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.oilInwordResource = TaskResources.getResources().en.oilinwordlisting;
    this.titleService.setTitle(this.oilInwordResource.title);
    this.getOilInwordDetails();
  }
  onPageChange(e) {
    this.event = e;
  }
  getOilInwordDetails() {
    this.loaderService.display(true);
    this.oilService.getOilInwordDetails().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allOilInwordRequests = data.Table;
          this.globalData.tpDetails = data.Table;
          this.globalData.tpPkgDetails = data.Table1;
          this.globalData.tpPkgLotDetails = data.Table2;

          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allOilInwordRequests.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allOilInwordRequests.length;
          }
       } else {
        this.allOilInwordRequests = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get Oil Inword Details complete'));
  }

  // getTPProcessorInfo(TPId) {  // Commented by Devdan :: 31-Oct-2018 :: Unused
  //   // this.selectedTPDetails.tpPkgLotDetails = this.globalData.tpPkgDetails.filter(data => data.TPId === TPId);
  //   // this.selectedTPDetails.tpPkgDetails = this.globalData.tpDetails.filter(data => data.TPId === TPId)[0];
  //   // this.showTPPkgDetailsModel = true;
  // }

  pkgDetails(PkgDetailsObj: any) {
    return this.globalData.tpPkgDetails.filter(data => data.InwordTPId === PkgDetailsObj.InwordTPId);
  }

  getTPPkgLotInfo(pkgDetails: any) {
    this.selectedTPDetails.tpPkgLotDetails = this.globalData.tpPkgLotDetails.filter(data =>
        data.InwordTPId === pkgDetails.InwordTPId && data.OilPkgId === pkgDetails.OilPkgId);

    this.selectedTPDetails.tpPkgDetails = pkgDetails;

    this.selectedTPDetails.tpDetails = this.globalData.tpDetails.filter(data =>
      data.InwordTPId === pkgDetails.InwordTPId)[0];

    this.selectedTPDetails.tpDetails = this.globalData.tpDetails.filter(data =>
      data.InwordTPId === pkgDetails.InwordTPId)[0];

          console.log(this.selectedTPDetails.tpPkgDetails);
    this.showTPPkgDetailsModel = true;
  }

  // Added by Devdan :: 20-Nov-2018 :: Adding Comnent popup
  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

  ShowLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

}
