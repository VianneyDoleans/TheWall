import { Injectable } from '@angular/core';
import { FeathersService } from "./feathers.service";
import { Observable } from "rxjs/Observable";
import { ISearchQuery, QueryResult } from "../models/feathers";
import { ImageFile } from "../models/theWall";

/*
  For the query, please check the FeathersJS docs : https://github.com/feathersjs/docs/blob/master/api/databases/querying.md
 */

class ImageCache {
  public id: string;
  public data: ImageFile | Promise<ImageFile>;
}

@Injectable()
export class ApiService {

  private imageCache: ImageCache[] = [];

  constructor(private feathers: FeathersService) {
  }

  observe<T>(serviceName: string, objectId: string, query?: ISearchQuery): Observable<T> {
    return this.feathers.service(serviceName)
      .watch({ listStrategy: 'always' })
      .get(objectId, query);
  }

  watch<T>(serviceName: string, query?: ISearchQuery): Observable<QueryResult<T>> {
    return this.feathers.service(serviceName)
      .watch({ listStrategy: 'always' })
      .find(query);
  }

  patch<T>(serviceName: string, objectId: string, data: any): Promise<T> {
    return this.feathers.service(serviceName).patch(objectId, data);
  }

  patchMany<T>(serviceName: string, data: any, query?: ISearchQuery): Promise<T> {
    return this.feathers.service(serviceName).patch(null, data, query);
  }

  remove<T>(serviceName: string, id: string): Promise<T> {
    return this.feathers.service(serviceName).remove(id);
  }

  removeMany(serviceName: string, query: ISearchQuery): Promise<void> {
    return this.feathers.service(serviceName).remove(null, query);
  }

  create<T>(serviceName: string, data: any): Promise<T> {
    return this.feathers.service(serviceName).create(data);
  }

  find<T>(serviceName: string, query?: ISearchQuery): Promise<QueryResult<T>> {
    return this.feathers.service(serviceName).find(query);
  }

  get<T>(serviceName: string, objectId: string, query?: ISearchQuery): Promise<T> {
    return this.feathers.service(serviceName).get(objectId, query);
  }

  getImage(imageId: string, blankImage = './assets/blank.png'): Promise<ImageFile> {
    const cache = this.getImageFromCache(imageId);

    if (!imageId) {
      return Promise.resolve({ id: undefined, uri: blankImage });
    }
    if (cache) {
      return Promise.resolve(cache.data);
    } else {
      const cache: ImageCache = { id: imageId, data: this.get<ImageFile>('upload-image', imageId)
          .then(res => {
            cache.data = res;
            return res;
          }).catch((err) => {
            console.error(err);
            console.warn('Couldn\'t get image : ', imageId);
            return { id: undefined, uri: blankImage };
          })
      };
      this.imageCache.push(cache);
      return Promise.resolve(cache.data);
    }
  }

  private getImageFromCache(imageId: string): ImageCache {
    return this.imageCache.find(i => i.id === imageId);
  }

}
