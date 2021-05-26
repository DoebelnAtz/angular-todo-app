import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less'],
	providers: [RouterLink],
})
export class LoginComponent implements OnInit {
	googleLoading = false;
	anonLoading = false;

	constructor(private user: UserService) {}

	/**
	 *  timeout in login to give time to redirect without
	 *  confusing flickering
	 */

	async onGoogleLogin() {
		this.googleLoading = true;
		await this.user.GoogleAuth();
		setTimeout(() => {
			this.googleLoading = false;
		}, 500);
	}

	async onAnonymousLogin() {
		this.anonLoading = true;
		await this.user.AnonymousAuth();
		setTimeout(() => {
			this.anonLoading = false;
		}, 500);
	}

	ngOnInit(): void {}
}
