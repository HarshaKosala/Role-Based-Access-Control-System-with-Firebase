import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";
import { moveIn, fallIn, moveInLeft } from "../router.animations";
import * as firebase from "firebase/app";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireList } from "angularfire2/database";
import { AuthService } from "../auth.service";
import { User } from "../user";
// MDB Angular Free
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { ModalDirective } from "angular-bootstrap-md";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: { "[@moveIn]": "" }
})
export class UsersComponent implements OnInit {
  // @ViewChild('frame') private frame: ModalDirective;
  name: Observable<firebase.User>;
  state: string;
  detail: AngularFireList<any>;
  user: User;

  constructor(
    public angularfireauth: AngularFireAuth,
    public route: Router,
    public afd: AngularFireDatabase,
    public afs: AuthService
  ) {
    //alert(angularfireauth.auth.currentUser);
    // if(angularfireauth.authState){
    //   this.name = angularfireauth.auth.currentUser;
    // }

    // this.angularfireauth.authState.subscribe(
    //   (auth) =>{
    //     if(auth!=null){
    //       this.name = angularfireauth.authState;
    //     }
    //   }
    // )
    this.name = angularfireauth.authState;
    // console.log(this.name);

    //
  }

  detailList;
  ngOnInit() {
    this.afs.$user.subscribe(user => {
      this.user = user;
      // console.log(this.user);
    });

    this.detail = this.afd.list("pages");
    // console.log(this.afd.list('pages'));
    // this.detail.push({Title : "GitHub", Description : "github page", URL: "https://github.com/"});
    // this.detail.push({Title : "Linkein", Description : "github page", URL: "https://github.com/"});
    this.detailList = [];
    this.detail.snapshotChanges().subscribe(item => {
      item.forEach(element => {
        var data = element.payload.toJSON();
        this.detailList.push(data);
      });
    });
  }

  // logout(){
  //   this.afs.logOut().then(
  //     (success) => {
  //       this.route.navigateByUrl('/login');
  //     }
  //   )

  // }
}
