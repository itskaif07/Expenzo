import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ExpenseService } from '../../../services/expense/expense.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-monthly-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './monthly-list.component.html',
  styleUrl: './monthly-list.component.css'
})
export class MonthlyListComponent implements OnInit {

  authService = inject(AuthService)
  expenseService = inject(ExpenseService)

  activatedRoute = inject(ActivatedRoute)

  uid: string | null = null
  monthlyData: any = []
  date: string | null = ''
  resultData: any = []

  ngOnInit(): void {
    this.getUserId()
    this.getDate()
  }

  getUserId() {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.uid = user.uid
        this.getMonthlyData()
      }
    })
  }

  getDate() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.date = params.get('date') || ''
    })
  }

  getMonthlyData() {
    if (this.uid != null && this.date != null) {
      this.expenseService.getMonthlyData(this.uid).subscribe((res: any) => {
        if (res) {
          this.monthlyData = res || {}

          const monthDates = Object.keys(this.monthlyData);

          for (let month of monthDates) {
            if (this.monthlyData[month] && this.date == month) {
              this.date = month
            }
          }
        }
      });
    }
  }


}
