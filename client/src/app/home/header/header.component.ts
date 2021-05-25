import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.less'],
})
export class HeaderComponent {
	constructor(private userService: UserService, private router: Router) {}

	onSignOutClick() {
		this.userService.Logout();
		this.router.navigate(['login']);
	}
}
