import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { distinctUntilChanged } from 'rxjs/operators';
import UserInfo = firebase.UserInfo;

@Injectable({
	providedIn: 'root',
})
export class UserService extends ApiService {
	public user: Observable<User>;
	public uid: string | undefined;
	constructor(
		public afs: AngularFirestore,
		public afAuth: AngularFireAuth,
		public router: Router,
		public ngZone: NgZone,
		http: HttpClient
	) {
		super(http);
		this.user = new Observable<User>((observer) => {
			this.afAuth.authState.subscribe((user) => {
				if (user) {
					let userObj = {
						uid: user.uid,
						isAnonymous: user.isAnonymous,
					};
					observer.next(userObj);
					this.uid = user.uid;
					localStorage.setItem('user', JSON.stringify(user));
				} else {
					observer.next({} as User);
					localStorage.setItem('user', '{}');
				}
			});
		});
	}

	async PatchUser(user: User) {
		return this.patch('/users', user).toPromise();
	}

	async GoogleAuth() {
		return await this.AuthLogin(new firebase.auth.GoogleAuthProvider());
	}

	async AnonymousAuth() {
		return this.afAuth
			.signInAnonymously()
			.then((res) => {
				console.log(res);
				if (res.user) {
					localStorage.setItem('user', JSON.stringify(res.user));

					let userObj = {
						uid: res.user.uid,
						isAnonymous: res.user.isAnonymous,
					};
					this.PatchUser(userObj).then(() => {
						this.ngZone.run(() => {
							this.router.navigate(['/']);
						});
					});
				}
			})
			.catch((error: ErrorEvent) => {});
	}

	// Auth logic to run auth providers
	AuthLogin(provider: AuthProvider) {
		return this.afAuth
			.signInWithPopup(provider)
			.then((res) => {
				console.log(res);
				if (res.user) {
					localStorage.setItem('user', JSON.stringify(res.user));

					let userObj = {
						uid: res.user.uid,
						isAnonymous: res.user.isAnonymous,
					};
					this.PatchUser(userObj).then(() => {
						this.ngZone.run(() => {
							this.router.navigate(['/']);
						});
					});
				}
			})
			.catch((error) => {
				window.alert(error);
			});
	}

	Logout() {
		localStorage.setItem('user', '{}');
		this.afAuth.signOut().then(() => {
			this.router.navigate(['/']);
		});
	}

	get isLoggedIn(): boolean {
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		return user !== '{}' && (user.emailVerified || user.isAnonymous);
	}
}
