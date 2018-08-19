import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AngularFireAuth} from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public angularfireauth: AngularFireAuth,
    public route: Router, private toastr: ToastrService){

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.angularfireauth.authState
      .take(1)
      .map(authState => !!authState)
      .do(loggedIn => {
        if (!loggedIn) {
          this.toastr.warning('Please Login.', 'Access Denied');
          this.route.navigate(['/login']);
        }
    });
  }
}
