import {Request, Response, NextFunction} from 'express';
import database from '../utils/dbconnection.util';

export default async function healthCheckMiddleware(
    req: Request, 
    res: Response, 
    next: NextFunction
    ): Promise<void>{
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            DatabaseStatus: '',
            timestamp: Date.now()
        };
        try {
            await database.authenticate().then(() => healthcheck.DatabaseStatus = 'Active');
            // storeLogsToDatabase(req, healthcheck, 'success')
            res.status(200).send(healthcheck);
        } catch (error: any) {
            healthcheck.message = error;
            // storeLogsToDatabase(req, error.message, 'failed')
            res.status(503).send(error);
        }
}