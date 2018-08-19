import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import {environment} from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import {AuthService} from './auth.service';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {AuthGuard} from './auth.guard';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ArticleComponent } from './article/article.component';
import {AdminGuard} from './guards/admin.guard';
import {SubscriberGuard} from './guards/subscriber.guard';
import {EditorGuard} from './guards/editor.guard';
// import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { WriterComponent } from './writer/writer.component';
import { EditorComponent } from './editor/editor.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {DataTableModule} from "angular-6-datatable";
import {MatSelectModule} from '@angular/material/select';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { PaginationModule } from 'ngx-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { NgxEditorModule } from 'ngx-editor';
// import { QuillModule } from 'ngx-quill';
// import { ModalModule, WavesModule, InputsModule, ButtonsModule } from 'angular-bootstrap-md'
import {NgxPaginationModule} from 'ngx-pagination';
import { MessagesComponent } from './messages/messages.component'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    UsersComponent,
    NavBarComponent,
    HomeComponent,
    AdminComponent,
    ArticleComponent,
    WriterComponent,
    EditorComponent,
    AccountComponent,
    ProfileComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    RouterModule.forRoot(
      [
        
        {path: '', redirectTo:'home', pathMatch:'full'},
        {path: "signup", component: SignupComponent},
        {path:'login', component: LoginComponent},
        {path: 'login-email', component: EmailComponent},
        {path: 'users', component: AccountComponent, canActivate:[AuthGuard]},
        {path: 'home', component: HomeComponent},
        {path: 'Admin', component: AdminComponent, canActivate:[AdminGuard]},
        {path: 'Article', component: ArticleComponent, canActivate:[SubscriberGuard]},
        {path: 'Editor', component: EditorComponent, canActivate:[EditorGuard]},
        {path:'users/profile/:name', component: ProfileComponent, canActivate:[AuthGuard]},
        {path: 'users/profile', redirectTo: 'users'},
        { path: 'Article/Writer/:name', component: WriterComponent, canActivate:[AuthGuard] },
        { path: 'Article/Writer', component: WriterComponent, canActivate:[AuthGuard] },
        { path: 'users/Messages', component: MessagesComponent, canActivate:[AuthGuard] },
        { path: '**', redirectTo: 'login', pathMatch: 'full' }
      ]),
      // CommonModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot(),
      MDBBootstrapModule.forRoot(),
      BsDatepickerModule.forRoot(),
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatFormFieldModule,
      MatInputModule,
      DataTableModule,
      MatSelectModule,
      // NgxEditorModule,
      // QuillModule,
      // ModalModule.forRoot(),
      // WavesModule.forRoot(),
      // InputsModule.forRoot(),
      // ButtonsModule.forRoot()
      PaginationModule.forRoot(),
      Ng2SearchPipeModule,
      NgxPaginationModule
  ],
  providers: [AuthService, AdminGuard, SubscriberGuard, EditorGuard],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
