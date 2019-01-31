import { Injectable } from '@angular/core';
import { Prod, Clave } from './prod';

interface ITicketrow {
  prod: Prod;
  qty: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  public newTicket = new Map<string, ITicketrow>();

  constructor() { }

  addProdToTicket(prod: Prod): void {
    const key = prod.articulo;
    const qty = (this.newTicket.get(key) || { prod: undefined, qty: 0 }).qty;
    this.newTicket.set(key, { prod, qty: 1 + qty });
  }

  minusOneProdToTicket(prod: Prod): void {
    const key = prod.articulo;
    const qty = (this.newTicket.get(key) || { prod: undefined, qty: 0 }).qty;
    if (qty > 1) {
      this.newTicket.set(key, { prod, qty: -1 + qty });
    } else {
      this.deleteProdFromTicket(prod);
    }
  }

  deleteProdFromTicket(prod: Prod): void {
    const key = prod.articulo;
    this.newTicket.delete(key);
  }

  getNewTicketQty(): number {
    let qty = 0;
    this.newTicket.forEach(row => {
      qty += row.qty;
    });

    return qty;
  }

  getNewTicketTotal(): number {
    let total = 0;
    this.newTicket.forEach(row => {
      total += (row.qty * row.prod.precio);
    });

    return total;
  }

  getProdQtyOnTicket(prod: Prod): number {
    const key = prod.articulo;
    const qty = (this.newTicket.get(key) || { prod: undefined, qty: undefined }).qty;
    return qty;
  }

}
