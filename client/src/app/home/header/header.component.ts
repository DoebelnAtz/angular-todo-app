import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.less'],
})
export class HeaderComponent {
	constructor(private userService: AuthService, private router: Router) {}

	onSignOutClick() {
		this.userService.Logout();
		this.router.navigate(['login']);
	}
}
