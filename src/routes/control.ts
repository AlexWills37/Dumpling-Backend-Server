import express from "express";
import { GLOBALS } from "../index.js";
import Logger from "../logger.js";
import { ApiResponse } from "../structs/apiresponse.js";
import { Database } from "../structs/database.js";

function getFormattedUptime() {
    const secs = process.uptime();
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    let formatted = "";

    if (days > 0) {
        formatted += `${days} days, `;
    }

    if (hours > 0) {
        formatted += `${hours % 24} hours, `;
    }

    if (mins > 0) {
        formatted += `${mins % 60} minutes, `;
    }

    if (secs > 0) {
        formatted += `${secs % 60} seconds`;
    }

    return formatted;
}

export default function Control(db: Database) {
    const router = express.Router();

    router.get("/status", (req, res) => {
        res.send(`
            -----= [ Server Status ] =-----
            Status: ${"online".green}
            Active Since: ${getFormattedUptime().green}
            Request Count: ${GLOBALS.packetsRecieved.toString().green}
            -----= [ DB Status ] =-----
            N/A
        `)
    })

    return router;
}