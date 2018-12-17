export class MastersResource {
    static getResources() {
        return {
            en: {
                newproductype: {
                    pageheading: 'Add New Product Type',
                    brand: 'Brand',
                    brandrequired: 'Brand Required',
                    subbrand: 'Sub Brand',
                    subbrandrequired: 'Sub Brand Required',
                    strain: 'Strain',
                    strainrequired: 'Strain Required',
                    skewtype: 'Skew Type',
                    skewtyperequired: 'Skew Type Required',
                    packagetype: 'Package Type',
                    packagetyperequired: 'Package Type Required',
                    packageunit: 'Package Unit (Grams)',
                    packageunitrequired: 'Package Unit Required',
                    packageUnitLength: 'Maximum 5 digits are allowed.',
                    packageitemqty: 'Package Item Qty',
                    packageitemqtyrequired: 'Package Item Qty Required',
                    packageItemQtyLength: 'Maximum 5 digits are allowed.',
                    packagelbl: 'Package Label',
                    packagelblrequired: 'Package Lable Required',
                    packageLableLength: 'Maximum 50 characters are allowed.',
                    newproductsavedsuccess: 'New Product Type Details Saved Successfully.',
                    prodcttypealreadyexist: 'This product type already exist',
                    addnewbrand: 'Add New Brand',
                    addsubbrand: 'Add New Sub Brand',
                    addstrain: 'Add New Strain',
                    addpackagetype: 'Add New Package Type',
                    createddate: 'Created Date',
                    headingproducttypelist: 'New Product Type List',
                    prodcttypedeletesuccess: 'Product type deleted successfully.',
                    producttypedeactivatesuccess: 'Product type inactivaed successfully.',
                    producttypeactivatesuccess: 'Product type activaed successfully.',
                    producttypeisassigned: 'Can not delete this product type. It is in use.',
                    producttypeactiveinactive: 'Can not inactivate this product type. It is in use.',
                    cannotinsert: 'Can not save product type details. Might be something is not available now. Please check.',
                    brandnotpresent: 'Brand is deleted or is inactive.',
                    subbrandnotpresent: 'Sub Brand is deleted or is inactive.',
                    strainnotpresent: 'Strain is deleted or is inactivated.',
                    pkgtypenotpresent: 'Package type is deleted or is inactive.',
                    skewnotpresent: 'Skew is deleted or is inactive.',
                    packageunitval: 'Package unit qty should be greater than zero.',
                    packageitemqtyval: 'Package item qty should be greater than zero.'
                },


                addnewbrand: {
                    pageheading: 'Add New Brand',
                    pageheadinglist: 'Brand List',
                    enterbrand: 'Brand Name',
                    brand: 'Brand Name',
                    subbrand: 'Sub Brand Name',
                    brandrequired: 'Brand Required',
                    brandLength: 'Must not more than 50 charachters',
                    enterdescription: 'Brand Description',
                    description: 'Description',
                    descriptionrequired: 'Description Required',
                    descriptionLength: 'Must not more than 500 charachters',
                    newbrandsavedsuccess: 'New brand saved successfully.',
                    brandalreadyexist: 'This brand already exist',
                    headingbrandlist: 'Brand List',
                    branddeletesuccess: 'Brand deleted successfully.',
                    branddeactivatesuccess: 'Brand inactivated successfully.',
                    brandactivatesuccess: 'Brand activated successfully.',
                    brandinuse: 'Can not delete this brand. It is in use.',
                    brandhavetaskactive: 'Can not inactivate this brand. It is in use.',
                    noinsert: 'Can not insert new record for this brand.',
                    brandnotpresent: 'Brand is deleted or is inactive',
                    noupdate: 'Can not update this brand. Might be it does not exist.',
                    notactivated: 'Can not activate this brand. Might be it does not exist.',
                    notinactivated: 'Can not inactivate this brand. Might be it does not exist.',
                    notdeleted: 'Can not delete this brand. Might be it does not exist.'
                },

                addnewsubbrand: {
                    pageheading: 'New Sub Brand',
                    selectbrand: 'Select Brand Name',
                    brandrequired: 'Select Brand',
                    entersubbrand: 'Sub Brand Name',
                    subbrand: 'Sub Brand',
                    subbrandrequired: 'Sub Brand Required',
                    subbrandLength: 'Must not more than 50 charachters',
                    descriptionLength: 'Must not more than 100 charachters',
                    description: 'Sub Brand Description',
                    enterdescription: 'Sub Brand Description',
                    headingsubbrandlist: 'Sub Brand List',
                    newsubbrandsavedsuccess: 'New sub brand saved successfully.',
                    subbrandalreadyexist: 'This sub brand already exist',
                    subbrandinuse: 'Can not delete this sub brand. It is in use.',
                    cannotinsert: 'Can not save sub brand details. Might be brand is not available now. Please check.',
                    subbranddeletesuccess: 'Sub brand deleted successfully.',
                    subbranddeactivatesuccess: 'Sub brand inactivated successfully.',
                    subbrandactivatesuccess: 'Sub brand activated successfully.',
                    brandnotpresent: 'Brand is deleted or is inactive',
                    noupdate: 'Can not update this sub brand. Might be it does not exist.',
                    notactivated: 'Can not activate this sub brand. Might be it does not exist.',
                    notinactivated: 'Can not inactivate this sub brand. Might be it does not exist.',
                    notdeleted: 'Can not delete this sub brand. Might be it does not exist.',
                    brandIsInactive: 'Can not activate this sub brand. Might be brand is inactive.'
                },

                addnewstrain: {
                    pageheading: 'New Strain',
                    enterstraintype: 'Strain Type',
                    straintype: 'Strain Type',
                    straintyperequired: 'Select Strain Type',
                    enterstrain: 'Strain Name',
                    strain: 'Strain',
                    strainrequired: 'Strain Required',
                    strainLength: 'Must not more than 50 charachters',
                    description: 'Strain Description',
                    enterthc: 'THC',
                    thc: 'THC',
                    thcrequired: 'THC Required',
                    thcLength: 'Must not more than 5 charachters',
                    enterthca: 'THCA',
                    thca: 'THCA',
                    thcarequired: 'THCA Required',
                    thcaLength: 'Must not more than 5 charachters',
                    entercbd: 'CBD',
                    cbd: 'CBD',
                    cbdrequired: 'CBD Required',
                    cbdLength: 'Must not more than 5 charachters.',
                    entercbda: 'CBDA',
                    cbda: 'CBDA',
                    cbdarequired: 'CBDA Required',
                    cbdaLength: 'Must not more than 5 charachters.',
                    entertotal: 'Total',
                    total: 'Total',
                    totalrequired: 'Total Required',
                    totalLength: 'Must not more than 5 charachters',
                    newstrainsavedsuccess: 'Strain saved successfully.',
                    strainalreadyexist: 'This strain already exist',
                    strainActivated: 'Strain activated successfully.',
                    strainInactivated: 'Strain inactivated successfully.',
                    deletestrainmsg: 'Do you want to delete this strain?',
                    activestrainmsg: 'Do you want to activate this strain?',
                    deactivatestrainmsg: 'Do you want to inactivate this strain?',
                    genetics: 'Genetics',
                    geneticsrequired: 'Genetics Required.',
                    straintypenotpresent: 'Strain type is deleted or is inactive.',
                    geneticsnotpresent: 'Genetics is deleted or is inactive.',
                    strainDeletedSuccess: 'Starin deleted successfully.',
                    noupdate: 'Can not update this starin. Might be it does not exist.',
                    notdeleted: 'Can not delete this strain. Might be it does not exist.',
                    notactivated: 'Can not activate this strain. Might be it does not exist.',
                    notinactivated: 'Can not inactivate this strain. Might be it does not exist.',
                    cannotinsert: 'Can not save strain details. Might be strain type is not available now. Please check.',
                    straintypeOrGeneticsIsInactive: 'Can not activate this strain. Might be strain type or genetics is inactive.',
                    straintypedeleted: 'Can not perform action, Strain type is deleted.'
                },

                addnewstraintype: {
                    pageheading: 'New Strain Type',
                    enterstraintype: 'Strain Type Name',
                    straintyperequired: 'Strain Type Required',
                    straintypeLength: 'Must not more than 50 charachters',
                    enterdescription: 'Strain Type Description',
                    descriptionrequired: 'Description Type Required',
                    descriptionLength: 'Must not more than 500 charachters',
                    newstraintypesavedsuccess: 'Strain type  saved successfully.',
                    newstraintypeinactivated: 'Strain type inactivated successfully.',
                    newstraintypeactivated: 'Strain type activated successfully.',
                    newstraintypedeleted: 'Strain type deleted successfully.',
                    straintypealreadyexist: 'This strain type already exist',
                    straintypeisassigned: 'Can not delete this strain type. It is in use.',
                    noupdate: 'Can not update this strain type. Might be it does not exist.',
                    notactivated: 'Can not activate this strain type. Might be it does not exist.',
                    notinactivated: 'Can not inactivate this strain type. Might be it does not exist.',
                    notdeleted: 'Can not delete this strain type. Might be it does not exist.',
                    strainIsInactive: 'Can not activate this strain type. May be strain is inactive.'
                },

                addnewpackagetype: {
                    pageheading: 'Add New Package Type',
                    enterpackagetype: 'Package Type Name',
                    packagetype: 'Package Type',
                    packagetyperequired: 'Package Type Required',
                    packagetypeLength: 'Must not more than 50 charachters',
                    enterdescription: 'Enter Descripion',
                    description: 'Description',
                    descriptionrequired: 'Description Required',
                    descriptionLength: 'Must not more than 500 charachters',
                    newpackagetypesavedsuccess: 'New package type saved successfully.',
                    packagetypealreadyexist: 'This packagetype already exist',
                    headingpackagetype: 'Package Type List',
                    packagetypedeletesuccess: 'Package type deleted successfully.',
                    packagetypedeactivatesuccess: 'Package type inactivated successfully.',
                    packagetypeactivatesuccess: 'Package type activated successfully.',
                    packagetypeinuse: 'Can not delete. This package type is in use.',
                    packagetypehavetaskactive: 'Can not inactivate. This package type is in use.',
                    noupdate: 'Can not update this package type. Might be it does not exist.',
                    notactivated: 'Can not activate this package type. Might be it does not exist.',
                    notinactivated: 'Can not inactivate this package type. Might be it does not exist.',
                    notdeleted: 'Can not delete this package type. Might be it does not exist.'
                },

                grower: {
                    pageheading: 'Add New Grower',
                    growerlist: 'Grower List',
                    client: 'Client Name',
                    grower: 'Grower Name',
                    growerLength: 'Maximun 30 characters are allowed',
                    officephone: 'Office Phone',
                    officephoneLength: 'Maximum 15 digits are allowed',
                    cellphone: 'Cell Phone',
                    faxphone: 'Fax Phone',
                    primaryemail: 'Primary Email',
                    secondaryemail: 'Secondary Email',
                    emailLength: 'Maximum 50 characters are allowed',
                    contactperson: 'Contact Person',
                    contactpersonLength: 'Maximum 150 characters are allowed',
                    address: 'Address',
                    addressLength: 'Maximum 500 characters are allowed',
                    city: 'City',
                    country: 'Country',
                    state: 'State',
                    zipcode: 'Zip Code',
                    zipcodeLength: 'Zip code should not more than 9 digits',
                    latitude: 'Latitude',
                    longitude: 'Longitude',
                    latitudeLength: 'Maximum 20 characters are allowed',
                    description: 'Description',
                    descriptionLength: 'Maximum 500 characters are allowed',
                    clientrequired: 'Select Client',
                    officephonerequired: 'Enter Office Phone',
                    addressrequired: 'Enter Address',
                    cityrequired: 'Select City',
                    countryrequired: 'Select Country',
                    staterequired: 'Select State',
                    zipcoderequired: 'Enter Zip Code',
                    validemail: 'Enter Valid Email',
                    growerrequired: 'Please enter Grower',
                    growersavedsuccess: 'Grower details saved successfully.',
                    groweralreadyexist: 'Grower already exist.',
                    inactivated: 'Grower inactivated successfully.',
                    activated: 'Grower activated successfully.',
                    deletedSuccess: 'Grower deleted successfully.',
                    noupdate: 'Can not update this grower. Might be it does not exist.',
                    cannotInactivate: 'Can not inactivate this grower. Might be it does not exist.',
                    cannotActivate: 'Can not activate this grower. Might be it does not exist.',
                    cannotdelete: 'Can not delete this grower. Might be it does not exist.',
                    growerdetails: 'Grower Details'
                },
                addnewcountry: {
                    pageheading: 'Add New Country',
                    countrylist: 'Country List',
                    countryrequired: 'Enter Country',
                    country: 'Country Name',
                    countryexists: 'Country already exists',
                    countrysuccess: 'Country added successfully.'
                },
                addnewstate: {
                    pageheading: 'Add New State',
                    Statelist: 'State List',
                    state: 'State Name',
                    country: 'Country Name',
                    countryrequired: 'Country Required',
                    staterequired: 'State Required',
                    stateexists: 'State already exists',
                    statesuccess: 'State added successfully'

                },
                addnewcity: {
                    pageheading: 'Add New City',
                    citylist: 'City, State, Country List',
                    addnewcountry: 'Add New Country',
                    addnewstate: 'Add New State',
                    citysuccess: 'City added successfully',
                    cityexists: 'City already exist'
                },

                tpprocessor: {
                    pageheading: 'Add New TP Processor',
                    tpprocessorsuccess: 'TP processor saved successfully.',
                    tpprocessorexists: 'TP processor already exist.',
                    primaryemailrequired: 'Primary mail required',
                    tpprocessorlist: 'TP Processor List',
                    client: 'Client Name',
                    tpprocessorname: 'TP Processor',
                    officephone: 'Office Phone',
                    officephoneLength: 'Maximum 15 digits are allowed',
                    cellphone: 'Cell Phone',
                    faxphone: 'Fax Phone',
                    primaryemail: 'Primary Email',
                    secondaryemail: 'Secondary Email',
                    emailLength: 'Maximum 50 characters are allowed',
                    contactperson: 'Contact Person',
                    contactpersonLength: 'Maximum 150 characters are allowed',
                    address: 'Address',
                    addressLength: 'Maximum 500 characters are allowed',
                    city: 'City',
                    country: 'Country',
                    state: 'State',
                    zipcode: 'Zip Code',
                    zipcodeLength: 'Zip code should not more than 9 digits',
                    latitude: 'Latitude',
                    longitude: 'Longitude',
                    latitudeLength: 'Maximum 20 characters are allowed',
                    description: 'Description',
                    descriptionLength: 'Must not more than 100 charachters',
                    clientrequired: 'Select Client',
                    officephonerequired: 'Enter Office Phone',
                    addressrequired: 'Enter Address',
                    cityrequired: 'Select City',
                    countryrequired: 'Select Country',
                    staterequired: 'Select State',
                    zipcoderequired: 'Enter Zip Code',
                    validemail: 'Enter Valid Email',
                    tpprocessorrequired: 'Enter TP processor name',
                    tpprocessorLength: 'Maximum 30 characters are allowed',
                    expectedYeild: 'Expected Yeild (%)',
                    expectedYeildMaxLength: 'Maximum 100% Expected Yield is allowed.',
                    expectedYeildMinLength: 'Expected Yeild should be greater than 0',
                    expectedYeildrequired: 'Expected Yeild is Required',
                    materialaspayment: '% Of Material As Payment',
                    materialaspaymentrequired: 'Material as payment Required',
                    materialaspaymentMaxLength: 'Maximum 100 material payment is allowed.',
                    materialaspaymentMinLength: 'Material payment should be greater than 0',
                    exrturnaroundtime: 'Expected Turnaround Days',
                    exrturnaroundtimerequired: 'Exp Turnaround Time Required',
                    expturnaroundtimeMinLength: 'Exp turnaround time should be positive value.',
                    inactivated: 'TP processor inactivated successfully.',
                    activated: 'TP processor activated successfully.',
                    deletedSuccess: 'TP processor deleted successfully.',
                    noupdate: 'Can not update this TP Processor. Might be it does not exist.',
                    cannotInactivate: 'Can not inactivate this TP Processor. Might be it does not exist.',
                    cannotActivate: 'Can not activate this TP Processor. Might be it does not exist.',
                    cannotdelete: 'Can not delete this TP Processor. Might be it does not exist.',
                    inuse: 'Can not delete this TP processor. It is in use.',
                    duplicateEmail: 'Secondary email is same as primary email.',
                    tpprocessordetails: 'TP Processor Details',
                    tpprocessorname1: 'TP Processor Name'
                },

                retailer: {
                    pageheading: 'Add New Retailer',
                    primaryemailrequired: 'Primary Mail Required',
                    retailerlist: 'Retailer List',
                    retailertyperequired: 'Select Retailer Type',
                    client: 'Client Name',
                    retailertype: 'Retailer Type',
                    retailer: 'Retailer Name',
                    licenseno: 'License No',
                    ubino: ' UBI No',
                    officephone: 'Office Phone',
                    cellphone: 'Cell Phone',
                    faxphone: 'Fax Phone',
                    primaryemail: 'Primary Email',
                    secondaryemail: 'Secondary Email',
                    contactperson: 'Contact Person',
                    address: 'Address',
                    city: 'City',
                    country: 'Country',
                    state: 'State',
                    zipcode: 'Zip Code',
                    latitude: 'Latitude',
                    longitude: 'Longitude',
                    description: 'Description',
                    clientrequired: 'Select Client',
                    officephonerequired: 'Enter Office Phone',
                    addressrequired: 'Enter Address',
                    cityrequired: 'Select City',
                    countryrequired: 'Select Country',
                    staterequired: 'Select State',
                    zipcoderequired: 'Enter Zip Code',
                    validemail: 'Enter Valid Email',
                    retailerrequired: 'Please Enter Retailer',
                    licenserequired: 'Please Enter License',
                    ubinorequired: 'Please Enter UBI No',
                    retailersuccess: 'Retailer added successfully',
                    retailerexists: 'Retailer already exist',
                    // Added by DEVDAN :: 01-Oct-2018 :: Added messaged for data manipulation
                    inactivated: 'Retailer inactivated successfully.',
                    activated: 'Retailer activated successfully.',
                    deletedSuccess: 'Retailer deleted successfully.',
                    noupdate: 'Can not update this Retailer. Might be it does not exist.',
                    cannotInactivate: 'Can not inactivate this Retailer. Might be it does not exist.',
                    cannotActivate: 'Can not activate this Retailer. Might be it does not exist.',
                    cannotdelete: 'Can not delete this Retailer. Might be it does not exist.',
                    inuse: 'Can not delete this Retailer. It is in use.',
                    updateSuccess: 'Retailer updated successfully.',
                    phoneLength: 'Maximum 15 digits are allowed',
                    updateFailure: 'Can not update this Retailer. Might be it does not exist.',
                    // End of Added by DEVDAN
                },

                addnewclient: {
                    pageheading: 'Add New Client',
                    countrylist: 'City List',
                    clientlist: 'Client List',
                    client: 'Client Name',
                    contactperson: 'Contact Person',
                    utctimezone: 'UTC Time Zone',
                    officephone: 'Office Phone',
                    cellphone: 'Cell Phone',
                    faxphone: 'Fax Phone',
                    primaryemail: 'Primary Email',
                    secondaryemail: 'Secondary Email',
                    address: 'Address',
                    city: 'City',
                    country: 'Country',
                    state: 'State',
                    zipcode: 'Zip Code',
                    latitude: 'Latitude',
                    longitude: 'Longitude',
                    description: 'Description',
                    officephonerequired: 'Enter Office Phone',
                    addressrequired: 'Enter Address',
                    cityrequired: 'Select City',
                    countryrequired: 'Select Country',
                    staterequired: 'Select State',
                    zipcoderequired: 'Enter Zip Code',
                    utctimezonerequired: 'Select UTC Time Zone',
                    clientrequired: 'Enter Client',
                    primaryemailrequired: 'Primary Email Required',
                    clientsuccess: 'Client added successfully',
                    clientexists: 'Client already exist',
                    contactpersonrequired: 'Enter Contact Person',
                    dateformat: 'Date Format',
                    dateformatrequied: 'Select Date Format'
                },
                addnewemployee: {
                    pageheading: 'Add New Employee',
                    clientname: 'Client Name',
                    clientnamerequired: 'Client Name Required',
                    firstname: 'Employee First Name',
                    firstnameshort: 'Emp First Name',
                    firstnamerequired: 'Employee First Name Required',
                    middlename: 'Employee Middle Name',
                    middlenamerequired: 'Employee Middle Name Required',
                    lastname: 'Employee Last Name',
                    lastnameshort: 'Emp Last Name',
                    lastnamerequired: 'Employee Last Name Required',
                    gender: 'Gender',
                    genderrequired: 'Gender Required',
                    dob: 'DOB',
                    dobrequired: 'DOB Required',
                    cellphone: 'Cell Phone',
                    cellphonerequired: 'Cell Phone Required',
                    homephone: 'Home Phone',
                    homephonerequired: 'Home Phone Required',
                    primaryemail: 'Primary Email',
                    primaryemailrequired: 'Primary Email Required',
                    secondaryemail: 'Secondary Email',
                    secondaryemailrequired: 'Primary Email Required',
                    address: 'Address',
                    addressrequired: 'Address Required',
                    country: 'Country',
                    countryrequired: 'Country Required',
                    state: 'State',
                    staterequired: 'State Required',
                    city: 'City',
                    cityrequired: 'City Required',
                    zipcode: 'Zip Code',
                    zipcoderequired: 'Zip Code Required',
                    zipcodeLength: 'Zip code should not more than 9 digits',
                    username: 'User Name',
                    usernamerequired: 'User Name Required',
                    password: 'Password',
                    passwordrequired: 'Password Required',
                    passwordMinLength: 'Minimun 6 characters are required.',
                    passwordMaxLength: 'Maximum 20 characters are allowed.',
                    userrole: 'User Role',
                    userrolerequired: 'User Role Required',
                    hourlylabourrate: 'Hourly Labour Rate',
                    hourlylabourraterequired: 'Hourly Labour Rate Required',
                    adduserrole: 'Add User Role',
                    newemployeesavedsuccess: 'Employee Details Saved Successfully.',
                    employeealreadyexist: 'Employee already exist.',
                    headingemployeelist: 'Employee List',
                    edit: 'Edit',
                    newemployeedeletesuccess: 'Employee deleted successfully.',
                    employeedeactivated: 'Employee inactivated successfully.',
                    employeeactivated: 'Employee activated successfully.',
                    employeehavetasks: 'Can not delete this employee. Having task assigned.',
                    employeehavetasksForInactivate: 'Can not inactivate this employee. Having task assigned.',
                    notinactivated: 'Can not inactivate this employee. Having task assigned.',
                    notactivated: 'Can not inactivate this employee. Having task assigned.',
                    noupdate: 'Can not update this employee. Might be it does not exist.',
                    duplicatefirstname: 'First name already exists',
                    duplicatelastname: 'Last name already exists',
                    duplicateemail: 'Primary email already exists',
                    duplicateusername: 'Username already exists',
                    officephoneLength: 'Maximum 15 digits are allowed',
                    sameEmailAddr: 'Secondary email id can not be same as primary.'
                },

                addnewrole: {
                    enterrole: 'Enter Role',
                    rolerequired: 'Role Required',
                    enterdescription: 'Enter Description',
                    descriptionrequired: 'Description Required',
                    newuserrolesavedsuccess: 'New User Role Saved Successfully.',
                    useralreadyexist: 'User Already Exist'
                },

                addnewgenetics: {
                    geneticsName: 'Genetics Name',
                    geneticsrequired: 'Genetics Required',
                    geneticsLength: 'Shoukd not be more than 50 characters.',
                    enterdescription: 'Genetics Description',
                    descriptionrequired: 'Description Required',
                    newGeneticseSavedSuccess: 'Genetics saved successfully.',
                    geneticsAlreadyExist: 'Genetics already exist',
                    newGeneticsSavedSuccess: 'New Genetics Saved Successfully.',
                    noupdate: 'Can not update this genetics. Might be it does not exist.',
                    geneticsDeletedSuccess: 'Genetics deleted successfully.',
                    geneticsInactivateSuccess: 'Genetics inactivaed successfully.',
                    geneticsActivateSuccess: 'Genetics activaed successfully.',
                    geneticsIsAssigned: 'Can not delete this genetics. It is in use.',
                    notinactivated: 'Can not inactivate this genetics. Might be it does not exist.',
                    notdeleted: 'Can not delete this genetics. Might be it does not exist.',
                    strainIsInactive: 'Can not activate this genetics. May be strain is inactive.'
                },
                tppPackageType: {
                    pageheading: 'Add New TPP Package Type',
                    tpp: 'TP Processor Name',
                    tpprequired: 'Select TP Processor',
                    packagetype: 'Package Type Name',
                    packagetyperequired: 'Package Type Required',
                    packagetypeLength: 'Must not more than 50 charachters',
                    description: 'Package Type Description',
                    descriptionLength: 'Must not more than 100 charachters',
                    listheading: 'TPP Package Type List',
                    savedsuccess: 'TPP package type saved successfully.',
                    alreadyexist: 'This TPP package type already exist',
                    tpppackagetypeinuse: 'Can not delete this package type. It is in use.',
                    cannotinsert: 'Can not save package type details. Might be it is not available now. Please check.',
                    deletesuccess: 'TPP package type deleted successfully.',
                    deactivatesuccess: 'TPP Package type inactivated successfully.',
                    activatesuccess: 'TPP Package type activated successfully.',
                    tppnotpresent: 'TP processor is deleted or is inactive',
                    noupdate: 'Can not update this TPP package type. Might be it does not exist.',
                    notactivated: 'Can not activate this TPP package type. Might be it does not exist.',
                    notinactivated: 'Can not inactivate this TPP package type. Might be it does not exist.',
                    notdeleted: 'Can not delete this TPP package type. Might be it does not exist.'
                },
                createNewClient:
                {
                    clientName: 'Client'
                },

                // Added by Devdan :: 03-Oct-2018 :: Resources for Task Setting Page
                taskSetting: {
                    taskType: 'Task Name',
                    isReview: 'Is Review',
                    isNotification: 'Is Notification',
                    taskList: 'Task List',
                    taskTyperequired: 'Please Select Task',
                    savedsuccess: 'Task settings saved successfully.',
                    updatesuccess: 'Task settings updated successfully.',
                    alreadyexist: 'Task setting already exist',
                    notexists: 'Can not delete task setting. Might be it does not exist.'
                },
                clientMaster:
                {
                    header: 'Retailer Accounts',
                    clientName: 'Retailer',
                    clientType: 'Type',
                    accountNo: 'Account#',
                    licenseId: 'License ID',
                    contractPerson: 'Contact',
                    phoneNo: 'Number',
                    cityName: 'City',
                    edit: 'Edit',
                    clientAccounts: 'Retailer Accounts',
                    createClient: 'Create Retailer',
                    name: 'Name',
                    clientlist: 'Retailer List'
                },
                createNew1Client:
                {
                    createNewClient: 'Create New Retailer',
                    save: 'Save',
                    cancel: 'Cancel',
                    applicationmsg: 'Application Message',
                    clientName: 'Retailer Name',
                    customerType: 'Retailer Type',
                    ubiNo: 'UBI No',
                    isActive: 'Active',
                    cdtfaPermit: 'CDTFA Permit',
                    licenseId: 'License ID',
                    accountNo: 'Account#',
                    faxNo: 'Fax Number',
                    mobileNo: 'Mobile Number',
                    officeNo: 'Office Number',
                    shippingAddress: 'Shipping Address',
                    billingAddress: 'Billing Address',
                    addressLine1: 'Address Line 1',
                    addressLine2: 'Address Line 2',
                    addressLine3: 'Address Line 3',
                    countryName: 'Country Name',
                    stateName: 'State Name',
                    cityName: 'City Name',
                    zipCode: 'Zip Code',
                    isShippingAddressSame: 'Shipping information same as billing information',
                    clinentContact: 'Retailer Contact',
                    contactFirstName: 'First name',
                    contactLastName: 'Last Name',
                    contactJobTitle: 'Job Title',
                    contactPrimaryPhone: 'Primary Phone' ,
                    contactSecondaryPhone: 'Secondary Phone',
                    clientPhoneType: 'Phone Type',
                    contactPrimaryEmail: 'Primary Email',
                    contactSecondaryEmail: 'Secondary Email',
                    addMoreContacts: 'Add More Contacts',
                    contact: 'Contact',
                    emailInvalid: 'Invalid Email Address',
                    accountNumber: 'Account Number',
                    licenses: 'License',
                    workNo: 'Work Number',
                    fax: 'Fax Number',
                    deleteContact: 'Delete Contact',
                    clientnotes: 'Retailer Notes',
                    clientNameRequired: 'Retailer Name Required',
                    customerTypeRequired: 'Select Retailer Type',
                    licenseIdRequired: 'License ID Required',
                    officeNoRequired: 'Office Number or Mobile Number Required',
                    addressLine1required: 'Address Line 1 Required',
                    countryNameRequred: 'Select Country',
                    stateNameRequried: 'Select State',
                    cityNameRequired: 'Select City',
                    zipCodeRequired: 'Select Zip Code',
                    contactFirstNameRequired: 'First Name Required',
                    contactLastNameRequired: 'Last Name Required',
                    jobTitleRequired: 'Job Title Required',
                    primaryEmailRequired: 'Primary Email Required',
                    primaryPhoneRequired: 'Primary Phone Required',
                    primaryPhonetypeRequired: 'Select Phone Type',
                    success: 'Retailer account created successfully.',
                    exists: 'Customer account already exists',
                    duplicate: 'Duplicate Customer Name.',
                    mindigitsize: 'Minimum 10 Digits Required',
                    nocommentsavb: 'No comments available.',
                    deleteconfirmation: ' Are you sure, you want to delete contact?',
                    yes: 'Yes',
                    no: 'No',
                    contactdeletedsuccess: 'Contact deleted successfully.',
                    primarysecondaryEmailsame: 'Primary Email and Secondary Email should not be same.',
                    primarysecondaryPhonesame: 'Primary Phone and Secondary Phone should not be same.',
                    addnewnotes: 'Add new note',
                    contactupdatesuccess: 'Retailer updated successfully.',
                    activeClient: 'Are you sure you want to re-open this account?',
                    inActiveClient: 'Are you sure you want to close this account?',
                    licenseNoDuplicate: 'Duplicate License ID',
                    clientNameDuplicate: 'Duplicate Client Name',
                    atleatonecontact: 'Atleast one contact person required',
                    primeCheckbox: 'Please select atleast primary checkbox for contact.',
                    autogenerate: 'This is auto genarate after saving record',
                    retailerDelete: 'Retailer is already deleted',
                    createclient: 'Create Retailer',
                    ubiRequired: 'UBI No required'
                } ,
                roleAccessPermisssion: {
                    roleaddedsuccs: 'Role addded successfuly.',
                    atlistoneRole: 'Please select at least on page to give permission.',
                    selectRole: 'Please select User Role.',
                    roleaccesspermossion: 'Role Access Permission',
                    save: 'Save',
                    clear: 'Clear',
                    userRoles: 'User Role'
                },
                erroraccessdenied: {
                   oops: 'Oops!',
                   errormsg: 'You do not have permission to access the page that you requested, Please contact administrator.',
                   rediretmsg: 'To redirect home page',
                   clickhere: 'click here.'
                }
            }
        };
    }
}
