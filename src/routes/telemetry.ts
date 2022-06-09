import express from "express";
import { ApiResponse } from "../structs/apiresponse.js";
import { Database } from "../structs/database.js";
import { Chunk } from "../types/telemetry.js";

export default function Telemetry(client: Database) {
    const router = express()

    router.get("/chunk:id", (req, res) => {
        // Expect JSON data
        const id = req.params.id;

        // We expect 'Chunk' to be 
    });

    router.get("/payload", async (req, res) => {
        if (!req.body.session || client.sessionExists(req.body.session)) {
            res.json(ApiResponse.error("Missing or invalid session token."));
        }

        const chunk: Chunk = req.body;
        const session = client.getSession(req.body.session);

        session.add(chunk);

    })

    return router;
}