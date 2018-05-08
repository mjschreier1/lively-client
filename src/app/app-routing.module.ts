import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  }, {
    path: 'calendar', component: CalendarComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
