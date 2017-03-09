import { Backend } from './backend';
import { Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './config';
import { OnePath } from './one-path';
import { AllPath } from './all-path';
import { PathInterface } from './path.interface';

import 'rxjs/add/operator/map';

export class Path {
  config: Config;
  parent: Path;
  route: PathInterface;

  constructor(config: Config, parent?: Path) {
    this.config = config;
    this.parent = parent;
  }

  private __normalizeRoute(route: string): string {
    return route.replace(/^\/+|\/+$/g, '');
  }

  all(route: string): Path {
    this.route = new AllPath(this.__normalizeRoute(route));

    return new Path(this.config, this);
  }

  one(route: string, id: string | number): Path {
    this.route = new OnePath(this.__normalizeRoute(route), id);

    return new Path(this.config, this);
  }

  get(options?: RequestOptionsArgs): Observable<Response> {
    return Backend.get(this, options);
  }

  getList(options?: RequestOptionsArgs): Observable<Response> {
    return Backend.getList(this, options);
  }

  post(body: any, options?: RequestOptionsArgs): Observable<Response> {
    return Backend.post(this, body, options);
  }

  put(body: any, options?: RequestOptionsArgs): Observable<Response> {
    return Backend.put(this, body, options);
  }

  remove(options?: RequestOptionsArgs): Observable<Response> {
    return Backend.delete(this, options);
  }

  toArray(): Array<string> {
    let path: Array<string> = [];
    let current: Path = this;

    while (current.parent) {
      path.push(...current.parent.route.path().reverse());

      current = current.parent;
    }

    path.push(this.config.baseUrl);

    return path.reverse();
  }

  toString(): string {
    return this.toArray().join('/');
  }
}
