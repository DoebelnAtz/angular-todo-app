import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../shared/services/task.service';
import { UserService } from '../shared/services/user.service';
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
