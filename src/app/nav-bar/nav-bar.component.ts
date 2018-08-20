import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth.service";
import { User } from "../user";
import { Router } from "@angular/router";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { moveIn, fallIn, moveInLeft } from "../router.animations";
import * as firebase from "firebase/app";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireList } from "angularfire2/database";
import { Profile } from "../profile";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Subscription } from "rxjs";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"]
})
export class NavBarComponent implements OnInit, OnDestroy {
  user: User;
  profile: Profile;
  userSub: Subscription;
  profileSub: Subscription;

  constructor(public route: Router, public afs: AuthService) {}

  ngOnInit() {
    this.userSub = this.afs.$user.subscribe(user => {
      // console.log('navbar1');
      // console.log(this.user);
      this.user = user;
      if (user) {
        this.profileSub = this.afs.afs
          .doc<Profile>(`profiles/${this.user.displayName}`)
          .valueChanges()
          .subscribe(profile => {
            if (profile) {
              this.profile = profile;
              // console.log(this.profile);
            }
          });
      }
    });
  }
  // logOut(){
  //   console.log('logout');
  //   this.as.$user = Observable.of(null);
  //   this.as.logOut();
  // }
  ngOnDestroy() {
    // console.log("unsubscribe");
    this.userSub.unsubscribe();
    this.profileSub.unsubscribe();
  }
}
