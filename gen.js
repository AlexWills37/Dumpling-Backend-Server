const fs = require("fs");

function genEntry() {
    return {
        parameter: "Look",
        values: [
            Math.random() * 100, // x
            Math.random() * 100, // y
            Math.random() * 100, // z
        ]
    }
}

function gen(size) {
    const obj = {
        platform: "Quest2",
        version: 1,
        size: 0,
        entries: []
    };

    for (let i = 0; i < size; i++) {
        obj.entries.push(genEntry());
    }

    return obj;
}

fs.writeFileSync("tmp.json", JSON.stringify(gen(10 * 60 * 2)));

// const startTime = Date.now();
// const obj = JSON.parse(fs.readFileSync("./tmp.json").toString("utf8"));
// const totalTime = iDate.now() - startTime;

// console.log("Serialization took " + totalTime + "ms");

// console.log(obj);