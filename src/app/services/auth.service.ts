import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUser } from '../models/app-user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$: Observable<firebase.default.User | null>;


  constructor(private userService: UserService, private afAuth: AngularFireAuth, private route:ActivatedRoute) {
      this.user$! = afAuth.authState;
   }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    this.afAuth.signInWithRedirect(new firebase.default.auth.GoogleAuthProvider())
  }

  logout() {
    this.afAuth.signOut();
  }

  get AppUser$(): Observable<AppUser | null>{
    return this.user$
      .pipe(switchMap(user => this.userService.getUser(user!.uid).valueChanges()))
  }
}
