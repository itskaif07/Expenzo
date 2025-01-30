import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, orderBy, query } from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  fireStore = inject(Firestore);
  authService = inject(AuthService)


  DefaultCollectionRef = collection(this.fireStore, 'category')

  getUserCollection(uid: string) {
    const userCollectionRef = collection(this.fireStore, `users/${uid}/category`)
    return userCollectionRef;
  }


  addCategory(value: string, uid: string): Observable<any> {
    const capitalized = this.capitalize(value)
    return from(addDoc(this.getUserCollection(uid), { name: capitalized })).pipe(
      switchMap(() => this.getCategories())
    )
  }

  capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  getCategories(): Observable<any[]> {
    const q = query(this.DefaultCollectionRef, orderBy('name'))
    return from(
      getDocs(q).then((querySnapshot) => {
        return querySnapshot.docs.map(doc => ({
          name: doc.data()['name']
        }));
      })
    );
  }

  getUserCategories(uid: string): Observable<any[]> {
    const q = query(this.getUserCollection(uid), orderBy('name'));
    return from(
      getDocs(q).then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          name: doc.data()['name'],
        }));
      })
    );
  }

  deleteCategory(uid: string, docId: string): Observable<any> {
    const docRef = doc(this.fireStore, `users/${uid}/category/${docId}`);
  
    return from(deleteDoc(docRef)).pipe(
      switchMap(() => this.getUserCategories(uid).pipe(
        map((categories) => ({ success: true, categories }))
      )),
      catchError((error) => {
        console.error('Error deleting document: ', error);
        return of({ success: false, error });
      })
    );
  }
  



}
