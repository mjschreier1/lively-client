import { Component, OnInit } from '@angular/core';
import { Button } from '../interfaces/button';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  buttonsRowOne: Array<Button>;
  buttonsRowTwo: Array<Button>;

  constructor() {}

  ngOnInit() {
    this.buttonsRowOne = [
      {
        name: "Community Calendar",
        id: "communityCalendar",
        iconClass: "far fa-calendar-alt",
        routerLink: "/calendar"
      }, {
        name: "Payments",
        id: "payment",
        iconClass: "far fa-credit-card",
        routerLink: "/payment"
      }
    ];

    this.buttonsRowTwo = [
      {
        name: "Service Requests",
        id: "serviceRequests",
        iconClass: "fas fa-wrench",
        routerLink: "/service"
      }, {
        name: "Reserve Amenity",
        id: "reserve",
        iconClass: "fab fa-buromobelexperte",
        routerLink: "reserve"
      }
    ];
  }
}
