import { PageTimings } from '../model/page-timings';

export class Page{
    startedDateTime: Date;
    id: string;
    title: string;
    pageTimings: PageTimings;
    comment: string;

    constructor(){
        this.startedDateTime = null;
        this.id = "";
        this.title = "";
        this.pageTimings = new PageTimings();
        this.comment = "";
    }
}
