import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  error$: Observable<string> = this.errorSubject.asObservable();
  
  constructor() { }

  /*
  //Update error message
  */
  updateErrorMessage(msg: string){
    try{
        this.errorSubject.next(msg);
    }
    catch(e){
      alert("ErrorService.updateErrorMessage failed: " + e.message);
    }
  }
}
