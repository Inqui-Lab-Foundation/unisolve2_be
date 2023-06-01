import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const certificateCreateSchema = Joi.object().keys({
    mobile: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    certificate_type: Joi.string().valid(...Object.values(constents.certificate_flags.list)).messages({
        'any.only': speeches.CERTIFICATE_INVALID
    }),
    faculty_name: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    organization_name: Joi.string().required().messages({
        'string.empty': speeches.ORG_NAME_REQUIRED
    })
});

export const certificateUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.challenges_flags.list)).required().messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    })
});