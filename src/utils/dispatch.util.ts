import { Response } from 'express'
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

/**
 * Dispatcher build the response object
 * @param res API response object
 * @param data data object
 * @param status status string
 * @param message message string
 * @param status_code status code number
 * @returns object
 */
export default function dispatcher(res: Response, data: any, status: string = "success", message: string = "OK", status_code: number = 200): any {
    var resObj: any = {
        status: status_code,
        status_type: 'success',
        message: message,
        count: null,
        data: null
    }
    if (data) {
        if (data.length === undefined) {
            resObj.data = [data];
            resObj.count = resObj.data.length;
        }
        else if (typeof data === 'string') {
            resObj.data = data;
        } else if (data.length > 0) {
            resObj.data = data;
            resObj.count = resObj.data.length;
        }
        else {
            resObj.data = data;
            resObj.count = resObj.data.length;
        }
    }

    switch (status) {
        case "created":
            if (status_code == 200) resObj.status = 201;
            break;
        case "error":
            if (status_code == 200) resObj.status = 404;
            resObj.status_type = 'error';
            if (message == 'OK') resObj.message = speeches.DATA_NOT_FOUND;
            break;
        case "validation":
            if (status_code == 200) resObj.status = 400;
            resObj.status_type = 'error';
            if (message == 'OK') resObj.message = speeches.DATA_NOT_FOUND;
            delete resObj.data;
            resObj.errors = data;
            break;
        default:
            break;
    }
    if (res && res.locals && res.locals.translationService) {
        if (res.locals.translationService.currentLocale != constents.translations_flags.default_locale) {
            resObj = res.locals.translationService.translateEntireObj(resObj);
        }
    }
    //@deprecated: logging
    // await logIt(flag, ((flag==constents.log_levels.list.INBOUND)? "Inbound request" : "Outbound responce"), req, res);

    return resObj;
}
