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
  jwtToken: string  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjdmMDJhZGVlYjUxODViMDBiN2NjYzYiLCJpYXQiOjE3MjU4NTUxNTUsImV4cCI6MTcyNTkxNTE1NX0.Xt39rcYUxEkUqNlhQZ5UCmw6YAmmLN0iSze25g3AUPM';

  constructor() {}

  ngOnInit() {
    this.stripe = Stripe('pk_test_51IaO4AERAnFdCDEdU9H1UI0mg6g15Z7D0AEFlDajTgu6EVSgyxss03Z8PeBvqsG4dL5UmEFkokLywK8CZqDYF7EP00QzgKxQUb');
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

  async createToken(event: any) {
    event.preventDefault();
  
    const { token, error } = await this.stripe.createToken(this.card);
  
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = '';
      this.processPayment(token.id);
    }
  }

  // ASAMBLEA 

  // async processPayment(token: string) {
  //   try {
  //     const response = await axios.post('http://localhost:3000/stripe/charge', {
  //       token: token,
  //       amount: 59900, // en centavos
  //       currency: 'mxn',
  //       description: 'Suscripción básica Asambleas'
  //     });

  //     this.successMessage = 'Payment successful!';
  //     console.log('Payment successful', response.data);
  //   } catch (error:any) {
  //     this.errorMessage = 'Payment failed';
  //     console.error('Payment error', error.response.data);
  //   }
  // }


  // SKILLZ

  async processPayment(token: string) {
    try {
      // Obtener addressId si es necesario
      const addressId = '66c900d53dc108ff3b951329';
  
      const body = {
        token: token,
        paymentMethod: "stripe",
        currency: 'MXN',
        ...(addressId && { addressId }) // Solo incluir addressId si está presente
      };
  
      const response = await axios.post('http://localhost:3000/orders', body, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`, // Asegúrate de tener el token JWT del usuario
          'Content-Type': 'application/json'
        }
      });
  
      this.successMessage = 'Payment successful!';
    } catch (error: any) {
      this.errorMessage = 'Payment failed';
    }
  }
}
