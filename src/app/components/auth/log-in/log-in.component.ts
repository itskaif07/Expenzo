import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

   authService = inject(AuthService)
    fb = inject(FormBuilder)
    router = inject(Router)
  
    loginForm: FormGroup = new FormGroup({})
  
    ngOnInit(): void {
      this.setFormState()
    }
  
    setFormState() {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      })
    }
  
  
    onSubmit() {
      const email = this.loginForm.controls['email']?.value
      const password = this.loginForm.controls['password']?.value
  
      this.authService.logIn(email, password).subscribe((res: any) => {
        console.log('log in successfull')
        this.router.navigateByUrl('/')
      }, error => {
        console.log('some error while log in', error)
      })
    }
  
    googleSignUp() {
      this.authService.googleSignUp().subscribe((res: any) => {
        console.log('google sign up successfull')
        this.router.navigateByUrl('/')
      }, error => {
        console.log('error while google sign up, error: ', error)
      })
    }
}
