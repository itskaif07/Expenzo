import { EventEmitter, inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categorySubject = new BehaviorSubject<any[]>([]);
  category$ = this.categorySubject.asObservable(); // Observable to be subscribed to

  fireStore = inject(Firestore);

  constructor() {
    this.getCategories().subscribe(categories => {
      this.categorySubject.next(categories); // Initial state set when the service is loaded
    });
  }


  collectionName = 'category'
  collectionRef = collection(this.fireStore, this.collectionName)


  addCategory(value:string):Observable<any>{
    const capitalized = this.capitalize(value)
    return from(addDoc(this.collectionRef, {name: capitalized})).pipe(
      map(() => this.getCategories())
    )
  }
 
  getCategories(): Observable<any[]> {
    return from(
      getDocs(this.collectionRef).then((querySnapshot) => {
        return querySnapshot.docs.map(doc => ({
          name: doc.data()['name']
        }));
      })
    );
  }
  
  

  capitalize(value:string){
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

}
