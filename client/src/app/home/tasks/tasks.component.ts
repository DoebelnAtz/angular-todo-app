import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { Task } from '../../shared/models/task.model';

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.less'],
})
export class TasksComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	uid: string | undefined;

	constructor(
		public taskService: TaskService,
		private userService: UserService
	) {}

	ngOnInit() {
		// Load the current user's data
		console.log(this.userService);
		if (!!this.userService.uid)
			this.taskService.getTasks(this.userService.uid);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
