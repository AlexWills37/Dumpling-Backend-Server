import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import Session from "./routes/session.js";
import Telemetry from "./routes/telemetry.js";
import { Database } from "./structs/database.js";

const server = express();

dotenv.config();
server.use(express.json());

// Setup
MongoClient.connect(process.env.MongoConnectionURI as string)
.then((client) => { 
    const db = new Database(client);

    server.use("/session", Session(db));
    server.use("/telemetry", Telemetry(db));

    server.listen(80, () => {
        console.log("Server started.");
    });
})

