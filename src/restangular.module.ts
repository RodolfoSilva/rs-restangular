import { ModuleWithProviders, NgModule, OpaqueToken, Optional, SkipSelf } from '@angular/core';
import { Http, HttpModule } from "@angular/http";
import { RestangularConfig } from './config';
import { Restangular } from './restangular';
import { RestangularHttp } from './http';
import { RestangularFactory } from './helpers';

export const CONFIG_FACTORY = new OpaqueToken('configObj');

@NgModule({
  imports: [HttpModule],
  providers: [Restangular]
})
export class RestangularModule {
  constructor( @Optional() @SkipSelf() parentModule: RestangularModule) {
    if (parentModule) {
      throw new Error('RestangularModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(factory?: Function, deps?: Array<any>): ModuleWithProviders {
    return {
      ngModule: RestangularModule,
      providers: [
        { provide: CONFIG_FACTORY, useValue: factory },
        { provide: Restangular, useFactory: RestangularFactory, deps: [Http, CONFIG_FACTORY, ...(deps || [])] },
      ]
    }
  }
}
