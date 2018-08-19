import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import {AuthService} from '../auth.service';
import { ToastrService } from 'ngx-toastr';
// import { isAdmin } from '@firebase/util';

@Injectable({
  providedIn: 'root'
})
export class SubscriberGuard implements CanActivate {
  constructor(private afs: AuthService, private toastr: ToastrService){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.afs.$user.pipe(
      take(1),
      map(user => (user && user.roles.Subscriber ? true : false)),
      tap(canView => {
        if(!canView){
          console.log('Access denied - only Subscribers allowed');
          this.toastr.warning('Only Subscribers are Allowed.', 'Access Denied');
        }   
      })
    ) 
  }
}
