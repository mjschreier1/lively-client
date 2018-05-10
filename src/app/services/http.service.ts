import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event } from '../interfaces/event';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  eventsUrl: string = "https://lively-app-server.herokuapp.com/events";
  userUrl: string = "https://lively-app-server.herokuapp.com/users"

  constructor(private _http: HttpClient) { }

  getEvents(): Observable<Array<Event>> {
    return this._http.get<Array<Event>>(this.eventsUrl)
  }

  authenticateUser(last, pin): Observable<User> {
    return this._http.get<User>(`${this.userUrl}?last=${last}&pin=${pin}`)
  }
}
