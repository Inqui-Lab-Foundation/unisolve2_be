import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const courseModuleSchema = Joi.object().keys({
    course_id: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    title: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.DESCRIPTION_REQUIRED
    })
});

export const courseModuleUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    })
});