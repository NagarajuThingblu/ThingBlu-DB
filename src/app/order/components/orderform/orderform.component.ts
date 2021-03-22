
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl,FormArray } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import * as _ from 'lodash';
import { OrderResource } from '../../order.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { OrderService } from './../../service/order.service';
import { AppConstants } from '../../../shared/models/app.constants';



@Component({
  moduleId: module.id,
  selector: 'app-orderform',
  templateUrl: './orderform.component.html',
  styles: [`
    .clsTableSelection tr.ui-state-highlight {
      background: transparent !important;
      color: #222222 !important;
      cursor: pointer;
    }

    .clsTableSelection tr:nth-child(even).ui-state-highlight {
      background: transparent !important;
      color: #222222 !important;
      cursor: pointer;
    }

    .clsTableSelection .ui-state-highlight a {
        color: #222222 !important;
    }
  `]
})
export class OrderformComponent implements OnInit {
  orderForm: FormGroup;
  globalResource: any;
 
  customersList: any[];
  Customers: any[];
  strains: any[];
  producttype: any[];
  // skewtype:any[];
  public skewtype = [];
  public SkewType =[];
  public packagetype =[];
  public packagesize =[];
  // packagetypes: any[];
  // packagetype: any[];
  // packagesizes:any[];
  productIds:any[];
  shippingaddress:any;
  email:any;
  country:any;
  state:any;
  city:any;
  cityid:any;
  zipcode:any;
  shippingpref:any;
  public priorities:any;
  public _cookieService: any;
  public defaultDate: Date = new Date();
  sysmbol:any;
  // public plusOnEdit: boolean = true;
  public allProductTypeList: any;
   dropdownsData: any;
  paginationValues: any;
  public saveButtonText = 'save';
  submitted: boolean;
  public newSectionForm_copy: any;
  public msgs: any[];
  
  public allOrders: any;
  public orderTabSelected = true;
  event: any;
  public orderrequestResource: any;
  orderformDetails = {
    strain: null,
    packagetype: null,
    packagesize: null,
    orderqt: null,
    ordercost: null,
    // Year: new Date().getFullYear()
    
  };
  private globalData = {
    Customers: [],
    dropdownsData: [],
  };
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private cookieService: CookieService,
    private orderformservice: OrderService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private AppComponentData: AppComponent,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService
  ) {
   }
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.strain, c.value.producttype, c.value.skewtype,   c.value.packagetype, c.value.packagesize ];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['packagesize'].value !== '' && result[prop][0].controls['packagetype'].value !== '') {
          isError = true;
            _.forEach(result[prop], function (item: any, index) {
             
              item._status = 'INVALID';
            });
        } else {
            result[prop][0]._status = 'VALID';
            
        }
    }
    if (isError) { return {'duplicate': 'duplicate entries'}; }
}

  ngOnInit() {
    this.priorities =  [
      {label: 'Ground', value: 'Ground'},
      {label: 'FedEx', value: 'FedEx'},
      {label: 'UPS', value: 'UPS'},
      {label: 'USPS', value: 'USPS'}
    ];
    
    this.getRetailerDetailListByClient();
    this.getAllProductTypeListByClient();
    // this.getAllOrders();
    this.orderTabSelected = true;
    // this.getAllStrains();
    this.globalResource = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.orderrequestResource = OrderResource.getResources().en.orderrequest;
    this.titleService.setTitle(this.orderrequestResource.orderlisttitle);
    this.orderForm = this.fb.group({
      'customer': new FormControl(null, Validators.required),
      'shippingaddr': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'cityid': new FormControl(null),
      'state': new FormControl(null, Validators.required),
      'zipcode':new FormControl(null, Validators.required),
      'deliverydate':new FormControl(null, Validators.required),
      'orderno':new FormControl(null, Validators.required),
      'shippingpref':new FormControl(null, Validators.required),
      items: new FormArray([], this.customGroupValidation),
    })
    this.addItem();
    if (this.appCommonService.ProductTypeBackLink && this.appCommonService.ProductTypeFormDetail) {
      this.orderForm = this.appCommonService.ProductTypeFormDetail;
      this.appCommonService.ProductTypeFormDetail = null;
} else if (this.appCommonService.TPProcessorBackLink && this.appCommonService.ProductTypeFormDetail) {
      this.orderForm = this.appCommonService.ProductTypeFormDetail;
      this.appCommonService.ProductTypeFormDetail = null;
} else if (this.appCommonService.lotPageBackLink && this.appCommonService.ProductTypeFormDetail) {
      this.orderForm = this.appCommonService.ProductTypeFormDetail;
      this.appCommonService.ProductTypeFormDetail = null;
}

    // this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
  }

  get OrderFormDetailsArr(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem(): void {
    this.sysmbol=0;
    // this.SectionDetailsArr.push(this.createItem());
    this.arrayItems = this.orderForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
  }
  createItem(): FormGroup {
    return this.fb.group({
      strain: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      skewtype: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      packagetype: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      packagesize: new FormControl(null, Validators.compose([Validators.required, Validators.max(999999999999999), Validators.min(0.1)])),
      orderqt: new FormControl(null, Validators.compose([ Validators.max(99999), Validators.min(0.1)])),
      producttype: new FormControl(null, Validators.compose([ Validators.max(99999), Validators.min(0.1)])),
      ordercost: new FormControl(null, Validators.compose([ Validators.max(99999), Validators.min(0.1)])),
    });
  }
  
  getRetailerDetailListByClient() {
    this.loaderService.display(true);
    this.dropdownDataService.GetAllRetailerListByClient().subscribe(
      data => {
        this.globalData.Customers = data;
        this.Customers = this.dropdwonTransformService.transform(
          data, 'RetailerName', 'RetailerId', '-- Select --');
          const customerFilter = Array.from(data.reduce((m, t) => m.set(t.RetailerName, t), new Map()).values())
        this.customersList = this.dropdwonTransformService.transform(
          customerFilter, 'RetailerName', 'RetailerId', '-- Select --');
          console.log("customers list"+JSON.stringify(this.customersList));
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('getRetailerDetailListByClient complete'));
  }
  getDetailsOnCustomerName(event?:any){
   for(let value of this.globalData.Customers){
     if(event.value === value.RetailerId){
      this.shippingaddress = value.Address,
      this.email =value.PrimaryEmail,
      this.country = value.CountryName,
      this.state = value.StateName,
      this.city = value.CityName,
      this.cityid = value.CityId,
      this.zipcode =  value.ZipCode,
      this.shippingpref = value.ShippingPreference
      this.orderForm.controls['shippingaddr'].setValue(this.shippingaddress),
      this.orderForm.controls['email'].setValue(this.email),
      this.orderForm.controls['country'].setValue(this.country),
      this.orderForm.controls['state'].setValue(this.state),
      this.orderForm.controls['city'].setValue(this.city),
      this.orderForm.controls['cityid'].setValue(this.cityid),
      this.orderForm.controls['zipcode'].setValue(this.zipcode),
      this.orderForm.controls['shippingpref'].setValue(this.shippingpref)
     }
   }
  }

  getAllProductTypeListByClient() {
    this.loaderService.display(true);
    this.orderformservice.getAllProductTypeListByClient().subscribe(
      data => {
        this.dropdownsData = data;
       if (data !== 'No data found!') {
        this.globalData.dropdownsData = data
          this.allProductTypeList = data;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allProductTypeList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allProductTypeList.length;
          }
       } else {
        this.allProductTypeList = [];
       }
      //  this.loaderService.display(false);
      this.getAllProducts()
      // this.getPackageType()
      // this.getPackageSize()
      // this.getAllSkewType()
      // this.getProductTypeId()
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All  New Product Type List By Client complete'));
  }
  getAllProducts() {
    const data = this.dropdownsData
        if (data) {
        this.globalData.dropdownsData = data
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --',false);
        const fieldsfilter = Array.from(data.reduce((m, t) => m.set(t.StrainName, t), new Map()).values())
        this.strains = this.dropdwonTransformService.transform(fieldsfilter, 'StrainName', 'StrainId', '-- Select --',false);
      }
  }


  deleteItem(index: number) {
    
    const control = <FormArray>this.orderForm.controls['items'];
   
    if (control.length !== 1) {
      control.removeAt(index);
    }
    console.log(this.orderForm.get('items'))
   
  }

  resetForm() {
    this.orderForm.reset({ chkSelectAll: true });
    
this.saveButtonText ="save"
    const control = <FormArray>this.orderForm.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
   
    this.addItem();
  }
  deleteItemAll(index: number) {
   
    const control = <FormArray>this.orderForm.controls['items'];
    control.removeAt(index);
  }
  getAllDetails(event?:any){
    this.producttype = [];
    this.SkewType = [];
    this.packagetype =[];
    this.packagesize =[];
    for(let skew of  this.globalData.dropdownsData ){
      if(event.value === skew.StrainId){
      //  const data = skew
      //   const fiterdata = Array.from(data.reduce((m, t) => m.set(t.SkewKeyName, t), new Map()).values())
      //  this.SkewType = this.dropdwonTransformService.transform(fiterdata, 'SkewKeyName', 'SkewKeyName', '-- Select --',false);
      this.producttype.push({label: skew.ProductName, value: skew.ProductTypeId}) 
      this.SkewType.push({label: skew.SkewKeyName, value: skew.SkewKeyName})
      this.packagetype.push({label: skew.PkgTypeName, value: skew.PkgTypeId})
      this.packagesize.push({label:skew.UnitValue, value:skew.UnitValue})
      }
    }
    this.SkewType =  this.SkewType .filter((thing, index, self) =>
  index === self.findIndex((t) => (
    t.label === thing.label && t.value === thing.value
  ))
)
this.packagetype =  this.packagetype .filter((thing, index, self) =>
index === self.findIndex((t) => (
  t.label === thing.label && t.value === thing.value
))
)
  }

  onSubmit(value: string){
    this.submitted = true;
    let orderFormForApi;
    orderFormForApi = {
      Order: {
        "ClientId": Number(this._cookieService.ClientId),
        "VirtualRoleId": Number(this._cookieService.VirtualRoleId),
        "OrderRefId": this.orderForm.value.orderno,
        "CustomerId": Number(this.orderForm.value.customer),
        "PrimaryEmail": this.orderForm.value.email,
        "CityId":this.orderForm.value.cityid,
        "ZipCode": this.orderForm.value.zipcode,
        "ShippingAdress": this.orderForm.value.shippingaddr,
        "ShippingPreference": this.orderForm.value.shippingpref,
        "DeliveryDate":this.orderForm.value.deliverydate,
        "DraftOrderId": 0
         
      },
      OrderDetails: []
    };

    this.OrderFormDetailsArr.controls.forEach((element, index) => {
      // this.duplicateSection = element.value.section
      orderFormForApi.OrderDetails.push({
        "ProductTypeId": element.value.producttype,
        "SkewKeyName":element.value.skewtype,
        "StrainId":  element.value.strain,
        "Description": null,
        "PkgTypeId": element.value.packagetype,
        "PackageSize":  element.value.packagesize,
        "OrderQty":  Number(element.value.orderqt)
         });
    
     });
     this.newSectionForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.orderForm.value)));

     if (this.orderForm.valid) {
      this.loaderService.display(true);
      this.orderformservice.addNewOrderEntry(orderFormForApi)
      .subscribe(
        data => {
          this.msgs = [];
          if (String(data[0].ResultKey) === 'SUCCESS') {
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.orderrequestResource.ordersubmitted });
           
            this.resetForm();
          }
          else if (String(data[0].ResultKey)  === "DUPLICATE") {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.orderrequestResource.duplicateorder});
          }
          else if (String(data[0].ResultKey)  === "INACTIVE CUSTOMER") {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.orderrequestResource.duplicateorder});
          }
          else if (String(data[0].ResultKey) === "PRODUCT TYPE NOT PRESENT") {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.orderrequestResource.prodtypenotpresent});
          }
          else if (String(data) === 'FAILURE') {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          }
          this.loaderService.display(false);
        },
        error => {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
         
          this.loaderService.display(false);
        }
      );

     }
     else {
      this.appCommonService.validateAllFields(this.orderForm);
    }
  }

 
}
