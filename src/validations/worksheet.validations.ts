
import Joi from 'joi';

export const worksheetSchema = Joi.object().keys({
    description: Joi.string().allow(null, ''),
});

export const worksheetUpdateSchema = Joi.object().keys({
    status: Joi.string().valid('ACTIVE', 'INACTIVE'),
});

