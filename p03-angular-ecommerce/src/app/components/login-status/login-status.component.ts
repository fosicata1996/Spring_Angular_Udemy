import {Component, OnInit} from '@angular/core';
import {OktaAuthService} from "@okta/okta-angular";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit
{
  isAuthenticated: boolean = false;
  userFullName: string;

  constructor(private oktaAuthService: OktaAuthService)
  {
  }

  ngOnInit(): void
  {
    // subscribe to authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    )
  }

  private getUserDetails()
  {
    if (this.isAuthenticated)
    {
      // fetch the logged in user details
      this.oktaAuthService.getUser().then(
        res => {
          this.userFullName = res.name;
        }
      );
    }
  }

  logout()
  {
    // terminate the session with okta and removes current tokens
    this.oktaAuthService.signOut();
  }
}
