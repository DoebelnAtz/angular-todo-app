import { TaskType } from './task.model';

export interface User {
	uid: string;
	isAnonymous: boolean;
	tasks: TaskType[];
}
