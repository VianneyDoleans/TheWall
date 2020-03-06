import {Component, OnInit, OnDestroy, Input, HostListener, OnChanges} from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PictureDialogComponent } from '../picture-dialog/picture-dialog.component';
import { UploadPicturePopUpComponent } from '../upload-picture-pop-up/upload-picture-pop-up.component';
import {Inject} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../../services/api.service';
import { FileService } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';
import { Image, Tag } from '../../models/theWall';

import { SnotifyService, SnotifyPosition, SnotifyToastConfig } from 'ng-snotify';


export interface DialogData {
  tags: string[];
  picture: string;
  id: string;
  name: string;
  author: string;
  about: string;
  createdAt: string;
  path: string;
}

@Component({
  selector: 'gallery',
  templateUrl:'./gallery.component.html',
  styleUrls: ['./gallery.component.scss']})
export class GalleryComponent implements OnInit, OnDestroy, OnChanges {

  images: { url: string,
    id: string,
    tags: string[],
    name: string,
    author: string,
    about: string,
    createdAt: string,
    path: string,
    checked: boolean}[];

  private imageSub: Subscription;


  maxElementDisplay : number;
  currentsize: number;
  SizeListimageToCheckForDelete: number;

  @Input() ImageQuery;

  constructor(private dialog: MatDialog,
              private snotifyService: SnotifyService,
              private api: ApiService, private file: FileService) {
    this.currentsize = 0;
    this.SizeListimageToCheckForDelete = 0;
  }

  deleteOldImageGallery(): void
  {
    let IndexesToBeRemoved = [];
    for (var i = 0; i < this.images.length; i += 1)
    {
      if (this.images[i].checked == false && i < this.SizeListimageToCheckForDelete) // TODO : only watch picture
      {
        //"picture deleted"
        IndexesToBeRemoved.push(i);
      }
      this.images[i].checked = false;
    }
    while(IndexesToBeRemoved.length) {
      this.images.splice(IndexesToBeRemoved.pop(), 1);
      this.currentsize -= 1;
    }
  }

  generateNewElementGallery(image)
  {
    return {
      //TODO remove foreign url with a real asset
      "url" : "https://www.domyos.fr/sites/domyos/files/styles/460x460/public/default_images/no-picture.png?itok=N_PAhKif",
      "id" : image._id,
      "tags" : image.tags,
      "name" : image.name,
      "author" : image.author,
      "about": image.about,
      "createdAt" : image.createdAt,
      "path" : image.path,
      "checked" : true
    };
  }

  verificationImageDeleteOrAlreadyExist(image)
  {
    let bool = true;
    for (var i = 0; i < this.images.length; i += 1)
    {
      if (image._id == this.images[i].id)
      {
        bool = false;
        this.images[i].checked = true;
      }
    }
    return bool;
  }

  addNewImageGallery(image): void
  {
    let bool = this.verificationImageDeleteOrAlreadyExist(image);
    if (bool)
    {
      this.currentsize += 1;
      this.SizeListimageToCheckForDelete -= 1;
      const newImage = this.generateNewElementGallery(image);
      this.images.push(newImage);
      this.api.get<Image>("images", image._id).then(res =>
        newImage.url = res.data)
        .catch(err => {
          console.error(err);
          this.snotifyService.error((<Error>err).message, (<Error>err).name,
            {
              timeout: 4000,
              showProgressBar: false,
              pauseOnHover: true,
            });
        })
    }
  }

  addNewImageGalleryScrool(image): void
  {
    let bool = this.verificationImageDeleteOrAlreadyExist(image);
    if (bool)
    {
      this.currentsize += 1;
      const newImage = this.generateNewElementGallery(image);
      this.images.push(newImage);
      this.api.get<Image>("images", image._id).then(res =>
        newImage.url = res.data)
        .catch(err => {
          console.error(err);
          this.snotifyService.error((<Error>err).message, (<Error>err).name,
            {
              timeout: 4000,
              showProgressBar: false,
              pauseOnHover: true,
            });
        })
    }
  }

  sortGallery(): void
  {
    this.images.sort((a, b) => {
      return (new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime());
    });
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.ImageQuery) {
      this.getImages();
    }
  }

  ngOnDestroy() {
    if (this.imageSub) {
      this.imageSub.unsubscribe();
    }
  }

  private getImages() {
    this.images = [];

    if (this.imageSub) {
      this.imageSub.unsubscribe();
    }
    this.imageSub = this.api.watch<Image>('images', {
      query: this.ImageQuery
    }).subscribe((res) => {
      this.maxElementDisplay = res.total;
      this.SizeListimageToCheckForDelete = 15;
      const newData = JSON.parse(JSON.stringify(res.data));
      Promise.all(newData.map(
        image => {
          return Promise.all(
            image.tags.map((t, idx) => this.api.get<Tag>("tags", t)
              .then(tInfo => image.tags[idx] = tInfo.name))
          ).then(() => this.addNewImageGallery(image))
        })).then(() => {
          this.deleteOldImageGallery();
          this.sortGallery();
        }).catch(err => console.error(err));;
    }, err => {
      console.error(err);
      this.snotifyService.error((<Error>err).message, (<Error>err).name,
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true,
        });
    });
  }

  popUpUpload() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const ref = this.dialog.open(UploadPicturePopUpComponent, dialogConfig);
  }

  openDialog(image) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      picture: image.url,
      tags: image.tags,
      id: image.id,
      name: image.name,
      author: image.author,
      about: image.about,
      createdAt: image.createdAt,
      path: image.path };
    dialogConfig.panelClass = 'imageViewer';

    const ref = this.dialog.open(PictureDialogComponent, dialogConfig);

  }

  moreImage() {
    this.api.find<Image>('images',
      { query: //ImageQuery,
          {
            ...this.ImageQuery,
            $limit: 5,
            $skip: this.images.length }
      }).then(
      more => {
        more.data.forEach(
          image => {
            Promise.all(
              image.tags.map((t, idx) => this.api.get<Tag>("tags", t)
                .then(tInfo => image.tags[idx] = tInfo.name))
            ).then(() => this.addNewImageGalleryScrool(image))
            .catch(err => console.error(err));
          });
        this.maxElementDisplay = more.total;
      })
      .catch(err => {
        console.error(err);
        this.snotifyService.error((<Error>err).message, (<Error>err).name,
          {
            timeout: 4000,
            showProgressBar: false,
            pauseOnHover: true,
          });
      })
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
    {
      {
        if (this.images.length < this.maxElementDisplay) {
          this.moreImage();
        }
      }
    }
  }
}
