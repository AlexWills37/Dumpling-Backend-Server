const mongodb = require("mongodb");
const fs = require("fs");

require("dotenv").config();

(async () => {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        console.log("Usage: <command> [<args>]");
        console.log(
            "Commands:\n" +
            " - export <sessionid>\n" +
            " - dump <simulation> <platform> <sessionid>\n" +
            " - listDatabases\n" +
            " - listCollectionsInDatabase <database>"
        );
        process.exit(1);
    }
    switch (command.toLowerCase()) {
        case "export":
            if (args.length > 1) {
                await exportSession(args[1]);
            } else {
                console.log("Usage: export <session>");
            }
            break;
        case "dump":
            if (args.length > 3) {
                await dump(args[1], args[2], args[3]);
            } else {
                console.log("Usage: dump <simulation> <platform> <session>");
            }
            break;
        case "listdatabases":
            await listDatabases();
            break;
        case "listcollectionsindatabase":
            if (args.length != 3) {
                await listCollectionsInDatabase(args[1]);
            } else {
                console.log("Usage: listCollectionsInDatabase <database>");
            }
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

async function listDatabases() {
    const mongo = new mongodb.MongoClient(process.env.MongoConnectionURI);
    await mongo.connect();
    const databases = await mongo.db()
        .admin()
        .listDatabases();

    const entries = databases.databases.map(x => x.name)
        .filter(x => !["admin", "local"].includes(x))

    console.log(console.log("Databases: \n" + entries.join("\n")));
    process.exit(1);
}

async function listCollectionsInDatabase(database) {
    const mongo = new mongodb.MongoClient(process.env.MongoConnectionURI);
    await mongo.connect();
    const collections = await mongo.db(database).listCollections().toArray();
    console.log("Collections: \n" + collections.map(x => x.name).join("\n"));
    process.exit(1);
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
    result += Object.keys(entries[0]).slice(1, -1).join(",") + "\n";
    for (const entry of entries) {
        delete entry._id;
        delete entry.session;
        result += Object.values(entry).map(x => format(x)).join(",") + "\n";
    }

    fs.writeFileSync(`${simulation}-${platform}-${session}.csv`, result);
    process.exit(1);
}

async function exportSession(session) {
    const client = new mongodb.MongoClient(process.env.MongoConnectionURI);
    const databases = await client.db().admin().listDatabases();

    let entries;
    let databaseCachedName;
    let collectionCachedName;

    for (const db of databases.databases) {
        const databaseName = db.name;
        const collections = await client.db(databaseName).listCollections().toArray();

        for (const collection of collections) {
            const collectionName = collection.name;
            const documents = await client.db(databaseName).collection(collectionName).find({ session: session }).toArray();

            entries = documents;

            // Break from the nested for loops
            if (entries.length > 0) {
                databaseCachedName = databaseName;
                collectionCachedName = collectionName;
                break;
            }
        }
        if (entries.length > 0) {
            break;
        }
    }

    await client.close();

    // Sort them from earliest to latest
    entries.sort((a, b) => a.timestamp - b.timestamp);

    let result = "";
    result += Object.keys(entries[0]).slice(1, -1).join(",") + "\n";
    for (const entry of entries) {
        delete entry._id;
        delete entry.session;
        result += Object.values(entry).map(x => format(x)).join(",") + "\n";
    }

    // Get the time from the first entry to the last entry, print the time between in minutes and seconds.
    const time = (entries[entries.length - 1].time - entries[0].time) / 1000;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    fs.writeFileSync(`${session}.csv`, result);

    console.log(
        `Exported ${session} to ${session}.csv\n` +
        `\t | Simulation Time: ${minutes} minutes and ${seconds} seconds\n` +
        `\t | Entries: ${entries.length}\n` +
        `\t | Session: ${session}\n` + 
        `\t | Database: ${databaseCachedName}\n` +
        `\t | Collection: ${collectionCachedName}`
    )
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