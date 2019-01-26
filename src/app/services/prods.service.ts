import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment as env } from '../../environments/environment';

import { Prod, Clave, prods } from './prod';

@Injectable({
  providedIn: 'root'
})
export class ProdsService {
  prods: Prod[];

  constructor(public http: HttpClient) {
    this.prods = prods;
  }

  load(): Observable<Prod[]> {
    // tslint:disable-next-line:curly
    if (this.prods) return of(this.prods);
    return this.http
      .get<{ found: Number, prods: Prod[] }>(`${env.api.url}/prods`, {
        headers: { Authorization: `Bearer ${env.api.tokens.prods}` }
      })
      .pipe(map(this.process, this));
  }

  process(data: { found: Number, prods: Prod[] }): Prod[] {
    return data.prods.map(prod => ({
      ...prod,
      // TODO: buena aproximación, pero sería mejor un ranking devuelto por el API
      fav: prod.linea !== 'SYS'
    }));
  }

}
