import { Request, Response, NextFunction } from "express";
import { mentor } from "../models/mentor.model";
import { organization } from "../models/organization.model";
import TranslationService from "../services/translation.service";
import dispatcher from "../utils/dispatch.util";
import db from "../utils/dbconnection.util"
import { courseModuleSchema, courseModuleUpdateSchema } from "../validations/courseModule.validationa";
import { translationSchema, translationUpdateSchema } from "../validations/translation.validations";
import ValidationsHolder from "../validations/validationHolder";
import { quiz_survey_response } from '../models/quiz_survey_response.model';
import BaseController from "./base.controller";
import { constents } from "../configs/constents.config";
import { mentor_course_topic } from "../models/mentor_course_topic.model";
import { internal, notFound } from "boom";
import { speeches } from "../configs/speeches.config";
import ReportService from "../services/report.service";
import { Op, QueryTypes } from 'sequelize';
import { user } from "../models/user.model";
import { team } from "../models/team.model";
import {baseConfig} from "../configs/base.config";
import SchoolDReportService from "../services/schoolDReort.service";
import StudentDReportService from "../services/studentDReort.service";
import IdeaReportService from "../services/ideaReort.service";
//import { reflective_quiz_response } from '../models/reflective_quiz_response.model';

export default class ReportController extends BaseController {

    model = "mentor"; ///giving any name because this shouldnt be used in any apis in this controller

    protected initializePath(): void {
        this.path = '/reports';
    }
    protected initializeValidations(): void {
        // this.validations =  new ValidationsHolder(translationSchema,translationUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(`${this.path}/allMentorReports`, this.getAllMentorReports.bind(this));
        this.router.get(`${this.path}/mentorRegList`, this.getMentorRegList.bind(this));
        this.router.get(this.path + "/preSurvey", this.mentorPreSurvey.bind(this));
        this.router.get(this.path + "/postSurvey", this.mentorPostSurvey.bind(this));
        this.router.get(this.path + "/courseComplete", this.courseComplete.bind(this));
        this.router.get(this.path + "/courseInComplete", this.courseInComplete.bind(this));
        this.router.get(this.path + "/notRegistered", this.notRegistered.bind(this));
        this.router.get(this.path + "/notRegister", this.notRegistered.bind(this));
        this.router.get(this.path + "/userTopicProgress", this.userTopicProgressGroupByCourseTopicId.bind(this));
        this.router.get(this.path + "/mentorTeamsStudents", this.teamRegistered.bind(this));
        this.router.get(this.path + "/challengesCount", this.challengesLevelCount.bind(this));
        this.router.get(this.path + "/challengesDistrictCount", this.districtWiseChallengesCount.bind(this));
        this.router.get(this.path + "/mentorRegNONregCount", this.mentorRegNONregCount.bind(this));
        this.router.get(this.path + "/mentorstudentSurveyCount", this.mentorstudentSurveyCount.bind(this));
        this.router.get(this.path + "/mentordeatilscsv", this.mentordeatilscsv.bind(this));
        this.router.get(this.path + "/mentorsummary", this.mentorsummary.bind(this));
        this.router.get(`${this.path}/mentorSurvey`, this.getmentorSurvey.bind(this));
        this.router.get(`${this.path}/studentSurvey`, this.getstudentSurvey.bind(this));
        this.router.get(`${this.path}/studentdetailsreport`, this.getstudentDetailsreport.bind(this));
        this.router.get(`${this.path}/mentordetailsreport`, this.getmentorDetailsreport.bind(this));
        this.router.get(`${this.path}/mentordetailstable`, this.getmentorDetailstable.bind(this));
        this.router.get(`${this.path}/studentdetailstable`, this.getstudentDetailstable.bind(this));
        this.router.get(`${this.path}/refreshSchoolDReport`, this.refreshSchoolDReport.bind(this));
        this.router.get(`${this.path}/refreshStudentDReport`, this.refreshStudentDReport.bind(this));
        this.router.get(`${this.path}/refreshIdeaReport`, this.refreshIdeaReport.bind(this));
        this.router.get(`${this.path}/ideadeatilreport`, this.getideaReport.bind(this));
        this.router.get(`${this.path}/L1deatilreport`, this.getL1Report.bind(this));
        this.router.get(`${this.path}/L2deatilreport`, this.getL2Report.bind(this));
        this.router.get(`${this.path}/L3deatilreport`, this.getL3Report.bind(this));
        this.router.get(`${this.path}/ideaReportTable`, this.getideaReportTable.bind(this));
        this.router.get(`${this.path}/L1ReportTable1`, this.getL1ReportTable1.bind(this));
        this.router.get(`${this.path}/L1ReportTable2`, this.getL1ReportTable2.bind(this));
        this.router.get(`${this.path}/L2ReportTable1`, this.getL2ReportTable1.bind(this));
        this.router.get(`${this.path}/L2ReportTable2`, this.getL2ReportTable2.bind(this));
        this.router.get(`${this.path}/L3ReportTable1`, this.getL3ReportTable1.bind(this));
        this.router.get(`${this.path}/L3ReportTable2`, this.getL3ReportTable2.bind(this));
        
        // super.initializeRoutes();
    }

    protected async getMentorRegList(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, status ,district,category} = req.query;
            let condition = {}
            // condition = status ? { status: { [Op.like]: `%${status}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }
            let districtFilter: any = {}
            if(district !== 'All Districts' && category !== 'All Categorys'){
                districtFilter = {category,district,status}
            }else if(district !== 'All Districts'){
                districtFilter = {district,status}
            }else if(category !== 'All Categorys'){
                districtFilter = {category,status}
            }else{
                districtFilter={status}
            }
            const mentorsResult = await mentor.findAll({
                attributes: [
                    "full_name",
                    "gender",
                    "mobile",
                    "whatapp_mobile",
                ],
                raw: true,
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        condition
                    ]
                },
                include: [
                    {
                        where: districtFilter,
                        model: organization,
                        attributes: [
                            "organization_code",
                            "organization_name",
                            "category",
                            "district",
                            "city",
                            "principal_name",
                            "principal_mobile"
                        ]
                    },
                    {
                        model: user,
                        attributes: [
                            "username",
                            "user_id"
                        ]
                    }
                ],
                limit, offset
            });
            if (!mentorsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (mentorsResult instanceof Error) {
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res, mentorsResult, "success"))
        } catch (err) {
            next(err)
        }
    }

    protected async mentorPreSurvey(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, role, qid } = req.query;
            //let condition = role ? role : 'MENTOR';
            // let condition = role ? { role: { [Op.eq]: role } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }
            let quizSurveyIdCondition: any = {};
            if (role === 'MENTOR') {
            quizSurveyIdCondition = { quiz_survey_id: 1 }; 
            } else if (role === 'STUDENT') {
            quizSurveyIdCondition = { quiz_survey_id: 2 };
            }

            const mentorsResult = await quiz_survey_response.findAll({
                attributes: [
                    "quiz_response_id",
                    "updated_at",
                    "quiz_survey_id"
                ],
                raw: true,
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        quizSurveyIdCondition,
                    ]
                },
                include: [
                    {
                        model: user,
                        attributes: [
                            "full_name",
                            "created_at",
                            "updated_at"
                        ],
                        where: { role: role }
                    }
                ],
                limit, offset
            });
            if (!mentorsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (mentorsResult instanceof Error) {
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res, mentorsResult, "success"))
        } catch (err) {
            next(err)
        }
    }

    protected async mentorPostSurvey(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, role, qid } = req.query;
            //let condition = role ? role : 'MENTOR';
            // let condition = role ? { role: { [Op.eq]: role } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";

            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }
            let quizSurveyIdCondition: any = {};
            if (role === 'MENTOR') {
            quizSurveyIdCondition = { quiz_survey_id: 3 }; 
            } else if (role === 'STUDENT') {
            quizSurveyIdCondition = { quiz_survey_id: 4 };
            }

            const mentorsResult = await quiz_survey_response.findAll({
                attributes: [
                    "quiz_response_id",
                    "updated_at",
                    "quiz_survey_id"
                ],
                raw: true,
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        quizSurveyIdCondition
                    ]
                },
                include: [
                    {
                        model: user,
                        attributes: [
                            "full_name",
                            "created_at",
                            "updated_at"
                        ],
                        where: { role: role }
                    }
                ],
                limit, offset
            });
            if (!mentorsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (mentorsResult instanceof Error) {
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res, mentorsResult, "success"))
        } catch (err) {
            next(err)
        }
    }

    protected async courseComplete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, role } = req.query;
            let condition = role ? { role: { [Op.eq]: role } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }


            const mentorsResult = await db.query(`SELECT mentors.organization_code, mentors.district, mentors.full_name,(SELECT COUNT(mentor_topic_progress_id)FROM mentor_topic_progress AS mentor_progress WHERE mentor_progress.user_id=mentors.user_id) AS 'count' FROM mentors LEFT OUTER JOIN mentor_topic_progress AS mentor_progress ON mentors.user_id=mentor_progress.user_id where (SELECT COUNT(mentor_topic_progress_id)FROM mentor_topic_progress AS mentor_progress WHERE mentor_progress.user_id=mentors.user_id)= ${baseConfig.MENTOR_COURSE} GROUP BY mentor_progress.user_id`, { type: QueryTypes.SELECT });
            if (!mentorsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (mentorsResult instanceof Error) {
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res, mentorsResult, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async courseInComplete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, role } = req.query;
            let condition = role ? { role: { [Op.eq]: role } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }
            const mentorsResult = await db.query("SELECT mentors.organization_code, mentors.district, mentors.full_name,(SELECT COUNT(mentor_topic_progress_id)FROM mentor_topic_progress AS mentor_progress WHERE mentor_progress.user_id=mentors.user_id) AS 'count' FROM mentors LEFT OUTER JOIN mentor_topic_progress AS mentor_progress ON mentors.user_id=mentor_progress.user_id where (SELECT COUNT(mentor_topic_progress_id)FROM mentor_topic_progress AS mentor_progress WHERE mentor_progress.user_id=mentors.user_id) != 9 GROUP BY mentor_progress.user_id", { type: QueryTypes.SELECT });
            console.log(mentorsResult);
            if (!mentorsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (mentorsResult instanceof Error) {
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res, mentorsResult, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async notRegistered(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, role,district,category } = req.query;
            let condition = role ? { role: { [Op.eq]: role } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }
            let districtFilter: any = ''
            let categoryFilter:any = ''
            if(district !== 'All Districts' && category !== 'All Categorys'){
                districtFilter = `'${district}'`
                categoryFilter = `'${category}'`
            }else if(district !== 'All Districts'){
                districtFilter = `'${district}'`
                categoryFilter = `'%%'`
            }else if(category !== 'All Categorys'){
                categoryFilter = `'${category}'`
                districtFilter = `'%%'`
            }else{
                districtFilter = `'%%'`
                categoryFilter = `'%%'`
            }
            const mentorsResult = await db.query(`SELECT 
            organization_id,
            organization_code,
            organization_name,
            district,
            category,
            city,
            state,
            country,
            principal_name,
            principal_mobile,
            principal_email FROM organizations WHERE status='ACTIVE' && district LIKE ${districtFilter} && category LIKE ${categoryFilter} && NOT EXISTS(SELECT mentors.organization_code  from mentors WHERE organizations.organization_code = mentors.organization_code) `, { type: QueryTypes.SELECT });
            if (!mentorsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (mentorsResult instanceof Error) {
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res, mentorsResult, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async userTopicProgressGroupByCourseTopicId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const mentorsResult = await db.query("SELECT course_topic_id, count(user_id) as count FROM user_topic_progress group by course_topic_id", { type: QueryTypes.SELECT });
            if (!mentorsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (mentorsResult instanceof Error) {
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res, mentorsResult, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async teamRegistered(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, role } = req.query;
            let condition = role ? role : 'MENTOR';
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }
            const teamResult = await mentor.findAll({
                attributes: [
                    "full_name",
                    "mentor_id",
                    [
                        db.literal(`(
                            SELECT COUNT(*)
                            FROM teams AS t
                            WHERE t.mentor_id = \`mentor\`.\`mentor_id\`)`), 'Team_count'
                    ],
                ],
                raw: true,
                where: {
                    [Op.and]: [
                        whereClauseStatusPart
                    ]
                },
                group: ['mentor_id'],
                include: [
                    {
                        model: team,
                        attributes: [
                            "team_id",
                            "team_name",
                            [
                                db.literal(`(
                            SELECT COUNT(*)
                            FROM students AS s
                            WHERE s.team_id = \`team\`.\`team_id\`)`), 'student_count'
                            ],

                        ]
                    },
                    {
                        model: organization,
                        attributes: [
                            "organization_code",
                            "organization_name",
                            "district"
                        ]
                    }
                ], limit, offset
            });
            if (!teamResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (teamResult instanceof Error) {
                throw teamResult
            }
            res.status(200).send(dispatcher(res, teamResult, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async challengesLevelCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, role } = req.query;
            let condition = role ? { role: { [Op.eq]: role } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(this.model).catch(error => {
                next(error)
            });
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }
            const challengesLevels = await db.query("select status, evaluation_status, count(team_id) AS team_count from challenge_responses group by status, evaluation_status", { type: QueryTypes.SELECT });
            if (!challengesLevels) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (challengesLevels instanceof Error) {
                throw challengesLevels
            }
            res.status(200).send(dispatcher(res, challengesLevels, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async districtWiseChallengesCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let challenges: any
            let level = req.query.level;
            if (level && typeof level == 'string') {
                switch (level) {
                    case 'DRAFT': challenges = await db.query("SELECT district, count(challenge_response_id) as count FROM unisolve_db.challenge_responses WHERE status = 'DRAFT' group by district", { type: QueryTypes.SELECT });
                        break;
                    case 'SUBMITTED': challenges = await db.query("SELECT district, count(challenge_response_id) as count FROM unisolve_db.challenge_responses WHERE status = 'SUBMITTED' group by district", { type: QueryTypes.SELECT });
                        break;
                    case 'L1YETPROCESSED': challenges = await db.query("SELECT count(challenge_response_id) as count, district FROM unisolve_db.challenge_responses WHERE evaluation_status is null group by district ", { type: QueryTypes.SELECT });
                        break;
                    case 'SELECTEDROUND1': challenges = await db.query("SELECT count(challenge_response_id) as count, district FROM unisolve_db.challenge_responses WHERE evaluation_status = 'SELECTEDROUND1' group by district", { type: QueryTypes.SELECT });
                        break;
                    case 'REJECTEDROUND1': challenges = await db.query("SELECT count(challenge_response_id) as count, district FROM unisolve_db.challenge_responses WHERE evaluation_status = 'REJECTEDROUND1' group by district ", { type: QueryTypes.SELECT });
                        break;
                    case 'L2PROCESSED': challenges = await db.query("SELECT COUNT(challenge_response_id) AS count, district FROM unisolve_db.challenge_responses WHERE challenge_response_id IN(SELECT challenge_response_id FROM unisolve_db.evaluator_ratings GROUP BY challenge_response_id HAVING COUNT(challenge_response_id) > 2) GROUP BY district", { type: QueryTypes.SELECT });
                        break;
                    case 'L2YETPROCESSED': challenges = await db.query("SELECT count(challenge_response_id) as count, district FROM unisolve_db.l1_accepted group by district; ", { type: QueryTypes.SELECT });
                        break;
                    case 'FINALCHALLENGES': challenges = await db.query("SELECT district, COUNT(challenge_response_id) AS count FROM unisolve_db.challenge_responses WHERE challenge_response_id in (SELECT challenge_response_id FROM unisolve_db.evaluation_results);", { type: QueryTypes.SELECT });
                        break;
                    case 'FINALACCEPTED': challenges = await db.query("SELECT district, count(challenge_response_id) as count FROM unisolve_db.challenge_responses WHERE final_result = '1' group by district ", { type: QueryTypes.SELECT });
                        break;
                    case 'FINALREJECTED': challenges = await db.query("SELECT district, count(challenge_response_id) as count FROM unisolve_db.challenge_responses WHERE final_result = '0' group by district ", { type: QueryTypes.SELECT });
                        break;
                }
            }
            if (!challenges) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (challenges instanceof Error) {
                throw challenges
            }
            res.status(200).send(dispatcher(res, challenges, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getAllMentorReports(req: Request, res: Response, next: NextFunction) {
        try {

            let tr: any = req.query.tr;
            let tpre: any = req.query.tpre;
            let tc: any = req.query.tc;
            let tpost: any = req.query.tpost;
            let rs: any = req.query.rs;
            let dis: any = req.query.dis;

            if (!rs ||
                !(rs in constents.reports_all_ment_reports_rs_flags.list)) {
                rs = "ALL"
            }
            let attrToBeInCluded: any = [
                "user_id"
            ]
            let totalNoOfTopics = 9
            if (tpre && tpre > 0) {
                attrToBeInCluded.push(
                    [
                        // Note the wrapping parentheses in the call below!
                        //hard coded pre survey quiz id for mentor 
                        db.literal(`(
                            SELECT 
                                CASE WHEN EXISTS
                                    (
                                        SELECT qsr.user_id 
                                        FROM quiz_survey_responses as qsr 
                                        WHERE qsr.user_id = \`mentor\`.\`user_id\`
                                        AND qsr.quiz_survey_id= 1 
                                    )
                                THEN  
                                    (
                                        SELECT created_at 
                                        FROM quiz_survey_responses as qsr 
                                        WHERE qsr.user_id = \`mentor\`.\`user_id\`
                                        AND qsr.quiz_survey_id= 1 
                                    )
                                ELSE 
                                    "INCOMPLETE"
                            END as pre_survey_status
                        )`),
                        'pre_survey_status'
                    ],
                )
            }

            if (tpost && tpost > 0) {
                attrToBeInCluded.push(
                    [
                        // Note the wrapping parentheses in the call below!
                        //hard coded post survey quiz id for mentor 
                        db.literal(`(
                            SELECT CASE 
                                WHEN EXISTS
                                    (
                                        SELECT qsr.user_id 
                                        FROM quiz_survey_responses as qsr 
                                        WHERE qsr.user_id = \`mentor\`.\`user_id\`
                                        AND qsr.quiz_survey_id= 3 
                                    )
                                THEN  
                                    (
                                        SELECT created_at 
                                        FROM quiz_survey_responses as qsr 
                                        WHERE qsr.user_id = \`mentor\`.\`user_id\`
                                        AND qsr.quiz_survey_id= 3 
                                    )
                                ELSE 
                                    "INCOMPLETE"
                            END as post_survey_status
                        )`),
                        'post_survey_status'
                    ],
                )
            }

            if (tc && tc > 0) {
                const allMentorTopicsResult = await mentor_course_topic.findAll({
                    where: {
                        status: "ACTIVE"
                    },
                    raw: true,
                })

                if (!allMentorTopicsResult) {
                    throw internal(speeches.INTERNAL)
                }
                if (allMentorTopicsResult instanceof Error) {
                    throw allMentorTopicsResult
                }
                if (!allMentorTopicsResult.length) {
                    throw internal(speeches.INTERNAL)
                }
                totalNoOfTopics = allMentorTopicsResult.length

                attrToBeInCluded.push(
                    [
                        // Note the wrapping parentheses in the call below!
                        //hard coded pre survey quiz id for mentor 
                        db.literal(`(
                            SELECT CASE 
                            WHEN  
                                (SELECT count(user_id)
                                FROM mentor_topic_progress as mtp 
                                WHERE mtp.user_id = \`mentor\`.\`user_id\`
                                ) >= ${totalNoOfTopics}
                            THEN  
                                "COMPLETED"
                            WHEN  
                                (SELECT count(user_id)
                                FROM mentor_topic_progress as mtp 
                                WHERE mtp.user_id = \`mentor\`.\`user_id\`
                                ) < ${totalNoOfTopics} 
                                AND 
                                (SELECT count(user_id)
                                FROM mentor_topic_progress as mtp 
                                WHERE mtp.user_id = \`mentor\`.\`user_id\`
                                ) > 0 
                            THEN  
                                "INPROGRESS"
                            ELSE 
                                "INCOMPLETE"
                            END as course_status
                        )`),
                        'course_status'
                    ],
                )
            }
            let disBasedWhereClause: any = {}
            if (dis) {
                dis = dis.trim()
                disBasedWhereClause = {
                    district: dis
                }
            }

            const reportservice = new ReportService();
            let rsBasedWhereClause: any = {}
            rsBasedWhereClause = await reportservice.fetchOrgCodeArrToIncInAllMentorReportBasedOnReportStatusParam(
                tr, tpre, tc, tpost, rs, totalNoOfTopics
            )

            //actual query being called here ...this result is to be returned...!!
            const organisationsResult: any = await organization.findAll({
                include: [
                    {
                        model: mentor,
                        attributes: {
                            include: attrToBeInCluded
                        },
                        include: [
                            { model: user }
                        ]
                    }
                ],
                where: {
                    [Op.and]: [
                        rsBasedWhereClause,
                        disBasedWhereClause
                    ]
                },
            })

            if (!organisationsResult) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (organisationsResult instanceof Error) {
                throw organisationsResult
            }

            res.status(200).send(dispatcher(res, organisationsResult, 'success'));
        } catch (err) {
            next(err)
        }
    }
    protected async mentorRegNONregCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const notRegisteredCount = await db.query("SELECT COUNT(*) AS 'notRegisteredCount' FROM organizations WHERE NOT EXISTS( SELECT mentors.organization_code FROM mentors WHERE organizations.organization_code = mentors.organization_code ); ", { type: QueryTypes.SELECT });
            // data['Count']= [notRegisteredCount[0], RegisteredCount[0]]
            const RegisteredCount = await db.query("SELECT count(DISTINCT organization_code) as 'RegisteredCount' FROM mentors;", { type: QueryTypes.SELECT })
            // data['RegisteredCount'] = RegisteredCount[0]
            data['Count']= [notRegisteredCount[0], RegisteredCount[0]]
            const reglist = await db.query("SELECT COUNT(*) AS 'RegisteredCount', district FROM organizations WHERE EXISTS( SELECT mentors.organization_code FROM mentors WHERE organizations.organization_code = mentors.organization_code) GROUP BY district;", { type: QueryTypes.SELECT })
            const nonreglist = await db.query("SELECT COUNT(*) AS 'notRegisteredCount',district FROM organizations WHERE NOT EXISTS( SELECT mentors.organization_code FROM mentors WHERE organizations.organization_code = mentors.organization_code ) group by district ;", { type: QueryTypes.SELECT })
            const dis = await db.query("SELECT district FROM unisolve_db.organizations group by district;", { type: QueryTypes.SELECT })
            data['reglist'] = reglist;
            data['nonreglist']= nonreglist;
            data['district'] = dis;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async mentorstudentSurveyCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const surveyCount = await db.query(`
            SELECT
                SUM(quiz_survey_id = 1) AS mentorPreCount,
                SUM(quiz_survey_id = 3) AS mentorPostCount,
                SUM(quiz_survey_id = 2) AS studentPreCount,
                SUM(quiz_survey_id = 4) AS studentPostCount
            FROM quiz_survey_responses
            WHERE quiz_survey_id IN (1, 2, 3, 4);`, { type: QueryTypes.SELECT });
            
            data['Count']= [surveyCount[0]]
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }

    protected async mentordeatilscsv(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const details = await db.query(`SELECT
            m.organization_code AS UDISE_CODE,
            o.organization_name AS School_Name,
            o.district AS District,
            o.city AS City,
            o.principal_name AS HM_Name,
            o.principal_mobile AS HM_contact,
            m.user_id AS mentor_user_id,
            m.full_name AS Teacher_Name,
            m.gender AS Teacher_Gender,
            m.mobile AS Teacher_Contact,
            m.whatapp_mobile AS Teacher_Whatsapp_Contact,
            qr1.pre_status AS PreSurvey_Status,
            qr3.post_status AS PostSurvey_Status,
            CASE
                WHEN mtp.mentor_course_topic_count >= 1 THEN 'Completed'
                ELSE 'Not Completed'
            END AS Course_Status,
            IFNULL(t.team_count, 0) AS Total_No_Teams,
            IFNULL(s.total_students, 0) AS Total_Students_Enrolled
        FROM
            mentors m
        LEFT JOIN
            organizations o ON m.organization_code = o.organization_code
        LEFT JOIN (
            SELECT user_id, MAX(CASE WHEN quiz_survey_id = 1 THEN 'Completed' ELSE NULL END) AS pre_status
            FROM quiz_survey_responses
            GROUP BY user_id
        ) qr1 ON m.user_id = qr1.user_id
        LEFT JOIN (
            SELECT user_id, MAX(CASE WHEN quiz_survey_id = 3 THEN 'Completed' ELSE NULL END) AS post_status
            FROM quiz_survey_responses
            GROUP BY user_id
        ) qr3 ON m.user_id = qr3.user_id
        LEFT JOIN (
            SELECT mentor_id, COUNT(DISTINCT team_id) AS team_count
            FROM teams
            GROUP BY mentor_id
        ) t ON m.mentor_id = t.mentor_id    
        LEFT JOIN (
            SELECT team_id, COUNT(*) AS total_students
            FROM students
            GROUP BY team_id
        ) s ON t.mentor_id = s.team_id
        LEFT JOIN (
            SELECT user_id, COUNT(DISTINCT mentor_course_topic_id) AS mentor_course_topic_count
            FROM mentor_topic_progress
            WHERE mentor_course_topic_id = 8
            GROUP BY user_id
        ) mtp ON m.user_id = mtp.user_id
        Group By    
        m.organization_code;
        `, { type: QueryTypes.SELECT });
            data=details;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async mentorsummary(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const district = req.query.district;
            let summary 
            if(district){
                summary = await db.query(`SELECT 
                org.district,
                org.organization_count,
                org.uniqueRegSchools,
                org.male_mentor_count,
                org.female_mentor_count,
                org.male_mentor_count + org.female_mentor_count AS total_registered_teachers,
                org.organization_count - (org.uniqueRegSchools) AS total_not_registered_teachers
            FROM
                (SELECT 
                    o.district,
                        COUNT(DISTINCT o.organization_id) AS organization_count,
                        COUNT(DISTINCT m.organization_code) AS uniqueRegSchools,
                        SUM(CASE
                            WHEN m.gender = 'Male' THEN 1
                            ELSE 0
                        END) AS male_mentor_count,
                        SUM(CASE
                            WHEN m.gender = 'Female' THEN 1
                            ELSE 0
                        END) AS female_mentor_count
                FROM
                    organizations o
                LEFT JOIN mentors m ON o.organization_code = m.organization_code
                WHERE
                    o.status = 'ACTIVE'
                        && o.district = '${district}'
                GROUP BY o.district) AS org;`, { type: QueryTypes.SELECT });

            }else{
            summary = await db.query(`SELECT 
            org.district,
            org.organization_count,
            org.uniqueRegSchools,
            org.male_mentor_count,
            org.female_mentor_count,
            org.male_mentor_count + org.female_mentor_count AS total_registered_teachers,
            org.organization_count - (org.uniqueRegSchools) AS total_not_registered_teachers
        FROM
            (SELECT 
                o.district,
                    COUNT(DISTINCT o.organization_id) AS organization_count,
                    COUNT(DISTINCT m.organization_code) AS uniqueRegSchools,
                    SUM(CASE
                        WHEN m.gender = 'Male' THEN 1
                        ELSE 0
                    END) AS male_mentor_count,
                    SUM(CASE
                        WHEN m.gender = 'Female' THEN 1
                        ELSE 0
                    END) AS female_mentor_count
            FROM
                organizations o
            LEFT JOIN mentors m ON o.organization_code = m.organization_code
            WHERE
                o.status = 'ACTIVE'
            GROUP BY o.district) AS org 
        UNION ALL SELECT 
            'Total',
            SUM(organization_count),
            SUM(uniqueRegSchools),
            SUM(male_mentor_count),
            SUM(female_mentor_count),
            SUM(male_mentor_count + female_mentor_count),
            SUM(organization_count - uniqueRegSchools)
        FROM
            (SELECT 
                o.district,
                    COUNT(DISTINCT o.organization_id) AS organization_count,
                    COUNT(DISTINCT m.organization_code) AS uniqueRegSchools,
                    SUM(CASE
                        WHEN m.gender = 'Male' THEN 1
                        ELSE 0
                    END) AS male_mentor_count,
                    SUM(CASE
                        WHEN m.gender = 'Female' THEN 1
                        ELSE 0
                    END) AS female_mentor_count
            FROM
                organizations o
            LEFT JOIN mentors m ON o.organization_code = m.organization_code
            WHERE
                o.status = 'ACTIVE'
            GROUP BY o.district) AS org;`, { type: QueryTypes.SELECT });
            }
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getmentorSurvey(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = req.query.id;
            let data: any = {}
            const summary = await db.query(`SELECT 
            mn.organization_code AS 'UDISE Code',
            og.organization_name AS 'School Name',
            og.category AS Category,
            og.district AS District,
            og.city AS City,
            og.principal_name AS 'HM Name',
            og.principal_mobile AS 'HM Contact',
            mn.full_name AS 'Name'
        FROM
            ((unisolve_db.quiz_survey_responses AS qz
            INNER JOIN unisolve_db.mentors AS mn ON qz.user_id = mn.user_id
                AND quiz_survey_id = ${id})
            INNER JOIN unisolve_db.organizations AS og ON mn.organization_code = og.organization_code)
        WHERE
            og.status = 'ACTIVE';`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getstudentSurvey(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = req.query.id;
            let data: any = {}
            const summary = await db.query(`SELECT 
            mn.organization_code AS 'UDISE Code',
            og.organization_name AS 'School Name',
            og.category AS Category,
            og.district AS District,
            og.city AS City,
            og.principal_name AS 'HM Name',
            og.principal_mobile AS 'HM Contact',
            st.full_name AS 'Name'
        FROM
            ((((unisolve_db.quiz_survey_responses AS qz
            INNER JOIN unisolve_db.students AS st ON qz.user_id = st.user_id
                AND quiz_survey_id = ${id})
            INNER JOIN unisolve_db.teams AS t ON st.team_id = t.team_id)
            INNER JOIN unisolve_db.mentors AS mn ON t.mentor_id = mn.mentor_id)
            INNER JOIN unisolve_db.organizations AS og ON mn.organization_code = og.organization_code)
        WHERE
            og.status = 'ACTIVE'; `, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getstudentDetailsreport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {category,district} = req.query;
            let data: any = {}
            let districtFilter: any = ''
            let categoryFilter:any = ''
            if(district !== 'All Districts' && category !== 'All Categorys'){
                districtFilter = `'${district}'`
                categoryFilter = `'${category}'`
            }else if(district !== 'All Districts'){
                districtFilter = `'${district}'`
                categoryFilter = `'%%'`
            }else if(category !== 'All Categorys'){
                categoryFilter = `'${category}'`
                districtFilter = `'%%'`
            }else{
                districtFilter = `'%%'`
                categoryFilter = `'%%'`
            }
                const summary = await db.query(`SELECT 
                    udise_code AS 'UDISE code',
                    school_name AS 'School Name',
                    district,
                    category,
                    city,
                    hm_name AS 'HM Name',
                    hm_contact AS 'HM Contact',
                    teacher_name AS 'Teacher Name',
                    teacher_gender AS 'Teacher Gender',
                    teacher_contact AS 'Teacher Contact',
                    teacher_whatsapp_contact AS 'Teacher WhatsApp Contact',
                    team_name AS 'Team Name',
                    student_name AS 'Student Name',
                    student_username AS 'Student Username',
                    Age,
                    gender,
                    Grade,
                    pre_survey_status AS 'Pre Survey Status',
                    idea_status AS 'Idea Status',
                    course_status,
                    post_survey_status AS 'Post Survey Status'
                FROM
                    student_report
                WHERE
                    status = 'ACTIVE' && district like ${districtFilter} 
                    && category like ${categoryFilter} order by district,teacher_name,team_name,student_name;`, { type: QueryTypes.SELECT });
                data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getmentorDetailsreport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {category,district} = req.query;
            let data: any = {}
            let districtFilter: any = ''
            let categoryFilter:any = ''
            if(district !== 'All Districts' && category !== 'All Categorys'){
                districtFilter = `'${district}'`
                categoryFilter = `'${category}'`
            }else if(district !== 'All Districts'){
                districtFilter = `'${district}'`
                categoryFilter = `'%%'`
            }else if(category !== 'All Categorys'){
                categoryFilter = `'${category}'`
                districtFilter = `'%%'`
            }else{
                districtFilter = `'%%'`
                categoryFilter = `'%%'`
            }
                const summary = await db.query(`SELECT 
                udise_code AS 'UDISE code',
                school_name AS 'School Name',
                district,
                category,
                city,
                hm_name AS 'HM Name',
                hm_contact AS 'HM Contact',
                teacher_name AS 'Teacher Name',
                teacher_gender AS 'Teacher Gender',
                teacher_contact AS 'Teacher Contact',
                teacher_whatsapp_contact AS 'Teacher WhatsApp Contact',
                pre_survey_status AS 'Pre Survey Status',
                course_status AS 'Course Status',
                post_survey_status AS 'Post Survey Status',
                team_count,
                student_count,
                preSur_cmp,
                countop,
                courseinprogess,
                submittedcout,
                draftcout
            FROM
                school_report
            WHERE
                district LIKE ${districtFilter} && category LIKE ${categoryFilter}
            ORDER BY district,teacher_name;`,{ type: QueryTypes.SELECT })
        data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getmentorDetailstable(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const district = req.query.district;
            let wherefilter = '';
            if(district){
                wherefilter = `&& og.district= '${district}'`;
            }
            const Regschool = await db.query(`SELECT 
            og.district, COUNT(DISTINCT mn.organization_code) AS totalRegSchools
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
            WHERE og.status='ACTIVE' ${wherefilter}
        GROUP BY og.district;`, { type: QueryTypes.SELECT });
            const summary = await db.query(`SELECT 
            og.district, COUNT(mn.mentor_id) AS totalReg
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
            WHERE og.status='ACTIVE' ${wherefilter}
        GROUP BY og.district;`, { type: QueryTypes.SELECT });
        const teamCount = await db.query(`SELECT 
        og.district, COUNT(t.team_id) AS totalTeams
    FROM
        organizations AS og
            LEFT JOIN
        mentors AS mn ON og.organization_code = mn.organization_code
            INNER JOIN
        teams AS t ON mn.mentor_id = t.mentor_id
        WHERE og.status='ACTIVE' ${wherefilter}
    GROUP BY og.district;`,{ type: QueryTypes.SELECT });
        const studentCountDetails = await db.query(`SELECT 
        og.district,
        COUNT(st.student_id) AS totalstudent,
        SUM(CASE
            WHEN st.gender = 'MALE' THEN 1
            ELSE 0
        END) AS male,
        SUM(CASE
            WHEN st.gender = 'FEMALE' THEN 1
            ELSE 0
        END) AS female
    FROM
        organizations AS og
            LEFT JOIN
        mentors AS mn ON og.organization_code = mn.organization_code
            INNER JOIN
        teams AS t ON mn.mentor_id = t.mentor_id
            INNER JOIN
        students AS st ON st.team_id = t.team_id
        WHERE og.status='ACTIVE' ${wherefilter}
    GROUP BY og.district;`,{ type: QueryTypes.SELECT });
        const courseINcompleted = await db.query(`select district,count(*) as courseIN from (SELECT 
            district,cou
        FROM
            unisolve_db.organizations AS og
                LEFT JOIN
            (SELECT 
                organization_code, cou
            FROM
                unisolve_db.mentors AS mn
            LEFT JOIN (SELECT 
                user_id, COUNT(*) AS cou
            FROM
                unisolve_db.mentor_topic_progress
            GROUP BY user_id having count(*)<8) AS t ON mn.user_id = t.user_id ) AS c ON c.organization_code = og.organization_code WHERE og.status='ACTIVE' ${wherefilter}
        having cou<8) as final group by district;`, { type: QueryTypes.SELECT });
        const courseCompleted= await db.query(`select district,count(*) as courseCMP from (SELECT 
            district,cou
        FROM
            unisolve_db.organizations AS og
                LEFT JOIN
            (SELECT 
                organization_code, cou
            FROM
                unisolve_db.mentors AS mn
            LEFT JOIN (SELECT 
                user_id, COUNT(*) AS cou
            FROM
                unisolve_db.mentor_topic_progress
            GROUP BY user_id having count(*)>=8) AS t ON mn.user_id = t.user_id ) AS c ON c.organization_code = og.organization_code WHERE og.status='ACTIVE' ${wherefilter}
        having cou>=8) as final group by district`, { type: QueryTypes.SELECT });
            data['summary'] = summary;
            data['Regschool'] = Regschool;
            data['teamCount'] = teamCount;
            data['studentCountDetails'] = studentCountDetails;
            data['courseCompleted'] = courseCompleted;
            data['courseINcompleted'] = courseINcompleted;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getstudentDetailstable(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const district = req.query.district;
            let wherefilter = '';
            if(district){
                wherefilter = `&& og.district= '${district}'`;
            }
            const summary = await db.query(`SELECT 
            og.district, COUNT(t.team_id) AS totalTeams
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
                LEFT JOIN
            teams AS t ON mn.mentor_id = t.mentor_id
            WHERE og.status='ACTIVE' ${wherefilter}
        GROUP BY og.district;`, { type: QueryTypes.SELECT });
            const studentCountDetails = await db.query(`SELECT 
            og.district,
            COUNT(st.student_id) AS totalstudent
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
                INNER JOIN
            teams AS t ON mn.mentor_id = t.mentor_id
                INNER JOIN
            students AS st ON st.team_id = t.team_id where og.status = 'ACTIVE' ${wherefilter}
        GROUP BY og.district;`,{ type: QueryTypes.SELECT });
            const courseCompleted = await db.query(`SELECT 
            og.district,count(st.student_id) as studentCourseCMP
        FROM
            students AS st
                JOIN
            teams AS te ON st.team_id = te.team_id
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                user_id, COUNT(*)
            FROM
                user_topic_progress
            GROUP BY user_id
            HAVING COUNT(*) >= 34) AS temp ON st.user_id = temp.user_id WHERE og.status='ACTIVE' ${wherefilter} group by og.district`, { type: QueryTypes.SELECT });
            const courseINprogesss = await db.query(`SELECT 
            og.district,count(st.student_id) as studentCourseIN
        FROM
            students AS st
                JOIN
            teams AS te ON st.team_id = te.team_id
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                user_id, COUNT(*)
            FROM
                user_topic_progress
            GROUP BY user_id
            HAVING COUNT(*) < 34) AS temp ON st.user_id = temp.user_id WHERE og.status='ACTIVE' ${wherefilter} group by og.district`, { type: QueryTypes.SELECT });
            const submittedCount = await db.query(`SELECT 
            og.district,count(te.team_id) as submittedCount
        FROM
            teams AS te
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                team_id, status
            FROM
                challenge_responses
            WHERE
                status = 'SUBMITTED') AS temp ON te.team_id = temp.team_id WHERE og.status='ACTIVE' ${wherefilter} group by og.district`, { type: QueryTypes.SELECT });
            const draftCount = await db.query(`SELECT 
            og.district,count(te.team_id) as draftCount
        FROM
            teams AS te
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                team_id, status
            FROM
                challenge_responses
            WHERE
                status = 'DRAFT') AS temp ON te.team_id = temp.team_id WHERE og.status='ACTIVE' ${wherefilter} group by og.district`, { type: QueryTypes.SELECT });
            data['summary'] = summary;
            data['studentCountDetails'] = studentCountDetails;
            data['courseCompleted'] = courseCompleted;
            data['courseINprogesss'] = courseINprogesss;
            data['submittedCount'] = submittedCount;
            data['draftCount'] = draftCount;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    private async refreshSchoolDReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const service = new SchoolDReportService()
            await service.executeSchoolDReport()
            const result = 'School Report SQL queries executed successfully.'
            res.status(200).json(dispatcher(res, result, "success"))
        } catch (err) {
            next(err);
        }
    }
    private async refreshStudentDReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const service = new StudentDReportService()
            await service.executeStudentDReport()
            const result = 'Student Report SQL queries executed successfully.'
            res.status(200).json(dispatcher(res, result, "success"))
        } catch (err) {
            next(err);
        }
    }
    private async refreshIdeaReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const service = new IdeaReportService()
            await service.executeIdeaDReport()
            const result = 'idea Report SQL queries executed successfully.'
            res.status(200).json(dispatcher(res, result, "success"))
        } catch (err) {
            next(err);
        }
    }
    protected async getideaReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const {district,sdg,category} = req.query;
            let districtFilter: any = `'%%'`
            let categoryFilter:any = `'%%'`
            let themesFilter:any = `'%%'`
            if(district !== 'All Districts' && district!== undefined){
                districtFilter = `'${district}'`
            }
            if(category !== 'All Categorys' && category!== undefined){
                categoryFilter = `'${category}'`
            }
            if(sdg!=='ALL SDGs' && sdg!== undefined){
                themesFilter = `'${sdg}'`
            }
            const summary = await db.query(`SELECT 
            organization_code,
            district,
            challenge_response_id,
            organization_name,
            category,
            full_name,
            mobile,
            team_name,
            students_names AS 'Students names',
            sdg,
            response
        FROM
            idea_report
            where status = 'SUBMITTED' && district like ${districtFilter} && sdg like ${themesFilter} && category like ${categoryFilter};`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL1Report(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const {district,sdg,category} = req.query;
            let districtFilter: any = `'%%'`
            let categoryFilter:any = `'%%'`
            let themesFilter:any = `'%%'`
            if(district !== 'All Districts' && district!== undefined){
                districtFilter = `'${district}'`
            }
            if(category !== 'All Categorys' && category!== undefined){
                categoryFilter = `'${category}'`
            }
            if(sdg!=='ALL SDGs' && sdg!== undefined){
                themesFilter = `'${sdg}'`
            }
            const summary = await db.query(`SELECT 
            organization_code,
            district,
            challenge_response_id,
            organization_name,
            category,
            full_name,
            mobile,
            team_name,
            students_names AS 'Students names',
            sdg,
            response,
            evaluation_status
        FROM
            idea_report
            WHERE
                evaluation_status in ('REJECTEDROUND1','SELECTEDROUND1')
                && district like ${districtFilter} && sdg like ${themesFilter} && category like ${categoryFilter};`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL2Report(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const {district,sdg,category} = req.query;
            let districtFilter: any = `'%%'`
            let categoryFilter:any = `'%%'`
            let themesFilter:any = `'%%'`
            if(district !== 'All Districts' && district!== undefined){
                districtFilter = `'${district}'`
            }
            if(category !== 'All Categorys' && category!== undefined){
                categoryFilter = `'${category}'`
            }
            if(sdg!=='ALL SDGs' && sdg!== undefined){
                themesFilter = `'${sdg}'`
            }
            const summary = await db.query(`SELECT 
            organization_code,
            district,
            challenge_response_id,
            organization_name,
            category,
            full_name,
            mobile,
            team_name,
            students_names AS 'Students names',
            sdg,
            response,
            overall_score AS 'Overall score',
            quality_score AS 'Quality score',
            feasibility_score AS 'Feasibility score',
            final_result
        FROM
            idea_report
        WHERE
            evaluation_status = 'SELECTEDROUND1'
             && district like ${districtFilter} && sdg like ${themesFilter} && category like ${categoryFilter};`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL3Report(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const {district,sdg,category} = req.query;
            let districtFilter: any = `'%%'`
            let categoryFilter:any = `'%%'`
            let themesFilter:any = `'%%'`
            if(district !== 'All Districts' && district!== undefined){
                districtFilter = `'${district}'`
            }
            if(category !== 'All Categorys' && category!== undefined){
                categoryFilter = `'${category}'`
            }
            if(sdg!=='ALL SDGs' && sdg!== undefined){
                themesFilter = `'${sdg}'`
            }
            const summary = await db.query(`SELECT 
            organization_code,
            district,
            challenge_response_id,
            organization_name,
            category,
            full_name,
            mobile,
            team_name,
            students_names AS 'Students names',
            sdg,
            response,
            overall_score AS 'Overall score',
            quality_score AS 'Quality score',
            feasibility_score AS 'Feasibility score',
            final_result
        FROM
            idea_report
        WHERE
            final_result <>'null'
            && district like ${districtFilter} && sdg like ${themesFilter} && category like ${categoryFilter};`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getideaReportTable(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const district = req.query.district;
            let wherefilter = '';
            if(district){
                wherefilter = `WHERE org.district= '${district}'`;
            }
            const summary = await db.query(`SELECT 
            org.district,
    COALESCE(totalSubmited, 0) AS totalSubmited,
    COALESCE(ATL_Count, 0) AS ATL_Count,
    COALESCE(NonATL_Count, 0) AS NonATL_Count,
    COALESCE(NOPOVERTY, 0) AS NOPOVERTY,
    COALESCE(ZEROHUNGER, 0) AS ZEROHUNGER,
    COALESCE(GOODHEALTHANDWELLBEING, 0) AS GOODHEALTHANDWELLBEING,
    COALESCE(QUALITYEDUCATION, 0) AS QUALITYEDUCATION,
    COALESCE(GENDEREQUALITY, 0) AS GENDEREQUALITY,
    COALESCE(CLEANWATERANDSANITATION, 0) AS CLEANWATERANDSANITATION,
    COALESCE(AFFORDABLEANDCLEANENERGY, 0) AS AFFORDABLEANDCLEANENERGY,
    COALESCE(DECENTWORKANDECONOMICGROWTH, 0) AS DECENTWORKANDECONOMICGROWTH,
    COALESCE(INDUSTRYINNOVATIONANDINFRASTRUCTURE, 0) AS INDUSTRYINNOVATIONANDINFRASTRUCTURE,
    COALESCE(REDUCEDINEQUALITIES, 0) AS REDUCEDINEQUALITIES,
    COALESCE(SUSTAINABLECITESANDCOMMUNITES, 0) AS SUSTAINABLECITESANDCOMMUNITES,
    COALESCE(RESPONSIBLECONSUMTIONANDPRODUCTION, 0) AS RESPONSIBLECONSUMTIONANDPRODUCTION,
    COALESCE(CLIMATEACTION, 0) AS CLIMATEACTION,
    COALESCE(LIFEBELOWWATER, 0) AS LIFEBELOWWATER,
    COALESCE(LIFEONLAND, 0) AS LIFEONLAND,
    COALESCE(PEACEJUSTICEANDSTRONGINSTITUTIONS, 0) AS PEACEJUSTICEANDSTRONGINSTITUTIONS,
    COALESCE(PARTNERSHIPSFORTHEGOALS, 0) AS PARTNERSHIPSFORTHEGOALS,
    COALESCE(OTHERS, 0) AS OTHERS
FROM
    organizations AS org
        LEFT JOIN
    (SELECT 
        COUNT(*) AS totalSubmited,
            COUNT(CASE
                WHEN org.category = 'ATL' THEN 1
            END) AS ATL_Count,
            COUNT(CASE
                WHEN org.category = 'Non ATL' THEN 1
            END) AS NonATL_Count,
            COUNT(CASE
                WHEN cal.sdg = 'NO POVERTY' THEN 1
            END) AS NOPOVERTY,
            COUNT(CASE
                WHEN cal.sdg = 'ZERO HUNGER' THEN 1
            END) AS ZEROHUNGER,
            COUNT(CASE
                WHEN cal.sdg = 'GOOD HEALTH AND WELL-BEING' THEN 1
            END) AS GOODHEALTHANDWELLBEING,
            COUNT(CASE
                WHEN cal.sdg = 'QUALITY EDUCATION' THEN 1
            END) AS QUALITYEDUCATION,
            COUNT(CASE
                WHEN cal.sdg = 'GENDER EQUALITY' THEN 1
            END) AS GENDEREQUALITY,
            COUNT(CASE
                WHEN cal.sdg = 'CLEAN WATER AND SANITATION' THEN 1
            END) AS CLEANWATERANDSANITATION,
            COUNT(CASE
                WHEN cal.sdg = 'AFFORDABLE AND CLEAN ENERGY' THEN 1
            END) AS AFFORDABLEANDCLEANENERGY,
            COUNT(CASE
                WHEN cal.sdg = 'DECENT WORK AND ECONOMIC GROWTH' THEN 1
            END) AS DECENTWORKANDECONOMICGROWTH,
            COUNT(CASE
                WHEN cal.sdg = 'INDUSTRY, INNOVATION AND INFRASTRUCTURE' THEN 1
            END) AS INDUSTRYINNOVATIONANDINFRASTRUCTURE,
            COUNT(CASE
                WHEN cal.sdg = 'REDUCED INEQUALITIES' THEN 1
            END) AS REDUCEDINEQUALITIES,
            COUNT(CASE
                WHEN cal.sdg = 'SUSTAINABLE CITES AND COMMUNITES' THEN 1
            END) AS SUSTAINABLECITESANDCOMMUNITES,
            COUNT(CASE
                WHEN cal.sdg = 'RESPONSIBLE CONSUMTION AND PRODUCTION' THEN 1
            END) AS RESPONSIBLECONSUMTIONANDPRODUCTION,
            COUNT(CASE
                WHEN cal.sdg = 'CLIMATE ACTION' THEN 1
            END) AS CLIMATEACTION,
            COUNT(CASE
                WHEN cal.sdg = 'LIFE BELOW WATER' THEN 1
            END) AS LIFEBELOWWATER,
            COUNT(CASE
                WHEN cal.sdg = 'LIFE ON LAND' THEN 1
            END) AS LIFEONLAND,
            COUNT(CASE
                WHEN cal.sdg = 'PEACE, JUSTICE AND STRONG INSTITUTIONS' THEN 1
            END) AS PEACEJUSTICEANDSTRONGINSTITUTIONS,
            COUNT(CASE
                WHEN cal.sdg = 'PARTNERSHIPS FOR THE GOALS' THEN 1
            END) AS PARTNERSHIPSFORTHEGOALS,
            COUNT(CASE
                WHEN cal.sdg = 'OTHERS' THEN 1
            END) AS OTHERS,
                    org.district
            FROM
                challenge_responses AS cal
            JOIN teams AS t ON cal.team_id = t.team_id
            JOIN mentors AS m ON t.mentor_id = m.mentor_id
            JOIN organizations AS org ON m.organization_code = org.organization_code
            WHERE
                cal.status = 'SUBMITTED'
            GROUP BY org.district) AS t2 ON org.district = t2.district
            ${wherefilter}
        GROUP BY org.district`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL1ReportTable1(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const district = req.query.district;
            let wherefilter = '';
            if(district){
                wherefilter = `WHERE org.district= '${district}'`;
            }
            const summary = await db.query(`SELECT 
            org.district,
            COALESCE(totalSubmited, 0) AS totalSubmited,
            COALESCE(accepted, 0) AS accepted,
            COALESCE(rejected, 0) AS rejected
        FROM
            organizations AS org
                LEFT JOIN
            (SELECT 
                COUNT(*) AS totalSubmited,
                district,
                    COUNT(CASE
                        WHEN evaluation_status = 'SELECTEDROUND1' THEN 1
                    END) AS accepted,
                    COUNT(CASE
                        WHEN evaluation_status = 'REJECTEDROUND1' THEN 1
                    END) AS rejected
            FROM
                challenge_responses AS cal
            WHERE
                cal.status = 'SUBMITTED'
            GROUP BY district) AS t2 ON org.district = t2.district
            ${wherefilter}
        GROUP BY org.district`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL1ReportTable2(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const summary = await db.query(`SELECT 
            user_id,
            full_name,
            COUNT(evaluated_by) AS totalEvaluated,
            COUNT(CASE
                WHEN evaluation_status = 'SELECTEDROUND1' THEN 1
            END) AS accepted,
            COUNT(CASE
                WHEN evaluation_status = 'REJECTEDROUND1' THEN 1
            END) AS rejected
        FROM
            challenge_responses AS cal
                JOIN
            evaluators AS evl ON cal.evaluated_by = evl.user_id
        WHERE
            cal.status = 'SUBMITTED'
        GROUP BY evaluated_by`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL2ReportTable1(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const summary = await db.query(`SELECT 
            challenge_response_id,
            AVG(overall) AS overall,
            (AVG(param_1) + AVG(param_2)) / 3 AS Quality,
            (AVG(param_3) + AVG(param_4) + AVG(param_5)) / 3 AS Feasibility
        FROM
            evaluator_ratings
        GROUP BY challenge_response_id;
        `, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL2ReportTable2(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const summary = await db.query(`SELECT 
            user_id, full_name, COUNT(*) as totalEvaluated
        FROM
            evaluator_ratings
                JOIN
            evaluators ON evaluator_ratings.evaluator_id = evaluators.user_id
        GROUP BY user_id;`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL3ReportTable1(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const summary = await db.query(`
            SELECT 
    cal.challenge_response_id,
    AVG(overall) AS overall,
    (AVG(param_1) + AVG(param_2)) / 3 AS Quality,
    (AVG(param_3) + AVG(param_4) + AVG(param_5)) / 3 AS Feasibility
FROM
    evaluator_ratings AS evl_r
        JOIN
    challenge_responses AS cal ON evl_r.challenge_response_id = cal.challenge_response_id
WHERE
    final_result <> 'null'
GROUP BY challenge_response_id;`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getL3ReportTable2(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any = {}
            const district = req.query.district;
            let wherefilter = '';
            if(district){
                wherefilter = `WHERE org.district= '${district}'`;
            }
            const summary = await db.query(`SELECT 
            org.district,
            COALESCE((runners + winners),0) AS shortedlisted,
            COALESCE(runners, 0) AS runners,
            COALESCE(winners, 0) AS winners
        FROM
            organizations AS org
                LEFT JOIN
            (SELECT 
                district,
                    COUNT(CASE
                        WHEN final_result = '0' THEN 1
                    END) AS runners,
                    COUNT(CASE
                        WHEN final_result = '1' THEN 1
                    END) AS winners
            FROM
                challenge_responses AS cal
            WHERE
                cal.status = 'SUBMITTED'
            GROUP BY district) AS t2 ON org.district = t2.district
            ${wherefilter}
        GROUP BY org.district`, { type: QueryTypes.SELECT });
            data=summary;
            if (!data) {
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if (data instanceof Error) {
                throw data
            }
            res.status(200).send(dispatcher(res, data, "success"))
        } catch (err) {
            next(err)
        }
    }
}

