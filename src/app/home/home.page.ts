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
  jwtToken: string  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmUxMTZlOGM0ZmQ0OTZkZWFjOTA4NGYiLCJpYXQiOjE3MjYxMjIyNjksImV4cCI6MTcyNjE4MjI2OX0.TcMaC65GqlQkLKy4LOEGax3vSNWH_34hoqcfO5CH_nI';
  availablePlans: any[] = [];
  paymentIntentId!: string;

  constructor() {}
 
  ngOnInit() {
    // this.stripe = Stripe('pk_live_51IaO4AERAnFdCDEdShgU1UT2xaQbXQqnmfd2WfsMSuKnk8ahVuMlgbO991Oz1GIr54R3IRMgGCG3QTcCB9N0rz7800gmQzTx3s');
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


  async createPaymentIntent(event: any) {
    event.preventDefault();
  
    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
    });
  
    if (error) {
      this.errorMessage = error.message;
      return;
    }
  
    try {
      // Enviar el PaymentMethod y la moneda seleccionada al backend
      const response = await axios.post('http://localhost:3000/stripe/collect_details', {
        payment_method_id: paymentMethod.id,
        currency: 'MXN',  // Moneda seleccionada (USD o MXN)
      }, {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`,  // Token JWT para autenticar al usuario
        }
      });
  
      console.log(response.data);
      this.availablePlans = response.data.available_plans;
      this.paymentIntentId = response.data.intent_id;
  
      // Si no hay planes, confirmamos el pago automáticamente
      if (!this.availablePlans.length) {
        this.confirmPayment();
      }
    } catch (error: any) {
      this.errorMessage = error.response?.data?.error || 'Error al procesar el pago';
    }
  }
  
  
  

  // Confirmar el PaymentIntent con el plan de cuotas seleccionado
  async confirmPayment_back() {
    const selectedPlanIdx : any = (document.querySelector(
      'input[name="installment_plan"]:checked'
    ) as HTMLInputElement).value;
    const selectedPlan =
      selectedPlanIdx === '-1' ? null : this.availablePlans[selectedPlanIdx];

    try {
      const response = await axios.post('http://localhost:3000/stripe/confirm_payment', {
        payment_intent_id: this.paymentIntentId,
        selected_plan: selectedPlan,
      });

      if (response.data.status === 'succeeded') {
        this.successMessage =
          selectedPlan !== null
            ? `Pago realizado con ${selectedPlan.count} MSI`
            : 'Pago realizado inmediatamente';
      } else {
        this.errorMessage = 'Error en el pago';
      }
    } catch (error:any) {
      this.errorMessage = error.response?.data?.error || 'Error al confirmar el pago';
    }
  }

  async confirmPayment() {
    try {
      // Obtener el plan de cuotas seleccionado, si aplica
      const selectedPlanIdx: any = (document.querySelector(
        'input[name="installment_plan"]:checked'
      ) as HTMLInputElement).value;
      const selectedPlan =
        selectedPlanIdx === '-1' ? null : this.availablePlans[selectedPlanIdx];
  
      // Preparar el body con el intent y el plan seleccionado
      const body = {
        paymentIntentId: this.paymentIntentId,
        selectedPlan: selectedPlan,  // Plan de cuotas o null si es pago directo
        paymentMethod: "stripe",
        currency: "MXN",
        addressId: "66e29beed5d913dcd265f048",  // Address ID, si es necesario
      };
  
      // Realizar la solicitud al backend para crear la orden
      const response = await axios.post('http://localhost:3000/orders', body, {
        headers: {
          Authorization: `Bearer ${this.jwtToken}`, // JWT Token para autenticar al usuario
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      this.successMessage = 'Pago realizado con éxito!';
    } catch (error: any) {
      this.errorMessage = error.response?.data?.error || 'Error al procesar el pago';
    }
  }

  
}
