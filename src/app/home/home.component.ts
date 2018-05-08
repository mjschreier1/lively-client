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
      }
    ];

    this.buttonsRowTwo = [];
  }
}
