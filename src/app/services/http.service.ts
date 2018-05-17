import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Event } from '../interfaces/event';
import { User } from '../interfaces/user';
import { DeleteResponse } from '../interfaces/delete-response';
import { ServiceRequest } from '../interfaces/service-request';
import { Payment } from '../interfaces/payment';

@Injectable({
  providedIn: "root"
})
export class HttpService {
  eventsUrl: string = "https://lively-app-server.herokuapp.com/events";
  userUrl: string = "https://lively-app-server.herokuapp.com/users";
  serviceUrl: string = "https://lively-app-server.herokuapp.com/service";
  paymentUrl: string = "https://lively-app-server.herokuapp.com/payment";

  constructor(private _http: HttpClient) {}

  authenticateUser(last, pin): Observable<User> {
    return this._http.get<User>(`${this.userUrl}?last=${last}&pin=${pin}`);
  }

  getEvents(): Observable<Array<Event>> {
    return this._http.get<Array<Event>>(this.eventsUrl);
  }

  addEvent(data): Observable<Event> {
    let params = new HttpParams();
    Object.keys(data).forEach(key => {
      if (key !== "name" && key !== "location" && key !== "description") {
        params = params.append(key.toString(), data[key].toString());
      }
    });
    return this._http.post<Event>(
      this.eventsUrl,
      {
        name: data.name,
        location: data.location,
        description: data.description || ""
      },
      { params }
    );
  }

  deleteEvent(id): Observable<DeleteResponse> {
    return this._http.delete<DeleteResponse>(`${this.eventsUrl}/${id}`);
  }

  getRequests(id): Observable<Array<ServiceRequest>> {
    return this._http.get<Array<ServiceRequest>>(`${this.serviceUrl}/${id}`);
  }

  addServiceRequest(request): Observable<ServiceRequest> {
    return this._http.post<ServiceRequest>(this.serviceUrl, request);
  }

  addServiceRequestForResident(request): Observable<ServiceRequest> {
    return this._http.post<ServiceRequest>(`${this.serviceUrl}/admin`, request);
  }

  getOpenRequests(): Observable<Array<ServiceRequest>> {
    return this._http.get<Array<ServiceRequest>>(`${this.serviceUrl}/open`);
  }

  updateServiceRequest(id, open, admin_notes): Observable<ServiceRequest> {
    return this._http.put<ServiceRequest>(this.serviceUrl, {
      id: id,
      open: typeof open === "boolean" ? open.toString() : open,
      admin_notes: admin_notes
    });
  }

  processPayment(body): Observable<Payment> {
    return this._http.post<Payment>(this.paymentUrl, body);
  }

  getPaymentsByDates(dates): Observable<Array<Payment>> {
    let params = new HttpParams();
    Object.keys(dates).forEach(key => {
      params = params.append(key.toString(), dates[key].toString());
    });
    return this._http.get<Array<Payment>>(this.paymentUrl, { params })
  }
}
