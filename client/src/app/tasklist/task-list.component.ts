import { Component, OnInit } from '@angular/core';
import {Task} from "../shared/models/task.model";

@Component({
  selector: 'app-taskList',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.less']
})
export class TaskListComponent implements OnInit {
	tasks: Task[];
  constructor() {
  	this.tasks = [
		new Task('Clean kitchen','decription', new Date()),
		new Task('Make todo app', 'description', new Date()),
		new Task('Make bed','decription', new Date()),
		new Task('Groceries', 'description', new Date()),
		new Task('Homework','decription', new Date()),
		new Task('Code', 'description', new Date()),
	]
  }

  ngOnInit(): void {
  }

}
