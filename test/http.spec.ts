import { URLSearchParams, Headers } from '@angular/http';
import { mergeHeaders, mergeSearch } from '../src/http';

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
});
