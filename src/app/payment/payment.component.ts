import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { NgForm } from "@angular/forms";
import { HttpService } from '../services/http.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';
import { Payment } from '../interfaces/payment';
import { DateQuery } from '../interfaces/date-query';
import { UserQuery } from '../interfaces/user-query';

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"]
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("cardInfo") cardInfo: ElementRef;
  amount: number = 0;
  user: User;
  payment: Payment;
  processing: boolean = false;
  badRequest: boolean = false;
  navigation: string;
  dateQuery: DateQuery;
  months: Array<number> = [];
  minDates: Array<number> = [];
  maxDates: Array<number> = [];
  paymentsByDates: Array<Payment> = [];
  paymentsByResident: Array<Payment> = [];
  paymentsByDatesRange: DateQuery;
  revenueTotalByDates: number;
  revenueTotalByResident: number;
  destroyed: boolean;
  userParams: UserQuery;
  userQuery: UserQuery;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  constructor(
    private cd: ChangeDetectorRef,
    private _httpService: HttpService,
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this._authenticationService.user.subscribe(user => {
      this.user = user;
      if (this.user.admin) {
        this.navigation = "viewByDates";
        let moment = new Date();
        let thirtyDaysAgo = new Date(moment.valueOf() - 2592000000);
        console.log(thirtyDaysAgo)
        this.dateQuery = {
          minYear: thirtyDaysAgo.getFullYear(),
          minMonth: thirtyDaysAgo.getMonth() + 1,
          minDate: thirtyDaysAgo.getDate(),
          maxYear: moment.getFullYear(),
          maxMonth: moment.getMonth() + 1,
          maxDate: moment.getDate()
        };
        this.setMonths();
        this.setDates(this.dateQuery.minMonth, this.dateQuery.minYear, true);
        this.setDates(this.dateQuery.maxMonth, this.dateQuery.maxYear, false);
        this.userParams = {
          last: "",
          email: ""
        }
      }
    });
    this.payment = {
      id: null,
      user: this.user,
      amount: null,
      submittedOn: null,
      successful: false
    };
  }

  ngAfterViewInit() {
    if (!this.user.admin) {
      this.mountCard();
    }
  }

  ngOnDestroy() {
    if (!this.user.admin || (this.navigation === "makePayment" && !this.processing && !this.payment.successful)) {
      this.destroyCard();
    }
  }

  mountCard() {
    if(!this.payment.successful) {
      const style = {
        base: {
          color: "#3C6E71",
          fontFamily: "Montserrat, sans-serif"
        }
      };
      this.card = elements.create("card", { style });
      setTimeout(() => this.card.mount(this.cardInfo.nativeElement), 10);

      this.card.addEventListener("change", this.cardHandler);

      this.destroyed = false;
    }
  }

  destroyCard() {
    if(!this.destroyed) {
      this.card.removeEventListener("change", this.cardHandler);
      this.card.destroy();
      this.destroyed = true;
    }
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async processPayment(form: NgForm) {
    this.processing = true;
    const { token, error } = await stripe.createToken(this.card);
    console.log(token);

    if (error) {
      console.log("Something is wrong:", error);
      this.badRequest = true;
      this.processing = false;
      setTimeout(() => (this.badRequest = false), 5000);
    } else {
      this._httpService.processPayment({ id: this.user.id.toString(), amount: Math.round(form.value.amount * 100).toString(), stripeToken: token.id }).subscribe((payment: Payment) => {
          console.log(payment);
          this.badRequest = false;
          payment.submittedOn = new Date(payment.submittedOn);
          payment.amount /= 100;
          this.payment = payment;
          this.processing = false;
        });
    }
  }

  resetForm() {
    this.destroyCard();
    this.payment = {
      id: null,
      user: this.user,
      amount: null,
      submittedOn: null,
      successful: false
    };
    this.amount = 0;
    setTimeout(() => this.mountCard(), 10);
  }

  toggleNavigation(view) {
    if (this.navigation === "makePayment") {
      this.destroyCard();
    }
    this.navigation = view;
    if (this.navigation === "makePayment") {
      this.mountCard();
    }
  }

  getPaymentsByDates() {
    this._httpService.getPaymentsByDates(this.dateQuery);
  }

  setMonths() {
    for (let i = 1; i < 13; i++) {
      this.months.push(i);
    }
  }

  setDates(month, year, min) {
    let daysInMonth = 31;
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      daysInMonth = 30;
    } else if (month === 2) {
      daysInMonth = 28;
      if (year % 4 === 0) {
        daysInMonth++;
      }
    }
    min ? this.minDates = [] : this.maxDates = [];
    for (let i = 1; i < daysInMonth + 1; i++) {
      min ? this.minDates.push(i) : this.maxDates.push(i);
    }
  }

  getByDates() {
    this.paymentsByDatesRange = this.dateQuery;
    this._httpService.getPaymentsByDates(this.dateQuery).subscribe(payments => {
      console.log(payments);
      this.revenueTotalByDates = payments.reduce((acc, payment) => {
        acc += (payment.amount / 100);
        return acc;
      }, 0)
      payments.forEach(payment => payment.submittedOn = new Date(payment.submittedOn))
      this.paymentsByDates = payments;
    })
  }

  getByResident() {
    this.userQuery = this.userParams;
    this.userQuery.last = `${this.userQuery.last.slice(0, 1).toUpperCase()}${this.userQuery.last.slice(1)}`
    console.log(this.userQuery)
    this._httpService.getPaymentsByResident(this.userQuery).subscribe(payments => {
      console.log(payments)
      this.revenueTotalByResident = payments.reduce((acc, payment) => {
        acc += (payment.amount / 100);
        return acc;
      }, 0)
      payments.forEach(payment => payment.submittedOn = new Date(payment.submittedOn))
      this.paymentsByResident = payments;
    })
  }
}

