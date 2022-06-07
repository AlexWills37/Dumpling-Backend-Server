export class Session {
    private time: number;
    private salt: number;

    constructor() {
        this.time = Date.now();
        this.salt = Math.round(Math.random() * 16);
    }

    public getToken(): string {
        return Buffer.from(JSON.stringify({ t: this.time, s: this.salt })).toString("base64");
    }
}