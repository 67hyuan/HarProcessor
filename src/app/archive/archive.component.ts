import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Form, NgForm} from '@angular/forms';

import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { HarLog } from '../model/har-log';
import { Entry } from '../model/entry';
import { NameValue } from '../model/namevalue';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})

export class ArchiveComponent implements OnInit {
  error: string = "";
  harLog: HarLog;
  dynamicEntries: Array<Entry>;
  metricOptions: Array<NameValue> = [{name: "Top # longest Resouce load time", value: "resouceTime"}, {name: "Top # longest image load time", value: "imageTime"},
  {name: "Top # longest 'GET' time", value: "getTime"}, {name: "Top # longest 'POST' time", value: "postTime"}];

  totalPageContentLoadTime: number; //Total page content load time
  avgPageContentLoadTime: number; //Average content load time per page
  totalPageLoadTime: number; //Total page load time (page completely loaded)
  avgPageLoadTime: number; //Average load completion time per page

  totalRspTime: number; //Total Response Time
  totalEntryTime: number; //Total Entry Time
  averageEntryTime: number; //Average Entry Time
  totalRqstSendTime: number; //Total Request Send Time
  averageRqstSendTime: number; //Average Request Send Time
  totalRqstWaitTime: number; // Total Request Wait Time
  averageRqstWaitTime: number; //Average Request Wait Time
  totalBlockTime: number; //Total time spent in queues waiting for network connections
  averageBlockTime: number; //Average time spent in queues waiting for a network connection
  totalDnsTime: number; //Total DNS resolution time
  averageDnsTime: number; //Average DNS resolution time
  totalSslTime: number; //Total time required for SSL/TLS negotiation
  averageSslTime: number; //Average time required for SSL/TLS negotiation
  totalConnectTime: number; //Total time required to create TCP connections
  averageConnectTime: number; //Average time required to create a TCP connection

  totalUrlRedirect: number; //Total URL redirect from the location response header
  topNumOfLoadTime: number; //Top number of resources that took the longest to load

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
          this.totalPageContentLoadTime = null;
          this.avgPageContentLoadTime = null;
          this.totalPageLoadTime = null;
          this.avgPageLoadTime = null;

          this.totalRspTime = null;
          this.totalEntryTime = null;
          this.averageEntryTime = null;
          this.totalRqstSendTime = null;
          this.averageRqstSendTime = null;
          this.totalRqstWaitTime = null;
          this.averageRqstWaitTime = null;
          this.totalBlockTime = null;
          this.averageBlockTime = null;
          this.totalDnsTime = null;
          this.averageDnsTime = null;
          this.totalSslTime = null;
          this.averageSslTime = null;
          this.totalConnectTime = null;
          this.averageConnectTime = null;

          this.totalUrlRedirect = null;

          if(this.dynamicEntries != null && this.dynamicEntries != undefined){
            delete this.dynamicEntries;
            this.dynamicEntries = null;
          }

          this.topNumOfLoadTime = null;
    }
    catch(e){
      this.handleError(e.message);
    }
}

/*
//Calculate user selected metrics
*/
onMetricFormSubmit(form: NgForm){
  try{      
      if(form.valid && form.controls['metricSelection'] != null){
        if(this.dynamicEntries != null && this.dynamicEntries != undefined){
          this.dynamicEntries = null;
        }
        this.dynamicEntries = new Array<Entry>();
        let tmpEntries = new Array<Entry>();

        let val = form.controls['metricSelection'].value.toString();
        switch(val){
          case "resouceTime":
            tmpEntries = this.harLog.entries;            
            break;
          case "imageTime":
            this.harLog.entries.forEach(function(entry){
              if(entry.response.content.mimeType != null && entry.response.content.mimeType != undefined && entry.response.content.mimeType.startsWith("image/")){
                tmpEntries.push(entry);
              }
            });            
            break;
          case "getTime":
            this.harLog.entries.forEach(function(entry){
              if(entry.request.method != null && entry.request.method != undefined && entry.request.method == "GET"){
                tmpEntries.push(entry);
              }
            }); 
            break;
          case "postTime":
            this.harLog.entries.forEach(function(entry){
              if(entry.request.method != null && entry.request.method != undefined && entry.request.method == "POST"){
                tmpEntries.push(entry);
              }
            });
            break;
          default:
            console.log("not a valid selection.");
            return;
        }
        
        tmpEntries.sort(function(a, b){return b.time - a.time});
        if(this.topNumOfLoadTime > tmpEntries.length){
            this.topNumOfLoadTime = tmpEntries.length;
        }
        for (let i = 0; i < this.topNumOfLoadTime; i++){
             this.dynamicEntries.push(tmpEntries[i]);
        }        
      }
  }
  catch(e){
    this.handleError(e.message);
  }
}

  /*
  //Calculate page content load time
  */
  calcPageContentLoadTime(){
    try{
        this.totalPageContentLoadTime = 0;
        this.avgPageContentLoadTime = 0;

        let count = 0;
        for(let i = 0; i < this.harLog.pages.length; i++){
          if(this.harLog.pages[i].pageTimings.onContentLoad != null && this.harLog.pages[i].pageTimings.onContentLoad >= 0){
            this.totalPageContentLoadTime += this.harLog.pages[i].pageTimings.onContentLoad;
            count++;
          }
        }        
        
        if(count > 0){
          this.avgPageContentLoadTime = Number((this.totalPageContentLoadTime / count).toFixed(2));
          this.totalPageContentLoadTime = Number(this.totalPageContentLoadTime.toFixed(2));
        }
        else{
          this.totalPageContentLoadTime = null;
          this.avgPageContentLoadTime = null;
          alert("Sorry page content load time is not applicable here!");
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Calculate total and average page load time
  */
  calcPageLoadTime(){
  try{
      this.totalPageLoadTime = 0;
      this.avgPageLoadTime = 0;

      let count = 0;
        for(let i = 0; i < this.harLog.pages.length; i++){
          if(this.harLog.pages[i].pageTimings.onLoad != null && this.harLog.pages[i].pageTimings.onLoad >= 0){
            this.totalPageLoadTime += this.harLog.pages[i].pageTimings.onLoad;
            count++;
          }
        }        
        
        if(count > 0){
          this.avgPageLoadTime = Number((this.totalPageLoadTime / count).toFixed(2));
          this.totalPageLoadTime = Number(this.totalPageLoadTime.toFixed(2));
        }
        else{
          this.totalPageLoadTime = null;
          this.avgPageLoadTime = null;
          alert("Sorry total page load time is not applicable here!");
        }
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
        let startTime = this.harLog.pages.length > 0 ? (this.harLog.pages[0].startedDateTime): (this.harLog.entries[0].startedDateTime);
        
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
  //Calculate total and average entry time by looping through array of entries
  */
  calcEntryTime(){
    try{
        this.averageEntryTime = 0;
        this.totalEntryTime = 0;
        for(let i = 0; i < this.harLog.entries.length; i++)
        {
          this.totalEntryTime += this.harLog.entries[i].time;
        }

        this.averageEntryTime = Number((this.totalEntryTime / this.harLog.entries.length).toFixed(2));
        this.totalEntryTime = Number(this.totalEntryTime.toFixed(2));
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
  calcRequestSendTime(){
    try{
        this.averageRqstSendTime = 0;
        this.totalRqstSendTime = 0;

        let count = 0;
        for(let i = 0; i < this.harLog.entries.length; i++){
          if(this.harLog.entries[i].timings.send >= 0){
            this.totalRqstSendTime += this.harLog.entries[i].timings.send;
            count++;
          }
        }     
        
        if(count > 0){
          this.averageRqstSendTime = Number((this.totalRqstSendTime / count).toFixed(2));
          this.totalRqstSendTime = Number(this.totalRqstSendTime.toFixed(2));
        }
        else{
          this.totalRqstSendTime = null;
          this.averageRqstSendTime = null;
          alert("Sorry, sending HTTP request to the server time is not applicable here!");
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Calcualte total and average request wait time
  */
  calcWaitTime(){
    try{
        this.totalRqstWaitTime = 0;
        this.averageRqstWaitTime = 0;

        let count = 0;
        for(let i = 0; i < this.harLog.entries.length; i++){
          if(this.harLog.entries[i].timings.wait >= 0){
            this.totalRqstWaitTime += this.harLog.entries[i].timings.wait;
            count++;
          }
        }        
        
        if(count > 0){
          this.averageRqstWaitTime = Number((this.totalRqstWaitTime / count).toFixed(2));
          this.totalRqstWaitTime = Number(this.totalRqstWaitTime.toFixed(2));
        }
        else{
          this.totalRqstWaitTime = null;
          this.averageRqstWaitTime = null;
          alert("Sorry, request wait time is not applicable here!");
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Calculate total and average time spent in queues waiting for network connections
  */
  calcBlockTime(){
    try{
        this.totalBlockTime = 0;
        this.averageBlockTime = 0;

        let count = 0;
        for(let i = 0; i < this.harLog.entries.length; i++){
          if(this.harLog.entries[i].timings.blocked >= 0){
            this.totalBlockTime += this.harLog.entries[i].timings.blocked;
            count++;
          }
        }        
        
        if(count > 0){
          this.averageBlockTime = Number((this.totalBlockTime / count).toFixed(2));
          this.totalBlockTime = Number(this.totalBlockTime.toFixed(2));
        }
        else{
          this.totalBlockTime = null;
          this.averageBlockTime = null;
          alert("Sorry, network connection block time is not applicable here!");
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Calculate total and average DNS resolution time
  */
  calcDnsTime(){
    try{
        this.totalDnsTime = 0;
        this.averageDnsTime = 0;

        let count = 0;
        for(let i = 0; i < this.harLog.entries.length; i++){
          if(this.harLog.entries[i].timings.dns >= 0){
            this.totalDnsTime += this.harLog.entries[i].timings.dns;
            count++;
          }
        }        
        
        if(count > 0){
          this.averageDnsTime = Number((this.totalDnsTime / count).toFixed(2));
          this.totalDnsTime = Number(this.totalDnsTime.toFixed(2));
        }
        else{
          this.totalDnsTime = null;
          this.averageDnsTime = null;
          alert("Sorry, DNS resolution time is not applicable here!");
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Calculate total and average time required for SSL/TLS negotiation
  */
  calcSslTime(){
    try{
        this.totalSslTime = 0;
        this.averageSslTime = 0;

        let count = 0;
        for(let i = 0; i < this.harLog.entries.length; i++){
          if(this.harLog.entries[i].timings.ssl >= 0){
            this.totalSslTime += this.harLog.entries[i].timings.ssl;            
            count++;
          }
        }        
        
        if(count > 0){
          this.averageSslTime = Number((this.totalSslTime / count).toFixed(2));
          this.totalSslTime = Number(this.totalSslTime.toFixed(2));
        }
        else{
          this.totalSslTime = null;
          this.averageSslTime = null;
          alert("Sorry, SSL/TLS negotiation time is not applicable here!");
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Calculate total and average time required to create TCP connections
  */
  calcConnectTime(){
    try{
        this.totalConnectTime = 0;
        this.averageConnectTime = 0;

        let count = 0;
        for(let i = 0; i < this.harLog.entries.length; i++){
          if(this.harLog.entries[i].timings.connect >= 0){
            this.totalConnectTime += this.harLog.entries[i].timings.connect;
            count++;
          }
        }        
        
        if(count > 0){
          this.averageConnectTime = Number((this.totalConnectTime / count).toFixed(2));
          this.totalConnectTime = Number(this.totalConnectTime.toFixed(2));
        }
        else{
          this.totalConnectTime = null;
          this.averageConnectTime = null;
          alert("Sorry, Creating TCP connection time is not applicable here!");
        }
    }
    catch(e){
      this.handleError(e.message);
    }
  }

  /*
  //Calculate total URL redirect count from the response
  */
  calcTotalUrLRedirect(){
    try{
        this.totalUrlRedirect = 0;
        for(let i = 0; i < this.harLog.entries.length; i++){
          if(this.harLog.entries[i].response.redirectURL != null && this.harLog.entries[i].response.redirectURL != ""){
            this.totalUrlRedirect++;
          }
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
