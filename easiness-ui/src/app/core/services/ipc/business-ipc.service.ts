import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessIpcService {
  async buy(purchaseOrder) {
    try {
      const res = await (window as any).electronAPI.buy(purchaseOrder);
      return res;
    } catch (error) {
      console.error('Error buying:', error);
      throw error;
    }
  }

  async sell(invoice) {
    try {
      const res = await (window as any).electronAPI.sell(invoice);
      return res;
    } catch (error) {
      console.error('Error selling:', error);
      throw error;
    }
  }

  async processPayment(paymentTx) {
    try {
      const res = await (window as any).electronAPI.processPayment(paymentTx);
      return res;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
}
