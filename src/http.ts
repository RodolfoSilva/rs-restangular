import { Observable } from 'rxjs/Observable';
import { Headers, Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { RestangularConfig } from './config';
import { RestangularPath } from './path';

import 'rxjs/add/operator/map';

export function mergeHeaders(headers: Headers, defaultHeaders: Headers): Headers {
  defaultHeaders = new Headers(defaultHeaders);

  if (!headers) {
    return defaultHeaders;
  }

  let newHeaders: Headers = defaultHeaders;

  (headers as Headers).forEach((values: string[], name: string) => {
    newHeaders.set(name, values)
  });

  return newHeaders;
}

export class RestangularHttp {

  static interceptResponse(path: RestangularPath, operation: string, url: string): (value: any, index: number) => any {
    return (res: Response, index: number) => {
      return (path.config.responseInterceptors || []).reduce((data: any, intercepor: any) => {
        return intercepor(data, operation, path, url, res);
      }, res.json());
    }
  }

  static makeRequest(operation: string, path: RestangularPath, requestArgs: RequestOptionsArgs, additionalOptions?: RequestOptionsArgs): Observable<Response> {
    let options = new RequestOptions(requestArgs);

    if (additionalOptions) {
      options = options.merge(additionalOptions);
    }

    options.headers = mergeHeaders(options.headers, path.config.defaultHeaders);

    let request: Request = new Request(options);
    request.url = path.toString();

    request = path.config.requestInterceptors.reduce((req: Request, interceptor: any) => interceptor(req, operation, path), request);

    return path.config.http.request(request).map(RestangularHttp.interceptResponse(path, operation, request.url));
  }

  static get(path: RestangularPath, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('get', path, {
      body: '',
      method: RequestMethod.Get
    }, options);
  }

  static getList(path: RestangularPath, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('getList', path, {
      body: '',
      method: RequestMethod.Get
    }, options);
  }

  static post(path: RestangularPath, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('post', path, {
      body: body,
      method: RequestMethod.Post
    }, options);
  }

  static put(path: RestangularPath, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('put', path, {
      body: body,
      method: RequestMethod.Put
    }, options);
  }

  static delete(path: RestangularPath, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('delete', path, {
      body: '',
      method: RequestMethod.Delete
    }, options);
  }

  static patch(path: RestangularPath, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('patch', path, {
      body: body,
      method: RequestMethod.Patch
    }, options);
  }

  static head(path: RestangularPath, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('head', path, {
      body: '',
      method: RequestMethod.Head
    }, options);
  }

  static options(path: RestangularPath, options?: RequestOptionsArgs): Observable<Response> {
    return RestangularHttp.makeRequest('options', path, {
      body: '',
      method: RequestMethod.Options
    }, options);
  }
}
