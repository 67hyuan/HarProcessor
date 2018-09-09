import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Page } from '../model/page';
import { Entry } from '../model/entry';
import { HarLog } from '../model/har-log';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})

export class ArchiveComponent implements OnInit {
  error: string = "";
  harLog: HarLog = new HarLog();
  totalRspTime: number = 0; //Total Response Time
  averageEntryTime: number = 0; //Average Entry Time
  averageRqstSentTime: number = 0; //Average Request Send Time

  constructor (private errSvc: ErrorService, private dataSvc: DataService, private router: Router) {
  }

  /*
  //Subscribe to services
  */
  ngOnInit(){
    try{
          this.dataSvc.harLog$.subscribe(har => this.harLog = har);
          this.errSvc.error$.subscribe(err => this.error = err);
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Handle new file upload by passing file handler to the service which will update the harLog this object subscribes to
  */
  onFileSelected(event){
    try{
          this.reset();

          if(event.target.files.length == 0){
            alert("No file is selected!");
            this.dataSvc.updateHarLog(null);
            return; //it can also throw an error and display on the error page: throw(new Error("No file is selected!"));
          }

          this.dataSvc.updateHarLog(<File>event.target.files[0]);
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Reset all calculated data
  */
  reset(){
    try{
          this.totalRspTime = 0;
          this.averageEntryTime = 0;
          this.averageRqstSentTime = 0;
    }
    catch(e){
      this.handleError(e.message);
    }
}

  /*
  //Total time elapsed between the first page start time and last response.
  */
  calcTotalResponseTime(){
    try{
        this.totalRspTime = 0;
        let startTime = this.harLog.pages[0].startedDateTime;
        let loadTime = null;
        let entryLoadTime: Date = new Date(0);

        this.harLog.entries.forEach(function(entry){
        entryLoadTime.setTime(entry.startedDateTime.getTime());
        entryLoadTime.setTime(entryLoadTime.getTime() + entry.time);
        if (entryLoadTime > loadTime){          
          loadTime = entryLoadTime;
        }    
        });        
        
        this.totalRspTime = loadTime.getTime() - startTime.getTime();
    }    
    catch(e){
      this.handleError(e.message);
    }
    finally{
      //TBD
    }
  }

  /*
  //Calculate average entry time by looping through array of entries
  */
  calcAverageEntryTime(){
    try{
      this.averageEntryTime = 0;
        let totalTime: number = 0;
        for(let i = 0; i < this.harLog.entries.length; i++)
        {
          totalTime += this.harLog.entries[i].time;
        }

        this.averageEntryTime = Number((totalTime / this.harLog.entries.length).toFixed(2));
    }
    catch(e){
      this.handleError(e.message);
    }
    finally{
      //TBD
    }
  }

  /*
  //Calculate average time required to send HTTP request to the server
  */
  calcAverageRequestTime(){
    try{
        this.averageRqstSentTime = 0;
        let totalSendTime = 0;
        let count = 0;
        this.harLog.entries.forEach(function(entry){
          if(entry.timings.send > 0){
            totalSendTime += entry.timings.send;
            count++;
          }
        });
        
        if(count > 0){
          this.averageRqstSentTime = Number((totalSendTime / count).toFixed(2));
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Handle errors by updating error service messages which are subscribed by error component.
  */
  handleError(msg: any){
    try{
          this.errSvc.updateErrorMessage(msg.toString());
          this.router.navigate(['error']);
    }
    catch(e){
      alert("handling error failed: " + e.message);
    }
  }
}
