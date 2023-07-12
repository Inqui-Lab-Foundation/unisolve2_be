import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const supportTickets = Joi.object().keys({
    query_category: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.QUERY_CATEGORY
    }),
    query_details: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.QUERY_DETAILS
    })
});

export const supportTicketsUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.support_tickets_status_flags.list)).messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    })
});