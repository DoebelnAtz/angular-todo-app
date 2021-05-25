import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
	user: User | undefined;
	private subscriptions: Subscription[] = [];

	constructor(
		public userService: UserService,
		public apiService: ApiService
	) {}

	getError() {
		this.apiService.getError().subscribe((e) => console.log(e));
	}

	ngOnInit() {
		this.getError();
		// this.subscriptions.push(
		// 	this.userService.user.subscribe((userData) => {
		// 		this.user = userData;
		// 	})
		// );
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
