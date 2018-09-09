import {Request} from '../model/request';
import {Response} from '../model/response';
import {Cache} from '../model/cache';
import {EntryTimings} from '../model/entry-timings';


export class Entry {
    startedDateTime: Date;
    time: number; //time spend in milliseconds
    request: Request;
    response: Response;
    cache: Cache;
    timings: EntryTimings;
    serverIPAddress: string;
    _fromCache: string;
    connection: string;
    pageref: string;
    _securityState: string;
    comment: string;

    constructor(){
        this.startedDateTime = null;
        this.time = 0;
        this.request = new Request();
        this.response = new Response();
        this.cache = new Cache();
        this.timings = new EntryTimings();
        this.serverIPAddress = "";
        this.connection = "";
        this.pageref = "";
        this._securityState = "";
        this.comment = "";
    }
}
