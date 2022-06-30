export interface Header {
    platform: "Quest2" | "Cardboard";
    simulation: string;
    session: string;
    version: string;
}

export interface Payload {
    header: Header;
    entries: TelemetryEntry[]
}

export interface TelemetryEntry {
    time: number,
    parameter: string,
    values: {[key: string] : any}
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

declare module "express" {
    interface Request {
        json: {[key: string]: any};
    }
}