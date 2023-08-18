import { createLogger, format } from 'winston';
import { ReqInterface } from '../interfaces/req.interface';
import winston = require('winston');
import path = require('path');
const { combine, timestamp, label, prettyPrint } = format;

class DataDog {
    hostname: any;
    serviceName: any;
    source: any;
    logger: any;

    constructor(req: ReqInterface) {
        try {
            if (req.hasOwnProperty('originalUrl')) {
                this.serviceName = req.originalUrl;
            } else {
                this.serviceName = req.url;
            }
            this.source = "NodeJS";
            const logDirectoryPath = path.resolve(process.cwd() + '/logs');
            this.logger = createLogger({
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                format: combine(
                    label({ label: 'tray&tracker!' }),
                    timestamp(),
                    format.json(),
                    prettyPrint(),
                    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
                ),
                transports:
                    [
                        //
                        // - Write to all logs with level `info` and below to `combined.log` 
                        // - Write all logs error (and below) to `error.log`.
                        //
                        new winston.transports.Console(),

                        new winston.transports.File({ filename: `${logDirectoryPath}/error.log`, level: 'error' }),
                        new winston.transports.File({ filename: `${logDirectoryPath}/combined.log`, level: 'info' })
                    ],
            });
        } catch (error) {
            console.log("error in constructing logger", error);
        }


    }

    error(message: string, error: any) {
        if (!this.logger) {
            console.log(message, error);
            return;
        }
        console.log(message, error);
        if (error.hasOwnProperty('message')) {
            this.logger.error({
                api: this.serviceName,
                message: message,
                error: error.message
            });
            return;
        }
        this.logger.error({
            api: this.serviceName,
            message: message,
            error: error
        });
    }

    info(message: string, data: any) {
        if (!this.logger) {
            console.log(message, data);
            return;
        }
        console.log(message, data);
        this.logger.info({
            api: this.serviceName,
            message: message,
            data: data
        });
    }

    warn(message: string, data: any) {
        if (!this.logger) {
            console.log(message, data);
            return;
        }
        console.log(message, data);
        this.logger.warn({
            api: this.serviceName,
            message: message,
            data: data
        });
    }

}

export default DataDog;