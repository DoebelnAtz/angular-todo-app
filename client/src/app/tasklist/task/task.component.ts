import { Component, OnInit, Input } from '@angular/core';
import {Task} from "../../shared/models/task.model";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit {

	@Input() task: Task;

	  constructor(task: Task) {
		this.task = task;
	  }
	ngOnInit(): void {
  }

}
