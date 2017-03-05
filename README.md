# Ng-Restangular
This project is the follow-up of the [Restangular](https://github.com/mgonto/restangular/) to Angular 2 written with Typescript.

# Using it to your project
Altough in beta, this project already will be able to be used in any other Angular 2 project. To do so, follow these steps:
* <b>PS:</b> Ng-Restangular depends of Angular 2. You must install it before following the among steps.
* Clone this repository (Cloning it inside your actual repository is recommended)
* In <code>Ng-Restangular</code> directory, type <code>npm install</code> (or <code>yarn</code> if you are familiar into yarn usage)
* Declare its respectives paths into your html by using <code>script</code> tag.

# Configuring Ng-Restangular
After configuring the whole environment, it's simple to start using Ng-Restangular. Inject this snippet into your Controller.
````typescript
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RestangularModule } from 'ng-restangular';

// Function for settting the default restangular configuration
export function RestangularConfigFactory (RestangularProvider) {
  RestangularProvider.setBaseUrl('http://api.youraddress.local/v1');
  RestangularProvider.setDefaultHeaders({'Authorization': 'YOUR_DEFAULT_HEADERS'});
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

export class AppModule { }

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

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
