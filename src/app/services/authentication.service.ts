import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: User;

  constructor(private _http: HttpService) { }

  authenticateUser(data): void {
    this._http.authenticateUser(data.last, data.pin).subscribe(user => {
      this.user = user
    })
  }
}
