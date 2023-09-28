import { constents } from "../configs/constents.config";
import logintodb from "./db_logger.util";
import logger from "./logger";

/**
 * store the logs.
 * @param flag type of Log sting
 * @param message message string
 * @param req Request object
 * @param res Response object
 * @deprecated
 */
export default async function logIt(flag: string, message: string, req: any= {}, res: any= {}): Promise<any> {
    // const logBody = {
    //     log_type: flag,
    //     message: message,
    //     ip: req.ip || "",
    //     method: req.method,
    //     route: req.path || "",
    //     status_code: res.statusCode || "",
    //     token: (req.headers)? req.headers.authorization || "" : "",
    //     headers: JSON.stringify(req.headers || {}),
    //     req_body: JSON.stringify(req.body || {}),
    //     res_body: JSON.stringify(res.body || {}),
    //     user_details: JSON.stringify(res.locals || {})
    // };
    // await logintodb(logBody);
    
    // flag = (flag === constents.log_levels.list.INBOUND || flag === constents.log_levels.list.OUTBOUND)? constents.log_levels.list.INFO : flag;
    // await logger.log(flag.toLowerCase(), message);
}
