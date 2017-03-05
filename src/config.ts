import { Http } from '@angular/http';

export class Config {
  private __baseUrl: string = '';

  public http: Http;

  set baseUrl(baseUrl: string) {
    this.__baseUrl = baseUrl.replace(/\/$/g, '');
  }

  get baseUrl(): string {
    return this.__baseUrl;
  }
}
