import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { Http, HttpModule, XHRBackend, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';
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
      it('Return true if is a absolute URL', inject([Restangular], (restangular: Restangular) => {
        let b = restangular.all('companies');

        expect(b.route).not.toEqual(restangular.path.route);
        expect(restangular.path).not.toBeUndefined();
        expect(b.parent).toEqual(restangular.path);
      }));

      it('Return true if is a absolute URL', inject([Restangular], (restangular: Restangular) => {
        let b = restangular.all('/companies').one('videos', 1);

        expect(restangular.path.toArray()).toEqual(['']);
        expect(b.toArray()).toEqual(['', 'companies', 'videos', '1']);
      }));

      it('Return true if is a absolute URL', inject([Restangular], (restangular: Restangular) => {
        let b = restangular.all('companies').one('videos', 1);

        expect(restangular.path.toString()).toEqual('');
        expect(b.toString()).toEqual('/companies/videos/1');
      }));

      it('Return true if is a absolute URL', inject([Restangular], (restangular: Restangular) => {
        restangular.config.baseUrl = 'http://localhost/';

        let b = restangular.all('/companies').one('videos', 1);

        expect(restangular.path.toArray()).toEqual(['http://localhost']);
        expect(b.toArray()).toEqual(['http://localhost', 'companies', 'videos', '1']);
      }));

      it('Return true if is a absolute URL', inject([Restangular], (restangular: Restangular) => {
        let b = restangular.all('companies').one('videos', 1);
        b.config.baseUrl = 'http://localhost/';

        expect(restangular.path.toString()).toEqual('http://localhost');
        expect(b.toString()).toEqual('http://localhost/companies/videos/1');
      }));

      it('Return true if is a absolute URL', inject([Restangular, XHRBackend], (restangular: Restangular, mockBackend: MockBackend) => {

        let b = restangular.all('companies').one('videos', 1);

        const mockResponse = {
          id: 1,
          name: 'Video 1'
        };

        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toEqual('/companies/videos/1');

          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        b.get().subscribe((video: any) => {
          expect(video.id).toEqual(mockResponse.id);
          expect(video.name).toEqual(mockResponse.name);
        });
      }));
    });
  });
});
