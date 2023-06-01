import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const organizationSchema = Joi.object().keys({
    details: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    organization_code: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    organization_name: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
});

export const organizationRawSchema = Joi.object().keys({
    organization_code: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.ORG_CODE_REQUIRED
    }),
    organization_name: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.ORG_NAME_REQUIRED
    }),
    district: Joi.string().messages({
        'string.empty': speeches.DISTRICT_REQ
    }),
    principal_name: Joi.any(),
    principal_mobile: Joi.any(),
    principal_email: Joi.any(),
    city: Joi.any(),
    state: Joi.any(),
    country: Joi.any(),
    status: Joi.string().valid(...Object.values(constents.organization_status_flags.list))
});

export const organizationUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.organization_status_flags.list)).required().messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
    organization_code: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.ORG_CODE_REQUIRED
    }),
    organization_name: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.ORG_NAME_REQUIRED
    }),
    district: Joi.string().messages({
        'string.empty': speeches.DISTRICT_REQ
    }),
    principal_name: Joi.any(),
    principal_mobile: Joi.any(),
    principal_email: Joi.any(),
    city: Joi.any(),
    state: Joi.any(),
    country: Joi.any()
});
export const organizationCheckSchema = Joi.object().keys({
    organization_code: Joi.string().required().messages({
        'string.empty': speeches.ORG_CODE_REQUIRED
    }),
});