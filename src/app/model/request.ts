import {Cookie} from '../model/cookie';
import {NameValue} from '../model/namevalue';
import {PostData} from '../model/post-data';

export class Request {
    method: string;
    url: string;
    httpVersion: string;
    headers: Array<NameValue>;
    queryString: Array<NameValue>;
    cookies: Array<Cookie>;
    postData: PostData;
    headerSize: number;
    bodySize: number;
    comment: string;

    constructor(){
        this.method = "";
        this.url = "";
        this.httpVersion = "";
        this.headers = new Array<NameValue>();
        this.queryString = new Array<NameValue>();
        this.cookies = new Array<Cookie>();
        this.postData = new PostData();
        this.headerSize = 0;
        this.bodySize = 0;
        this.comment = "";
    }
}
