import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FileService } from '../../services/file.service';
import {Image, User, Notification} from '../../models/theWall';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {ISearchQuery, Query} from '../../models/feathers';
import {query} from '@angular/animations';
import {FiltersService} from '../../services/filters.service';
import {GalleryComponent} from "../../components/gallery/gallery.component";

class NotificationFront {
  id: string;
  authorData: User;
  receiverData: User;
  imageData: Image;
  read: boolean;
}

class UserFront {
  username: String;
  id: String;
  image: String;
  nbImages: Number;
  selected: boolean;
}

const defaultImgQuery: any = {
  path: { $ne:"default.png"},
  $select: ["_id", "name", "author", "about", "createdAt", "path", "tags"],
  $limit: 15,
  $sort: {
    createdAt: -1
  }
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('gallery') gallery: GalleryComponent;

  ImgQuery = defaultImgQuery;
  settings  = false;
  filters = false;
  notifications = false;
  users: UserFront[] = [];
  currentUser: User;
  search: string;
  userFilter: string;
  subscribes: Subscription[] = [];
  notifData: NotificationFront[] = [];

  private userSub: Subscription;
  private notifSub: Subscription;

  constructor(private api: ApiService, private file: FileService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers({query : { $sort: { createdAt: -1 } }});
    this.auth.user.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSettingsClick() {
    this.settings = !this.settings;
  }

  onNotificationsClick() {
    this.notifications = !this.notifications;
    if (this.filters)
      this.filters = false;
    if (this.notifications) {
      this.loadNotifications( { query: { $sort: { createdAt: -1 }, read: false, receiver: this.currentUser._id}});
    }
  }

  onFiltersClick() {
    this.filters = !this.filters;
    if (this.notifications) {
      this.notifications = false;
      this.api.patchMany("notifications", {read:true}, { query:{_id: {$in: this.notifData.map(n => n.id)}}});
    }
  }

  ngOnDestroy() {
  }

  logout() {
    this.auth.logOut(true);
  }

  userOption() {
    this.router.navigate(['/user-options/' + this.currentUser._id]);
  }

  onFilterUserClick(user: UserFront) {
    this.users.forEach(u => u.selected=false);
    if (this.ImgQuery.author === user.id) {
      user.selected = false;
      this.ImgQuery = { ...this.ImgQuery, author: undefined };
    } else {
      user.selected = true;
      this.ImgQuery = { ...this.ImgQuery, author: user.id };
    }
  }

  onSearchFilter() {
    this.ImgQuery = { ...this.ImgQuery, name: { $regex: this.search, $options: 'i' } };
  }

  filterUsers() {
    this.loadUsers({ query: { $sort: { createdAt: -1 }, email: { $regex: this.userFilter, $options: 'i' } } });
  }

  upload() {
    this.gallery.popUpUpload();
  }

  private loadNotifications(query: ISearchQuery)  {
    this.notifSub = this.api.watch<Notification>('notifications', query).subscribe((notification => {
      Promise.all(notification.data.map(notification => {
        return Promise.all([
          this.api.find<User>('users', {query:{_id:{ $in:[notification.authorId, notification.receiver]}}}),
          this.api.find<Image>('images', { query: { _id: notification.imageId, $select: ['_id', 'name'] } })
        ]).then(([users, image]) => { return { id: notification._id,
          authorData: users.data.find(u => u._id === notification.authorId),
          receiverData: users.data.find(u => u._id === notification.receiver),
          imageData: image.data[0], read: notification.read} })
      })).then(res => {
        this.notifData = res;
      });
    }))
  }



  private loadUsers(query: ISearchQuery) {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.subscribes) {
      this.subscribes.forEach(s => s.unsubscribe());
    }
    this.userSub = this.api.watch<User>('users', query).subscribe(users => {
      Promise.all(users.data.map(user => {
        const tmp = {username: user.email, id: user._id, image: '', nbImages: 0, selected: false};
        return this.api.getImage(user.picture).then(image => {
          tmp.image = image.uri;
          this.subscribes.push(this.api.watch('images', {query: { $limit: 0, author: user._id }})
            .subscribe(res => {
              //'Get images nb'
            tmp.nbImages = res.total;
          }));
          return tmp;
        });
      })).then(users => this.users = users)
        .catch(err => console.error(err));
    });
  }
}
