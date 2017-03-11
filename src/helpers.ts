import { Http } from '@angular/http';
import { Restangular } from './restangular';

export function RestangularFactory(http: Http, factory?: Function, ...deps: Array<any>): Restangular {
  const restangular: Restangular = new Restangular(http);

  factory = factory || (() => {});
  factory(restangular.config, ...(deps || []));

  return restangular;
}
