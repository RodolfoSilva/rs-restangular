import { RestangularPath } from './path';
import { Http, Headers, Request, Response, URLSearchParams } from '@angular/http';

export type responseInterceptor = (res: any, operation?: string, path?: RestangularPath, url?: string, response?: Response) => any;
export type requestInterceptor = (req: Request, operation?: string, path?: RestangularPath) => Request;

export class RestangularConfig {
  private _baseUrl: string = '';
  private _requestInterceptors: Array<requestInterceptor> = [];
  private _responseInterceptors: Array<responseInterceptor> = [];

  public defaultHeaders: Headers;
  public defaultParams: URLSearchParams;

  public http: Http;

  addResponseInterceptors(interceptor: responseInterceptor): RestangularConfig {
    this._responseInterceptors.push(interceptor);
    return this;
  }

  addRequestInterceptors(interceptor: requestInterceptor): RestangularConfig {
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
