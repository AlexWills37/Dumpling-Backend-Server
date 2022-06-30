import express from "express";
import Logger from "../logger.js";
import { ApiResponse } from "../structs/apiresponse.js";
import { Database } from "../structs/database.js";

export default function Exports(db: Database) {
    const router = express.Router();

    // Get a session id
    router.get("/get/:sessionId/:format", (req, res) => {
        if (!req.params.sessionId) {
            return res.json(ApiResponse.error("Missing session id."));
        }

        if (!req.params.format) { 
            return res.json(ApiResponse.error("Missing format."));
        }

        Logger.info(`Session ${req.params.sessionId} requested with format ${req.params.format}`);

        // To hold the response data;
        const container: any = {};

        container.session = db.col("sessions").findOne({
            _id: req.params.sessionId
        });

        container.entries = db.col("data").find({
            session: req.params.sessionId
        }).sort({
            timestamp: 1
        });

        // Send the response
        res.send(
            ApiResponse.ok(container)
        );

        res.send("OK")
    });

    return router;
}