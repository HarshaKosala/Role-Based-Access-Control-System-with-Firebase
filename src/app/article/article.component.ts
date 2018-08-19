import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {Article} from '../articles';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {PageEvent} from '@angular/material';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import {User} from '../user';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  data : Article[];
  showData : Article[];
  src = 'https://mdbootstrap.com/img/Photos/Others/laptop-sm.jpg';
  term: string;
  p: number = 1;
  user : User;
  constructor(private as: AuthService) {
    this.as.afs.firestore.settings({ timestampsInSnapshots: true });
   }

  ngOnInit() {
    console.log('article');
    this.as.$user.subscribe(user =>{
      if(user){
        this.user = user;
        this.getArtcles();
      }
      
      
    })
    
  }

  
  getArtcles(){
    const collection: AngularFirestoreCollection<Article> = this.as.afs.collection('articles');
    const collection$: Observable<Article[]> = collection.valueChanges();
    this.data = [];
    collection$.subscribe(data => {
      this.data = data;
      // this.showData = data.slice(0,5);
      // console.log(this.data);

    } )
  }

  // pageChanged(event: PageChangedEvent): void {
  //   const startItem = (event.page - 1) * event.itemsPerPage;
  //   const endItem = event.page * event.itemsPerPage;
  //   this.showData = this.data.slice(startItem, endItem);
  // }

  deleteArticle(articleName: string){
    const userRef : AngularFirestoreDocument<any> = this.as.afs.doc(`articles/${articleName}`);
    userRef.delete();
  }
}
