import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ImageCommentary, User } from '../../models/theWall';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Image } from '../../models/theWall';
import {SnotifyService, SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';

@Component({
  selector: 'commentaries',
  templateUrl: './commentaries.component.html',
  styleUrls: ['./commentaries.component.scss']
})
export class CommentariesComponent implements OnInit, OnDestroy {

  @Input()
  IdImage : string;
  commentaries : {
    picture,
    id: string,
    idUser : string,
    createdAt : string,
    content : string,
  checked : boolean,
  isAdmin: boolean,
  isOwner: boolean}[];

private promiseUser : Promise<void>;
  private currentUser: User;
  private userSbuscription : Subscription;
  private commentariesSub: Subscription;

  maxElementDisplay : number;
  currentsize: number;
  SizeListCommentToCheckForDelete: number;

  MyCommentary: string;

  constructor(private api: ApiService,
    private auth: AuthService,
    private snotifyService: SnotifyService) {
      this.currentsize = 0;
      this.SizeListCommentToCheckForDelete = 0;
    }

    deleteOldCommentary(): void
    {
      let IndexesToBeRemoved = [];
      for (var i = 0; i < this.commentaries.length; i += 1)
      {
        if (this.commentaries[i].checked == false)
        {
          // erase
          IndexesToBeRemoved.push(i);
        }
          this.commentaries[i].checked = false;
      }
      while(IndexesToBeRemoved.length) {
        this.commentaries.splice(IndexesToBeRemoved.pop(), 1);
        this.currentsize -= 1;
      }
    }

    generateNewCommentary(author, commentary)
    {
      this.api.getImage(author.picture)
      .then(res => {
          this.commentaries.push( {
            "picture" : /*"default.png",//*/res.uri,
            "id" : commentary._id,
            "idUser" : author.email,
            "createdAt" : commentary.createdAt,
            "content" : commentary.content,
            "checked" : true,
            "isAdmin" : this.currentUser.roles.includes('admin'),
            "isOwner" : author._id === this.currentUser._id
          });
          // TODO:
          //too many sort, have to optimize
          this.sortCommentaries();
      })
      .catch(err => {
          this.commentaries.push({
            "picture" : "default.png",
            "id" : commentary._id,
            "idUser" : author.email,
            "createdAt" : commentary.createdAt,
            "content" : commentary.content,
            "checked" : true,
            "isAdmin" : this.currentUser.roles.includes('admin'),
            "isOwner" : author._id === this.currentUser._id
          });
          // TODO:
          //too many sort, have to be optimize
          this.sortCommentaries();
      })
    }

    verificationCommentaryDeleteOrAlreadyExist(commentary)
    {
      let bool = true;
      for (var i = 0; i < this.commentaries.length; i += 1)
      {
        if (commentary._id === this.commentaries[i].id)
        {
          bool = false;
          this.commentaries[i].checked = true;
        }
      }
      return bool;
    }

    addNewCommentary(commentary)
    {
      this.promiseUser =
      this.api.get<User>("users", commentary.author).then(author => {
        let bool = this.verificationCommentaryDeleteOrAlreadyExist(commentary);
        if (bool)
        {
          this.currentsize += 1;
          this.SizeListCommentToCheckForDelete -= 1;
            this.generateNewCommentary(author, commentary);
        }
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
    }

    addNewCommentaryScroll(commentary)
    {
      this.promiseUser =
      this.api.get<User>("users", commentary.author).then(author => {
        let bool = this.verificationCommentaryDeleteOrAlreadyExist(commentary);
        if (bool)
        {
            this.currentsize += 1;
            this.generateNewCommentary(author, commentary);
          // TODO:
          //too many sort, have to be optimize
          this.sortCommentaries();
        }
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
    }

    sortCommentaries(): void
    {
      this.commentaries.sort((a, b) => {
        return (new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime());
      });
    }

  ngOnInit() {
    this.commentaries = [];
    this.userSbuscription = this.auth.user.subscribe(user => {
      this.currentUser = user;
    this.commentariesSub = this.api.watch<ImageCommentary>("image-commentaries", {
      query: {
        $limit: 5,
        imageId: this.IdImage,
        $sort: {
          createdAt: -1
        }
      }
    }).subscribe((res) => {
      this.maxElementDisplay = res.total;
      this.SizeListCommentToCheckForDelete = 5;
      res.data.forEach(
        commentary => {
          this.addNewCommentary(commentary);
        });
        if (this.promiseUser)
          this.promiseUser.then( res => {this.deleteOldCommentary();})
      }, err => {
      console.error(err);
      this.snotifyService.error((<Error>err).message, (<Error>err).name,
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true,
       });
    });
  });
  }

  ngOnDestroy()
  {
    this.userSbuscription.unsubscribe();
  }

  Send()
  {
    if (!this.MyCommentary)
    {
      this.snotifyService.error("No text in comment", "Error",
        {
          timeout: 4000,
          showProgressBar: false,
          pauseOnHover: true,
       });
      return;
    }
      this.api.create<ImageCommentary>("image-commentaries",
      new ImageCommentary(this.currentUser._id, this.IdImage, this.MyCommentary))
      .then(res => {this.MyCommentary = "";})
      .catch(err => {
        console.error(err);
        this.snotifyService.error((<Error>err).message, (<Error>err).name,
          {
            timeout: 4000,
            showProgressBar: false,
            pauseOnHover: true,
         });
      });
  }

  moreCommentaries() {
      this.api.find<ImageCommentary>('image-commentaries',
      { query: {
              $limit: 5,
              imageId: this.IdImage,
              $sort: {
                createdAt: -1
              },
              $skip: this.currentsize
            } })
        .then(
          more => {
            more.data.forEach(
              commentary => {
                this.addNewCommentaryScroll(commentary);
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

  onScrollEvent($event)
  {
    //"move"
    var element = document.getElementById('commentaries');
    if (element.scrollHeight - element.scrollTop === element.clientHeight)
    {
      {
        if (this.currentsize < this.maxElementDisplay) {
          this.moreCommentaries();
         }
       }
  }
}

  delete(id : string): void
  {
    this.api.remove<ImageCommentary>("image-commentaries", id)
    .catch(err => {
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
