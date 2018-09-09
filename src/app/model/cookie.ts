export class Cookie {
    name: string;
    value: string;
    path: string;
    domain: string;
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    comment: string;

    constructor(){
        this.name = "";
        this.value = "";
        this.path = "";
        this.domain = "";
        this.expires = null;
        this.httpOnly = false;
        this.secure = false;
        this.comment = "";
    }
}
