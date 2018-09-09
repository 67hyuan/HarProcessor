import {NameValue} from '../model/namevalue';
import {Content} from '../model/content';
import {Cookie} from '../model/cookie';
import {Cache} from '../model/cache';
import {EntryTimings} from '../model/entry-timings';

export class Response {
    status: number;
    statusText: string;
    httpVersion: string;
    headers: Array<NameValue>;
    cookies: Array<Cookie>;
    content: Content;
    redirectURL: string;
    headersSize: number;
    bodySize: number;
    _transferSize: number;
    comment: string;

    constructor(){
        this.status = 0;
        this.statusText = "";
        this.httpVersion = "";        
        this.headers = new Array<NameValue>();
        this.cookies = new Array<Cookie>();
        this.content = new Content();
        this.redirectURL = "";
        this.headersSize = 0;
        this.bodySize = 0;
        this._transferSize = 0;
        this.comment = "";
    }
}
