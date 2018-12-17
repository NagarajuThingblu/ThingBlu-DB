import { OilService } from './../../../../services/oil.service';
import { Component, OnInit } from '@angular/core';
import { GlobalResources } from '../../../../../global resource/global.resource';
import { TaskResources } from '../../../../task.resources';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { AppConstants } from '../../../../../shared/models/app.constants';

@Component({
  moduleId: module.id,
  selector: 'app-oil-outword-listing',
  templateUrl: 'oil-outword-listing.component.html'
})
export class OilOutwordListingComponent implements OnInit {

  public allOilOutwordRequests: any;
  public showTPDetailsModel = false;
  // Commented by Devdan :: 31-Oct-2018 :: Unused
  // public BudOrderDetails: any = [];
  // public JointsOrderDetails: any = [];
  // public OilOrderDetails: any = [];
  public globalResource: any;
  public oilOutwordResource: any;
  paginationValues: any;
  event: any;
  public selectedTPDetails: any = {
    tpDetails: [],
    tpLotDetails: []
  };
  public globalData = {
    tpDetails: [],
    tpLotDetails: []
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
    this.oilOutwordResource = TaskResources.getResources().en.oiloutwordlisting;
    this.titleService.setTitle(this.oilOutwordResource.title);
    this.getOilOutwordDetails();
  }
  onPageChange(e) {
    this.event = e;
  }
  getOilOutwordDetails() {
    this.loaderService.display(true);
    this.oilService.getOilOutwordDetails().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allOilOutwordRequests = data.Table;
          this.globalData.tpDetails = data.Table;
          this.globalData.tpLotDetails = data.Table1;

          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allOilOutwordRequests.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allOilOutwordRequests.length;
          }

       } else {
        this.allOilOutwordRequests = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get Oil Outword Details complete'));
  }

  getTPProcessorInfo(objDetails) {
    this.selectedTPDetails.tpLotDetails = this.globalData.tpLotDetails.filter(data => data.OutwordTPId === objDetails.OutwordTPId);
    this.selectedTPDetails.tpDetails = objDetails;
    this.showTPDetailsModel = true;
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
