import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { HarLog } from './model/har-log';
import { Page } from './model/page';
import { Entry } from './model/entry';
import { NameValue } from './model/namevalue';
import { Cookie } from './model/cookie';

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
            this.harLog = null;
          }
          this.harLog = new HarLog();

          let reader = new FileReader();
          reader.onload = () => {
            let harJson = JSON.parse(reader.result.toString());

            //Getting version and creator
            this.harLog.version = harJson.log.version;
            this.harLog.creator.name = harJson.log.creator != null ? harJson.log.creator.name : "";
            this.harLog.creator.version = harJson.log.creator != null ? harJson.log.creator.version : "";
            this.harLog.browser.name = harJson.log.browser != null ? harJson.log.browser.name : "";
            this.harLog.browser.version = harJson.log.browser != null ? harJson.log.browser.version : "";

            //Getting pages
            if(harJson.log.pages != undefined && harJson.log.pages != null){
              for(let page of harJson.log.pages){
                let p = new Page();
                p.startedDateTime = new Date(page.startedDateTime.toString());
                p.id = page.id;
                p.title = page.title;
                p.pageTimings.onContentLoad = (page.pageTimings.onContentLoad != null) ? Number(page.pageTimings.onContentLoad): null;
                p.pageTimings.onLoad = (page.pageTimings.onLoad != null) ? Number(page.pageTimings.onLoad) : null;
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
              for(let rqsh of entry.request.headers){
                let h1: NameValue = new NameValue();
                h1.name = rqsh.name;
                h1.value = rqsh.value;
                e.request.headers.push(h1);
              }
              for(let qstr of entry.request.queryString){
                let q: NameValue = new NameValue();
                q.name = qstr.name;
                q.value = qstr.value;
                e.request.queryString.push(q);
              }
              for(let cok of entry.request.cookies){
                let ck1: Cookie = new Cookie();
                ck1.name = cok.name;
                ck1.value = cok.value;
                ck1.domain = cok.domain;
                ck1.expires = new Date(cok.expires);
                ck1.httpOnly = Boolean(cok.httpOnly);
                ck1.secure = Boolean(cok.secure); 
                e.request.cookies.push(ck1);
              }
              if(entry.request.method == "POST" && entry.request.postData != null){
                e.request.postData.mimeType = entry.request.postData.mimeType;
                e.request.postData.params = entry.request.postData.params;
                e.request.postData.text = entry.request.postData.text;
              }
              e.request.headerSize =  Number(entry.request.headerSize);
              e.request.bodySize = Number(entry.request.bodySize);
              
              e.response.status = Number(entry.response.status);
              e.response.statusText = entry.response.statusText;              
              for(let rsph of entry.response.headers){
                let nv: NameValue = new NameValue();
                nv.name = rsph.name;
                nv.value = rsph.value;
                e.response.headers.push(nv);
              }              
              for(let ck of entry.response.cookies){
                let nv2: Cookie = new Cookie();
                nv2.name = ck.name;
                nv2.value = ck.value;
                nv2.domain = ck.domain;
                nv2.expires = new Date(ck.expires);
                nv2.httpOnly = Boolean(ck.httpOnly);
                nv2.secure = Boolean(ck.secure);
                e.response.cookies.push(nv2);
              }
              e.response.content.size = Number(entry.response.content.size);
              e.response.content.mimeType = entry.response.content.mimeType;
              e.response.content.compression = entry.response.content.compression != null ? entry.response.content.compression : null;
              e.response.content.encoding = entry.response.content.encoding != null ? entry.response.content.encoding: "";
              e.response.content.text = entry.response.content.text;
              e.response.redirectURL = entry.response.redirectURL;
              e.response.headersSize = entry.response.headersSize != null ? Number(entry.response.headersSize) : null;
              e.response.bodySize = entry.response.bodySize != null ? Number(entry.response.bodySize) : null;

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
