import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.class';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

// import { threadId } from 'worker_threads';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  userType = "student";
  email: string;
  password: string;
  registerStudentForm: FormGroup;
  registerAdminForm: FormGroup;
  validation_messages = {
    displayName: [
      { type: 'required', message: 'El nombre es requerido.' },
    ],
    institute: [
      { type: 'required', message: 'La institución es requerida.' },
    ],
    email: [
      { type: 'required', message: 'El correo es requerido.' },
      { type: 'pattern', message: 'Introduzca un correo válido.' }
    ],
    password: [
      { type: 'required', message: 'Contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 6 dígitos.' }
    ],
    phone: [
      { type: 'required', message: 'El celular es requerido.' },
      { type: 'minlength', message: 'El celular debe tener al menos 8 dígitos.' },
      // { type: 'pattern', message: 'Solo debe ingresar números.'}
    ]
  };

  passwordTypeInput = 'password';
  // Variable para cambiar dinamicamente el tipo de Input que por defecto sera 'password'
  iconpassword = 'eye-off';
  // Variable para cambiar dinamicamente el nombre del Icono que por defecto sera un ojo cerrado

  constructor(
    public authService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
  ) {
    this.registerStudentForm = this.formBuilder.group({
      displayName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        // Validators.pattern('/^-?(0|[1-9]\d*)?$/'),
      ])),
      instituteId: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      
    });
    this.registerAdminForm = this.formBuilder.group({
      displayName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        // Validators.pattern('/^-?(0|[1-9]\d*)?$/'),
      ])),
      institute: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  ngOnInit() {
  }


  setUserType(){
  this.userType = "admin";
  console.log(this.userType);
}


  async onRegister() {
    (this.userType == 'student') ? console.log(this.registerStudentForm.value) : console.log(this.registerAdminForm.value); //to print test
    const value = {};
    (this.userType == 'student') ? value['email'] = this.registerStudentForm.get('email').value 
    : value['email'] = this.registerAdminForm.get('email').value;
    (this.userType == 'student') ? value['password'] = this.registerStudentForm.get('password').value 
    : value['password'] = this.registerAdminForm.get('password').value;
    this.authService.registerUser(value).then(res => {
      this.user.email = res.user.email;
      this.user.uid = res.user.uid;
      this.user.role = this.userType;
      (this.userType == 'student') ? this.user.displayName = this.registerStudentForm.get('displayName').value
      : this.user.displayName = this.registerAdminForm.get('displayName').value;
      (this.userType == 'student') ? this.user.phone = this.registerStudentForm.get('phone').value
      : this.user.phone = this.registerAdminForm.get('phone').value;
      (this.userType == 'student') ? this.user.instituteId = this.registerStudentForm.get('instituteId').value
      :this.user.instituteId = res.user.uid;
      (this.userType == 'student') ? this.user.institute = " "
      :this.user.institute = this.registerAdminForm.get('institute').value;
      localStorage.setItem('user',JSON.stringify(this.user));
      this.createUser(this.user);
    }, (error) => {
      console.log(error);
    });
  }

  createUser(user) {
    const record = {};
    record['uid'] = user.uid;
    record['email'] = user.email;
    record['displayName'] = user.displayName;
    record['role'] = user.role;
    record['phone'] = user.phone;
    record['instituteId'] = user.instituteId;
    record['institute'] = user.institute;
    this.authService.createUser(record).then(resp => {
      this.router.navigateByUrl('/');
    }).catch(error => {
      console.log(error);
    })
  }


  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
  }

}
