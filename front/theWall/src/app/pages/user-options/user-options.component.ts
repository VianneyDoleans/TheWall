import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { ApiService } from "../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Subscription } from "rxjs";
import { ImageFile, User } from "../../models/theWall";
import { FileService } from "../../services/file.service";
import {AuthService} from "../../services/auth.service";
import {DialogService} from "../../services/dialog.service";
import {
  UserOptionsDialogComponent,
  UserOptionsDialogData
} from "../../components/user-options-dialog/user-options-dialog.component";

type Mode = 'User' | 'Admin';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent implements OnInit, OnDestroy {

  mode: Mode = 'User';
  ready: boolean = false;
  user: User;
  userImage: ImageFile;
  userImageLoading = false;
  confirmPassword: string;
  error: string;
  success: string;

  usersList: User[];

  private userId: string;
  private currentUserId: string;
  private userListTotal: number;
  private currentUserSub: Subscription;
  private paramsSub: Subscription;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private file: FileService,
    private dialog: DialogService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentUserSub = this.auth.user.subscribe(u => this.currentUserId = u._id);
    this.paramsSub = this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.loadUserInfo();
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  isCurrentUser() {
    return this.currentUserId === this.userId;
  }

  changeImage(e, upload) {
    e.preventDefault();
    upload.click();
  }

  saveImage(e) {
    this.userImageLoading = true;
    this.file.sendImage(e.target.files[0], 'user', this.userId)
      .then((res) => {
        this.userImage = res;
        this.userImageLoading = false;
      }).catch(err => {
        console.error(err);
      });
  }

  return() {
    this.router.navigate(['/home']);
  }

  save() {
    const userData = {
      email: this.user.email,
      about: this.user.about
    };

    if (!(this.confirmPassword === this.user.password)) {
      this.setMessage('error', 'The passwords are different');
      return;
    }
    if (this.user.password) {
      userData['password'] = this.user.password;
    }
    this.api.patch('users', this.userId, userData)
      .then(() => this.setMessage('success', 'Your profile is saved'))
      .catch(err => {
        this.setMessage('error', 'Something went wrong with the saved of your profile...');
        console.warn(err);
      });
  }

  changeMode(mode: Mode) {
    this.mode = mode;
    if (this.mode === 'Admin') {
      this.listUsers();
    }
  }

  changeUser(user: User) {
    this.dialog.openDialog(UserOptionsDialogComponent, new UserOptionsDialogData(user, false));
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (this.usersList.length < this.userListTotal) {
        this.moreUsers();
      }
    }
  }

  moreUsers() {
      this.api.find<User>('users', { query: { $limit: 20, _id: { $nin: [this.userId] }, $skip: this.usersList.length } })
        .then(more => this.usersList = this.usersList.concat(more.data));
  }

  removeUser(userId: string) {
    this.dialog.openBooleanDialog('This user will be removed')
      .then(res => {
        if (res) {
          this.api.remove('users', userId)
            .then(() => this.usersList.splice(this.usersList.findIndex(u => u._id === userId), 1));
        }
      })
  }

  private listUsers() {
    this.api.find<User>('users', { query: { $limit: 20, _id: { $nin: [this.userId] } } })
      .then(users => {
        this.usersList = users.data;
        this.userListTotal = users.total;
        console.log('Users list : ', this.usersList);
      });
  }

  private setMessage(type: 'error' | 'success', msg: string) {
    const other = type === 'error' ? 'success' :  'error';

    this[type] = msg;
    this[other] = undefined;
  }

  private loadUserInfo() {
    return this.api.get<User>('users', this.userId)
      .then(user => this.user = user)
      .then(() => console.log('USER : ', this.user))
      .then(() => this.api.getImage(this.user.picture))
      .then(image => this.userImage = image)
      .then(() => this.ready = true);
  }

}
