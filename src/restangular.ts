import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RestangularConfig } from './config';
import { RestangularPath } from './path';
import { RestangularAllPath } from './all-path';
import { RestangularOnePath } from './one-path';
import { PathInterface } from './path.interface';

@Injectable()
export class Restangular {
  config: RestangularConfig;
  path: RestangularPath;
  route: PathInterface;

  constructor(
    public http: Http
  ) {
    this.config = new RestangularConfig();
    this.config.http = http;
    this.path = new RestangularPath(this.config);
  }

  all(route: string): RestangularPath {
    return this.path.all(route);
  }

  one(route: string, id: string | number): RestangularPath {
    return this.path.one(route, id);
  }
}
