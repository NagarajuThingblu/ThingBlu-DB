export class OrderResource {
    static getResources() {
        return {
            en: {
                orderrequest: {
                    pageheading: 'Order Request',
                    pkgtyperequired: 'Package type is required.',
                    pkgsizerequired: 'Package size is required.',
                    orderqtyrequired: 'Order qty is required.',
                    orderqty: 'Order qty',
                    ordersubmitted: 'Order submitted successfully.',
                    retailerisrequired: 'Retailer name is required.',
                    deliverydateisrequired: 'Delivery date is required.',
                    filloneorderdetails: 'Please fill order details first.',
                    s2systemidrequire: 'S2 order number is required.',
                    s2systemid: 'S2 Order Number',
                    duplicates2number: 'Duplicate S2 order number.',
                    itemqtyrequired: 'Item qty is required.',
                    orderid: 'Order Id',
                    retailername: 'Retailer Name',
                    orderrequestdate: 'Order Request Date',
                    deliverydate: 'Delivery Date',
                    deliverystatus: 'Order Status',
                    orderdetails: 'Order Details',
                    orderlisttitle: 'All Orders',
                    orderrequesttitle: 'Order Request',
                    orderstatus: 'Order Status',
                    packagingsatus: 'Packaging Status',
                    ordersaveconfirm: 'Are you sure that you want to proceed?',
                    ubicode: 'UBI Code',
                    prodtypenotpresent: 'product type is deleted or inactive.',
                    // Added by DEVDAN :: 03-Oct-2018 :: Error Message for Inactive Retailer
                    inactiveretailer: 'Selected Retailer might be deleted or inactive.'
                }
            }
        };
    }
}
