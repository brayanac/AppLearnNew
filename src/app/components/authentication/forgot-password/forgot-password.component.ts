
import { AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  userEmail = new FormControl('');
  constructor(private authSvc: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }
  async onReset(){
    try{
    const email = this.userEmail.value;
    await this.authSvc.resetPassword(email);
    window.alert('Correo enviado, verifica tu bandeja de recibido')
    this.router.navigate(['/authentication/login']);
  } catch (error){
    console.log(error);
  }
  }

}
