import { Title } from '@angular/platform-browser';
import { LotResources } from './../../lot.resource';
import { Component, OnInit } from '@angular/core';
import { LotService } from '../../services/lot.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { LoaderService } from '../../../shared/services/loader.service';
import { QuestionBase } from '../../../shared/models/question-base';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { ConfirmationService, Message } from '../../../../../node_modules/primeng/api';
import { UserModel } from '../../../shared/models/user.model';
import { AppConstants } from '../../../shared/models/app.constants';
import { AppCommonService } from '../../../shared/services/app-common.service';

@Component({
  moduleId: module.id,
  selector: 'app-lotlisting',
  templateUrl: 'lotlisting.component.html',
  styleUrls: ['lotlisting.component.css']
})
export class LotlistingComponent implements OnInit {

  public allLotsByClient: any;
  public globalResource: any;
  public lotListResource: any;
  public userRole: any;
  paginationValues: any;
  public msgs: Message[] = [];
  event: any;
  questions: QuestionBase<any>[];
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showEditLotModal: false,
    showLotShrnkageModel: false,
    showLotCommentModal: false
  };

  public lotEditDetails: any;
  public _cookieService: UserModel;
  constructor(
    private lotService: LotService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private appCommonService: AppCommonService,
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
    this.questions = this.route.snapshot.data.data.sort((a, b) => a.order - b.order);
  }
  onPageChange(e) {
    this.event = e;
  }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    // Added By Bharat T on 13th-July-2018
    this.lotListResource = LotResources.getResources().en.lotlisting;
    this.titleService.setTitle(this.lotListResource.title);
    // End of Added By Bharat T on 13th-July-2018
    this.userRole = this._cookieService.UserRole;
    this.getAllLotListByClient();
  }
  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
    this.loaderService.display(false);
  }

  showLotShinkagePopup(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotShrnkageModel = true;
    this.loaderService.display(false);
  }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

  editLot(LotId) {
    this.getLotDetailsForEdit(LotId);
  }

  deleteLot(LotId) {
    this.confirmationService.confirm({
      message: this.lotListResource.deleteConfirm,
      header: this.globalResource.applicationmsg,
      icon: 'fa fa-trash',
      accept: () => {
        this.prscrLotDelete(LotId);
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }

  onNoteSave(lotComments) {
    this.getAllLotListByClient();
  }

  getAllLotListByClient() {
    this.loaderService.display(true);
    this.lotService.getAllLotListByClient().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allLotsByClient = data;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allLotsByClient.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allLotsByClient.length;
          }
       } else {
        this.allLotsByClient = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All Lot List By Client complete'));
  }

  // Added By Bharat T on 13th-July-2018
  prscrLotDelete(LotId) {
    this.loaderService.display(true);
    this.lotService.prscrLotDelete(LotId).subscribe(
      data => {
      if (String(data[0].ResultKey).toLocaleUpperCase() === 'NODELETE') {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data[0].ResultMessage });
      } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
      } else {
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: this.lotListResource.lotdeletesuccess });

        this.getAllLotListByClient();
      }
      this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Prscr Lot Delete complete')
    );
  }

  getLotDetailsForEdit(LotId) {
    this.loaderService.display(true);
    this.lotService.getPrscrLotDetailsByLotId(LotId).subscribe(
      data => {
       if (data !== 'No data found!') {
         if (String(data[0].ResultKey).toLocaleUpperCase() === 'LOTDELETED') {
           this.msgs = [];
           this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: data[0].ResultMessage });

           this.getAllLotListByClient();
           return;
         }
          this.lotEditDetails = data[0];
          this.lotInfo.lotId = LotId;
          this.lotInfo.showEditLotModal = true;
       } else {
        this.lotEditDetails = [];
        this.lotInfo.lotId = LotId;
        this.lotInfo.showEditLotModal = true;
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get Lot Details For Edit complete')
    );
  }

  onLotUpdate(data) {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: data.ResultMessage });

    this.getAllLotListByClient();
    this.lotInfo.showEditLotModal = false;
  }
  // End of  Added By Bharat T on 13th-July-2018
}
