import { Http } from '@angular/http';
import { Restangular } from './restangular';

export function RestangularFactory(http: Http, factory?: Function, ...deps: Array<any>): Restangular {
  const restangular: Restangular = new Restangular(http);

  if (factory) {
    factory(restangular.config, ...(deps || []));
  }

  return restangular;
}
