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
        this.router.get(this.path + "/courseComplete", this.courseComplete.bind(this));
        this.router.get(this.path + "/courseInComplete", this.courseInComplete.bind(this));
        this.router.get(this.path + "/notRegistered", this.notRegistered.bind(this));
        this.router.get(this.path + "/notRegister", this.notRegistered.bind(this));
        this.router.get(this.path + "/userTopicProgress", this.userTopicProgressGroupByCourseTopicId.bind(this));
        this.router.get(this.path + "/mentorTeamsStudents", this.teamRegistered.bind(this));
        this.router.get(this.path + "/challengesCount", this.challengesLevelCount.bind(this));
        this.router.get(this.path + "/challengesDistrictCount", this.districtWiseChallengesCount.bind(this));
        // super.initializeRoutes();
    }

    protected async getMentorRegList(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, status } = req.query;
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
            const mentorsResult = await mentor.findAll({
                attributes: [
                    "full_name",
                    "mobile",
                    "created_by",
                    "created_at",
                    "updated_at",
                    "updated_by"
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
                        model: organization,
                        attributes: [
                            "organization_code",
                            "district",
                            "organization_name"
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
            const { page, size, role } = req.query;
            let condition = role ? role : 'MENTOR';
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
            const mentorsResult = await quiz_survey_response.findAll({
                attributes: [
                    "quiz_response_id",
                    "updated_at"
                ],
                raw: true,
                where: {
                    [Op.and]: [
                        whereClauseStatusPart
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
                        where: { role: condition }
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
            const mentorsResult = await db.query("SELECT mentors.organization_code, mentors.district, mentors.full_name,(SELECT COUNT(mentor_topic_progress_id)FROM mentor_topic_progress AS mentor_progress WHERE mentor_progress.user_id=mentors.user_id) AS 'count' FROM mentors LEFT OUTER JOIN mentor_topic_progress AS mentor_progress ON mentors.user_id=mentor_progress.user_id where (SELECT COUNT(mentor_topic_progress_id)FROM mentor_topic_progress AS mentor_progress WHERE mentor_progress.user_id=mentors.user_id)= 9 GROUP BY mentor_progress.user_id", { type: QueryTypes.SELECT });
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
            const mentorsResult = await db.query("SELECT * FROM organizations WHERE NOT EXISTS(SELECT mentors.organization_code  from mentors WHERE organizations.organization_code = mentors.organization_code) ", { type: QueryTypes.SELECT });
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
}