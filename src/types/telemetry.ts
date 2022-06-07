export interface Header {
    platform: "Quest2" | "Cardboard";
    version: string;
    size: number;
}

export interface Payload {
    header: Header;
    entries: TelemetryEntry[]
}

export interface TelemetryEntry {
    time: number,
    parameter: string,
    values: { [key: string]: number | string }
}

/**
 * 'Chunk' is a standalone chunk of telemetry data.
 */
export interface Chunk {
    header: Header,
    session: string,
    sendTime: number,
    entries: TelemetryEntry[]
}