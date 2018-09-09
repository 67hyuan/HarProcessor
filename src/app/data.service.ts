import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { HarLog } from './model/har-log';
import { Page } from './model/page';
import { Entry } from './model/entry';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private harLog: HarLog;
  private harLogSubject: BehaviorSubject<HarLog> = new BehaviorSubject<HarLog>(this.harLog);
  harLog$: Observable<HarLog> = this.harLogSubject.asObservable();
  
  constructor() { }
    
  updateHarLog(f: File){
    try{
          //validate file
          if(f == null || f == undefined){
            this.harLogSubject.next(null);
            return;
          }

          //process file and update harLog
          if(this.harLog != null && this.harLog != undefined){
            delete this.harLog;
          }
          this.harLog = new HarLog();

          let reader = new FileReader();
          reader.onload = () => {
            let harJson = JSON.parse(reader.result.toString());

            //Getting version and creator
            this.harLog.version = harJson.log.version;
            this.harLog.creator.name = harJson.log.creator.name;
            this.harLog.creator.version = harJson.log.creator.version;

            //Getting pages
            if(harJson.log.pages != undefined && harJson.log.pages != null){
              for(let page of harJson.log.pages){
                let p = new Page();
                p.startedDateTime = new Date(page.startedDateTime.toString());
                p.id = page.id;
                p.title = page.title;
                p.pageTimings.onContentLoad = Number(page.pageTimings.onContentLoad);
                p.pageTimings.onLoad = Number(page.pageTimings.onLoad);
                this.harLog.pages.push(p);
              }
            }

            //Getting entries
            for(let entry of harJson.log.entries){
              let e = new Entry();
              e.startedDateTime = new Date(entry.startedDateTime.toString());
              e.time = Number(entry.time);

              e.request.method = entry.request.method;
              e.request.url = entry.request.url;
              e.request.httpVersion = entry.request.httpVersion;

              e.response.status = Number(entry.response.status);
              e.response.statusText = entry.response.statusText;
              e.response.content.size = Number(entry.response.content.size);

              e.timings.blocked = Number(entry.timings.blocked);
              e.timings.dns = Number(entry.timings.dns);
              e.timings.ssl = Number(entry.timings.ssl);
              e.timings.connect = Number(entry.timings.connect);
              e.timings.send = Number(entry.timings.send);
              e.timings.wait = Number(entry.timings.wait);
              e.timings.receive = Number(entry.timings.receive);
              e.timings._blocked_queueing = Number(entry.timings._blocked_queueing);
              this.harLog.entries.push(e);
            }
          };
          reader.readAsText(f);

          this.harLogSubject.next(this.harLog);
       }
       catch(e){
         alert("Data Service Update harLog failed. " + e.message);
       }
    }
}
