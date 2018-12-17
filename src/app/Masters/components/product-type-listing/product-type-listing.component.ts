import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NewProductTypeService } from '../../../Masters/services/new-product-type.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { AppComponent } from '../../../app.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-product-type-listing',
  templateUrl: './product-type-listing.component.html',
  styleUrls: ['./product-type-listing.component.css']
})
export class ProductTypeListingComponent implements OnInit {
  @Input() PaginationValues: any;
  @Input() allProductTypeList: any;
  @Output() ProductTypeEditEvent = new EventEmitter();
  @Output() ProductTypeDeleteEvent = new EventEmitter();
  @Output() ProductTypeDeactivateEvent = new EventEmitter();

  public newProductTypeResources: any;
  public globalResource: any;
  event: any;
  // Commented by Devdan :: 21-Nov-2018
  // public LotInfo: any = {
  //   LotId: 0,
  //   showLotNoteModal: false
  // };

  constructor(
    private newProductTypeService: NewProductTypeService,
    private loaderService: LoaderService,
    private appComponentData: AppComponent,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.newProductTypeResources = MastersResource.getResources().en.newproductype;
    this.globalResource = GlobalResources.getResources().en;
    this.appComponentData.setTitle('Product Type');

    // this.getAllProductTypeListByClient();
  }

  onNewProductTypeSaved(comment) {
    // this.getAllProductTypeListByClient();

    console.log('New method implemented..');
  }
  editEmployee(EmpId) {
    // this.GetLotDetailsForEdit(EmpId);
    // alert(EmpId);

    this.ProductTypeEditEvent.emit(EmpId);
  }
  deleteEmployee(value) {
    // this.GetLotDetailsForEdit(EmpId);
    // alert(EmpId);
    this.ProductTypeDeleteEvent.emit(value);
  }
  onPageChange(e) {
    this.event = e;
  }
  showConformationMessaegForDelete(ProductTypeId) {
    // alert(EmpId);
    let strMessage: any;
    strMessage = 'Do you want to delete this product type?';
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.deleteEmployee({ProductTypeId});
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }
  deactivateEmployee(value) {
    this.ProductTypeDeactivateEvent.emit(value);
  }
  showConformationMessaegForDeactive(ProductTypeId, IsActiveFlag, flag, rowIndex) {
    let strMessage: any;
    if (this.allProductTypeList[rowIndex].IsActive === true) {
      strMessage = 'Do you want to activate this product type?';
    } else {
      strMessage = 'Do you want to inactivate this product type?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.deactivateEmployee({ProductTypeId, IsActiveFlag});
      },
      reject: () => {
        this.allProductTypeList[rowIndex].IsActive = !flag.checked;
      }
  });
  }

  getAllProductTypeListByClient() {
    this.loaderService.display(true);
    this.newProductTypeService.getAllProductTypeListByClient().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allProductTypeList = data;
       } else {
        this.allProductTypeList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All  New Product Type List By Client complete'));
  }
}
