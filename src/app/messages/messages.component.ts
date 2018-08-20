import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { Message } from "../message";
import {
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"]
})
export class MessagesComponent implements OnInit {
  constructor(private as: AuthService) {}
  messages: Message[];
  ngOnInit() {
    this.as.$user.subscribe(user => {
      if (user) {
        const collectionSender: AngularFirestoreCollection<
          Message
        > = this.as.afs.collection("messages", ref =>
          ref.where("writerLoggedName", "==", user.displayName)
        );
        const collectionSender$: Observable<
          Message[]
        > = collectionSender.valueChanges();
        collectionSender$.subscribe(messages => {
          if (messages) {
            this.messages = messages;
            // console.log(this.messages);
          }
        });
      }
    });
  }
}
