import { Component, OnInit } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {moveIn, fallIn} from '../router.animations';
import * as firebase from 'firebase/app';
import {NgForm} from '@angular/forms';
import {User} from '../user';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [moveIn(), fallIn()],
  // host: {'[@moveIn]': ''}
})
export class SignupComponent implements OnInit {
  error: string;
  state: string;
  //user: Observable
  user_ : Observable<User>;

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
    console.log('signup');
    const collection: AngularFirestoreCollection<any> = this.afs.collection('items');
  }

  onSubmit(form : NgForm){
    if(form.valid){
      this.name = form.value.name;
      this.angularfireauth.auth.createUserWithEmailAndPassword(form.value.email, form.value.password)
      .then(
        (success) => {
          this.updateUser(success.user);
          this.route.navigateByUrl('/login');
          
        }).catch(
          (err) =>{
            this.error = err;
        }
      )
    }
  }
 
  name : string;
  updateUser(user){
    console.log(user);
    const userRef : AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid : user.uid,
      email : user.email,
      displayName : this.name,
      roles: {
        Subscriber: true,
        Admin: false,
        Editor: false
      }
    }
    return userRef.set(data, {merge: true});
  }
}
