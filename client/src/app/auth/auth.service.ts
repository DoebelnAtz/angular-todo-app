import 'rxjs/add/operator/map';


import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from "firebase/app";
import { Observable } from 'rxjs';
import User = firebase.User;


@Injectable()
export class AuthService {
	authenticated$: Observable<User | null>;

	constructor(public afAuth: AngularFireAuth) {
		this.authenticated$ = afAuth.authState;
	}

	signIn(provider: firebase.auth.AuthProvider): any {
		return this.afAuth.auth.signInWithPopup(provider)
			.catch(error => console.log('ERROR @ AuthService#signIn() :', error));
	}

	signInAnonymously(): any {
		return this.afAuth.auth.signInAnonymously()
			.catch(error => console.log('ERROR @ AuthService#signInAnonymously() :', error));
	}


	signInWithGoogle(): any {
		return this.signIn(new firebase.auth.GoogleAuthProvider());
	}

	signOut(): void {
		this.afAuth.auth.signOut();
	}
}
