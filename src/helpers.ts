import { Http } from '@angular/http';
import { Restangular } from './restangular';

export function RestangularFactory(http: Http, customFactory?: Function, ...deps: Array<any>): Restangular {
  const restangular: Restangular = new Restangular(http);

  deps = [].concat(deps);

  if (customFactory) {
    customFactory(restangular.config, ...deps);
  }

  return restangular;
}
