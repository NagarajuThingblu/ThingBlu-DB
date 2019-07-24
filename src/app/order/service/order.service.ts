import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import 'rxjs/add/observable/of';
import { Subscriber } from 'rxjs/Subscriber';
import { HttpParams } from '@angular/common/http';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class OrderService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  public _cookieService: UserModel;
  public ClientVirtual;

  constructor(private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();

    this.ClientVirtual = 'ClientId=' +
    this.appCommonService.getUserProfile().ClientId +
      '&VirtualRoleId=' + this.appCommonService.getUserProfile().VirtualRoleId;
  }

  saveRetailerOrder(orderDetailsForApi) {
    const url = 'api/Order/SaveOrder?' + this.ClientVirtual;

    return this.http.post(url, orderDetailsForApi, this.headers)
    .map(data =>  data );
  }

  getAllOrders(): Observable<any> {
    const url = 'api/Order/GetOrderListByClient';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})
    .map(
      data => {
        console.log('Get All Orders Service success');
        return data;
      }
    );
    // return new Observable<any>((subscriber: Subscriber<any>) => subscriber.next(
    //   [
    //     { OrderId: 1, OrderRefId: 'O0001', RetailerName: 'Walmart', OrderDate: '05/04/2018', DeliveryDate: '05/07/2018'},
    //     { OrderId: 2, OrderRefId: 'O0002', RetailerName: 'Walmart', OrderDate: '05/03/2018', DeliveryDate: '05/08/2018'}
    //   ]
    // )
    // );
  }

  getABudPackagingOrders(EditMode: any) {
    const url = 'api/Task/TaskBudPackagingGetOrderList';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    params = params.append('EditMode', String(EditMode));

    return this.http
    .get(url, {params: params})
    .map(
      data => {
        console.log('Get A Bud Packaging Orders Service success');
        return data;
      }
    );
  }

  getBJointsPackagingOrders() {
    const url = 'api/Task/TaskJointsTubingGetOrderList';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})
    .map(
      data => {
        console.log('Get B Joints Packaging Orders Service success');
        return data;
      }
    );
  }

  getTubeLabelOrders() {
    // Observable.of([
    //   {'OrderId': 253, 'OrderRefId': 'order33', 'DeliveryDate': '08/05/18'},
    //   {'OrderId': 318, 'OrderRefId': '2018-INV-24', 'DeliveryDate': '08/23/18'}
    // ]);
    const url = 'api/Task/TaskJointsTubeBrandingGetOrderList';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})
    .map(
      data => {
        console.log('Get B Joints Packaging Orders Service success');
        return data;
      }
    );
  }

  getCOilPackagingOrders(EditMode) {
    const url = 'api/Task/TaskOilPackagingGetOrderList';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    // parameter Added by Devdan :: 17-Oct-2018 :: For Edit functionality
    params = params.append('EditMode', String(EditMode));

    return this.http
    .get(url, {params: params})
    .map(
      data => {
        console.log('Get A Bud Packaging Orders Service success');
        return data;
      }
    );
  }

  getRetailers(forOrder = false) {
      const url = 'api/Retailer/GetRetailerListByClient';
      let params = new HttpParams();

      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      // Added by Devdan :: 01-Oct-2018 :: pass boolean parameter
      params = params.append('forOrder', String(forOrder));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get Retailers Service success');
          return data;
        }
      );
    }

    getSelectedOrderDetails(OrderId, Flag, EditMode: any, TaskId: any) {
      let url;
      if (Flag === 'BUD') {
         url = 'api/Task/TaskBudPackagingGetDetailsForAssignTask';
      } else if (Flag === 'JOINTS') {
         url = 'api/Task/ ';
      } else if (Flag === 'OIL') {
        url = 'api/Task/TaskOilPackagingGetDetailsForAssignTask';
     } else if (Flag === 'TUBE') {
        url = 'api/Task/TaskJointsTubeBrandingGetDetailsForAssignTask';
     }
      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('OrderId', OrderId);
      params = params.append('EditMode', String(EditMode));
      params = params.append('TaskId', String(TaskId));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get Selected Order Details Service success');
          return data;
        }
      );
    }

    getSelectedTubeLabelingOrderDetails(selectedOrderDetails: any) {
      let url;
        url = 'api/Task/TaskJointsTubeBrandingGetDetailsForAssignTask';
        let params = new HttpParams();
        params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
        params = params.append('OrderId', selectedOrderDetails.OrderId);
        params = params.append('EditMode', String(selectedOrderDetails.EditMode));
        params = params.append('TaskId', String(selectedOrderDetails.TaskId));
        params = params.append('StrainId', String(selectedOrderDetails.StrainId));
        params = params.append('PkgTypeId', String(selectedOrderDetails.PkgTypeId));
        params = params.append('UnitValue', String(selectedOrderDetails.UnitValue));
        params = params.append('ItemQty', String(selectedOrderDetails.ItemQty));

        // Added By Bharat Extra Params for Joint Team Dashborad Changes
        params = params.append('ViewOrdersBy', String(selectedOrderDetails.ViewOrdersBy));
        params = params.append('BeginDate', selectedOrderDetails.BeginDate);
        params = params.append('EndDate', selectedOrderDetails.EndDate);
        // Ended Added By Bharat  Extra Params for Joint Team Dashborad Changes

        return this.http
        .get(url, {params: params})
        .map(
          data => {
            console.log('Get Selected Order Details Service success');
            return data;
          }
        );
     }

    getSelectedStrainOrderDetails(productTypeParam: any, Flag) {
      let url;
      url = 'api/Task/TaskJointsTubingGetDetailsForAssignTask';

      productTypeParam['ClientId'] = String(this.appCommonService.getUserProfile().ClientId);
      const tubingParams = {
        TubingParams: productTypeParam
      };

      let params = new HttpParams();
      params = params.append('TubingParams', productTypeParam);
      // params = params.append('StrainId', productTypeParam.StrainId);
      // params = params.append('PkgTypeId', productTypeParam.PkgTypeId);
      // params = params.append('UnitValue', productTypeParam.UnitValue);
      // params = params.append('ItemQty', productTypeParam.ItemQty);
      return this.http
      .post(url, tubingParams, this.headers)
      .map(
        data => {
          console.log('Success');
          return data;
        }
      );
    }

    getOrderInfo(OrderId): Observable<any> {
      // return new Observable<any>((subscriber: Subscriber<any>) => subscriber.next(
      //   {
      //     'OrderDetails': {
      //         'BudOrderDetails': [
      //           {'BrandName': 'xxx', 'StrainName': 'xxx', 'PkgTypeName': 'xxx', 'UnitName': 'xxx', 'Qty': 10, 'TotalWt': 52},
      //           {'BrandName': 'xxx', 'StrainName': 'xxx', 'PkgTypeName': 'xxx', 'UnitName': 'xxx', 'Qty': 20, 'TotalWt': 40}
      //         ]
      //         ,
      //         'JointsOrderDetails': [
      //             {'BrandName': 'xxx', 'StrainName': 'xxx', 'PkgTypeName': 'xxx', 'UnitName': 'xxx', 'Qty': 30, 'TotalWt': 43},
      //           {'BrandName': 'xxx', 'StrainName': 'xxx', 'PkgTypeName': 'xxx', 'UnitName': 'xxx', 'Qty': 40, 'TotalWt': 56}
      //         ]
      //         ,
      //         'OilOrderDetails': [
      //             {'BrandName': 'xxx', 'StrainName': 'xxx', 'PkgTypeName': 'xxx', 'UnitName': 'xxx', 'Qty': 50, 'TotalWt': 23},
      //           {'BrandName': 'xxx', 'StrainName': 'xxx', 'PkgTypeName': 'xxx', 'UnitName': 'xxx', 'Qty': 60, 'TotalWt': 32}
      //         ]
      //     }
      //   }
      // ));
      const url = 'api/Order/GetOrderDetailsByOrder';
      let params = new HttpParams();

      params = params.append('OrderId', OrderId);

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get Order Info Service success');
          return data;
        }
      );
    }

    getBrandStrainPackageByClient() {
      const url = 'api/Order/GetBrandStrainPackageByClient';
      let params = new HttpParams();

      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get Brand Strain PackageBy Client Service success');
          return data;
        }
      );
    }

    // Order Fulfilment & QA Check Task API's
    getQACheckOrders(EditMode: any) {
      const url = 'api/Task/TaskQACheckGetOrderList';
      let params = new HttpParams();

      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('EditMode', String(EditMode));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get QA Check Orders Orders Service success');
          return data;
        }
      );
    }

    // Package Replacement Task API's
    getRepackOrders(EditMode) {
      const url = 'api/Task/TaskQAFailRepackGetOrderList';
      let params = new HttpParams();

      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('EditMode', String(EditMode));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get Repack Orders Service success');
          return data;
        }
      );
    }

    getRepackOrderDetails(OrderId, EditMode, TaskId): Observable<any> {

      const url = 'api/Task/TaskQAFailRepackGetDetailsForAssignTask';
      let params = new HttpParams();

      params = params.append('OrderId', String(OrderId));
      params = params.append('EditMode', String(EditMode));
      params = params.append('TaskId', String(TaskId));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get Repack Order Details Service success');
          return data;
        }
      );
    }
    // End of Package Replacement Task API's

    // Label Replacement Task API's
    getLableOrders(EditMode) {
      const url = 'api/Task/TaskQAFailRelabelGetOrderList';
      let params = new HttpParams();

      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('EditMode', String(EditMode));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get QA Check Orders Orders Service success');
          return data;
        }
      );
    }

    getLableOrderDetails(OrderId, EditMode, TaskId): Observable<any> {

      const url = 'api/Task/TaskQAFailRelabelGetDetailsForAssignTask';
      let params = new HttpParams();

      params = params.append('OrderId', String(OrderId));
      params = params.append('EditMode', String(EditMode));
      params = params.append('TaskId', String(TaskId));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get QA Check Order Details Service success');
          return data;
        }
      );
    }
    // End of  Label Replacement Task API's

    getQACheckOrderDetails(OrderId, EditMode, TaskId): Observable<any> {

      const url = 'api/Task/TaskQACheckGetDetailsForAssignTask';
      let params = new HttpParams();

      params = params.append('OrderId', String(OrderId));
      params = params.append('EditMode', String(EditMode));
      params = params.append('TaskId', String(TaskId));

      return this.http
      .get(url, {params: params})
      .map(
        data => {
          console.log('Get QA Check Order Details Service success');
          return data;
        }
      );
      // return Observable.of(
      //   {
      //     'Table': [
      //       {
      //           'OrderId': 107, 'ProductTypeId': 95, 'SkewKeyName': 'BUD', 'BrandName': 'Dawg Star',
      //           'SubBrandName': 'Black Label', 'StrainId': 14, 'StrainName': 'Blueberry Cheesecake', 'PkgTypeName': 'Jar',
      //           'UnitValue': 1.00, 'ItemQty': 1, 'RequiredQty': 6, 'TotalWt': 6.00
      //       },
      //       {
      //           'OrderId': 107, 'ProductTypeId': 144, 'SkewKeyName': 'BUD', 'BrandName': 'Dawg Star',
      //           'SubBrandName': '7G POPCORN', 'StrainId': 27, 'StrainName': 'Dog Walker', 'PkgTypeName': 'Jar',
      //           'UnitValue': 7.00, 'ItemQty': 1, 'RequiredQty': 3, 'TotalWt': 21.00
      //       },

      //         {
      //             'OrderId': 103, 'ProductTypeId': 44, 'SkewKeyName': 'JOINTS', 'BrandName': 'Western Culture',
      //             'SubBrandName': '', 'StrainId': 11, 'StrainName': 'Blue Dream', 'PkgTypeName': 'TUBE',
      //             'UnitValue': 0.50, 'ItemQty': 2, 'RequiredQty': 10, 'TotalWt': 5.00
      //         },
      //         {
      //             'OrderId': 103, 'ProductTypeId': 52, 'SkewKeyName': 'JOINTS', 'BrandName': 'Western Culture',
      //             'SubBrandName': '', 'StrainId': 38, 'StrainName': 'Galactic Death Star', 'PkgTypeName': 'TUBE',
      //             'UnitValue': 0.50, 'ItemQty': 2, 'RequiredQty': 10, 'TotalWt': 5.00
      //         }
      //         ,
      //         {
      //             'OrderId': 109, 'ProductTypeId': 214, 'SkewKeyName': 'OIL', 'BrandName': 'Dawg Star',
      //             'SubBrandName': 'High Terpene (by Mantis)', 'StrainId': 9, 'StrainName': 'Berry Haze',
      //             'PkgTypeName': 'PUCK', 'UnitValue': 1.00, 'ItemQty': 1, 'RequiredQty': 20, 'TotalWt': 20.00
      //         },
      //         {
      //             'OrderId': 109, 'ProductTypeId': 37, 'SkewKeyName': 'OIL', 'BrandName': 'Western Culture',
      //             'SubBrandName': 'BHO Wax (by X-tracted)', 'StrainId': 5, 'StrainName': '9LB Hammer',
      //             'PkgTypeName': 'PUCK', 'UnitValue': 1.00, 'ItemQty': 1, 'RequiredQty': 10, 'TotalWt': 10.00
      //         }
      //       ],
      //       'Table2': [
      //         {
      //             'ProductTypeId': 95, 'PackageCode': 'Pkg001', 'LotId': 1, 'GrowerLotNo': 'Lot001', 'SkewKeyName': 'BUD'
      //         },
      //         {
      //           'ProductTypeId': 95, 'PackageCode': 'Pkg0010', 'LotId': 3, 'GrowerLotNo': 'Lot0010', 'SkewKeyName': 'BUD'
      //         }
      //       ],
      //       'Table3': [
      //         {
      //             'ProductTypeId': 44, 'PackageCode': 'Pkg002', 'LotId': 2, 'GrowerLotNo': 'Lot002', 'SkewKeyName': 'JOINTS'
      //         }
      //       ],
      //       'Table4': [
      //         {
      //           'ProductTypeId': 214, 'PackageCode': 'Pkg003', 'OilPkgCode': 'Oil_001', 'SkewKeyName': 'OIL'
      //         }
      //       ]
      //   }
      // );
    }

    // order draft api
    saveOrderDraft(draftOrderApi) {
        const url = 'api/Order/DraftOrderAddupdate?' + this.ClientVirtual;
        return this.http.post(url, draftOrderApi, this.headers)
        .map(data =>  data );

    }

    // get all order draft details
   /* getAllDraftOrders(): Observable<any> {
      const url = 'api/Order/DraftOrderGetListByClient';
      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('DraftOrderId', String(0));
      params = params.append('GetAll', String(1));
      return this.http
      .get(url, {params: params})
      .map(
        data => {
          return data;
        });
    }*/

    removeOrderDraft(removeOrderApi) {
      const url = 'api/Order/DraftOrderDeleteActive';
      return this.http.post(url, removeOrderApi, this.headers)
      .map(data =>  data );
  }

  getDraftOrdersByClient(): Observable<any> {
    const url = 'api/Order/DraftOrderGetListByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }
  getDraftOrdersByDraftId(DraftOrderId): Observable<any> {
    const url = 'api/Order/DraftOrderGetListById';
    let params = new HttpParams();
    params = params.append('DraftOrderId', String(DraftOrderId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }

  getIncomingOrdersByClient(): Observable<any> {
    const url = 'api/Order/IncomingOrderGetListByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }

  getIncomingOrderDetailssById(incomingOrderId): Observable<any> {
    const url = 'api/Order/IncomingOrderDetailsGetById';
    let params = new HttpParams();
    params = params.append('IncomingOrderId', String(incomingOrderId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }

  saveIdentifyOrder(orderDetailsForApi) {
    const url = 'api/Order/IdentifyOrderAddupdate';

    return this.http.post(url, orderDetailsForApi, this.headers)
    .map(data =>  data );
  }

  getIdentifiedOrderDetailssById(incomingOrderId): Observable<any> {
    const url = 'api/Order/IdentifiedOrderDetailsGetById';
    let params = new HttpParams();
    params = params.append('IncomingOrderId', String(incomingOrderId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }
  saveAcceptOrder(orderDetailsForApi) {
    const url = 'api/Order/AcceptOrderAddUpdate';

    return this.http.post(url, orderDetailsForApi, this.headers)
    .map(data =>  data );
  }

  getChangeOrdersByClient(): Observable<any> {
    const url = 'api/Order/ChangeOrderGetListByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }

  getChangeOrderDetailssById(incomingOrderId): Observable<any> {
    const url = 'api/Order/ChangeOrderDetailsGetById';
    let params = new HttpParams();
    params = params.append('IncomingOrderId', String(incomingOrderId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }

  getChangeOrderTasksByProductType(orderId, productTypeId, skewType): Observable<any> {
    const url = 'api/Order/ChangeOrderTasksGetByProductType';
    let params = new HttpParams();
    params = params.append('OrderId', String(orderId));
    params = params.append('ProductTypeId', String(productTypeId));
    params = params.append('SkewKeyName', String(skewType));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        return data;
      });
  }

}
