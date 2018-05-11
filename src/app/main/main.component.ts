import { Component, OnInit } from '@angular/core';
import { Button } from '../interfaces/button';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: User;

  constructor(private _authentication: AuthenticationService) { }

  ngOnInit() {
    this._authentication.user.subscribe(user => {
      this.user = user;
    })
  }

}
