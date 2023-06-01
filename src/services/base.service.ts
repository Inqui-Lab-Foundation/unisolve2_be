import { badRequest, internal, unauthorized } from "boom";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import { course_topic } from "../models/course_topic.model";
import { reflective_quiz_question } from "../models/reflective_quiz_question.model";
import { reflective_quiz_response } from "../models/reflective_quiz_response.model";
import CRUDService from "./crud.service";

export default class BaseService {
    crudService: CRUDService = new CRUDService();
}


