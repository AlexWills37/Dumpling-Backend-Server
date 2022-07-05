import "colors";

export default class Logger {
    static level = 4;

    /**
     * Logs a message to the console following the predefined logging type
     * @param level The level of the message to log
     * @param args The arguments to print (joined together)
     */
    static log(level: number, ...args: any[]) {
        if (level <= Logger.level) {
            console.log(
                `[${new Date().toLocaleTimeString()}]`.green,
                ...args
            );
        }
    }

    /**
     * Creates a function that logs middleware.
     * @returns The middleware logging function.
     */
    static createLoggerMiddleware(withHeaders: boolean = false) {
        /**
         * Intercepts requests, logging their basic information to the console.
         * @param req The request object
         * @param res The response object
         * @param next A function to invoke the next middleware
         */
        return function middleware(req: any, res: any, next: any) {
            if (withHeaders) {
                Logger.log(4, `${req.method} ${req.url}\n` + Object.keys(req.headers).map(x => `\t${x}: ${req.headers[x]}`).join("\n"));
            } else {
                Logger.log(4, `${req.method} ${req.url}\n`);
            }

            next();
        }
    }

    /**
     * Log a green message with a level of 3 
     * @param args The arguments to log
     */
    static info(...args: string[]) {
        Logger.log(3, ...args.map(x => x.green));
    }

    /**
     * Log a yellow message with a level of 2
     * @param args The arguments to log
     */
    static warn(...args: string[]) {
        Logger.log(2, ...args.map(x => x.yellow));
    }

    /**
     * Log a red message with a level of 1
     * @param args The arguments to log
     */
    static error(...args: string[]) {
        Logger.log(1, ...args.map(x => x.red));
    }

}