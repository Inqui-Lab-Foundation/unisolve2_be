import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { teamSchema, teamUpdateSchema } from "../validations/team.validationa";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import authService from '../services/auth.service';
import db from "../utils/dbconnection.util"
import dispatcher from "../utils/dispatch.util";
import { badRequest, forbidden, notFound } from "boom";
import { speeches } from "../configs/speeches.config";
import { team } from "../models/team.model";
import { student } from "../models/student.model";
import { user } from "../models/user.model";
import { mentor } from "../models/mentor.model";
import { challenge_response } from "../models/challenge_response.model";

export default class TeamController extends BaseController {

    model = "team";
    authService: authService = new authService;
    protected initializePath(): void {
        this.path = '/teams';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(teamSchema, teamUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(`${this.path}/:id/members`, this.getTeamMembers.bind(this));
        super.initializeRoutes();
    }
    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const current_user = res.locals.user_id; 
            if(!current_user){
                throw forbidden()
            }
            // pagination
            let mentor_id:any = null
            const { page, size,  } = req.query;
            mentor_id =  req.query.mentor_id
            // let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            let condition =  null;
            if(mentor_id){
                const getUserIdFromMentorId = await mentor.findOne({
                    attributes: ["user_id", "created_by"], 
                    where: {
                         mentor_id: mentor_id 
                        }
                });
                if (!getUserIdFromMentorId) throw badRequest(speeches.MENTOR_NOT_EXISTS);
                if (getUserIdFromMentorId instanceof Error) throw getUserIdFromMentorId;
                const providedMentorsUserId = getUserIdFromMentorId.getDataValue("user_id");
                condition =  { 
                    mentor_id:mentor_id,
                    created_by:providedMentorsUserId
                }
                // if (current_user !== getUserIdFromMentorId.getDataValue("user_id")) {
                //     throw forbidden();
                // };
            }
            
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }
            //attributes separating for challenge submission;
            let attributesNeeded: any = [];
            const ideaStatus = req.query.ideaStatus;
            if (ideaStatus && ideaStatus == 'true') {
                attributesNeeded = [
                    'team_name',
                    'team_id',
                    'mentor_id',
                    'status',
                    'created_at',
                    'created_by',
                    'updated_at',
                    'updated_by',
                    [
                        db.literal(`(
                            SELECT COUNT(*)
                            FROM students AS s
                            WHERE
                                ${addWhereClauseStatusPart ? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            AND
                                s.team_id = \`team\`.\`team_id\`
                        )`), 'student_count'
                    ],
                    [
                        db.literal(`(
                            SELECT status
                            FROM challenge_responses AS idea
                            WHERE idea.team_id = \`team\`.\`team_id\`
                        )`), 'ideaStatus'
                    ],
                    [
                        db.literal(`(
                            SELECT challenge_response_id
                            FROM challenge_responses AS idea
                            WHERE idea.team_id = \`team\`.\`team_id\`
                        )`), 'challenge_response_id'
                    ]
                ]
            } else {
                attributesNeeded = [
                    'team_name',
                    'team_id',
                    'mentor_id',
                    'status',
                    'created_at',
                    'created_by',
                    'updated_at',
                    'updated_by',
                    [
                        db.literal(`(
                            SELECT COUNT(*)
                            FROM students AS s
                            WHERE
                                ${addWhereClauseStatusPart ? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            AND
                                s.team_id = \`team\`.\`team_id\`
                        )`), 'student_count'
                    ]
                ]
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    attributes: [
                        'team_name',
                        'team_id',
                        'mentor_id',
                        'status',
                        'created_at',
                        'created_by',
                        'updated_at',
                        'updated_by',
                        [
                            db.literal(`(
                            SELECT COUNT(*)
                            FROM students AS s
                            WHERE
                                ${addWhereClauseStatusPart ? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            AND
                                s.team_id = \`team\`.\`team_id\`
                        )`), 'student_count'
                        ]
                    ],
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            where,
                        ]
                    }
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        attributes: attributesNeeded,
                        where: {
                            [Op.and]: [
                                whereClauseStatusPart,
                                condition
                            ]
                        }, limit, offset,
                        order: [["created_at", "DESC"]],
                    })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch (error: any) {
                    return res.status(500).send(dispatcher(res, data, 'error'))
                }

            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(res,data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
                res.status(200).send(dispatcher(res, null, "error", speeches.DATA_NOT_FOUND));
                // if(data!=null){
                //     throw 
                (data.message)
                // }else{
                //     throw notFound()
                // }
            }

            return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error) {
            next(error);
        }
    };
    protected async getTeamMembers(req: Request, res: Response, next: NextFunction) {
        // accept the team_id from the params and find the students details, user_id
        const team_id = req.params.id;
        if (!team_id || team_id === "") {
            return res.status(400).send(dispatcher(res, null, 'error', speeches.TEAM_NAME_ID));
        }
        const team_res = await this.crudService.findOne(team, { where: { team_id } });
        if (!team_res) {
            return res.status(400).send(dispatcher(res, null, 'error', speeches.TEAM_NOT_FOUND));
        }
        const where: any = { team_id };
        let whereClauseStatusPart: any = {};
        const paramStatus: any = req.query.status;
        if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
            whereClauseStatusPart = { "status": paramStatus }
        }
        const student_res = await this.crudService.findAll(student, {
            where: {
                //TODO: replace the UUID with password name, and attach the username in a single object
                // attributes: ['UUID', 'password'],
                [Op.and]: [
                    whereClauseStatusPart,
                    where
                ],
            }, include: [{
                required: false,
                model: user,
                attributes: ["username"]
            }]
        });
        // console.log(student_res[0].dataValues.UUID)
        // student_res.dataValues['password'] = "";
        return res.status(200).send(dispatcher(res, student_res, 'success'));
    };
    /**
     * 
     * Add check to see if team with same name and same mentor doesnt exits only then creeate a team 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    protected async createData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model } = req.params;
            if (model) {
                this.model = model;
            };
            const current_user = res.locals.user_id; 
            const modelLoaded = await this.loadModel(model);
            // console.log(req.body.team_name);
            // req.body.team_name = req.body.team_name.trim();
            // if (!req.body.team_name) {
            //     throw badRequest(speeches.TEAM_NAME_REQUIRED);
            // }
            const getUserIdFromMentorId = await mentor.findOne({
                attributes: ["user_id", "created_by"], where: { mentor_id: req.body.mentor_id }
            });
            // console.log(getUserIdFromMentorId);
            if (!getUserIdFromMentorId) throw badRequest(speeches.MENTOR_NOT_EXISTS);
            if (getUserIdFromMentorId instanceof Error) throw getUserIdFromMentorId;
            if (current_user !== getUserIdFromMentorId.getDataValue("user_id")) {
                throw forbidden();
            };
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded);
            // console.log(payload)
            const teamNameCheck: any = await team.findOne({
                where: {
                    mentor_id: payload.mentor_id,
                    team_name: payload.team_name
                }
            });
            if (teamNameCheck) {
                throw badRequest('code unique');
            }
            // console.log("payload: ", payload)
            // add check if teamNameCheck is not an error and has data then return and err
            const data = await this.crudService.create(modelLoaded, payload);
            if (!data) {
                return res.status(404).send(dispatcher(res, data, 'error'));
            }
            if (!data) {
                throw badRequest()
            }
            if (data instanceof Error) {
                throw data;
            }
            return res.status(201).send(dispatcher(res, data, 'created'));
            
        } catch (error) {
            next(error);
        }
    }
    protected async deleteData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let deletingTeamDetails: any;
            let deletingChallengeDetails: any;
            let deleteTeam: any = 1;
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const getTeamDetails = await this.crudService.findOne(await this.loadModel(model), {
                attributes: ["team_id", "mentor_id"],
                where
            });
            if (getTeamDetails instanceof Error) throw getTeamDetails;
            if (!getTeamDetails) throw notFound(speeches.TEAM_NOT_FOUND);
            // console.log(getTeamDetails);
            const getStudentDetails = await this.crudService.findAll(student, {
                attributes: ["student_id", "user_id"],
                where: { team_id: getTeamDetails.dataValues.team_id }
            });
            if (getStudentDetails instanceof Error) throw getTeamDetails;
            if (getStudentDetails) {
                for (let student of getStudentDetails) {
                    const deleteUserStudentAndRemoveAllResponses = await this.authService.deleteStudentAndStudentResponse(student.dataValues.user_id);
                    deleteTeam++;
                    // deletingTeamDetails = await this.crudService.delete(await this.loadModel(model), { where: where });
                }
            };
            if (deleteTeam >= 1) {
                deletingChallengeDetails = await this.crudService.delete(challenge_response, { where: { team_id: getTeamDetails.dataValues.team_id } });
                deletingTeamDetails = await this.crudService.delete(await this.loadModel(model), { where: where });
            }
            return res.status(200).send(dispatcher(res, deletingTeamDetails, 'deleted'));
            //         if (exist(team_id))
            //             if (check students)
            // 		bulk delete
            // Delete teams
            // 	else
            // 		Delete teams
            // else
            //    No action
            // if (!data) {
            //     throw badRequest()
            // }
            // if (data instanceof Error) {
            //     throw data
            // }
        } catch (error) {
            next(error);
        }
    }
}