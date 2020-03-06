import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { DialogData } from '../gallery/gallery.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/theWall';
import { ApiService } from '../../services/api.service';
import { ImageFile, Image } from '../../models/theWall';
import { Subscription } from 'rxjs/Subscription';
import {SnotifyService, SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.scss']
})
export class PictureDialogComponent implements OnInit, OnDestroy  {

  id: { url: string }[];
  author: string;
  betterQualityImage : ImageFile;
  isAdmin: boolean;
  isOwner: boolean;
  private userSub: Subscription;
  private currentUser: User;

  constructor(public dialogRef: MatDialogRef<PictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private api: ApiService,
    private auth: AuthService,
    private snotifyService: SnotifyService) {
   }

  ngOnInit() {
    this.api.get<User>("users", this.data.author).then( res => {
      this.author = res.email;
    }).catch(err => {
      console.error(err);
      this.snotifyService.error((<Error>err).message, 'Error',
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true,
       });
     });
    this.displayDeleteButton();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  displayDeleteButton(): void
  {
    this.userSub = this.auth.user.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.currentUser.roles.includes('admin');
      this.isOwner = this.data.author === this.currentUser._id;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  download(link): void
  {
    this.api.get<ImageFile>("upload-image", this.data.path)
    .then(res => {
      link.href = res.uri;
      link.click();
    })
    .catch(err => {
      console.error(err);
      this.snotifyService.error((<Error>err).message, (<Error>err).name,
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true,
       });
     });
    //link.click()
  }

  delete(): void
  {
    (<HTMLInputElement> document.getElementById("deleteButton")).disabled = true;
    this.api.remove<Image>("images", this.data.id)
    .then(res =>  {
      this.dialogRef.close();
      this.snotifyService.success("delete successfull", "Success",
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: false
       });
    })
    .catch(err => {
      (<HTMLInputElement> document.getElementById("deleteButton")).disabled = false;
      console.error(err);
      console.error(err);
      this.snotifyService.error((<Error>err).message, (<Error>err).name,
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true
       });
    });
  }
}
