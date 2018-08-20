import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {Article} from '../articles';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import { DatePipe } from '@angular/common';
import {MatPaginator, MatSort, MatTableDataSource, MatSortable} from '@angular/material';
import {Observable} from 'rxjs';
import {User} from '../user';
import { ToastrService } from 'ngx-toastr';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
// const COLORS: string[] = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//   'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DatePipe]
})
export class AdminComponent implements OnInit {

  releaseDate = new Date();
  // constructor(private as: AuthService,
  //   private datePipe: DatePipe) { }

  // ngOnInit() {
  // }

  // onSubmit(form : NgForm){
  //   console.log(form.value);
  //   this.addArticle(form.value);
  //   form.reset();
  // }

  // addArticle(article){
  //   const userRef : AngularFirestoreDocument<any> = this.as.afs.doc(`articles/${article.articleName}`);
  //   const data: Article = {
  //     writerName : article.name,
  //     articleName : article.articleName,
  //     imgURL: article.imgURL,
  //     readMoreURL: article.readMoreURL,
  //     article : article.article,
  //     releaseDate: this.datePipe.transform(article.releaseDate, 'dd/MM/yyyy')
  //   }
  //   return userRef.set(data, {merge: true});
  // }

  displayedColumns: string[] = ['displayName', 'Subscriber', 'Editor', 'Admin', 'Save'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private as: AuthService,private toastr: ToastrService ) {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
    this.as.$user.subscribe(
      user => {this.user=user;
        this.getUsers();}); 
    
    
    // console.log(this.users);
  }

  user: User;
  ngOnInit() {
     
  }
  users : User[];

  getUsers(){
    const collection: AngularFirestoreCollection<User> = this.as.afs.collection('users');
    const collection$: Observable<User[]> = collection.valueChanges();
    this.users = [];
    collection$.subscribe(data => {
      this.users = data;
      // console.log(this.users);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } )
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  activate : boolean = false;
  activateButton(){
    this.activate = true;
  }

  trueVal: boolean = true;
  falseVal: boolean = false;
  updateRoles(row){
    // console.log(row);
    const userRef : AngularFirestoreDocument<any> = this.as.afs.doc(`users/${row.uid}`);
    const data: User = {
      uid : row.uid,
      email : row.email,
      displayName : row.displayName,
      // photoURL: row.photoURL,
      roles: {
        Subscriber: row.roles.Subscriber,
        Admin: row.roles.Admin,
        Editor: row.roles.Editor
      }
    }
    return userRef.set(data, {merge: true}).then(
      (success) =>{
        this.toastr.success('Role Changed.', 'Changes Saved.');
      }
    ).catch(
      (err) =>{
        this.toastr.success('Role Changed.', 'Error');
      }
    )
  }
}

/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//   };

// }
