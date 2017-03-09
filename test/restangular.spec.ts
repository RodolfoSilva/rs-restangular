import { Path } from './../src/path';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { Http, HttpModule, XHRBackend, Request, Response, ResponseOptions, BaseRequestOptions, RequestOptions, Headers, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
// import { Restangular } from '../restangular';
import { Restangular } from '../src/restangular';

describe('Restangular', () => {

  beforeAll(() => {
    // First, initialize the Angular testing environment.
    getTestBed().initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        Restangular,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  describe('RestangularConfig', () => {
    describe('isAbsoluteUrl', () => {
      let restangular: Restangular = null;
      let mockBackend: MockBackend = null;

      beforeEach(inject([Restangular, XHRBackend], (_restangular: Restangular, _mockBackend: MockBackend) => {
        restangular = _restangular;
        mockBackend = _mockBackend;
      }));

      it('Return true if is a absolute URL', () => {
        let b = restangular.all('companies');

        expect(b.route).not.toEqual(restangular.path.route);
        expect(restangular.path).not.toBeUndefined();
        expect(b.parent).toEqual(restangular.path);
      });

      it('Return true if is a absolute URL', () => {
        let b = restangular.all('/companies').one('videos', 1);

        expect(restangular.path.toArray()).toEqual(['']);
        expect(b.toArray()).toEqual(['', 'companies', 'videos', '1']);
      });

      it('Return true if is a absolute URL', () => {
        let b = restangular.all('companies').one('videos', 1);

        expect(restangular.path.toString()).toEqual('');
        expect(b.toString()).toEqual('/companies/videos/1');
      });

      it('Return true if is a absolute URL', () => {
        restangular.config.baseUrl = 'http://localhost/';

        let b = restangular.all('/companies').one('videos', 1);

        expect(restangular.path.toArray()).toEqual(['http://localhost']);
        expect(b.toArray()).toEqual(['http://localhost', 'companies', 'videos', '1']);
      });

      it('Return true if is a absolute URL', () => {
        let b = restangular.all('companies').one('videos', 1);
        b.config.baseUrl = 'http://localhost/';

        expect(restangular.path.toString()).toEqual('http://localhost');
        expect(b.toString()).toEqual('http://localhost/companies/videos/1');
      });

      it('Return true if is a absolute URL', () => {

        let request = restangular.all('companies').one('videos', 1);

        request.config.addResponseInterceptors((data: any, operation: string, path: Path, url: string, response: Response) => {
          console.info("RESPONSE", operation, data, url, response);
          return data;
        })
        request.config.addRequestInterceptors((req: Request, operation: string, path: Path) => {
          console.info("REQUEST", operation, req.url);
          return req;
        })

        const mockResponse = {
          id: 1,
          name: 'Video 1'
        };

        const header = new Headers({ key: 'original', key2: 'original' });

        request.config.defaultHeaders = header;

        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toEqual('/companies/videos/1');
          expect(connection.request.headers.get('key')).toEqual('original');
          expect(connection.request.headers.get('key2')).toEqual('modified');

          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        let options = new RequestOptions();

        options.headers = new Headers({ 'key2': ['modified'] });

        request.get(options).subscribe((video: any) => {
          expect(video.id).toEqual(mockResponse.id);
          expect(video.name).toEqual(mockResponse.name);
        });
      });

      it('POST /accounts/123/buildings/456/spaces', (done) => {
        const body = {
          name: 'New Space'
        };

        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toEqual('/accounts/123/buildings/456/spaces');
          expect(JSON.parse(connection.request.getBody())).toEqual(jasmine.objectContaining(body));

          expect(connection.request.method).toEqual(RequestMethod.Post);
          done();
        });
        restangular.one('accounts', 123).one('buildings', 456).all('spaces').post(body);

      });

      it('This will do ONE get to /accounts/123/buildings/456/spaces/789', (done) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toEqual('/accounts/123/buildings/456/spaces/789');
          expect(connection.request.method).toEqual(RequestMethod.Get);
          done();
        });

        restangular.one('accounts', 123).one('buildings', 456).one('spaces', 789).get();
      });

      it('DELETE /accounts/123/buildings/456', (done) => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toEqual('/accounts/123/buildings/456');
          expect(connection.request.method).toEqual(RequestMethod.Delete);
          done();
        });

        restangular.one('accounts', 123).one('buildings', 456).remove();
      });
    });
  });
});
