import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const badgeSchema = Joi.object().keys({
    name: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    desc: Joi.string().allow(null, ''),
    icon: Joi.binary().allow(null, ''),
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
});

export const badgeUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
    name: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    desc: Joi.string().allow(null, ''),
    icon: Joi.binary().allow(null, ''),
});