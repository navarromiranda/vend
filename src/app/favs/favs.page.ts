import { Component, ViewChild } from '@angular/core';
import { ProdsService } from '../services/prods.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-favs',
  templateUrl: 'favs.page.html',
  styleUrls: ['favs.page.scss']
})
export class FavsPage {
  @ViewChild('favsSlider') slider: IonSlides;
  prods = {};
  tags: Set<string> = new Set();

  constructor(public Prods: ProdsService) {
    // Obtengo todos los Prods
    this.Prods.load()
      .subscribe(_prods => {
        // Me quedo sólo con los que tienen marca de favorito
        const prods = _prods.filter(p => p.fav);

        // Obtengo la lista ordenada de líneas
        const sortedTags = prods.map(p => p.linea).sort();
        this.tags = new Set(sortedTags);

        // Creo un mapa de productos, agrupados por línea.
        this.tags.forEach(tag => {
          // Filtro los prods, para obtener sólo los de la linea `tag`.
          this.prods[tag] = prods.filter(p => p.linea === tag);
        });
      });
  }
}
