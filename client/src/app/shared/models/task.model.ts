export class Task {
	name: string;
	description: string;
	deadline: Date;

	constructor(name: string, description: string, deadline: Date) {
		this.name = name;
		this.description = description;
		this.deadline = deadline
	}
}
