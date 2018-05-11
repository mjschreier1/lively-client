import { Component, OnInit } from '@angular/core';
import { Event } from '../interfaces/event';
import { HttpService } from '../services/http.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  user: User;
  events: Array<Event>;
  moment: Date = new Date();
  momentPlusTwoHours: Date = new Date(this.moment.valueOf() + 7200000);

  startYear: number = this.moment.getFullYear();
  startMonth: number = this.moment.getMonth() + 1;
  startDate: number = this.moment.getDate();
  startHour: number = this.moment.getHours();
  startMinute: number = this.moment.getMinutes();
  endYear: number = this.momentPlusTwoHours.getFullYear();
  endMonth: number = this.momentPlusTwoHours.getMonth() + 1;
  endDate: number = this.momentPlusTwoHours.getDate();
  endHour: number = this.momentPlusTwoHours.getHours();
  endMinute: number = this.momentPlusTwoHours.getMinutes();

  monthValidator: Object = {};
  monthOptions: Array<String> = [];
  startDateValidator: Object = {};
  endDateValidator: Object = {};


  constructor(
    private _httpService: HttpService,
    private _authentication: AuthenticationService
  ) { }

  ngOnInit() {
    this._authentication.user.subscribe(user => {
      console.log("calendar component got")
      console.log(user)
      this.user = user;
      if(user.admin) {
        this.setMonthValidator();
        this.setDateValidator(this.startMonth, this.startYear, true);
        this.setDateValidator(this.endMonth, this.endYear, false);
      }
    })
    // this.user = this._authentication.userObject;

    this._httpService.getEvents().subscribe(events => {
      events = events.map(event => {
        event.start = new Date(event.start);
        event.finish = new Date(event.finish);
        return event;
      })
      this.events = events;
    })

    setTimeout(() => console.log(this.user), 8000)
  }

  setMonthValidator() {
    for (let i = 1; i < 13; i++) {
      let key = i < 10 ? `0${i}` : `${i}`;
      this.monthValidator[key] = i;
      this.monthOptions.push(key);
    }
  }

  setDateValidator(month, year, start) {
    let daysInMonth = 31;
    if(month === 4 || month === 6 || month === 9 || month === 11) {
      daysInMonth = 30;
    } else if(month === 2) {
      daysInMonth = 28;
      if(year % 4 === 0) { daysInMonth++ }
    }
    for(let i = 1; i < daysInMonth + 1; i++) {
      console.log(i);
      let key = i < 10 ? `0${i}` : `${i}`;
      if(start) { this.startDateValidator[key] = i }
      else { this.endDateValidator[key] = i }
    }
  }

}
