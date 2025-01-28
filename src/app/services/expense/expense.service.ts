import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, orderBy, query, sum, updateDoc, where } from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';
import { expense } from '../../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private getCollection(uid: string) {
    return collection(this.fireStore, `users/${uid}/expenses`)
  }

  fireStore = inject(Firestore)

  addExpense(userId: string, expense: expense) {
    const expensesCollection = this.getCollection(userId)
    return from(addDoc(expensesCollection, expense).then((docRef) => {
      console.log('Document successfully added with ID:', docRef.id);
    }).catch((error) => {
      console.error('Error adding document:', error);
    })
    )
  }

  getExpenses(userId: string): Observable<any> {
    const expensesCollection = this.getCollection(userId)
    const q = query(expensesCollection, orderBy('date', 'desc'))
    return from(collectionData(q, { idField: 'id' }))
  }

  getToTalExpenses(userId: string): Observable<any> {
    const expensesCollection = this.getCollection(userId)
    let totalAmount = 0;

    return new Observable(observer => {

      getDocs(expensesCollection).then(querySnapshot => {

        querySnapshot.forEach((docs) => {
          totalAmount += docs.data()['amount'] || 0
        })

        observer.next(totalAmount)
        observer.complete()
      })
        .catch((error) => {
          observer.error(error)
        })
    })
  }

  getCategorisedSum(userId: string): Observable<any> {
    const expensesCollection = this.getCollection(userId)

    return new Observable(observer => {
      getDocs(expensesCollection).then(querySnapshot => {
        const categorySums: any = {};

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const category = data['category'] || '';
          const amount = data['amount'] || 0;

          if (categorySums[category]) {
            categorySums[category] += amount;
          } else {
            categorySums[category] = amount;
          }
        });

        observer.next(categorySums);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getMonthlyData(userId: string): Observable<any> {
    const expensesCollection = this.getCollection(userId)

    return new Observable((observer) => {
      getDocs(expensesCollection)
        .then((querySnapshot) => {
          let monthlyData: any = {};

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data['date'];

            data['id'] = doc.id

            if (date) {
              // Extract "MM-YYYY" format
              const monthYear = date.slice(5, 7) + '-' + date.slice(0, 4);

              if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = [];
              }
              monthlyData[monthYear].push(data);
            } else {
              console.warn('Missing date for document:', doc.id);
            }
          });

          observer.next(monthlyData);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getMonthlySum(userId: string): Observable<{ [key: string]: number }> {
    const expensesCollection = this.getCollection(userId)
    const monthlySums: { [key: string]: number[] } = {};

    return new Observable((observer) => {
      getDocs(expensesCollection)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const amount = data['amount'] || 0;
            const date = data['date'] || '';
            if (date) {
              const monthDate = date.slice(0, 7);

              if (!monthlySums[monthDate]) {
                monthlySums[monthDate] = [];
              }
              monthlySums[monthDate].push(amount);
            }
          });

          // Convert arrays of amounts into summed totals
          const finalSums: { [key: string]: number } = {};
          for (let month in monthlySums) {
            finalSums[month] = monthlySums[month].reduce((sum: number, value: number) => sum + value, 0);
          }

          observer.next(finalSums);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getCategorisedMonthlySum(userId: string): Observable<any> {
    const expensesCollection = this.getCollection(userId)

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

            if (categorisedMonthlyData[monthYear][category]) {
              categorisedMonthlyData[monthYear][category] += amount;
            } else {
              categorisedMonthlyData[monthYear][category] = amount;
            }
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

  getSpecificData(userId: string, docId: string): Observable<expense> {
    const docRef = doc(this.fireStore, `users/${userId}/expenses/${docId}`);

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data() as expense;  // Type-cast to Expense
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
