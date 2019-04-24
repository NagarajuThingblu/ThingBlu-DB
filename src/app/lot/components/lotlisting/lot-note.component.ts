import { AppCommonService } from './../../../shared/services/app-common.service';
import { AppConstants } from './../../../shared/models/app.constants';
import { DataService } from './../../../shared/services/DataService.service';
import { LotService } from './../../services/lot.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/api';
import { GlobalResources } from '../../../global resource/global.resource';
import { LotResources } from '../../lot.resource';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../../shared/models/user.model';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-lot-note',
  templateUrl: './lot-note.component.html',
  styleUrls: ['./lot-note.component.css']
})
export class LotNoteComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('Lot') Lot: any;
  @ViewChild('lotNoteForm') lotNoteForm;
  @Output() NoteSaved: EventEmitter<any> = new EventEmitter<any>();
  public lotNote: any = null;
  public msgs: Message[] = [];
  public globalResource: any;
  public lotNoteResource: any;
  public userRoles: any;
  public selectedLotComments: any = [];
  public _cookieService: UserModel;
  public LotInfo: any = {
    LotId: 0,
    showLotInventoryModal: false,
    GetInventoryList: [],
    GetLotDetails: [],
  };

  constructor(
    private lotService: LotService,
    private http: DataService,
    private cookieService: CookieService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.lotNoteResource = LotResources.getResources().en.lotNoteDetails;
    this.userRoles = AppConstants.getUserRoles;
    // console.log('lotnoteinputs', this.Lot);
    this.getLotNotes('');
    // this.getLotInventoryDetailsByLotId();
    // Modified by Devdan :: 30-Oct-2018 :: Naming Convention Change
    // this.LotInfo.LotId = this.Lot.lotId;
    this.LotInfo.LotId = this.Lot.lotId;
    this.loaderService.display(false);

  }

  saveLotNote(formModel) {
    if (String(formModel.value.lotnote).trim().length === 0) {
      // console.log(this.lotNoteForm);
      this.lotNoteForm.controls['lotnote'].setErrors({'whitespace': true});
      return;
    }
    const lotNoteDetailsForApi = {
      LotNotes: {
        LotId: this.Lot.lotId,
        Notes: formModel.value.lotnote,
        VirtualRoleId: 0
      }
    };

    if (formModel.valid) {
      // http call starts
      this.loaderService.display(true);
      this.lotService.saveLotNote(lotNoteDetailsForApi)
      .subscribe(
          (data) => {
            this.msgs = [];

            if (data === 'Success') {
              this.msgs.push({
                  severity: 'success',
                  summary: this.globalResource.applicationmsg ,
                  detail: this.lotNoteResource.notesavedsuccess
              });

              formModel.reset();
              // this.lotEntryForm.controls.get['growerlotno'].invalid = true;
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
            }

            // http call ends
            this.loaderService.display(false);
          },
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            // http call ends
            this.loaderService.display(false);
          },
          () => { this.getLotNotes('LotSaved'); }
      );
    } else {
      this.appCommonService.validateAllFields((formModel) as FormGroup);
    }
  }

  getLotNotes(Flag) {
    this.loaderService.display(true);
    // Modified by Devda :: 30-Oct-2018 :: Naming Convention change
    this.lotService.getLotNotes(this.Lot.lotId)
      .subscribe(
          data => {
            if (data !== 'No data found!') {
              this.selectedLotComments = data.Table1;
              this.Lot['GrowerLotNo'] = data.Table[0].GrowerLotNo;
              this.Lot['StrainName'] = data.Table[0].StrainName;
              this.Lot['StartWeight'] = data.Table[0].StartWeight;
              this.Lot['LotType'] = data.Table[0].LotType;
              this.Lot['IsTrimmed'] = data.Table[0].Trimmed;
              this.Lot['GrowerName'] = data.Table[0].GrowerName;
              this.Lot['LotCost'] = data.Table[0].Cost;
              this.Lot['TransferWeight'] = data.Table[0].BioTrackWeight;
              this.Lot['ShortageOverage'] = data.Table[0].ShortageOverage;
              this.Lot['BudMaterialWt'] = data.Table[0].BUD_WT;
              this.Lot['JointsMaterialWt'] = data.Table[0].JOINTS_WT;
              this.Lot['OilMaterilaWt'] = data.Table[0].OIL_WT;
              this.Lot['LotEntryDate'] = data.Table[0].CreatedDate;
              this.Lot['THC'] = data.Table[0].THC;
              this.Lot['CBD'] = data.Table[0].CBD;
              this.Lot['THCA'] = data.Table[0].THCA;
              this.Lot['CBDA'] = data.Table[0].CBDA;
              this.Lot['TotalTHC'] = data.Table[0].TotalTHC;
              this.Lot['GeneticsName'] = data.Table[0].GeneticsName;
              this.Lot['CostPerGram'] = data.Table[0].CostPerGram;
            }
          },
          error => { console.log(error); this.loaderService.display(false); },
          () => {
            if (Flag === 'LotSaved') {
              this.NoteSaved.emit(this.selectedLotComments);
            }
            this.loaderService.display(false);
          }
        );
  }

  getLotInventoryDetailsByLotId() {
    this.loaderService.display(false);
    this.lotService.getLotInventoryDetailsByLotId(this.Lot.lotId)
      .subscribe(
          data => {
            if (data !== 'No data found!') {
              this.LotInfo.GetInventoryList = null;
              // console.log(data);
              this.LotInfo.GetLotDetails = data.Table;
              // console.log(this.Lot.GetLotDetails);
             this.LotInfo.GetInventoryList  = data.Table1;
             this.loaderService.display(false);
            }
            if ( this.LotInfo.GetInventoryList.length ) {
                this.LotInfo.showLotInventoryModal = true;
             // return;
            }
          },
          error => { console.log(error); this.loaderService.display(false); },
          () => {
          }
        );
  }
  cancelLotNoteModal() {
    this.lotNoteForm.reset();
    this.Lot.showLotNoteModal = false;
    this.Lot.lotId = 0;
  }
  openLotInventoryDetails() {
    this.getLotInventoryDetailsByLotId();
     // this.LotInfo.showLotInventoryModal = true;
  }

}
