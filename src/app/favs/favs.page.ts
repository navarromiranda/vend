import { Component, ViewChild } from '@angular/core';
import { ProdsService } from '../services/prods.service';
import { Prod } from '../services/prod';

@Component({
  selector: 'app-favs',
  templateUrl: 'favs.page.html',
  styleUrls: ['favs.page.scss']
})
export class FavsPage {
  prods = {};
  tags: Set<string>;
  tag = '';
  brand = '';

  txTags = {};

  constructor(public Prods: ProdsService) {
    // Obtengo todos los Prods
    this.Prods.load()
      .subscribe(prods => {
        // Obtengo la lista ordenada de líneas
        const sortedTags = prods.map(p => p.linea).sort();
        this.tags = new Set(sortedTags);
        // "Selecciono" la primera linea, para la vista inicial
        this.tag = sortedTags[0];

        // Creo un mapa de productos, agrupados por línea.
        this.tags.forEach(tag => {
          // Filtro los prods, para obtener sólo los de la linea `tag`.
          this.prods[tag] = prods.filter(p => p.linea === tag);
          // Obtengo las marcas de los productos de la linea `tag`
          const marcas: string[] = this.prods[tag].map((p: Prod) => p.marca).sort();
          // Guardo esta relación, para usarla en la navegación
          this.txTags[tag] = new Set(marcas);
        });
      });
  }

  tagChanged(ev: any) {
    const value = ev.detail.value;
    this.tag = value;
    this.brand = '';
  }

  brandChanged(ev: any) {
    const value = ev.detail.value;
    this.brand = value;
  }

  prodsByBrand(prods: Prod[], brand: string): Prod[] {
    if (!brand || '' === brand) { return prods; }
    return prods.filter(prod => prod.marca === brand);
  }
}
