export class LotResources {
    static getResources() {
        return {
            en: {
                lotentryform: {
                    pageheading: 'New Lot Entry',
                    biotfweight: 'Transfer Weight',
                    biotfweightrequired: 'Enter transfer weight.',
                    startweight: 'Start Weight',
                    startweightrequired: 'Enter start weight.',
                    costoflot: 'Lot Cost(USD)',
                    costoflotrequired: 'Enter lot cost.',
                    shortageoverage: 'Shortage/Overage',
                    growerlotno: 'State Lot No.',
                    lotsavedsuccess: 'Lot details saved successfully.',
                    growerlotalreadyexist:  'State Lot No. already exists.',
                    startwtnotmatch: 'Sum of bud and joints material weight is not match with lot start weight.',
                    Title: 'New Lot Entry'
                },
                lotTrackingDetails: {
                    pageheading: 'Lot Tracking Details',
                    unskewmaterialwt: 'Un-Skewed Material Wt.',
                    budmaterialwt: 'Bud Material Weight',
                    jointsmaterialwt: 'Joints Material Wt.',
                    oilmaterialwt: 'Oil Material Weight',
                    wastematerialwt: 'Waste Material Wt.'
                },
                lotNoteDetails: {
                    notesavedsuccess: 'Lot note added successfully.',
                    growerlotno: 'State Lot No.',
                    strain: 'Strain',
                    startwt: 'Start Weight',
                    biotfweight: 'Transfer Weight',
                    lotcost: 'Lot Cost(USD)',
                    shortageoverage: 'Shortage/Overage',
                    budmaterialwt: 'Bud Material Weight',
                    jointsmaterialwt: 'Joints Material Weight',
                    oilmaterialwt: 'Oil Material Weight',
                    nocommentpresent: 'No lot comment is available.',
                    lotnoterequired: 'Lot Note is required.',
                    lotnotewhitespace: 'Lot Note can not conatain any whitespace.',
                    lotnoteplaceholder: 'Add Lot Note...',
                    lotcomments: 'Lot Comments',
                    savenote: 'Save Note'
                },
                // Added By Bharat T on 13th-July-2018
                lotlisting: {
                    pageheading: 'Lot List',
                    type: 'Type',
                    startwt: 'Start Wt.',
                    edit: 'Edit',
                    title: 'Lot List',
                    deleteConfirm: 'Are you sure you want to delete this lot?' +
                        '(If yes is selected, any tasks associated with this lot will also be deleted.)',
                    lotdeletesuccess: 'Lot deleted successfully.'
                },
                editlot: {
                    pageheading: 'Edit Lot',
                    biotfweight: 'Transfer Weight',
                    biotfweightrequired: 'Enter transfer weight.',
                    startweight: 'Start Weight',
                    startweightrequired: 'Enter start weight.',
                    costoflot: 'Lot Cost(USD)',
                    costoflotrequired: 'Enter lot cost.',
                    shortageoverage: 'Shortage/Overage',
                    growerlotno: 'State Lot No.',
                    lotsavedsuccess: 'Lot details updated successfully.',
                    growerlotalreadyexist:  'Grower Lot No. already exists.',
                    startwtnotmatch: 'Sum of bud and joints material weight is not match with lot start weight.',
                    title: 'Edit Lot',
                },
                // End of Added By Bharat T on 13th-July-2018
                lotinventorydetails: {
                    taskname: 'Task Name',
                    unassignedweight: 'Un-Assigned Weight',
                    assignedweight: 'Assigned Weight',
                    trimming: 'Trimming',
                    sifting: 'Sifting',
                    budpackaging: 'BUD Packaging',
                    grinding: 'Grinding',
                    jointcreation: 'Joint Creation',
                    tamping: 'Tamping',
                    tubing: 'Tubing',
                    tublabling: 'Tube Labeling',
                    oiloutward: 'Oil Outward',
                    oilinward: 'Oil Inward',
                    oilpackaging: 'Oil Packaging',
                    orderfullfillmentQAcheck: ' Order fullfillment QA Check',
                    packagereplacement: ' Package Replacement',
                    Orderedprocesswt: 'Order Proc. Weight',
                    rawshrinkagewt: 'Raw Weight',
                    budshrinkagewt: 'Bud Weight',
                    jointshrinagewt: 'Joints Weight',
                    oilshrinkagewt: 'Oil Weight',
                    shrinkagewt: 'Shrinkage Weight',
                    BrandAndLabelReplace: 'Brand and Label Replacement',
                    startweight: 'Start Weight',
                    wasteweight: 'Waste Weight'

                },
                lotShrinkagedetails: {
                    lotno: 'Lot No',
                    grower: 'Grower',
                    strain: 'Strain',
                    lottype: 'Lot Type',
                    tasktype: 'Task Type',
                    startweight: 'Start Weight',
                    wasteweight: 'Waste Weight',
                    unassignedWt: 'Unassigned Wt',
                    assignedwt: 'Assigned Wt',
                    processedwt: 'Processed Wt',
                    inventorytype: 'Inventory Type',
                    Confirmmsg: 'Are you sure to mark this weight as Shrinkage?',
                    taskstatus: 'Task Status',
                    employee: 'Employee',
                    Shrinkagemsg: 'For close this lot, Please Complete the following tasks.'
                }
            }
        };
    }
}
