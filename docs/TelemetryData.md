# Communication
Storing telemetry data will have to seperate modes depending on available internet conductivity. **Chunks** and **Payload**.

## Chunks
Communicating telemetry data as chunks will involve two parts, the initialization handshake followed by sending a 'chunk' payload whenever possible.

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
```json
{
    "header": {
        "platform": "Quest2", // Can be "Quest2" OR "Cardboard".
        "version": "1.0.0", // The version of the simulation.
        "size": 331, // The amount of telemetry entries in this chunk.
    },

    "session": "eyJ0IjoxNjU0NTQzNDY5Nzk5LCJzIjo0fQ==", // The session key taken from above
    "sendTime": 1654543713844, // The UNIX Timestamp for when this data was sent, to make sure data chunks are in order.
    "entries": [
        {
            "parameter": "look", // The name of the parameter. In this case, look position update.
            "values": [ // An arbitrary list of values relating to the parameter.
                133.361, 
                74.227,
                -179.397
            ]
        },
        {
            "parameter": "interact",
            "values": [
                {
                    "entityName": "manatee1" 
                }
            ]
        },
        {
            "parameter": "interact",
            "values": [
                {
                    "entityName": "seagrass13" 
                }
            ]
        },

        ... // And so on
    ]
}