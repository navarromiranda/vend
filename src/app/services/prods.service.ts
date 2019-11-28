import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment as env } from '../../environments/environment';

import { Prod } from '../models/prod';

@Injectable({
  providedIn: 'root'
})
export class ProdsService {
  prods: Prod[];

  constructor(public http: HttpClient) {
    const localStorageProds = localStorage.getItem('prods') || '[]';
    const localProds: Prod[] = JSON.parse(localStorageProds);

    this.prods = localProds.sort((a, b) => a.descrip.length - b.descrip.length);
    localStorage.setItem('prods', JSON.stringify(this.prods));
  }

  load(): Observable<Prod[]> {

    const httpProds = this.http
      .get<{ found: Number, prods: Prod[] }>(`${env.api.url}/prods`, {
        headers: { Authorization: `Bearer ${env.api.tokens.prods}` }
      })
      .pipe(map(this.process, this))
      .subscribe(_prods => {
        localStorage.setItem('prods', JSON.stringify(_prods));
        this.prods = _prods.sort((a, b) => a.descrip.length - b.descrip.length);
      });

    return of(this.prods);
  }

  process(data: { found: Number, prods: Prod[] }): Prod[] {
    return data.prods.map(prod => ({
      ...prod,
      // TODO: buena aproximación, pero sería mejor un ranking devuelto por el API
      fav: prod.movs >= 22
    }));
  }

}
