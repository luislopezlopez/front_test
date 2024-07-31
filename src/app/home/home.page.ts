import { Component, OnInit } from '@angular/core';
import axios from 'axios';

declare var Stripe: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  stripe: any;
  card: any;
  errorMessage!: string;
  successMessage!: string;

  constructor() {}

  ngOnInit() {
    this.stripe = Stripe('pk_test_51OkaCSK2Vtvuir2UffweY8cjDfcwDaUzKz3PJBReZXHbXAZbFAjLI1lZSiEp19uEJ9dvYmxU62YBeFBst4rlaAKl00Yx8eCLGY');
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.addEventListener('change', (event :any) => {
      if (event.error) {
        this.errorMessage = event.error.message;
      } else {
        this.errorMessage = '';
      }
    });
  }

  async createToken(event:any) {
    event.preventDefault();

    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = '';
      this.processPayment(token.id);
    }
  }

  async processPayment(token: string) {
    try {
      const response = await axios.post('http://localhost:3000/stripe/charge', {
        token: token,
        amount: 59900, // en centavos
        currency: 'mxn',
        description: 'Suscripción básica Asambleas'
      });

      this.successMessage = 'Payment successful!';
      console.log('Payment successful', response.data);
    } catch (error:any) {
      this.errorMessage = 'Payment failed';
      console.error('Payment error', error.response.data);
    }
  }
}
