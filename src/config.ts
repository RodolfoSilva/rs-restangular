import { Path } from './path';
import { Http, Headers, Request, Response } from '@angular/http';

export type responseInterceptor = (res: any, operation?: string, path?: Path, url?: string, response?: Response) => any;
export type requestInterceptor = (req: Request, operation?: string, path?: Path) => Request;

export class Config {
  private _baseUrl: string = '';
  private _requestInterceptors: Array<requestInterceptor> = [];
  private _responseInterceptors: Array<responseInterceptor> = [];

  public defaultHeaders: Headers;
  public http: Http;

  addResponseInterceptors(interceptor: responseInterceptor): Config {
    this._responseInterceptors.push(interceptor);
    return this;
  }

  addRequestInterceptors(interceptor: requestInterceptor): Config {
    this._requestInterceptors.push(interceptor);
    return this;
  }

  get responseInterceptors(): Array<responseInterceptor> {
    return this._responseInterceptors;
  }

  get requestInterceptors(): Array<requestInterceptor> {
    return this._requestInterceptors;
  }

  set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl.replace(/\/$/g, '');
  }

  get baseUrl(): string {
    return this._baseUrl;
  }
}
