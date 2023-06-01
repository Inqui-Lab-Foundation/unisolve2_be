import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import * as csv from "fast-csv";
import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import { evaluatorSchema, evaluatorUpdateSchema } from '../validations/evaluator.validationa';
import { evaluator } from '../models/evaluator.model';
import { user } from '../models/user.model';
import { badRequest, notFound } from 'boom';
import db from "../utils/dbconnection.util"
import { evaluation_process } from '../models/evaluation_process.model';

export default class EvaluatorController extends BaseController {
    model = "evaluator";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;

    protected initializePath(): void {
        this.path = '/evaluators';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(evaluatorSchema, evaluatorUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.post(`${this.path}/register`, this.register.bind(this));
        this.router.post(`${this.path}/login`, this.login.bind(this));
        this.router.get(`${this.path}/logout`, this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, this.changePassword.bind(this));
        this.router.post(`${this.path}/bulkUpload`, this.bulkUpload.bind(this))
        // this.router.put(`${this.path}/updatePassword`, this.updatePassword.bind(this));
        super.initializeRoutes();
    };

    protected getData(req: Request, res: Response, next: NextFunction) {
        return super.getData(req, res, next, [],
            [
                "evaluator_id", "district", "mobile", "status",
            ], {
            attributes: [
                "user_id",
                "username",
                "full_name"
            ], model: user, required: false
        }
        );
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
            const findEvaluatorDetail = await this.crudService.findOne(modelLoaded, { where: where });
            if (!findEvaluatorDetail || findEvaluatorDetail instanceof Error) {
                throw notFound();
            } else {
                const evaluatorData = await this.crudService.update(modelLoaded, payload, { where: where });
                const userData = await this.crudService.update(user, payload, { where: { user_id: findEvaluatorDetail.dataValues.user_id } });
                if (!evaluatorData || !userData) {
                    throw badRequest()
                }
                if (evaluatorData instanceof Error) {
                    throw evaluatorData;
                }
                if (userData instanceof Error) {
                    throw userData;
                }
                const data = { userData, evaluator };
                return res.status(200).send(dispatcher(res, data, 'updated'));
            }
        } catch (error) {
            next(error);
        }
    }

    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.body.username || req.body.username === "") req.body.username = req.body.full_name.replace(/\s/g, '');
        if (!req.body.password || req.body.password === "") req.body.password = this.password;
        if (!req.body.role || req.body.role !== 'EVALUATOR') {
            return res.status(406).send(dispatcher(res, null, 'error', speeches.USER_ROLE_REQUIRED, 406));
        };
        const payload = this.autoFillTrackingColumns(req, res, evaluator);
        const result = await this.authService.register(payload);
        if (result.user_res) return res.status(406).send(dispatcher(res, result.user_res.dataValues, 'error', speeches.EVALUATOR_EXISTS, 406));
        return res.status(201).send(dispatcher(res, result.profile.dataValues, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
    }

    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        req.body['role'] = 'EVALUATOR'
        const result = await this.authService.login(req.body);
        if (!result) {
            return res.status(404).send(dispatcher(res, result, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(401).send(dispatcher(res, result.error, 'error', speeches.USER_RISTRICTED, 401));
        } else {
            let getEvaluatorProcessLevel = await this.crudService.findOne(evaluation_process, { where: { status: "ACTIVE" } });
            result.data["level_name"] = getEvaluatorProcessLevel.dataValues.level_name
            result.data['eval_schema'] = getEvaluatorProcessLevel.dataValues.eval_schema;
            return res.status(200).send(dispatcher(res, result.data, 'success', speeches.USER_LOGIN_SUCCESS));
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
        let role = 'EVALUATOR'
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
                    // const cryptoEncryptedPassword = await this.authService.generateCryptEncryption(bulkData[data]['mobile']);
                    payload = await this.autoFillUserDataForBulkUpload(req, res, loadMode, {
                        ...bulkData[data], role,
                        password: this.password
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