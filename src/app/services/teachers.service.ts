import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.class';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  constructor(
    private afs: AngularFirestore,
    public authService: AuthService
    ) {
      const currentInstitute = this.authService.currentUser.instituteId; 
      this.usersCollection = this.afs.collection<User>('users', ref => ref.where('instituteId','==',currentInstitute ))
      this.users = this.usersCollection.valueChanges();


     }

     private usersCollection : AngularFirestoreCollection<User>;
     private users : Observable<User[]>;
     private user: Observable<User>;
     private userDoc: AngularFirestoreDocument<User>;
     public  selectedTeacher: User = {
      uid: null
    };



  getTeachers(){
    return this.usersCollection.snapshotChanges();
  }

  getTeacher(teacherId: string){
    this.userDoc = this.afs.doc<User>(`users/${teacherId}`);
    return this.user = this.userDoc.snapshotChanges().pipe(map(action =>{
      if (action.payload.exists == false){
        return null;
      } else {
        const data = action.payload.data() as User;
        data.uid = action.payload.id;
        return  data;
      }
    }));

  }

    createTeacher(record) {
      return this.afs.collection('users').add(record);
    }
  
    deleteTeacher(uid) {
      return this.afs.collection('users').doc(uid).delete();
    }
  
    updateTeacher(user: User){
      
      let teacherId = user.uid;
      this.userDoc = this.afs.doc<User>(`users/${teacherId}`);     
      return this.userDoc.update(user);

      }

     












}
