import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router, ActivatedRoute, Params} from '@angular/router';
import * as firebase from 'firebase/app';
import {NgForm, NgModel} from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import {AngularFireList} from 'angularfire2/database'
import {AuthService} from '../auth.service';
import {User} from '../user';
// MDB Angular Free
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalDirective } from 'angular-bootstrap-md';
import {Profile} from '../profile';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import { ToastrService } from 'ngx-toastr';
import { Article } from '../articles';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // @ViewChild('nameF') nameF: string;
  private sub: any;
  private name: string;
  prof: Profile;
  fullName: string;
  email: string;
  address: string;
  fb: string='';
  tweetter: string='';
  linkedin: string='';
  profile: string='';
  about: string='';

  loggedName: string;
  constructor(private route: ActivatedRoute, private router: Router, private as: AuthService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.name = params['name'];
      // console.log(this.name);
      this.as.$user.subscribe(user => {
        if(user){
          
          this.as.afs.doc<Profile>(`profiles/${user.displayName}`).valueChanges()
          .subscribe(profile =>{
            if(profile){
              if(this.name!=profile.name){
                this.router.navigate(['/users']);
              }
              this.prof = profile;
              // this.nameF = profile.name;
              // console.log(this.nameF);
              this.loggedName = profile.loggedName;
              this.fullName = profile.name;
              this.email = profile.email;
              this.address = profile.address;
              this.fb = profile.fbURL;
              this.tweetter = profile.tweeterURL;
              this.linkedin = profile.linkedInURL;
              this.profile = profile.profilePicURL;
              this.about = profile.about;
            }else{
              if(user.displayName != this.name){
                this.router.navigate(['/users']);
              }
            }
          });
        }
        
        
      });
    });
  }


  onSubmit(form : NgForm){
    console.log(form.value.fullName);
    this.addProfile(form.value);
    form.reset();
  }

  addProfile(propf){
    console.log(propf);
    if(this.prof){
      if(this.prof.name != propf.fullName){
        this.updateArticleWriterName(propf.fullName);
      }
      
      console.log('have profile');
      const userRef : AngularFirestoreDocument<any> = this.as.afs.doc(`profiles/${this.loggedName}`);
        const data: Profile = {
          loggedName : this.loggedName,
          name: propf.fullName,
          fbURL : propf.fb,
          tweeterURL : propf.tweetter,
          email: propf.email,
          linkedInURL  : propf.linkedin,
          address : propf.address,
          about: propf.about,
          profilePicURL : propf.profile,     
        }
        return userRef.set(data, {merge: true}).then(
          (success) =>{
            this.toastr.success('Profile Successfully Updated.', 'Profile');
            this.reset();
            this.router.navigate(['/users']);
          }
        ).catch(
          (err) =>{
            this.toastr.error(err, 'Error');
          }
        )
    }else{
        const userRef : AngularFirestoreDocument<any> = this.as.afs.doc(`profiles/${this.name}`);
        const data: Profile = {
          loggedName : this.name,
          name: propf.fullName,
          fbURL : propf.fb,
          tweeterURL : propf.tweetter,
          email: propf.email,
          linkedInURL  : propf.linkedin,
          address : propf.address,
          about: propf.about,
          profilePicURL : propf.profile,     
        }
        return userRef.set(data, {merge: true}).then(
          (success) =>{
            this.toastr.success('Profile Successfully Created.', 'Profile');
          }
        ).catch(
          (err) =>{
            this.toastr.error(err, 'Error');
          }
        )
    }

  }

  reset(){
    this.profile='';
    this.about='';
    this.address='';
    this.email='';
    this.fb='';
    this.linkedin='';
    this.tweetter='';
    this.fullName='';

  }

  updateArticleWriterName(profName: string){
    const collection: AngularFirestoreCollection<Article> = this.as.afs.collection('articles', ref => ref.where('writerName','==',this.prof.name));
    const collection$: Observable<Article[]> = collection.valueChanges();
    collection$.subscribe(articles =>{
      articles.forEach(element => {
        console.log(element.article);
        const userRef : AngularFirestoreDocument<any> = this.as.afs.doc(`articles/${element.articleName}`);
        const data: Article = {
             writerName : profName,
             articleName: element.articleName,
             releaseDate: element.releaseDate,
             imgURL: element.imgURL,
             readMoreURL: element.readMoreURL,
             article: element.article
        }
        return userRef.set(data, {merge: true});
      });
    })
  }
}
