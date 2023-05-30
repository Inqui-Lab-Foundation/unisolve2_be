
  import Joi from 'joi';

  export const mentorTopicProgressSchema = Joi.object().keys({
      user_id: Joi.string().required(),
      mentor_course_topic_id: Joi.string().required(),
      status: Joi.string().valid('Completed', 'Incomplete'),
  });
  
  export const mentorTopicProgressUpdateSchema = Joi.object().keys({
      status: Joi.string().valid('Completed', 'Incomplete'),
  });

