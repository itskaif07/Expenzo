import { Component, inject, OnInit, ɵisInjectable } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  authService = inject(AuthService)
  fb = inject(FormBuilder)
  router = inject(Router)

  errorMessage: string | null = null

  signUpForm: FormGroup = new FormGroup({})

  ngOnInit(): void {
    this.setFormState()
  }

  setFormState() {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', [Validators.required, Validators.minLength(6)]]
    })
  }


  onSubmit() {
    const email = this.signUpForm.controls['email']?.value
    const password = this.signUpForm.controls['password']?.value
    const displayName = this.signUpForm.controls['displayName']?.value

    this.authService.emailSignUp(email, password, displayName).subscribe((res: any) => {
      console.log('sign up successfull')
      this.router.navigateByUrl('email-verification')
    }, error => {
      if (error.code == 'auth/invalid-email') {
        this.errorMessage = 'Invalid email or password ! please try again.'
      }
      else if (error.code == 'auth/email-already-in-use') {
        this.errorMessage = 'Email already registered, Try log in or use different email.'
      }
      else {
        this.errorMessage = 'Some error occured while registering you, Please try again'
      }
      console.log('some error while sign up', error)
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
