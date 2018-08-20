import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import "rxjs/add/operator/do";
import * as firebase from "firebase/app";
import { NgForm } from "@angular/forms";
import { AngularFireDatabase } from "angularfire2/database";
// import {AngularFireList} from 'angularfire2/database'
import { User } from "./user";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/of";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Profile } from "./profile";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  authUser: Observable<firebase.User>;
  $user: Observable<User>;
  userName: string;
  user: string;
  constructor(
    public angularfireauth: AngularFireAuth,
    public route: Router,
    public afs: AngularFirestore
  ) {
    this.authUser = angularfireauth.authState;
    // console.log('service');
    this.$user = angularfireauth.authState.switchMap(user => {
      if (user) {
        // console.log('user'+ user.uid);
        // this.userName = user.displayName;
        // console.log(this.userName);
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
  }

  signInWithEmailAndPassword(email, password) {
    return this.angularfireauth.auth.signInWithEmailAndPassword(
      email,
      password
    );
  }

  logOut() {
    this.angularfireauth.auth.signOut().then(success => {
      this.route.navigateByUrl("/login");
    });
  }
  // profile: Observable<Profile>;
  // getProfile(){
  //   this.$user.subscribe(user => {
  //     console.log('dgfsdg');
  //     return this.afs.doc<Profile>(`profiles/${user.displayName}`).valueChanges();
  //     // this.profile.subscribe(profile =>{
  //     //   if(profile){
  //     //     console.log('have');
  //     //   }else{
  //     //     console.log('not');
  //     //   }
  //     // })
  //   })
  // }
}
