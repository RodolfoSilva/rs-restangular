import { RestangularConfig } from './../src/config';
import { Restangular } from './../src/restangular';
import { RestangularFactory } from '../src/helpers';


describe('RestangularHelpers', () => {
  describe('RestangularFactory', () => {
    it('Should have a RestangularFactory function', () => {
      expect(RestangularFactory).toEqual(jasmine.any(Function));
    });

    it('Should have a RestangularFactory function', () => {
      let restangularInstance = RestangularFactory(null);

      // Restangular
      expect(restangularInstance).toEqual(jasmine.any(Restangular));
    });

    it('Should have a RestangularFactory function', () => {
      let factory = jasmine.createSpy('factory');
      let restangularInstance = RestangularFactory(null, factory, 'dependency_01', 'dependency_02');

      // Restangular
      expect(restangularInstance).toEqual(jasmine.any(Restangular));
      expect(factory).toHaveBeenCalledTimes(1);
      expect(factory).toHaveBeenCalledWith(jasmine.any(RestangularConfig), 'dependency_01', 'dependency_02');
    });
  });
});
