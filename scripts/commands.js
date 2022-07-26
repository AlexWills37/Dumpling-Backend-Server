const mongodb = require("mongodb");
const fs = require("fs");

require("dotenv").config();

(async () => {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command.toLowerCase()) {
        case "dump":
            if (args.length != 4) {
                await dump(args[1], args[2], args[3]);
            } else {
                console.log("Usage: dump <simulation> <platform> <session>");
            }
            break;
        case "list":
            if (args.length != 2) {
                console.log("Usage: list <simulation | platforms>");
            }
            await list(args[1]);
            break;
        default:
            break;
    }
})();

function format(val) {
    // if an object, convert to string
    // if null, convert to empty string

    if (typeof val === "object") {
        return `${val.x}; ${val.y}; ${val.z}`;
    } else {
        return val || "null";
    }
}

async function dump(simulation, platform, session) {
    const mongo = new mongodb.MongoClient(process.env.MongoConnectionURI);
    await mongo.connect();
    const entries = await mongo.db(simulation)
        .collection(platform)
        .find({ session: session })
        .toArray();

    if (entries.length === 0) {
        console.log("No entries found");
        return;
    }

    let result = "";
    result += Object.keys(entries[0]).slice(1).join(",") + "\n";
    for (const entry of entries) {
        delete entry._id;
        result += Object.values(entry).map(x => format(x)).join(",") + "\n";
    }

    fs.writeFileSync(`${simulation}-${platform}-${session}.csv`, result);
    process.exit(1);
}

async function list(para) {
    const mongo = new mongodb.MongoClient(process.env.MongoConnectionURI);
    await mongo.connect();
    
    const simulations = await mongo.db("simulations").listCollections().toArray();
    const platforms = await mongo.db("platforms").listCollections().toArray();

    if (para === "simulations") {
        console.log(simulations.map(x => x.name).join("\n"));
    } else if (para === "platforms") {
        console.log(platforms.map(x => x.name).join("\n"));
    } else {
        console.log("Usage: list <simulation | platforms>");
    }
}