import { Router, Request, Response, NextFunction } from 'express';
import { Op, Sequelize } from 'sequelize';
import webPush from 'web-push';
import fs from 'fs';
import path from 'path';
import BaseController from './base.controller';
import { notification } from '../models/notification.model';
import dispatcher from '../utils/dispatch.util';
import { constents } from '../configs/constents.config';
import validationMiddleware from '../middlewares/validation.middleware';
import { speeches } from '../configs/speeches.config';
import notificationValidations from '../validations/notification.validations';
import ValidationsHolder from '../validations/validationHolder';
import CRUDService from '../services/crud.service';

export default class NotificationsController {
    public path: string;
    public router: Router;
    crudService: CRUDService = new CRUDService;
    private webPush: any = webPush;

    constructor() {
        this.path = '/notifications';
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.post(`${this.path}/stream`, this.stream);
        this.router.get(`${this.path}/tome`, this.getMyNotifications);
        this.router.get(`${this.path}/all`, this.getAll);
        this.router.post(`${this.path}/send`, validationMiddleware(notificationValidations.send), this.sendNotification);
        this.router.post(`${this.path}/sendwithposter`, validationMiddleware(notificationValidations.send), this.sendNotificationWithPoster);
        this.router.get(`${this.path}/read/:id`, this.readNotification);
    }


    private stream = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        // It is recommended to use other queue services like rabbitmq, kafka, etc.
        // TODO: Replace this SSE with a queue service
        const subscription = req.body
        res.status(201).json({});


        setInterval(() => {
            const payload = JSON.stringify({
                date: new Date().toLocaleString(),
                user: res.locals,
                Notification: {},
                badges: {}
            });
            webPush.sendNotification(subscription, payload)
                .catch(error => console.error(error));
        }, 5000);
    }

    public getMyNotifications = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        let notifications: any = await this.crudService.findWhere(notification, {
            [Op.and]: [
                {
                    status: constents.notification_status_flags.list.PUBLISHED
                },
                {
                    notification_type: constents.notification_types.list.PUSH
                },
                {
                    [Op.or]: [
                        {
                            read_by: {
                                [Op.or]: [{ [Op.notLike]: `%${res.locals.user_id}%` }],
                            }
                        },
                        {
                            read_by: {
                                [Op.or]: [{ [Op.eq]: null }]
                            }
                        },
                    ]
                },
                {
                    [Op.or]: [
                        {
                            target_audience: {
                                [Op.or]: [{ [Op.like]: `%${res.locals.user_id}%` }]
                            }
                        },
                        {
                            target_audience: {
                                [Op.or]: [{ [Op.eq]: 'ALL' }]
                            }
                        }
                    ]
                },
            ]
        },[
            ['updated_at', 'DESC']
        ]);
        if (!notifications) {
            notifications = [];
        }

        const final_notifications = notifications.filter(function (rec: any) {
            rec = rec.dataValues;
            let t_users = (rec.target_audience) ? rec.target_audience.split(",") : [];
            let read_users = (rec.read_by) ? rec.read_by.split(",") : [];
            if ((rec.target_audience === 'ALL' || t_users.indexOf(res.locals.user_id) > -1)
                && (read_users.indexOf(res.locals.user_id.toString()) === -1)) {
                rec.is_readed = false;
                return rec;
            }

        });

        return res.status(200).send(dispatcher(res,final_notifications, 'success'));
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        console.log(res.locals);
        let notifications: any = await this.crudService.findWhere(notification, {
            [Op.and]: [
                {
                    [Op.or]: [
                        {
                            target_audience: {
                                [Op.or]: [{ [Op.like]: `%${res.locals.user_id}%` }]
                            }
                        },
                        {
                            target_audience: {
                                [Op.or]: [{ [Op.eq]: 'ALL' }]
                            }
                        }
                    ]
                },
                {
                    status: constents.notification_status_flags.list.PUBLISHED
                },
                {
                    notification_type: constents.notification_types.list.PUSH
                }
            ]
        }, [
            ['updated_at', 'DESC']
        ]);
        if (!notifications) {
            notifications = [];
        }

        const final_notifications = notifications.filter(function (rec: any) {
            rec = rec.dataValues;
            let t_users = (rec.target_audience) ? rec.target_audience.split(",") : [];
            let read_users = (rec.read_by) ? rec.read_by.split(",") : [];
            if ((rec.target_audience === 'ALL' || t_users.indexOf(res.locals.user_id.toString()) > -1)) {
                rec.is_readed = (read_users.indexOf(res.locals.user_id.toString()) > -1);
                return rec;
            }

        });

        return res.status(200).send(dispatcher(res,final_notifications, 'success'));
    }

    private sendNotification = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const data = req.body;
        data['created_by'] = res.locals.user_id;
        const result = await this.crudService.create(notification, data);
        if (!result) {
            return res.status(406).send(dispatcher(res,null, 'error', speeches.NOT_ACCEPTABLE, 406));
        }
        return res.status(200).send(dispatcher(res,result, 'success'));
    }

    private sendNotificationWithPoster = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const data = req.body;
        const files: any = req.files;
        data['created_by'] = res.locals.user_id;

        if (files.image) {
            const filename = files.image.path.split(path.sep).pop();
            const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', 'posters', filename);
            fs.rename(files.image.path, targetPath, async (err) => {
                if (err) {
                    return res.status(406).send(dispatcher(res,speeches.UPLOAD_FAILD, 'error', speeches.NOT_ACCEPTABLE, 406));
                } else {
                    data['image'] = `/posters/${filename}`;
                    const result = await this.crudService.create(notification, data);
                    if (!result) {
                        return res.status(406).send(dispatcher(res,null, 'error', speeches.NOT_ACCEPTABLE, 406));
                    }
                    return res.status(200).send(dispatcher(res,result, 'success'));
                }
            });
        } else {
            const result = await this.crudService.create(notification, data);
            if (!result) {
                return res.status(406).send(dispatcher(res,null, 'error', speeches.NOT_ACCEPTABLE, 406));
            }
            return res.status(200).send(dispatcher(res,result, 'success'));
        }
    }

    private readNotification = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if (req.params.id == "all") {
            this.makeAllRead(req, res, next);
        }
        else {
            const result = await this.crudService.findByPk(notification, req.params.id);
            if (!result) {
                return res.status(404).send(dispatcher(res,null, 'error', speeches.DATA_NOT_FOUND, 404));
            }

            const read_by_list = (result.read_by) ? result.read_by.split(",") : [];
            if(read_by_list.indexOf(res.locals.user_id.toString()) == -1){
                read_by_list.push(res.locals.user_id.toString());
            }

            await this.crudService.update(notification, {
                // read_by: Sequelize.fn('CONCAT', Sequelize.col('read_by'), ',', Sequelize.literal(`'${res.locals.id}'`)),
                read_by: read_by_list.join(","),
                updated_by: res.locals.user_id,
            },
                { where:{
                    notification_id: req.params.id
                } 
            });

            return res.status(200).send(dispatcher(res,result, 'success'));
        }
    }

    private makeAllRead = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        let notifications: any = await this.crudService.findWhere(notification, {
            [Op.and]: [
                {
                    status: constents.notification_status_flags.list.PUBLISHED
                },
                {
                    notification_type: constents.notification_types.list.PUSH
                },
                {
                    [Op.or]: [
                        {
                            read_by: {
                                [Op.or]: [{ [Op.notLike]: `%${res.locals.user_id}%` }],
                            }
                        },
                        {
                            read_by: {
                                [Op.or]: [{ [Op.eq]: null }]
                            }
                        },
                    ]
                },
                {
                    [Op.or]: [
                        {
                            target_audience: {
                                [Op.or]: [{ [Op.like]: `%${res.locals.user_id}%` }]
                            }
                        },
                        {
                            target_audience: {
                                [Op.or]: [{ [Op.eq]: 'ALL' }]
                            }
                        }
                    ]
                },
            ]
        });
        if (!notifications) {
            notifications = [];
        }

        const updated_res:any = [];
        notifications.forEach(async (rec: any) => {
            rec = rec.dataValues;
            let t_users = (rec.target_audience) ? rec.target_audience.split(",") : [];
            let read_users = (rec.read_by) ? rec.read_by.split(",") : [];
            if ((rec.target_audience === 'ALL' || t_users.indexOf(res.locals.user_id) > -1)
                && (read_users.indexOf(res.locals.user_id.toString()) === -1)) {
                    if(read_users.indexOf(res.locals.user_id.toString()) === -1){
                        read_users.push(res.locals.user_id);
                    }
                    const result = await this.crudService.update(notification, {
                        // read_by: Sequelize.fn('CONCAT', Sequelize.col('read_by'), ',', Sequelize.literal(`'${res.locals.user_id}'`)),
                        read_by: read_users.join(","),
                        updated_by: res.locals.user_id,
                    },
                    {
                        where: {
                            notification_id: rec.notification_id
                        }
                    });

                    if(result){
                        updated_res.push(result.dataValues);
                    }
            }
        });

        return res.status(200).send(dispatcher(res,updated_res, 'success'));
    }
}
