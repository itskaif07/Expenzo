import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  isOpen: boolean = false
  category: string = ''

    @Output() categoryAdded = new EventEmitter<any[]>()

  categoryService = inject(CategoryService)

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  addCategory() {
    if (this.category !== '') {
      this.categoryService.addCategory(this.category).subscribe((res: any) => {
        this.categoryAdded.emit(res)
      }, error => {
        console.log('error while fetching categories', error)
      })
    }
    this.close()
    this.category = ''
  }

}
