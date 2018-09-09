export class Content {
    size: number;
    compression: number;
    mimeType: string;
    encoding: string;
    text: string;
    comment: string;

    constructor(){
        this.size = 0;
        this.compression = 0;
        this.mimeType = "";
        this.encoding = "";
        this.text = "";
        this.comment = "";
    }
}
