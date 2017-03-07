import { Http } from '@angular/http';

export class Config {
  private __baseUrl: string = '';
  private __defaultHeaders: any = {};

  public http: Http;

  set baseUrl(baseUrl: string) {
    this.__baseUrl = baseUrl.replace(/\/$/g, '');
  }

  get baseUrl(): string {
    return this.__baseUrl;
  }

  set defaultHeaders(defaultHeaders: any) {
    this.__defaultHeaders = Object.assign({}, defaultHeaders);
  }

  get defaultHeaders(): any {
    return this.defaultHeaders;
  }
}
