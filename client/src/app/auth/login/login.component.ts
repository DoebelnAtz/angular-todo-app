import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less'],
	providers: [RouterLink],
})
export class LoginComponent implements OnInit {
	constructor(private user: UserService, private router: Router) {}

	async onGoogleLogin() {
		await this.user.GoogleAuth();
	}

	async onAnonymousLogin() {
		await this.user.AnonymousAuth();
	}

	ngOnInit(): void {}
}
