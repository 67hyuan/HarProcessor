import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})

export class ErrorComponent implements OnInit, OnDestroy {
  errorMessage: string = "";
  subscription: Subscription;

  constructor(private errSvc: ErrorService) {
   }

  ngOnInit() {
    try{
          this.subscription = this.errSvc.error$.subscribe(
            errMsg => {
              this.errorMessage = errMsg;
            }
          )
    }
    catch(e){
      alert("ErrorComponet.ngOnInit failed: " + e.message);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
