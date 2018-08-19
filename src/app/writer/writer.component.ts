import { Component, OnInit } from "@angular/core";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { Router, ActivatedRoute, Params } from "@angular/router";
import * as firebase from "firebase/app";
import { NgForm, NgModel } from "@angular/forms";
import { Observable } from "rxjs";
// import { AngularFireDatabase } from 'angularfire2/database';
// import {AngularFireList} from 'angularfire2/database'
import { AuthService } from "../auth.service";
import { User } from "../user";
// MDB Angular Free
// import { MDBBootstrapModule } from 'angular-bootstrap-md';
// import { ModalDirective } from 'angular-bootstrap-md';
import { Profile } from "../profile";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { ToastrService } from "ngx-toastr";
import { Message } from "../message";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-writer",
  templateUrl: "./writer.component.html",
  styleUrls: ["./writer.component.scss"]
})
export class WriterComponent implements OnInit {
  name: string;
  message: string = "";
  constructor(
    private route: ActivatedRoute,
    private as: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  prof: Profile;
  user: User;
  senderProf: Profile;
  ngOnInit() {
    this.as.$user.subscribe(user => {
      if (user) {
        this.user = user;
        const collectionSender: AngularFirestoreCollection<
          Profile
        > = this.as.afs.collection("profiles", ref =>
          ref.where("loggedName", "==", this.user.displayName)
        );
        const collectionSender$: Observable<
          Profile[]
        > = collectionSender.valueChanges();
        collectionSender$.subscribe(profile => {
          if (profile.length != 0) {
            this.senderProf = profile[0];
            console.log(this.senderProf);
          }
        });
      }
    });
    this.route.params.subscribe((params: Params) => {
      this.name = params["name"];
      console.log(this.name);

      const collection: AngularFirestoreCollection<
        Profile
      > = this.as.afs.collection("profiles", ref =>
        ref.where("name", "==", this.name)
      );
      const collection$: Observable<Profile[]> = collection.valueChanges();
      collection$.subscribe(profile => {
        if (profile.length == 0) {
          this.router.navigate(["/Article"]);
        } else {
          this.prof = profile[0];
          console.log(this.prof);
        }
      });

      // this.as.afs.doc<Profile>(`profiles/${user.displayName}`).valueChanges()
      // .subscribe(profile =>{
      //   console.log(profile.name+'..'+ this.name);
      //   if(this.name != profile.name){
      //     this.router.navigate(['/Article']);
      //   }else{
      //     this.prof = profile;
      //     console.log(this.prof.tweeterURL);
      //   }
      // });
    });
  }

  onSubmit(mess: NgModel) {
    if (!this.senderProf.profilePicURL) {
      this.senderProf.profilePicURL =
        "https://mdbootstrap.com/img/Photos/Avatars/avatar-6.jpg";
    }
    console.log(mess.value);
    const userRef: AngularFirestoreDocument<any> = this.as.afs.doc(
      `messages/${new Date()}`
    );
    const data: Message = {
      senderName: this.user.displayName,
      senderImg: this.senderProf.profilePicURL,
      writer: this.name,
      writerLoggedName: this.prof.loggedName,
      message: mess.value,
      date: new DatePipe("en-US").transform(new Date(), "dd/MM/yyyy")
    };
    return userRef
      .set(data, { merge: true })
      .then(success => {
        this.message = "";
        this.toastr.success("Message Sent Successfully.", "Message");
      })
      .catch(err => {
        this.toastr.error(err, "Error");
      });
  }
}
