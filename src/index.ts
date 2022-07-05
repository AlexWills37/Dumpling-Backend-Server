import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import Session from "./routes/session.js";
import Telemetry from "./routes/telemetry.js";
import { Database } from "./structs/database.js";
import { test } from "./testing.js";
import Logger from "./logger.js";
import Exports from "./routes/exports.js";
import Control from "./routes/control.js";

const server = express();

export const GLOBALS = {
    requestCount: 0,
    packetsRecieved: 0
}

dotenv.config();
server.use(express.json());

// Setup
MongoClient.connect(process.env.MongoConnectionURI as string)
.then(async (client) => { 
    // Create the new database object
    const db = new Database(client);

    // Bind the endpoints and middleware 

    // server.use(Logger.createLoggerMiddleware(false));
    server.use("/session", Session(db));
    server.use("/telemetry", Telemetry(db));
    server.use("/api", Exports(db));
    server.use("/control", Control(db));

    // Register a callback for when it starts.
    server.listen(80, () => {
        Logger.info("Server started on port", "80".blue);
    });

    // Register a callback for when it starts.
    server.listen(443, () => {
        Logger.info("Server started on port", "443".blue);
    });
})

