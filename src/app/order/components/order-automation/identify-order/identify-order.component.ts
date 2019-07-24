import { DropdwonTransformService } from './../../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from './../../../../shared/services/dropdown-values.service';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, Message } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCommonService } from '../../../../shared/services/app-common.service';
import { OrderResource } from '../../../order.resource';
import { GlobalResources } from '../../../../global resource/global.resource';

@Component({
  selector: 'app-identify-order',
  templateUrl: './identify-order.component.html',
  styles: [`
  :host::ng-deep .clsTabPanelBackground {
      background:#ebebeb !important;
    }
  .markRowAsRed {
    color: #f72c2c !important;
  }
  div.tblProductSKU .ui-table .ui-table-tbody>tr>td {
    word-break: break-word !important;
  }
  `]
})
export class IdentifyOrderComponent implements OnInit {
  identifyProductForm: FormGroup;
  public globalResource: any;
  public identifyProductResource: any;
  public incomingOrderId: any;
  public incomingOrderDetails: any;
  public incomingOrderItems: any;
  public tempStrainName: any;
  public tabindexcount = 8;
  public cookie_clientId: any;
  public cookie_virtualRoleId: any;
  brands: any[];
  subbrands: any[];
  strains: any[];
  packagetypes: any[];
  skewtypes: any[];
  public msgs: Message[] = [];

  private globalData = {
    brands: [],
    strains: [],
    skewtypes: [],
    packagetypes: []
  };

  public BrandInfo: any = {
    BrandName: null,
    showBrandModal: false
  };

  public SubBrandInfo: any = {
    SubBrandName: null,
    showSubBrandModal: false,
    allBrands: []
  };

  public StrainInfo: any = {
    StrainName: null,
    thc: null,
    cbd: null,
    total: null,
    showStrainModal: false
  };

  public PackageTypeInfo: any = {
    PackageTypeName: null,
    Description: null,
    showPackageTypeModal: false
  };

  constructor(private orderService: OrderService,
    private loaderService: LoaderService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private appCommonService: AppCommonService,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.identifyProductResource = OrderResource.getResources().en.identifyProduct;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.identifyProductResource.identifyProducttitle);
    this.cookie_clientId = this.appCommonService.getUserProfile().ClientId;
    this.cookie_virtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    this.loaderService.display(true);
    this.getAllBrands(0);
    this.getAllStrains(0);
    this.getAllPackageType(0);
    this.getAllSkew();
    this.createIdetifyProductForm();
    if (this.route.snapshot.params.incomingOrderId) {
      this.getIncomingOrderDetails();
    }
  }

  createIdetifyProductForm() {
    this.identifyProductForm = this.fb.group({
      productItemArr: new FormArray([])
    });
  }

  get productItemArr() {
    return this.identifyProductForm.get('productItemArr') as FormArray;
  }

  addItem(): void {
    let arrayItem;
    arrayItem = this.identifyProductForm.get('productItemArr') as FormArray;
    this.incomingOrderItems.forEach(incomingOrderItems => {
      arrayItem.push(this.createItem(incomingOrderItems));
    });
  }
  createItem(incomingOrderItems): FormGroup {
    return this.fb.group({
      'incomingOrderId': new FormControl(incomingOrderItems.IncomingOrderId),
      'orderItemId': new FormControl(incomingOrderItems.OrderItemId),
      'leafProductName': new FormControl(incomingOrderItems.LeafProductName),
      'productType': new FormControl(incomingOrderItems.ProductTypeId),
      'skewType': new FormControl(incomingOrderItems.SkewTypeId, Validators.compose([Validators.required])),
      'skewTypeName': new FormControl(incomingOrderItems.SkewType),
      'brand': new FormControl(incomingOrderItems.BrandId, Validators.compose([Validators.required])),
      'brandName': new FormControl(incomingOrderItems.BrandName),
      'subBrand': new FormControl(incomingOrderItems.SubBrandId),
      'subBrandName': new FormControl(incomingOrderItems.SubBrandName),
      'strain': new FormControl(incomingOrderItems.StrainId, Validators.compose([Validators.required])),
      'strainName': new FormControl(incomingOrderItems.StrainName),
      'pkgType': new FormControl(incomingOrderItems.PkgTypeId, Validators.compose([Validators.required])),
      'pkgTypeName': new FormControl(incomingOrderItems.PkgType),
      'pkgSize': new FormControl(incomingOrderItems.PkgSize, Validators.compose([Validators.required, Validators.min(0.1), Validators.maxLength(10)])),
      'itemQty': new FormControl(incomingOrderItems.SkewType === 'BUD' || incomingOrderItems.SkewType === 'OIL' ? 1 : incomingOrderItems.ItemQty,
        Validators.compose([Validators.required, Validators.min(1)])),
      'unitPrice': new FormControl(incomingOrderItems.UnitPrice, Validators.compose([Validators.required])),
      'chkIsInvalidProductItem': new FormControl(incomingOrderItems.IsInvalid),
    });
  }

  backIncomingOrderList() {
    this.appCommonService.navIncomingOrder.isBackClicked = true;
    this.router.navigate(['../home/orderlisting']);
  }

  getIncomingOrderDetails() {
    this.loaderService.display(true);
    this.orderService.getIncomingOrderDetailssById(this.route.snapshot.params.incomingOrderId).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.incomingOrderDetails = data.Table;
          this.incomingOrderItems = data.Table1;
          if ( this.incomingOrderDetails) {
            if ( this.incomingOrderDetails[0].IsIdentified) {
              this.router.navigate(['../home/acceptorder/' + this.incomingOrderDetails[0].IncomingOrderId]);
            }
          }
          if (this.incomingOrderItems) {
            this.addItem();
          }
         // this.loaderService.display(false);
        }
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Order Incoming complete'));
  }

  onBrandSave(BrandId) {
    this.getAllBrands(BrandId);
    // const brand = this.identifyProductForm.controls['brand'];
    // brand.patchValue(BrandId);
  }

  getAllBrands(brandId) {
    let brandArray: any;
    this.dropdownDataService.getBrands().subscribe(
      data => {
        this.globalData.brands = data;
        this.brands = this.dropdwonTransformService.transform(data.filter(x => x.ParentId === 0), 'BrandName', 'BrandId', '-- Select --');
        this.SubBrandInfo.allBrands = this.brands;

        if (brandId > 0) {
          brandArray = this.brands.filter(r => Number(r.value) === Number(brandId));
          const tempBrandName = brandArray[0].label;
          let arrayItem;
          arrayItem = this.identifyProductForm.get('productItemArr') as FormArray;
          arrayItem.controls.forEach(e => {

            if (String(e.controls['brandName'].value) === String(tempBrandName)) {
              const tampStrain = e.controls['brand'];
              tampStrain.patchValue(brandId);
            }
          });
        }
        this.getSubBrands();
      },
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }

  getSubBrands() {
    this.subbrands = this.dropdwonTransformService.transform(this.globalData.brands.filter(
      data => data.ParentId === this.identifyProductForm.value.brand), 'SubBrandName', 'SubBrandId', '-- Select --');
  }

  getDynamicSubBrands(productItem) {
    // console.log('Get all sub brands complete');
    return this.dropdwonTransformService.transform(this.globalData.brands.filter(
      data => data.ParentId === productItem.value.brand), 'SubBrandName', 'SubBrandId', '-- Select --');
  }

  addNewBrand() {
    this.showBrandPopup();
  }

  showBrandPopup() {
    this.BrandInfo.brand = null;
    this.BrandInfo.showBrandModal = true;
    this.loaderService.display(false);
  }

  onSubBrandSave(OnBrandSave) {
    this.getAllSubBrands(OnBrandSave.SubBrand, OnBrandSave.Brand);
  }

  getAllSubBrands(subBrandId, brand) {
    let subBrandArray: any;
    this.dropdownDataService.getBrands().subscribe(
      data => {
        this.globalData.brands = data;
        this.SubBrandInfo.allBrands = this.brands;
        if (subBrandId > 0) {
          subBrandArray = this.globalData.brands.filter(r => Number(r.SubBrandId) === Number(subBrandId));
          const tempBrandName = subBrandArray[0].SubBrandName;
          this.subbrands = this.dropdwonTransformService.transform(this.globalData.brands.filter(
            r => r.ParentId === brand), 'SubBrandName', 'SubBrandId', '-- Select --');
          let arrayItem;
          arrayItem = this.identifyProductForm.get('productItemArr') as FormArray;
          arrayItem.controls.forEach(e => {
            if (String(e.controls['subBrandName'].value) === String(tempBrandName)) {
              const tampStrain = e.controls['subBrand'];
              tampStrain.patchValue(subBrandId);
            }
           // e.controls['subBrand'].patchValue(subBrandId);
          });
        }
      },
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }

  onCancel() {

  }

  addnewSubBrand() {
    this.showSubBrandPopup();
  }

  showSubBrandPopup() {
    this.SubBrandInfo.subbrand = null;
    this.SubBrandInfo.showSubBrandModal = true;
    this.getAllBrands(0);
    this.loaderService.display(false);
  }

  addNewStrain() {
    this.showStrainPopup();
  }

  getAllStrains(strainId) {
    let strainArray: any;
    this.dropdownDataService.getStrains().subscribe(
      data => {
        this.globalData.strains = data;
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');
        if (strainId > 0) {
          strainArray = this.strains.filter(r => Number(r.value) === Number(strainId));
          const tempStrainName = strainArray[0].label;
          let arrayItem;
          arrayItem = this.identifyProductForm.get('productItemArr') as FormArray;
          arrayItem.controls.forEach(e => {

            if (String(e.controls['strainName'].value) === String(tempStrainName)) {
              const tampStrain = e.controls['strain'];
              tampStrain.patchValue(strainId);
            }
          });
        }
      },
      error => { console.log(error); },
      () => console.log('Get all strains complete'));
  }

  onStrainSave(StrainId) {
    this.getAllStrains(StrainId);
    const strain = this.identifyProductForm.controls['strain'];
    if (strain) {
      strain.patchValue(StrainId);
    }
  }

  showStrainPopup() {
    this.StrainInfo.strain = null;
    this.StrainInfo.thc = null;
    this.StrainInfo.cbd = null;
    this.StrainInfo.total = null;
    this.StrainInfo.showStrainModal = true;
    this.loaderService.display(false);
  }

  addNewPackageType() {
    this.showPackageTypePopup();
  }

  onPackageTypeSave(pkgTypeId) {
    this.getAllPackageType(pkgTypeId);
  }

  getAllPackageType(pkgTypeId) {
    let Pkgarry: any;
    this.dropdownDataService.getPackageTypeList().subscribe(
      data => {
        this.globalData.packagetypes = data;
        this.packagetypes = this.dropdwonTransformService.transform(data, 'PkgTypeName', 'PkgTypeId', '-- Select --');
        if (pkgTypeId > 0) {
          Pkgarry = this.packagetypes.filter(r => Number(r.value) === Number(pkgTypeId));
          const tempPkgName = Pkgarry[0].label;
          let arrayItem;
          arrayItem = this.identifyProductForm.get('productItemArr') as FormArray;
          arrayItem.controls.forEach(e => {
            if (String(e.controls['pkgTypeName'].value) === String(tempPkgName)) {
              const tampPkg = e.controls['pkgType'];
              tampPkg.patchValue(pkgTypeId);
            }
          });
        }
      },
      error => { console.log(error); },
      () => console.log('Get all package types complete'));
  }

  showPackageTypePopup() {
    this.PackageTypeInfo.PackageTypeName = null;
    this.PackageTypeInfo.Description = null;
    this.PackageTypeInfo.showPackageTypeModal = true;
    this.loaderService.display(false);
  }

  getAllSkew() {
    this.dropdownDataService.getSkewListByClient().subscribe(
      data => {
        if (String(data).toLocaleUpperCase() !== 'NO DATA FOUND!') {
          this.globalData.skewtypes = data;
          // tslint:disable-next-line:max-line-length
          this.skewtypes = this.dropdwonTransformService.transform(data, 'SkwTypeName', 'SkwTypeName', '-- Select --');
        } else {
          this.globalData.skewtypes = [];
          this.skewtypes = [];
        }
      },
      error => { console.log(error); },
      () => console.log('Get all skew types complete'));
  }

  invalidProductSelect(s, event, productItem) {
    const skewTypebox = this.identifyProductForm.get('productItemArr.' + s).get('skewType');
    let skewTypevalidators;
    skewTypevalidators = !event ? Validators.compose([Validators.required]) : null;
    skewTypebox.setValidators(skewTypevalidators);
    skewTypebox.updateValueAndValidity();

    const brandbox = this.identifyProductForm.get('productItemArr.' + s).get('brand');
    let brandvalidators;
    brandvalidators = !event ? Validators.compose([Validators.required]) : null;
    brandbox.setValidators(brandvalidators);
    brandbox.updateValueAndValidity();

    const strainbox = this.identifyProductForm.get('productItemArr.' + s).get('strain');
    let strainvalidators;
    strainvalidators = !event ? Validators.compose([Validators.required]) : null;
    strainbox.setValidators(strainvalidators);
    strainbox.updateValueAndValidity();

    const pkgTypebox = this.identifyProductForm.get('productItemArr.' + s).get('pkgType');
    let pkgTypevalidators;
    pkgTypevalidators = !event ? Validators.compose([Validators.required]) : null;
    pkgTypebox.setValidators(pkgTypevalidators);
    pkgTypebox.updateValueAndValidity();

    const pkgSizebox = this.identifyProductForm.get('productItemArr.' + s).get('pkgSize');
    let pkgSizevalidators;
    pkgSizevalidators = !event ? Validators.compose([Validators.required, Validators.min(0.1)]) : null;
    pkgSizebox.setValidators(pkgSizevalidators);
    pkgSizebox.updateValueAndValidity();

    const itemQtybox = this.identifyProductForm.get('productItemArr.' + s).get('itemQty');
    let itemQtyvalidators;
    itemQtyvalidators = !event ? Validators.compose([Validators.required, Validators.min(1)]) : null;
    itemQtybox.setValidators(itemQtyvalidators);
    itemQtybox.updateValueAndValidity();

    const unitPricebox = this.identifyProductForm.get('productItemArr.' + s).get('unitPrice');
    let unitPricevalidators;
    unitPricevalidators = !event ? Validators.compose([Validators.required]) : null;
    unitPricebox.setValidators(unitPricevalidators);
    unitPricebox.updateValueAndValidity();
  }

  onSubmit(model) {
    this.loaderService.display(true);
    let identifyDetailsForApi;
    identifyDetailsForApi = {
      orderDetails: {
        IncomingOrderId: this.incomingOrderDetails[0].IncomingOrderId,
        ClientId: this.cookie_clientId,
        VirtualRoleId: this.cookie_virtualRoleId,
        RetailerId: this.incomingOrderDetails[0].RetailerId,
        RetailerName: this.incomingOrderDetails[0].RetailerName,
        S2OrderNo: this.incomingOrderDetails[0].S2OrderNo,
        UBINo: this.incomingOrderDetails[0].UBINo
      },
      productItemDetails: []
    };

    this.productItemArr.controls.forEach((element, index) => {
      identifyDetailsForApi.productItemDetails.push({
        OrderItemId: element.value.orderItemId,
        LeafProductName: element.value.leafProductName,
        SkewType: element.value.skewTypeName,
        BrandId: element.value.brand ? element.value.brand : 0,
        SubBrandId: element.value.subBrand ? element.value.subBrand : 0,
        StrainId: element.value.strain ? element.value.strain : 0,
        PkgTypeId: element.value.pkgType ? element.value.pkgType : 0,
        PkgSize: element.value.pkgSize ? element.value.pkgSize : 0,
        ItemQty: element.value.itemQty,
        UnitPrice: element.value.unitPrice,
        IsInvalidProduct: element.value.chkIsInvalidProductItem,
        IndexCode: index
      });
    });
    if (this.identifyProductForm.valid) {
      this.orderService.saveIdentifyOrder(identifyDetailsForApi)
        .subscribe(
          data => {
            if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
              this.loaderService.display(false);
              setTimeout(() => {
                this.confirmationService.confirm({
                  message: this.identifyProductResource.identifysave,
                  key: 'identifyOrderconfirm',
                  rejectVisible: false,
                  acceptLabel: 'Ok',
                  accept: () => {
                    if ( this.incomingOrderDetails[0].IncomingOrderId > 0 && !data[0].IsChangeOrder && data[0].IsIdentified) {
                    this.router.navigate(['../home/acceptorder/' + this.incomingOrderDetails[0].IncomingOrderId]);
                  } else if ( this.incomingOrderDetails[0].IncomingOrderId > 0 && data[0].IsChangeOrder && data[0].IsIdentified) {
                    this.router.navigate(['../home/changeOrder/' + this.incomingOrderDetails[0].IncomingOrderId]);
                  }
                }
              });
            }, 1000);
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Duplicate S2Order No' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'RETAILERNAMEEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Retailar not provided.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'S2ORDERNOEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'S2Order no not provided.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'S2ORDERNOEXISTS') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'S2Order No already Exists' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'SKEWTYPEEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please Select Skew Type.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'BRANDEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please Select or Add Brand.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'BRANDNOTEXIST') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Selected Brand not exists.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'STRAINEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please Select or Add Strain.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'STRAINNOTEXIST') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Selected Strain not exists.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'PKGTYPEEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please Select or Add Pkg Type' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'PKGTYPENOTEXIST') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Selected Pkg Type not exists.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'PKGSIZEEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please enter package Size' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'ITEMQTYEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please enter Item Qty.' });
            } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'UNITPRICEEMPTY') {
              this.msgs = [];
              this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please enter Unit Price.' });
            }
          });
      // http call ends
      this.loaderService.display(false);
    } else {
      this.appCommonService.validateAllFields(this.identifyProductForm);
      this.loaderService.display(false);
    }
  }
  onChange_pkgType () {

  }

  onChange_subBrand() {

  }
}
