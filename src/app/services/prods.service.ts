import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdsService {
  prods: any[];

  constructor(public http: HttpClient) { }

  load(): Observable<any[]> {
    // tslint:disable-next-line:curly
    if (this.prods) return of(this.prods);
    return this.http
      .get<{ found: Number, prods: any[] }>(`${env.api.url}/prods`, {
        headers: { Authorization: `Bearer ${env.api.tokens.prods}` }
      })
      .pipe(map(this.process, this));
  }

  process(data: { found: Number, prods: any[] }): any[] {
    return data.prods.map(prod => ({
      ...prod,
      // TODO: buena aproximación, pero sería mejor un ranking devuelto por el API
      fav: prod.linea !== 'SYS'
    }));
  }

}
