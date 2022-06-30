import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import Session from "./routes/session.js";
import Telemetry from "./routes/telemetry.js";
import { Database } from "./structs/database.js";
import { test } from "./testing.js";
import Logger from "./logger.js";
import Exports from "./routes/exports.js";

const server = express();

dotenv.config();
server.use(express.json());

// Setup
MongoClient.connect(process.env.MongoConnectionURI as string)
.then(async (client) => { 
    // Create the new database object
    const db = new Database(client);

    // Bind the endpoints and middleware 
    server.use(Logger.middleware);
    server.use("/session", Session(db));
    server.use("/telemetry", Telemetry(db));
    server.use("/api", Exports(db));

    // Register a callback for when it starts.
    server.listen(80, () => {
        Logger.info("Server started on port", "80".blue);
    });
})

