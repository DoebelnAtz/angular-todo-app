import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { ApiService } from '../shared/services/api.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
	user: User | undefined;
	private subscriptions: Subscription[] = [];
	errorMessage: string = '';
	isError = false;
	constructor(
		public apiService: ApiService,
		public userService: UserService
	) {}

	getError() {
		this.subscriptions.push(
			this.apiService.getError().subscribe((error) => {
				this.errorMessage = error;
				let e = this.isError;
				setTimeout(() => {
					if (!e && error) {
						this.isError = false;
					}
				}, 4000);
				if (!this.isError && error) {
					this.isError = true;
				}
			})
		);
	}

	ngOnInit() {
		this.getError();
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
