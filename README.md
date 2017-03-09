# Ng-Restangular

[![Build Status](https://travis-ci.org/RodolfoSilva/rs-restangular.svg?branch=master)](https://travis-ci.org/RodolfoSilva/rs-restangular)
[![Coverage Status](https://coveralls.io/repos/github/RodolfoSilva/rs-restangular/badge.svg?branch=master)](https://coveralls.io/github/RodolfoSilva/rs-restangular?branch=master)
[![David](https://img.shields.io/david/dev/RodolfoSilva/rs-restangular.svg)](https://david-dm.org/RodolfoSilva/rs-restangular/?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/rodolfosilva/rs-restangular/badge.svg)](https://snyk.io/test/github/rodolfosilva/rs-restangular)

This project is the follow-up of the [Restangular](https://github.com/RodolfoSilva/rs-restangular/) to Angular 2 written with Typescript.


# Table of contents

- [Restangular](#restangular)
- [How do I add this to my project?](#how-do-i-add-this-to-my-project)
- [Dependencies](#dependencies)
- [Starter Guide](#starter-guide)
  - [URL Building](#url-building)
- [License](#license)

## How do I add this to my project?

You can download this by:

* Using npm and running `npm install ng2-restangular`

**[Back to top](#table-of-contents)**

## Dependencies

Restangular depends on Angular2

**[Back to top](#table-of-contents)**

## Starter Guide

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
