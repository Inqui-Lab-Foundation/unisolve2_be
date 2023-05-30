import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const quizQuestionSchema = Joi.object().keys({
   
    quiz_id: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    question_no: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    question: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_a: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_b: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_c: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_d: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    correct_ans: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    level: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    type: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    redirect_to: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    // question_image: Joi.string().required().messages({
    //     'string.empty': speeches.NAME_REQUIRED
    // }),
    msg_ans_correct: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    msg_ans_wrong: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    // ar_image_ans_correct: Joi.string().required().messages({
    //     'string.empty': speeches.NAME_REQUIRED
    // }),
    ar_video_ans_correct: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    // accimg_ans_correct: Joi.string().required().messages({
    //     'string.empty': speeches.NAME_REQUIRED
    // }),
    // ar_image_ans_wrong: Joi.string().required().messages({
    //     'string.empty': speeches.NAME_REQUIRED
    // }),
    ar_video_ans_wrong: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    // accimg_ans_wrong: Joi.string().required().messages({
    //     'string.empty': speeches.NAME_REQUIRED
    // }),


});

export const quizQuestionSchemaUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    }),
    quiz_id: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    question_no: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    question: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_a: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_b: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_c: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    option_d: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    correct_ans: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    level: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    type: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    redirect_to: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    question_image: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    msg_correct: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    msg_wrong: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    ar_image_ans_correct: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    ar_video_ans_correct: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    accimg_ans_correct: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    ar_image_ans_wrong: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    ar_video_ans_wrong: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    accimg_ans_wrong: Joi.string().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
});