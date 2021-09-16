import { element } from 'protractor';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TaskResources } from '../../../task.resources';
import { GlobalResources } from '../../../../global resource/global.resource';
import { AppConstants } from '../../../../shared/models/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { OrderService } from '../../../../order/service/order.service';
import { DropdwonTransformService } from '../../../../shared/services/dropdown-transform.service';
import { TaskCommonService } from '../../../services/task-common.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../shared/services/app-common.service';
import { DropdownValuesService } from '../../../../shared/services/dropdown-values.service';
import { UserModel } from '../../../../shared/models/user.model';
import { SelectItem, Message, ConfirmationService } from 'primeng/api';
import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../dashboard/services/refresh.service';


@Component({
  moduleId: module.id,
  selector: 'app-qa-check',
  templateUrl: 'order-fulfilment-qa-check.component.html'
})
export class OrderFulfilmentQaCheckComponent implements OnInit, OnDestroy {
  // Input Parameters Declarations
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Input() TaskModel: any;

  // Form Group Declarations
  QACHECK: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  pkgAssignForm: FormGroup;
  qaPkgItemDetailsForm: FormGroup;

  // Common Settings declarations
  public assignTaskResources: any;
  public globalResource: any;
  public taskStatus: any;
  public userRoles: any;

  // Other Required Variable Declaration
  public taskId: any;
  public taskType: any;
  public _cookieService: UserModel;
  public orderObject: any;
  public taskReviewModel: any;
  public defaultDate: Date;
  public showToManager = false;
  public showProductTypePkgDetailsModal = false;
  public productTypePkgDetails: any;
  public skewType: any = 'All';
  public showAssignPkgModal = false;
  public selectedProductType: any;
  public selectedPkgsMap: any = {};
  public selectedFailedPkgsMap: any = {};
  public chkSelectAll: boolean;
  public showProductTypePkgsDetailsModal = false;
  public showPastDateLabel = false;
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false
  };

  public msgs: Message[] = [];

  // Dropdown Objects
  public employees: SelectItem[];
  public priorities: SelectItem[];
  public issueTypes: SelectItem[];
  public skewTypes: SelectItem[];
  public qAFailReasons: SelectItem[];

  // A, B, C Order Details Variables
  public allQAOrders: any;
  public qAOrderDetails = {
    aOrderDetails: [],
    bOrderDetails: [],
    cOrderDetails: [],
    aPkgDetails: [],
    bPkgDetails: [],
    cPkgDetails: [],
    aMixPkgDetails: [],
    bMixPkgDetails: [],
    cMixPkgDetails: []
  };

  // Hold other data in global variable
  public globalData = {
    allQAOrders: [],
    employees: [],
    qAFailReasons: []
  };

  // Added by Devdan :: 12-Oct-2018
  taskTypeId: any;
  readOnlyFlag: boolean;

  // Object Creation of Required Services
  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private orderService: OrderService,
    private dropdwonTransformService: DropdwonTransformService,
    private taskCommonService: TaskCommonService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  ngOnInit() {
    // Common Variable Assignments
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.assignTaskResources.orderfullfilmenttitle);
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    // Retrive the query string parameters here
    this.route.params.forEach((urlParams) => {
      this.taskId = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails !== undefined) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    console.log(this.TaskModel);


    this.skewTypes = [
      { label: 'All', value: 'All' },
      { label: 'BUD', value: 'BUD' },
      { label: 'Joints', value: 'JOINTS' },
      { label: 'Oil', value: 'OIL' }
    ];

    if (String(this.PageFlag.page).toLocaleUpperCase() !== 'TASKACTION') {

      // Form Model Object
      this.TaskModel.QACHECK = {
        startdate: this.TaskModel.startdate,
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: null,
        orderno: null,
        employee: null,
      };

      // Create Main Form Object and defines form control defination in it.
      this.QACHECK = new FormGroup({
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('', Validators.compose([Validators.required])),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        'orderno': new FormControl('', Validators.required),
        aOrderDetailsArr: this.fb.array([]),
        bOrderDetailsArr: this.fb.array([]),
        cOrderDetailsArr: this.fb.array([]),
      });

      this.pkgAssignForm = new FormGroup({
        pkgAssignArr: this.fb.array([]),
        // mixedPkgDetailsArr: this.fb.array([])
      });

      this.ParentFormGroup.addControl('QACHECK', this.QACHECK);

      // Retrive all Orders For QA Checking
      this.getQACheckOrders();

      // Retrive employees
      // this.EmployeeListByClient();
      this.employeeListByTaskTypeKeay();

      // Bind Priorities to dropdown
      this.priorities = [
        { label: 'Normal', value: 'Normal' },
        { label: 'Important', value: 'Important' },
        { label: 'Critical', value: 'Critical' }
      ];

    } else {
        this.qAOrderDetails.aOrderDetails = this.TaskModel.AssignOrderPkgQtyDetails.filter(item => String(item.SkewKeyName).toLocaleUpperCase() === 'BUD');
        this.qAOrderDetails.bOrderDetails = this.TaskModel.AssignOrderPkgQtyDetails.filter(item => String(item.SkewKeyName).toLocaleUpperCase() === 'JOINTS');
        this.qAOrderDetails.cOrderDetails = this.TaskModel.AssignOrderPkgQtyDetails.filter(item => String(item.SkewKeyName).toLocaleUpperCase() === 'OIL');

        this.taskReviewModel = {
          racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
          ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
          rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
        };

        if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
          this.showToManager = true;
        }

        // this.uniqueOilPkgsArr = this.GetUniqueLotList(this.TaskModel.AssignQtyPkgDetails);
        // Completion Form Defination
        this.completionForm = this.fb.group({
          MiscCost: new FormControl(null),
          MiscComment: new FormControl(null)
        });

          // Package Item Details Form Defination
        this.qaPkgItemDetailsForm = this.fb.group({
          qaPkgItemArr: this.fb.array([]),
        });
    }
  }

  ngOnDestroy(): void {
    // localStorage.removeItem('selectedPkgsAssignArray');
    // localStorage.removeItem('selectedFailedPkgsArray');

    this.appCommonService.removeItem('selectedPkgsAssignArray');
    this.appCommonService.removeItem('selectedFailedPkgsArray');

    this.selectedPkgsMap = [];
    this.selectedFailedPkgsMap = [];
    this.selectedProductType = {};
  }

  // Get Form Array Object of orderDetailsArr
  get aOrderDetailsArr(): FormArray {
    return (this.ParentFormGroup.get('QACHECK') as FormGroup).get('aOrderDetailsArr') as FormArray;
  }

  get bOrderDetailsArr(): FormArray {
    return (this.ParentFormGroup.get('QACHECK') as FormGroup).get('bOrderDetailsArr') as FormArray;
  }

  get cOrderDetailsArr(): FormArray {
    return (this.ParentFormGroup.get('QACHECK') as FormGroup).get('cOrderDetailsArr') as FormArray;
  }
  // End Of Get Form Array Object of orderDetailsArr

  get pkgAssignArr() {
    return this.pkgAssignForm.get('pkgAssignArr') as FormArray;
  }

  // get mixedPkgDetailsArr() {
  //   return this.pkgAssignForm.get('mixedPkgDetailsArr') as FormArray;
  // }

  get qaPkgItemArr(): FormArray {
    return this.qaPkgItemDetailsForm.get('qaPkgItemArr') as FormArray;
  }

  // Get Selected Order Details From Dropdown
  getQACheckOrders() {
    // Added by Devdan :: 19-Oct-2018
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }
    this.orderService.getQACheckOrders(editmode).subscribe(
      (data: any) => {
        if (data !== 'No data found!') {
          this.globalData.allQAOrders =  data;
          this.allQAOrders = this.dropdwonTransformService.transform(data, 'OrderRefId', 'OrderId', '-- Select --');
        }
         // Added by Devdan :: 19-Oct-2018 :: Load Stain Change Event
         if (this.taskTypeId > 0) {
          this.setFormInEditMode();
          this.onOrderChange();
        }
      },
      error => { console.log(error); },
      () => console.log('Get QA Check Orders complete'));
  }

  // Employee List By Client
  // EmployeeListByClient() { // Commented by Devdan :: 26-Oct-2018 :: Unused
  //   this.dropdownDataService.getEmployeeListByClient().subscribe(
  //     data => {
  //       this.globalData.employees = [];
  //       this.globalData.employees = data;
  //       this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
  //     },
  //     error => { console.log(error); },
  //     () => console.log('Get all employees by client complete'));
  // }

  // Employee List By Task Type Key
  employeeListByTaskTypeKeay() {
    let taskTypeKey;
    if (this.taskId && this.taskId > 0) {
      taskTypeKey = this.TaskModel.TaskDetails.TaskTypeKey;
    } else {
      taskTypeKey = this.TaskModel.TaskTypeKey;
    }
    this.dropdownDataService.getEmployeeListByTaskTypeKey(taskTypeKey).subscribe(
      data => {
        console.log('Employees', data);
        this.globalData.employees = [];
        this.globalData.employees = data;
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get all employees by client complete'));
  }

  getQAIssueTypes(SkewKeyName) {
    this.dropdownDataService.getQAIssueTypes().subscribe(
      data => {
        this.globalData.qAFailReasons = [];
        this.globalData.qAFailReasons = data.filter(element2 =>
          String(element2.SkewKeyName).toLocaleUpperCase() === String(SkewKeyName).toLocaleUpperCase() ||
          String(element2.SkewKeyName).toLocaleUpperCase() === ''
        );
        this.qAFailReasons = this.dropdwonTransformService.transform(this.globalData.qAFailReasons, 'IssueName', 'IssueCode', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get QA Issue Types by client complete'));
  }

  // On Order Change Bind order details again
  onOrderChange() {
    // localStorage.removeItem('selectedPkgsAssignArray');
    this.appCommonService.removeItem('selectedPkgsAssignArray');
    this.orderObject = this.globalData.allQAOrders.filter(result => result.OrderId === this.TaskModel.QACHECK.orderno)[0];
    // Added by Devdan :: 19-Oct-2018
    this.getQACheckOrderDetails(this.TaskModel.QACHECK.orderno);
  }

  getQACheckOrderDetails(OrderId) {
    // Added by Devdan :: 19-Oct-2018
    let editMode;
    if (this.taskTypeId > 0) {
      editMode = true;
    } else {
      editMode = false;
    }
    this.orderService.getQACheckOrderDetails(OrderId, editMode, this.taskId).subscribe(
      (data: any) => {
        if (data !== 'No data found!') {
          console.log(data);
          this.qAOrderDetails.aOrderDetails = data.Table.filter(item => String(item.SkewKeyName).toLocaleUpperCase() === 'BUD');
          this.qAOrderDetails.bOrderDetails = data.Table.filter(item => String(item.SkewKeyName).toLocaleUpperCase() === 'JOINTS');
          this.qAOrderDetails.cOrderDetails = data.Table.filter(item => String(item.SkewKeyName).toLocaleUpperCase() === 'OIL');

          this.qAOrderDetails.aPkgDetails = data.Table1;
          this.qAOrderDetails.bPkgDetails = data.Table2;
          this.qAOrderDetails.cPkgDetails = data.Table3;

          this.qAOrderDetails.aMixPkgDetails = data.Table4;
          this.qAOrderDetails.bMixPkgDetails = data.Table5;
          // this.qAOrderDetails.cPkgDetails = data.Table3;


          // Clear the order details and fill it again
          (this.ParentFormGroup.controls['QACHECK'] as FormGroup).setControl('aOrderDetailsArr', this.fb.array([]));
          (this.ParentFormGroup.controls['QACHECK'] as FormGroup).setControl('bOrderDetailsArr', this.fb.array([]));
          (this.ParentFormGroup.controls['QACHECK'] as FormGroup).setControl('cOrderDetailsArr', this.fb.array([]));

          this.qAOrderDetails.aOrderDetails.map((object, index) => {
            this.aOrderDetailsArr.push(this.createItem(object, index));
          });

          this.qAOrderDetails.bOrderDetails.map((object, index) => {
            this.bOrderDetailsArr.push(this.createItem(object, index));
          });

          this.qAOrderDetails.cOrderDetails.map((object, index) => {
            this.cOrderDetailsArr.push(this.createItem(object, index));
          });

          // Added by Devdan :: 19-Oct-2018 :: Getting the selected lots and assigning it to ngmodel
          if (this.taskTypeId > 0) {
            this.TaskModel.QACheckOrderDetails.forEach(Ord => {
              this.getAssignPkgInfo(Ord, 'onLoad');
              this.setSelectedLotDetails();
            });
            this.showAssignPkgModal = false;
            this.readOnlyFlag = true;
          }
        } else {
          this.qAOrderDetails.aOrderDetails = [];
          this.qAOrderDetails.bOrderDetails = [];
          this.qAOrderDetails.cOrderDetails = [];

          this.qAOrderDetails.aPkgDetails = [];
          this.qAOrderDetails.bPkgDetails = [];
          this.qAOrderDetails.cPkgDetails = [];

          this.qAOrderDetails.aMixPkgDetails = [];
          this.qAOrderDetails.bMixPkgDetails = [];
        }
      },
      error => { console.log(error); },
      () => console.log('Get QA Check Orders complete'));
  }

  getAssignPkgInfo(orderDetails, value: any) {
    // Added by Devdan :: 19-Oct-2018
    let tempOrderDetails: any;
    if (value === 'frmHTML' && this.taskTypeId > 0) {
      this.TaskModel.QACheckOrderDetails.forEach(Ord => {
        if (Ord.ProductTypeId === orderDetails.value.ProductTypeId) {
          this.selectedProductType = orderDetails.value;
          tempOrderDetails = Ord;
        }
      });
      orderDetails = tempOrderDetails;
    } else if ( this.taskTypeId > 0) {
      this.selectedProductType = orderDetails;
    } else {
      this.selectedProductType = orderDetails.value;
    }

    this.pkgAssignForm.setControl('pkgAssignArr', this.fb.array([]));
    // this.pkgAssignForm.setControl('mixedPkgDetailsArr', this.fb.array([]));
    // Added by Devdan :: 18-Oct-2018 :: Check if in edit mode or not
    if (this.taskTypeId > 0) {
      if (String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'BUD') {
        this.qAOrderDetails.aPkgDetails.filter(item => item.ProductTypeId === orderDetails.ProductTypeId)
        .map((object, index) => {
          this.pkgAssignArr.push(this.createAssignPkgItem(object, index));
        });
      } else if (String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'JOINTS') {
        this.qAOrderDetails.bPkgDetails.filter(item => item.ProductTypeId === orderDetails.ProductTypeId)
        .map((object, index) => {
          this.pkgAssignArr.push(this.createAssignPkgItem(object, index));
        });
      } else if (String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'OIL') {
        this.qAOrderDetails.cPkgDetails.filter(item => item.ProductTypeId === orderDetails.ProductTypeId)
        .map((object, index) => {
          this.pkgAssignArr.push(this.createAssignPkgItem(object, index));
        });
      }
    } else {
      if (String(orderDetails.value.skewKeyName).toLocaleUpperCase() === 'BUD') {
        this.qAOrderDetails.aPkgDetails.filter(item => item.ProductTypeId === orderDetails.value.ProductTypeId)
        .map((object, index) => {
          this.pkgAssignArr.push(this.createAssignPkgItem(object, index));
        });
      } else if (String(orderDetails.value.skewKeyName).toLocaleUpperCase() === 'JOINTS') {
        this.qAOrderDetails.bPkgDetails.filter(item => item.ProductTypeId === orderDetails.value.ProductTypeId)
        .map((object, index) => {
          this.pkgAssignArr.push(this.createAssignPkgItem(object, index));
        });
      } else if (String(orderDetails.value.skewKeyName).toLocaleUpperCase() === 'OIL') {
        this.qAOrderDetails.cPkgDetails.filter(item => item.ProductTypeId === orderDetails.value.ProductTypeId)
        .map((object, index) => {
          this.pkgAssignArr.push(this.createAssignPkgItem(object, index));
        });
      }
    }
    this.checkIfAllSelected(null);

    this.showAssignPkgModal = true;
  }

  getMixLotDetails(pkgItemDetails, value) {
    if (value === 1) {
      return this.qAOrderDetails.aMixPkgDetails.filter(item =>
        item.ProductTypeId === pkgItemDetails.value.productTypeId && item.MixPkgId === pkgItemDetails.value.mixPkgId
      );
    } if (value === 2) {
      return this.TaskModel.BudMixPkgLotDetails.filter(item =>
        item.ProductTypeId === pkgItemDetails.value.productTypeId && item.MixPkgId === pkgItemDetails.value.mixPkgId
      );
    } else {
      return this.TaskModel.BudMixPkgLotDetails.filter(item =>
        item.ProductTypeId === pkgItemDetails.ProductTypeId && item.MixPkgId === pkgItemDetails.MixPkgId
      );
    }
  }

  getJointsMixLotDetails(pkgItemDetails, value) {
    if (value === 1) {
      return this.qAOrderDetails.bMixPkgDetails.filter(item =>
        item.ProductTypeId === pkgItemDetails.value.productTypeId && item.MixPkgId === pkgItemDetails.value.mixPkgId
      );
    } if (value === 2) {
      return this.TaskModel.JointsMixPkgLotDetails.filter(item =>
        item.ProductTypeId === pkgItemDetails.value.productTypeId && item.MixPkgId === pkgItemDetails.value.mixPkgId
      );
    } else {
      return this.TaskModel.JointsMixPkgLotDetails.filter(item =>
        item.ProductTypeId === pkgItemDetails.ProductTypeId && item.MixPkgId === pkgItemDetails.MixPkgId
      );
    }
  }
   // To show completion or review details of selected product type on action details page
   getAssignedPkgInfo(orderDetails) {
    this.showProductTypePkgDetailsModal = true;
    this.selectedProductType = orderDetails;

    // To Get QA Failed Reasons
    this.getQAIssueTypes(orderDetails.SkewKeyName);
    this.productTypePkgDetails = String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'BUD' ?
                        this.TaskModel.AssignBudPkgDetails
                          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId) :

                          String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'JOINTS' ?
                          this.TaskModel.AssignJointsPkgDetails
                          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId) :

                          String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'OIL' ?
                          this.TaskModel.AssignOilPkgDetails
                          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId) : [];

      this.qaPkgItemDetailsForm.setControl('qaPkgItemArr', this.fb.array([]));

      this.productTypePkgDetails.map((object, index) => {
        this.qaPkgItemArr.push(this.createPkgItem(object, index));
      });

  }

  createItem(object, index): FormGroup {
    return this.fb.group({
      // assignQty: new FormControl(object.RequiredQty, [Validators.max(object.RequiredQty)]),
      orderId: object.OrderId,
      // Modified by Devdan :: 19-Oct-2018
      ProductTypeId:  object.ProductTypeId,
      brandName:  object.BrandName,
      subBrandName: object.SubBrandName,
      strainId: object.StrainId,
      strainName: object.StrainName,
      pkgTypeName: object.PkgTypeName,
      unitValue: object.UnitValue,
      itemQty: object.ItemQty,
      qty: object.Qty,
      skewKeyName: object.SkewKeyName
    });
  }

  createAssignPkgItem(object, index): FormGroup {
    let pkgSelectedBox;

    const pkgsSelectedDetails = this.selectedPkgsMap[object.ProductTypeId];

      if (pkgsSelectedDetails) {

        const pkgRowDetails = [];
        pkgsSelectedDetails.forEach(data => {
          // Added by Devdan :: 18-Oct-2018
          if (this.taskTypeId > 0 && object.OrdProdItemId === data.ordProdItemId ) {
          pkgRowDetails.push(data);
        } else if (data.index === index) {
            pkgRowDetails.push(data);
          }
        });

        if (pkgRowDetails.length) {
          pkgSelectedBox = pkgRowDetails[0].pkgSelected;
        } else {
          pkgSelectedBox = [false];
        }
      } else {
        pkgSelectedBox = [false];
      }

    return this.fb.group({
      pkgSelected: pkgSelectedBox,
      packageCode: object.PackageCode,
      skewKeyName: object.SkewKeyName,
      lotId: object.LotId,
      growerLotNo: object.GrowerLotNo,
      oilPkgId: object.OilPkgId,
      oilPkgCode: object.OilPkgCode,
      productTypeId: object.ProductTypeId,
      ordProdItemId: Number(object.OrdProdItemId),
      mixPkgId: Number(object.MixPkgId),
      lotNoteCount: object.LotNoteCount
    });
  }

  createPkgItem(object, index): FormGroup {
    let qaFailBox, issueTypeBox, commentBox;

    qaFailBox = [null];
    issueTypeBox = [null];
    commentBox = [null];

    const pkgsSelectedDetails = this.selectedFailedPkgsMap[object.ProductTypeId];

      if (pkgsSelectedDetails) {

        const pkgRowDetails = [];

        pkgsSelectedDetails.forEach(data => {
          // Added by Devdan :: 18-Oct-2018
          if (this.taskTypeId > 0 && object.OrdProdItemId === data.ordProdItemId ) {
          pkgRowDetails.push(data);
          } else if (data.index === index) {
            pkgRowDetails.push(data);
          }
        });

        if (pkgRowDetails.length) {
          qaFailBox = pkgRowDetails[0].isQAFail;
          issueTypeBox = pkgRowDetails[0].isQAFail ? [pkgRowDetails[0].issueType, Validators.required]
                                                    : [null];
          commentBox = [pkgRowDetails[0].comment];
        } else {
          qaFailBox = [null];
          issueTypeBox = [null];
          commentBox = [null];
        }
      } else {
        qaFailBox = [null];
        issueTypeBox = [null];
        commentBox = [null];
      }

    return this.fb.group({
      ordProdItemId: object.OrdProdItemId,
      productTypeId: object.ProductTypeId,
      packageCode: object.PackageCode,
      skewKeyName: object.SkewKeyName,
      lotId: object.LotId,
      growerLotNo: object.GrowerLotNo,
      oilPkgId: object.OilPkgId,
      oilPkgCode: object.OilPkgCode,
      isQAFail: qaFailBox,
      issueType: issueTypeBox,
      comment: commentBox,
      mixPkgId: Number(object.MixPkgId),
      lotNoteCount: object.LotNoteCount
    });
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr((size * -1), size);
  }

  // Submit Assign Package Details
  submitPkgAssignDetails(pkgAssignFormModel) {
    const pkgAssignDetails = [];

    pkgAssignFormModel.value.pkgAssignArr.forEach((result, index) => {
      if (result.pkgSelected === true) {
        pkgAssignDetails.push(
          {
            pkgSelected: true,
            lotId: result.lotId,
            growerLotNo: result.growerLotNo,
            index: index,
            skewKeyName: result.skewKeyName,
            oilPkgId: result.oilPkgId,
            oilPkgCode: result.oilPkgCode,
            packageCode: result.packageCode,
            productTypeId: result.productTypeId,
            ordProdItemId: result.ordProdItemId,
            mixPkgId: result.mixPkgId
          }
        );
      }
    });
    this.selectedPkgsMap[this.selectedProductType.ProductTypeId] = pkgAssignDetails;
    // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
    // localStorage.setItem('selectedPkgsAssignArray', JSON.stringify(this.selectedPkgsMap));
    this.appCommonService.setLocalStorage('selectedPkgsAssignArray', JSON.stringify(this.selectedPkgsMap));
    this.showAssignPkgModal = false;
  }

  checkIfAllSelected(pkgItemDetails) {
    if (this.pkgAssignArr.value.filter(data => data.pkgSelected === false).length > 0 ) {
      this.chkSelectAll = false;
    } else {
      this.chkSelectAll = true;
    }
  }

  changeValidator(selected, index) {
    const issueTypeBox = this.qaPkgItemDetailsForm.get('qaPkgItemArr.' + index).get('issueType');
    const commentBox = this.qaPkgItemDetailsForm.get('qaPkgItemArr.' + index).get('comment');

    // if (selected) {
    //   issueTypeBox.enable();
    //   // commentBox.enable();
    // } else {
    //   issueTypeBox.disable();
    //   // commentBox.disable();
    // }

    const validators = selected ? Validators.compose([Validators.required]) :  null;
    issueTypeBox.setValidators(validators);
    issueTypeBox.updateValueAndValidity();
  }

  // Get Failed or Passed Packages info after completion
  getPkgsInfo(orderDetails, Flag, value) {
    this.showProductTypePkgsDetailsModal = true;

    this.selectedProductType = orderDetails;
    this.selectedProductType['Flag'] = Flag;

    if (String(Flag).toLocaleUpperCase() === 'FAIL') {

      this.productTypePkgDetails = String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'BUD' ?
      this.TaskModel.AssignBudPkgDetails
        .filter(result => result.ProductTypeId === orderDetails.ProductTypeId && result.IsQAFail === true) :

        String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'JOINTS' ?
        this.TaskModel.AssignJointsPkgDetails
        .filter(result => result.ProductTypeId === orderDetails.ProductTypeId && result.IsQAFail === true) :

        String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'OIL' ?
        this.TaskModel.AssignOilPkgDetails
        .filter(result => result.ProductTypeId === orderDetails.ProductTypeId && result.IsQAFail === true) : [];

    } else if (String(Flag).toLocaleUpperCase() === 'PASS') {

      this.productTypePkgDetails = String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'BUD' ?
        this.TaskModel.AssignBudPkgDetails
          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId && result.IsQAFail === false) :

          String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'JOINTS' ?
          this.TaskModel.AssignJointsPkgDetails
          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId && result.IsQAFail === false) :

          String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'OIL' ?
          this.TaskModel.AssignOilPkgDetails
          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId && result.IsQAFail === false) : [];

    } else if (String(Flag).toLocaleUpperCase() === 'ASSIGN') {
      // this.productTypePkgDetails = [].concat(this.TaskModel.AssignBudPkgDetails,  this.TaskModel.AssignJointsPkgDetails);
      this.productTypePkgDetails = String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'BUD' ?
        this.TaskModel.AssignBudPkgDetails
          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId) :

          String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'JOINTS' ?
          this.TaskModel.AssignJointsPkgDetails
          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId) :

          String(orderDetails.SkewKeyName).toLocaleUpperCase() === 'OIL' ?
          this.TaskModel.AssignOilPkgDetails
          .filter(result => result.ProductTypeId === orderDetails.ProductTypeId) : [];
    }
  }

  selectAll() {
    this.pkgAssignArr.controls.forEach(data => {
      (<FormGroup>data).controls['pkgSelected'].patchValue(this.chkSelectAll);
    });
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.QACHECK.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }
  // Submit Details of QA Package Item
  submitQAPkgItemDetails(pkgDetailsModel) {
    const pkgAssignDetails = [];
    if (this.qaPkgItemDetailsForm.valid) {
      pkgDetailsModel.value.qaPkgItemArr.forEach((result, index) => {
        // if (result.isQAFail === true) {
          pkgAssignDetails.push(
            {
              index: index,
              productTypeId: this.selectedProductType.ProductTypeId,
              packageCode: result.packageCode,
              lotId: result.lotId,
              growerLotNo: result.growerLotNo,
              oilPkgId: result.oilPkgId,
              oilPkgCode: result.oilPkgCode,
              isQAFail: result.isQAFail ? result.isQAFail : false,
              issueType: result.issueType,
              comment: result.comment,
              ordProdItemId: Number(result.ordProdItemId),
              mixPkgId: result.mixPkgId ? result.mixPkgId : 0
            }
          );
        // }
      });

      this.selectedFailedPkgsMap[this.selectedProductType.ProductTypeId] = pkgAssignDetails;
      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // localStorage.setItem('selectedFailedPkgsArray', JSON.stringify(this.selectedFailedPkgsMap));
      this.appCommonService.setLocalStorage('selectedFailedPkgsArray', JSON.stringify(this.selectedFailedPkgsMap));
      this.showProductTypePkgDetailsModal = false;
    } else {
      this.appCommonService.validateAllFields(this.qaPkgItemDetailsForm);
    }
  }

  // Submit Completion Parameters
  submitCompleteParameter(formModel) {
    let completePkgDetailsForApi;

    if (this.completionForm.valid === true) {
      completePkgDetailsForApi = {
        TaskDetails: {
          TaskId: Number(this.taskId),
          VirtualRoleId: 0,
          Comment: formModel.MiscComment ? formModel.MiscComment : '',
          MiscCost: Number(formModel.MiscCost),
          TaskKeyName: 'QA-CHECK'
        },
        ProductTypeDetails: []
      };

      this.TaskModel.AssignOrderPkgQtyDetails.forEach((element1: any) => {
        if (this.selectedFailedPkgsMap[element1.ProductTypeId] !== undefined) {
          (<any>this.selectedFailedPkgsMap[element1.ProductTypeId]).forEach(item => {
            completePkgDetailsForApi['ProductTypeDetails'].push(
              {
                  ProductTypeId: Number(element1.ProductTypeId),
                  OrdProdItemId: Number(item.ordProdItemId),
                  LotId: Number(item.lotId) ? Number(item.lotId) : 0,
                  SkewKeyName: element1.SkewKeyName,
                  OilPkgId: item.oilPkgId ? item.oilPkgId : 0,
                  PackageCode: item.packageCode ? String(item.packageCode) : '',
                  IsQAFail: item.isQAFail,
                  QAFailReason: item.issueType,
                  Comment: item.comment ? item.comment : '',
                  MixPkgId: item.mixPkgId ? item.mixPkgId : 0
              });
          });
        }
      });

      if (!completePkgDetailsForApi['ProductTypeDetails'].length) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.verifypkgs });

        return;
      }

    this.confirmationService.confirm({
      message: this.assignTaskResources.taskcompleteconfirm,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
          // http call starts
          this.loaderService.display(true);

          this.taskCommonService.completeTask(completePkgDetailsForApi)
            .subscribe(data => {
              if (String(data).toLocaleUpperCase() === 'NOCOMPLETE') {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });

                if (this.TaskModel.IsReview === true) {
                  this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                } else {
                  this.TaskModel.TaskStatus = this.taskStatus.Completed;
                }

                this.loaderService.display(false);
              } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });

                setTimeout(() => {
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                    this.router.navigate(['home/dashboard/managerdashboard']);
                  } else {
                    this.router.navigate(['home/dashboard/empdashboard']);
                  }

                  this.loaderService.display(false);
                }, 1000);
              } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });

                this.loaderService.display(false);
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
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                    this.router.navigate(['home/dashboard/managerdashboard']);
                  } else {
                    this.router.navigate(['home/dashboard/empdashboard']);
                  }

                  this.loaderService.display(false);
                }, 1000);
              }
              // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
              // this.refreshService.PushChange().subscribe(
              //   msg => {
              //   });
            }
          );
        },
        reject: () => {
            // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
        }
    });
      // this.PageFlag.showmodal = false;
      // http call ends
    } else {
      this.appCommonService.validateAllFields(this.completionForm);
    }
  }

  // Created by Devdan :: 18-Oct-2018 :: to set the ng model values
  setFormInEditMode() {
    this.TaskModel.QACHECK = {
      startdate: this.TaskModel.startdate,
      priority: this.TaskModel.TaskDetails.TaskPriority,
      notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
      notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
      usercomment: this.TaskModel.QACheckTaskDetails.Comment,
      orderno: this.TaskModel.TaskDetails.OrderId,
      employee: this.TaskModel.TaskDetails.EmpId,
    };
  }
  // Added by Devdan :: 18-Oct-2018 :: Setting existing lot list
  setSelectedLotDetails() {
    const pkgAssignDetails = [];
    let Package: any;
    if (this.TaskModel.QACheckBudPkgDetails.length > 0) {
      Package = this.TaskModel.QACheckBudPkgDetails;
      Package.forEach(QAPkg => {
        if (QAPkg.ProductTypeId === this.selectedProductType.ProductTypeId) {
          pkgAssignDetails.push(
            {
              pkgSelected: true,
              lotId: QAPkg.LotId,
              growerLotNo: QAPkg.GrowerLotNo,
              index: '',
              skewKeyName: QAPkg.SkewKeyName,
              oilPkgId: QAPkg.OilPkgId,
              oilPkgCode: QAPkg.OilPkgCode,
              packageCode: QAPkg.PackageCode,
              productTypeId: QAPkg.ProductTypeId,
              ordProdItemId: QAPkg.OrdProdItemId,
              mixPkgId: QAPkg.MixPkgId
            }
          );
          this.selectedPkgsMap[this.selectedProductType.ProductTypeId] = pkgAssignDetails;
        }
      });
    }

    if (this.TaskModel.QACheckOilPkgDetails.length > 0) {
      Package = this.TaskModel.QACheckOilPkgDetails;
      Package.forEach(QAPkg => {
        if (QAPkg.ProductTypeId === this.selectedProductType.ProductTypeId) {
          pkgAssignDetails.push(
            {
              pkgSelected: true,
              lotId: QAPkg.LotId,
              growerLotNo: QAPkg.GrowerLotNo,
              index: '',
              skewKeyName: QAPkg.SkewKeyName,
              oilPkgId: QAPkg.OilPkgId,
              oilPkgCode: QAPkg.OilPkgCode,
              packageCode: QAPkg.PackageCode,
              productTypeId: QAPkg.ProductTypeId,
              ordProdItemId: QAPkg.OrdProdItemId,
              mixPkgId: QAPkg.MixPkgId
            }
          );
          this.selectedPkgsMap[this.selectedProductType.ProductTypeId] = pkgAssignDetails;
        }
      });
    }

    if (this.TaskModel.QACheckJointPkgDetails.length > 0) {
      Package = this.TaskModel.QACheckJointPkgDetails;

      Package.forEach(QAPkg => {
        if (QAPkg.ProductTypeId === this.selectedProductType.ProductTypeId) {
          pkgAssignDetails.push(
            {
              pkgSelected: true,
              lotId: QAPkg.LotId,
              growerLotNo: QAPkg.GrowerLotNo,
              index: '',
              skewKeyName: QAPkg.SkewKeyName,
              oilPkgId: QAPkg.OilPkgId,
              oilPkgCode: QAPkg.OilPkgCode,
              packageCode: QAPkg.PackageCode,
              productTypeId: QAPkg.ProductTypeId,
              ordProdItemId: QAPkg.OrdProdItemId,
              mixPkgId: QAPkg.MixPkgId
            }
          );
          this.selectedPkgsMap[this.selectedProductType.ProductTypeId] = pkgAssignDetails;
        }
      });
    }
    // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
    // localStorage.setItem('selectedPkgsAssignArray', JSON.stringify(this.selectedPkgsMap));
    this.appCommonService.setLocalStorage('selectedPkgsAssignArray', JSON.stringify(this.selectedPkgsMap));
  }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }
}
