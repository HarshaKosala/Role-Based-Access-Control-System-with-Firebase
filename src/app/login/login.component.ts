import { Component, OnInit, HostBinding } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {moveIn} from '../router.animations';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import {User} from '../user';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [moveIn()],
  host: {'[@moveIn]': ''}
})
export class LoginComponent implements OnInit {
  user_ : Observable<User>;
  error: any;
  //user: Observable<firebase.User>
  constructor(public angularfireauth: AngularFireAuth,
              public route: Router,
              public afs: AngularFirestore) { 
                angularfireauth.authState.subscribe(user =>{
                  if(user !=null){
                    this.route.navigate(['/users']);
                  }
                });

                
                // this.user_ = angularfireauth.authState.switchMap(user => {
                  
                //   if(user){
                //     return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                //   }else{
                //     return Observable.of(null);
                //   }
                // })
                // console.log(this.user_);
              }

  ngOnInit() {
    console.log('login');
  }

  loginWithFB(){
    this.angularfireauth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then(
      (success) => {
        this.updateUser(success.user);
        this.route.navigate(['/users']);
      }).catch(
        (err) =>{
          this.error = err;
        })
  }

  loginWithGoogle(){
    this.angularfireauth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(
      (success) => {
        this.updateUser(success.user);
        this.route.navigate(['/users']);
      }).catch(
        (err) =>{
          this.error = err;
      })
  }

  updateUser(user){
    console.log(user);
    const userRef : AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid : user.uid,
      email : user.email,
      displayName : user.displayName,
      photoURL: user.photoURL,
      roles: {
        Subscriber: true,
        Admin: false,
        Editor: false
      }
    }
    return userRef.set(data, {merge: true});
  }

}
