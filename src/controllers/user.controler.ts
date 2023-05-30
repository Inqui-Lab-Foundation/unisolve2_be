import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import { badRequest } from 'boom';
import validationMiddleware from '../middlewares/validation.middleware';
import { UpdateMentorUsernameSchema } from '../validations/user.validations'

export default class UserController extends BaseController {
    model = "user";
    authService: authService = new authService;
    protected initializePath(): void {
        this.path = '/users';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(null, null);
    }
    protected initializeRoutes(): void {
        //example route to add
        this.router.put(`${this.path}/updateMentorDetails`, validationMiddleware(UpdateMentorUsernameSchema), this.updateMentorUserDetails.bind(this));
        super.initializeRoutes();
    }

    private async updateMentorUserDetails(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const result = await this.authService.updateUserMentorDetails(req.body);
            if (!result) throw res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
            else if (result.error) return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
            else return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        } catch (error) {
            next(error)
        }
    };
};