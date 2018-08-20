import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {moveIn, fallIn, moveInLeft} from '../router.animations';
import * as firebase from 'firebase/app';
import {NgForm} from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import {AngularFireList} from 'angularfire2/database'
import {AuthService} from '../auth.service';
import {User} from '../user';
// MDB Angular Free
import { ModalDirective } from 'angular-bootstrap-md';
import {Profile} from '../profile';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  // host: {'[@moveIn]': ''}
})
export class AccountComponent implements OnInit {
  @ViewChild('frame') basicModal: ModalDirective;

  name: Observable<firebase.User>;
  userName: string;
  detail: AngularFireList<any>;
  user : User;
  profile : Profile;
  constructor(public angularfireauth: AngularFireAuth,
              public route: Router,
              public afd: AngularFireDatabase,
              public as: AuthService) { 
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
                // angularfireauth.authState.subscribe(user =>{
                //   this.state = user.displayName;
                //   console.log(this.state);
                // });
                
                
  }

  ngAfterViewInit() {
    this.as.$user.subscribe(user => {
      this.user=user;
      
      if(user){        
        this.userName = user.displayName;
        // console.log(user.displayName);
        // console.log('ngAfter  >>>  '+this.userName);
        this.as.afs.doc<Profile>(`profiles/${this.user.displayName}`).valueChanges()
        .subscribe(profile =>{
          if(!profile){
            this.basicModal.show();
          }else{
            this.profile = profile;
          }
        })
      }
      
    });

    
    
  }

  // detailList;            
  ngOnInit() {
    // console.log('account');
    

    // this.detail = this.afd.list('pages');
    // // console.log(this.afd.list('pages'));
    // // this.detail.push({Title : "GitHub", Description : "github page", URL: "https://github.com/"});
    // // this.detail.push({Title : "Linkein", Description : "github page", URL: "https://github.com/"});
    // this.detailList = [];
    // this.detail.snapshotChanges().subscribe(item =>{
    //   item.forEach(element => {
    //     var data = element.payload.toJSON();
    //     this.detailList.push(data);
    //   });
      
    // })
  }

  hideFrame(){
    this.basicModal.hide();
  }

}
