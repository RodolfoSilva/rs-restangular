import { Observable } from 'rxjs/Observable';
import { RequestOptionsArgs } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Config } from './config';
import { Path } from './path';

import 'rxjs/add/operator/map';

export class Backend {
  static get(path: Path, options?: RequestOptionsArgs): Observable<Response> {
    return path.config.http.get(path.toString(), options).map((res) => res.json());
  }

  static getList(path: Path, options?: RequestOptionsArgs): Observable<Response> {
    return Backend.get(path, options);
  }

  static post(path: Path, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return path.config.http.post(path.toString(), body, options).map((res) => res.json());
  }

  static put(path: Path, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return path.config.http.put(path.toString(), body, options).map((res) => res.json());
  }

  static delete(path: Path, options?: RequestOptionsArgs): Observable<Response> {
    return path.config.http.delete(path.toString(), options).map((res) => res.json());
  }
}
