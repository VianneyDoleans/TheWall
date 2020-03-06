import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/theWall';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;

  loginMod = true;
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onClickLogin() {
    this.loading = true;
    this.auth
      .logIn({strategy: 'local', email: this.email, password: this.password})
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        this.loading = false;
        console.error(err);
      });
  }


  onClickRegister() {
    this.loading = true;
    this.auth
      .signUp(new User(this.email, this.password, this.username))
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.loading = false;
      });
  }
}
