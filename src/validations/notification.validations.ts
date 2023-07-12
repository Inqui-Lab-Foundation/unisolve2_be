import Joi, { object } from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

const send = Joi.object().keys({
    notification_type: Joi.string()
        .valid(...Object.values(constents.notification_types.list))
        .required()
        .messages({
            'any.only': speeches.NOTIFICATION_TYPE_INVALID,
            'string.empty': speeches.NOTIFICATION_TYPE_REQUIRED
        }),

    target_audience: Joi.string()
        .required()
        .messages({
            'string.empty': speeches.NOTIFICATION_TARGET_AUDIENCE_REQUIRED
        }),

    title: Joi.string()
        .required()
        .messages({
            'string.empty': speeches.NOTIFICATION_TITLE_REQUIRED,
        }),
    image: Joi.string().allow(null, ''),
    message: Joi.string()
        .required()
        .messages({
            'string.empty': speeches.NOTIFICATION_MESSAGE_REQUIRED,
        }),
    status: Joi.string()
        .valid(...Object.values(constents.notification_status_flags.list))
        .required()
        .messages({
            'any.only': speeches.NOTIFICATION_STATUS_INVALID,
            'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
        }),
});

export default { send };