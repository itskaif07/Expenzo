import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  user$ = this.userSubject.asObservable();

  isVerified: boolean = false

  auth = inject(Auth)
  router = inject(Router)

  constructor() {
    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    })
  }

  googleSignUp(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((credentials) => {
        if (credentials) {
          return from(updateProfile(credentials.user, { displayName: credentials.user.displayName, photoURL: credentials.user.photoURL }))
        }
        return of(null)
      })
    )

  }
 

  emailSignUp(email: string, password: string, displayName: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credentials => {
        if (credentials) {
          return from(
            sendEmailVerification(credentials.user).then(() => {
              updateProfile(credentials.user, { displayName: displayName })
            })
          )
        }
        return of(null)
      }))
    )
  }

  logIn(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
  }

  logOut(): Observable<any> {
    return from(signOut(this.auth))
  }

  checkLogIn(): boolean {
    return !!this.userSubject.value
  }

  checkVerification(): boolean {
    return this.userSubject.value.emailVerified
  }

}
