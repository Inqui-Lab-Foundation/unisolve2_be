import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const supportTicketsReplies = Joi.object().keys({
    support_ticket_id: Joi.number().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    reply_details: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.QUERY_DETAILS
    })
});

export const supportTicketsRepliesUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    })
});