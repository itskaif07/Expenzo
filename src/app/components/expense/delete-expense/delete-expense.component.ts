import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ExpenseService } from '../../../services/expense/expense.service';

@Component({
  selector: 'app-delete-expense',
  imports: [RouterLink],
  templateUrl: './delete-expense.component.html',
  styleUrl: './delete-expense.component.css'
})
export class DeleteExpenseComponent implements OnInit {

  authService = inject(AuthService)
  expenseService = inject(ExpenseService)

  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  uid: string | null = null
  docId: string | null = null

  ngOnInit(): void {
    this.getUserId()
    this.getDocId()
  }

  getDocId() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.docId = params.get('id')
    })
  }


  getUserId() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid
      }
    })
  }

  deleteDoc() {
    if (this.uid != null && this.docId != null)
      this.expenseService.deleteData(this.uid, this.docId).subscribe((res: any) => {
        this.router.navigateByUrl('/')
      }, error => {
        console.log('error while deleting document, ', error)
      })
  }

}
