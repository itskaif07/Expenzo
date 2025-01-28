import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideFirebaseApp, initializeApp } from '@angular/fire/app'
import {provideAuth, getAuth } from '@angular/fire/auth'
import {provideFirestore, getFirestore } from '@angular/fire/firestore'
import {provideDatabase , getDatabase} from '@angular/fire/database'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'


import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const firebaseConfig = {
  apiKey: "AIzaSyDW4AhxLKxFBo6LTTN5pJgbCHylWFnGIzE",
  authDomain: "expenzo-62720.firebaseapp.com",
  projectId: "expenzo-62720",
  storageBucket: "expenzo-62720.firebasestorage.app",
  messagingSenderId: "448096593203",
  appId: "1:448096593203:web:f1a1cd3c3276b8d3b74a46",
  measurementId: "G-P3F4L2M65J"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideCharts(withDefaultRegisterables()), provideAnimationsAsync()
    
  ]
};