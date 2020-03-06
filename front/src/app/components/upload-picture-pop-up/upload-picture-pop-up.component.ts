  import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models/theWall';
import { Image, Tag } from '../../models/theWall';
import { FileService } from '../../services/file.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {SnotifyService, SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';

@Component({
  selector: 'app-upload-picture-pop-up',
  templateUrl: './upload-picture-pop-up.component.html',
  styleUrls: ['./upload-picture-pop-up.component.scss']
})
export class UploadPicturePopUpComponent implements OnInit, OnDestroy {

  newTag: string;
  mytagsID: string[];
  tagsDisplay: Tag[];
  name: string;
  file: File;
  description: string;

    private tagSub: Subscription;

  private userSub: Subscription;
  private currentUser: User;
  private image: Image;

  constructor(public dialogRef: MatDialogRef<UploadPicturePopUpComponent>,
  //@Inject(MAT_DIALOG_DATA) public data: DialogData,
  private api: ApiService,
  private auth: AuthService,
  private fileService: FileService,
  private snotifyService: SnotifyService) { }

  verificationTagAlreadyExist(tag)
  {
    let bool = true;
    for (var i = 0; i < this.tagsDisplay.length; i += 1)
    {
      if (tag._id == this.tagsDisplay[i]._id)
      {
        bool = false;
      }
    }
    return bool;
  }

  addNewTagDisplay(tag): void
  {
    let bool = this.verificationTagAlreadyExist(tag);
    if (bool)
    {
      //"add tag to display list"
      this.tagsDisplay.push(tag);
    }
  }

InitWatchTagsDisplay() : void
{
  this.tagSub = this.api.watch<Tag>('tags',
  { query: //ImageQuery,
    {
      $limit: 20,
      $sort: {createdAt: -1}
    }
  })
  .subscribe(res => {
    res.data.forEach(
      tag => {
        this.addNewTagDisplay(tag);
     });
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

obtainAllTagsDisplay() : void
{
  this.api.find<Tag>('tags',
  { query: //ImageQuery,
    {
      $limit: 20,
      $sort: {createdAt: -1},
      $skip: this.tagsDisplay.length
    }
  })
  .then(res => {
    res.data.forEach(
      tag => {
        this.addNewTagDisplay(tag);
     });
     if (this.tagsDisplay.length < res.total)
     {
       this.obtainAllTagsDisplay();
     }
  }).catch(err => {
    console.error(err);
    this.snotifyService.error((<Error>err).message, (<Error>err).name,
      {
        timeout: 4000,
        showProgressBar: false,
        pauseOnHover: true,
     });
   })
}

  ngOnInit() {
    this.tagsDisplay = [];
    this.mytagsID = [];
    this.userSub = this.auth.user.subscribe(user => this.currentUser = user);
    this.InitWatchTagsDisplay();
    this.obtainAllTagsDisplay();
  }

addRemoveTag(tag: Tag, checkbox) : void
{
  if (checkbox.checked)
  {
    this.mytagsID.push(tag._id);
  }
  else
  {
    this.mytagsID = this.mytagsID.filter(function(el) { return el != tag._id; });
  }
}

ngOnDestroy(){
  if (this.userSub)
    this.userSub.unsubscribe();
  if (this.tagSub)
    this.tagSub.unsubscribe();
}

  onNoClick(): void {
  this.dialogRef.close();
}

createTag() : void {
  if (!this.newTag)
  {
    this.snotifyService.error('empty field', 'Error create tag',
    {
      timeout: 3000,
      showProgressBar: false,
      pauseOnHover: true
    });
    return;
  }
  this.api.create<Tag>("tags", {"name" : this.newTag})
  .then(res =>
    this.newTag = "")
  .catch(err => {
    console.error(err);
    this.snotifyService.error((<Error>err).message, (<Error>err).name,
    {
      timeout: 3000,
      showProgressBar: false,
      pauseOnHover: true,
   });
  });
}

upload() : void {
  if (!this.name || !this.file || !this.description)
  {
    this.snotifyService.error('missing field(s)', 'Error upload',
    {
      timeout: 3000,
      showProgressBar: false,
      pauseOnHover: true,
   });
    return;
  }
  (<HTMLInputElement> document.getElementById("closeButton")).disabled = true;
  (<HTMLInputElement> document.getElementById("SendPicture")).disabled = true;
    this.api.create<Image>("images",
    new Image(this.name, this.currentUser._id, this.description, this.mytagsID))
    .then(res => {
      this.snotifyService.info('Upload in progress, Please wait', 'Upload',
      {
        timeout: 4000,
        showProgressBar: false,
        pauseOnHover: true,
     });
      return this.fileService.sendImage(this.file, 'image', res._id);
    })
    .then(res => {
      this.name = "";
      this.description = "";
      let file = (document.getElementById("file") as HTMLInputElement);
      if (file)
        file.value = "";
        (<HTMLInputElement> document.getElementById("SendPicture")).disabled = false;
        (<HTMLInputElement> document.getElementById("closeButton")).disabled = false;
        this.snotifyService.success('upload successfull', 'Success',
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true,
       });
    })
    .catch(err => {
      (<HTMLInputElement> document.getElementById("SendPicture")).disabled = false;
      (<HTMLInputElement> document.getElementById("closeButton")).disabled = false;
      console.error(err);
      this.snotifyService.error((<Error>err).message, (<Error>err).name,
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true,
       });
     });
  }
}
