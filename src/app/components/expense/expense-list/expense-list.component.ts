import { Component, inject, OnInit } from '@angular/core';
import { ExpenseService } from '../../../services/expense/expense.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent implements OnInit {

  expenseService = inject(ExpenseService)
  authService = inject(AuthService)

  uid: string | null = null
  expenseList: any[] = []
  totalAmount: number | null = null
  monthKeys: string[] = []
  monthName: string[] = []
  monthlyAmount: { [key: string]: number } = {}; // Key is a string (month) and value is a number
  monthlyData: { [key: string]: any[] } = {};

  ngOnInit(): void {
    this.getUserId()
  }

  getUserId() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid
        this.getExpenses()
        this.getTotalAmount()
        this.getMonthlyData()
      }
    }, error => {
      console.log('error while fetching user Id', error)
    })
  }

  getExpenses() {
    if (this.uid != null) {
      this.expenseService.getExpenses(this.uid).subscribe((res: any) => {
        if (res) {
          this.expenseList = res
        }
        else {
          console.log('expenses not found')
        }
      }, error => {
        console.log('Error while fetching expenses list, ', error)
      })

    }
  }

  getTotalAmount() {
    if (this.uid != null) {
      this.expenseService.getToTalExpenses(this.uid).subscribe((res: any) => {
        if (res) {
          this.totalAmount = res
        }
      }, error => {
        console.log('error while fetching total amount', error)
      })
    }
  }


  getMonthlyData() {
    if (this.uid != null) {
      this.expenseService.getMonthlyData(this.uid).subscribe((res: any) => {
        if (res) {
          this.monthlyData = res;
          this.monthKeys = Object.keys(res);

          const months = [
            '', 'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October',
            'November', 'December'
          ];

          // Map month keys to month names
          this.monthName = this.monthKeys.map((key) => {
            const monthIndex = parseInt(key.slice(0, 2), 10);
            return months[monthIndex] + ', ' + key.slice(3);
          });

          this.getMonthlySum()
        }
      }, (error) => {
        console.log(error);
      });
    }
  }


  getMonthlySum() {
    if (this.uid != null) {
      this.expenseService.getMonthlySum(this.uid).subscribe((res: any) => {
        if (res) {
          this.monthlyAmount = res
        }
      })
    }
  }

  formatMonthKey(month: string): string {
    const [mm, yyyy] = month.split('-');
    return `${yyyy}-${mm}`;
  }

}
