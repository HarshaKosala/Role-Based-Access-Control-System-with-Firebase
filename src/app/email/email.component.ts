import { Component, OnInit } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {moveIn, fallIn} from '../router.animations';
import * as firebase from 'firebase/app';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  // animations: [moveIn(), fallIn()],
  // host: {'[@moveIn]': ''}
})
export class EmailComponent implements OnInit {
  error: string;
  user : Observable<any>;
  constructor(public angularfireauth: AngularFireAuth,
    public route: Router,
    private afs : AuthService) { 
      // console.log(angularfireauth.authState);
      // if(angularfireauth.authState){
      //   this.route.navigateByUrl('/users');
      // }
    }

  ngOnInit() {
    console.log('email');
  }

  onSubmit(form : NgForm){
    if(form.valid){
      this.afs.signInWithEmailAndPassword(form.value.email, form.value.password)
      .then(
        (success) => {
          this.route.navigate(['/users']);
      }).catch(
        (err) =>{
          this.error = err;
        }
      )
    }
  }
}
