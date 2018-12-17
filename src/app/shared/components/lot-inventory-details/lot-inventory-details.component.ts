import { Component, OnInit, Input } from '@angular/core';
import { LotService } from '../../../lot/services/lot.service';
import { DataService } from '../../services/DataService.service';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../../services/loader.service';
import { AppCommonService } from '../../services/app-common.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { LotResources } from '../../../lot/lot.resource';

@Component({
  selector: 'app-lot-inventory-details',
  templateUrl: './lot-inventory-details.component.html',
})
export class LotInventoryDetailsComponent implements OnInit {
// tslint:disable-next-line:no-input-rename
@Input('LotInfo') LotInfo: any;
public getInventoryList: any;
public getLotDetails: any;
public globalResource: any;
public lotinventoryResource: any;
  constructor(private lotService: LotService,
     private http: DataService,
     private cookieService: CookieService,
     private loaderService: LoaderService,
     private appCommonService: AppCommonService) { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.lotinventoryResource = LotResources.getResources().en.lotinventorydetails;
    this.getLotDetails = this.LotInfo.GetLotDetails[0];
    this.getInventoryList =  this.LotInfo.GetInventoryList;
    this.loaderService.display(false);

   // console.log(this.LotInfo);
  }
  cancelLotNoteModal() {
    this.LotInfo.showLotInventoryModal = false;
    this.LotInfo.LotId = 0;
  }

}
