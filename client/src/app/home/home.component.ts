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
	public errorMessage: string = '';
	constructor(
		public apiService: ApiService,
		public userService: UserService
	) {}

	getError() {
		this.subscriptions.push(
			this.apiService.getError().subscribe((error) => {
				this.errorMessage = error;
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
