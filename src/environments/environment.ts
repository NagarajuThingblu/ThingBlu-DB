// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiEndpoint: 'http://192.168.5.148/tbwebapinew/',
  // apiEndpoint: 'http://192.168.5.148/tbtestapi/',
  tolerance: 5,
   apiEndpoint: 'http://localhost:54302/',
  // apiEndpoint: 'https://thingbluapiuat.azurewebsites.net/',
  // apiEndpoint: 'https://tbappapihannah.azurewebsites.net/',
  sessionTimeout: 86399,
  refreshTime: 1, // refresh time in minutes,
  encryptDecryptKey: 'mechsoft@12',
  // Key to Encrypt or Decrypt 'EncryptDecryptKey' :: Added by Devdan
  parentEncryptionKey: 'm3ch50ft',
  clientCode: 'HANNAH'

};
