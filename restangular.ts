import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './src/config';
import { Path } from './src/path';
import { AllPath } from './src/all-path';
import { OnePath } from './src/one-path';
import { PathInterface } from './src/path.interface';

@Injectable()
export class BaseRestangular {
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
