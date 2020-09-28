import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    public afAuth: AngularFireAuth,
    ) {
  }

  async canActivate(): Promise<boolean> {
     if(await this.authService.isStud()==true){
      console.log('stud guardia si');
      return true;
     }
     console.log('stud guardia no');
     return false;
  }
  
}
