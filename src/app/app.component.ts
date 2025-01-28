import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Expenzo';

  authService = inject(AuthService)

  router = inject(Router)

  userDetails: any = []


  ngOnInit(): void {
    this.getUserDetails()
  }

  getUserDetails() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.userDetails = res
      }
    }, error => {
      console.log('error while fetching user details, ', error)
    })
  }

  logOut() {
    this.authService.logOut().subscribe((res: any) => {
      this.router.navigateByUrl('/')
    }, error => {
      console.log('error while logging you out please try again', error)
    })
  }
}
