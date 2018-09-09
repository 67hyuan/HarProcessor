export class PostData {
    mimeType: string;
    params: Array<string>;
    text: string;
    comment: string;

    constructor(){
        this.mimeType = "";
        this.params = new Array<string>();
        this.text = "";
        this.comment = "";
    }
}
