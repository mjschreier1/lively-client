import { Component, OnInit } from '@angular/core';
import { Event } from '../interfaces/event';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  events: Array<Event>;

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this._httpService.getEvents().subscribe(events => {
      events = events.map(event => {
        event.start = new Date(event.start);
        event.finish = new Date(event.finish);
        return event;
      })
      this.events = events;
    })

    setTimeout(() => console.log(this.events[0].start), 8000)
  }

}
