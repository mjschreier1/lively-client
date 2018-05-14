import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';
import { ServiceRequest } from '../interfaces/service-request';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  user: User;
  requests: Array<ServiceRequest>;

  constructor(
    private _httpService: HttpService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authenticationService.user.subscribe(user => {
      this.user = user
    })
    this._httpService.getRequests(this.user.id).subscribe(requests => {
      this.requests = requests
    })
  }

}
