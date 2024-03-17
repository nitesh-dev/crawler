import winston from "winston";

export default class Logger {

    private logger: winston.Logger;

    constructor(private name: string = '') {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                        winston.format.printf(info => {
                            return `${this.name}${info.level}: ${info.message}`;
                        })
                    )
                }),
                new winston.transports.File({ filename: 'combined.log' })
            ]
        });

        if (this.name) this.name = `[${this.name}.ts] `;
    }


    info(message: string) {
        this.logger.info(message);
    }

    error(message: string) {
        this.logger.error(message);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    silly(message: string) {
        this.logger.silly(message);
    }

}


// What is the name of the town/city where you were born?
// In what city or town was your first job?
// What high school did you attend?

// f8ae7889-95ca-ee11-a820-001dd808b51c