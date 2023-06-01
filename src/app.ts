import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from 'swagger-ui-express';
import path from "path";
import formData from "express-form-data";
import http from "http";
import os from "os";

import logIt from "./utils/logit.util";
import database from "./utils/dbconnection.util";
import IController from "./interfaces/controller.interface";
import routeProtectionMiddleware from "./middlewares/routeProtection.middleware";
import healthCheckMiddleware from "./middlewares/healthCheck.middleware";
import { options } from "./docs/options";
import * as errorHandler from "./middlewares/errorHandler.middleware";
import { constents } from "./configs/constents.config";
import { CronManager } from "./jobs/cronManager";
import DashboardMapStatsJob from "./jobs/dashboardMapStats.jobs";
import { translationMiddleware } from "./middlewares/translation.middleware";
import TranslationService from "./services/translation.service";

/**
 * Application Class is responsible to call internal validation middleware and establish the database connection.
 * @params list of controller as array
 * @params portNumber
 * @params Database connection string
 * @note make sure translation middleware is called after route protection middleware because, 
 * @note translation middleware adds data to res.locals which is overridden in route protection middleware
 * @note make sure initializeErrorHandling is the last middleware 
 */
export default class App {
    public app: Application;
    public port: number;
    public db: any;

    constructor(controllers: IController[], port: number) {
        this.app = express();
        this.port = port;
        this.increaseSimulatenousHttpSockets();
        this.initializeMiddlewares();
        this.initializeHomeRoute();
        this.serveStaticFiles();
        this.initializeDocs();
        this.initializeHealthCheck();
        this.doLogIt(constents.log_levels.list.INBOUND);
        this.initializeRouteProtectionMiddleware();
        this.initializeTranslations();
        this.initializeControllers(controllers, "/api", "v1");
        this.doLogIt(constents.log_levels.list.OUTBOUND);
        this.initializeErrorHandling();
        this.initializeDatabase();
        this.initializeJobs();
    }

    /**
     * http.globalAgent.maxSockets = 100;
     * You could also set it to unlimited (Node v0.12 does by default):
     */
    private increaseSimulatenousHttpSockets() {
        http.globalAgent.maxSockets = Infinity;
    }
    /**
     * Logger service initialization 
     * @param flag log level ERROR, INBOUND, OUTBOUND ect...
     */
    private doLogIt(flag: string) {
        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            await logIt(flag, ((flag == constents.log_levels.list.INBOUND) ? "Inbound request" : "Outbound response"), req, res);
            next();
        });
    }

    /**
     * initialization database connection and auto sync with the database model defined.
     */
    private initializeDatabase(): void {
        console.log('name', process.env.DB_NAME, 'user', process.env.DB_USER)
        database.sync()
            .then(async () => {
                await logIt(constents.log_levels.list.INFO, "Connected to the Database successfully");
            })
            .catch(async (e: any) => {
                await logIt(constents.log_levels.list.ERROR, `DB CONNECTIVITY ERROR: Message: ${e}.`);
                await logIt(constents.log_levels.list.ERROR, `Terminating the process with code:1, due to DB CONNECTIVITY ERROR.`);
                process.exit(1);
            });
    }

    /**
     * Initialization corn jobs and trigger them at the specific time.
     */
    private initializeJobs(): void {
        const cronManager = CronManager.getInstance()
        cronManager.addJob(new DashboardMapStatsJob())
        cronManager.startAll();
    }

    /**
     * Initialization security middlewares
     * @example Helmet for secure headers
     * @example Compression for gzip
     */
    private initializeMiddlewares(): void {
        this.app.use(helmet({
            crossOriginResourcePolicy: false,
        }));
        this.app.use(cors());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(formData.parse({
            uploadDir: os.tmpdir(),
            autoClean: true
        }));
        this.app.use(compression());
        this.app.use(translationMiddleware)
    }

    /**
     * Initialization default router it's extends return docs, baseURL, and Application health checker
     */
    private initializeHomeRoute(): void {
        this.app.get("/", (req: Request, res: Response, next: NextFunction) => {
            const resData = {
                status: 200,
                status_type: "success",
                apis: {
                    docks: `https://${process.env.APP_HOST_NAME}:${process.env.APP_PORT}/docs`,
                    apis: `https://${process.env.APP_HOST_NAME}:${process.env.APP_PORT}/api/v1`,
                    healthcheck: `https://${process.env.APP_HOST_NAME}:${process.env.APP_PORT}/healthcheck`,
                },
            }
            res.status(resData.status).send(resData).end();
        });
    }

    /**
     * allowing users to access the attachments
     */
    private serveStaticFiles(): void {
        this.app.use("/assets", express.static(path.join(process.cwd(), 'resources', 'static', 'uploads')));
        this.app.use("/assets/defaults", express.static(path.join(process.cwd(), 'resources', 'static', 'uploads', 'default')));
        this.app.use("/posters", express.static(path.join(process.cwd(), 'resources', 'static', 'uploads', 'posters')));
        this.app.use("/images", express.static(path.join(process.cwd(), 'resources', 'static', 'uploads', 'images')));
        this.app.use("/assets/courses", express.static(path.join(process.cwd(), 'resources', 'static', 'uploads', 'courses')));
        this.app.use("/assets/reflectiveQuiz", express.static(path.join(process.cwd(), 'resources', 'static', 'uploads', "reflective_quiz")));
    }

    private initializeDocs(): void {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(options));
        this.app.use("/docs.json", (req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(options);
            next();
        });
    }

    /**
     * Initialization healthCheck
     */
    private initializeHealthCheck(): void {
        this.app.get("/healthcheck", healthCheckMiddleware);
    }

    /**
     * Initialization private routes
     */
    private initializeRouteProtectionMiddleware(): void {
        this.app.use(routeProtectionMiddleware);
    }

    /**
     * Initialization translation services
     */
    private initializeTranslations() {
        const translationService = new TranslationService(constents.translations_flags.default_locale, true)
        this.app.use(translationMiddleware)
    }

    /**
     * Initialization Controllers 
     * @param controllers array of controllers
     * @param prefix name that appends before the API default = /api
     * @param version default v1
     */
    private initializeControllers(controllers: IController[], prefix: string = "/api", version: string = "v1"): void {
        controllers.forEach((controller: IController) => {
            this.app.use(`${prefix}/${version}`, controller.router);
        });
    }

    // Initialization Error Middleware
    private initializeErrorHandling(): void {
        this.app.use(errorHandler.genericErrorHandler);
        this.app.use(errorHandler.notFound);
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            process.on('UnhandledRejection', async err => {
                await logIt(constents.log_levels.list.ERROR, `Unhandled rejection. Error-object: ${err}`);
                res.send(err).end()
            });
        });
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            process.on('Uncaught exception', async err => {
                ;
                await logIt(constents.log_levels.list.ERROR, `Uncaught exception. Error-object: ${err}`);
                res.send(err).end()
            });
        });
    }

    /**
     * Filter out API endpoints and display them and other basic information to the terminal
     */
    private showRoutes(): void {
        var route, routes: any[] = [];
        this.app._router.stack.forEach(function (middleware: any) {
            if (middleware.route) { // routes registered directly on the app
                routes.push(middleware.route);
            } else if (middleware.name === 'router') { // router middleware 
                middleware.handle.stack.forEach(function (handler: any) {
                    route = handler.route;
                    route && routes.push(route);
                });
            }
        });
        console.log(
            `=================================================================
Available Routes:
=================================================================`);
        console.log(`Base Path: http://localhost:${this.port}/api/v1`);
        console.log(`Course Images: http://localhost:${this.port}/courses`);
        console.log(`Poster Images: http://localhost:${this.port}/posters`);
        console.log(`Standard Images: http://localhost:${this.port}/images`);
        console.table(routes);
    }

    public listen(): void {
        this.app.listen(this.port, async () => {
            await logIt(constents.log_levels.list.INFO, `App is running at http://${process.env.APP_HOST_NAME}:${this.port}`);
            if (process.env.SHOW_ROUTES === "true") {
                this.showRoutes();
            }
        });
    }

}