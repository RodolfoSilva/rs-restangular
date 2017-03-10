import { RestangularHttp } from './http';
import { Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RestangularConfig } from './config';
import { RestangularOnePath } from './one-path';
import { RestangularAllPath } from './all-path';
import { PathInterface } from './path.interface';

import 'rxjs/add/operator/map';

export class RestangularPath {
  config: RestangularConfig;
  parent: RestangularPath;
  route: PathInterface;

  constructor(config: RestangularConfig, parent?: RestangularPath) {
    this.config = config;
    this.parent = parent;
  }

  private __normalizeRoute(route: string): string {
    return route.replace(/^\/+|\/+$/g, '');
  }

  all(route: string): RestangularPath {
    this.route = new RestangularAllPath(this.__normalizeRoute(route));

    return new RestangularPath(this.config, this);
  }

  one(route: string, id: string | number): RestangularPath {
    this.route = new RestangularOnePath(this.__normalizeRoute(route), id);

    return new RestangularPath(this.config, this);
  }

  get(options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.get(this, options);
  }

  getList(options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.getList(this, options);
  }

  post(body: any, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.post(this, body, options);
  }

  put(body: any, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.put(this, body, options);
  }

  remove(options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.delete(this, options);
  }

  toArray(): Array<string> {
    let path: Array<string> = [];
    let current: RestangularPath = this;

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
