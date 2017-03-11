import { RestangularConfig, RestangularModule, Restangular } from './../src';
import { RestangularPath } from './../src/path';
import { RestangularFactory } from './../src/helpers';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { Http, HttpModule, XHRBackend, Request, Response, ResponseOptions, BaseRequestOptions, RequestOptions, Headers, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export function RestangularConfigFactory(restangularConfig: RestangularConfig) {
  //  console.info("DDDDDDDD", restangularConfig);
}

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
      imports: [
        HttpModule,
        RestangularModule.forRoot(RestangularConfigFactory, [Http])
      ],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  describe('RestangularFactory', () => {
    let http: Http = null;
    let mockBackend: MockBackend = null;

    beforeEach(inject([Http], (_http: Http) => {
      http = _http;
    }));

    it('Factory to create Restangular instance', () => {
      expect(RestangularFactory(http)).toEqual(jasmine.any(Restangular));
    });

    it('Factory to create Restangular instance with dependencies', () => {
      let factory: Function = jasmine.createSpy('factory');
      let dependencies: Array<any> = ['a', 'b', 'c'];
      let restangular: Restangular = RestangularFactory(http, factory, ...dependencies);

      expect(restangular).toEqual(jasmine.any(Restangular));
      expect(factory).toHaveBeenCalledWith(restangular.config, ...dependencies);
    });

  });

  describe('RestangularConfig', () => {
    let restangular: Restangular = null;
    let mockBackend: MockBackend = null;

    beforeEach(inject([Restangular, XHRBackend], (_restangular: Restangular, _mockBackend: MockBackend) => {
      restangular = _restangular;
      mockBackend = _mockBackend;
    }));

    it('Restangular.all should define route', () => {
      let companies: RestangularPath = restangular.all('companies');

      expect(companies.toString()).toEqual('/companies');
    });

    it('Restangular.all should not change the base route', () => {
      let companies: RestangularPath = restangular.all('companies');

      expect(companies.route).not.toEqual(restangular.path.route);
      expect(restangular.path).not.toBeUndefined();
    });

    it('Restangular.all should return a new path with parent for current restangular', () => {
      let companies: RestangularPath = restangular.all('companies');
      expect(companies.parent).toEqual(restangular.path);
    });

    it('Restangular.all should have a `one` and `all` method', () => {
      let companies = restangular.all('/companies');

      expect(companies.one).not.toBeUndefined();
      expect(companies.one).toEqual(jasmine.any(Function));

      expect(companies.all).not.toBeUndefined();
      expect(companies.all).toEqual(jasmine.any(Function));
    });

    it('Restangular.all().toArray() should return full route', () => {
      let companies = restangular.all('companies');

      expect(restangular.path.toArray()).toEqual(['']);
      expect(companies.toArray()).toEqual(['', 'companies']);
    });

    it('Restangular.all(`companies`).one(`videos`, 1).toArray() should return full route', () => {
      let videos = restangular.all('companies').one('videos', 1);

      expect(restangular.path.toString()).toEqual('');
      expect(videos.toString()).toEqual('/companies/videos/1');
    });

    it('Should merge path with baseUrl', () => {
      restangular.config.baseUrl = 'http://localhost/';

      let videos = restangular.all('/companies').one('videos', 1);

      expect(restangular.path.toArray()).toEqual(['http://localhost']);
      expect(videos.toArray()).toEqual(['http://localhost', 'companies', 'videos', '1']);
    });

    it('Should merge path with baseUrl to string', () => {
      let b = restangular.all('companies').one('videos', 1);
      b.config.baseUrl = 'http://localhost/';

      expect(restangular.path.toString()).toEqual('http://localhost');
      expect(b.toString()).toEqual('http://localhost/companies/videos/1');
    });

    it('Add response and request interceptors', () => {

      let request = restangular.all('companies').one('videos', 1);

      request.config.addResponseInterceptors((data: any, operation: string, path: RestangularPath, url: string, response: Response) => {
        return data;
      })
      request.config.addRequestInterceptors((req: Request, operation: string, path: RestangularPath) => {
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
