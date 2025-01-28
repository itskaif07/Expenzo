import { Component, inject, OnInit } from '@angular/core';
import { applyActionCode, Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-email-verification',
  imports: [],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export class EmailVerificationComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute)
  auth = inject(Auth)
  router = inject(Router)

  authService = inject(AuthService)

  oobCode: string | null = null

  message: string | null = null

  ngOnInit(): void {
    this.verifyEmail()
  }


  verifyEmail() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.oobCode = params['oobCode']
    })

    if (this.oobCode != null) {
      applyActionCode(this.auth, this.oobCode).then(() => {
        this.message = 'success'
        console.log('email successfully verified')
        this.logInAfterVerification()
      })
        .catch((error) => {
          this.message = 'fail'
          console.log('some error while verifying email', error)
        })
    }

  }


  logInAfterVerification() {
    this.authService.userSubject.value?.reload().then(() => {
      const currentUser = this.authService.userSubject.value

      if (currentUser?.emailVerified) {
        console.log('successfully verified')
        this.router.navigateByUrl('/')
      }
      else {
        console.log('email could be verified', currentUser)
        setTimeout(() => {
          this.router.navigateByUrl('/sign-up')
        }, 3000);
      }
    })
      .catch((error: any) => {
        console.log('some error occured while verification', error)
      })
  }
}
