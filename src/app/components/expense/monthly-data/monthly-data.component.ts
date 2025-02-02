import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ExpenseService } from '../../../services/expense/expense.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-data',
  imports: [BaseChartDirective, RouterLink, CommonModule],
  templateUrl: './monthly-data.component.html',
  styleUrl: './monthly-data.component.css'
})
export class MonthlyDataComponent implements OnInit {

  authService = inject(AuthService)
  expenseService = inject(ExpenseService)
  activatedRoute = inject(ActivatedRoute)

  uid: string | null = null
  date: string | null = null
  monthDate: string | null = null
  totalSum: number | null = null
  percentageList: number[] = []
  monthlySum: any = null
  sumList: any = null
  categories: string[] = []
  monthName: string | null = null
  colorList: string[] = []
  isLoading: boolean = true
  totalAmount:number | string | null = null

  ngOnInit(): void {
    this.getUserId()
    this.getDateAndAmount()
    this.getMonthName()
  }

  getUserId() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.uid = user.uid
        this.getMonthlyData()
      }
    })
  }

  getDateAndAmount() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params) {
        this.date = params.get('date')
        this.totalAmount = params.get('amount')
      }
    })
  }

  getMonthlyData() {
    if (!this.uid) return;

    this.expenseService.getCategorisedMonthlySum(this.uid).subscribe((res: any) => {
      if (!res) return;

      this.monthlySum = res;

      if (this.date && this.monthlySum[this.date]) {
        this.sumList = this.monthlySum[this.date];
      }

      this.getTotalSum()
    });
  }


  getTotalSum() {
    this.categories = Object.keys(this.sumList)
    this.totalSum = Object.values(this.sumList).reduce((acc: number, value: any) => acc + value, 0)
    this.getPercentage();
  }

  getPercentage() {
    if (!this.totalSum) return;

    const monthlyAmount = Object.values(this.sumList) as number[]

    for (let sum of monthlyAmount) {
      const percentage = ((Number(sum) / this.totalSum) * 100)
      this.percentageList.push(parseFloat(percentage.toFixed(2)));
    }
    this.updateGraph()

    this.isLoading = false
  }

  graphConfiguration: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
      },
      {
        data: []
      }
    ]
  }

  

  updateGraph() {
    if (!this.categories) return;
    if (!this.percentageList) return;

    this.graphConfiguration = {
      labels: this.categories,
      datasets: [
        {
          label: 'Percentage %',
          data: this.percentageList,
          backgroundColor: '#2563eb',
        },
        {
          label: 'Amount ₹',
          data: Object.values(this.sumList),
          backgroundColor: '#16a34a',
        }

      ],

    }
  }


  getMonthName() {
    if (this.date) {
      const monthDate = parseInt(this.date.slice(5, 7), 10)

      const months = [
        '', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      this.monthName = months[monthDate]
    }
  }


}
