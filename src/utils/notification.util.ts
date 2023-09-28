import nodemailer from 'nodemailer';
import { constents } from "../configs/constents.config";
import { speeches } from '../configs/speeches.config';
import INotificationUtil from "../interfaces/notification.util.interface";
import { notification } from "../models/notification.model";
import CRUDService from "../services/crud.service";
import logIt from "./logit.util";


//TODO: Required to impliment with EMAIL templates
async function sendEmail(data:any) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.target_audience,
        subject: data.title,
        text: data.message
    };

    try {
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logIt(constents.log_levels.list.ERROR, `${speeches.EMAIL_SEND_ERROR} ErrorObject: ${error}`);
            } else {
                logIt(constents.log_levels.list.INFO, `${speeches.EMAIL_SEND_SUCCESS} bodyObject: ${JSON.stringify({
                    info: info.envelope,
                    mailObject: mailOptions
                })}`);
            }
        });
    } catch (error) {
        console.log(error);
    }    
}


//TODO: Required to impliment with SMS templates
async function sendSMS(phone: string, message: string) { }
export default async function sendNotification(notificationData: INotificationUtil): Promise<any> {
    if(notificationData.notification_type == 'EMAIL') {
        await sendEmail(notificationData);
    }

    try {
        const crudService = new CRUDService();
        const response = await crudService.create(notification, notificationData);
        console.log(response);
        if (!response) {
            logIt(constents.log_levels.list.ERROR, `Error in sending notification. ErrorObject: ${response}`);
            return Promise.reject("Error in sending notification");
        }
        return Promise.resolve(response);
    } catch (error) {
        logIt(constents.log_levels.list.ERROR, `Error in sending notification. ErrorObject: ${error}`);
        return Promise.reject("Error in sending notification");
    }

}
