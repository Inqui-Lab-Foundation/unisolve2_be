
  import Joi from 'joi';

  export const courseTopicSchema = Joi.object().keys({
      course_module_id: Joi.string().required(),
      topic_type_id: Joi.string().required(),
      title: Joi.string().trim().min(1).required(),
      topic_type: Joi.string().required().valid("VIDEO","WORKSHEET","QUIZ"),
  });
  
  export const courseTopicUpdateSchema = Joi.object().keys({
      status: Joi.string().valid('Completed', 'Incomplete'),
  });

