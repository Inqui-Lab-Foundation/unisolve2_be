import { badRequest, internal, unauthorized } from "boom";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import { reflective_quiz_question } from "../models/reflective_quiz_question.model";
import { reflective_quiz_response } from "../models/reflective_quiz_response.model";
import BaseService from "./base.service";

export default class ReflectiveQuizService extends BaseService {
    /**
     * Fetch next question for quiz based on the user_id
     * @param user_id Number
     * @param video_id String
     * @param paramStatus String
     * @returns Object 
     */
    public async fetchNextQuestion(user_id: number, video_id: any, paramStatus: any) {
        try {
            if (!video_id) {
                throw badRequest(speeches.QUIZ_ID_REQUIRED);
            }
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }
            const quizRes = await this.crudService.findOne(reflective_quiz_response, { where: { video_id: video_id, user_id: user_id } });
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
            if (quizRes) {
                let user_response: any = {}
                user_response = JSON.parse(quizRes.dataValues.response);
                let questionNosAsweredArray = Object.keys(user_response);
                questionNosAsweredArray = questionNosAsweredArray.sort((a, b) => (Number(a) > Number(b) ? -1 : 1));
                const noOfQuestionsAnswered = Object.keys(user_response).length
                const lastQuestionAnsewered = user_response[questionNosAsweredArray[0]]
                //we have assumed that this length will always have atleast 1 item ; this could potentially be a source of bug, but is not since this should always be true based on above checks ..
                // if(lastQuestionAnsewered.selected_option == lastQuestionAnsewered.correct_answer){
                question_no = lastQuestionAnsewered.question_no + 1;
                level = "HARD";
            }
            const nextQuestionsToChooseFrom = await this.crudService.findOne(reflective_quiz_question, {
                where: {
                    [Op.and]: [
                        { video_id: video_id },
                        { level: level },
                        { question_no: question_no },
                        whereClauseStatusPart,
                    ]

                }
            })
            if (nextQuestionsToChooseFrom instanceof Error) {
                throw internal(nextQuestionsToChooseFrom.message)
            }
            return nextQuestionsToChooseFrom
        } catch (error) {
            return error;
        }
    }
}


