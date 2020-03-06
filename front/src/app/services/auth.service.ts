import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from "../models/theWall";
import { FeathersService } from "./feathers.service";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";

@Injectable()
export class AuthService {

  public user: Observable<User>;
  private auth = new EventEmitter<boolean>();

  constructor(private feathers: FeathersService,
              private api: ApiService,
              private router: Router) {
  }

  public logIn(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials)
      .then(res => this.getUserData(res.accessToken));
  }

  public signUp(userInfo:User): Promise<any> {
    return this.api.create("users", userInfo)
      .then(() => this.logIn({strategy:"local", email:userInfo.email, password:userInfo.password}));
  }

  public logOut(withRedirect = true) {
    this.feathers.logout();
    this.auth.next(false);
    if (withRedirect) {
      this.router.navigate(['/auth']);
    }
  }

  public isAuth(): Observable<boolean> {
    this.isAuthenticate();
    return this.auth.asObservable();
  }

  public isAuthenticate(): Promise<void> {
    return this.feathers.authenticate()
      .then( () => {
        if (!this.user) {
          return this.getUserData()
            .then(() => this.auth.next(true));
        } else {
          this.auth.next(true);
        }
      }).catch( (err) => {
        console.error(err);
        this.auth.next(false);
      });
  }

  public getJWT(): Promise<any> {
    return this.feathers.client().passport.getJWT();
  }

  private getUserData(token?: string): Promise<void> {
    const feathersClient = this.feathers.client();
    const jwt = token ? Promise.resolve(token) : feathersClient.passport.getJWT();

    return jwt.then(j => feathersClient.passport.verifyJWT(j)
      .then(payload => this.api.observe<User>('users', payload.userId))
      .then(user => {
        this.user = user;
        this.auth.next(true);
      })
    );
  }
}
