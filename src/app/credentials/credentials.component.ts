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
    this.credentials.last = `${this.credentials.last.slice(0, 1).toUpperCase()}${this.credentials.last.slice(1)}`
    this._authentication.authenticateUser(this.credentials)
  }

}
