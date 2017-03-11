import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import { RestangularConfig } from './../src/config';
import { RestangularPath } from './../src/path';
import { PathInterface } from './../dist/src/path.interface.d';
import { RestangularElement } from '../src/element';

describe('Restangular Element', () => {
  class VideoModel {
    id: number;
    nome: string;
  }

  let path: RestangularPath;
  let video: RestangularElement<VideoModel>;

  beforeEach(() => {
    let config = new RestangularConfig();
    path = new RestangularPath(config);
    let obj = new VideoModel();
    obj.id = 10;

    video = new RestangularElement<VideoModel>(obj, path);
  });

  it('Should create a new instace of RestangularElement<T>', () => {
    let video = new RestangularElement<VideoModel>({});
    expect(video).toEqual(jasmine.any(RestangularElement));
  });

  it('Should have a `__path__` atribute', () => {
    expect(video.__path__).not.toBeUndefined();
    expect(video.__path__).toEqual(jasmine.any(RestangularPath));
  });

  describe('RestangularElement.put', () => {
    it('Should have a `put` method', () => {
      expect(video.put).not.toBeUndefined();
      expect(video.put).toEqual(jasmine.any(Function));
    });

    it('Should execute RestangularPath.put with plained data', () => {
      spyOn(video.__path__, 'put').and.returnValue(Observable.of(null));
      spyOn(video, 'plain').and.returnValue({ id: 25 });

      video.put();

      expect(video.plain).toHaveBeenCalled();
      expect(video.__path__.put).toHaveBeenCalledWith({ id: 25 }, undefined);
    });
  });

  describe('RestangularElement.plain', () => {
    it('Should have a `plain` method', () => {
      expect(video.plain).not.toBeUndefined();
      expect(video.plain).toEqual(jasmine.any(Function));
    });

    it('Should return plained data', () => {
      const plained = video.plain();

      expect(plained).toEqual(jasmine.objectContaining({ id: 10 }));
    });

    it('Should return an instance of VideoModel with plained data', () => {
      const plained = video.plain(VideoModel);

      expect(plained).toEqual(jasmine.objectContaining({ id: 10 }));
      expect(plained).toEqual(jasmine.any(VideoModel));
    });
  });

  describe('RestangularElement.remove', () => {
    it('Should have a `remove` method', () => {
      expect(video.remove).not.toBeUndefined();
      expect(video.remove).toEqual(jasmine.any(Function));
    });

    it('Should execute RestangularPath.remove with plained data', () => {
      spyOn(video.__path__, 'remove').and.returnValue(Observable.of(null));

      video.remove();

      expect(video.__path__.remove).toHaveBeenCalledWith(undefined);
    });
  });

  describe('RestangularElement.clone', () => {
    it('Should have a `clone` method', () => {
      expect(video.clone).not.toBeUndefined();
      expect(video.clone).toEqual(jasmine.any(Function));
    });

    it('Should clone the RestangularElement', () => {
      let cloned: RestangularElement<VideoModel> =  video.clone();
      expect(cloned).toEqual(jasmine.any(RestangularElement));
    });

    it('Should clone the RestangularElement remove reference from original object', () => {
      let cloned: RestangularElement<VideoModel> =  video.clone();

      expect(cloned).not.toBe(video);

      expect(cloned.__original__).toBe(video.__original__);
      expect(cloned.__path__).toBe(video.__path__);
    });
  });
});
