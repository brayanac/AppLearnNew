import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.class';

import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root',
  
})
export class AuthService {
  public isWsAvailable: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isLog = false;
  private isAdmininistrator = false;
  private isTeacher = false;
  private isStudent = false;
  constructor(public afAuth: AngularFireAuth,
   // private storage: StorageService,
    private router: Router, private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
    this.getCurrentUser();
    //this.isAdmin();
  }
  private usersCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;
  private user: Observable<User>;
  private userDoc: AngularFirestoreDocument<User>;

  public currentUser;

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password).then(
        res => resolve(res),
        err => reject(err),
      );
    });
  }

  createUser(record) {
    return this.afs.collection('users').doc(record.uid).set(record);
  }

  getUser(email) {
    return this.afs.collection('users', ref => ref.where('email', '==', `${email}`)).snapshotChanges();
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  async onLogOut() {
    console.log("logging out");
    localStorage.clear();
    this.afAuth.signOut();
    this.router.navigateByUrl('/login');
  }

  async isAdmin(): Promise<boolean> {
    this.afAuth.authState.subscribe((user) => {
      this.getUserByUid(user.uid).subscribe((user) => {
        if (user.role == 'admin') {
          console.log('admin servicio si');
          return this.isAdmininistrator = true;
        }
        else {
          console.log('admin servicio no');
          return this.isAdmininistrator = false;
        };
      });
    });
  return this.isAdmininistrator;
  }

  async isTeach(): Promise<boolean> {
    this.afAuth.authState.subscribe((user) => {
      this.getUserByUid(user.uid).subscribe((user) => {
        if (user.role == 'teacher') {
          console.log('teacher servicio si');
          return this.isTeacher = true;
        }
        else {
          console.log('teacher servicio no');
          return this.isTeacher = false;
        };
      });
    });
  return this.isTeacher;
  }
  
  async isStud(): Promise<boolean> {
    this.afAuth.authState.subscribe((user) => {
      this.getUserByUid(user.uid).subscribe((user) => {
        if (user.role == 'teacher') {
          console.log('teacher servicio si');
          return this.isStudent = true;
        }
        else {
          console.log('teacher servicio no');
          return this.isStudent = false;
        };
      });
    });
  return this.isStudent;
  }

  async getCurrentUser() {
    this.afAuth.authState.subscribe((authUser)=>{
      this.getUserByUid(authUser.uid).subscribe((FSuser)=>{
         this.currentUser  = FSuser; 
       
         return this.currentUser;
      })
    }
    )

  }


  passwordRecovery(email) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

   getUserByUid(userId: string){
     this.userDoc = this.afs.doc<User>(`users/${userId}`);
     return this.user = this.userDoc.snapshotChanges().pipe(map(action=>{
       if (action.payload.exists == false){
         return null;
       } else{
         const data = action.payload.data() as User;
         data.uid = action.payload.id;
         return data;
       }
     }));
   }
   async resetPassword(email: string): Promise<void>{
    try{
      return this.afAuth.sendPasswordResetEmail(email);
    }catch(error){
      console.log(error);
    } 
  }
}
