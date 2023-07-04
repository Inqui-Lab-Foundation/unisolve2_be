import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const latest_newsSchema = Joi.object().keys({
    details: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    category: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    url: Joi.string(),
    file_name:Joi.string(),
    new_status:Joi.string()
});

export const latest_newsUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
    category: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    details: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    url: Joi.string(),
    file_name:Joi.string(),
    new_status:Joi.string()
});