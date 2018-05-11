import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PaymentComponent } from './payment/payment.component';
import { ServiceComponent } from './service/service.component';
import { ReserveComponent } from './reserve/reserve.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  }, {
    path: 'calendar', component: CalendarComponent
  }, {
    path: 'payment', component: PaymentComponent
  }, {
    path: 'service', component: ServiceComponent
  }, {
    path: 'reserve', component: ReserveComponent
  }, {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
