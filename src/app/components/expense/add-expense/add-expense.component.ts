import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { ExpenseService } from '../../../services/expense/expense.service';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { firstValueFrom } from 'rxjs';

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
  userCategoryOptions: any[] = []
  combinedCategories: any[] = []
  uid: string | null = null
  isAddingCategory: boolean = false
  addedCategory: string = ''
  addedCategoryError: string = ''
  isCategoryError: boolean = false

  addExpenseForm: FormGroup = new FormGroup({})

  ngOnInit(): void {
    this.getUserId()
    this.setFormState()
    this.combineCategoryOptions()
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
    this.addedCategory = '';
    this.isCategoryError = false
    this.addedCategoryError = ''
    this.isAddingCategory = false
  }

  async combineCategoryOptions() {
    try {
      this.categoryOptions = await firstValueFrom(this.categoryService.getCategories()) || [];
      this.userCategoryOptions = this.uid 
        ? await firstValueFrom(this.categoryService.getUserCategories(this.uid)) || [] 
        : [];
  
      this.combinedCategories = [...this.categoryOptions, ...this.userCategoryOptions];
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  


  addCategory() {

    this.isCategoryError = false;
    this.addedCategoryError = '';

    this.addedCategory = this.categoryService.capitalize(this.addedCategory)

    if (this.addedCategory.trim() === '') {
      this.isCategoryError = true
      this.addedCategoryError = "Category is required"
      return;
    }

    const categoryExists = this.categoryOptions.some((category) => {
      return this.addedCategory === category.name
    });

    const userCategoryExists = this.userCategoryOptions.some((category) => {
      return this.addedCategory === category.name
    })

    if (categoryExists || userCategoryExists) {
      this.isCategoryError = true
      this.addedCategoryError = `${this.addedCategory} already exists`
      return;
    }

    if (this.uid != null) {
      this.categoryService.addCategory(this.addedCategory, this.uid).subscribe(
        (res: any) => {
          this.closeAddCategory();
          this.combineCategoryOptions()
          this.addedCategory = '';
        },
        (error: any) => {
          console.error('Error while adding category:', error);
        }
      );
    }
  }



  onSubmit() {
    if (this.uid != null) {
      this.expenseService.addExpense(this.uid, this.addExpenseForm.value).subscribe((res: any) => {
        this.router.navigateByUrl('expenses-list')
      }, error => {
        console.log('error while adding expense', error)
      })
    }
    else {
      this.router.navigateByUrl('/log-in')
    }
  }
}
