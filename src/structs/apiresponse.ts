export class ApiResponse {
    /**
     * Cosntructs an 'OK' Object with the given data.
     * @param data The data to send back to the client.
     * @returns The Resposne Object.
     */
    public static ok(data: any) {
        return {
            status: "ok",
            time: Date.now(),
            data: data
        };
    }

    /**
     * Constructs an Error Object with the given message.
     * @param error The error message to send back to the client.
     * @returns The Response Object.
     */
    public static error(error: string) {
        return {
            status: "error",
            time: Date.now(),
            error: error
        };
    }
}