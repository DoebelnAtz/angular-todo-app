import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class UserService extends ApiService {
	user: any;
	constructor(
		public afs: AngularFirestore,
		public afAuth: AngularFireAuth,
		public router: Router,
		public ngZone: NgZone
	) {
		super();
		this.afAuth.authState.subscribe((user) => {
			if (user) {
				this.user = user;
				localStorage.setItem('user', JSON.stringify(this.user));
				this.PatchUser();
			} else {
				localStorage.setItem('user', '{}');
			}
		});
	}

	async PatchUser() {
		this.api.patch('/users', this.user).then((u) => console.log(u));
	}

	async GoogleAuth() {
		return await this.AuthLogin(new firebase.auth.GoogleAuthProvider());
	}

	async AnonymousAuth() {
		return this.afAuth
			.signInAnonymously()
			.then((res) => {
				console.log(res);
				this.router.navigate(['/']);
			})
			.catch((error: ErrorEvent) => {});
	}

	// Auth logic to run auth providers
	AuthLogin(provider: AuthProvider) {
		return this.afAuth
			.signInWithPopup(provider)
			.then((result) => {
				console.log(result);
				this.ngZone.run(() => {
					this.router.navigate(['/']);
				});
			})
			.catch((error) => {
				window.alert(error);
			});
	}

	Logout() {
		this.afAuth.signOut().then(() => {
			this.router.navigate(['/']);
		});
	}

	get isLoggedIn(): boolean {
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		return user !== '{}' && (user.emailVerified || user.isAnonymous);
	}
}
