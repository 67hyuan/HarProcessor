import {Page} from '../model/page';
import {Entry} from '../model/entry';
import {Creator} from '../model/creator';
import {Browser} from '../model/browser';

export class HarLog {
    version: string;
    creator: Creator;
    browser: Browser;
    pages: Array<Page>;
    entries: Array<Entry>;
    comment: string;

    constructor(){
        this.version = "";
        this.creator = new Creator();
        this.browser = new Browser();
        this.pages = new Array<Page>();
        this.entries = new Array<Entry>();
        this.comment = "";
    }
}
