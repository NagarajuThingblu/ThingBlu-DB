export class TaskResources {
    static getResources() {
        return {
            en: {
                lotentryform: {
                    pageheading: 'New Lot Entry',
                    biotfweight: 'Transfer Weight',
                    biotfweightrequired: 'Enter lot transfer weight.',
                    startweight: 'Start Weight',
                    startweightrequired: 'Enter lot start weight.',
                    costoflot: 'Lot Cost(USD)',
                    costoflotrequired: 'Enter lot cost.',
                    shortageoverage: 'Shortage/Overage',
                    growerlotno: 'State Lot No.',
                    lotsavedsuccess: 'Lot details saved successfully.',
                    growerlotalreadyexist:  'Duplicate grower lot number.',
                },
                oilmaterialsout: {
                    pageheading: 'Other Materials Out',
                    thirdpartyprocessor: 'Third Party Processor',
                    transferwttoprocessor: 'Transfer weight to processor',
                    transferwttoprocessorrequired: 'Enter lot transferred weight to processor.',
                    availlotwt:  'Available Lot Wt.',
                    uniqueid: 'Unique Id',
                    filloneitematleast: 'Fill at least one item details.',
                    duplicateuniquecode: 'Duplicate unique ids.',
                    tfwtgreaterthanlotwt: 'Transfer weight can not be greater than available lot weight.',
                    addpkgdetails: 'Please add package details.',
                    title: 'Other Materials Out',
                    morebinweight:'Output Bin weight is greater than Input Bin weight',
                    lotdeleted: 'Can not process the request, lot is already deleted.',
                    nobalance: 'Lot weight is not available, can not process the request.',
                    deliverydateisrequired: 'Delivery date is required.',
                    outwarddaterequired: 'Outward date is required.',
                    expyieldpercent: 'Exp. Yield (%)',
                    tppnotpresent: 'TP Processor is deleted or is inactive.'
                },
                oilmaterialsin: {
                    pageheading: 'Other Materials In',
                    thirdpartyprocessor: 'Third Party Processor',
                    transferwttoprocessor: 'Transfer weight to processor',
                    transferwttoprocessorrequired: 'Enter lot transferred weight to processor.',
                    pkgtype: 'Pkg. Type',
                    pkgsize: 'Pkg. Size',
                    pkgreturnqty: 'Pkg. Return Qty',
                    processedlotids: 'Processed Lot Ids',
                    processorcharge: 'Processor Charge',
                    lotwtgreaterthanpkgwt: 'Sum of all lot weight is not match with sum of package return weight.',
                    lotwtgreaterthantfwt: 'Total lot weight is greater than transfer weight.',
                    duplicatePackageCode: 'Duplicate package code.',
                    oilreturnwtrequired: 'Oil returned wt is required.',
                    lotempty: 'Select lot.',
                    addpkgdetails: 'Add package details.',
                    title: 'Other Materials In',
                    oilreturndate: 'Oil Return Date',
                    oilreturnrequired: 'Oil return date is required.',
                    expyieldpercent: 'Exp. Yield %',
                    paymentmode: 'Payment Mode',
                    payment: 'Payment',
                    paymentmoderequired: 'Payment mode is required.',
                    paymentmoneyrequired: 'Payment is required.',
                    materialpercent: 'Material %',
                    pkgtypenotexist: 'Package Type is deleted or is inactive.'
                },
                oiloutwordlisting: {
                    pageheading: 'Other Materials Out - Full List',
                    transferwt: 'Transfer Wt.',
                    tpname: 'TP Name',
                    wtdetails: 'Weight Details',
                    tplotdetails: 'TP Lot Details',
                    lotoutwordcode: 'Lot Outward Code',
                    oilmaterialprocessedwt: 'Oil Material Processed Wt.',
                    oilreturnedwt: 'Oil Returned Wt.',
                    title: 'Other Materials Out - Full List',
                    outwarddate: 'Outward Date',
                    expreturndate: 'Exp. Return Date'
                },
                oilinwordlisting: {
                    pageheading: 'Other Materials In - Full List',
                    transferwt: 'Transfer Wt.',
                    tpname: 'TP Name',
                    oildetails: 'Oil Details',
                    tplotdetails: 'TP Lot Details',
                    lotoutwordcode: 'Lot Outward Code',
                    oilmaterialprocessedwt: 'Oil Material Processed Wt.',
                    oilreturnedwt: 'Oil Returned Wt.',
                    title: 'Other Materials In - Full List',
                    expectedyield: 'Expected Yield' ,
                    expyield: 'Exp. Yield',
                    paymentmode: 'Payment Mode',
                    paymentvalue: 'Payment Value',
                    value: 'Value',
                    oilreturndate: 'Oil Return Date',
                    actualyield: 'Actual Yield'

                },
                assigntask: {
                    pageheading: 'Assign Task',
                    // Added by Devdan :: 22-Nov-2018 :: EditTask Heading
                    editPageHeading: 'Update Task',
                    // ---------- Done ---------
                    employee: 'Employee',
                    morebinweight:'Output Bin weight is greater than Input Bin weight',
                    employeerequired: 'Select employee.',
                    eststartdate: 'Estimated Start Date',
                    estenddate: 'Est. End Date',
                    estimatedhrs: 'Est. Hrs.',
                    estimatedhrsrequired: 'Enter esitimated hours.',
                    priority: 'Priority',
                    startdaterequired: 'Select esitimated start date.',
                    enddaterequired: 'Select esitmated end date.',
                    datecomparevalidation: 'Start date must be before of End date.',
                    notifymanager: 'Notify Manager',
                    notifyemployee: 'Notify Employee',
                    comment: 'Comment',
                    commentMaxLength: 'Comment cannot be more than 500 characters.',
                    positiveintegersallowed: 'allowed only positive intergers/decimals.',
                    quarantinehrs: 'Quarantine Hrs',
                    wttobetrim: 'Weight To Be Trim',
                    wttobetrimrequired: 'Weight To Be Trim is required.',
                    assignedwt: 'Assigned Weight',
                    assignedwtrequired: 'Assigned Weight is required.',
                    processedwt: 'Processed Weight',
                    processedwtrequired: 'Processed Weight is required.',
                    usablebudwt: 'Usable Bud Weight',
                    budmaterialwt: 'Bud Material Weight',
                    usablebudwtrequired: 'Usable Bud Weight is required.',
                    jointmaterialwt: 'Joint Material Weight',
                    jointmaterialwtrequired: 'Joint Material Weight is required.',
                    oilmaterialwt: 'Oil Material Weight',
                    oilmaterialwtrequired: 'Oil Material Weight is required.',
                    wastematerialwt: 'Waste Material Weight',
                    wastematerialwtrequired: 'Waste Material Weight is required.',
                    completedwt: 'Completed Weight',
                    completedwtrequired: 'Completed Weight is required.',
                    wtforsifting: 'Weight For Sifting',
                    wtforsiftingrequired: 'Weight For Sifting is required.',
                    orderno: 'Order No.',
                    budwtforpackage: 'Bud weight for packaging',
                    budavailablewt: 'Bud available Weight',
                    wtforconefilling: 'Weight For Cone Filling',
                    wtforconefillingrequired: 'Weight For Cone Filling is required.',
                    createdconecount: 'Created cone count',
                    createdconecountrequired: 'Created cone count is required.',
                    wtforgrind: 'Weight For Grinding',
                    wtforgrindrequired: 'Weight For Grinding is required',
                    tampingconecount: 'Cone Count For Tamping',
                    tampingconecountrequired: 'Cone count for tamping is required.',
                    tampingcompletedconecount: 'Tamping completed cone count',
                    tampingcompletedconecountrequired: 'Tamping completed cone count is required.',
                    jointscountfortubing: 'Joints count for tubing',
                    jointscountfortubingrequired: 'Joints count for tubing is required.',
                    completedjointscountfortubing: 'Completed joints count for tubing',
                    completedjointscountfortubingrequired: 'Completed joints count for tubing is required.',
                    lotweight: 'Lot Weight',
                    balancewt: 'Balance Weight',
                    empestcost: 'Emp. Est. Cost',
                    actualcost: 'Emp. Actual Cost',
                    actualhrs: 'Emp. Actual Hrs (HH:MM:SS)',
                    misccost: 'Misc. Cost(if any)',
                    incorrectassignwt: 'Incorrect assign weight.',
                    taskassignedsuccessfully: 'Task Assigned Successfully.',
                    // Added by DEVDAN :: 09-Oct-2018 :: Resource msg for Successfull update
                    taskupdatedsuccessfully: 'Task Updated and Assigned Successfully.',
                    // Added by DEVDAN :: 10-Oct-2018 :: Resource msg for Successfull update
                    taskalreadydeleted: 'Cannot update task, because task already deleted',
                    // Added by DEVDAN :: 15-Oct-2018 :: Lot wait not avaialbe message
                    unavailableLotWt: 'Weight is not avaialable for selected lot',
                    // Added by DEVDAN :: 15-Oct-2018 :: Lot wait not avaialbe message
                    packageassigned: 'Some of selected package/s is/are already assigned',
                    taskalreadystarted: 'Cannot update task. Task may be started.',
                    reviewsubmittedsuccess: 'Review Submitted successfully.',
                    taskcompleteddetailssavesuccess: 'Task completion details saved successfully.',
                    taskalreadycompleted: 'Task already completed.',
                    taskalreadyreviewed: 'Task already reviewed.',
                    taskActionCannotPerformC: 'Cannot complete the task, because task already deleted.',
                    taskActionCannotPerformR: 'Cannot submit review, because task already deleted.',
                    incorrectProcessWt: 'Incorrect processed weight.',
                    islotcomplete: 'Is Lot Completed?',
                    duplicatePackageCode: 'Duplicate package code not allowed.',
                    lotsnotassigned: 'Please select lot.',
                    productassignqtywarning: 'Please assign qty first.',
                    tasknotassigned: 'Task can not be assigned, Assigned weight is less than required weight.',
                    returnwt: 'Return Weight',
                    returnwtrequire: 'Return Weight is required.',
                    wtnotmatchedwithtolerance: 'Total completion weight is not matched with minimum tolerance weight.',
                    completewtgreaterthantotal: 'Completion weight is greater than total assigned weight.',
                    assignwtgreaterthanlotwt: 'Assigned weight is greater than total lot weight.',
                    pkgsnotassigned: 'Please select pkgs.',
                    returnwtnotmatchedwithtolerance: 'Total returned weight is not matched with minimum tolerance weight.',
                    compreturnwt: 'Completion Return Wt.',
                    revreturnwt: 'Review Return Wt.',
                    reviewedwt: 'Reviewed Weight',
                    qafail: 'QA Fail',
                    issuetype: 'Issue Type',
                    assignedcountmore:'Assigned Plant Count Greater than Total Plant Count',
                    notampedjointslotavail: 'Sorry, No tamped joints lot is present against',
                    nolotpresent: 'Sorry, No lot is present against',
                    qafailed: 'QA Failed',
                    pkgreplacementqty: 'Package Replacement Qty.',
                    qafailedcomment: 'QA Failed Comment',
                    assignedqty: 'Assigned Qty',
                    qareplacecount: 'QA Replace Count',
                    qafailcount: 'QA Fail Count',
                    qapasscount: 'QA Pass Count',
                    issuetyperequired: 'Issue type is required.',
                    isreplaced: 'Is Replaced',
                    islabeled: 'Is Labeled',
                    pkgsreplaced: 'Packages Replaced',
                    pkgslabeled: 'Packages Labeled',
                    title: 'Assign Task',
                    edittasktitle: 'Edit Task',
                    brandlablereplacetitle: 'Brand Label Replacement',
                    budpackagingtitle: 'Bud Packaging',
                    custometitle: 'Custom Task',
                    grindingtitle: 'Grinding',
                    jointcreationitle: 'Rolling',
                    tampingtitle: 'Tamping',
                    tubingtitle: 'Packaging',
                    oilpackagingtitle: 'Oil Packaging',
                    orderfullfilmenttitle: 'Order Fulfilment QA Check',
                    packagereplacementtitle: 'Package Replacement',
                    quarantinetitle: 'Quarantine',
                    siftingtitle: 'Sifting',
                    trimmingtitle: 'Trimming',
                    tubeBrandLabelTitle: 'Labeling',
                    totallotweight: 'Total Lot Weight',
                    thresholdnotmatched: 'Threshold not matched with total trimmed weight.',
                    processwtgreater: 'Processed weight is greater than available weight.',
                    trimcompleted: 'This lot is already fully trimmed.',
                    lotdeleted: 'Task can not be assign, lot is already deleted.',
                    verifypkgs: 'Please map packages.',
                    Lotwtnotmatchfortrimcomplete: 'Lot weight is not matched to mark task as Trimming Complete.',
                    Thresholdlimitexceeded: 'Threshold limit exceeded',
                    markyeslotwtcompleted: 'Total available lot weight is trimmed. Please mark is Lot Completed as ‘Yes’.',
                    Completetaskmaxweight: 'complete task with max weight of',
                    mixlotdetails: 'Mixed Lot Details',
                    mixpkgdetails: 'Mixed Package Details',
                    pkgwtnotmatched: 'Sum of all lot weight is not equal to total package weight.',
                    pkgqtynotmatched: 'Total package entered is not matching with total package completed qty.',
                    compqtygreaterassignqty: 'Completed qty is greater than assigned qty.',
                    maxpkglimitexceed: 'Max packages limit exceeding.',
                    compwtgreaterassignwt: 'Total completion weight of lot is greater than assigned weight.',
                    taskcompleteconfirm: 'Are you sure you\'d like to complete?',
                    MismatchTotalandassignedwt: 'Assign weight and total weight are not matching.',
                    // tslint:disable-next-line:max-line-length
                    lotfullytrimmedmsg: 'This lot is fully trim completed. To complete this task please select `Is Lot Completed` as `No` and save with completion weight as `0`s.',
                    nopackedtubeavailable: 'No packed tube available for branding.',
                    requiredwt: 'Req. Wt.',
                    unassignedavailwt: 'Unassign Avail. Wt.',
                    assignedweight: 'Assigned Wt.',
                    requiredqty: 'Req. Qty.',
                    requiredjoints: 'Req. Joints',
                    unassignedjoints: 'Unassign Joints',
                    assignedjoints: 'Assigned Joints',
                    requiredtubes: 'Req. Tubes',
                    unassignedtubes: 'Unassign Tubes',
                    assignedtubes: 'Assigned Tubes',
                    qalabeledcount: 'QA Replace Count',
                    jointshortage: 'Task is already assigned by someone for this joints inventory, please re-assign the task',
                    nomixpackedtubeavailable: 'No mixed pkg. tube available.',
                    wasteweight: 'Waste Weight',
                    wastewtrequired: 'Waste weight is required.',
                    unassignedtampedjoints: 'Unassign Tamped Joints',
                    assignedtampedjoints: 'Assigned Tamped Joints',
                    minPkgLotQtyMsg: 'Minimum two lots are required to create a mix package.',
                    reqjoints: 'Req. Joints',
                    taskCompleted:'Task Already Completed',
                    readyForPackaging: 'Ready for Packaging',
                    readyForTamping: 'Ready for Tamping',
                    readyForLabeling: 'Ready for Labeling',
                    requiredQtyDot: 'Required Qty.',
                    availMaterial: 'Available Material',
                    weightNeeded: 'Weight Needed',
                    availSourceMaterial: 'Available Source Material',
                    lblPreroll: 'pre-roll',
                    lblAssignToAll: 'Assign To All',
                    lnkSelectLots: 'Select Lots',
                    lnkSelectBins:'Select Bins',
                    lblNoLotPresent: 'No lot available.',
                    errSameEmpForTask: 'Same Employee for Split Task',
                    lblRequiredWeight: 'Required Weight',
                    lblAvailWeight: 'Available Weight',
                    lblSelectedWeight: 'Selected Weight',
                    errSelectValidWeight: 'Select valid weight.',
                    errWeightRequired: 'Weight is required.',
                    tpSplitTask: 'Split Task',
                    tpUndoTask: 'Undo Task',
                    viewChangeLots: 'View/Change Lots',
                    viewChangeBins:'View/Change Bins',
                    preRollSize: 'Assigned weight should be greater or equal to pre-roll size.',
                    viewaddbin:'View/Add Bins'

                },
                searchtask: {
                    pageheading: 'All Tasks',
                    Title: 'Employee Dashboard',
                    searchtasktitle: 'Search Task'
                },
                taskaction: {
                    pageheading: 'Task Action Details',
                    allrommtaskstatus: 'Room All Task Status',
                    currenttaskhistory: 'Current Task History',
                    taskalreadystarted: 'Task already started.',
                    taskalreadyresumed: 'Task already resumed.',
                    taskalreadypaused: 'Task already paused.',
                    taskstarted: 'Task has been started.',
                    taskresumed: 'Task has been resumed.',
                    taskpaused: 'Task has been paused.',
                    taskActionCannotPerformS: 'Cannot start the task, because task already deleted.',
                    taskActionCannotPerformP: 'Cannot pause the task, because task already deleted.',
                    taskActionCannotPerformR: 'Cannot resume the task, because task already deleted.',
                    taskDeletedSuccessfully: 'Task Deleted Successfully.',
                    deleteConfirm: 'Do you want to delete this record?',
                    title: 'Task Action',
                    taskalreadydeleted: 'Task is already deleted.',
                    // tslint:disable-next-line:max-line-length
                    lottrimcompletedmsg: ' This lot is already fully lot trimmed completed. Can`t start this task.',
                    // Added by Devdan :: 23-Nov-2018 ::
                    taskActionCannotEditDeleted: 'This task is aleady Deleted. You can not edit this task',
                    taskActionCannotEditStarted: 'This task is aleady Started. You can not edit this task',
                    taskActonCannotDeleted: 'This task is already started or deleted. Can not delete this task',
                    lottrimcompletedmsgForEdit: ' This lot is already fully lot trimmed completed. Can`t edit this task.',
                },
                lotTrackingDetails: {
                    pageheading: 'Lot Tracking Details',
                    Title: 'Lot Tracking'
                }
            }
        };
    }
}
