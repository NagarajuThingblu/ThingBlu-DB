export const environment = {
  production: true,
   // apiEndpoint: 'http://192.168.5.148/tbwebapinew/',
   // apiEndpoint: 'https://localhost:44386/',
   //  apiEndpoint: 'https://tbdevtestapi.azurewebsites.net/',
   //  apiEndpoint: 'http://localhost:54302/',
   // apiEndpoint: 'http://192.168.5.148/tbtestapi/',
  // apiEndpoint: 'http://localhost/thingbluwebapinew/'
  // apiEndpoint: 'https://thingbluapiuat.azurewebsites.net/',
  tolerance: 5,
  //  apiEndpoint: 'https://tbappapihannah.azurewebsites.net/',
 apiEndpoint: 'https://tbgrowqc-api.azurewebsites.net/',//Arbre dev
  // apiEndpoint: 'https://tbappapitest.azurewebsites.net/',
  //  apiEndpoint:'https://hwg-api.azurewebsites.net/',
  //  apiEndpoint: 'https://tbdemowebapi.azurewebsites.net/',

  sessionTimeout: 86399,
  refreshTime: 1, // refresh time in minutes,
  encryptDecryptKey: 'mechsoft@12',
  parentEncryptionKey: 'm3ch50ft',
  clientCode: 'HANNAH',
 clientKey: 'Hannah Industries',
// clientCode:'HWG',
// clientKey:'HWG',
  

  // ** Start Hannah LocalDev Test config
    // tenant: 'thingblub2ctest.onmicrosoft.com',
    // tenantClientID: '00f2482d-33d6-47a8-9639-39be906d926e',
    // signUpSignInPolicy: 'B2C_1_SignUpInV2',
    // signUpPolicy: 'B2C_1_SignUpV2',
    // resetPolicy: 'B2C_1_ResetPassword',
    // b2cScopes: 'https://thingblub2ctest.onmicrosoft.com/helloAPI/demo.read',
    // redirectUri: 'https://tbdevtest.azurewebsites.net/',
    // resetPwdRedirectUri: 'https://tbdevtest.azurewebsites.net/resetsuccess/'
  // ** End Hannah LocalDev Test config

  //start of dev testing
  tenant: 'thingbluB2Csample.onmicrosoft.com',
  tenantClientID: '74b4f050-b759-45cd-ab9d-1c0e3a8417f7',
  signUpSignInPolicy: 'B2C_1_SignupSignin',
  signUpPolicy: 'B2C_1_SignUpV2',
  resetPolicy: 'B2C_1_PasswordReset',
  b2cScopes: 'https://thingbluB2Csample.onmicrosoft.com/access-api/user_impersonation',
  //  redirectUri: 'https://thingbludev.thingbluapp.com/',
  // resetPwdRedirectUri: 'https://thingbludev.thingbluapp.com/resetsuccess/',
  redirectUri: 'https://test.thingbluapp.com/',
 resetPwdRedirectUri: 'https://test.thingbluapp.com/resetsuccess/',
//  redirectUri: 'http://localhost:8000/',
//  resetPwdRedirectUri: 'http://localhost:8000/resetsuccess/',
  tenantURL:'thingbluB2Csample.b2clogin.com',
  // reportURL: 'https://thingbludemoapplication.navizanalytics.com/ThingbluDev'
  reportURL: 'https://thingbludemoapplication.navizanalytics.com/Grow',
 
  //End of dev testing

  // ** Start Hannah UAT config
    // tenant: 'uatHannahTenant.onmicrosoft.com',
    // tenantClientID: '7f3efe7a-ae02-4508-8986-08e6df843296',
    // signUpSignInPolicy: 'B2C_1_SignUpInV2',
    // signUpPolicy: 'B2C_1_SignUpV2',
    // resetPolicy: 'B2C_1_ResetPassword',
    // b2cScopes: 'https://uatHannahTenant.onmicrosoft.com/hannahuatwebapiid/demo.read',
    // redirectUri: 'https://test.thingbluapp.com/',
    // resetPwdRedirectUri: 'https://test.thingbluapp.com/resetsuccess/',
    // tenantURL:'uatHannahTenant.b2clogin.com'
  // ** End Hannah UAT config

  // **  start Hannah Live  Config **
    // tenant: 'thingbluprodauth.onmicrosoft.com',
    // tenantClientID: '51db0c7d-77e9-48ea-a2f7-2e5464287eea',
    // signUpSignInPolicy: 'B2C_1_SignUpInV2',
    // signUpPolicy: 'B2C_1_SignUpV2',
    // resetPolicy: 'B2C_1_ResetPassword',
    // b2cScopes: 'https://thingbluprodauth.onmicrosoft.com/hannahwebapiid/demo.read',
    // redirectUri: 'https://hannah.thingbluapp.com/',
    // resetPwdRedirectUri: 'https://hannah.thingbluapp.com/resetsuccess/'
   // ** End Hannah Live Config **

};

