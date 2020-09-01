export class LotResources {
    static getResources() {
        return {
            en: {
                lotentryform: {
                    pageheading: 'New Lot Entry',
                    biotfweight: 'Transfer Weight(Grams)',
                    biotfweightrequired: 'Enter transfer weight.',
                    // startweight: 'Start Weight',
                    startweight: 'Recevied Weight(Grams)',
                    startweightrequired: 'Enter received weight.',
                   // costoflot: 'Lot Cost(USD)',
                    costoflot: 'Lot Cost',
                    costoflotrequired: 'Enter lot cost.',
                    shortageoverage: 'Shortage/Overage(Grams)',
                    growerlotno: 'Lot ID',
                    lotsavedsuccess: 'Lot details saved successfully.',
                    growerlotalreadyexist:  'State Lot No. already exists.',
                    startwtnotmatch: 'Sum of bud and joints material weight is not match with lot start weight.',
                    Title: 'New Lot Entry',
                    lotentrytrimmed: 'Trimmed?',
                    basicsection: 'Basic Information',
                    weightsection: 'Weight and pricing',
                    labsection: 'Lab Information',
                    notesection: 'Notes',


                     // startwt: 'Start Weight',
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
                    // growerlotno: 'State Lot No.',
                    growerlotno: 'Lot ID.',
                    strain: 'Strain',
                    startwt: 'Start Weight',
                    biotfweight: 'Transfer Weight',
                   // lotcost: 'Lot Cost(USD)',
                    lotcost: 'Lot Cost',
                    shortageoverage: 'Shortage/Overage',
                    // budmaterialwt: 'Bud Material Weight',
                    // jointsmaterialwt: 'Joints Material Weight',
                    budmaterialwt: 'Flower Weight',
                    jointsmaterialwt: 'Preroll Weight',
                    oilmaterialwt: 'Oil Material Weight',
                    nocommentpresent: 'No lot comment is available.',
                    lotnoterequired: 'Lot Note is required.',
                    lotnotewhitespace: 'Lot Note can not conatain any whitespace.',
                    lotnoteplaceholder: 'Add Lot Note...',
                    lotcomments: 'Lot Comments',
                    savenote: 'Save Note',
                    costpergram: 'Cost Per Gram'
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
                    startweight: 'Received Weight',
                    startweightrequired: 'Enter received weight.',
                    costoflot: 'Lot Cost',
                    costoflotrequired: 'Enter lot cost.',
                    shortageoverage: 'Shortage/Overage',
                    growerlotno: 'Lot ID.',
                    lotsavedsuccess: 'Lot details updated successfully.',
                    growerlotalreadyexist:  'Grower Lot No. already exists.',
                    startwtnotmatch: 'Sum of bud and joints material weight is not match with lot start weight.',
                    title: 'Edit Lot',
                    lotentrytrimmed: 'Trimmed?'
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
