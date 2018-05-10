import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event } from '../interfaces/event';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  eventsUrl: string = "http://lively-app-server.herokuapp.com/events";

  constructor(private _http: HttpClient) { }

  getEvents(): Observable<Array<Event>> {
    return this._http.get<Array<Event>>(this.eventsUrl)
  }
}
