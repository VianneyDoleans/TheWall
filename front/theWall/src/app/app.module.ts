import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EnvServiceProvider } from './services/env.service.provider';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error404/error404.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FeathersService } from "./services/feathers.service";
import { ApiService } from "./services/api.service";
import { FormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from "./app.material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FileService } from "./services/file.service";
import { AuthService } from "./services/auth.service";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { PictureDialogComponent } from "./components/picture-dialog/picture-dialog.component"
import { UploadPicturePopUpComponent } from "./components/upload-picture-pop-up/upload-picture-pop-up.component";
import { MatDialogModule } from "@angular/material";
import { FloatingButtonComponent } from "./components/floating-button/floating-button.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { AuthGuard } from "./guards/auth.guard";
import { UserOptionsComponent } from "./pages/user-options/user-options.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { BooleanDialogComponent } from "./components/boolean-dialog/boolean-dialog.component";
import { DialogService } from "./services/dialog.service";
import { UserOptionsDialogComponent } from "./components/user-options-dialog/user-options-dialog.component";
import { CommentariesComponent } from "./components/commentaries/commentaries.component";
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';


@NgModule({
  entryComponents: [
    BooleanDialogComponent,
    UserOptionsDialogComponent,
    PictureDialogComponent,
    UploadPicturePopUpComponent,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    Error404Component,
    HeaderComponent,
    FooterComponent,
    GalleryComponent,
    PictureDialogComponent,
    UploadPicturePopUpComponent,
    FooterComponent,
    UserOptionsComponent,
    LoadingComponent,
    AuthComponent,
    FloatingButtonComponent,
    BooleanDialogComponent,
    UserOptionsDialogComponent,
    CommentariesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    MaterialModule,
    MatDialogModule,
    BrowserAnimationsModule,
    BrowserModule,
    SnotifyModule
  ],
  providers: [
    FeathersService,
    ApiService,
    AuthService,
    FileService,
    AuthGuard,
    DialogService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    EnvServiceProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
