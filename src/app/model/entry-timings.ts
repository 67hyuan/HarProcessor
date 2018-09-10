export class EntryTimings {
    blocked: number; //Time spent in a queue waiting for a network connection. Use -1 if the timing does not apply to the current request.
    dns: number; //DNS resolution time. The time required to resolve a host name. Use -1 if the timing does not apply to the current request.
    connect: number; //Time required to create TCP connection. Use -1 if the timing does not apply to the current request.
    send: number; //Time required to send HTTP request to the server.
    wait: number; //Waiting for a response from the server.
    receive: number; //Time required to read entire response from the server (or cache).
    ssl: number; //Time required for SSL/TLS negotiation. If this field is defined then the time is also included in the connect field (to ensure backward compatibility with HAR 1.1). Use -1 if the timing does not apply to the current request.
    _blocked_queueing: number; //Time spent waiting for resouce available, this is mostly due to the lower priority of the request while the higher priority requests are being processed first.
    comment: string;

    constructor(){
        this.blocked = 0;
        this.dns = 0; 
        this.connect = 0;
        this.send = 0; 
        this.wait = 0; 
        this.receive = 0; 
        this.ssl = 0;
        this._blocked_queueing = 0;
        this.comment = "";
    }
}
