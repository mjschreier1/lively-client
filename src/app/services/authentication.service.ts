import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User } from '../interfaces/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userObject: User;
  user: BehaviorSubject<User>;

  constructor(private _http: HttpService) {
    this.user = new BehaviorSubject({
      id: null,
      authenticated: false,
      admin: false
    })
  }

  authenticateUser(data): void {
    this._http.authenticateUser(data.last, data.pin).forEach(user => {
      this.user.next(user);
      // this.user.complete();
    })
  }
}
