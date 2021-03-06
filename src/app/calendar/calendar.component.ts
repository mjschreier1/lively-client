import { Component, OnInit } from '@angular/core';
import { Event } from '../interfaces/event';
import { HttpService } from '../services/http.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {
  user: User;
  events: Array<Event>;
  moment: Date = new Date();
  momentPlusTwoHours: Date = new Date(this.moment.valueOf() + 7200000);

  startYear: number = this.moment.getFullYear();
  startMonth: any = this.moment.getMonth() + 1;
  startDate: any = this.moment.getDate();
  startHour: number = this.moment.getHours() > 12
    ? this.moment.getHours() - 12
    : this.moment.getHours();
  startMinute: any = this.moment.getMinutes();
  endYear: number = this.momentPlusTwoHours.getFullYear();
  endMonth: any = this.momentPlusTwoHours.getMonth() + 1;
  endDate: any = this.momentPlusTwoHours.getDate();
  endHour: number = this.momentPlusTwoHours.getHours()
    ? this.momentPlusTwoHours.getHours() - 12
    : this.momentPlusTwoHours.getHours();
  endMinute: any = this.momentPlusTwoHours.getMinutes();
  startPm: boolean = this.moment.getHours() > 11;
  endPm: boolean = this.momentPlusTwoHours.getHours() > 11;

  monthValidator: Object = {};
  monthOptions: Array<String> = [];
  startDateValidator: Object = {};
  startDateOptions: Array<String> = [];
  endDateValidator: Object = {};
  endDateOptions: Array<String> = [];
  hourOptions: Array<number> = [];
  minuteOptions: Array<string> = [];

  name: string;
  location: string;
  description: string;

  responseStatus: string;

  constructor(
    private _httpService: HttpService,
    private _authentication: AuthenticationService
  ) {}

  ngOnInit() {
    this._authentication.user.subscribe(user => {
      this.user = user;
      if (user.admin) {
        while (this.startMinute % 5 !== 0) {
          if (this.startMinute > 55) {
            this.startMinute = 55;
            this.endMinute = 55;
          } else {
            if(this.startMinute < 9) {
              typeof(this.startMinute) === "string"
                ? this.startMinute = `0${parseInt(this.startMinute) + 1}`
                : this.startMinute = `0${this.startMinute + 1}`
            } else {
              if(typeof(this.startMinute) === "string") { this.startMinute = parseInt(this.startMinute) }
              this.startMinute++;
            }
            this.endMinute = this.startMinute;
          }
        }
        this.setMonthValidator();
        this.setDateValidator(this.startMonth, this.startYear, true);
        this.setDateValidator(this.endMonth, this.endYear, false);
        if (this.startMonth < 10) {
          this.startMonth = `0${this.startMonth}`;
        }
        if (this.startDate < 10) {
          this.startDate = `0${this.startDate}`;
        }
        if (this.endMonth < 10) {
          this.endMonth = `0${this.endMonth}`;
        }
        if (this.endDate < 10) {
          this.endDate = `0${this.endDate}`;
        }
        for (let i = 1; i < 13; i++) {
          this.hourOptions.push(i);
        }
        for (let i = 0; i < 60; i += 5) {
          i < 10
            ? this.minuteOptions.push(`0${i}`)
            : this.minuteOptions.push(`${i}`);
        }
      }
    });

    this._httpService.getEvents().subscribe(events => {
      events = events.map(event => {
        event.start = new Date(event.start);
        event.finish = new Date(event.finish);
        return event;
      });
      this.events = events;
    });
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
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      daysInMonth = 30;
    } else if (month === 2) {
      daysInMonth = 28;
      if (year % 4 === 0) {
        daysInMonth++;
      }
    }
    for (let i = 1; i < daysInMonth + 1; i++) {
      let key = i < 10 ? `0${i}` : `${i}`;
      if (start) {
        this.startDateValidator[key] = i;
        this.startDateOptions.push(key);
      } else {
        this.endDateValidator[key] = i;
        this.endDateOptions.push(key);
      }
    }
  }

  addEvent() {
    let startHour = this.startHour;
    let endHour = this.endHour;
    if(typeof(startHour) === "string") { startHour = parseInt(startHour) }
    if(typeof(endHour) === "string") { endHour = parseInt(endHour) }
    this._httpService.addEvent({
      name: this.name,
      location: this.location,
      description: this.description,
      startYear: this.startYear,
      startMonth: this.startMonth,
      startDate: this.startDate,
      startHour: this.startPm && startHour !== 12 ? startHour + 12 : startHour,
      startMinute: this.startMinute,
      finishYear: this.endYear,
      finishMonth: this.endMonth,
      finishDate: this.endDate,
      finishHour: this.endPm && endHour !== 12 ? endHour + 12 : endHour,
      finishMinute: this.endMinute
    }).subscribe((res: Event) => {
      if(res.name && res.location && res.start && res.finish) {
        this.responseStatus = "Event added successfully!";
        setTimeout(() => this.responseStatus = "", 4000);
      } else {
        this.responseStatus = "There was a problem processing your event";
        setTimeout(() => this.responseStatus = "", 4000);
      }
    })
  }

  deleteEvent(id) {
    if(confirm("Are you sure you want to delete this event?")) {
      this._httpService.deleteEvent(id).subscribe(res => {
        this.events = this.events.filter(event => event.id !== res.id)
      })
    }
  }
}
