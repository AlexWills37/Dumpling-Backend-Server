import express from "express";
import { ApiResponse } from "../structs/apiresponse.js";
import { Database } from "../structs/database.js";

export default function Session(db: Database) {
    const router = express.Router();

    router.get("/new", (req, res) => {
        res.send(
            ApiResponse.ok({
                session: db.getSession().getToken()
            })
        );
    });

    return router;
}