import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';
import { take, tap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EditorGuard implements CanActivate {
  constructor(private afs: AuthService, private toastr: ToastrService, private router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.afs.$user.pipe(
      take(1),
      map(user => user && user.roles.Editor ? true : false),
      tap(isAdmin => {
        if(!isAdmin){
          console.error('Access denies - only admin allowed');
          // alert('Access denied - only Admin allowed.')
          this.toastr.warning('Only Editors are Allowed.', 'Access Denied');
          // this.router.navigateByUrl("/");
        }   
      })
    )
  }
}
