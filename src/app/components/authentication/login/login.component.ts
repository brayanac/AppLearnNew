import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService } from '../../../services/auth.service';
import {User } from '../../../models/user.class';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
 
})
export class LoginComponent implements OnInit, OnDestroy {
  getUserSubscription: Subscription;
  user: User = new User();
  loginForm: FormGroup;
  validation_messages = {
    email: [
      { type: 'required', message: 'El correo es requerido.' },
      { type: 'pattern', message: 'Introduzca un correo valido.' }
    ],
    password: [
      { type: 'required', message: 'Contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 6 dígitos.'}
    ]
  };

  passwordTypeInput = 'password';
  // Variable para cambiar dinamicamente el tipo de Input que por defecto sera 'password'
  iconpassword = 'eye-off';
  // Variable para cambiar dinamicamente el nombre del Icono que por defecto sera un ojo cerrado

  constructor(
    public authService: AuthService, 
    private router: Router,
    //private storage: Storage,
    public formBuilder: FormBuilder,
    ) {
      this.loginForm = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])),
        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(5),
        ])),
      });
     }

     ngOnDestroy() {
     ((this.getUserSubscription) !== undefined ? this.getUserSubscription.unsubscribe() : '');
    }

  ngOnInit() {
  }

  

  async onLogin(){

    const user = {};
      this.authService.loginUser(this.loginForm.value)
      .then((res) => {
        user['email'] = res.user.email;
        user['uid'] = res.user.uid;
        this.getUser(user);

      }, (error) => {

        console.log(error);

      });
    }
    
    getUser(user) {
      this.getUserSubscription = 
      this.authService.getUser(this.loginForm.get('email').value).subscribe(data => {
        let person = {};
        person = data.map(e => {
          return {
            displayName: e.payload.doc.data()['displayName'],
            role: e.payload.doc.data()['role'],
            instituteId: e.payload.doc.data()['instituteId'],
            phone: e.payload.doc.data()['phone'],
          };
        });
        user['displayName'] = person[0].displayName;
        user['role'] = person[0].role;
        user['instituteId'] = person[0].instituteId;
        user['phone'] = person[0].phone;
        console.log(user);
        localStorage.setItem('user',JSON.stringify(user));
        console.log(JSON.parse(localStorage.getItem('user')));
        this.router.navigateByUrl('/');
      }, (error) => {
        console.log(error);
      });
  }



  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
  }

}