import { Database } from "./structs/database.js";
import { Chunk, Header, TelemetryEntry } from "./types/telemetry.js";

function generateEntry(): TelemetryEntry {
    let choice = Math.floor(Math.random() * 3);

    let res: TelemetryEntry = null as any;
    switch (choice) {
        case 0:
            res = {
                time: Date.now(),
                parameter: "move",
                values: [
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 100)
                ]
            };
            break;
        case 1:
            res = {
                time: Date.now(),
                parameter: "interact",
                values: [
                    { "entityName": "entity1" }
                ]
            };
            break;
        case 2:
            res = {
                time: Date.now(),
                parameter: "look",
                values: [
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 100)
                ]
            };
            break;
        }

    return res;
};


function generateChunk(size: number, session: string): Chunk {
    const header: Header = {
        session: session,
        platform: "Quest2",
        simulation: "test",
        version: "1.0.0",
    };

    const entries: TelemetryEntry[] = [];

    for (let i = 0; i < size; i++) {
        entries.push(generateEntry());
    }

    return {
        header: header,
        session: session,
        sendTime: Date.now(),
        entries: entries
    }

}

export async function test(db: Database) {
    const session = db.getSession();

    session.add(generateChunk(30, session.getToken()));
    // console.log(generateChunk(10, session.getToken()));

    await session.flush();
}