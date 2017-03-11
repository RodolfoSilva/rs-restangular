# RS-Restangular

[![Build Status](https://travis-ci.org/RodolfoSilva/rs-restangular.svg?branch=master)](https://travis-ci.org/RodolfoSilva/rs-restangular)
[![Coverage Status](https://coveralls.io/repos/github/RodolfoSilva/rs-restangular/badge.svg?branch=master)](https://coveralls.io/github/RodolfoSilva/rs-restangular?branch=master)
[![David](https://img.shields.io/david/dev/RodolfoSilva/rs-restangular.svg)](https://david-dm.org/RodolfoSilva/rs-restangular/?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/rodolfosilva/rs-restangular/badge.svg)](https://snyk.io/test/github/rodolfosilva/rs-restangular)

This project is the follow-up of the [Restangular](https://github.com/RodolfoSilva/rs-restangular/) to Angular 2 written with Typescript.


# Table of contents

- [Restangular](#ng-restangular)
- [How do I add this to my project?](#how-do-i-add-this-to-my-project)
- [Dependencies](#dependencies)
- [Starter Guide](#starter-guide)
  - [Quick configuration for Lazy Readers](#quick-configuration-for-lazy-readers)
  - [Configuring Restangular](#configuring-restangular)
    - [Properties](#properties)
      - [baseUrl](#baseurl)
      - [addRequestInterceptor](#addrequestinterceptor)
      - [addResponseInterceptor](#addresponseinterceptor)
      - [defaultHeaders](#defaultheaders)
  - [URL Building](#url-building)
- [License](#license)

## How do I add this to my project?

You can download this by:

* Using npm and running `npm install rs-restangular`

**[Back to top](#table-of-contents)**

## Dependencies

Restangular depends on Angular2

**[Back to top](#table-of-contents)**

## Starter Guide

### Quick Configuration (For Lazy Readers)
This is all you need to start using all the basic Restangular features.


````javascript
import { NgModule } from '@angular/core';
import { Headers } from '@angular/http';
import { AppComponent } from './app.component';
import { RestangularConfig, RestangularModule } from 'rs-restangular';

// Function for settting the default restangular configuration
export function RestangularConfigFactory (restangularConfig: RestangularConfig) {
  restangularConfig.baseUrl = 'http://api.restng2.local/v1';
  restangularConfig.defaultHeaders = new Headers({'Authorization': 'Bearer UDXPx-Xko0w4BRKajozCVy20X11MRZs1'});
} 

// AppModule is the main entry point into Angular2 bootstraping process
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
  ],
  imports: [
    // Importing RestangularModule and making default configs for restanglar
    RestangularModule.forRoot(RestangularConfigFactory),
  ]
})
export class AppModule {
}

// later in code ...

@Component({
  ...
})
export class OtherComponent {
  constructor(private restangular: Restangular) {
  }

  ngOnInit() {
    // GET http://api.test.local/v1/users/2/accounts
    this.restangular.one('users', 2).all('accounts').getList();
  }

}
````

#### With dependecies 


````javascript
import { NgModule } from '@angular/core';
import { Headers, Request } from '@angular/http';
import { AppComponent } from './app.component';
import { SessionService } from './auth/session.service';
import { RestangularConfig, RestangularModule, RestangularPath } from 'rs-restangular';

// Function for settting the default restangular configuration
export function RestangularConfigFactory (restangularConfig: RestangularConfig, http: Http, sessionService: SessionService) {
  restangularConfig.baseUrl = 'http://api.restng2.local/v1'; 

  restangularConfig.addRequestInterceptors((req: Request, operation?: string, path?: RestangularPath): Request => {
    req.headers.set('Authorization': `Bearer ${sessionService.token}`);

    return req;
  });
} 

// AppModule is the main entry point into Angular2 bootstraping process
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
  ],
  imports: [
    SessionService,
    // Importing RestangularModule and making default configs for restanglar
    RestangularModule.forRoot(RestangularConfigFactory, [Http, SessionService]),
  ]
})
export class AppModule {
} 
````

**[Back to top](#table-of-contents)**

### Configuring Restangular

#### Properties
Restangular comes with defaults for all of its properties but you can configure them. **So, if you don't need to configure something, there's no need to add the configuration.**
You can set all these configurations in **`RestangularConfig` or `Restangular` service to change the global configuration**. Check the section on this later.

**[Back to top](#table-of-contents)**

##### baseUrl
The base URL for all calls to your API. For example if your URL for fetching accounts is http://example.com/api/v1/accounts, then your baseUrl is `/api/v1`. The default baseUrl is an empty string which resolves to the same url that AngularJS is running, but you can also set an absolute url like `http://api.example.com/api/v1` if you need to set another domain.

````javascript
restangularConfig.baseUrl = 'http://api.example.com/api/v1'; 
````

**[Back to top](#table-of-contents)**

##### addResponseInterceptor
The responseInterceptor is called after we get each response from the server. It's a function that receives this arguments:

* **data: any**: The data received got from the server
* **operation: string**: The operation made. It'll be the HTTP method used except for a `GET` which returns a list of element which will return `getList` so that you can distinguish them.
* **path: RestangularPath**: The model that's being requested. 
* **url**: The relative URL being requested. For example: `/api/v1/accounts/123`
* **response: Response**: Full server response including headers 

Some of the use cases of the responseInterceptor are handling wrapped responses and enhancing response elements with more methods among others.

The responseInterceptor must return the restangularized data element.

````javascript
// set default header "token"
restangularConfig.addResponseInterceptor((res: any, operation?: string, path?: RestangularPath, url?: string, response?: Response) => {
  console.log(res);
  console.log(path.route);
  return res;
});
````

**[Back to top](#table-of-contents)**

##### addRequestInterceptor
The requestInterceptor is called before sending any data to the server. It's a function that must return the element to be requested. This function receives the following arguments:

* **req: Request**: The element to send to the server.
* **operation: string**: The operation made. It'll be the HTTP method used except for a `GET` which returns a list of element which will return `getList` so that you can distinguish them.
* **path: RestangularPath**: The model that's being requested. 

````javascript
// set default header "token"
restangularConfig.addRequestInterceptor((req: Request, operation?: string, path?: RestangularPath) => {
  console.log(req.url);
  console.log(path.route);
  return req;
});
````

**[Back to top](#table-of-contents)**

##### defaultHeaders

You can set default Headers to be sent with every request. Send format: {header_name: header_value}

````javascript
// set default header "token"
restangularConfig.defaultHeaders = new Headers({ token: "x-restangular" });
````

**[Back to top](#table-of-contents)**

### URL Building
Sometimes, we have a lot of nested entities (and their IDs), but we just want the last child. In those cases, doing a request for everything to get the last child is overkill. For those cases, I've added the possibility to create URLs using the same API as creating a new Restangular object. This connections are created without making any requests. Let's see how to do this:

````javascript
@Component({
  ...
})
export class OtherComponent {
  constructor(private restangular: Restangular) {
  }

  ngOnInit() {
    let restangularSpaces = this.restangular.one('accounts',123).one('buildings', 456).all('spaces');

    // This will do ONE get to /accounts/123/buildings/456/spaces
    restangularSpaces.getList()

    // This will do ONE get to /accounts/123/buildings/456/spaces/789
    this.restangular.one('accounts', 123).one('buildings', 456).one('spaces', 789).get()

    // POST /accounts/123/buildings/456/spaces
    this.restangular.one('accounts', 123).one('buildings', 456).all('spaces').post({name: 'New Space'});

    // DELETE /accounts/123/buildings/456
    this.restangular.one('accounts', 123).one('buildings', 456).remove();
  }
}
````

**[Back to top](#table-of-contents)**

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

**[Back to top](#table-of-contents)**
