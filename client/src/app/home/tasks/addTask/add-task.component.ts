import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../../shared/services/task.service';
import { markIgnoreDiagnostics } from '@angular/compiler-cli/src/ngtsc/typecheck/src/comments';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/user.model';

@Component({
	selector: 'app-add-task',
	templateUrl: './add-task.component.html',
	styleUrls: ['./add-task.component.less'],
})
export class AddTaskComponent implements OnInit {
	@Output() editEvent = new EventEmitter<boolean>();
	isEditing = false;
	taskName: string = '';
	private subscriptions: Subscription[] = [];

	constructor(
		private taskService: TaskService,
		private userService: UserService
	) {}

	onEditTaskClick() {
		this.isEditing = !this.isEditing;
		this.editEvent.emit(this.isEditing);
	}

	onAddTaskClick() {
		this.addTask();
	}

	onTaskNameInputEnter(e: KeyboardEvent) {
		if (e.key === 'Enter' && !!this.taskName.length) {
			this.addTask();
		}
	}

	addTask() {
		!!this.userService.uid &&
			this.taskService.createTask(this.userService.uid, this.taskName);
		this.taskName = '';
	}

	ngOnInit() {
		// Load the current user's data
		console.log(this.userService.uid);
		this.subscriptions.push(this.userService.user.subscribe());
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
