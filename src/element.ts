import { Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RestangularPath } from './path';

export class RestangularElement<T> {
  [key: string]: any
  __path__: RestangularPath;
  __original__: any;

  constructor(
    object: any,
    path?: RestangularPath
  ) {
    this.__original__ = object;
    this.__path__ = path;

    Object.assign(this, {}, object);
  }

  clone(): RestangularElement<T> {
    return Object.assign(Object.create(this), this);
  }

  put(body?: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.__path__.put(Object.assign({}, this.plain(), body), options);
  }

  remove(options?: RequestOptionsArgs): Observable<Response> {
    return this.__path__.remove(options);
  }

  plain(entity?: { new(): T ;}): T {
    let obj: any = {};

    for(let key in this) {
      if (this.hasOwnProperty(key) && !emptyElement.hasOwnProperty(key)) {
        obj[key] = this[key];
      }
    }

    if (entity) {
      return Object.assign(new entity(), obj);
    }

    return Object.assign(Object.create(this.__original__), obj);
  }
}

const emptyElement: RestangularElement<any> = new RestangularElement<any>(null, null);
