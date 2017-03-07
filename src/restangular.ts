import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';
import { Path } from './path';
import { AllPath } from './all-path';
import { OnePath } from './one-path';
import { PathInterface } from './path.interface';

@Injectable()
export class Restangular {
  config: Config;
  path: Path;
  route: PathInterface;

  constructor(
    public http: Http
  ) {
    this.config = new Config();
    this.config.http = http;
    this.path = new Path(this.config);
  }

  all(route: string): Path {
    return this.path.all(route);
  }

  one(route: string, id: string | number): Path {
    return this.path.one(route, id);
  }
}
