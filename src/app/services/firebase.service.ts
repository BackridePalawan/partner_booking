import { Injectable } from '@angular/core';
// import 'firebase/app-compat'
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import constants from '../../constants';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseConfig = constants.firebaseConfig;
  public firebase: firebase.app.App;
  constructor() {
    this.firebase = firebase.initializeApp(this.firebaseConfig);
  }
  public getFirestore(): firebase.firestore.Firestore {
    return this.firebase.firestore();
  }
  public getDatabase(): firebase.database.Database {
    return this.firebase.database(
      'https://brp-733b3-default-rtdb.asia-southeast1.firebasedatabase.app'
    );
  }
  public getAuth(): firebase.auth.Auth {
    return this.firebase.auth();
  }
  public getAnalytics(): firebase.analytics.Analytics {
    return this.firebase.analytics();
  }

  logEvent(
    analytics: firebase.analytics.Analytics,
    eventName: string,
    data?: any
  ) {
    if (!constants.prod) {
      return;
    }
    if (data) {
      analytics.logEvent(eventName, data);
    } else {
      analytics.logEvent(eventName);
    }
  }
}
