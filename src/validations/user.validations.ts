import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const userSchema = Joi.object().keys({
    username: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.USER_USERNAME_REQUIRED
    }),
    full_name: Joi.string().trim().min(1).regex(constents.ALPHA_NUMERIC_PATTERN).required().messages({
        'string.empty': speeches.USER_FULLNAME_REQUIRED
    }),
    role: Joi.string().required().messages({
        'string.empty': speeches.USER_ROLE_REQUIRED
    }),
    team_id: Joi.string().required().messages({
        'string.empty': speeches.USER_TEAMID_REQUIRED
    }),
    qualification: Joi.string().required().messages({
        'string.empty': speeches.USER_QUALIFICATION_REQUIRED
    })
});
export const userUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)),
    full_name: Joi.string().trim().min(1).regex(constents.ALPHA_NUMERIC_PATTERN),
    Age: Joi.string(),
    Grade: Joi.string(),
    team_id: Joi.string(),
    Gender: Joi.string().valid(...Object.values(constents.gender_flags.list))
});
export const UpdateMentorUsernameSchema = Joi.object().keys({
    user_id: Joi.string().required().messages({
        'string.empty': speeches.USER_USERID_REQUIRED
    }),
    mobile: Joi.string().required().messages({
        'string.empty': speeches.MOBILE_NUMBER_REQUIRED
    }),
    username: Joi.string().trim().min(1).required().messages({
        'string.empty': speeches.USER_EMAIL_REQUIRED
    })
});