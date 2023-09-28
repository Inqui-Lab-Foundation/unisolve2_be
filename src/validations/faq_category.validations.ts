import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const faqCategorySchema = Joi.object().keys({
   
    category_name: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.NAME_REQUIRED
    })
});

export const faqCategorySchemaUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    }),
    category_name: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    })
});