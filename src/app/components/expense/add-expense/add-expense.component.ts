import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { ExpenseService } from '../../../services/expense/expense.service';
import { Router, RouterLink } from '@angular/router';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  fb = inject(FormBuilder)
  authService = inject(AuthService)
  expenseService = inject(ExpenseService)
  categoryService = inject(CategoryService)
  router = inject(Router)

  categoryOptions: any[] = []
  uid: string | null = null
  isAddingCategory: boolean = false
  addedCategory: string = ''

  addExpenseForm: FormGroup = new FormGroup({})

  ngOnInit(): void {
    this.getUserId()
    this.setFormState()
    this.categoryService.category$.subscribe((categories) => {
      this.categoryOptions = categories;
    });
  }

  getUserId() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid
      }
    }, error => {
      console.log('Error while fetching uid, ', this.uid)
    })
  }



  setFormState() {
    const today = new Date().toISOString().split('T')[0];

    this.addExpenseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      amount: ['', [Validators.required]],
      date: [today, [Validators.required]],
      category: ['', [Validators.required]],
      description: [''],
      location: [''],
      status: ['Pending', [Validators.required]],
      paymentMethod: ['Cash', [Validators.required]]
    });
  }

  openAddCategory() {
    this.isAddingCategory = true
  }

  closeAddCategory() {
    this.isAddingCategory = false
  }


  getCategoryOption() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categoryOptions = res
    })
  }

  addCategory() {
    if (this.addedCategory && this.addedCategory.trim() !== '') {
      this.categoryService.addCategory(this.addedCategory).subscribe(
        (res: any) => {
          this.closeAddCategory(); 
          this.getCategoryOption();
          this.addedCategory = ''; 
        },
        (error: any) => {
          console.error('Error while adding category:', error);
        }
      );
    } else {
      console.log('Category is empty');
    }
  }
  


  onSubmit() {
    if (this.uid != null) {
      this.expenseService.addExpense(this.uid, this.addExpenseForm.value).subscribe((res: any) => {
      }, error => {
        console.log('error while adding expense', error)
      })
    }
  }
}
