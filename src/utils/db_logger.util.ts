import { log } from "../models/log.model";
import CRUDService from "../services/crud.service";
import ILogAttributes from "../interfaces/log.model.interface";

/**
 * store the logs in database.
 * @param logBody object
 * @deprecated
 */
export default async function logintodb(logBody: any): Promise<any> {
    const crudService = new CRUDService();
    const res = await crudService.create(log , logBody);
}
