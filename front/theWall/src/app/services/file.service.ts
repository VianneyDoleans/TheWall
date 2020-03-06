import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import {ImageFile} from "../models/theWall";
import { EnvService } from '../services/env.service';

@Injectable()
export class FileService {

  constructor(private auth: AuthService, private env: EnvService) { }

  public sendImage(file: File, linkWith?: 'user' | 'image', id?: string): Promise<ImageFile> {
    return new Promise((res, rej) => {
      let url = this.env.API_URL + 'upload-image';
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      if (linkWith) {
        url += '?linkWith=' + linkWith + '&linkId=' + id;
      }
      formData.append('avatar', file, file.name);
      return this.auth.getJWT().then(jwt => {
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', jwt);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.onload = () => {
          const response = JSON.parse(xhr.response);

          if (!response.id) {
            console.error(response);
            rej(response);
          }
          res(response);
        };
        xhr.send(formData);  // multipart/form-data
      });
    });
  }

}
