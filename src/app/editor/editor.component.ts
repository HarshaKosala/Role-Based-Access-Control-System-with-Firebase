import { Component, OnInit , ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {Article} from '../articles';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import { DatePipe } from '@angular/common';
import {Profile} from '../profile';
import {User} from '../user';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router'
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [DatePipe]
})
export class EditorComponent implements OnInit {
  @ViewChild('frame') basicModal: ModalDirective;
  releaseDate: Date = new Date();
  userName: string;
  user : User;
  // releaseDate = new Date();
  // htmlContent = '';
  // editorConfig = {
  //   editable: true,
  //   spellcheck: false,
  //   height: '10rem',
  //   minHeight: '5rem',
  //   placeholder: 'Type something. Test the Editor... ヽ(^。^)丿',
  //   translate: 'no'
  // };
  constructor(private as: AuthService,
    private datePipe: DatePipe, private toastr: ToastrService, private route: Router) { }
  
  enablesubmit : boolean = false;
  profileName: string;
  ngOnInit() {
    console.log('editor');
    this.as.$user.subscribe(user => {
      this.user=user;
      this.userName = this.user.displayName;
      // console.log(this.user.displayName);
      // console.log('ngAfter  >>>  '+this.userName);
      this.as.afs.doc<Profile>(`profiles/${this.user.displayName}`).valueChanges()
      .subscribe(profile =>{
      if(profile){
        this.profileName = profile.name;
        this.enablesubmit = true;
        console.log(this.enablesubmit);
      }
    })
    });
  }

  onSubmit(form : NgForm){
    if(this.enablesubmit==false){
      this.basicModal.show();
    }else{
      console.log(form.value);
      this.addArticle(form.value);
    }
    form.reset();
    // this.ngOnInit();
    
  }

  addArticle(article){
    const userRef : AngularFirestoreDocument<any> = this.as.afs.doc(`articles/${article.articleName}`);
    const data: Article = {
      writerName : this.profileName,
      articleName : article.articleName,
      imgURL: article.imgURL,
      readMoreURL: article.readMoreURL,
      article : article.article,
      releaseDate: this.datePipe.transform(article.releaseDate, 'dd/MM/yyyy')
    }
    return userRef.set(data, {merge: true}).then(
      (success) =>{
        this.toastr.success('Article Successfully Added.', 'Article');
        this.route.navigate(['/Article']);
      }
    ).catch(
      (err) =>{
        this.toastr.error(err, 'Error');
      }
    )
  }

  func(event){
    console.log(event.target);
  }
}
