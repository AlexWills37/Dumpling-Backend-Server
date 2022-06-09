import { MongoClient } from "mongodb";
import { Session } from "./session.js";

export class Database {
    private client: MongoClient;
    private currentDb: string = "admin";
    private sessions: { [key: string]: Session } = {};

    constructor(_client: MongoClient) {
        this.client = _client;
    }

    public db(name: string) {
        this.currentDb = name;
        return this.client.db(this.currentDb);
    }

    public col(name: string) {
        return this.db(this.currentDb).collection(name);
    }

    public getSession(session?: string) {
        if (session && this.sessions[session]) {
            return this.sessions[session];
        } else {
            const session = new Session(this);
            this.sessions[session.getToken()] = session;
            return session;
        }
    }

    public sessionExists(session: string) {
        return Object.keys(this.sessions).includes(session);
    }
}