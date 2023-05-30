import Boom, { badData, badRequest, internal, notAcceptable, notFound, unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import { Op, QueryTypes } from "sequelize";
import db from "../utils/dbconnection.util";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import validationMiddleware from "../middlewares/validation.middleware";
import { challenge_question } from "../models/challenge_questions.model";
import { challenge_response } from "../models/challenge_response.model";
import dispatcher from "../utils/dispatch.util";
import { quizSchema, quizSubmitResponseSchema, quizUpdateSchema } from "../validations/quiz.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import { quizSubmitResponsesSchema } from "../validations/quiz_survey.validations";
import { challengeSchema, challengeUpdateSchema } from "../validations/challenge.validations copy";
import { orderBy } from "lodash";
import { student } from "../models/student.model";
import { forbidden } from "joi";
import path from "path";
import fs from 'fs';
import { S3 } from "aws-sdk";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { challengeResponsesSchema, challengeResponsesUpdateSchema, initiateIdeaSchema, UpdateAnyFieldSchema } from "../validations/challenge_responses.validations";
import StudentService from "../services/students.service";
import { team } from "../models/team.model";
import { mentor } from "../models/mentor.model";
import { organization } from "../models/organization.model";
import { evaluation_process } from "../models/evaluation_process.model";
import { evaluator_rating } from "../models/evaluator_rating.model";
import { evaluation_results } from "../models/evaluation_results";

export default class ChallengeResponsesController extends BaseController {

    model = "challenge_response";

    protected initializePath(): void {
        this.path = '/challenge_response';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(challengeResponsesSchema, challengeResponsesUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        // this.router.post(this.path + "/:id/submission/", validationMiddleware(challengeSubmitResponsesSchema), this.submitResponses.bind(this));
        this.router.post(this.path + "/:id/initiate/", validationMiddleware(initiateIdeaSchema), this.initiateIdea.bind(this));
        this.router.post(this.path + "/fileUpload", this.handleAttachment.bind(this));
        this.router.get(this.path + '/submittedDetails', this.getResponse.bind(this));
        this.router.get(this.path + "/updateSubmission", this.submission.bind(this));
        this.router.get(this.path + '/fetchRandomChallenge', this.getRandomChallenge.bind(this));
        this.router.put(this.path + '/updateEntry/:id', validationMiddleware(UpdateAnyFieldSchema), this.updateAnyFields.bind(this));
        this.router.get(`${this.path}/clearResponse`, this.clearResponse.bind(this))
        this.router.get(`${this.path}/evaluated/:evaluator_id`, this.getChallengesForEvaluator.bind(this))
        this.router.get(`${this.path}/customFilter/`, this.getChallengesBasedOnFilter.bind(this));
        this.router.get(`${this.path}/districtWiseRating/`, this.districtWiseRating.bind(this));
        this.router.get(`${this.path}/evaluationResult/`, this.evaluationResult.bind(this));
        this.router.get(`${this.path}/finalEvaluation/`, this.finalEvaluation.bind(this));
        super.initializeRoutes();
    }

    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        let user_id = res.locals.user_id;
        let { team_id } = req.query;
        if (!user_id) {
            throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
        }
        let data: any;
        let responseOfFindAndCountAll: any;
        const { model, id } = req.params;
        const paramStatus: any = req.query.status;
        const evaluation_status: any = req.query.evaluation_status;
        const district: any = req.query.district;
        const sdg: any = req.query.sdg;
        const rejected_reason: any = req.query.rejected_reason;
        const evaluator_id: any = req.query.evaluator_id;
        const level: any = req.query.level;
        const yetToProcessList: any = req.query.yetToProcessList;
        if (model) {
            this.model = model;
        };
        // pagination
        const { page, size, title } = req.query;
        let condition: any = {};
        if (team_id) {
            condition = { team_id };
        }
        const { limit, offset } = this.getPagination(page, size);
        const modelClass = await this.loadModel(model).catch(error => {
            next(error)
        });
        const where: any = {};
        let whereClauseStatusPart: any = {}
        let additionalFilter: any = {};
        let boolStatusWhereClauseEvaluationStatusRequired = false;
        //status filter
        if (paramStatus && (paramStatus in constents.challenges_flags.list)) {
            whereClauseStatusPart = { "status": paramStatus };
            boolStatusWhereClauseEvaluationStatusRequired = true;
        } else if (paramStatus === 'ALL') {
            whereClauseStatusPart = {};
            boolStatusWhereClauseEvaluationStatusRequired = false;
        } else {
            whereClauseStatusPart = { "status": "SUBMITTED" };
            boolStatusWhereClauseEvaluationStatusRequired = true;
        };
        //evaluation status filter
        if (evaluation_status) {
            if (evaluation_status in constents.evaluation_status.list) {
                whereClauseStatusPart = { 'evaluation_status': evaluation_status };
            } else {
                whereClauseStatusPart['evaluation_status'] = null;
            }
        }
        if (sdg) {
            additionalFilter['sdg'] = sdg && typeof sdg == 'string' ? sdg : {}
        }
        if (rejected_reason) {
            additionalFilter['rejected_reason'] = rejected_reason && typeof rejected_reason == 'string' ? rejected_reason : {}
        }
        if (evaluator_id) {
            additionalFilter['evaluated_by'] = evaluator_id && typeof evaluator_id == 'string' ? evaluator_id : {}
        }
        if (district) {
            additionalFilter["district"] = district && typeof district == 'string' ? district : {}
        }
        if (id) {
            where[`${this.model}_id`] = req.params.id;
            try {
                if (level && typeof level == 'string') {
                    switch (level) {
                        case 'L1':
                            data = await this.crudService.findOne(modelClass, {
                                attributes: [
                                    "challenge_response_id",
                                    "challenge_id",
                                    "sdg",
                                    "team_id",
                                    "response",
                                    "initiated_by",
                                    "created_at",
                                    "submitted_at",
                                    "evaluated_by",
                                    "evaluated_at",
                                    "evaluation_status",
                                    "status",
                                    "rejected_reason",
                                    [
                                        db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_name'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                                    ]
                                ],
                                where: {
                                    [Op.and]: [
                                        where,
                                        condition
                                    ]
                                }
                            });
                            break;
                        case 'L2':
                            data = await this.crudService.findOne(modelClass, {
                                attributes: [
                                    "challenge_response_id",
                                    "challenge_id",
                                    "sdg",
                                    "team_id",
                                    "response",
                                    "initiated_by",
                                    "created_at",
                                    "submitted_at",
                                    "evaluated_by",
                                    "evaluated_at",
                                    "evaluation_status",
                                    "status",
                                    "rejected_reason",
                                    [
                                        db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_name'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                                    ]
                                ],
                                where: {
                                    [Op.and]: [
                                        where,
                                        condition
                                    ]
                                },
                                include: {
                                    model: evaluator_rating,
                                    required: false,
                                    attributes: [
                                        'evaluator_rating_id',
                                        'evaluator_id',
                                        'challenge_response_id',
                                        'status',
                                        'level',
                                        'param_1',
                                        'param_2',
                                        'param_3',
                                        'param_4',
                                        'param_5',
                                        'comments',
                                        'overall',
                                        'submitted_at',
                                        "created_at",
                                        [
                                            db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = evaluator_ratings.created_by)`), 'rated_evaluated_name'
                                        ]
                                    ]
                                }
                            });
                            break;
                        case level != 'L1' && 'L2':
                            break;
                    }
                }
                data = await this.crudService.findOne(modelClass, {
                    attributes: [
                        "challenge_response_id",
                        "challenge_id",
                        "sdg",
                        "team_id",
                        "response",
                        "initiated_by",
                        "created_at",
                        "submitted_at",
                        "evaluated_by",
                        "evaluated_at",
                        "evaluation_status",
                        "status",
                        "rejected_reason",
                        [
                            db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_name'
                        ],
                        [
                            db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                        ],
                        [
                            db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                        ]
                    ],
                    where: {
                        [Op.and]: [
                            where,
                            condition
                        ]
                    }
                });
            } catch (error) {
                return res.status(500).send(dispatcher(res, data, 'error'))
            }
            data.dataValues.response = JSON.parse(data.dataValues.response);
        } else {
            try {
                if (level && typeof level == 'string') {
                    switch (level) {
                        case 'L1':
                            whereClauseStatusPart['status'] = "SUBMITTED";
                            if (yetToProcessList) {
                                if (yetToProcessList && yetToProcessList == 'L1') {
                                    whereClauseStatusPart['evaluation_status'] = {
                                        [Op.or]: [
                                            { [Op.is]: null }, ''
                                        ]
                                    }
                                }
                            }
                            responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                                attributes: [
                                    "challenge_response_id",
                                    "challenge_id",
                                    "sdg",
                                    "team_id",
                                    "response",
                                    "initiated_by",
                                    "created_at",
                                    "submitted_at",
                                    "evaluated_by",
                                    "evaluated_at",
                                    "evaluation_status",
                                    "status",
                                    "rejected_reason",
                                    "final_result", "district",
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                                    ],
                                    [
                                        db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`challenge_response\`.\`team_id\` )`), 'team_name'
                                    ],
                                    [
                                        db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_members'
                                    ],
                                    [
                                        db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id =  \`challenge_responses\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                                    ],
                                    [
                                        db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id = \`challenge_responses\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_responses.team_id = \`challenge_responses\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                                    ]
                                ],
                                where: {
                                    [Op.and]: [
                                        condition,
                                        whereClauseStatusPart,
                                        additionalFilter,
                                    ]
                                }, limit, offset,
                            });
                            break;
                        case 'L2':
                            // cleaning up the repeated code: observation everything is same except the having groupBy clause so separating both of them based the parameter
                            let havingClausePart: any;
                            let groupByClausePart: any;
                            whereClauseStatusPart['evaluation_status'] = "SELECTEDROUND1";
                            if (yetToProcessList) {
                                if (yetToProcessList && yetToProcessList == 'L2') {
                                    groupByClausePart = [`challenge_response.challenge_response_id`];
                                    havingClausePart = db.Sequelize.where(db.Sequelize.fn('count', db.Sequelize.col(`evaluator_ratings.challenge_response_id`)), {
                                        [Op.lt]: 3
                                    })
                                }
                            } else {
                                groupByClausePart = [`evaluator_ratings.challenge_response_id`];
                                havingClausePart = db.Sequelize.where(db.Sequelize.fn('count', db.Sequelize.col(`evaluator_ratings.challenge_response_id`)), {
                                    [Op.gte]: 3
                                })
                            }
                            responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                                attributes: [
                                    "challenge_response_id",
                                    "challenge_id",
                                    "sdg",
                                    "team_id",
                                    "response",
                                    "initiated_by",
                                    "created_at",
                                    "submitted_at",
                                    "evaluated_by",
                                    "evaluated_at",
                                    "evaluation_status",
                                    "status",
                                    "rejected_reason",
                                    "final_result", "district",
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                                    ],
                                    [
                                        db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`challenge_response\`.\`team_id\` )`), 'team_name'
                                    ],
                                    [
                                        db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_members'
                                    ],
                                    [
                                        db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id =  \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                                    ],
                                    [
                                        db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                                    ],
                                    [
                                        db.literal(`(SELECT full_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                                    ]
                                ],
                                where: {
                                    [Op.and]: [
                                        condition,
                                        whereClauseStatusPart,
                                        additionalFilter,
                                    ]
                                },
                                include: [{
                                    model: evaluator_rating,
                                    where: { level: 'L2' },
                                    required: false,
                                    attributes: [
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(param_1) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_1'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(param_2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_2'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(param_3) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_3'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(param_4) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_4'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(param_5) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_5'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(comments) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'comments'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(overall) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'overall'
                                        ],
                                        [
                                            db.literal(`(SELECT ROUND(AVG(CAST(overall AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'overall_avg'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(created_at) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'created_at'
                                        ],
                                        [
                                            db.literal(`(SELECT  JSON_ARRAYAGG(evaluator_id) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'evaluator_id'
                                        ],
                                        [
                                            db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = evaluator_ratings.created_by)`), 'rated_evaluated_name'
                                        ]
                                    ]
                                }],
                                group: groupByClausePart,
                                having: havingClausePart,
                                subQuery: false,
                                limit, offset,
                            });
                            responseOfFindAndCountAll.count = responseOfFindAndCountAll.count.length
                            break;
                        case level !== 'L1' && 'L2':
                            break;
                    }
                } else {
                    responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        attributes: [
                            "challenge_response_id",
                            "challenge_id",
                            "sdg",
                            "team_id",
                            "response",
                            "initiated_by",
                            "created_at",
                            "submitted_at",
                            "evaluated_by",
                            "evaluated_at",
                            "evaluation_status",
                            "status",
                            "rejected_reason",
                            "final_result", "district",
                            [
                                db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                            ],
                            [
                                db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                            ],
                            [
                                db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`challenge_response\`.\`team_id\` )`), 'team_name'
                            ],
                            [
                                db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_members'
                            ],
                            [
                                db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id =  \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                            ],
                            [
                                db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                            ],
                            [
                                db.literal(`(SELECT full_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                            ]
                        ],
                        where: {
                            [Op.and]: [
                                condition,
                                whereClauseStatusPart,
                                additionalFilter,
                            ]
                        }, limit, offset,
                    });
                }
                const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                data = result;
            } catch (error: any) {
                return res.status(500).send(dispatcher(res, data, 'error'))
            }
            data.dataValues.forEach((element: any) => { element.dataValues.response = JSON.parse(element.dataValues.response) })
        }
        if (!data || data instanceof Error) {
            if (data != null) {
                throw notFound(data.message)
            } else {
                throw notFound()
            }
            res.status(200).send(dispatcher(res, null, "error", speeches.DATA_NOT_FOUND));
            // (data.message)
        }
        return res.status(200).send(dispatcher(res, data, 'success'));
    };
    protected async getRandomChallenge(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let challengeResponse: any;
            let evaluator_id: any;
            let whereClause: any = {};
            let whereClauseStatusPart: any = {}
            let attributesNeedFetch: any;

            let user_id = res.locals.user_id;
            if (!user_id) throw unauthorized(speeches.UNAUTHORIZED_ACCESS);

            let evaluator_user_id = req.query.evaluator_user_id;
            if (!evaluator_user_id) throw unauthorized(speeches.ID_REQUIRED);

            const paramStatus: any = req.query.status;
            let boolStatusWhereClauseRequired = false;

            if (paramStatus && (paramStatus in constents.challenges_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus };
                boolStatusWhereClauseRequired = true;
            } else {
                whereClauseStatusPart = { "status": "SUBMITTED" };
                boolStatusWhereClauseRequired = true;
            };

            evaluator_id = { evaluated_by: evaluator_user_id }

            let level = req.query.level;

            if (level && typeof level == 'string') {
                switch (level) {
                    case 'L1':
                        attributesNeedFetch = [
                            `challenge_response_id`,
                            `challenge_id`,
                            `others`,
                            `sdg`,
                            `team_id`,
                            `response`,
                            `initiated_by`,
                            "created_at",
                            "submitted_at",
                            `status`,
                            [
                                db.literal(`( SELECT count(*) FROM challenge_responses as idea where idea.status = 'SUBMITTED')`),
                                'overAllIdeas'
                            ],
                            [
                                db.literal(`( SELECT count(*) FROM challenge_responses as idea where idea.evaluation_status is null AND idea.status = 'SUBMITTED')`),
                                'openIdeas'
                            ],
                            [
                                db.literal(`(SELECT count(*) FROM challenge_responses as idea where idea.evaluated_by = ${evaluator_user_id.toString()})`), 'evaluatedIdeas'
                            ],
                        ],
                            whereClause = {
                                [Op.and]: [
                                    whereClauseStatusPart,
                                    { evaluation_status: { [Op.is]: null } }
                                ]
                            }
                        challengeResponse = await this.crudService.findOne(challenge_response, {
                            attributes: attributesNeedFetch,
                            where: whereClause,
                            order: db.literal('rand()'), limit: 1
                        });
                        if (challengeResponse instanceof Error) {
                            throw challengeResponse
                        }
                        if (!challengeResponse) {
                            throw notFound("All challenge has been accepted, no more challenge to display");
                        };
                        challengeResponse.dataValues.response = JSON.parse(challengeResponse.dataValues.response)
                        break;
                    case 'L2':
                        let activeDistrict = await this.crudService.findOne(evaluation_process, {
                            attributes: ['district'], where: { [Op.and]: [{ status: 'ACTIVE' }, { level_name: 'L2' }] }
                        });
                        let districts = activeDistrict.dataValues.district
                        if (districts !== null) {
                            let districtsArray = districts.replace(/,/g, "','")
                            challengeResponse = await db.query("SELECT challenge_responses.challenge_response_id, challenge_responses.challenge_id, challenge_responses.sdg, challenge_responses.team_id, challenge_responses.response, challenge_responses.initiated_by,  challenge_responses.created_at, challenge_responses.submitted_at,    challenge_responses.status, (SELECT COUNT(*) FROM challenge_responses AS idea WHERE idea.evaluation_status = 'SELECTEDROUND1') AS 'overAllIdeas', (SELECT COUNT(*) FROM l1_accepted WHERE l1_accepted.district IN ('" + districtsArray + "')) AS 'openIdeas', (SELECT COUNT(*) FROM evaluator_ratings AS A WHERE A.evaluator_id = " + evaluator_user_id.toString() + ") AS 'evaluatedIdeas' FROM l1_accepted AS l1_accepted LEFT OUTER JOIN challenge_responses AS challenge_responses ON l1_accepted.challenge_response_id = challenge_responses.challenge_response_id WHERE l1_accepted.district IN ('" + districtsArray + "') AND NOT FIND_IN_SET(" + evaluator_user_id.toString() + ", l1_accepted.evals) ORDER BY RAND() LIMIT 1", { type: QueryTypes.SELECT });
                        } else {
                            challengeResponse = await db.query(`SELECT challenge_responses.challenge_response_id, challenge_responses.challenge_id, challenge_responses.sdg, challenge_responses.team_id, challenge_responses.response, challenge_responses.initiated_by,  challenge_responses.created_at, challenge_responses.submitted_at,    challenge_responses.status,    (SELECT COUNT(*) FROM challenge_responses AS idea WHERE idea.evaluation_status = 'SELECTEDROUND1') AS 'overAllIdeas', (SELECT COUNT(*) FROM l1_accepted) AS 'openIdeas', (SELECT COUNT(*) FROM evaluator_ratings AS A WHERE A.evaluator_id = ${evaluator_user_id.toString()}) AS 'evaluatedIdeas' FROM l1_accepted AS l1_accepted LEFT OUTER JOIN challenge_responses AS challenge_responses ON l1_accepted.challenge_response_id = challenge_responses.challenge_response_id WHERE NOT FIND_IN_SET(${evaluator_user_id.toString()}, l1_accepted.evals) ORDER BY RAND() LIMIT 1`, { type: QueryTypes.SELECT });
                        }
                        const evaluatedIdeas = await db.query(`SELECT COUNT(*) as evaluatedIdeas FROM evaluator_ratings AS A WHERE A.evaluator_id = ${evaluator_user_id.toString()}`, { type: QueryTypes.SELECT })
                        let throwMessage = {
                            message: 'All challenge has been rated, no more challenge to display',
                            //@ts-ignore
                            evaluatedIdeas: evaluatedIdeas[0].evaluatedIdeas
                        };
                        if (challengeResponse instanceof Error) {
                            throw challengeResponse
                        }
                        if (challengeResponse.length == 0) {
                            // throw notFound("All challenge has been rated, no more challenge to display");
                            return res.status(200).send(dispatcher(res, throwMessage, 'success'));
                        };
                        challengeResponse[0].response = JSON.parse(challengeResponse[0].response)
                        break;
                    default:
                        break;
                }
            }
            return res.status(200).send(dispatcher(res, challengeResponse, 'success'));
        } catch (error) {
            next(error);
        }
    }
    protected async insertSingleResponse(team_id: any, user_id: any, challenge_id: any, challenge_question_id: any, selected_option: any) {
        try {
            const questionAnswered = await this.crudService.findOne(challenge_question, { where: { challenge_question_id } });
            if (questionAnswered instanceof Error) {
                throw internal(questionAnswered.message)
            }
            if (!questionAnswered) {
                throw badData("Invalid Quiz question id")
            }
            const challengeRes = await this.crudService.findOne(challenge_response, { where: { challenge_id, team_id } });
            if (challengeRes instanceof Error) {
                throw internal(challengeRes.message)
            }
            // const studentDetailsBasedOnTeam = await this.crudService.findAll(student, { where: { team_id } });
            // if (studentDetailsBasedOnTeam instanceof Error) {
            //     throw internal(studentDetailsBasedOnTeam.message)
            // };
            // console.log(studentDetailsBasedOnTeam.length);
            let dataToUpsert: any = {}
            dataToUpsert = { challenge_id, team_id, updated_by: user_id }
            let responseObjToAdd: any = {}
            responseObjToAdd = {
                challenge_question_id: questionAnswered.challenge_question_id,
                selected_option: selected_option,
                question: questionAnswered.dataValues.question,
                word_limit: questionAnswered.dataValues.word_limit,
                question_type: questionAnswered.dataValues.type,
                question_no: questionAnswered.dataValues.question_no
            }

            let user_response: any = {}
            if (challengeRes) {
                user_response = JSON.parse(challengeRes.dataValues.response);
                user_response[questionAnswered.dataValues.challenge_question_id] = responseObjToAdd;
                dataToUpsert["response"] = JSON.stringify(user_response);
                // if (user_id === ) {
                //     one type need to be check if its student then fetch student details and then allow updating based on team_id if same case for teacher
                const resultModel = await this.crudService.update(challengeRes, dataToUpsert, { where: { challenge_id, team_id } })
                if (resultModel instanceof Error) {
                    throw internal(resultModel.message)
                }
                let result: any = {}
                result = resultModel.dataValues
                // }
                return user_response;
            } else {
                user_response[questionAnswered.dataValues.challenge_question_id] = responseObjToAdd;
                // team_id  1, challenge_id = 1, responses = {
                //     q_1: {
                //         question:
                //             selected_pption:
                //     },
                //     q_2: {
                //         question:
                //             selected_options:
                //     }

                // }
                dataToUpsert["response"] = JSON.stringify(user_response);
                dataToUpsert = { ...dataToUpsert }
                const resultModel = await this.crudService.create(challenge_response, dataToUpsert)
                if (resultModel instanceof Error) {
                    throw internal(resultModel.message)
                }
                let result: any = {}
                result = resultModel.dataValues
                // result["is_correct"] = responseObjToAdd.is_correct;
                // if(responseObjToAdd.is_correct){
                //     result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                // }else{
                //     result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                // }
                // result["redirect_to"] = questionAnswered.dataValues.redirect_to;
                return result;
            }

        } catch (err) {
            return err;
        }

    }
    protected async createData(req: Request, res: Response, next: NextFunction) {
        try {
            const { challenge_id, team_id } = req.query;
            const { responses } = req.body;
            const user_id = res.locals.user_id;
            if (!challenge_id) {
                throw badRequest(speeches.CHALLENGE_ID_REQUIRED);
            }
            if (!responses) {
                throw badRequest(speeches.CHALLENGE_QUESTION_ID_REQUIRED);
            }
            if (!team_id) {
                throw unauthorized(speeches.USER_TEAMID_REQUIRED)
            }
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }
            const results: any = []
            let result: any = {};
            for (const element of responses) {
                let selected_option = Array.isArray(element.selected_option) ? element.selected_option.join("{{}}") : element.selected_option;
                selected_option = res.locals.translationService.getTranslationKey(selected_option).split("{{}}");
                result = await this.insertSingleResponse(team_id, user_id, challenge_id, element.challenge_question_id, selected_option)
                if (!result || result instanceof Error) {
                    throw badRequest();
                } else {
                    results.push(result);
                }
            }

            let newDate = new Date();
            let newFormat = (newDate.getFullYear()) + "-" + (1 + newDate.getMonth()) + "-" + newDate.getUTCDate() + ' ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
            const updateStatus = await this.crudService.update(challenge_response, {
                status: req.body.status,
                sdg: req.body.sdg,
                others: req.body.others,
                submitted_at: req.body.status == "SUBMITTED" ? newFormat.trim() : null
            }, {
                where: {
                    [Op.and]: [
                        { team_id: team_id }
                    ]
                }
            });
            if (req.body.status == "SUBMITTED") {
                const findingTheStudentsBasedOnTeamId = await this.crudService.findAll(student, {
                    where: { team_id },
                    attributes: [
                        'badges',
                        'student_id'
                    ]
                });
                let studentBadgesObj: any = {}
                let studentBadgesObjForNull: any = {}
                findingTheStudentsBasedOnTeamId.forEach(async (s: any) => {
                    if (!s.dataValues.badges) {
                        studentBadgesObjForNull["the_change_maker"] = {
                            completed_date: (new Date())
                        }
                        const studentBadgesObjForNullJson = JSON.stringify(studentBadgesObjForNull)
                        await student.update({ badges: studentBadgesObjForNullJson }, {
                            where: {
                                student_id: s.dataValues.student_id
                            }
                        })
                    } else {
                        studentBadgesObj = JSON.parse(s.dataValues.badges);
                        studentBadgesObj["the_change_maker"] = {
                            completed_date: (new Date())
                        }
                        const studentBadgesObjJson = JSON.stringify(studentBadgesObj)
                        await student.update({ badges: studentBadgesObjJson }, {
                            where: {
                                student_id: s.dataValues.student_id
                            }
                        })
                    }
                });
            }
            res.status(200).send(dispatcher(res, result))
        } catch (err) {
            next(err)
        }
    }
    protected async updateData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };

            // redirecting status field to evaluater_status field and removing status from the request body;
            req.body['evaluation_status'] = req.body.status;
            delete req.body.status;

            //date format 
            let newDate = new Date();
            let newFormat = (newDate.getFullYear()) + "-" + (1 + newDate.getMonth()) + "-" + newDate.getUTCDate() + ' ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();

            const user_id = res.locals.user_id
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded);
            payload['evaluated_by'] = user_id
            payload['evaluated_at'] = newFormat.trim();
            const data = await this.crudService.update(modelLoaded, payload, { where: where });
            if (!data) {
                throw badRequest()
            }
            if (data instanceof Error) {
                throw data;
            }
            return res.status(200).send(dispatcher(res, data, 'updated'));
        } catch (error) {
            next(error);
        }
    };
    protected async updateAnyFields(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const user_id = res.locals.user_id
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded);
            const data = await this.crudService.update(modelLoaded, payload, { where: where });
            // console.log(data);
            
            if (!data) {
                throw badRequest()
            }
            if (data instanceof Error) {
                throw data;
            }
            return res.status(200).send(dispatcher(res, data, 'updated'));
        } catch (error) {
            next(error);
        }
    }
    protected async initiateIdea(req: Request, res: Response, next: NextFunction) {
        try {
            const challenge_id = req.params.id;
            const { team_id } = req.query;
            const user_id = res.locals.user_id;
            if (!challenge_id) {
                throw badRequest(speeches.CHALLENGE_ID_REQUIRED);
            }
            if (!team_id) {
                throw unauthorized(speeches.USER_TEAMID_REQUIRED)
            }
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }
            const challengeRes = await this.crudService.findOne(challenge_response, {
                attributes: [
                    [
                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`initiated_by\` )`), 'initiated_by'
                    ],
                    "created_at",
                    "sdg"
                ],
                where: { challenge_id, team_id }
            });
            if (challengeRes instanceof Error) {
                throw internal(challengeRes.message)
            }
            if (challengeRes) {
                return res.status(406).send(dispatcher(res, challengeRes, 'error', speeches.DATA_EXIST))
            }
            let dataUpset = {
                sdg: req.body.sdg,
                challenge_id: challenge_id,
                team_id: team_id,
                initiated_by: user_id,
                created_by: user_id,
                response: JSON.stringify({})
            }
            let result: any = await this.crudService.create(challenge_response, dataUpset);
            if (!result) {
                throw badRequest(speeches.INVALID_DATA);
            }
            if (result instanceof Error) {
                throw result;
            }
            res.status(200).send(dispatcher(res, result))
        } catch (err) {
            next(err)
        }
    }
    protected async handleAttachment(req: Request, res: Response, next: NextFunction) {
        try {
            const { team_id } = req.query;
            const rawfiles: any = req.files;
            const files: any = Object.values(rawfiles);
            const errs: any = [];
            let attachments: any = [];
            let result: any = {};
            let s3 = new S3({
                apiVersion: '2006-03-01',
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });
            if (!req.files) {
                return result;
            }
            let file_name_prefix: any;
            if (process.env.DB_HOST?.includes("prod")) {
                file_name_prefix = `ideas/${team_id}`
            } else {
                file_name_prefix = `ideas/stage/${team_id}`
            }
            for (const file_name of Object.keys(files)) {
                const file = files[file_name];
                const readFile: any = await fs.readFileSync(file.path);
                if (readFile instanceof Error) {
                    errs.push(`Error uploading file: ${file.originalFilename} err: ${readFile}`)
                }
                file.originalFilename = `${file_name_prefix}/${file.originalFilename}`;
                let params = {
                    Bucket: 'unisole-assets',
                    Key: file.originalFilename,
                    Body: readFile
                };
                let options: any = { partSize: 20 * 1024 * 1024, queueSize: 2 };
                await s3.upload(params, options).promise()
                    .then((data: any) => { attachments.push(data.Location) })
                    .catch((err: any) => { errs.push(`Error uploading file: ${file.originalFilename}, err: ${err.message}`) })
                result['attachments'] = attachments;
                result['errors'] = errs;
            }
            res.status(200).send(dispatcher(res, result));
        } catch (err) {
            next(err)
        }
    }
    protected async submission(req: Request, res: Response, next: NextFunction) {
        try {
            let collectAllChallengeResponseIds: any = [];
            const findChallengeIds = await this.crudService.findAll(challenge_response);
            findChallengeIds.forEach((idea: any) => collectAllChallengeResponseIds.push(idea.dataValues.challenge_response_id));
            let updateStatusToSubmitted = await this.crudService.update(challenge_response, { status: "SUBMITTED" }, {
                where: {
                    challenge_response_id: {
                        [Op.in]: collectAllChallengeResponseIds
                    }
                }
            });
            let result: any = updateStatusToSubmitted;
            res.status(200).send(dispatcher(res, result));
        } catch (err) {
            next(err)
        }
    }
    protected async getResponse(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            console.log(Date.now);
            let user_id = res.locals.user_id;
            let { team_id } = req.query;
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
            }
            if (!team_id) {
                throw unauthorized(speeches.USER_TEAMID_REQUIRED)
            }
            let data: any;
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size } = req.query;
            let condition: any = {};
            if (team_id) {
                condition.team_id = team_id
            }
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                console.log(where)
                data = await this.crudService.findOne(challenge_response, {
                    attributes: [
                        [
                            db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                        ],
                        "created_by",
                        "updated_by",
                        "created_at",
                        "updated_at",
                        "initiated_by",
                        "submitted_at",
                        "sdg",
                        "responses",
                        "team_id",
                        "challenge_id",
                        "status",
                        "others",
                        "evaluation_status"
                    ],
                    where: {
                        [Op.and]: [
                            where,
                            condition
                        ]
                    },
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(challenge_response, {
                        where: {
                            [Op.and]: [
                                condition
                            ]
                        },
                        attributes: [
                            [
                                db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                            ],
                            "initiated_by",
                            "created_at",
                            "updated_at",
                            "challenge_id",
                            "submitted_at",
                            "challenge_response_id",
                            "others",
                            "team_id",
                            "response",
                            "status",
                            "sdg",
                            "evaluation_status"
                        ],
                        limit, offset
                    })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch (error: any) {
                    return res.status(500).send(dispatcher(res, data, 'error'))
                }

            }
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
                res.status(200).send(dispatcher(res, null, "error", speeches.DATA_NOT_FOUND));
            }
            data.dataValues.forEach((element: any) => { element.dataValues.response = JSON.parse(element.dataValues.response) })
            return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error) {
            next(error);
        }
    }
    private async clearResponse(req: Request, res: Response, next: NextFunction) {
        try {
            const { team_id } = req.query
            if (!team_id) {
                throw badRequest(speeches.TEAM_NAME_ID)
            };
            const data = await this.crudService.delete(challenge_response, {
                where: {
                    team_id
                }
            })
            if (!data) {
                throw badRequest(data.message)
            };
            if (data instanceof Error) {
                throw data;
            }
            return res.status(200).send(dispatcher(res, data, 'deleted'));
        } catch (error) {
            next(error)
        }
    };
    private async getChallengesForEvaluator(req: Request, res: Response, next: NextFunction) {
        try {
            let data: any = [];
            let whereClauseEvaluationStatus: any = {};
            let additionalFilter: any = {};
            let districtFilter: any = {};
            const evaluator_id: any = req.params.evaluator_id
            const evaluation_status: any = req.query.evaluation_status;
            const district: any = req.query.district;
            const sdg: any = req.query.sdg;
            const rejected_reason: any = req.query.rejected_reason;
            const level: any = req.query.level;
            if (!evaluator_id) {
                throw badRequest(speeches.TEAM_NAME_ID)
            };
            if (evaluation_status) {
                if (evaluation_status in constents.evaluation_status.list) {
                    whereClauseEvaluationStatus = { 'evaluation_status': evaluation_status };
                } else {
                    whereClauseEvaluationStatus['evaluation_status'] = null;
                }
            }
            if (sdg) {
                additionalFilter['sdg'] = sdg && typeof sdg == 'string' ? sdg : {}
            }
            if (rejected_reason) {
                additionalFilter['rejected_reason'] = rejected_reason && typeof rejected_reason == 'string' ? rejected_reason : {}
            }
            if (district) {
                additionalFilter['district'] = district && typeof district == 'string' ? district : {}
            }
            if (level && typeof level == 'string') {
                switch (level) {
                    case 'L1':
                        data = await this.crudService.findAll(challenge_response, {
                            attributes: [
                                "challenge_response_id",
                                "challenge_id",
                                "sdg",
                                "team_id",
                                "response",
                                "initiated_by",
                                "created_at",
                                "submitted_at",
                                "evaluated_by",
                                "evaluated_at",
                                "evaluation_status",
                                "status",
                                "rejected_reason",
                                "final_result", "district",
                                [
                                    db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                                ],
                                [
                                    db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                                ],
                                [
                                    db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`challenge_response\`.\`team_id\` )`), 'team_name'
                                ],
                                [
                                    db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_members'
                                ],
                                [
                                    db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id =  \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                                ],
                                [
                                    db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                                ],
                                [
                                    db.literal(`(SELECT full_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                                ]
                            ],
                            where: {
                                [Op.and]: [
                                    { evaluated_by: evaluator_id },
                                    whereClauseEvaluationStatus,
                                    additionalFilter,
                                ]
                            }
                        });
                        break;
                    case 'L2': {
                        data = await this.crudService.findAll(challenge_response, {
                            attributes: [
                                "challenge_response_id",
                                "challenge_id",
                                "sdg",
                                "team_id",
                                "response",
                                "initiated_by",
                                "created_at",
                                "submitted_at",
                                "evaluated_by",
                                "evaluated_at",
                                "evaluation_status",
                                "status",
                                "rejected_reason",
                                "final_result", "district",
                                [
                                    db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                                ],
                                [
                                    db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                                ],
                                [
                                    db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`challenge_response\`.\`team_id\` )`), 'team_name'
                                ],
                                [
                                    db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_members'
                                ],
                                [
                                    db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id =  \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                                ],
                                [
                                    db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                                ],
                                [
                                    db.literal(`(SELECT full_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                                ]
                            ],
                            where: {
                                [Op.and]: [
                                    whereClauseEvaluationStatus,
                                    additionalFilter,
                                    db.literal('`evaluator_ratings`.`evaluator_id` =' + JSON.stringify(evaluator_id)),
                                ]
                            },
                            include: [{
                                model: evaluator_rating,
                                required: false,
                                where: { evaluator_id },
                                attributes: [
                                    'evaluator_rating_id',
                                    'evaluator_id',
                                    'challenge_response_id',
                                    'status',
                                    'level',
                                    'param_1',
                                    'param_2',
                                    'param_3',
                                    'param_4',
                                    'param_5',
                                    'comments',
                                    'overall',
                                    'submitted_at',
                                    "created_at"
                                ]
                            }],
                        });
                    }
                }
            }
            if (!data) {
                throw badRequest(data.message)
            };
            if (data instanceof Error) {
                throw data;
            }
            data.forEach((element: any) => { element.dataValues.response = JSON.parse(element.dataValues.response) })
            return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error) {
            next(error)
        }
    };
    private async getChallengesBasedOnFilter(req: Request, res: Response, next: NextFunction) {
        try {
            const { district, sdg } = req.query
            let whereClause: any = {}
            if (district) {
                whereClause['district'] = district && typeof district == 'string' ? district : {}
            }
            if (sdg) {
                whereClause['sdg'] = sdg && typeof sdg == 'string' ? sdg : {}
            }
            // whereClauseOfSdg['sdg'] = { [Op.like]: sdg && typeof district == 'string' ? sdg : `%%` }
            console.log(whereClause);
            const data = await this.crudService.findAll(challenge_response, {
                attributes: [
                    "challenge_response_id",
                    "challenge_id",
                    "sdg",
                    "team_id",
                    "response",
                    "initiated_by",
                    "created_at",
                    "submitted_at",
                    "evaluated_by",
                    "evaluated_at",
                    "evaluation_status",
                    "status",
                    "rejected_reason",
                    "final_result", "district",
                    [
                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                    ],
                    [
                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                    ],
                    [
                        db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`challenge_response\`.\`team_id\` )`), 'team_name'
                    ],
                    [
                        db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_members'
                    ],
                    [
                        db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id =  \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                    ],
                    [
                        db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                    ],
                    [
                        db.literal(`(SELECT full_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                    ]
                ],
                where: {
                    [Op.and]: [
                        whereClause
                    ]
                }
            });
            if (!data) {
                throw badRequest(data.message)
            };
            if (data instanceof Error) {
                throw data;
            }
            data.forEach((element: any) => { element.dataValues.response = JSON.parse(element.dataValues.response) })
            return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error) {
            next(error)
        }
    };
    private async finalEvaluation(req: Request, res: Response, next: NextFunction) {
        try {
            let user_id = res.locals.user_id;
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
            }
            let key: any = req.query.key;
            let data: any;
            const paramStatus: any = req.query.status;
            const district: any = req.query.district;
            const sdg: any = req.query.sdg;
            const level: any = req.query.level;
            const { page, size } = req.query;
            const { limit, offset } = this.getPagination(page, size);
            const where: any = {};
            let whereClauseStatusPart: any = {}
            let additionalFilter: any = {};
            let districtFilter: any = {};
            let boolStatusWhereClauseEvaluationStatusRequired = false;
            //status filter
            if (paramStatus && (paramStatus in constents.challenges_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus };
                boolStatusWhereClauseEvaluationStatusRequired = true;
            } else if (paramStatus === 'ALL') {
                whereClauseStatusPart = {};
                boolStatusWhereClauseEvaluationStatusRequired = false;
            } else {
                whereClauseStatusPart = { "evaluation_status": "SELECTEDROUND1" };
                boolStatusWhereClauseEvaluationStatusRequired = true;
            };
            if (key) {
                whereClauseStatusPart["final_result"] = key
            } else {
                whereClauseStatusPart["final_result"] = '0'
            }
            if (sdg) {
                whereClauseStatusPart["sdg"] = sdg && typeof sdg == 'string' ? sdg : {}
            }
            if (district) {
                whereClauseStatusPart["district"] = district && typeof district == 'string' ? district : {}
            };
            if (level) {
                where["levelWhere"] = level && typeof level == 'string' ? { level } : {}
                where["liter"] = level ? db.literal('`challenge_response->evaluator_ratings`.`level` = ' + JSON.stringify(level)) : {}
            }
            data = await this.crudService.findAll(challenge_response, {
                attributes: [
                    "challenge_response_id",
                    "challenge_id",
                    "sdg",
                    "team_id",
                    "response",
                    "initiated_by",
                    "created_at",
                    "submitted_at",
                    "evaluated_by",
                    "evaluated_at",
                    "evaluation_status",
                    "status",
                    "rejected_reason",
                    "final_result", "district",
                    [
                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                    ],
                    [
                        db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                    ],
                    [
                        db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`challenge_response\`.\`team_id\` )`), 'team_name'
                    ],
                    [
                        db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`challenge_response\`.\`team_id\` )`), 'team_members'
                    ],
                    [
                        db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id =  \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                    ],
                    [
                        db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                    ],
                    [
                        db.literal(`(SELECT full_name FROM challenge_responses AS challenge_responses LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_responses.team_id = \`challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                    ]
                ],
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        where.liter,
                    ]
                },
                include: [{
                    model: evaluator_rating,
                    where: where,
                    required: false,
                    attributes: [
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_1) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_1'
                        ],
                        [
                            db.literal(`(SELECT ROUND(AVG(CAST(param_1 AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_1_avg'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_2'
                        ],
                        [
                            db.literal(`(SELECT ROUND(AVG(CAST(param_2 AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_2_avg'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_3) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_3'
                        ],
                        [
                            db.literal(`(SELECT ROUND(AVG(CAST(param_3 AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_3_avg'
                        ],

                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_4) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_4'
                        ],
                        [
                            db.literal(`(SELECT ROUND(AVG(CAST(param_4 AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_4_avg'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_5) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_5'
                        ],
                        [
                            db.literal(`(SELECT ROUND(AVG(CAST(param_5 AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'param_5_avg'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(comments) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'comments'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(overall) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'overall'
                        ],
                        [
                            db.literal(`(SELECT ROUND(AVG(CAST(overall AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'overall_avg'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(created_at) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'created_at'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(evaluator_id) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`challenge_response\`.\`challenge_response_id\`)`), 'evaluator_id'
                        ],
                        // [
                        //     db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = evaluator_ratings.created_by)`), 'rated_evaluated_name'
                        // ]
                    ]
                }], limit, offset, subQuery: false
            });
            if (!data) {
                throw badRequest(data.message)
            };
            if (data instanceof Error) {
                throw data;
            }
            data.forEach((element: any) => { element.dataValues.response = JSON.parse(element.dataValues.response) })
            return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error: any) {
            return res.status(500).send(dispatcher(res, error, 'error'))
        }
    };
    private async evaluationResult(req: Request, res: Response, next: NextFunction) {
        try {
            let user_id = res.locals.user_id;
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
            }
            let data: any;
            let response: any;
            const paramStatus: any = req.query.status;
            const district: any = req.query.district;
            const sdg: any = req.query.sdg;
            const level: any = req.query.level;
            const { page, size } = req.query;
            const { limit, offset } = this.getPagination(page, size);
            const where: any = {};
            let whereClauseStatusPart: any = {}
            let additionalFilter: any = {};
            let districtFilter: any = {};
            let boolStatusWhereClauseEvaluationStatusRequired = false;
            //status filter
            if (paramStatus && (paramStatus in constents.challenges_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus };
                boolStatusWhereClauseEvaluationStatusRequired = true;
            } else if (paramStatus === 'ALL') {
                whereClauseStatusPart = {};
                boolStatusWhereClauseEvaluationStatusRequired = false;
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                boolStatusWhereClauseEvaluationStatusRequired = true;
            };
            if (sdg) {
                additionalFilter['sdg'] = sdg && typeof sdg == 'string' ? sdg : {}
                additionalFilter["sdgLiteral"] = sdg ? db.literal('evaluator_ratings->challenge_response`.`sdg` = ' + JSON.stringify(sdg)) : {};
            }
            if (district) {
                additionalFilter["district"] = district && typeof district == 'string' ? district : {}
                additionalFilter["districtLiteral"] = district ? db.literal('`evaluator_ratings->challenge_response.`district` = ' + JSON.stringify(district)) : {};
            };
            if (level) {
                where["level"] = level && typeof level == 'string' ? level : {}
                where["literal"] = level ? db.literal('`evaluator_ratings`.`level` = ' + JSON.stringify(level)) : {}
            }
            data = await this.crudService.findAll(evaluation_results, {
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        additionalFilter,
                        additionalFilter.sdgLiteral,
                        additionalFilter.districtLiteral,
                        where.liter,
                    ]
                },
                include: [{
                    model: evaluator_rating,
                    where: where,
                    required: false,
                    attributes: [
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_1) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'param_1'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'param_2'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_3) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'param_3'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_4) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'param_4'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(param_5) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'param_5'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(comments) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'comments'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(overall) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'overall'
                        ],
                        [
                            db.literal(`(SELECT ROUND(AVG(CAST(overall AS FLOAT)), 2) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'overall_avg'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(created_at) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'created_at'
                        ],
                        [
                            db.literal(`(SELECT  JSON_ARRAYAGG(evaluator_id) FROM unisolve_db.evaluator_ratings as rating WHERE rating.challenge_response_id = \`evaluator_ratings->challenge_response\`.\`challenge_response_id\`)`), 'evaluator_id'
                        ],
                        // [
                        //     db.literal(`(SELECT full_name FROM users As s WHERE s.user_id = evaluator_ratings.created_by)`), 'rated_evaluated_name'
                        // ]
                    ],
                    include: {
                        model: challenge_response,
                        where: additionalFilter,
                        attributes: [
                            "challenge_response_id",
                            "challenge_id",
                            "sdg",
                            "team_id",
                            "response",
                            "initiated_by",
                            "created_at",
                            "submitted_at",
                            "evaluated_by",
                            "evaluated_at",
                            "evaluation_status",
                            "status",
                            "rejected_reason",
                            "final_result",
                            "district",
                            [
                                db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`evaluator_ratings->challenge_response\`.\`evaluated_by\` )`), 'evaluated_name'
                            ],
                            [
                                db.literal(`(SELECT full_name FROM users As s WHERE s.user_id =  \`evaluator_ratings->challenge_response\`.\`initiated_by\` )`), 'initiated_name'
                            ],
                            [
                                db.literal(`(SELECT team_name FROM teams As t WHERE t.team_id =  \`evaluator_ratings->challenge_response\`.\`team_id\` )`), 'team_name'
                            ],
                            [
                                db.literal(`(SELECT JSON_ARRAYAGG(full_name) FROM unisolve_db.students  AS s LEFT OUTER JOIN unisolve_db.teams AS t ON s.team_id = t.team_id WHERE t.team_id = \`evaluator_ratings->challenge_response\`.\`team_id\` )`), 'team_members'
                            ],
                            [
                                db.literal(`(SELECT mentorTeamOrg.organization_name FROM challenge_responses AS challenge_response    LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_response.team_id = \`evaluator_ratings->challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_name'
                            ],
                            [
                                db.literal(`(SELECT mentorTeamOrg.organization_code FROM challenge_responses AS challenge_response    LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id LEFT OUTER JOIN    mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE challenge_response.team_id = \`evaluator_ratings->challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'organization_code'
                            ],
                            [
                                db.literal(`(SELECT full_name FROM challenge_responses AS challenge_response    LEFT OUTER JOIN teams AS team ON challenge_response.team_id = team.team_id    LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id WHERE challenge_response.team_id = \`evaluator_ratings->challenge_response\`.\`team_id\` GROUP BY challenge_response.team_id)`), 'mentor_name'
                            ]
                        ]
                    }
                }],
                group: [`evaluation_results.challenge_response_id`],
                limit, offset, subQuery: false
            });
            if (!data) {
                throw badRequest(data.message)
            };
            if (data instanceof Error) {
                throw data;
            }
            for (let i = 0; i < data.length; i++) {
                let evaluator_ratings = data[i].dataValues.evaluator_ratings;
                for (let j = 0; j < evaluator_ratings.length; j++) {
                    let response = JSON.parse(evaluator_ratings[j].challenge_response.dataValues.response);
                    evaluator_ratings[j].challenge_response.dataValues.response = response;
                }
            }
            return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error: any) {
            return res.status(500).send(dispatcher(res, error, 'error'))
        }
    }
    private async districtWiseRating(req: Request, res: Response, next: NextFunction) {
        return 'nothing'
    }
} 