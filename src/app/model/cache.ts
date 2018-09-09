export class Cache {
    beforeRequest: object;
    afterRequest: object;
    comment: string;

    constructor(){
        this.beforeRequest = null;
        this.afterRequest = null;
        this.comment = "";
    }
}
