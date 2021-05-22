import {NgModule} from "@angular/core";
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuth} from 'angularfire2/auth'

import { environment} from "../../environments/environment";

@NgModule({
	imports: [
		AngularFireAuth,
		AngularFireModule.initializeApp(environment.firebase)
	]
})
export class FirebaseModule{}
