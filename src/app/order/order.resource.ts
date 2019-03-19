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
                   // s2systemidrequire: 'S2 order number is required.',
                    s2systemidrequire: 'Order ID is required.',
                   // s2systemid: 'S2 Order Number',
                   s2systemid: 'Order ID',
                    duplicates2number: 'Duplicate Order ID.',
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
                    inactiveretailer: 'Selected Retailer might be deleted or inactive.',
                    orderdreaft: 'Order CheckOut',
                    savedraft: 'Save as Draft',
                    updatesuccessfully: 'Draft order updated successfully.',
                    draftsave1: 'Order',
                    draftsave2: 'has been saved as a draft.',
                    deleteconfirm: 'Are you sure you’d like to discard this draft?',
                    s2systemidrequiredraft: 'Order ID Required to Save as Draft.',
                    orderidexist: 'Order id already exists.',
                    servererror: 'Something went wrong.',
                    clear: 'Clear',
                    oilproduct: 'Add Oil Product',
                    prerollproduct: 'Add Pre-roll Product',
                    flowerproduct: 'Add Flower Product',

                }
            }
        };
    }
}
