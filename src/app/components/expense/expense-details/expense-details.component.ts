import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { ExpenseService } from '../../../services/expense/expense.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { expense } from '../../../models/expense';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-expense-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css']
})
export class ExpenseDetailsComponent implements OnInit {
  authService = inject(AuthService);
  expenseService = inject(ExpenseService);
  categoryService = inject(CategoryService)
  fireStore = inject(Firestore);
  activatedRoute = inject(ActivatedRoute)
  cdr = inject(ChangeDetectorRef)

  uid: string | null = null;
  details: expense | null = null;
  docId: string | null = null;
  isEditingSubject: boolean = false;
  isEditingAmount: boolean = false;
  isEditingDate: boolean = false;
  isEditingStatus: boolean = false;
  isEditingCategory: boolean = false;
  isEditingLocation: boolean = false;
  isEditingPaymentMethod: boolean = false;
  isEditingDescription: boolean = false;
  categoryOptions: any[] = [];

  subject: string = '';
  amount: number = 0;
  date: string | Date = '';
  status: string = '';
  category: string = '';
  location: string = '';
  paymentMethod: string = '';
  description: string = '';

  ngOnInit(): void {
    this.getUserId();
    this.getDocId();
  }

  getDocId() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.docId = params.get('id');
      this.getDetails();
    });
  }

  setFormState() {
    if (this.details) {
      this.subject = this.details.name || '';
      this.amount = this.details.amount || 0;
      this.date = this.details.date || '';
      this.status = this.details.status || '';
      this.category = this.details.category || '';
      this.location = this.details.location || '';
      this.paymentMethod = this.details.paymentMethod || '';
      this.description = this.details.description || '';
    }
  }

  getUserId() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid;
        this.getDetails();
        this.setFormState();
      }
    }, error => {
      console.log('some error while fetching the user data', error);
    });
  }

  getDetails() {
    if (this.uid != null && this.docId != null) {
      this.expenseService.getSpecificData(this.uid, this.docId).subscribe((res: expense) => {
        this.details = res;
        this.getCategoryOptions();
        this.setFormState();
      }, error => {
        console.log('Some error while fetching the user details', error);
      });
    }
  }

  getCategoryOptions() {
   
  }


  toggleSubjectEdit() {
    this.isEditingSubject = !this.isEditingSubject;
  }

  toggleAmountEdit() {
    this.isEditingAmount = !this.isEditingAmount;
  }

  toggleDateEdit() {
    this.isEditingDate = !this.isEditingDate;
  }

  toggleStatusEdit() {
    if (this.details) {
      const newStatus = this.details.status === 'paid' ? 'pending' : 'paid';
      if (this.details.status !== newStatus) {
        this.updateField('status', newStatus);
      }
    }
  }

  toggleCategoryEdit() {
    this.isEditingCategory = !this.isEditingCategory;
  }

  toggleLocationEdit() {
    this.isEditingLocation = !this.isEditingLocation;
  }

  toggleDescEdit() {
    this.isEditingDescription = !this.isEditingDescription;
  }

  togglePMethodEdit() {
    this.isEditingPaymentMethod = !this.isEditingPaymentMethod;
  }

  updateField(field: string, value: string | number | Date) {
    if (this.uid != null && this.docId != null) {
      this.expenseService.updateField(this.uid, this.docId, field, value).subscribe((res: any) => {
        this.getDetails();
        this.cdr.markForCheck();

        if (field === 'name') {
          this.toggleSubjectEdit();
        } else if (field === 'amount') {
          this.toggleAmountEdit();
        } else if (field === 'date') {
          this.toggleDateEdit();
        } else if (field === 'category') {
          this.toggleCategoryEdit();
        } else if (field === 'location') {
          this.toggleLocationEdit();
        } else if (field === 'description') {
          this.toggleDescEdit();
        } else if (field === 'paymentMethod') {
          this.togglePMethodEdit();
        }

      }, error => {
        console.log('error while updating field,', error);
      });
    }
  }
}
