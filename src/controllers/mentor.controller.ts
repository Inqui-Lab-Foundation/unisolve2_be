import bcrypt from 'bcrypt';
import axios from 'axios';
import fs from 'fs';
import * as csv from "fast-csv";
import { Op, QueryTypes } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import { customAlphabet } from 'nanoid';
import { speeches } from '../configs/speeches.config';
import { baseConfig } from '../configs/base.config';
import { user } from '../models/user.model';
import db from "../utils/dbconnection.util"
import { mentorSchema, mentorUpdateSchema } from '../validations/mentor.validationa';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import { badRequest, forbidden, internal, notFound } from 'boom';
import { mentor } from '../models/mentor.model';
import { where } from 'sequelize/types';
import { mentor_topic_progress } from '../models/mentor_topic_progress.model';
import { quiz_survey_response } from '../models/quiz_survey_response.model';
import { quiz_response } from '../models/quiz_response.model';
import { team } from '../models/team.model';
import { student } from '../models/student.model';
import { constents } from '../configs/constents.config';
import { organization } from '../models/organization.model';

export default class MentorController extends BaseController {
    model = "mentor";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;
    private nanoid = customAlphabet('0123456789', 6);
    protected initializePath(): void {
        this.path = '/mentors';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(mentorSchema, mentorUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.post(`${this.path}/register`, this.register.bind(this));
        this.router.post(`${this.path}/validateOtp`, this.validateOtp.bind(this));
        this.router.post(`${this.path}/login`, this.login.bind(this));
        this.router.get(`${this.path}/logout`, this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, this.changePassword.bind(this));
        this.router.put(`${this.path}/updatePassword`, this.updatePassword.bind(this));
        this.router.put(`${this.path}/verifyUser`, this.verifyUser.bind(this));
        this.router.put(`${this.path}/updateMobile`, this.updateMobile.bind(this));
        this.router.delete(`${this.path}/:mentor_user_id/deleteAllData`, this.deleteAllData.bind(this));
        this.router.put(`${this.path}/resetPassword`, this.resetPassword.bind(this));
        this.router.put(`${this.path}/manualResetPassword`, this.manualResetPassword.bind(this));
        this.router.get(`${this.path}/regStatus`, this.getMentorRegStatus.bind(this));
        this.router.post(`${this.path}/bulkUpload`, this.bulkUpload.bind(this))

        super.initializeRoutes();
    }
    protected async autoFillUserDataForBulkUpload(req: Request, res: Response, modelLoaded: any, reqData: any = null) {
        let payload = reqData;
        if (modelLoaded.rawAttributes.user_id !== undefined) {
            const userData = await this.crudService.create(user, { username: reqData.username, ...reqData });
            payload['user_id'] = userData.dataValues.user_id;
        }
        if (modelLoaded.rawAttributes.created_by !== undefined) {
            payload['created_by'] = res.locals.user_id;
        }
        if (modelLoaded.rawAttributes.updated_by !== undefined) {
            payload['updated_by'] = res.locals.user_id;
        }
        return payload;
    }
    protected async getMentorRegStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { quiz_survey_id } = req.params
            const { page, size, status } = req.query;
            let condition = {}
            // condition = status ? { status: { [Op.like]: `%${status}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);

            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
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
            const mentorsResult = await organization.findAll({
                attributes: [
                    "organization_code",
                    "organization_name",
                    "city",
                    "district",
                    "state",
                    "country"
                ],
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        condition
                    ]
                },
                include: [
                    {
                        model: mentor, attributes: [
                            "mobile",
                            "full_name",
                            "mentor_id",
                            "created_by",
                            "created_at",
                            "updated_at",
                            "updated_by"
                        ],
                        include: [
                            {
                                model: user, attributes: [
                                    "username",
                                    "user_id"
                                ]
                            }
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

    //TODO: Override the getDate function for mentor and join org details and user details
    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id } = req.params;
            const paramStatus: any = req.query.status;
            if (model) {
                this.model = model;
            };
            // const current_user = res.locals.user_id; 
            // pagination
            const { page, size, status } = req.query;
            // let condition = status ? { status: { [Op.like]: `%${status}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart: any = {};
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
            };
            // const getUserIdFromMentorId = await mentor.findOne({
            //     attributes: ["user_id", "created_by"], where: { mentor_id: req.body.mentor_id }
            // });
            // console.log(getUserIdFromMentorId);
            // if (!getUserIdFromMentorId) throw badRequest(speeches.MENTOR_NOT_EXISTS);
            // if (getUserIdFromMentorId instanceof Error) throw getUserIdFromMentorId;
            // if (current_user !== getUserIdFromMentorId.getDataValue("user_id")) {
            //     throw forbidden();
            // };
            let district: any = req.query.district;
            let whereClauseOfDistrict: any = district && district !== 'All Districts' ?
                { district: { [Op.like]: req.query.district } } :
                { district: { [Op.like]: `%%` } }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    attributes: {
                        include: [
                            [
                                db.literal(`( SELECT username FROM users AS u WHERE u.user_id = \`mentor\`.\`user_id\`)`), 'username_email'
                            ]
                        ]
                    },
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            where,
                        ]
                    },
                    include: {
                        model: organization,
                        attributes: [
                            "organization_code",
                            "organization_name",
                            "organization_id",
                            "principal_name",
                            "principal_mobile",
                            "principal_email",
                            "city",
                            "district",
                            "state",
                            "country"
                        ]
                    },
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        attributes: {
                            attributes: [
                                "mentor_id",
                                "user_id",
                                "full_name",
                                "otp",
                                "mobile",
                            ],
                            include: [
                                [
                                    db.literal(`( SELECT username FROM users AS u WHERE u.user_id = \`mentor\`.\`user_id\`)`), 'username'
                                ]
                            ],
                        },
                        where: {
                            [Op.and]: [
                                whereClauseStatusPart,
                                // condition
                            ]
                        },
                        include: {
                            model: organization,
                            attributes: [
                                "organization_code",
                                "organization_name",
                                "organization_id",
                                "district"
                            ], where: whereClauseOfDistrict,
                            require: false
                        }, limit, offset
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
    }
    protected async updateData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const user_id = res.locals.user_id
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded)
            const findMentorDetail = await this.crudService.findOne(modelLoaded, { where: where });
            if (!findMentorDetail || findMentorDetail instanceof Error) {
                throw notFound();
            } else {
                const mentorData = await this.crudService.update(modelLoaded, payload, { where: where });
                const userData = await this.crudService.update(user, payload, { where: { user_id: findMentorDetail.dataValues.user_id } });
                if (!mentorData || !userData) {
                    throw badRequest()
                }
                if (mentorData instanceof Error) {
                    throw mentorData;
                }
                if (userData instanceof Error) {
                    throw userData;
                }
                const data = { userData, mentor };
                return res.status(200).send(dispatcher(res, data, 'updated'));
            }
        } catch (error) {
            next(error);
        }
    }
    // TODO: update the register flow by adding a flag called reg_statue in mentor tables
    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.body.organization_code || req.body.organization_code === "") return res.status(406).send(dispatcher(res, speeches.ORG_CODE_REQUIRED, 'error', speeches.NOT_ACCEPTABLE, 406));
        const org = await this.authService.checkOrgDetails(req.body.organization_code);
        if (!org) {
            return res.status(406).send(dispatcher(res, org, 'error', speeches.ORG_CODE_NOT_EXISTS, 406));
        }
        if (!req.body.role || req.body.role !== 'MENTOR') {
            return res.status(406).send(dispatcher(res, null, 'error', speeches.USER_ROLE_REQUIRED, 406));
        }
        req.body['reg_status'] = '3';
        if (!req.body.password || req.body.password == null) req.body.password = '';
        const result: any = await this.authService.mentorRegister(req.body);
        if (result && result.output && result.output.payload && result.output.payload.message == 'Email') {
            return res.status(406).send(dispatcher(res, result.data, 'error', speeches.MENTOR_EXISTS, 406));
        }
        if (result && result.output && result.output.payload && result.output.payload.message == 'Mobile') {
            return res.status(406).send(dispatcher(res, result.data, 'error', speeches.MOBILE_EXISTS, 406));
        }
        // // const otp = await this.authService.generateOtp();
        // let otp = await this.authService.triggerOtpMsg(req.body.mobile); //async function but no need to await ...since we yet do not care about the outcome of the sms trigger ....!!this may need to change later on ...!!
        // otp = String(otp)
        // let hashString = await this.authService.generateCryptEncryption(otp);
        // const updatePassword = await this.authService.crudService.update(user,
        //     { password: await bcrypt.hashSync(hashString, process.env.SALT || baseConfig.SALT) },
        //     { where: { user_id: result.dataValues.user_id } });
        // const findMentorDetailsAndUpdateOTP: any = await this.crudService.updateAndFind(mentor,
        //     { otp: otp },
        //     { where: { user_id: result.dataValues.user_id } }
        // );
        const data = result.dataValues;
        return res.status(201).send(dispatcher(res, data, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
    }

    // TODO: Update flag reg_status on success validate the OTP
    private async validateOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const user_res = await this.authService.validatedOTP(req.body);
        if (!user_res) {
            res.status(404).send(dispatcher(res, null, 'error', speeches.OTP_FAIL))
        } else {
            res.status(200).send(dispatcher(res, user_res, 'success', speeches.OTP_FOUND))
        }
    }

    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        req.body['role'] = 'MENTOR'
        try {
            const result = await this.authService.login(req.body);
            if (!result) {
                return res.status(404).send(dispatcher(res, result, 'error', speeches.USER_NOT_FOUND));
            }
            // else if (result.error) {
            //     return res.status(401).send(dispatcher(res, result.error, 'error', speeches.USER_RISTRICTED, 401));
            // }
            else {
                // mentorDetails = await this.authService.getServiceDetails('mentor', { user_id: result.data.user_id });
                // result.data['mentor_id'] = mentorDetails.dataValues.mentor_id
                const mentorData = await this.authService.crudService.findOne(mentor, {
                    where: { user_id: result.data.user_id },
                    include: {
                        model: organization
                    }
                });
                if (!mentorData || mentorData instanceof Error) {
                    return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_REG_STATUS));
                }
                if (mentorData.dataValues.reg_status !== '3') {
                    return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_REG_STATUS));
                }
                result.data['mentor_id'] = mentorData.dataValues.mentor_id;
                result.data['organization_name'] = mentorData.dataValues.organization.organization_name;
                return res.status(200).send(dispatcher(res, result.data, 'success', speeches.USER_LOGIN_SUCCESS));
            }
        } catch (error) {
            return res.status(401).send(dispatcher(res, error, 'error', speeches.USER_RISTRICTED, 401));
        }
    }

    private async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.logout(req.body, res);
        if (result.error) {
            next(result.error);
        } else {
            return res.status(200).send(dispatcher(res, speeches.LOGOUT_SUCCESS, 'success'));
        }
    }

    private async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.changePassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
        }
        else if (result.match) {
            return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }

    //TODO: Update flag reg_status on successful changed password
    private async updatePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.updatePassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
        }
        else if (result.match) {
            return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }

    private async verifyUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const mobile = req.body.mobile;
            if (!mobile) {
                throw badRequest(speeches.MOBILE_NUMBER_REQUIRED);
            }
            const result = await this.authService.verifyUser(req.body, res);
            if (!result) {
                return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
            } else if (result.error) {
                return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
            } else {
                return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
            }
        } catch (err) {
            next(err);
        }
    }
    //TODO: ADD API to update the mobile number and trigger OTP,
    private async updateMobile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { mobile } = req.body;
            if (!mobile) {
                throw badRequest(speeches.MOBILE_NUMBER_REQUIRED);
            }
            const result = await this.authService.mobileUpdate(req.body);
            if (!result) {
                return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
            } else if (result.error) {
                return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
            } else {
                return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_MOBILE_CHANGE, 202));
            }
        } catch (error) {
            next(error)
        }
    }
    //TODO: test this api and debug and fix any issues in testing if u see any ...!!
    private async deleteAllData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { mentor_user_id } = req.params;
            // const { mobile } = req.body;
            if (!mentor_user_id) {
                throw badRequest(speeches.USER_USERID_REQUIRED);
            }

            //get mentor details
            const mentorResult: any = await this.crudService.findOne(mentor, { where: { user_id: mentor_user_id } })
            if (!mentorResult) {
                throw internal(speeches.DATA_CORRUPTED)
            }
            if (mentorResult instanceof Error) {
                throw mentorResult
            }
            const mentor_id = mentorResult.dataValues.mentor_id
            if (!mentor_id) {
                throw internal(speeches.DATA_CORRUPTED + ":" + speeches.MENTOR_NOT_EXISTS)
            }
            const deleteMentorResponseResult = await this.authService.bulkDeleteMentorResponse(mentor_user_id)
            if (!deleteMentorResponseResult) {
                throw internal("error while deleting mentor response")
            }
            if (deleteMentorResponseResult instanceof Error) {
                throw deleteMentorResponseResult
            }

            //get team details
            const teamResult: any = await team.findAll({
                attributes: ["team_id"],
                where: { mentor_id: mentor_id },
                raw: true
            })
            if (!teamResult) {
                throw internal(speeches.DATA_CORRUPTED)
            }
            if (teamResult instanceof Error) {
                throw teamResult
            }

            const arrayOfteams = teamResult.map((teamSingleresult: any) => {
                return teamSingleresult.team_id;
            })
            if (arrayOfteams && arrayOfteams.length > 0) {
                const studentUserIds = await student.findAll({
                    where: { team_id: arrayOfteams },
                    raw: true,
                    attributes: ["user_id"]
                })

                if (studentUserIds && !(studentUserIds instanceof Error)) {
                    const arrayOfStudentuserIds = studentUserIds.map((student) => student.user_id)

                    for (var i = 0; i < arrayOfStudentuserIds.length; i++) {
                        const deletStudentResponseData = await this.authService.bulkDeleteUserResponse(arrayOfStudentuserIds[i])
                        if (deletStudentResponseData instanceof Error) {
                            throw deletStudentResponseData;
                        }
                    };
                    const resultBulkDeleteStudents = await this.authService.bulkDeleteUserWithStudentDetails(arrayOfStudentuserIds)
                    // console.log("resultBulkDeleteStudents",resultBulkDeleteStudents)
                    // if(!resultBulkDeleteStudents){
                    //     throw internal("error while deleteing students")
                    // }
                    if (resultBulkDeleteStudents instanceof Error) {
                        throw resultBulkDeleteStudents
                    }
                }

                const resultTeamDelete = await this.crudService.delete(team, { where: { team_id: arrayOfteams } })
                // if(!resultTeamDelete){
                //     throw internal("error while deleting team")
                // }
                if (resultTeamDelete instanceof Error) {
                    throw resultTeamDelete
                }
            }
            let resultmentorDelete: any = {};
            resultmentorDelete = await this.authService.bulkDeleteUserWithMentorDetails([mentor_user_id])
            // if(!resultmentorDelete){
            //     throw internal("error while deleting mentor")
            //}
            if (resultmentorDelete instanceof Error) {
                throw resultmentorDelete
            }

            // if (!resultmentorDelete) {
            //     return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
            // } else 
            if (resultmentorDelete.error) {
                return res.status(404).send(dispatcher(res, resultmentorDelete.error, 'error', resultmentorDelete.error));
            } else {
                return res.status(202).send(dispatcher(res, resultmentorDelete.dataValues, 'success', speeches.USER_DELETED, 202));
            }
        } catch (error) {
            next(error)
        }
    }
    private async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { email, organization_code, otp } = req.body;
            let otpCheck = typeof otp == 'boolean' && otp == false ? otp : true;
            if (otpCheck) {
                if (!email) {
                    throw badRequest(speeches.USER_EMAIL_REQUIRED);
                }
            } else {
                if (!organization_code) {
                    throw badRequest(speeches.ORG_CODE_REQUIRED);
                }
            }
            const result = await this.authService.mentorResetPassword(req.body);
            if (!result) {
                return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
            } else if (result.error) {
                return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
            } else {
                return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_MOBILE_CHANGE, 202));
            }
        } catch (error) {
            next(error)
        }
    }
    private async manualResetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // accept the user_id or user_name from the req.body and update the password in the user table
        // perviously while student registration changes we have changed the password is changed to random generated UUID and stored and send in the payload,
        // now reset password use case is to change the password using user_id to some random generated ID and update the UUID also
        const randomGeneratedSixDigitID: any = this.nanoid();
        const cryptoEncryptedString = await this.authService.generateCryptEncryption(randomGeneratedSixDigitID);
        try {
            const { user_id } = req.body;
            req.body['otp'] = randomGeneratedSixDigitID;
            req.body['encryptedString'] = cryptoEncryptedString;
            if (!user_id) throw badRequest(speeches.USER_USERID_REQUIRED);
            const result = await this.authService.manualMentorResetPassword(req.body);
            if (!result) return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
            else if (result.error) return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
            else return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        } catch (error) {
            next(error)
        }
        // const generatedUUID = this.nanoid();
        // req.body['generatedPassword'] = generatedUUID;
        // const result = await this.authService.restPassword(req.body, res);
        // if (!result) {
        //     return res.status(404).send(dispatcher(res, result.user_res, 'error', speeches.USER_NOT_FOUND));
        // } else if (result.match) {
        //     return res.status(404).send(dispatcher(res, result.match, 'error', speeches.USER_PASSWORD));
        // } else {
        //     return res.status(202).send(dispatcher(res, result, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        // }
    };
    protected async bulkUpload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        //@ts-ignore
        let file = req.files.file;
        let Errors: any = [];
        let bulkData: any = [];
        let requestData: any = [];
        let counter: number = 0;
        let existedEntities: number = 0;
        let dataLength: number;
        let payload: any;
        let loadMode: any = await this.loadModel(this.model);
        let role = 'MENTOR'
        if (file === undefined) return res.status(400).send(dispatcher(res, null, 'error', speeches.FILE_REQUIRED, 400));
        if (file.type !== 'text/csv') return res.status(400).send(dispatcher(res, null, 'error', speeches.FILE_REQUIRED, 400));
        //parsing the data
        const stream = fs.createReadStream(file.path).pipe(csv.parse({ headers: true }));
        //error event
        stream.on('error', (error) => res.status(400).send(dispatcher(res, error, 'error', speeches.CSV_SEND_ERROR, 400)));
        //data event;
        stream.on('data', async (data: any) => {
            dataLength = Object.entries(data).length;
            for (let i = 0; i < dataLength; i++) {
                // if (Object.entries(data)[i][0] === 'email')
                // Object.entries(data)[i][0].replace('email', 'username')
                // console.log(Object.entries(data)[i][0])
                if (Object.entries(data)[i][1] === '') {
                    Errors.push(badRequest('missing fields', data));
                    return;
                }
                requestData = data
                //@ts-ignore
                if (Object.entries(data)[i][0] === 'email') {
                    requestData['username'] = Object.entries(data)[i][1];
                }
            }
            bulkData.push(requestData);
        })
        //parsing completed
        stream.on('end', async () => {
            if (Errors.length > 0) next(badRequest(Errors.message));
            for (let data = 0; data < bulkData.length; data++) {
                const match = await this.crudService.findOne(user, { where: { username: bulkData[data]['username'] } });
                if (match) {
                    existedEntities++;
                } else {
                    counter++;
                    const cryptoEncryptedPassword = await this.authService.generateCryptEncryption(bulkData[data]['mobile']);
                    payload = await this.autoFillUserDataForBulkUpload(req, res, loadMode, {
                        ...bulkData[data], role,
                        password: cryptoEncryptedPassword,
                        qualification: cryptoEncryptedPassword,
                        reg_status: '3'
                    });
                    bulkData[data] = payload;
                };
            }
            // console.log(bulkData)
            if (counter > 0) {
                await this.crudService.bulkCreate(loadMode, bulkData)
                    .then((result) => {
                        // let mentorData = {...bulkData, user_id: result.user_id}
                        // await this.crudService.bulkCreate(user, bulkData)
                        return res.send(dispatcher(res, { data: result, createdEntities: counter, existedEntities }, 'success', speeches.CREATED_FILE, 200));
                    }).catch((error: any) => {
                        return res.status(500).send(dispatcher(res, error, 'error', speeches.CSV_SEND_INTERNAL_ERROR, 500));
                    })
            } else if (existedEntities > 0) {
                return res.status(400).send(dispatcher(res, { createdEntities: counter, existedEntities }, 'error', speeches.CSV_DATA_EXIST, 400));
            }
        });
    }
};

