export class PageTimings {
    onContentLoad: number;
    onLoad: number;

    constructor(){
        this.onContentLoad = 0; //time spent on the content load
        this.onLoad = 0; //total time spend on load
    }
}
