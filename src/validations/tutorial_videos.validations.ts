import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const tutorialVideosSchema = Joi.object().keys({
    video_stream_id: Joi.string().required().messages({
        'string.empty': speeches.VIDEO_STREAM_ID_REQUIRED
    }),
    title:Joi.string().allow(null, ''),
    desc: Joi.string().allow(null, ''),
    icon: Joi.binary().allow(null, ''),
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
    type: Joi.string().valid(...Object.values(constents.tut_videos_type_flags.list)).messages({
        'any.only': speeches.TYPE_INVALID,
        'string.empty': speeches.TYPE_INVALID
    }),
});

export const tutorialVideosUpdateSchema = Joi.object().keys({
    video_stream_id: Joi.string().messages({
        'string.empty': speeches.VIDEO_STREAM_ID_REQUIRED
    }),
    title:Joi.string().allow(null, ''),
    desc: Joi.string().allow(null, ''),
    icon: Joi.binary().allow(null, ''),
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
    type: Joi.string().valid(...Object.values(constents.tut_videos_type_flags.list)).messages({
        'any.only': speeches.TYPE_INVALID,
        'string.empty': speeches.TYPE_INVALID
    }),
});