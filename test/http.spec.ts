import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import { RestangularPath } from './../src/path';
import { Restangular } from './../src/restangular';
import { URLSearchParams, Headers, RequestMethod } from '@angular/http';
import { mergeHeaders, mergeSearch, RestangularHttp } from '../src/http';

describe('Restangular HTTP', () => {
  describe('mergeHeaders', () => {
    it('Merge Headers without defaultParams', () => {
      let headers = new Headers();
      headers.set('apiKey', 'api-client-key');

      let mergedHeaders = mergeHeaders(headers, null);
      expect(mergedHeaders.toJSON()).toEqual(jasmine.objectContaining({ apiKey: ['api-client-key'] }));
    });

    it('Merge Headers without params only default', () => {
      let defaultHeaders = new Headers();
      defaultHeaders.set('apiKey', 'api-client-key');
      let mergedHeaders = mergeHeaders(null, defaultHeaders);
      expect(mergedHeaders.toJSON()).toEqual(jasmine.objectContaining({ apiKey: ['api-client-key'] }));
    });

    it('Merge Headers with params and defaultParams', () => {
      let headers = new Headers();
      let defaultHeaders = new Headers();

      defaultHeaders.set('apiKey', 'undefined');
      headers.set('apiKey', 'UDXPx-Xko0w4BRKajozCVy20X11MRZs1');

      let mergedHeaders = mergeHeaders(headers, defaultHeaders);

      expect(defaultHeaders.toJSON()).toEqual(jasmine.objectContaining({ apiKey: ['undefined'] }));
      expect(headers.toJSON()).toEqual(jasmine.objectContaining({ apiKey: ['UDXPx-Xko0w4BRKajozCVy20X11MRZs1'] }));
      expect(mergedHeaders.toJSON()).toEqual(jasmine.objectContaining({ apiKey: ['UDXPx-Xko0w4BRKajozCVy20X11MRZs1'] }));
    });
  });

  describe('mergeSearch', () => {
    it('Merge URLSearchParams without defaultParams', () => {
      let params = new URLSearchParams();
      params.set('apiKey', 'api-client-key');
      let mergedParams = mergeSearch(params, null);
      expect(mergedParams.toString()).toEqual('apiKey=api-client-key');
    });

    it('Merge URLSearchParams without params only default', () => {
      let defaultParams = new URLSearchParams();
      defaultParams.set('apiKey', 'api-client-key');
      let mergedParams = mergeSearch(null, defaultParams);
      expect(mergedParams.toString()).toEqual('apiKey=api-client-key');
    });

    it('Merge URLSearchParams with params and defaultParams', () => {
      let params = new URLSearchParams();
      let defaultParams = new URLSearchParams();

      defaultParams.set('apiKey', 'undefined');
      params.set('apiKey', 'UDXPx-Xko0w4BRKajozCVy20X11MRZs1');

      let mergedParams = mergeSearch(params, defaultParams);

      expect(defaultParams.toString()).toEqual('apiKey=undefined');
      expect(params.toString()).toEqual('apiKey=UDXPx-Xko0w4BRKajozCVy20X11MRZs1');
      expect(mergedParams.toString()).toEqual('apiKey=UDXPx-Xko0w4BRKajozCVy20X11MRZs1');
    });
  });


  describe('RestangularHttp', () => {
    let path: any;

    beforeEach(() => {
      path = {
        config: {
          http: {
            request: jasmine.createSpy('inteceptor_01').and.returnValue(Observable.of(null))
          },
          responseInterceptors: [
            jasmine.createSpy('inteceptor_01').and.returnValue([]),
            jasmine.createSpy('inteceptor_02').and.returnValue([]),
          ],
          requestInterceptors: [
            jasmine.createSpy('inteceptor_01').and.returnValue([]),
            jasmine.createSpy('inteceptor_02').and.returnValue([]),
          ]
        }
      };
    });

    describe('interceptResponse', () => {
      it('Should have a RestangularHttp.interceptResponse method', () => {
        expect(RestangularHttp.interceptResponse).not.toBeUndefined();
        expect(RestangularHttp.interceptResponse).toEqual(jasmine.any(Function));
      });

      it('Should return a function when is called', () => {
        let interceptor = RestangularHttp.interceptResponse(null, 'get', '/videos');
        expect(interceptor).toEqual(jasmine.any(Function));
      });

      it('Should execute interceptor', () => {
        const res: any = {
          json: jasmine.createSpy('json').and.returnValue([])
        };

        let interceptor = RestangularHttp.interceptResponse(path, 'get', '/videos');

        interceptor(res, 1);

        expect(res.json).toHaveBeenCalledTimes(1);
        path.config.responseInterceptors.forEach((interceptor: any) => expect(interceptor).toHaveBeenCalledTimes(1))
      });
    });

    describe('makeRequest', () => {
      it('Should have a RestangularHttp.makeRequest method', () => {
        expect(RestangularHttp.makeRequest).not.toBeUndefined();
        expect(RestangularHttp.makeRequest).toEqual(jasmine.any(Function));
      });

      it('Should return a Observable when is called', () => {
        let request = RestangularHttp.makeRequest(null, path, {
          body: '',
          method: RequestMethod.Get
        });

        expect(request).toEqual(jasmine.any(Observable));
      });

      it('Should return a Observable when is called with adicional arguments', () => {
        let request = RestangularHttp.makeRequest(null, path, {
          body: '',
          method: RequestMethod.Get
        }, {});

        expect(request).toEqual(jasmine.any(Observable));
      });
    });

    describe('Request methods', () => {
      it('Should execute methods [get|getList|remove|head|options]', () => {
        let methods: any[] = [
          ['get', RequestMethod.Get],
          ['getList', RequestMethod.Get],
          ['remove', RequestMethod.Delete],
          ['head', RequestMethod.Head],
          ['options', RequestMethod.Options],
        ];

        let stub: jasmine.Spy = spyOn(RestangularHttp, 'makeRequest').and.returnValue(Observable.of(null));

        methods.forEach((method: any[]) => {
          let classMethod: Function = (<any>RestangularHttp)[method[0]];
          expect(classMethod).toEqual(jasmine.any(Function), `Expect RestangularHttp has a ${method[0]} method`);

          let request = classMethod(path, null);

          expect(request).toEqual(jasmine.any(Observable));
          expect(RestangularHttp.makeRequest).toHaveBeenCalledTimes(1);
          expect(RestangularHttp.makeRequest).toHaveBeenCalledWith(method[0], path, jasmine.objectContaining({
            body: '',
            method: method[1]
          }), null);

          stub.calls.reset();
        });
      });

      it('Should execute methods [post|put|patch]', () => {
        let methods: any[] = [
          ['post', RequestMethod.Post],
          ['put', RequestMethod.Put],
          ['patch', RequestMethod.Patch],
        ];

        let stub: jasmine.Spy = spyOn(RestangularHttp, 'makeRequest').and.returnValue(Observable.of(null));

        methods.forEach((method: any[]) => {

          let classMethod: Function = (<any>RestangularHttp)[method[0]];
          expect(classMethod).toEqual(jasmine.any(Function), `Expect RestangularHttp has a ${method[0]} method`);

          let body: any = {
             id: Math.floor((Math.random() * 999) + 1)
          };

          let request: any = classMethod(path, body, null);

          expect(request).toEqual(jasmine.any(Observable));
          expect(RestangularHttp.makeRequest).toHaveBeenCalledTimes(1);
          expect(RestangularHttp.makeRequest).toHaveBeenCalledWith(method[0], path, jasmine.objectContaining({
            body: body,
            method: method[1]
          }), null);

          stub.calls.reset();
        });
      });
    });
  });
});
