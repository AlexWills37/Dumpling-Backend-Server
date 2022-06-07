import express from "express";
import { ApiResponse } from "../structs/apiresponse.js";
import { Database } from "../structs/database.js";

export default function Telemetry(client: Database) {
    const router = express()

    router.get("/chunk:id", (req, res) => {
        // Expect JSON data
        const id = req.params.id;

        // We expect 'Chunk' to be 
    });

    router.get("/payload", (req, res) => {
        if (!req.body.session || client.sessionExists(req.body.session)) {
            res.json(ApiResponse.error("Missing or invalid session token."));
        }

        const session = client.getSession(req.body.session);
    
    })

    return router;
}