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
  newRequest: ServiceRequest;
  residentRequest: ServiceRequest;
  statusMessage: string;
  navigation: string;
  openRequests: Array<ServiceRequest>;

  constructor(
    private _httpService: HttpService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authenticationService.user.subscribe(user => {
      this.user = user;
      this.newRequest = {
        userId: user.id.toString(),
        unit: "",
        contact: "",
        subject: "",
        description: ""
      }
    })
    if(this.user.admin) {
      this.navigation = "openRequests";
      this._httpService.getOpenRequests().subscribe(requests => {
        requests.forEach(request => {
          if(!request.admin_notes) { request.admin_notes = "" }
        })
        this.openRequests = requests;
      })
      this.residentRequest = {
        last: "",
        email: "",
        unit: "",
        contact: "",
        subject: "",
        description: ""
      }
    }
    this._httpService.getRequests(this.user.id).subscribe(requests => {
      this.requests = requests;
    })
  }

  addServiceRequest() {
    this._httpService.addServiceRequest(this.newRequest).subscribe(response => {
      response.admin_notes = "";
      this.requests.push(response);
      this.newRequest = {
        userId: this.user.id.toString(),
        unit: "",
        contact: "",
        subject: "",
        description: ""
      };
      if(this.user.admin) { this.openRequests.push(response) }
      this.statusMessage = "Service request submitted successfully";
      setTimeout(() => this.statusMessage = "", 4000);
    })
  }

  addServiceRequestForResident() {
    this._httpService.addServiceRequestForResident(this.residentRequest).subscribe(response => {
      response.admin_notes = "";
      this.openRequests.push(response);
      this.residentRequest = {
        last: "",
        email: "",
        unit: "",
        contact: "",
        subject: "",
        description: ""
      }
      this.statusMessage = "Service request submitted successfully";
      setTimeout(() => this.statusMessage = "", 4000);
    })
  }

  toggleNavigation(view) {
    this.navigation = view
  }

  toggleCardExpansion(i) {
    this.openRequests[i].expanded = !this.openRequests[i].expanded
  }

  updateRequest(i) {
    this._httpService.updateServiceRequest(this.openRequests[i].id, this.openRequests[i].open, this.openRequests[i].admin_notes).subscribe(response => {
      if(!response.open) { this.openRequests.splice(i, 1) }
      if(response.user.id === this.user.id) {
        this.requests.forEach(request => {
          if(request.id === response.id) {
            request.open = response.open;
            request.admin_notes = response.admin_notes;
          }
        })
      }
    })
  }

}
