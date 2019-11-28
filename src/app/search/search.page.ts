import { Component, OnInit } from '@angular/core';
import { ProdsService } from '../services/prods.service';
import { Prod } from '../models/prod';
import { TicketsService } from '../services/tickets.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage implements OnInit {
  filteredItems = [];
  searchTerm = 'bombones';

  constructor(public Prods: ProdsService, public Tickets: TicketsService) { }

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

  ngOnInit(): void {
    this.filterItems(this.searchTerm);
  }

  prodClicked(prod: Prod) {
    this.Tickets.addProdToTicket(prod);
  }

}
