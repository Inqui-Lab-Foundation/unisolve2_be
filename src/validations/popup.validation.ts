import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const popupSchema = Joi.object().keys({
    on_off: Joi.string().trim().min(1),
    url: Joi.string().trim().min(1)
});

export const popupUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
    on_off:Joi.string(),
    url: Joi.string()
});