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

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardInfo') cardInfo: ElementRef;
  amount: number = 0;
  user: User;
  payment: Payment;
  processing: boolean = false;
  badRequest: boolean = false;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  constructor(
    private cd: ChangeDetectorRef,
    private _httpService: HttpService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authenticationService.user.subscribe(user => {
      this.user = user;
    })
    this.payment = {
      id: null,
      user: this.user,
      amount: null,
      submittedOn: null,
      successful: false
    }
  }

  ngAfterViewInit() {
    const style = {
      base: {
        color: "#3C6E71",
        fontFamily: "Montserrat, sans-serif"
      }
    }
    this.card = elements.create("card", { style });
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener("change", this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener("change", this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    console.log(this.card)
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
    console.log(token)

    if (error) {
      console.log("Something is wrong:", error);
      this.badRequest = true;
      this.processing = false;
      setTimeout(() => this.badRequest = false, 5000)
    } else {
      this._httpService.processPayment({ id: this.user.id, amount: form.value.amount, stripeToken: token.id }).subscribe((payment: Payment) => {
        console.log(payment);
        this.badRequest = false;
        payment.submittedOn = new Date(payment.submittedOn);
        payment.amount /= 100;
        this.payment = payment;
        this.processing = false;
      })
    }
  }

  resetForm() {
    this.ngOnDestroy();
    this.payment = {
      id: null,
      user: this.user,
      amount: null,
      submittedOn: null,
      successful: false
    };
    this.amount = 0;
    setTimeout(() => this.ngAfterViewInit(), 10);
  }
}

