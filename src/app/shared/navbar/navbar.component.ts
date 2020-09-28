import { Component, OnInit } from '@angular/core'
import {AuthService} from "../../services/auth.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {auth} from "firebase";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private afsAuth: AngularFireAuth, private router: Router) { }
  public app_name: string='AppLearn';
  public isLogged: boolean=false
  public  isAdmin: any = null;
  public userUid: string = null;

  ngOnInit() {
    this.getCurrentUser();
   // this.getAdminUser();
  }

  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        console.log('user logged');
        this.isLogged = true;
      } else {
        console.log('NOT user logged');
        this.isLogged = false;
      }
    });
  }


  onLogout(){
    this.authService.onLogOut();
    this.router.navigate(['authentication/login']);
  }
}