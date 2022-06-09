import { Chunk, Header, TelemetryEntry } from "../types/telemetry.js";
import { Database } from "./database.js";

export class Session {
    private time: number;
    private salt: number;
    private db: Database;

    private iter: number | null = null;
    private lastFlush: number = 0;
    private cache: TelemetryEntry[] = [ ];
    private lastHeader: Header | null = null;
    private token: string;

    constructor(_db: Database) {
        this.time = Date.now();
        this.salt = Math.round(Math.random() * 16);
        this.token = this.getToken();
        this.db = _db;
    }

    public getToken(): string {
        return Buffer.from(JSON.stringify({ t: this.time, s: this.salt })).toString("base64");
    }


    public start() {
        if (this.iter != null) return;

        (this.iter as any) = setInterval(() => {
            this.flush();
        }, 16000);
    }

    /**
     * Flush the stored session data to the database.
     */
    public async flush() {
        if (this.cache.length === 0 ||
            this.lastHeader == null) return;

        this.lastFlush = Date.now();
        this.db.db(this.lastHeader.platform)
        .collection(this.lastHeader.simulation)
        .insertMany(
            this.cache.map((entry) => {
                (entry as any).session = this.token;
                return entry;
            })
        ).then((result) => {
            console.log(result);
        })
    };

    /**
     * Adds a new chunk to the ongoing session.
     * @param chunk The chunk of telemetry data to store.
     */
    public add(chunk: Chunk) {
        this.lastHeader = chunk.header;
        this.cache = this.cache.concat(chunk.entries);
    }
}