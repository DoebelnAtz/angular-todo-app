import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskComponent } from './tasklist/task/task.component';
import { TaskListComponent } from './tasklist/task-list.component';
import { LoginComponent } from './auth/login/login.component';
import {RouterModule, Routes} from "@angular/router";
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskListComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent
  ],
  imports: [
    	BrowserModule,
	  RouterModule.forRoot(routes),
    	AppRoutingModule,
	  AngularFireModule.initializeApp(environment.firebase),
	  AngularFireAuthModule,
	  AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
