# Communication
Storing telemetry data will have to seperate modes depending on available internet conductivity. **Chunks** and **Payload**.

## Chunks
Communicating telemetry data as chunks will involve two parts, the initialization handshake followed by sending a 'chunk' of data when x number of frames have passed.


### Authentication 
The Initialization handshake will involve making a simple GET request to the webserver. When sent, if the server is active and live **Which it will not be once user testing ends**, will return an object that looks something like this. ``data.session`` is the session key. With each chunk of data, this value must be attached within the "session" field of the chunk request. This key should be collected on simulation start, and used up until to the end of the simulation, as it's simply used to keep track of who the telemetry data chunk belongs to, as there may be many chunks sent from one simulation.

`$ GET https://$TelemetryURL$/session/new `
```json
{
    "status": "OK",
    "time": 1654543469799, 
    "data": {
        "session": "eyJ0IjoxNjU0NTQzNDY5Nzk5LCJzIjo0fQ=="
    }
}
```

### Chunk Format
An example chunk would look like so,
```js
{
    "header": {
        "platform": "Quest2", // Can be "Quest2" OR "Cardboard".
        "simulation": "twizzler", // The name of the simulation.
        "version": "1.0.0", // The version of the simulation.
        "size": 115, // The amount of telemetry entries in this chunk.
        "session": "eyJ0IjoxNjU5MjQwMDk4MjY4LCJzIjo4Fq==" // The unique session key.
    },
    "entries": [
        {
            "name": "string",
            "vec": { x: 0, y: 0, z: 0 } || null,
            "textContent": "string" || null,
            "intContent": 0,
            "time": 35616734212 // The unix time stamp for the entry.
        }
    ]
}```