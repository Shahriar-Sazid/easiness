// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const APP_CONFIG = {
  production: false,
  environment: 'LOCAL',
  defaultAuth: 'firebase',
  firebaseConfig: {
    apiKey: 'AIzaSyBSNQDNzQLJLyJWnG40AO27_TY7gRkqjho',
    authDomain: 'test-authentication-4be35.firebaseapp.com',
    databaseURL: 'https://test-authentication-4be35.firebaseio.com',
    projectId: 'test-authentication-4be35',
    storageBucket: 'test-authentication-4be35.appspot.com',
    messagingSenderId: '679258537586',
    appId: '1:679258537586:web:00f41690d98a38435dcceb',
    measurementId: 'G-6L8TCTHC4H'
  },
  apiBaseUrl: "127.0.0.1:8080",
  pageSize: 5,
  defaultDateFormat: 'dd-MM-yy hh:mm a'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
