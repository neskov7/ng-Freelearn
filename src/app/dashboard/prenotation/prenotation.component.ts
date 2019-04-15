import { Component, OnInit } from '@angular/core';
import { PrenotationService } from './prenotation.service';
import { ErrorService } from 'src/app/error.service';
import { Observable } from 'rxjs';
import { Lesson } from 'src/app/model/lesson';
import { User } from 'src/app/model/user';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-prenotation',
  templateUrl: './prenotation.component.html',
  styleUrls: ['./prenotation.component.scss']
})
export class PrenotationComponent implements OnInit {

  today: Date = new Date()
  lessons$: Observable<Lesson[]>
  users: User[] = []
  users$: Observable<User[]>

  constructor(private prenotationService: PrenotationService, private errorService: ErrorService) { }

  ngOnInit() {
    this.lessons$ = this.prenotationService.getLessonsAdmin()
    this.users$ = this.prenotationService.getUsersAdmin()
    this.setUsers()
  }

  setUsers(){
    this.users$.subscribe(
      (res: User[]) => res.forEach(x => {
        this.users.push(new User(
          // @ts-ignore
          x.id, x.name, x.surname
        ))
      }),
      (err: HttpErrorResponse) => {
        this.errorService.showErrorMessage(err.error, "error")
      }
    )
  }

  getUser(userID: number){
    if (this.users.length > 0){
      let user: User = this.users.find(x => x.id == userID)
      return user.name + " " + user.surname
    }
  }

  delete(lessonID: number){
    this.prenotationService.deleteLesson(lessonID).subscribe(
      res => {
        this.prenotationService.getLessonsAdmin()
        this.errorService.openSnackBar("Booking deleted correctly", "ok")
      },
      (err: HttpErrorResponse) => {
        this.prenotationService.getLessonsAdmin()
      }
    )
  }
}
