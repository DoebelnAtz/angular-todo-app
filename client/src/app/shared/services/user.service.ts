import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import  firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import AuthProvider = firebase.auth.AuthProvider;

@Injectable({
  providedIn: 'root'
})
export class UserService {
	user: any;
  constructor(
  		public afs: AngularFirestore,
		public afAuth: AngularFireAuth,
		public router: Router,
		public ngZone: NgZone

  ) {
	this.afAuth.authState.subscribe(user => {
		if (user) {
			this.user = user;
			localStorage.setItem('user', JSON.stringify(this.user));
		} else {
			localStorage.setItem('user', '{}')
		}
	})
  }

	GoogleAuth() {
		return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
	}

	// Auth logic to run auth providers
	AuthLogin(provider: AuthProvider) {
		return this.afAuth.signInWithPopup(provider)
			.then((result) => {
				this.ngZone.run(() => {
					this.router.navigate(['/']);
				})
			}).catch((error) => {
				window.alert(error)
			})
	}

	Logout() {
  		this.afAuth.signOut().then(() => {
  			this.router.navigate(['/'])
		})
	}
}
