import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const translationSchema = Joi.object().keys({
    from_locale: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    to_locale: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    key: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    value: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    })
});

export const translationUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
    from_locale: Joi.string().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    to_locale: Joi.string().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    key: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    value: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    })
});