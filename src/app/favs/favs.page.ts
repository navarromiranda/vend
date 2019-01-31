import { Component, ViewChild } from '@angular/core';
import { ProdsService } from '../services/prods.service';
import { TicketsService } from '../services/tickets.service';
import { Prod } from '../services/prod';

@Component({
  selector: 'app-favs',
  templateUrl: 'favs.page.html',
  styleUrls: ['favs.page.scss']
})
export class FavsPage {
  prods = {};
  tags: Set<string>;
  tag = undefined;
  brand = undefined;

  txTags = {};

  constructor(public Prods: ProdsService, public Tickets: TicketsService) {
    const fakeEvent = { target: { complete: () => { } } };
    this.doRefresh(fakeEvent);
  }

  tagChanged(ev: any) {
    const value = ev.detail.value;
    this.tag = value;

    if (this.prods[this.tag].length > 24) {
      this.brand = [...this.txTags[this.tag]][0];
    } else {
      this.brand = undefined;
    }
  }

  brandChanged(ev: any) {
    const value = ev.detail.value;
    this.brand = value;
  }

  prodsByBrand(prods: Prod[], brand: string): Prod[] {
    if (!brand) { return prods; }
    return prods.filter(prod => prod.marca === brand);
  }

  doRefresh(event) {
    // Obtengo todos los Prods
    this.Prods.load()
      .subscribe(_prods => {
        // Me quedo sólo con los prod que sean fav.
        const prods = _prods.filter(prod => prod.fav);
        // Obtengo la lista ordenada de líneas
        const sortedTags = prods.map(p => p.linea).sort();
        this.tags = new Set(sortedTags);
        // "Selecciono" la primera linea, para la vista inicial
        this.tag = this.tag || sortedTags[0];

        // Creo un mapa de productos, agrupados por línea.
        this.tags.forEach(tag => {
          // Filtro los prods, para obtener sólo los de la linea `tag`.
          this.prods[tag] = prods.filter(p => p.linea === tag);
          // Obtengo las marcas de los productos de la linea `tag`
          const marcas: string[] = this.prods[tag].map((p: Prod) => p.marca).sort();
          // Guardo esta relación, para usarla en la navegación
          this.txTags[tag] = new Set(marcas);
          event.target.complete();
        });
        this.tagChanged({ detail: { value: this.tag } });
      });
  }

  prodClicked(prod) {
    this.Tickets.addProdToTicket(prod);
  }
}
