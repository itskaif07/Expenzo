import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense/expense.service';
import { AuthService } from '../../services/auth/auth.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-home',
  imports: [RouterLink, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  expenseService = inject(ExpenseService)
  authService = inject(AuthService)

  uid: string | null = null
  monthName: string | null | number = null
  totalAmount: number | null = null
  categorisedAmount: any = null
  monthlyData: any = null;
  monthlyAmount: any = []

  expenseList: any[] = []
  percentageList: string[] = []
  categoryList: string[] = []
  colorList: string[] = []



  ngOnInit(): void {
    this.getUserId()
    this.getMonth()
  }

  getUserId() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid
        this.getExpenses()
        this.getTotalAmount()
        this.getMonthlyCategorisedData()
      }
    }, error => {
      console.log('Error while fetching user id, ', error)
    })
  }

  getExpenses() {
    if (this.uid != null) {
      this.expenseService.getExpenses(this.uid).subscribe((res: any) => {
        if (res) {
          this.expenseList = res
        }
      }, error => {
        console.log('error while fetching expense list, ', error)
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
        console.log('error while fetching total sum, ', error)
      })
    }
  }



  getPercentage() {
    if (this.categorisedAmount != null && this.totalAmount != null) {
      for (let category in this.categorisedAmount) {
        if (this.categorisedAmount.hasOwnProperty(category)) {
          const categoryAmount = this.categorisedAmount[category]

          if (categoryAmount > 0) {
            const percentage = ((categoryAmount / this.totalAmount) * 100)
            this.percentageList.push(percentage.toFixed(2))
            this.categoryList.push(category)
          }

        }
      }
      this.setColor()
      this.updateChart()
    }
    else {
      console.log('amount is null')
    }
  }

  setColor() {
    const colorArray = [
      '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6', '#FF6347',
      '#1F77B4', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2',
      '#7F7F7F', '#FF1493', '#00CED1', '#FFD700', '#FF8C00', '#90EE90',
      '#FF00FF', '#A52A2A', '#800080', '#F5DEB3', '#0000FF', '#D3D3D3',
      '#32CD32', '#ADFF2F', '#FF4500', '#2E8B57', '#FF1493', '#8B0000'
    ];


    for (let i = 0; i < this.percentageList.length; i++) {
      const randomNumber = Math.floor(Math.random() * colorArray.length)
      this.colorList.push(colorArray[randomNumber])
    }
  }

  getMonthlyCategorisedData() {
    if (this.uid != null) {
      this.expenseService.getCategorisedMonthlySum(this.uid).subscribe((res: any) => {
        if (res) {
          const currentDate = new Date().toISOString().split('T')[0].slice(0, 7);
          this.monthlyData = res;

          if (this.monthlyData[currentDate]) {
            this.categorisedAmount = this.monthlyData[currentDate];
            this.getPercentage();

          } else {
            console.log('No data found for the current month:', currentDate);
          }
        }
      }, error => {
        console.log('Error fetching categorised monthly data:', error);
      });
    }
  }


  getMonth() {
    const months = [
      'January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October',
      'November', 'December'
    ];

    const currentMonthIndex = new Date().getUTCMonth();
    this.monthName = months[currentMonthIndex];
  }

  // Pie Chart Configuration
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      datalabels: {
        formatter: (value) => {
          return value.toFixed(2) + '%'
        }
      }
    },
  };

  updateChart() {
    this.pieChartData = {
      labels: this.categoryList,
      datasets: [{
        data: this.percentageList.map(p => parseFloat(p)),
        backgroundColor: this.colorList,
      }]
    }
  }

}
