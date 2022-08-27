import { APP_CONFIG as ac } from "./environment";
export const APP_CONFIG = {
  production: false,
  environment: 'DEV',
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
