import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import AuthProvider = firebase.auth.AuthProvider;
import firebase from 'firebase/app';

import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public user$: Observable<User>;
	public uid$ = this.afAuth.authState.pipe(
		map((authState) => {
			return authState ? authState.uid : null;
		}),
		shareReplay(1)
	);

	constructor(
		private afAuth: AngularFireAuth,
		private router: Router,
		private ngZone: NgZone,
		public apiService: ApiService
	) {
		this.user$ = new Observable<User>((observer) => {
			this.afAuth.authState.subscribe((user) => {
				if (user) {
					let userObj = {
						uid: user.uid,
						isAnonymous: user.isAnonymous,
						tasks: [],
					};
					observer.next(userObj);
					localStorage.setItem('user', JSON.stringify(user));
				} else {
					observer.next({} as User);
					localStorage.setItem('user', '{}');
				}
			});
		});
	}

	async PatchUser(user: User) {
		return this.apiService.patch('/users', user).toPromise();
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
						tasks: [],
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
						tasks: [],
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
			this.router.navigate(['/login']);
		});
	}

	isLoggedIn(): Observable<boolean> {
		return this.uid$.pipe(
			switchMap((uid: any) => {
				if (!uid) {
					return of(false);
				} else {
					return of(true);
				}
			})
		);
	}
}
