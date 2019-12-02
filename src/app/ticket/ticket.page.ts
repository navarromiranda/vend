import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { v4 as UUID } from 'uuid';
import { Prod } from '../models/prod';
import { ProdsService } from '../services/prods.service';
import { TicketsService } from '../services/tickets.service';
import { PrintModalPage } from './print-modal/print-modal.page';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {
  filteredItems = [];
  searchTerm = '';

  constructor(
    public Modal: ModalController,
    public Tickets: TicketsService,
    public Prods: ProdsService,
  ) { }

  async paymentModal() {
    const modal = await this.Modal.create({
      component: PrintModalPage,
      componentProps: {
        uuid: UUID(),
        date: new Date,
        ticket: this.Tickets.newTicket
      }
    });
    return await modal.present();
  }

  minusOne(prod: Prod): void {
    this.Tickets.minusOneProdToTicket(prod);
  }

  plusOne(prod: Prod): void {
    this.Tickets.addProdToTicket(prod);
  }

  searchEvent(searchTerm: string): void {
    this.filterItems(searchTerm);
  }

  filterItems(search: string): void {
    const s = search.trim().toLowerCase();
    const limit = s.length > 5 ? 500 : 100;

    this.filteredItems = this.Prods.prods
      .filter((prod) => this.itemIncludes(prod, s))
      .slice(0, limit);
  }

  attrIncludes(attr: string, search: string): boolean {
    return (attr || '').trim().toLowerCase().includes(search);
  }

  itemIncludes(prod: Prod, search: string) {
    // Si el artículo mismo cumple el criterio de búsqueda, nos lo quedamos.
    const prodIncludes = !!['articulo', 'descrip', 'marca', 'linea']
      .some((attr) => this.attrIncludes(prod[attr], search));
    if (prodIncludes) { return true; }

    // Si el artículo no cumple, buscamos en sus claves
    return prod.claves
      .some((c) => ['clave', 'articulo'].some((attr) => this.attrIncludes(c[attr], search)));
  }

  prodClicked(prod: Prod) {
    this.Tickets.addProdToTicket(prod);
    this.searchTerm = '';
  }

  ngOnInit() { }

}
