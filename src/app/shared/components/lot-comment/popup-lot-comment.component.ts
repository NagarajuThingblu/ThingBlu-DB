import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '_debugger';
import { LoaderService } from './../../services/loader.service';
import { LotService } from './../../../lot/services/lot.service';
import { GlobalResources } from './../../../global resource/global.resource';
import { LotResources } from './../../../lot/lot.resource';
import { AppConstants } from './../../models/app.constants';

@Component({
  selector: 'app-popup-lot-comment',
  templateUrl: './popup-lot-comment.component.html',
  styleUrls: ['./popup-lot-comment.component.css']
})
export class PopupLotCommentComponent implements OnInit {
  @Input() Lot: any;
  @Output() CommentSaved: EventEmitter<any> = new EventEmitter<any>();

  public showLotCommentModal = false;
  public lotComments: any = [];
  public lotDetails: any = {};

  public msgs: Message[] = [];
  public globalResource: any;
  public lotNoteResource: any;
  public userRoles: any;

  public lotInfo: any = {
    lotId: 0,
    showLotInventoryModal: false
  };

  constructor(
    private loaderService: LoaderService,
    private lotService: LotService
  ) { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.lotNoteResource = LotResources.getResources().en.lotNoteDetails;
    this.userRoles = AppConstants.getUserRoles;
    // console.log('lotnoteinputs', this.Lot);
    this.getLotComments('');
    // this.GetLotInventoryDetailsByLotId();
    this.lotInfo.lotId = this.Lot.lotId ? this.Lot.lotId : this.Lot.LotId;
  }

  getLotComments(Flag) {
    this.loaderService.display(true);
    this.lotService.getLotNotes(this.Lot.lotId ? this.Lot.lotId : this.Lot.LotId)
      .subscribe(
          data => {
            if (data !== 'No data found!') {
              this.lotComments = data.Table1;
              this.lotDetails['GrowerLotNo'] = data.Table[0].GrowerLotNo;
              this.lotDetails['StrainName'] = data.Table[0].StrainName;
              // this.LotDetails['StartWeight'] = data.Table[0].StartWeight;
              // this.LotDetails['LotType'] = data.Table[0].LotType;
              // this.LotDetails['IsTrimmed'] = data.Table[0].Trimmed;
              // this.LotDetails['GrowerName'] = data.Table[0].GrowerName;
              // this.LotDetails['LotCost'] = data.Table[0].Cost;
              // this.LotDetails['TransferWeight'] = data.Table[0].BioTrackWeight;
              // this.LotDetails['ShortageOverage'] = data.Table[0].ShortageOverage;
              // this.LotDetails['BudMaterialWt'] = data.Table[0].BUD_WT;
              // this.LotDetails['JointsMaterialWt'] = data.Table[0].JOINTS_WT;
              // this.LotDetails['OilMaterilaWt'] = data.Table[0].OIL_WT;
              // this.LotDetails['LotEntryDate'] = data.Table[0].CreatedDate;
              // this.LotDetails['THC'] = data.Table[0].THC;
              // this.LotDetails['CBD'] = data.Table[0].CBD;
              // this.LotDetails['THCA'] = data.Table[0].THCA;
              // this.LotDetails['CBDA'] = data.Table[0].CBDA;
              // this.LotDetails['TotalTHC'] = data.Table[0].TotalTHC;
              // this.LotDetails['GeneticsName'] = data.Table[0].GeneticsName;
            }
          },
          error => { console.log(error); this.loaderService.display(false); },
          () => {
            if (Flag === 'LotSaved') {
              this.CommentSaved.emit(this.lotComments);
            }
            this.loaderService.display(false);
          }
        );
  }

  cancelLotCommentModal() {
    this.Lot.showLotCommentModal = false;
    this.Lot.lotId = 0;
  }
}
