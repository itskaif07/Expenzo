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
  monthlyAmount: { [key: string]: number } = {};
  monthlyData: { [key: string]: any[] } = {};
  shortYear: string[] = []
  isLoading:boolean = true

  ngOnInit(): void {
    this.getUserId()
  }

  getUserId() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid
        this.getMonthlyData()
      }
      else{
        this.uid = null
        this.isLoading = false
      }
    }, error => {
      console.log('error while fetching user Id', error)
    })
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

          for (let month of this.monthKeys) {

            const monthDate = parseInt(month.slice(5, 7), 10)
            this.monthName.push(months[monthDate])

            const year = month.slice(2, 4)
            this.shortYear.push(year)
          }

          this.getMonthlySum()
          this.isLoading = false
        }
      }, (error) => {
        console.log(error);
        this.isLoading = false
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

}
