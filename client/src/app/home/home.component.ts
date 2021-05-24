import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../shared/services/task.service';
import { Observable, Observer, Subscription } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { concatMap, tap } from 'rxjs/operators';
import firebase from 'firebase';
import UserInfo = firebase.UserInfo;
import { User } from '../shared/models/user.model';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
	user: User | undefined;

	constructor(
		private todoService: TaskService,
		public userService: UserService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.userService.user.subscribe((userData) => {
			this.user = userData;
		});
	}

	ngOnDestroy() {}
}
