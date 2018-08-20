import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../auth.service";
import { User } from "../user";
import { Router } from "@angular/router";
import { Article } from "../articles";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs";
import { PageEvent } from "@angular/material";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ModalDirective } from "angular-bootstrap-md";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  @ViewChild("frame")
  basicModal: ModalDirective;
  user: User;
  constructor(public route: Router, public afs: AuthService) {}

  ngOnInit() {
    this.getArtcles();
    // console.log("home");
    this.afs.$user.subscribe(user => {
      this.user = user;
      // console.log(this.user);
    });
  }
  firstArticle: Article;
  data: Article[];
  getArtcles() {
    const collection: AngularFirestoreCollection<
      Article
    > = this.afs.afs.collection("articles");
    const collection$: Observable<Article[]> = collection.valueChanges();
    collection$.subscribe(data => {
      // this.data = data;
      // // this.showData = data.slice(0,5);
      this.data = [];

      // data.forEach(element => {
      //   if (element.imgURL) {
      //     this.data.push(element as Article);
      //   }
      // });

      this.data = data.filter(c => c.imgURL != "");
      if (this.data.length > 0) {
        // console.log(this.data);
        this.firstArticle = this.data[2];
        this.firstArticle.article = this.firstArticle.article
          .slice(0, 240)
          .concat("..");
        this.data = this.data.filter(
          c => c.articleName != this.firstArticle.articleName
        );
      } else {
        this.firstArticle = {
          article: `The modern Olympic Games or Olympics (French: Jeux olympiques[1][2]) are leading international sporting events featuring summer and winter sports competitions in which thousands of athletes from around the world participate in a variety of competitions. The Olympic Games are considered the world's foremost sports competition with more than 200 nations participating.[3] The Olympic Games are held every four years, with the Summer and Winter Games alternating by occurring every four years but two years apart.`,
          articleName: "Olympic Games",
          imgURL:
            "https://www.l-tron.com/wp-content/uploads/2016/06/rio-de-janeiro-2016-summer-olympics-e1467812135773.png",
          readMoreURL: "https://en.wikipedia.org/wiki/Olympic_Games",
          releaseDate: "18/8/2018",
          writerName: "kamal Nanayakkara"
        };
      }
    });
  }
  popUp() {
    if (this.user) {
      this.route.navigate(["/Article"]);
    } else {
      this.basicModal.show();
    }
  }
}
