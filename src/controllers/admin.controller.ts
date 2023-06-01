import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import { user } from '../models/user.model';
import { admin } from '../models/admin.model';
import { adminSchema, adminUpdateSchema } from '../validations/admins.validationa';
import { badRequest, notFound } from 'boom';

export default class AdminController extends BaseController {
    model = "admin";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;

    protected initializePath(): void {
        this.path = '/admins';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(adminSchema, adminUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.post(`${this.path}/register`, this.register.bind(this));
        this.router.post(`${this.path}/login`, this.login.bind(this));
        this.router.get(`${this.path}/logout`, this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, this.changePassword.bind(this));
        super.initializeRoutes();
    }
    protected getData(req: Request, res: Response, next: NextFunction) {
        return super.getData(req, res, next, [],
            [
                "admin_id",
                "date_of_birth",
                "district",
                "state",
                "country",
                "status"
            ], {
            attributes: [
                "user_id",
                "username",
                "full_name",
                "role"
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
            const findAdminDetail = await this.crudService.findOne(modelLoaded, { where: where });
            if (!findAdminDetail || findAdminDetail instanceof Error) {
                throw notFound();
            } else {
                const adminData = await this.crudService.update(modelLoaded, payload, { where: where });
                const userData = await this.crudService.update(user, payload, { where: { user_id: findAdminDetail.dataValues.user_id } });
                if (!adminData || !userData) {
                    throw badRequest()
                }
                if (adminData instanceof Error) {
                    throw adminData;
                }
                if (userData instanceof Error) {
                    throw userData;
                }
                const data = { userData, admin };
                return res.status(200).send(dispatcher(res, data, 'updated'));
            }
        } catch (error) {
            next(error);
        }
    }

    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.body.username || req.body.username === "") req.body.username = req.body.full_name.replace(/\s/g, '');
        if (!req.body.password || req.body.password === "") req.body.password = this.password;
        if (req.body.role == 'ADMIN' || req.body.role == 'EADMIN') {
            const result = await this.authService.register(req.body);
            if (result.user_res) return res.status(406).send(dispatcher(res, result.user_res.dataValues, 'error', speeches.ADMIN_EXISTS, 406));
            return res.status(201).send(dispatcher(res, result.profile.dataValues, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
        }
        return res.status(406).send(dispatcher(res, null, 'error', speeches.USER_ROLE_REQUIRED, 406));
    }

    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        let adminDetails: any;
        if (req.query.eAdmin && req.query.eAdmin == 'true') { req.body['role'] = 'EADMIN' } else { req.body['role'] = 'ADMIN' }
        const result = await this.authService.login(req.body);
        if (!result) {
            return res.status(404).send(dispatcher(res, result, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(401).send(dispatcher(res, result.error, 'error', speeches.USER_RISTRICTED, 401));
        } else {
            adminDetails = await this.authService.getServiceDetails('admin', { user_id: result.data.user_id });
            if (!adminDetails) {
                result.data['admin_id'] = null;
            } else {
                result.data['admin_id'] = adminDetails.dataValues.admin_id;
            }
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
    // private async updatePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     const result = await this.authService.updatePassword(req.body, res);
    //     if (!result) {
    //         return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_NOT_FOUND));
    //     } else if (result.error) {
    //         return res.status(404).send(dispatcher(res,result.error, 'error', result.error));
    //     }
    //     else if (result.match) {
    //         return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_PASSWORD));
    //     } else {
    //         return res.status(202).send(dispatcher(res,result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
    //     }
    // }
};