import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import * as feathersRx from 'feathers-reactive/lib';

import feathers from '@feathersjs/feathers';
import feathersSocketIOClient from '@feathersjs/client/socketio';
import feathersAuthClient from '@feathersjs/client/authentication';
import { Feathers } from '../models/feathers';
import { EnvService } from '../services/env.service';

/*
  Feathers service is the way to handle the API,
  Please use the API service and not this service to call the api.
 */
@Injectable()
export class FeathersService {

  private feathers = feathers();
  private socket = io(this.env.API_URL);

  constructor(private env: EnvService) {
    this.feathers
      .configure(feathersSocketIOClient(this.socket, { timeout: 40000 }))
      .configure(feathersAuthClient({
        storage: window.localStorage
      }))
      .configure(feathersRx({
        idField: '_id'
      }));

    this.socket.on('connect', () => {
      console.log('Connected on ' + this.env.API_URL);
      this.service('images').timeout = 15000;
    });
  }

  public service(name: string) {
    return this.feathers.service(name);
  }

  public authenticate(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials);
  }

  public logout() {
    return this.feathers.logout();
  }

  public client(): Feathers {
    return this.feathers;
  }
}
