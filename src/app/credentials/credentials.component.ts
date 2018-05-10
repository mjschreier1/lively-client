import { Component, OnInit } from '@angular/core';
import { Credentials } from '../interfaces/credentials';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent implements OnInit {
  credentials: Credentials;
  invalidInput: boolean = false;

  constructor(private _authentication: AuthenticationService) { }

  ngOnInit() {
    this.credentials = {
      last: "",
      pin: null
    };
  }

  authenticateUser() {
    this._authentication.authenticateUser(this.credentials)
  }

}
