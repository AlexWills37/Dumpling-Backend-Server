import { MongoClient } from "mongodb";
import { Session } from "./session.js";

export class Database {
    private client: MongoClient;
    private currentDb: string = "admin";
    private sessions: { [key: string]: Session } = {};

    /**
     * Creates a new instance of the wrapper around the existing mongodbclient.
     * @param _client The MongoDB client to use.
     */
    constructor(_client: MongoClient) {
        this.client = _client;
    }

    /**
     * Swaps to and returns the default database. 
     * @param name The name of the database to use
     * @returns The Database
     */
    public db(name: string) {
        this.currentDb = name;
        return this.client.db(this.currentDb);
    }

    /**
     * Swaps to the specified collection of the default database, returning it.
     * @param name The name of the collection to use
     * @returns The collection
     */
    public col(name: string) {
        return this.db(this.currentDb).collection(name);
    }

    /**
     * Returns an existing session or creates a new one if not found
     * @param session The sessionid to search for
     * @returns The session
     */
    public getSession(session: string) {
        return this.sessions[session];
    }

    /**
     * Creates a new session.
     */
    public createSession() {
        const session = new Session(this);
        this.sessions[session.getToken()] = session;
        return session;
    }

    /**
     * Checks if a session exists within the cache.
     * @param session The session to search for
     * @returns a boolean depending on if the session exists
     */
    public sessionExists(session: string) {
        return Object.keys(this.sessions).includes(session);
    }
}