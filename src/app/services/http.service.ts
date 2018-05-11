import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  addEvent(data): Observable<string> {
    let params = new HttpParams()
    Object.keys(data).forEach(key => {
      if(key !== "name" && key !== "location" && key !== "description") {
        params = params.append(key.toString(), data[key].toString())
      }
    })
    return this._http.post<string>(this.eventsUrl,
      {
        name: data.name,
        location: data.location,
        description: data.description || ""
      },
      { params }
    )
  }

  authenticateUser(last, pin): Observable<User> {
    return this._http.get<User>(`${this.userUrl}?last=${last}&pin=${pin}`)
  }
}
