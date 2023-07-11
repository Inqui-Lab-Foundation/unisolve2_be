import { NextFunction, Request, Response } from "express";
import { speeches } from "../configs/speeches.config";
import dispatcher from "../utils/dispatch.util";
import BaseController from "./base.controller";
import authService from "../services/auth.service";

export default class DistrictController extends BaseController {

    model = "district_coordinators";
    authService: authService = new authService;

    protected initializePath(): void {
        this.path = '/district_coordinators';
    }
    protected initializeValidations(): void {
    }
    protected initializeRoutes(): void {
        this.router.post(`${this.path}/login`,this.login.bind(this));
        this.router.get(`${this.path}/logout`,this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, this.changePassword.bind(this));
        super.initializeRoutes();
    };

    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const result = await this.authService.districtlogin(req.body);
            if (!result) {
                return res.status(404).send(dispatcher(res, result, 'error', speeches.USER_NOT_FOUND));
            }
            else if (result.error){
                return res.status(403).send(dispatcher(res,result,'error'));
            }
            else {
                return res.status(200).send(dispatcher(res, result.data, 'success', speeches.USER_LOGIN_SUCCESS));
            }
        } catch (error) {
            return res.status(401).send(dispatcher(res, error, 'error', speeches.USER_RISTRICTED, 401));
        }
    }

    private async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.districtlogout(req.body, res);
        if (result.error) {
            next(result.error);
        } else {
            return res.status(200).send(dispatcher(res, speeches.LOGOUT_SUCCESS, 'success'));
        }
    }

    private async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.districtchangePassword(req.body, res);
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
}
