import { TaskCommonService } from './../../../../services/task-common.service';
import { OrderService } from './../../../../../order/service/order.service';
import { DropdwonTransformService } from './../../../../../shared/services/dropdown-transform.service';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TaskResources } from '../../../../task.resources';
import { GlobalResources } from '../../../../../global resource/global.resource';
import { AppConstants } from '../../../../../shared/models/app.constants';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { UserModel } from '../../../../../shared/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValuesService } from '../../../../../shared/services/dropdown-values.service';
import { SelectItem, Message, ConfirmationService } from 'primeng/api';
import { LoaderService } from '../../../../../shared/services/loader.service';
import * as _ from 'lodash';
import { RefreshService } from '../../../../../dashboard/services/refresh.service';

@Component({
  moduleId: module.id,
  selector: 'app-tube-brand-label',
  templateUrl: 'tube-brand-label.component.html'
})
export class TubeBrandLabelComponent implements OnInit, OnDestroy {
  TUBELABELING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;

  @Input() TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();
  @Input() AssignRole: any;
  @Input() LabelQty: any; // add ready for pkg qty :: 08-april-2019

  public assignTaskResources: any;
  public globalResource: any;
  public taskStatus: any;
  public userRoles: any;
  public defaultDate: Date;
  public _cookieService: UserModel;
  public taskId: any;
  public taskType: any;

  private globalData = {
    employees: [],
    orderDetails: []
  };

  private _cookieOrderPkgData = {
    orderId: null,
    strainId: null,
    pkgTypeId: null,
    unitValue: null,
    itemQty: null
  };

  public msgs: Message[] = [];

  public questionForm: FormGroup;
  // public Lots: SelectItem[];  // Commented by Devdan :: 26-Oct-2018 :: Unused
  public employees: SelectItem[];
  public priorities: SelectItem[];

  public allOrders: any;
  public allOrderNos: any;
  public orderObject: any;
  public showToManager = false;
  public lotMap = new Map<any, any>();

  public taskReviewModel: any;
  public showLotSelectionModel = false;
  public showLotCompletionModal = false;
  public showProductTypeLotDetailsModal = false;
  public showMixPkgDetailsModal = false;
  public productTypeLotDetails: any;

  public productTypeMixPkgsDetails: any = [];
  public LotDetails: any;

  public assignRole: any;

  // Joint Production Dashboard Redirection Details
  public prodDBRouteParams: any;
  public readonlyEmployeeFlag: Boolean = false;

  public lotBalancedQtyMap = new Map<any, any>();
  public productTypeQtyMap = new Map<any, any>();

  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  public orderDetails: any;
  public orderDetailsBS: any;
  public orderDetailsBS_filteredData: any = [];

  public selectedLotsArray: any[] = [];
  public selectedMixLotsArray: any[] = [];
  public completedLotArray: any[] = [];

  public selLotBrandStrainRow = {
    BrandId: null,
    StrainId: null,
    BrandName: null,
    StrainName: null,
    RequireWt: null,
    selectedRowIndex: null,
    combinationTotalAssignedQty: null,
    GeneticsId: null,
    GeneticsName: null,
    pkgSizeRequiredQtyArr: []
  };

  public completionParameters: any = [];
  public completionLots: any = [];
  public uniqueBrandStrain: any = [];
  public disableCompletedQtyArr: any = [];

  public showPastDateLabel = false;

  public brandStrainLots: any;
  public lotListForm: FormGroup;

  public selectedProductTypeDetails: any;

  public tempLabelQty = 0;

  // Added by Devdan :: 12-Oct-2018
  taskTypeId: any;
  readonlyFlag: boolean;
  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;
  constructor(
    private titleService: Title,
    private appCommonService: AppCommonService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private orderService: OrderService,
    private taskCommonService: TaskCommonService,
    private loaderService: LoaderService,
    private confirmationService: ConfirmationService,
    private refreshService: RefreshService

  ) {
    this._cookieService = this.appCommonService.getUserProfile();
    this.prodDBRouteParams = this.appCommonService.prodDBRouteParams;
  }

  ngOnInit() {

    // for navigate joint dashboard if employee assign task :: 20-Mar-2019 :: swapnil
    this.assignRole = this.AssignRole ? this.AssignRole : null;

    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.titleService.setTitle(this.assignTaskResources.tubeBrandLabelTitle);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);

    this.route.params.forEach((urlParams) => {
      this.taskId = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    if (this.PageFlag.page !== 'TaskAction') {

      this.TaskModel.TUBELABELING = {
        lotno: null,
        brand: null,
        strain: null,
        startdate: this.TaskModel.startdate,
        enddate: null,
        endtime: null,
        esthrs: null,
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: null,
        orderno: null
      };

      this.questionForm = this.fb.group({
        questions: this.fb.array([]),
        mixPkgDetailsArr: this.fb.array([])
      });


      this.getTubeLabelOrders();

      this.TUBELABELING = new FormGroup({
        'lotno': new FormControl(''),
        'brand': new FormControl(''),
        'strain': new FormControl(''),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('', Validators.compose([Validators.required])),
        'estimatedenddate': new FormControl(''),
        // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl(''),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        'orderno': new FormControl('', Validators.required),
        tubeOrderPackets: this.fb.array([]),
      });

      this.employeeListByClient();

      this.priorities = [
        { label: 'Normal', value: 'Normal' },
        { label: 'Important', value: 'Important' },
        { label: 'Critical', value: 'Critical' }
      ];

      this.ParentFormGroup.addControl('TUBELABELING', this.TUBELABELING);
    } else {
      this.lotListForm = this.fb.group({
        completedLots: new FormArray([])
      });

      // Lot Mixing
      this.questionForm = this.fb.group({
        questions: this.fb.array([]),
        mixPkgDetailsArr: this.fb.array([])
      });
      // End of Lot Mixing

      this.uniqueBrandStrain = this.removeDuplicatesByName(this.TaskModel.AssignQtyDetails);

      this.taskReviewModel = {
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
      };

      // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
      this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }

      this.completionForm = this.fb.group({
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        completeParamArr: this.fb.array(this.TaskModel.AssignQtyDetails.map(this.generateCompletionParams(this.fb)))
        // companies: this.fb.array([])
      });

      if (this.TaskModel.TaskStatus === this.taskStatus.InProcess || this.TaskModel.TaskStatus === this.taskStatus.Paused) {
        this.calculateMixLotQty([], 'ALL');
      }

      this.reviewForm = this.fb.group({
        ActHrs: new FormControl(null),
        ActMins: new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ActSecs: new FormControl({ value: null, disabled: this.isRActSecsDisabled }, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        reviewParamArr: this.fb.array(this.TaskModel.AssignQtyDetails.map(this.generateReviewParams(this.fb)))
      });

      if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.calculateMixLotQtyForReview([], 'ALL');
      }
    }
  }

  get questions(): FormArray {
    return this.questionForm.get('questions') as FormArray;
  }

  get mixPkgDetailsArr(): FormArray {
    return this.questionForm.get('mixPkgDetailsArr') as FormArray;
  }

  get completeParamArr(): FormArray {
    return this.completionForm.get('completeParamArr') as FormArray;
  }

  get reviewParamArr(): FormArray {
    return this.reviewForm.get('reviewParamArr') as FormArray;
  }

  get tubeOrderPackets(): FormArray {
    // return this.TUBELABEL.get('tubeOrderPackets') as FormArray;
    return (this.ParentFormGroup.get('TUBELABELING') as FormGroup).get('tubeOrderPackets') as FormArray;
  }

  lotInnerFormArray(comp): FormArray {
    return comp.get('LotDetails') as FormArray;
  }

  // Lot Mixing Function
  mixLotDetailsArr(comp): FormArray {
    return comp.get('MixLotDetails') as FormArray;
  }

  ngOnDestroy() {

    this.appCommonService.prodDBRouteParams = null;
    this.prodDBRouteParams = null;

    this.lotBalancedQtyMap.clear();
    this.productTypeQtyMap.clear();
    this.lotMap.clear();

    // localStorage.removeItem('selectedMixLotsArray');
    // localStorage.removeItem('selectedLotsArray');

    this.appCommonService.removeItem('selectedMixLotsArray');
    this.appCommonService.removeItem('selectedLotsArray');
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr((size * -1), size);
  }

  getAssignedQtyDetails(rowData: any, flag: string) {
    if (flag === 'lot') {
      return this.TaskModel.AssignQtyLotDetails.filter(data => data.ProductTypeId === rowData.ProductTypeId);
    } else {
      return this.TaskModel.MixPkgQtyDetails.filter(data => data.ProductTypeId === rowData.ProductTypeId);
    }
  }

  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = [];
        this.globalData.employees = data;
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get all Employees by client complete'));
  }

  getTubeLabelOrders() {
    // Added by Devdan :: 20-Oct-2018
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }
    this.orderService.getTubeLabelOrders().subscribe(
      data => {
        if (data !== 'No data found!') {
          this.allOrders = data;
          this.allOrderNos = this.dropdwonTransformService.transform(data, 'OrderRefId', 'OrderId', '-- Select --');

          // Populate strain & lot by default. Joint production dashboard functionality
          if (this.prodDBRouteParams) {
            this.TaskModel.TUBELABELING.orderno = this.prodDBRouteParams.OrderId;
            this.TaskModel.TUBELABELING.employee = this._cookieService.EmpId;

            this._cookieOrderPkgData.orderId    = this.prodDBRouteParams.OrderId;
            this._cookieOrderPkgData.strainId   = this.prodDBRouteParams.StrainId;
            this._cookieOrderPkgData.pkgTypeId  = this.prodDBRouteParams.PkgTypeId;
            this._cookieOrderPkgData.unitValue  = this.prodDBRouteParams.UnitValue;
            this._cookieOrderPkgData.itemQty    = this.prodDBRouteParams.ItemQty;

            // console.log('this.prodDBRouteParams', this.prodDBRouteParams);

            if (String(this._cookieService.UserRole) === String(this.userRoles.Employee)) {
              this.readonlyEmployeeFlag = true;
            }
            this.readonlyFlag = true;
            (this.ParentFormGroup.get('TUBELABELING') as FormGroup).get('orderno').patchValue(this.TaskModel.TUBELABELING.orderno);
            this.onOrderChange();
          }
        }

        // Added by Devdan :: 19-Oct-2018 :: Load Stain Change Event
        if (this.taskTypeId > 0) {
          this.setFormInEditMode();
          this.onOrderChange();
          this.readonlyFlag = true;
        }

      },
      error => { console.log(error); },
    );
  }

  getPkgMixLotDetails(MixPkgId) {
    // return this.globalData.orderDetails['Table2'].filter(data => data.MixPkgId === MixPkgId);
    return this.TaskModel.MixPkgQtyDetails.filter(data => data.MixPkgId === MixPkgId);
  }

  onOrderChange() {
    this.orderObject = this.allOrders.filter(result => result.OrderId === this.TaskModel.TUBELABELING.orderno)[0];
    this.selectedLotsArray = [];

    // localStorage.removeItem('selectedLotsArray');
    this.appCommonService.removeItem('selectedLotsArray');

    if (this._cookieOrderPkgData.orderId > 0) {
      this.getSelectedOrderDetails(this.TaskModel.TUBELABELING.orderno, this._cookieOrderPkgData.strainId,
        this._cookieOrderPkgData.pkgTypeId, this._cookieOrderPkgData.unitValue, this._cookieOrderPkgData.itemQty);
    }
    // this.getSelectedOrderDetails(this.TaskModel.TUBELABELING.orderno);
  }

  generateCompletionParams(fb: FormBuilder) {
    return (object, index) => {
      let completedBox, packageCodeBox;
      let completionFormGroup: FormGroup;

      this.disableCompletedQtyArr[index] = Number(object.AssignedQty);
      completedBox = [object.AssignedQty, Validators.max(object.AssignedQty)];
      packageCodeBox = [null];

      completionFormGroup = fb.group({
        uniqueId: index,
        completedQty: completedBox,
        RawSupId: object.RawSupId,
        StrainId: object.StrainId,
        PkgTypeId: object.PkgTypeId,
        UnitValue: object.UnitValue,
        ItemQty: object.ItemQty,
        ProductTypeId: object.ProductTypeId,
        AssignedQty: object.AssignedQty,
        packageCode: packageCodeBox,
        LotDetails: this.fb.array(
          this.TaskModel.AssignQtyLotDetails
            .filter(result =>
              // result.ProductTypeId === object.ProductTypeId
              result.GeneticsId === object.GeneticsId &&
              result.PkgTypeId === object.PkgTypeId &&
              result.UnitValue === object.UnitValue &&
              result.ItemQty === object.ItemQty
            )
            .map((object1, index1) => {
              return this.createLotControls(this.fb, object1, index1, 'Complete');
            })
        ),
        MixLotDetails: this.fb.array(
          this.TaskModel.MixPkgQtyDetails
            .filter(result =>
              // result.ProductTypeId === object.ProductTypeId
              result.GeneticsId === object.GeneticsId &&
              result.PkgTypeId === object.PkgTypeId &&
              result.UnitValue === object.UnitValue &&
              result.ItemQty === object.ItemQty
            )
            .map((object1, index1) => {
              return this.createMixPkgControls(this.fb, object1, index1, 'Complete');
            })
        )
      });
      return completionFormGroup;
    };
  }

  generateReviewParams(fb: FormBuilder) {
    return (object, index) => {
      let reviewBox;

      if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.disableCompletedQtyArr[index] = 0;
        this.disableCompletedQtyArr[index] = Number(object.ProcessedQty);
      }

      reviewBox = [this.disableCompletedQtyArr[index]];

      return fb.group({
        uniqueId: index,
        reviewedQty: reviewBox,
        RawSupId: object.RawSupId,
        StrainId: object.StrainId,
        PkgTypeId: object.PkgTypeId,
        UnitValue: object.UnitValue,
        ItemQty: object.ItemQty,
        ProductTypeId: object.ProductTypeId,
        AssignedQty: object.AssignedQty,
        packageCode: object.PackageCode,
        LotDetails: this.fb.array(

          this.TaskModel.ReviewQtyLotDetails
            .filter(result => result.ProductTypeId === object.ProductTypeId)
            .map((object1, index1) => {
              return this.createLotControls(this.fb, object1, index1, 'Review');
            })
        ),
        MixLotDetails: this.fb.array(
          this.TaskModel.MixPkgQtyDetails
            .filter(result => result.ProductTypeId === object.ProductTypeId
            )
            .map((object1, index1) => {
              return this.createMixPkgControls(this.fb, object1, index1, 'Review');
            })
        )
      });
    };
  }

  // Mix Lot Total Qty
  calculateMixLotQty(question, Flag) {
    if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {

    } else if (String(Flag).toLocaleUpperCase() === 'ALL') {

      this.lotMap.clear();
      this.lotBalancedQtyMap.clear();
      this.productTypeQtyMap.clear();
      // Iterate throught each product type
      this.completeParamArr.controls.forEach((productTypeItem, parentIndex) => {
        // Iterate throught every lot in above product type
        (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
          if (this.lotMap.has(lotDetails.value.LotUniqueId)) {
            this.lotMap.set(lotDetails.value.LotUniqueId,
              Number(this.lotMap.get(lotDetails.value.LotUniqueId)) +
              (Number(lotDetails.value.lotCompletedQty))
            );

            this.lotBalancedQtyMap.set(lotDetails.value.LotUniqueId,
              Number(lotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(lotDetails.value.LotUniqueId)));
          } else {
            this.lotMap.set(lotDetails.value.LotUniqueId,
              (Number(lotDetails.value.lotCompletedQty))
            );

            this.lotBalancedQtyMap.set(lotDetails.value.LotUniqueId,
              Number(lotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(lotDetails.value.LotUniqueId)));
          }

          if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(lotDetails.value.lotCompletedQty)));
          } else {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              Number(lotDetails.value.lotCompletedQty));
          }
        });

        // Mix Pkg
        (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach(mixLotDetails => {
          if (this.lotMap.has(mixLotDetails.value.MixPkgId)) {
            this.lotMap.set(mixLotDetails.value.MixPkgId,
              Number(this.lotMap.get(mixLotDetails.value.MixPkgId)) +
              (Number(mixLotDetails.value.mixPkgCompletedQty))
            );

            this.lotBalancedQtyMap.set(mixLotDetails.value.MixPkgId,
              Number(mixLotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(mixLotDetails.value.MixPkgId)));
          } else {
            this.lotMap.set(mixLotDetails.value.MixPkgId,
              (Number(mixLotDetails.value.mixPkgCompletedQty))
            );

            this.lotBalancedQtyMap.set(mixLotDetails.value.MixPkgId,
              Number(mixLotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(mixLotDetails.value.MixPkgId)));
          }

          if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(mixLotDetails.value.mixPkgCompletedQty)));
          } else {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              Number(mixLotDetails.value.mixPkgCompletedQty));
          }
        });

        // End Mix Pkg
      });
    }
  }
  // End of Mix Lot Total Qty

  // Mix Lot Total Qty For Review
  calculateMixLotQtyForReview(question, Flag) {
    if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {

    } else if (String(Flag).toLocaleUpperCase() === 'ALL') {

      this.lotMap.clear();
      this.lotBalancedQtyMap.clear();
      this.productTypeQtyMap.clear();
      // Iterate throught each product type
      this.reviewParamArr.controls.forEach((productTypeItem, parentIndex) => {
        // Iterate throught every lot in above product type
        (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
          if (this.lotMap.has(lotDetails.value.LotUniqueId)) {
            this.lotMap.set(lotDetails.value.LotUniqueId,
              Number(this.lotMap.get(lotDetails.value.LotUniqueId)) +
              (Number(lotDetails.value.lotReviewedQty))
            );

            this.lotBalancedQtyMap.set(lotDetails.value.LotUniqueId,
              Number(lotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(lotDetails.value.LotUniqueId)));
          } else {
            this.lotMap.set(lotDetails.value.LotUniqueId,
              (Number(lotDetails.value.lotReviewedQty))
            );

            this.lotBalancedQtyMap.set(lotDetails.value.LotUniqueId,
              Number(lotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(lotDetails.value.LotUniqueId)));
          }

          if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(lotDetails.value.lotReviewedQty)));
          } else {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              Number(lotDetails.value.lotReviewedQty));
          }
        });

        // Mix Pkg
        (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach(mixLotDetails => {
          if (this.lotMap.has(mixLotDetails.value.MixPkgId)) {
            this.lotMap.set(mixLotDetails.value.MixPkgId,
              Number(this.lotMap.get(mixLotDetails.value.MixPkgId)) +
              (Number(mixLotDetails.value.mixPkgReviewedQty))
            );

            this.lotBalancedQtyMap.set(mixLotDetails.value.MixPkgId,
              Number(mixLotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(mixLotDetails.value.MixPkgId)));
          } else {
            this.lotMap.set(mixLotDetails.value.MixPkgId,
              (Number(mixLotDetails.value.mixPkgReviewedQty))
            );

            this.lotBalancedQtyMap.set(mixLotDetails.value.MixPkgId,
              Number(mixLotDetails.value.AssignedTubeQty) - Number(this.lotMap.get(mixLotDetails.value.MixPkgId)));
          }

          if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(mixLotDetails.value.mixPkgReviewedQty)));
          } else {
            this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
              Number(mixLotDetails.value.mixPkgReviewedQty));
          }
        });

        // End Mix Pkg
      });
    }
  }
  // End of Mix Lot Total Qty For Review

  calculateTotalCompletedQty(index, comp, lot) {
    this.calculateMixLotQty([], 'ALL');

    if (lot.value.MixPkgId) {
      if (Number(this.lotMap.get(lot.value.MixPkgId)) > Number(lot.value.AssignedTubeQty)) {
        this.msgs = [];
        this.msgs.push({
          severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.compqtygreaterassignqty
        });

        lot.controls['mixPkgCompletedQty'].setErrors({ 'GreaterMixPkgQty': true });
      }

      const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
        .get('completedQty');
      packagesCompletedBox.markAsTouched();
      packagesCompletedBox.updateValueAndValidity();
    } else {
      if (Number(this.lotMap.get(lot.value.LotUniqueId)) > Number(lot.value.AssignedTubeQty)) {
        this.msgs = [];
        this.msgs.push({
          severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.compqtygreaterassignqty
        });

        lot.controls['lotCompletedQty'].setErrors({ 'GreaterLotQty': true });
      }

      const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
        .get('completedQty');
      packagesCompletedBox.markAsTouched();
      packagesCompletedBox.updateValueAndValidity();
    }
  }

  calculateTotalReviewedQty(index, comp, lot) {
    this.calculateMixLotQtyForReview([], 'ALL');

    if (Number(this.lotMap.get(lot.value.LotUniqueId)) > Number(lot.value.AssignedJointsQty)) {
      this.msgs = [];
      this.msgs.push({
        severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.assignTaskResources.compqtygreaterassignqty
      });

      lot.controls['lotReviewedQty'].setErrors({ 'GreaterLotQty': true });
    }

    const packagesCompletedBox = (<FormGroup>this.completionForm.get('reviewParamArr.' + index))
      .get('reviewedQty');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
  }

  compQtyOnChange(index, formArrayObj) {
    // (formArrayObj.get('LotDetails') as FormArray).reset();

    if (formArrayObj.get('completedQty').valid) {

      if (this.disableCompletedQtyArr[index] !== 0) {
        formArrayObj.setControl('LotDetails', this.fb.array([]));
        formArrayObj.setControl('MixLotDetails', this.fb.array([]));

        this.TaskModel.AssignQtyLotDetails
          .filter(result =>
            // result.ProductTypeId === this.TaskModel.AssignQtyDetails[index].ProductTypeId &&
            result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId &&
            result.PkgTypeId === this.TaskModel.AssignQtyDetails[index].PkgTypeId &&
            result.UnitValue === this.TaskModel.AssignQtyDetails[index].UnitValue &&
            result.ItemQty === this.TaskModel.AssignQtyDetails[index].ItemQty
          )
          .map((object, index1) => {
            (formArrayObj.get('LotDetails') as FormArray).push(this.createLotControls(this.fb, object, index1, 'Complete'));
          });

        this.calculateMixLotQty([], 'ALL');
      } else {
        this.mixLotDetailsArr(formArrayObj).controls.forEach((control, childIndex) => {
          this.selectedMixLotsArray[index + '' + childIndex] = [];
        });
        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // localStorage.setItem('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));
        this.appCommonService.setLocalStorage('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));
        // formArrayObj.setControl('LotDetails', this.fb.array([]));

        this.calculateMixLotQty([], 'ALL');
      }
    }
  }

  // To show completion or review details of selected product type on action details page
  getLotsInfo(details) {
    this.showProductTypeLotDetailsModal = true;

    this.productTypeLotDetails = this.TaskModel.ReviewQtyLotDetails
      .filter(result =>
        result.ProductTypeId === details.ProductTypeId
        // result.StrainId === details.StrainId &&
        // result.PkgTypeId === details.PkgTypeId &&
        // result.UnitValue === details.UnitValue &&
        // result.ItemQty === details.ItemQty
      );

    this.LotDetails = this.TaskModel.AssignQtyDetails.filter(r =>
      // r.StrainId === details.StrainId &&
      // r.PkgTypeId === details.PkgTypeId &&
      // r.UnitValue === details.UnitValue &&
      // r.ItemQty === details.ItemQty
      r.ProductTypeId === details.ProductTypeId
    )[0];

    this.productTypeMixPkgsDetails['PkgDetails'] = _.uniqBy(
      this.TaskModel.MixPkgQtyDetails.filter(r =>
        // r.StrainId === details.StrainId &&
        // r.PkgTypeId === details.PkgTypeId &&
        // r.UnitValue === details.UnitValue &&
        // r.ItemQty === details.ItemQty
        r.ProductTypeId === details.ProductTypeId
      ),
      'MixPkgId');
  }

  displayLotDetails(orderDetail) {
    return this.TaskModel.AssignQtyLotDetails.filter(result => result.RawSupId === orderDetail.RawSupId && result.StrainId === orderDetail.StrainId);
  }


  getMixLotDetails(pkgItemDetails, value) {
    if (value === 1) {
      return this.globalData.orderDetails['Table2'].filter(item =>
        item.MixPkgId === pkgItemDetails.MixPkgId
      );
    } else if (value === 2) {
      return this.globalData.orderDetails['Table2'].filter(item =>
        item.MixPkgId === pkgItemDetails.value.mixPkgId
      );
    }
  }

  assignQtyOnChange(jointsOrderPacket, maxValue) {
    const assignQtyBox = jointsOrderPacket.get('assignQty');

    const validators = assignQtyBox.value ? Validators.compose([null, Validators.max(maxValue)]) : null;
    assignQtyBox.setValidators(validators);
    assignQtyBox.updateValueAndValidity();
  }

  getSelectedOrderDetails(OrderId, strainId, pkgTypeId, unitValue, itemQty) {
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }

    const selectedOrderDetails = {
      OrderId: OrderId,
      EditMode: 'TUBE',
      TaskId: this.taskId,
      StrainId: strainId,
      PkgTypeId: pkgTypeId,
      UnitValue: unitValue,
      ItemQty: itemQty,
      ViewOrdersBy: this.prodDBRouteParams.viewOrdersBy,
      BeginDate: new Date(this.prodDBRouteParams.beginDate).toLocaleDateString().replace(/\u200E/g, ''),
      EndDate: new Date(this.prodDBRouteParams.endDate).toLocaleDateString().replace(/\u200E/g, '')
    };
    // Modified by Dev :: Temporary Change
    // this.orderService.getSelectedTubeLabelingOrderDetails(OrderId, 'TUBE', editmode, this.taskId, strainId, pkgTypeId, unitValue, itemQty).subscribe(
      this.orderService.getSelectedTubeLabelingOrderDetails(selectedOrderDetails)
      .subscribe(
      data => {
        if (data !== 'No data found!') {
          this.globalData.orderDetails = data;
          this.orderDetails = data.Table;
          const newArr = [];
          // Unique Brand Strain Combination
          this.orderDetailsBS_filteredData = [];
          this.selectedLotsArray = [];
          // To get unique record according brand and strain :: By Devdan 22-Nov-2018
          if (this.taskTypeId > 0) {
            const abc = _.mapValues(_.groupBy(this.TaskModel.TubeLabelingLotDetails, c => {
              return [c.StrainId, c.StrainName, c.GeneticsId];
            }),
              (clist, strainObject) => {
                const count = strainObject.length;
                if (count > 0) {
                  this.orderDetailsBS_filteredData.push({
                    StrainId: String(strainObject).split(',')[0],
                    StrainName: String(strainObject).split(',')[1], LotCount: count,
                    GeneticsId: Number(String(strainObject).split(',')[2])
                  });
                }
                // clist
                // .forEach((order, index) => {
                // });
              });
            this.orderDetailsBS = this.TaskModel.TubeLabelingLotDetails;
          } else {
            this.orderDetailsBS = this.removeDuplicatesByName(this.orderDetails);
          }
          // End of getting unique record accroding brand and strain

          // To map assign wt textbox in table for each row
          // this.tubeOrderPackets.reset();
          // this.TUBELABELING. tubeOrderPackets = this.fb.array([]);
          (this.ParentFormGroup.controls['TUBELABELING'] as FormGroup).setControl('tubeOrderPackets', this.fb.array([]));

          // this.tubeOrderPackets.push(this.fb.array(this.orderDetails.map(this.createItem(this.fb))));
          // if (this.taskId > 0) {
          //   this.orderDetailsBS.map((object, index) => {
          //     // if (this.TaskModel.TubeLabelingProductDetails[index]) {
          //       this.tubeOrderPackets.push(this.createItem(object, index));
          //     // }
          //   });
          // } else {
          //   this.orderDetails.map((object, index) => {
          //     this.tubeOrderPackets.push(this.createItem(object, index));
          //   });
          // }

          this.orderDetails.map((object, index) => {
            this.tubeOrderPackets.push(this.createItem(object, index));
          });

          // End To map assign wt textbox in table for each row

          const filterItems = this.tubeOrderPackets.value.filter(result => {
            return result.assignQty !== null;
          });

          if (this.taskId > 0) {
            // this.orderDetailsBS.forEach((value, key) => {
            //   let exists = false;
            //   if (this.orderDetailsBS_filteredData.length > 0) {
            //     this.orderDetailsBS_filteredData.forEach((val2, key1) => {
            //       if ( value.StrainId === val2.StrainId || this.taskTypeId > 0) { exists = true; }
            //     });
            //   } else {
            //     exists = true;
            //   }
            //   const counts  = this.globalData.orderDetails['Table1'].filter(result => result.GeneticsId === value.GeneticsId).length;
            //   value['LotCount'] = counts;
            //   if (exists && value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
            // });
          } else {
            this.orderDetailsBS.forEach((value, key) => {
              let exists = false;
              this.tubeOrderPackets.value.forEach((val2, key1) => {
                if (value.StrainId === val2.strainid) { exists = true; }
              });
              const counts = this.globalData.orderDetails['Table1'].filter(result => result.GeneticsId === value.GeneticsId).length;
              value['LotCount'] = counts;
              if (exists && value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
            });
          }

          // this.orderDetailsBS.forEach((value, key) => {
          //   let exists = false;
          //   // this.tubeOrderPackets.value.forEach((val2, key1) => {
          //   //   if ( value.StrainId === val2.strainid || this.taskTypeId > 0) { exists = true; }
          //   // });
          //   this.orderDetailsBS_filteredData.forEach((val2, key1) => {
          //     if ( value.StrainId === val2.StrainId || this.taskTypeId > 0) { exists = true; }
          //   });
          //   const counts  = this.globalData.orderDetails['Table1'].filter(result => result.GeneticsId === value.GeneticsId).length;
          //   value['LotCount'] = counts;
          //   if (!exists && value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
          // });
          // End Unique Brand Strain Combination

          // Added by Devdan :: 15-Oct-2018 :: Getting the selected lots and assigning it to ngmodel
          if (this.taskTypeId > 0) {
            this.TaskModel.TubeLabelingLotDetails.forEach((order, index) => {
              this.openLotSelection(order, index);
            });
            this.setSelectedLotDetails();
            this.showLotSelectionModel = false;
            this.readonlyFlag = true;
          }
        }
      },
      error => { console.log(error); },
      () => console.log('sucess'));
  }

  changeValidator(selected, index) {
    const answerbox = this.questionForm.get('questions.' + index).get('answer');
    const availableqty = this.questionForm.get('questions.' + index).get('AvailTubesQty');

   // const validators = selected ? Validators.compose([Validators.required, Validators.min(0.1), Validators.max(availableqty.value)]) : null;
    const validators = Validators.compose([Validators.max(availableqty.value)]);
   answerbox.setValidators(validators);
    answerbox.updateValueAndValidity();
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.TUBELABELING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  onNoteSave(lotComments) {
    this.uniqueBrandStrain = this.uniqueBrandStrain;
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  createItem(object, index): FormGroup {
    // In case of Edit , show assigned qty and available qty together with respective size of package
    let eRequiredQty;
    let eAssignedQty;
    if (this.taskTypeId > 0) {
      eRequiredQty = object.RequiredQty + this.TaskModel.TubeLabelingProductDetails[index].AssignedQty;
      object.RequiredQty = eRequiredQty;
      object.TotalWt = (eRequiredQty * this.TaskModel.TubeLabelingProductDetails[index].UnitValue);
      eAssignedQty = this.TaskModel.TubeLabelingProductDetails[index].AssignedQty;
    } else {
      // add code for ready for pkging less than req tubes then assign direct to assign qty :: 08-april-2019 :: swapnil
      if (this.LabelQty <= object.RequiredQty && this.tempLabelQty === 0) {

            eAssignedQty = this.LabelQty;
            this.tempLabelQty = this.LabelQty - object.RequiredQty;
        } else if (this.tempLabelQty <= object.RequiredQty && this.tempLabelQty > 0) {
            eAssignedQty = this.tempLabelQty;
        } else if ( this.tempLabelQty < 0) {
            eAssignedQty = 0;
        } else {
            eAssignedQty = object.RequiredQty;
            this.tempLabelQty = this.LabelQty - eAssignedQty;
        }
        // end changes
        //  eAssignedQty = object.RequiredQty;
      }
    const counts = this.globalData.orderDetails['Table1'].filter(result => result.GeneticsId === object.GeneticsId).length;
    return this.fb.group({
      assignQty: new FormControl({ value: counts === 0 ? 0 : eAssignedQty, disabled: counts === 0 }, Validators.max(object.RequiredQty)),
      brandid: object.RawSupId,
      strainid: object.StrainId,
      strainName: object.StrainName,
      packagetypeid: object.PkgTypeId,
      packagetype: object.PkgTypeName,
      packageunit: object.UnitValue,
      itemQty: object.ItemQty,
      productTypeId: object.ProductTypeId,
      geneticsId: object.GeneticsId,
      geneticsName: object.GeneticsName
    });
  }

  removeDuplicatesByName(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.StrainName === val2.StrainName) { exists = true; }
      });

      if (exists === false && value.StrainName !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  openLotSelection(rowData, rowIndex) {
    this.brandStrainLots = [];
    this.selLotBrandStrainRow.pkgSizeRequiredQtyArr = [];

    const selectedStrainUnitValues = this.orderDetails.filter(result => result.GeneticsId === rowData.GeneticsId);
    // const selectedStrainUnitValues = this.orderDetailsBS.filter(result =>  result.GeneticsId === rowData.GeneticsId);
    this.brandStrainLots = this.globalData.orderDetails['Table1'].filter(result =>
      result.GeneticsId === rowData.GeneticsId
      && Number(selectedStrainUnitValues.filter(data1 => data1.UnitValue === result.UnitValue).length) > 0
    );

    this.selLotBrandStrainRow.BrandId = 0;
    this.selLotBrandStrainRow.StrainId = rowData.StrainId;
    this.selLotBrandStrainRow.selectedRowIndex = rowIndex;

    this.selLotBrandStrainRow.RequireWt = 0;
    this.selLotBrandStrainRow.combinationTotalAssignedQty = 0;

    this.orderDetails.filter((value, key) =>
      //  value.StrainId === rowData.StrainId)
      value.GeneticsId === rowData.GeneticsId)
      .map(value => {
        this.selLotBrandStrainRow.RequireWt += value.TotalWt;
        this.selLotBrandStrainRow.BrandName = '';
        this.selLotBrandStrainRow.StrainName = value.StrainName;
        this.selLotBrandStrainRow.GeneticsId = value.GeneticsId;
        this.selLotBrandStrainRow.GeneticsName = value.GeneticsName;
      });

    this.questionForm = this.fb.group({
      questions: this.fb.array(this.brandStrainLots.map(this.createQuestionControl(this.fb))),
      mixPkgDetailsArr: this.fb.array(
        _.uniqBy(this.globalData.orderDetails['Table2'], 'MixPkgId')
          .filter(result => result.GeneticsId === rowData.GeneticsId)
          .map((childObject, childIndex) => {
            return this.createMixItem(childObject, childIndex);
          })
      )
    });

    this.tubeOrderPackets.value.forEach(result => {
      // let totalPkgWt = 0;
      if ((result.strainid === rowData.StrainId || this.taskTypeId > 0) && Number(result.assignQty) > 0) {
        // totalPkgWt = Number(result.assignQty) * Number(result.itemQty);

        if (this.selLotBrandStrainRow.pkgSizeRequiredQtyArr
          .filter(item =>
            item.StrainId === result.strainid &&
            item.PkgTypeId === result.packagetypeid &&
            item.UnitValue === result.packageunit &&
            item.ItemQty === result.itemQty
          ).length) {

          const unitValueQty = this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.filter(item =>
            item.StrainId === result.strainid &&
            item.PkgTypeId === result.packagetypeid &&
            item.UnitValue === result.packageunit &&
            item.ItemQty === result.itemQty
          )[0].RequiredQty;

          this.selLotBrandStrainRow.pkgSizeRequiredQtyArr
            .filter(item =>
              item.StrainId === result.strainid &&
              item.PkgTypeId === result.packagetypeid &&
              item.UnitValue === result.packageunit &&
              item.ItemQty === result.itemQty
            )[0].RequiredQty
            = unitValueQty + Number(result.assignQty);

        } else {
          this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.push(
            {
              ProductTypeId: rowIndex,
              StrainId: result.strainid,
              StrainName: result.strainName,
              PkgTypeId: result.packagetypeid,
              PkgTypeName: result.packagetype,
              ItemQty: result.itemQty,
              UnitValue: result.packageunit,
              GeneticsId: result.geneticsId,
              GeneticsName: result.geneticsName,
              RequiredQty: Number(result.assignQty)
            });
        }
      }
    });

    this.showLotSelectionModel = true;
  }

  // OpenMixPkgSelection(tubeOrderPacket, orderDetailsRow) { // Commented by Devdan :: 26-Oct-2018 :: Unused
  // this.selectedProductTypeDetails = orderDetailsRow;
  // this.selectedProductTypeDetails['AssignedQty'] = tubeOrderPacket.value.assignQty;

  // this.mixPkgDetailsForm = this.fb.group({
  //   mixPkgDetailsArr: this.fb.array(
  //     _.uniqBy(this.globalData.orderDetails['Table2'], 'MixPkgId')
  //     .filter(result => result.ProductTypeId === orderDetailsRow.ProductTypeId)
  //     .map((childObject, childIndex) => {
  //       return this.createMixItem(childObject, childIndex);
  //     })
  //   )
  // });
  // this.showMixPkgDetailsModal = true;
  // }

  createMixItem(childObject, childIndex): FormGroup {
    let checkbox;
    let mixPkgDetails = [];

    if (this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex]) {
      mixPkgDetails = this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex].mixPkgDetails;
    } else {
      mixPkgDetails = [];
    }
    if (mixPkgDetails && mixPkgDetails.length > 0) {
      const lotRowDetails = [];
      mixPkgDetails.forEach(data => {
        // Added by Devdan :: 17-Oct-2018
        if (this.taskTypeId > 0 && childObject.MixPkgId === data.MixPkgId) {
          lotRowDetails.push(data);
        } else if (data.Index === childIndex) {
          lotRowDetails.push(data);
        }
      });

      if (lotRowDetails.length) {
        checkbox = lotRowDetails[0].selected;
      } else {
        checkbox = childObject.selected;
      }
    } else {
      checkbox = childObject.selected;
    }

    return this.fb.group({
      srno: childIndex,
      UnitValue: childObject.TubeUnitValue,
      ItemQty: childObject.TubeItemQty,
      PkgTypeId: childObject.TubePkgTypeId,
      PkgTypeName: childObject.TubePkgTypeName,
      StrainId: childObject.StrainId,
      StrainName: childObject.StrainName,
      GeneticsId: childObject.GeneticsId,
      Qty: childObject.Qty,
      mixPkgCheck: checkbox,
      mixPkgId: childObject.MixPkgId ? childObject.MixPkgId : 0,
      MixPkgNo: childObject.MixPkgNo
    });
  }

  createLotControls(fb: FormBuilder, object: any, index: number, flag: string) {
    let lotCompletedBox;
    const lotUniqueId = String(object.LotId + '' + object.GeneticsId + '' + object.PkgTypeId + '' + object.UnitValue + '' + object.ItemQty);

    if (flag === 'Complete') {
      lotCompletedBox = [null];
      return fb.group({
        LotId: object.LotId, lotCompletedQty: lotCompletedBox, GrowerLotNo: object.GrowerLotNo,
        AssignedTubeQty: object.AssignedQty, LotNoteCount: object.LotNoteCount,
        LotUniqueId: lotUniqueId, StrainId: object.StrainId, StrainName: object.StrainName
      });
    } else {
      lotCompletedBox = [object.ProcessedQty ? object.ProcessedQty : 0];
      return fb.group({
        LotId: object.LotId, lotReviewedQty: lotCompletedBox, GrowerLotNo: object.GrowerLotNo,
        AssignedTubeQty: object.AssignedQty, ProcessedTubeQty: object.ProcessedQty,
        LotNoteCount: object.LotNoteCount, LotUniqueId: lotUniqueId, StrainId: object.StrainId
      });
    }
  }

  createMixPkgControls(fb: FormBuilder, object: any, index: number, flag: string) {
    let mixPkgCompletedQtyBox;
    const mixPkgUniqueId = String(object.MixPkgId + '' + object.GeneticsId + '' + object.PkgTypeId + '' + object.UnitValue + '' + object.ItemQty);
    if (flag === 'Complete') {
      mixPkgCompletedQtyBox = [null, Validators.compose([Validators.max(1)])];
      return fb.group({
        MixPkgId: object.MixPkgId, mixPkgCompletedQty: mixPkgCompletedQtyBox, MixPkgNo: object.MixPkgNo,
        AssignedTubeQty: object.AssignedQty, ProductTypeId: object.ProductTypeId,
        MixPkgUniqueId: mixPkgUniqueId
      });
    } else {
      mixPkgCompletedQtyBox = [object.ProcessedQty ? object.ProcessedQty : 0, Validators.compose([Validators.max(1)])];
      return fb.group({
        MixPkgId: object.MixPkgId, mixPkgReviewedQty: mixPkgCompletedQtyBox, MixPkgNo: object.MixPkgNo,
        AssignedTubeQty: object.AssignedQty, ProcessedTubeQty: object.ProcessedQty,
        ProductTypeId: object.ProductTypeId, MixPkgUniqueId: mixPkgUniqueId
      });
    }
  }

  createReviewLotControls(fb: FormBuilder, flag: string) {
    return (object, index) => {
      let lotBox;
      lotBox = [object.LotId ? object.LotId : 0, Validators.required];
      return fb.group({ pkgIndex: index + 1, packageCode: object.PackageCode, lotno: lotBox, ProductTypeId: object.ProductTypeId });
    };
  }

  createQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      let lotSelectedDetails = [];

      if (this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex]) {
        lotSelectedDetails = this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex].lotDetails;
      } else {
        lotSelectedDetails = [];
      }

      let isLotPresentInDBData = false;
      if (lotSelectedDetails) {
        const lotRowDetails = [];
        lotSelectedDetails.forEach(data => {
          // Added by Devdan :: 17-Oct-2018
          if (this.taskTypeId > 0 && question.LotId === data.LotNo
            && question.ItemQty === data.ItemQty && question.UnitValue === data.UnitValue) {
            lotRowDetails.push(data);
          } else if (data.Index === index) {
            lotRowDetails.push(data);
          }
          ///// Check if the selected lot is persent in database data In Edit mode
          if (this.taskId && this.taskId > 0) {
            this.TaskModel.TubeLabelingLotDetails.forEach(Lot => {
              if (question.LotId === Lot.LotId && question.ItemQty === Lot.ItemQty
                && question.UnitValue === Lot.UnitValue) {
                isLotPresentInDBData = true;
              }
            });
          }
        });

        if (lotRowDetails.length) {
          const lotQty = lotRowDetails[0].SelectedQty;
          if (this.taskId && this.taskId > 0 && isLotPresentInDBData) {
            checkbox = lotRowDetails[0].Selected;
            // answerbox = lotRowDetails[0].Selected
            //   ? [lotQty, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt + Number(lotQty))])]
            //   : null;
            answerbox =  [lotQty, Validators.compose([Validators.max(question.AvailableWt + Number(lotQty))])];
          } else {
            checkbox = lotRowDetails[0].Selected;
            // answerbox = lotRowDetails[0].Selected
            //   ? [lotQty, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
            //   : null;
            answerbox =  [lotQty, Validators.compose([Validators.max(question.AvailableWt)])];
          }
        } else {
          checkbox = question.selected;
          // answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
          //   : null;
            answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
        }
      } else {
        checkbox = question.selected;
        // answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
        //   : null;
        answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
      }

      if (this.taskId && this.taskId > 0 && isLotPresentInDBData) {
        return fb.group({
          question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId, UnitValue: question.UnitValue,
          AvailTubesQty: question.Qty + (answerbox ? Number(answerbox[0]) : 0),
          GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount,
          GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName, StrainId: question.StrainId, StrainName: question.StrainName,
          ItemQty: question.ItemQty, PkgTypeId: question.PkgTypeId, PkgTypeName: question.PkgTypeName
        });
      } else {
        return fb.group({
          question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId, UnitValue: question.UnitValue,
          AvailTubesQty: question.Qty, GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount,
          GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName, StrainId: question.StrainId, StrainName: question.StrainName,
          ItemQty: question.ItemQty, PkgTypeId: question.PkgTypeId, PkgTypeName: question.PkgTypeName
        });
      }
    };
  }

  submit(form) {
    const lotDetails = [];
    const mixPkgDetails = [];
    let isCombnNotExists = false;
    let isTotalMatched = false;
    const totalSumObject = {
      lotTotalQty: 0,
      ItemQty: 0,
      UnitValue: 0,
      PkgTypeName: '',
      productTotalRequiredQty: 0
    };
    if (this.questionForm.valid) {

      if (!this.taskTypeId) {
        for (let i = 0; i < this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.length; i++) {
          const temp = this.selLotBrandStrainRow.pkgSizeRequiredQtyArr[i];

          totalSumObject.lotTotalQty = 0;
          totalSumObject.productTotalRequiredQty = 0;

          form.value.questions.forEach(result => {
            // totalLotWt += result.question ? Number(result.answer) : 0;

            // if (result.question   // comment checkboc checked :: 08-april-2019
            if (result.answer > 0
              && result.PkgTypeId === temp.PkgTypeId
              && result.ItemQty === temp.ItemQty
              && result.UnitValue === temp.UnitValue
            ) {
              totalSumObject.lotTotalQty += Number(result.answer);
            }
          });
          form.value.mixPkgDetailsArr.forEach(result => {
            // totalLotWt += result.question ? Number(result.answer) : 0;
            if (result.mixPkgCheck
              && result.PkgTypeId === temp.PkgTypeId
              && result.ItemQty === temp.ItemQty
              && result.UnitValue === temp.UnitValue
            ) {
              totalSumObject.lotTotalQty += 1;
            }
          });
          totalSumObject.productTotalRequiredQty = Number(temp.RequiredQty);
          totalSumObject.ItemQty = temp.ItemQty;
          totalSumObject.UnitValue = temp.UnitValue;
          totalSumObject.PkgTypeName = temp.PkgTypeName;

          if (totalSumObject.lotTotalQty !== totalSumObject.productTotalRequiredQty) {
            this.msgs = [];

            this.msgs.push({
              severity: 'warn',
              summary: this.globalResource.applicationmsg,
              detail: 'Sum of all lot tubes(' +
                String(totalSumObject.lotTotalQty) + ') qty is not equal to total assigned qty(' +
                String(totalSumObject.productTotalRequiredQty) + ') for the combination of Pkg. Size('
                + String(totalSumObject.UnitValue) + '), Item Qty('
                + String(totalSumObject.ItemQty) + ') and Pkg. Type('
                + String(totalSumObject.PkgTypeName) + ').'
            });
            isTotalMatched = true;
            break;
          }
        }

        if (isTotalMatched) { return; }
      }
      form.value.questions.forEach(result => {
        let productTypeId;

        // if (result.question === true) {   // comment checkbox check

           if (result.answer > 0) {

          if (this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.filter(data => {
            return data.PkgTypeId === result.PkgTypeId
              && data.UnitValue === result.UnitValue && data.ItemQty === result.ItemQty;
          }).length) {
            productTypeId = this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.filter(data => {
              return data.PkgTypeId === result.PkgTypeId
                && data.UnitValue === result.UnitValue && data.ItemQty === result.ItemQty;
            })[0].ProductTypeId;
          } else {
            this.msgs = [];

            this.msgs.push({
              severity: 'warn',
              summary: this.globalResource.applicationmsg,
              detail: 'There is no required tubes for combination of Pkg. Size('
                + String(result.UnitValue) + '), Item Qty('
                + String(result.ItemQty) + ') and Pkg. Type('
                + String(result.PkgTypeName) + ').'
            });
            isCombnNotExists = true;
          }

          if (isCombnNotExists) { return; }

          lotDetails.push(
            {
              ProductTypeId: productTypeId,
              LotNo: result.LotNo,
              GrowerLotNo: result.GrowerLotNo,
              PkgTypeId: result.PkgTypeId,
              UnitValue: result.UnitValue,
              SelectedQty: result.answer,
              Selected: true,
              Index: result.questionNumber,
              StrainId: result.StrainId,
              AvailTubesQty: result.AvailTubesQty,
              StrainName: result.StrainName,
              BrandId: this.selLotBrandStrainRow.BrandId,
              GeneticsId: this.selLotBrandStrainRow.GeneticsId,
              GeneticsName: this.selLotBrandStrainRow.GeneticsName,
              PkgTypeName: result.PkgTypeName,
              ItemQty: result.ItemQty,
              LotNoteCount: result.LotNoteCount // Added LotNoteCount
            }
          );
        }
      });

      form.value.mixPkgDetailsArr.forEach(result => {
        let productTypeId;
        if (result.mixPkgCheck === true) {

          productTypeId = this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.filter(data => {
            return data.PkgTypeId === result.PkgTypeId
              && data.UnitValue === result.UnitValue && data.ItemQty === result.ItemQty;
          })[0].ProductTypeId;

          mixPkgDetails.push(
            {
              ProductTypeId: productTypeId,
              MixPkgId: result.mixPkgId,
              MixPkgNo: result.MixPkgNo,
              SelectedQty: 1,
              Index: result.srno,
              UnitValue: result.UnitValue,
              ItemQty: result.ItemQty,
              PkgTypeId: result.PkgTypeId,
              PkgTypeName: result.PkgTypeName,
              StrainId: result.StrainId,
              StrainName: result.StrainName,
              GeneticsId: result.GeneticsId,
              selected: true,
            }
          );
        }
      });

      if (isCombnNotExists) { return; }

      this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex] = {
        lotDetails: lotDetails,
        mixPkgDetails: mixPkgDetails
      };
      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // localStorage.setItem('selectedLotsArray', JSON.stringify(this.selectedLotsArray));
      this.appCommonService.setLocalStorage('selectedLotsArray', JSON.stringify(this.selectedLotsArray));
      this.showLotSelectionModel = false;
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
    // this.submission = form.value;
  }

  // Submit Completion Parameters
  submitCompleteParameter(formModel) {
    let completeLotDetailsForApi;
    const lotProductListArr = [];
    let countMisMatch = false;

    let duplicateEntry = false;

    if (this.completionForm.valid === true) {
      completeLotDetailsForApi = {
        TaskDetails: {
          TaskId: Number(this.taskId),
          VirtualRoleId: 0,
          Comment: formModel.MiscComment ? formModel.MiscComment : '',
          MiscCost: 0,
          TaskKeyName: 'B-TUBE-BRAND'
        },
        LotTubesDetails: [],
        LotProductTypeDetails: [],
        ProductTypeDetails: [],
        MixPkgDetails: []
      };

      // 3rd Object: Product wise Total Qty Details
      formModel.completeParamArr.forEach((object, index) => {
        completeLotDetailsForApi.ProductTypeDetails.push({
          ProductTypeId: object.ProductTypeId,
          Qty: object.completedQty ? object.completedQty : 0,
          PackageCode: object.packageCode ? object.packageCode : '',
          IndexCode: String(index)
        });

        if (this.productTypeQtyMap.get(object.ProductTypeId) !== object.completedQty) {
          const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
          .get('completedQty');

          packagesCompletedBox.setErrors({ pkgqtynotmatched: true });
          countMisMatch = true;
          packagesCompletedBox.markAsDirty();
           return;
        }
      });

      if (countMisMatch) {
        return;
       }

      // 4th Object: Product wise all lot list and their entered wt details
      let validateDuplicateFlag = false;
      formModel.completeParamArr.forEach((object, PkgFormIndex) => {
        object.LotDetails.forEach((LotObject, index) => {

          if ((object.packageCode && String(object.packageCode) !== '') && Number(completeLotDetailsForApi.ProductTypeDetails.filter(data =>
            (data.PackageCode && String(data.PackageCode) !== '')
            && String(data.PackageCode).toLocaleUpperCase() === String(object.packageCode).toLocaleUpperCase()).length) > 1) {
            // this.msgs = [];
            // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.duplicatePackageCode });

            const uniquecodeBox = (<FormGroup>this.completionForm.get('completeParamArr.' + PkgFormIndex))
              .get('packageCode');

            if (!validateDuplicateFlag) {
              validateDuplicateFlag = true;
              uniquecodeBox.setErrors({ duplicatepkgcode: true });
            }

            duplicateEntry = true;
          }

          completeLotDetailsForApi.LotTubesDetails.push({
            LotId: LotObject.LotId,
            StrainId: LotObject.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            Qty: LotObject.lotCompletedQty ? LotObject.lotCompletedQty : 0
          });

          lotProductListArr.push({
            GeneticsId: object.GeneticsId,
            StrainId: object.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            ProductTypeId: object.ProductTypeId,
            LotId: LotObject.LotId,
            LotUniqueId: LotObject.LotUniqueId
          });
        });
      });

      // 2nd Object: All Products unique lot id and sum of product item qty

      // const result = _.groupBy(completeLotDetailsForApi.LotProductList , c => {
      //   return [c.LotId];
      // });

      _.mapValues(_.groupBy(lotProductListArr, c => {
        return [c.LotId, c.ProductTypeId];
      }),
        (clist, LotObject) => {
          let lotJointsQty = 0;
          let lotUniqueId;

          clist.map(LotDetails => {
            lotJointsQty += (LotDetails.ItemQty);
            lotUniqueId = LotDetails.LotUniqueId;
          });

          // if (LotTotalWt) {
            if ( Number(this.lotMap.get(lotUniqueId)) > 0) {
          completeLotDetailsForApi.LotProductTypeDetails.push({
            LotId: Number(String(LotObject).split(',')[0]),
            ProductTypeId: Number(String(LotObject).split(',')[1]),
            Qty: Number(this.lotMap.get(lotUniqueId))
              ? Number(this.lotMap.get(lotUniqueId)) : 0
          });
        }
        });

      // 5th Object: Mix Lot Details
      formModel.completeParamArr.forEach((object, index) => {
        if (object.MixLotDetails.length > 0) {
          object.MixLotDetails.forEach((MixLotObject, childIndex) => {
            if (
              Number(this.lotMap.get(MixLotObject.MixPkgId)) > 0 &&
              completeLotDetailsForApi.MixPkgDetails.filter(item => item.MixPkgId === MixLotObject.MixPkgId).length <= 0
            ) {
              completeLotDetailsForApi.MixPkgDetails.push({
                MixPkgId: MixLotObject.MixPkgId,
                ProductTypeId: object.ProductTypeId,
                Qty: MixLotObject.mixPkgCompletedQty ? MixLotObject.mixPkgCompletedQty : 0
              });
            } else {

              if (
                completeLotDetailsForApi.MixPkgDetails.filter(item => item.MixPkgId === MixLotObject.MixPkgId).length <= 0
              ) {
                completeLotDetailsForApi.MixPkgDetails.push({
                  MixPkgId: MixLotObject.MixPkgId,
                  ProductTypeId: object.ProductTypeId,
                  Qty: MixLotObject.mixPkgCompletedQty ? MixLotObject.mixPkgCompletedQty : 0
                });
              }
            }
          });
        }
      });
      // End of Mix Lot Details

      // duplicateEntry = true;
      if (duplicateEntry) { return; }
      duplicateEntry = false;
      // return;

      this.confirmationService.confirm({
        message: this.assignTaskResources.taskcompleteconfirm,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

          // http call starts
          this.loaderService.display(true);

          this.taskCommonService.completeTask(completeLotDetailsForApi)
            .subscribe(data => {
              if (String(data).toLocaleUpperCase() === 'NOCOMPLETE') {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });

                if (this.TaskModel.IsReview === true) {
                  this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                } else {
                  this.TaskModel.TaskStatus = this.taskStatus.Completed;
                }
                this.TaskCompleteOrReviewed.emit();
              } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });

                setTimeout(() => {
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                    this.router.navigate(['home/managerdashboard']);
                  } else {
                    this.router.navigate(['home/empdashboard']);
                  }
                }, 2000);
              } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                if (this.TaskModel.IsReview === true) {
                  this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                } else {
                  this.TaskModel.TaskStatus = this.taskStatus.Completed;
                }
                this.msgs = [];
                this.msgs.push({
                  severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.assignTaskResources.taskcompleteddetailssavesuccess
                });
                setTimeout(() => {
                 // if (this._cookieService.UserRole === this.userRoles.Manager) {
                  //  this.router.navigate(['home/managerdashboard']);
                  // } else {
                  //  this.router.navigate(['home/empdashboard']);
                 // }

                  // for navigate joint dashboard if employee assign task :: 20-Mar-2019 :: swapnil
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                         // change navigation to joint dashboard
                          this.router.navigate(['home/jointsproductiondashboard']);
                        } else {
                          // if employee assign task to self then redirect to joint dashboard else employee dashboard
                          if (this.assignRole.length !== 0) {
                          if (this.assignRole[0].RoleName === 'Employee') {
                            this.router.navigate(['home/jointsproductiondashboard']);
                          }
                         } else {
                          this.router.navigate(['home/empdashboard']);  }
                        }
                }, 2000);
              } else {
                if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                  validateDuplicateFlag = false;
                  data.forEach(dataItem => {
                    if (dataItem.PackageCode && String(dataItem.PackageCode) !== '') {
                      const arrIndexCode = dataItem.IndexCode;

                      const uniquecodeBox = (<FormGroup>this.completionForm.get('completeParamArr.' + arrIndexCode))
                        .get('packageCode');

                      if (!validateDuplicateFlag) {
                        validateDuplicateFlag = true;
                        (uniquecodeBox as FormControl).setErrors({ 'duplicatepkgcode': true });
                      }

                      duplicateEntry = true;

                      return;
                    }
                  });
                }
              }
            },
              error => { console.log(error); },
              () => {
                if (!(duplicateEntry === false)) {
                  return;
                } else {
                  this.PageFlag.showmodal = false;
                }
              }
            );
          // this.PageFlag.showmodal = false;
          // http call ends
          // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
          // this.refreshService.PushChange().subscribe(
          //   msg => {
          //   });
          this.loaderService.display(false);
        },
        reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
        }
      });
    } else {
      this.appCommonService.validateAllFields(this.completionForm);
    }
  }

  // Commented by Devdan :: Sec to Min change :: 06-Nov-2018
  // CaluculateTotalMins(Hours, Mins) {
  //   return (Number(Hours) * 60) + Number(Mins);
  // }
  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
  CaluculateTotalSecs(Hours, Mins, Secs) {
    return (Number(Hours) * 3600) + (Number(Mins) * 60) + Number(Secs);
  }

  submitReviewParameter(formModel) {
    let reviewLotDetailsForApi;
    const lotProductListArr = [];
    let duplicateEntry = false;
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    if (this.reviewForm.valid === true) {
      reviewLotDetailsForApi = {
        TaskDetails: {
          TaskId: Number(this.taskId),
          VirtualRoleId: 0,
          Comment: formModel.MiscComment ? formModel.MiscComment : '',
          MiscCost: formModel.MiscCost ? formModel.MiscCost : 0,
          // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
          RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
          TaskKeyName: 'B-TUBE-BRAND'
        },
        LotTubesDetails: [],
        LotProductTypeDetails: [],
        ProductTypeDetails: [],
        MixPkgDetails: []
      };

      // 3rd Object: Product wise Total Qty Details
      formModel.reviewParamArr.forEach((object, index) => {
        reviewLotDetailsForApi.ProductTypeDetails.push({
          ProductTypeId: object.ProductTypeId,
          Qty: object.reviewedQty ? object.reviewedQty : 0,
          PackageCode: object.packageCode ? object.packageCode : '',
          IndexCode: String(index)
        });
      });

      // 4th Object: Product wise all lot list and their entered wt details
      formModel.reviewParamArr.forEach((object, index) => {
        object.LotDetails.forEach(LotObject => {

          reviewLotDetailsForApi.LotTubesDetails.push({
            LotId: LotObject.LotId,
            StrainId: LotObject.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            Qty: LotObject.lotReviewedQty ? LotObject.lotReviewedQty : 0
          });

          lotProductListArr.push({
            GeneticsId: object.GeneticsId,
            StrainId: object.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            ProductTypeId: object.ProductTypeId,
            LotId: LotObject.LotId,
            LotUniqueId: LotObject.LotUniqueId
          });

        });
      });

      this.TaskModel.AssignQtyLotDetails.forEach((object, index) => {
        if ( reviewLotDetailsForApi.LotTubesDetails.filter(r => r.LotId === object.LotId).length <= 0) {
          reviewLotDetailsForApi.LotTubesDetails.push({
            LotId: object.LotId,
            StrainId: object.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            Qty: object.ProcessedQty
            });
          }
        });
      // 2nd Object: All Products unique lot id and sum of lot wt

      // const result = _.groupBy(completeLotDetailsForApi.LotProductList , c => {
      //   return [c.LotId];
      // });
      _.mapValues(_.groupBy(lotProductListArr, c => {
        return [c.LotId, c.ProductTypeId];
      }),
        (clist, LotObject) => {
          let lotJointsQty = 0;
          let lotUniqueId;
          clist.map(LotDetails => {
            lotJointsQty += (LotDetails.ItemQty);
            lotUniqueId = LotDetails.LotUniqueId;
          });

          // if (LotTotalWt) {
            if (  Number(this.lotMap.get(lotUniqueId)) > 0) {
          reviewLotDetailsForApi.LotProductTypeDetails.push({
            LotId: Number(String(LotObject).split(',')[0]),
            ProductTypeId: Number(String(LotObject).split(',')[1]),
            Qty: Number(this.lotMap.get(lotUniqueId))
              ? Number(this.lotMap.get(lotUniqueId)) : 0
          });
        }
        });

      if (duplicateEntry) { return; }
      duplicateEntry = false;

      // 5th Object: Mix Lot Details
      formModel.reviewParamArr.forEach((object, index) => {
        if (object.MixLotDetails.length > 0) {
          object.MixLotDetails.forEach((MixLotObject, childIndex) => {
            if (
              Number(this.lotMap.get(MixLotObject.MixPkgId)) > 0 &&
              reviewLotDetailsForApi.MixPkgDetails.filter(item => item.MixPkgId === MixLotObject.MixPkgId).length <= 0
            ) {
              reviewLotDetailsForApi.MixPkgDetails.push({
                MixPkgId: MixLotObject.MixPkgId,
                ProductTypeId: object.ProductTypeId,
                Qty: MixLotObject.mixPkgReviewedQty ? MixLotObject.mixPkgReviewedQty : 0
              });
            } else {

              if (
                reviewLotDetailsForApi.MixPkgDetails.filter(item => item.MixPkgId === MixLotObject.MixPkgId).length <= 0
              ) {
                reviewLotDetailsForApi.MixPkgDetails.push({
                  MixPkgId: MixLotObject.MixPkgId,
                  ProductTypeId: object.ProductTypeId,
                  Qty: MixLotObject.mixPkgReviewedQty ? MixLotObject.mixPkgReviewedQty : 0
                });
              }
            }
          });
        }
      });
      // End of Mix Lot Details

      this.confirmationService.confirm({
        message: this.assignTaskResources.taskcompleteconfirm,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

          // http call starts
          this.loaderService.display(true);

          this.taskCommonService.submitTaskReview(reviewLotDetailsForApi)
            .subscribe(data => {
              if (String(data).toLocaleUpperCase() === 'NOREVIEW') {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadyreviewed });
                this.TaskModel.TaskStatus = this.taskStatus.Completed;

                if (this._cookieService.UserRole === this.userRoles.Manager &&
                  this.TaskModel.IsReview &&
                  this.TaskModel.TaskStatus === this.taskStatus.Completed) {
                  this.showToManager = true;
                }

                setTimeout(() => {
                  this.router.navigate(['home/taskaction', this.taskType, this.taskId]);
                }, 2000);

              } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformR });

                setTimeout(() => {
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                    this.router.navigate(['home/managerdashboard']);
                  } else {
                    this.router.navigate(['home/empdashboard']);
                  }
                }, 2000);
              } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                this.TaskModel.TaskStatus = this.taskStatus.Completed;

                if (this._cookieService.UserRole === this.userRoles.Manager &&
                  this.TaskModel.IsReview &&
                  this.TaskModel.TaskStatus === this.taskStatus.Completed) {
                  this.showToManager = true;
                }

                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.reviewsubmittedsuccess });

                setTimeout(() => {
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                    this.router.navigate(['home/managerdashboard']);
                  } else {
                    this.router.navigate(['home/empdashboard']);
                  }
                }, 2000);
              } else {
                if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                  data.forEach(dataItem => {
                    const arrIndexCode = String(dataItem.IndexCode).split('##');
                    const uniquecodeBox = (<FormGroup>this.completionForm.get('reviewParamArr.' + arrIndexCode[0]))
                      .get('packageCode');
                    this.msgs = [];
                    this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.duplicatePackageCode });
                    duplicateEntry = true;

                    (uniquecodeBox as FormControl).setErrors({ 'duplicate': true });
                    return;
                  });
                }
              }
            },
              () => {
                if (!(duplicateEntry === false)) {
                  return;
                } else {
                  this.PageFlag.showReviewmodal = false;
                }
              }
            );

          // this.PageFlag.showReviewmodal = false;
          // http call ends
          // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
          // this.refreshService.PushChange().subscribe(
          //   msg => {
          //   });
          this.loaderService.display(false);
        },
        reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
        }
      });
    } else {
      this.appCommonService.validateAllFields(this.reviewForm);
    }
  }


  // Created by Devdan :: 23-Oct-2018 :: to set the ng model values
  setFormInEditMode() {
    this.TaskModel.TUBELABELING = {
      lotno: null,
      brand: this.TaskModel.TubeLabelingProductDetails[0].BrandId,
      strain: this.TaskModel.TubeLabelingProductDetails[0].StrainId,
      startdate: this.TaskModel.startdate,
      enddate: null,
      endtime: null,
      esthrs: null,
      priority: this.TaskModel.TaskDetails.TaskPriority,
      notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
      notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
      usercomment: this.TaskModel.TubeLabelingTaskDetails.Comment,
      orderno: this.TaskModel.TaskDetails.OrderId,
      employee: this.TaskModel.TaskDetails.EmpId,
    };
  }

  setSelectedLotDetails() {
    this.orderDetailsBS_filteredData
      // _.mapValues(_.groupBy(this.orderDetailsBS_filteredData, 'StrainId'),
      // (clist, lotObject) => {
      //   console.log(clist);
      //   clist
      .forEach((order, index) => {
        const lotDetails = [];
        const mixPkgDetails = [];
        this.TaskModel.TubeLabelingLotDetails.forEach(Lot => {
          if (Number(Lot.StrainId) === Number(order.StrainId)) {
            // && Lot.UnitValue === order.UnitValue &&
            //   Lot.ItemQty === order.ItemQty && Lot.LotId === order.LotId
            lotDetails.push(
              {
                ProductTypeId: '',
                LotNo: Lot.LotId,
                GrowerLotNo: Lot.GrowerLotNo,
                PkgTypeId: Lot.PkgTypeId,
                UnitValue: Lot.UnitValue,
                SelectedQty: Lot.AssignedQty,
                Selected: true,
                Index: '',
                StrainId: Lot.StrainId,
                AvailTubesQty: Lot.AvailTubesQty,
                StrainName: Lot.StrainName,
                BrandId: Lot.BrandId,
                GeneticsId: Lot.GeneticsId,
                GeneticsName: Lot.GeneticsName,
                PkgTypeName: Lot.PkgTypeName,
                ItemQty: Lot.ItemQty,
                LotNoteCount: Lot.LotNoteCount
              }
            );
          }
        });

        if (this.TaskModel.TubeLabelingMixPackageDetails.length > 0) {
          this.TaskModel.TubeLabelingMixPackageDetails.forEach((mixPkg) => {
            if (mixPkg.StrainId === order.StrainId && mixPkg.UnitValue === order.UnitValue
              && mixPkg.ItemQty === order.ItemQty && mixPkg.LotId === order.LotId) {
              mixPkgDetails.push(
                {
                  ProductTypeId: mixPkg.ProductTypeId,
                  MixPkgId: mixPkg.MixPkgId,
                  MixPkgNo: mixPkg.MixPkgNo,
                  SelectedQty: 1,
                  Index: '',
                  UnitValue: mixPkg.UnitValue,
                  ItemQty: mixPkg.ItemQty,
                  PkgTypeId: mixPkg.PkgTypeId,
                  PkgTypeName: mixPkg.PkgTypeName,
                  StrainId: mixPkg.StrainId,
                  StrainName: mixPkg.StrainName,
                  GeneticsId: mixPkg.GeneticsId,
                  selected: true,
                }
              );
            }
          });
        }
        this.selectedLotsArray[index] = {
          lotDetails: lotDetails,
          mixPkgDetails: mixPkgDetails
        };
      });
    // });
    this.appCommonService.setLocalStorage('selectedLotsArray', JSON.stringify(this.selectedLotsArray));
    this.showLotSelectionModel = false;
  }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

}
