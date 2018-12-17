import { Component, OnInit, Input } from '@angular/core';
import { LotService } from '../../../lot/services/lot.service';
import { DataService } from '../../services/DataService.service';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../../services/loader.service';
import { AppCommonService } from '../../services/app-common.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { LotResources } from '../../../lot/lot.resource';
import { Alert } from 'selenium-webdriver';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-shrinkage-lot-close-popup',
  templateUrl: './shrinkage-lot-close-popup.component.html',
  providers: [ConfirmationService]
})
export class ShrinkageLotClosePopupComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('LotInfo') LotInfo: any;

  public getLotShrinkageList: any;
  public getLotShrinkageRawInvList: any;
  public getLotShrinkageSkewBudList: any;
  public getLotShrinkageSkewJointsList: any;
  public getLotShrinkageSkewOilList: any;
  public getLotDetails: any;
  public getLotProgressTasksDetails: any;
  public getLotProgressTrimTasksDetails: any = [];
  public globalResource: any;
  public inventoryType: any;
  public lotshrinkageResource: any;
  public showLotPorgresstasksModel: any = false;
  public showLotPorgressTrimtasksModel: any = false;
  constructor(private lotService: LotService,
    private http: DataService,
    private cookieService: CookieService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.lotshrinkageResource = LotResources.getResources().en.lotShrinkagedetails;
    this.loaderService.display(false);
    this.getLotInventoryDetailsByLotId();
  }

  getLotInventoryDetailsByLotId() {
    this.loaderService.display(false);
    this.lotService.getLotShrinkageDetailsByLotId(this.LotInfo.lotId)
      .subscribe(
        data => {
          if (data !== 'No data found!') {
            // console.log(data);
            this.getLotDetails = data.Table;
            this.LotInfo['LotId'] = data.Table[0].LotId;
            this.LotInfo['GrowerLotNo'] = data.Table[0].GrowerLotNo;
            this.LotInfo['StrainName'] = data.Table[0].StrainName;
            this.LotInfo['GrowerName'] = data.Table[0].GrowerName;
            this.LotInfo['LotType'] = data.Table[0].LotType;
            this.LotInfo['WasteWeight'] = data.Table[0].WasteWeight;
            this.LotInfo['StartWeight'] = data.Table[0].StartWeight;
            this.LotInfo['OrderProcessedWT'] = data.Table[0].OrderProcessedWT;
            // this.LotInfo['StrainName'] = data.Table[0].StrainName;
            // console.log(this.getLotDetails[0]);
            this.getLotShrinkageList = data.Table1;
            this.getLotShrinkageRawInvList = this.getLotShrinkageList.filter(x => x.InventoryType === 'RawInventory');
            this.getLotShrinkageSkewBudList = this.getLotShrinkageList.filter(x => x.InventoryType === 'SkewBUD');
            this.getLotShrinkageSkewJointsList = this.getLotShrinkageList.filter(x => x.InventoryType === 'SkewJoints');
            this.getLotShrinkageSkewOilList = this.getLotShrinkageList.filter(x => x.InventoryType === 'SkewOil');
            this.loaderService.display(false);
          }
        },
        error => { console.log(error); this.loaderService.display(false); },
        () => {
        }
      );
  }

  cancelLotShrnkageModel() {
    this.LotInfo.showLotShrnkageModel = false;
    this.LotInfo.lotId = 0;
  }

  cancelLotPorgresstasksModel() {
    this.showLotPorgresstasksModel = false;
  }
  cancelLotPorgressTrimtasksModel() {
    this.showLotPorgressTrimtasksModel = false;
  }

  saveShrinkageWeight(TaskDetails, WeightHeader, Weight, InventoryType) {
    const lotShrinkageDetailsForApi = {
      LotShrinkageDetails: {
        LotId: TaskDetails.LotId,
        InventoryType: TaskDetails.InventoryType,
        WeightType: TaskDetails.WeightType,
        WeightHeader: WeightHeader,
        Weight: Weight
      }
    };
    this.inventoryType = InventoryType;
    if (WeightHeader === 'UnAssignedWt' && InventoryType === 'Raw TrimInventory') {
      this.getInventorywiseOpenTaskListByLotId(TaskDetails.LotId, 'Raw TrimInventory');
      return;
    }

    if (WeightHeader === 'AssignedWt') {
      this.getInventorywiseOpenTaskListByLotId(TaskDetails.LotId, TaskDetails.InventoryType);
      return;
    }
    // http call starts
    if (lotShrinkageDetailsForApi.LotShrinkageDetails.Weight <= 0) {
      return;
    }
    this.confirmationService.confirm({
      message: this.lotshrinkageResource.Confirmmsg,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      key: 'MarkShrinkage',
      accept: () => {
        this.loaderService.display(true);
        this.lotService.saveLotShrinkageDetails(lotShrinkageDetailsForApi)
          .subscribe(
            (data) => {
              this.getLotInventoryDetailsByLotId();
              this.loaderService.display(false);
            },
            error => {
              this.loaderService.display(false);
            }
          );
      },
      reject: () => {
        // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
  }

  getInventorywiseOpenTaskListByLotId(LotId, InventoryType) {
    this.loaderService.display(false);
    this.lotService.getInventorywiseOpenTaskListByLotId(this.LotInfo.lotId, InventoryType)
      .subscribe(
        data => {
          if (data !== 'No data found!') {
            // console.log(data);
            this.getLotProgressTasksDetails = data.Table;
            this.loaderService.display(false);
          } else {
            this.getLotProgressTasksDetails = null;
          }
          if (this.getLotProgressTasksDetails.length) {
            this.showLotPorgresstasksModel = true;
            return;
          }
        },
        error => { console.log(error); this.loaderService.display(false); },
        () => {
        }
      );
  }


  saveShrinkageWeightForTrimming(TaskDetails, WeightHeader, Weight, InventoryType) {
    const lotShrinkageDetailsForApi = {
      LotShrinkageDetails: {
        LotId: TaskDetails.LotId,
        InventoryType: TaskDetails.InventoryType,
        WeightType: TaskDetails.WeightType,
        WeightHeader: WeightHeader,
        Weight: Weight
      }
    };
    this.inventoryType = InventoryType;
    this.inventoryType = 'Raw Inventory';
    if (WeightHeader === 'UnAssignedWt') {
      this.lotService.getInventorywiseOpenTaskListByLotId(this.LotInfo.lotId, InventoryType)
        .subscribe(
          data => {
            if (data !== 'No data found!') {
              // console.log(data);
              this.getLotProgressTrimTasksDetails = data.Table;
              this.loaderService.display(false);
            } else {
              this.getLotProgressTrimTasksDetails = [];
            }
            if (this.getLotProgressTrimTasksDetails.length) {
              this.showLotPorgressTrimtasksModel = true;
              return;
            } else {
              // http call starts
              if (lotShrinkageDetailsForApi.LotShrinkageDetails.Weight <= 0) {
                return;
              }
              this.confirmationService.confirm({
                message: this.lotshrinkageResource.Confirmmsg,
                header: 'Confirmation',
                icon: 'fa fa-exclamation-triangle',
                key: 'MarkTrimShrinkage',
                accept: () => {
                  this.loaderService.display(true);
                  this.lotService.saveLotShrinkageDetails(lotShrinkageDetailsForApi)
                    .subscribe(
                      (data1) => {
                        this.getLotInventoryDetailsByLotId();
                        this.loaderService.display(false);
                      },
                      error => {
                        this.loaderService.display(false);
                      }
                    );
                },
                reject: () => {
                  // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
                }
              });
            }
          },
          error => { console.log(error); this.loaderService.display(false); },
          () => {
          }
        );
    }
  }

}



