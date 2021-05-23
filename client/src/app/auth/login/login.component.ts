import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
	constructor(private user: UserService, private router: Router) {}

	onLoginClick () {
		let res = this.user.GoogleAuth()
	}

  ngOnInit(): void {
  }

}
