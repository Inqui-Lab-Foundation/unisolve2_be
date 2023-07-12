import { badData, badRequest, internal, unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import { invalid } from "joi";
import { includes } from "lodash";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import validationMiddleware from "../middlewares/validation.middleware";
import { course_topic } from "../models/course_topic.model";
import { mentor_course_topic } from "../models/mentor_course_topic.model";
import { quiz_question } from "../models/quiz_question.model";
import { quiz_response } from "../models/quiz_response.model";
import { user_topic_progress } from "../models/user_topic_progress.model";
import { video } from "../models/video.model";
import dispatcher from "../utils/dispatch.util";
import logger from "../utils/logger";
import { quizNextQuestionSchema, quizSchema, quizSubmitResponseSchema, quizUpdateSchema } from "../validations/quiz.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class QuizController extends BaseController {

    model = "quiz";

    protected initializePath(): void {
        this.path = '/quiz';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(quizSchema, quizUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(this.path + "/:id/nextQuestion/", this.getNextQuestion.bind(this));
        this.router.post(this.path + "/:id/response/", validationMiddleware(quizSubmitResponseSchema), this.submitResponse.bind(this));
        super.initializeRoutes();
    }

    /**
     * 
     * Note this api gets used by two journeys .. student as well mentor and both have diff logics and so a fw assumptions have been made do read all comments in the function below 
     * @param req 
     * @param res 
     * @param next 
     */
    protected async getNextQuestion(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const quiz_id = req.params.id;
            const paramStatus: any = req.query.status;
            const user_id = res.locals.user_id;
            let isMentorCourse = false;
            if (!quiz_id) {
                throw badRequest(speeches.QUIZ_ID_REQUIRED);
            }
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }
            //check if the given quiz is a valid topic
            const curr_topic = await this.crudService.findOne(course_topic, { where: { "topic_type_id": quiz_id, "topic_type": "QUIZ", status: 'ACTIVE' } })
            if (!curr_topic || curr_topic instanceof Error) {

                //here we have made a mjor assumption that mentor quiz_id and student quiz ids will be diff and that one quiz_id cannot be added in both student and mentor course_topic tables(these are two diff tables) , if u do so it will be considered as student course api
                const curr_topic = await this.crudService.findOne(mentor_course_topic, { where: { "topic_type_id": quiz_id, "topic_type": "QUIZ" } })
                if (!curr_topic || curr_topic instanceof Error) {
                    throw badRequest("INVALID TOPIC");
                }
                isMentorCourse = true;
                // console.log("isMentorCourse",isMentorCourse)
            }
    
            const quizRes = await this.crudService.findOne(quiz_response, { where: { quiz_id: quiz_id, user_id: user_id } });
            if (quizRes instanceof Error) {
                throw internal(quizRes.message)
            }
            let whereClauseStatusPart: any = {}
            let boolStatusWhereClauseRequired = false;
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    boolStatusWhereClauseRequired = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    boolStatusWhereClauseRequired = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                boolStatusWhereClauseRequired = true;
            }
            let level = "HARD"
            let question_no = 1
            let nextQuestion: any = null;
            // console.log("user_id",user_id);
            // console.log("quizRes",quizRes);
            if (quizRes) {
                //TOOO :: implement checking response and based on that change the 
                let user_response: any = {}
                user_response = JSON.parse(quizRes.dataValues.response);
                // console.log(user_response);
                let questionNosAsweredArray = Object.keys(user_response);
                questionNosAsweredArray = questionNosAsweredArray.sort((a, b) => (Number(a) > Number(b) ? -1 : 1));
                // console.log(questionNosAsweredArray)
                const noOfQuestionsAnswered = Object.keys(user_response).length
                // console.log(noOfQuestionsAnswered)
                const lastQuestionAnsewered = user_response[questionNosAsweredArray[0]]//we have assumed that this length will always have atleast 1 item ; this could potentially be a source of bug, but is not since this should always be true based on above checks ..
                if (lastQuestionAnsewered.selected_option == lastQuestionAnsewered.correct_answer ) {
                    question_no = lastQuestionAnsewered.question_no + 1;
                    // console.log("came here1");

                } else if(!isMentorCourse){// converted to else if from else to take into account diff behaviour of mentor course which is it doesnt have hard medium easy instead it will have only one question per question no which is hard
                    // console.log("came here2");

                    question_no = lastQuestionAnsewered.question_no;
                    if (lastQuestionAnsewered.level == "HARD") {
                        level = "MEDIUM"
                    } else if (lastQuestionAnsewered.level == "MEDIUM") {
                        level = "EASY"
                    } else if (lastQuestionAnsewered.level == "EASY") {
                        question_no = lastQuestionAnsewered.question_no + 1;
                        level = "HARD"
                    }
                }else{
                    // console.log("came here3");
                    //since this is mentor quiz id hence next question will not advance to easy medium instead will remain on same question untill answered correctly
                    question_no = lastQuestionAnsewered.question_no+1;
                    // console.log(lastQuestionAnsewered.question_no);
                    level = "HARD"

                }
            }
    
            const nextQuestionsToChooseFrom = await this.crudService.findOne(quiz_question, {
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        { quiz_id: quiz_id },
                        { level: level },
                        { question_no: question_no },
                    ]
    
                }
            })
    
            if (nextQuestionsToChooseFrom instanceof Error) {
                throw internal(nextQuestionsToChooseFrom.message)
            }
            if (nextQuestionsToChooseFrom) {
                let resultQuestion: any = {}
                let optionsArr = []
                if (nextQuestionsToChooseFrom.dataValues.option_a) {
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_a)
                }
                if (nextQuestionsToChooseFrom.dataValues.option_b) {
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_b)
                }
                if (nextQuestionsToChooseFrom.dataValues.option_c) {
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_c)
                }
                if (nextQuestionsToChooseFrom.dataValues.option_d) {
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_d)
                }
    
    
                resultQuestion["quiz_id"] = nextQuestionsToChooseFrom.dataValues.quiz_id;
                resultQuestion["quiz_question_id"] = nextQuestionsToChooseFrom.dataValues.quiz_question_id;
                resultQuestion["question_no"] = nextQuestionsToChooseFrom.dataValues.question_no;
                resultQuestion["question"] = nextQuestionsToChooseFrom.dataValues.question;
                resultQuestion["question_image"] = nextQuestionsToChooseFrom.dataValues.question_image;
                resultQuestion["question_icon"] = nextQuestionsToChooseFrom.dataValues.question_icon;
                resultQuestion["options"] = optionsArr;
                resultQuestion["level"] = nextQuestionsToChooseFrom.dataValues.level;
                resultQuestion["type"] = nextQuestionsToChooseFrom.dataValues.type;
    
                res.status(200).send(dispatcher(res,resultQuestion))
            } else {
                //update worksheet topic progress for this user to completed..!!
                // if (!boolStatusWhereClauseRequired ||
                    // (boolStatusWhereClauseRequired && paramStatus == "ACTIVE")) {
                    // const updateProgress = await this.crudService.create(user_topic_progress, { "user_id": user_id, "course_topic_id": curr_topic.course_topic_id, "status": "COMPLETED" })
                // }
    
                //send response that quiz is completed..!!
                res.status(200).send(dispatcher(res,"Quiz has been completed no more questions to display"))
            }
        }catch(err){
            next(err)
        }
        

    }

    protected async submitResponse(req: Request, res: Response, next: NextFunction) {
        try {

            const quiz_id = req.params.id;

            const { quiz_question_id  } = req.body;
            let selected_option = req.body.selected_option;
            selected_option = res.locals.translationService.getTranslationKey(selected_option)
            // console.log(selected_option)
            const user_id = res.locals.user_id;
            if (!quiz_id) {
                throw badRequest(speeches.QUIZ_ID_REQUIRED);
            }
            if (!quiz_question_id) {
                throw badRequest(speeches.QUIZ_QUESTION_ID_REQUIRED);
            }

            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }

            const questionAnswered = await this.crudService.findOne(quiz_question, { where: { quiz_question_id: quiz_question_id } });
            if (questionAnswered instanceof Error) {
                throw internal(questionAnswered.message)
            }
            if (!questionAnswered) {
                throw badData("Invalid Quiz question id")
            }

            let topic_to_redirect_to = null;
            if(questionAnswered.dataValues.redirect_to){
                topic_to_redirect_to = await this.crudService.findOne(course_topic,{
                    where:{
                        course_topic_id:questionAnswered.dataValues.redirect_to
                    },
                    include: [{
                        model: video,
                        as: 'video',
                        required:false
                    }]
                })
            }
            if(topic_to_redirect_to instanceof Error){
                console.log(topic_to_redirect_to);
                topic_to_redirect_to = null
            }

            const quizRes = await this.crudService.findOne(quiz_response, { where: { quiz_id: quiz_id, user_id: user_id } });
            if (quizRes instanceof Error) {
                throw internal(quizRes.message)
            }
            // console.log(quizRes);
            let dataToUpsert: any = {}
            dataToUpsert = { quiz_id: quiz_id, user_id: user_id, updated_by: user_id }

            //check if question was ansered correctly
            let hasQuestionBeenAnsweredCorrectly = false;
            if (questionAnswered.type == "TEXT" || questionAnswered.type == "DRAW") {
                hasQuestionBeenAnsweredCorrectly = true;
            } else if (!questionAnswered.correct_ans || questionAnswered.correct_ans == "(())" || questionAnswered.correct_ans == "") {
                hasQuestionBeenAnsweredCorrectly = true;
            }
            else {
                hasQuestionBeenAnsweredCorrectly = selected_option == questionAnswered.correct_ans
            }

            let responseObjToAdd: any = {}
            responseObjToAdd = {
                ...req.body,
                question: questionAnswered.dataValues.question,
                correct_answer: questionAnswered.dataValues.correct_ans,
                level: questionAnswered.dataValues.level,
                question_no: questionAnswered.dataValues.question_no,
                is_correct: hasQuestionBeenAnsweredCorrectly
            }

            let user_response: any = {}
            if (quizRes) {
                // console.log(quizRes.dataValues.response);
                user_response = JSON.parse(quizRes.dataValues.response);
                user_response[questionAnswered.dataValues.question_no] = responseObjToAdd;

                dataToUpsert["response"] = JSON.stringify(user_response);

                const resultModel = await this.crudService.update(quizRes, dataToUpsert, { where: { quiz_id: quiz_id, user_id: user_id } })
                if (resultModel instanceof Error) {
                    throw internal(resultModel.message)
                }
                let result: any = {}
                result = resultModel.dataValues
                result["is_correct"] = responseObjToAdd.is_correct;
                if (responseObjToAdd.is_correct) {
                    result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                    result["ar_image"] = questionAnswered.dataValues.ar_image_ans_correct;
                    result["ar_video"]= questionAnswered.dataValues.ar_video_ans_correct;
                    result["accimg"] = questionAnswered.dataValues.accimg_ans_correct;
                } else {
                    result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                    result["ar_image"] = questionAnswered.dataValues.ar_image_ans_wrong;
                    // result["ar_video"]= questionAnswered.dataValues.ar_video_ans_wrong;
                    result["ar_video"]= topic_to_redirect_to
                    result["accimg"] = questionAnswered.dataValues.accimg_ans_wrong;
                }
                result["redirect_to"] = topic_to_redirect_to;
                res.status(200).send(dispatcher(res,result));
            } else {

                user_response[questionAnswered.dataValues.question_no] = responseObjToAdd;

                dataToUpsert["response"] = JSON.stringify(user_response);
                dataToUpsert = { ...dataToUpsert, created_by: user_id }

                const resultModel = await this.crudService.create(quiz_response, dataToUpsert)
                if (resultModel instanceof Error) {
                    throw internal(resultModel.message)
                }
                let result: any = {}
                result = resultModel.dataValues
                result["is_correct"] = responseObjToAdd.is_correct;
                if (responseObjToAdd.is_correct) {
                    result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                    result["ar_image"] = questionAnswered.dataValues.ar_image_ans_correct;
                    result["ar_video"]= questionAnswered.dataValues.ar_video_ans_correct;
                    result["accimg"] = questionAnswered.dataValues.accimg_ans_correct;
                } else {
                    result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                    result["ar_image"] = questionAnswered.dataValues.ar_image_ans_wrong;
                    // result["ar_video"]= questionAnswered.dataValues.ar_video_ans_wrong;
                    result["ar_video"]= topic_to_redirect_to
                    result["accimg"] = questionAnswered.dataValues.accimg_ans_wrong;
                }
                result["redirect_to"] = topic_to_redirect_to;
                res.status(200).send(dispatcher(res,result));
            }
        } catch (err) {
            next(err)
        }
    }
    //TODO: 
}