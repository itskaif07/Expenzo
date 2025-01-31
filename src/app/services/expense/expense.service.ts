import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, orderBy, query, sum, updateDoc, where } from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';
import { expense } from '../../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  fireStore = inject(Firestore)

  // user all expenses path

  private getCollection(uid: string) {
    return collection(this.fireStore, `users/${uid}/expenses`)
  }


  // Add Expense

  addExpense(userId: string, expense: expense) {
    const expensesCollection = this.getCollection(userId)
    return from(addDoc(expensesCollection, expense).then((docRef) => {
      console.log('Document successfully added with ID:', docRef.id);
    }).catch((error) => {
      console.error('Error adding document:', error);
    })
    )
  }

  // All expense data of a user grouped by months

  getMonthlyData(userId: string) {
    const expensesCollection = this.getCollection(userId)

    const q = query(expensesCollection, orderBy('date', 'desc'))

    return from(getDocs(q)).pipe(

      map(queySnapshot => {
        return queySnapshot.docs.reduce((acc: any, doc) => {

          const data = doc.data()
          data['id'] = doc.id
          const date = data['date'] || ''

          if (date) {
            const monthDate = date.slice(0, 7)
            acc[monthDate] = acc[monthDate] || []
            acc[monthDate].push(data)
          }

          return acc
        }, {})
      })
    )
  }


  // Monthly Total Amount

  getMonthlySum(userId: string): Observable<{ [key: string]: number }> {
    const expensesCollection = this.getCollection(userId)

    return from(getDocs(expensesCollection)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.reduce((acc: { [key: string]: number }, doc) => {
          const data = doc.data()
          const date = data['date'] || ''
          const amount = data['amount'] || ''

          if (date) {
            const monthYear = date.slice(0, 7)
            acc[monthYear] = (acc[monthYear] || 0) + amount
          }

          return acc
        }, {})
      })
    )
  }


  // categorised monthly data

  getCategorisedMonthlySum(userId: string): Observable<any> {
    const expensesCollection = this.getCollection(userId);

    return new Observable(observer => {
      getDocs(expensesCollection).then(querySnapshot => {
        const categorisedMonthlyData: any = {};

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const date = data['date'] || '';
          const category = data['category'] || 'Uncategorized';
          const amount = data['amount'] || 0;

          if (date) {
            const monthYear = date.slice(0, 7);

            if (!categorisedMonthlyData[monthYear]) {
              categorisedMonthlyData[monthYear] = {};
            }

            categorisedMonthlyData[monthYear][category] =
              (categorisedMonthlyData[monthYear][category] || 0) + amount;
          } else {
            console.warn('Missing date for document:', doc.id);
          }
        });

        observer.next(categorisedMonthlyData);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  // details of a single expense of a user

  getSpecificData(userId: string, docId: string): Observable<expense> {
    const docRef = doc(this.fireStore, `users/${userId}/expenses/${docId}`);

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data() as expense;
        } else {
          throw new Error('Document does not exist');
        }
      })
    );
  }

  //Update field

  updateField(userId: string, docId: string, field: string, newValue: string | number | Date) {
    const docRef = doc(this.fireStore, `users/${userId}/expenses/${docId}`)

    return from(updateDoc(docRef, { [field]: newValue })).pipe(
      map(() => {
        return { success: true }
      }),
      catchError((error) => {
        console.error('Error updating field: ', error);
        return of({ success: false, error });
      })
    )
  }

  // delete document

  deleteData(userId: string, docId: string): Observable<any> {
    const docRef = doc(this.fireStore, `users/${userId}/expenses/${docId}`)

    return from(deleteDoc(docRef)).pipe(
      map(() => {
        return { sucess: true }
      }),
      catchError((error) => {
        console.error('Error deleting document: ', error);
        return of({ success: false, error });
      })

    )
  }


}
