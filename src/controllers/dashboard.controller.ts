import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import db from "../utils/dbconnection.util";
import { Op, QueryTypes } from 'sequelize';
import DashboardMapStatsJob from '../jobs/dashboardMapStats.jobs';
import { dashboard_map_stat } from '../models/dashboard_map_stat.model';
import DashboardService from '../services/dashboard.service';
import { mentor } from '../models/mentor.model';
import { organization } from '../models/organization.model';
import { constents } from '../configs/constents.config';
import path from 'path';
import { readFileSync } from 'fs';
import { badData, internal, notFound } from 'boom';
import { student } from '../models/student.model';
import { team } from '../models/team.model';
import { challenge_response } from '../models/challenge_response.model';
import StudentService from '../services/students.service';
import { user } from '../models/user.model';
import { object } from 'joi';
import {baseConfig} from "../configs/base.config";


export default class DashboardController extends BaseController {
    model = ""; ///this u will override in every function in this controller ...!!!

    protected initializePath(): void {
        this.path = '/dashboard';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(null, null);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);

        ///map stats
        this.router.get(`${this.path}/refreshMapStatsLive`, this.getMapStatsLive.bind(this))
        this.router.get(`${this.path}/mapStats`, this.getMapStats.bind(this))
        this.router.get(`${this.path}/refreshMapStats`, this.refreshMapStats.bind(this))


        //mentor stats...
        this.router.get(`${this.path}/mentorStats/:mentor_user_id`, this.getMentorStats.bind(this))
        //this.router.get(`${this.path}/mentorStats/:mentor_id/progessOverall`, this.getMentorStatsProgressOverall.bind(this))

        //student Stats...
        this.router.get(`${this.path}/studentStats/:student_user_id`, this.getStudentStats.bind(this))
        this.router.get(`${this.path}/studentStats/:student_user_id/challenges`, this.getStudentChallengeDetails.bind(this))
        this.router.get(`${this.path}/studentStats/:student_user_id/teamProgress`, this.getTeamProgress.bind(this))

        //team stats..
        this.router.get(`${this.path}/teamStats/:team_id`, this.getTeamStats.bind(this));

        //evaluator stats..
        this.router.get(`${this.path}/evaluatorStats`, this.getEvaluatorStats.bind(this));
        //loggedInUserCount
        this.router.get(`${this.path}/loggedInUserCount`, this.getLoggedInUserCount.bind(this));
        //quizscore
        this.router.get(`${this.path}/quizscores`,this.getUserQuizScores.bind(this));
        //singledashboard mentor api's 
        this.router.get(`${this.path}/ideaCount`,this.getideaCount.bind(this));
        this.router.get(`${this.path}/mentorpercentage`,this.getmentorpercentage.bind(this));
        //singledashboard common api's 
        this.router.get(`${this.path}/teamCount`,this.getteamCount.bind(this));
        this.router.get(`${this.path}/studentCount`,this.getstudentCount.bind(this));
        //singledashboard admin api's
        this.router.get(`${this.path}/studentCourseCount`,this.getstudentCourseCount.bind(this));
        this.router.get(`${this.path}/ideasCount`,this.getideasCount.bind(this));
        this.router.get(`${this.path}/mentorCount`,this.getmentorCount.bind(this));
        this.router.get(`${this.path}/studentCountbygender`,this.getstudentCountbygender.bind(this));
        this.router.get(`${this.path}/schoolCount`,this.getSchoolCount.bind(this));
        this.router.get(`${this.path}/mentorCourseCount`,this.getmentorCourseCount.bind(this));
        this.router.get(`${this.path}/schoolRegCount`,this.getschoolRegCount.bind(this));

        super.initializeRoutes();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////// MENTOR STATS
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    private async getMentorStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { mentor_user_id } = req.params;
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }

            const mentor_stats = await mentor.findOne({
                where: {
                    user_id: mentor_user_id,
                },
                attributes: [
                    [
                        db.literal(`(
                        select count(s.student_id) 
                        from students as s
                        where 
                        ${addWhereClauseStatusPart ? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                        and s.team_id in (
                            select team_id 
                            from teams as t
                            where 
                            ${addWhereClauseStatusPart ? "t." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            and t.mentor_id=\`mentor\`.\`mentor_id\`)
                            )`),
                        "students_count"
                    ],
                    [
                        db.literal(`(
                        select count(c.team_id) 
                        from challenge_responses as c 
                        where c.team_id in (
                            select team_id 
                            from teams as t
                            where 
                            ${addWhereClauseStatusPart ? "t." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            and t.mentor_id=\`mentor\`.\`mentor_id\`)
                        and c.status not in ('DRAFT')
                        )`),
                        "ideas_count"
                    ],
                    [
                        db.literal(`(
                        select count(t.team_id) 
                        from teams as t
                        where 
                        ${addWhereClauseStatusPart ? "t." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                        and t.mentor_id=\`mentor\`.\`mentor_id\`
                        and t.status='ACTIVE'
                        )`),
                        "teams_count"
                    ],
                    [
                        db.literal(`(
                            SELECT count(*) FROM mentor_topic_progress where user_id = ${mentor_user_id})`),"course_completed_count"
                    ],
                    [
                        db.literal(`(
                            SELECT count(*) FROM quiz_responses where user_id = ${mentor_user_id})`),"Quiz_completed_count"
                    ],
                    [ 
                        db.literal(`(SELECT count(*) FROM mentor_course_topics where status="ACTIVE")`),"Total_course_count"
                    ]
                ],
                include: {
                    model: organization,
                    attributes: [
                        'organization_name',
                        'district'
                    ]

                }
            })
            if (mentor_stats instanceof Error) {
                throw mentor_stats
            }
            if (mentor_stats) {
                res.status(200).json(dispatcher(res, mentor_stats, "success"))
            } else {
                res.status(500).json(dispatcher(res, "something went wrong", "error"))
            }
        } catch (err) {
            next(err)
        }
    }
   
    private async getMentorStatsProgressOverall(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const options = {
                root: path.join(process.cwd(), 'resources', 'configs'),
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            const filePath = path.join(process.cwd(), 'resources', 'configs', 'roadMap.json');
            if (filePath === 'Error') {
                return res.status(404).send(dispatcher(res, speeches.FILE_EMPTY, 'error', speeches.DATA_NOT_FOUND));
            }
            var file: any = readFileSync(path.join(process.cwd(), 'resources', 'configs', 'roadMap.json'), {
                encoding: 'utf8',
                flag: 'r'
            })

            if (file instanceof Error) {
                throw file;
            }

            /*if(!file){
            file=JSON.parse(file)
                console.log("file",file)
               if(!file.teacher || typeof file.teacher !='object'){
                   throw internal(speeches.ROADMAP_FILE_CORRUPTED)
               }
            }*/
            console.log(file.teacher);
            const teacherStepsTotal = Object.keys(file.teacher);
            const totalNoOfSteps = teacherStepsTotal.length;
            let totalNoOfCompletedSteps = 0;
            for (var i = 0; i < totalNoOfSteps; i++) {
                const step = file.teacher[teacherStepsTotal[i]];
                if (!step.start_date || step.end_date) {
                    continue;
                }
                try {
                    const startDate = new Date(step.start_date).getTime();
                    const endDate = new Date(step.end_date).getTime();
                    const currDate = new Date().getTime();
                    if (currDate << endDate && currDate >> startDate) {
                        totalNoOfCompletedSteps++;
                    }

                } catch (err) {
                    continue;
                }

            }

            const result = {
                "total_steps": totalNoOfSteps,
                "completed_steps": totalNoOfCompletedSteps,
                "progress": ((totalNoOfCompletedSteps / totalNoOfSteps) * 100)
            }

            res.send(dispatcher(res, result, "success"))

        } catch (err) {
            next(err)
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////// STUDENT STATS
    ///////// PS: this assumes that there is only course in the systems and hence alll topics inside topics table are taken for over counts
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    private async getStudentStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { student_user_id } = req.params;
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }

            const serviceDashboard = new DashboardService();
            const studentStatsResul: any = await student.findOne({
                where: {
                    user_id: student_user_id
                },
                raw: true,
                attributes: [
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcsCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_topics_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcVideosCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_videos_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcWorksheetCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_worksheets_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcQuizCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_quiz_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "topics_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForVideoToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "videos_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForWorksheetToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "worksheet_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForQuizToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "quiz_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForPostSurveyCreatedAt(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "post_survey_completed_date"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForCourseCompletedCreatedAt(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "course_completed_date"
                    ],
                    "badges"
                ]
            })
            if (!studentStatsResul) {
                throw notFound(speeches.USER_NOT_FOUND)
            }
            if (studentStatsResul instanceof Error) {
                throw studentStatsResul
            }
            // console.log(studentStatsResul)
            const badges = studentStatsResul.badges;
            let badgesCount = 0
            if (badges) {
                const badgesParsed = JSON.parse(badges);
                if (badgesParsed) {
                    badgesCount = Object.keys(badgesParsed).length
                }
                delete studentStatsResul.badges;
            }
            studentStatsResul["badges_earned_count"] = badgesCount;



            res.status(200).send(dispatcher(res, studentStatsResul, "success"))

        } catch (err) {
            next(err)
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////// TEAM STATS
    ///////// PS: this assumes that there is only course in the systems and hence alll topics inside topics table are taken for over counts
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    private async getTeamStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { team_id } = req.params;
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }

            const serviceDashboard = new DashboardService();
            const studentStatsResul: any = await student.findAll({
                where: { team_id },
                raw: true,
                attributes: [
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcsCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_topics_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcVideosCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_videos_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcWorksheetCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_worksheets_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcQuizCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "all_quiz_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForAllToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "topics_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForVideoToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "videos_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForWorksheetToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "worksheet_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForQuizToipcsCompletedCount(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "quiz_completed_count"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForPreSurveyStatus(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "pre_survey_status"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralForPostSurveyStatus(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "post_survey_status"
                    ],
                    [
                        db.literal(`(
                            ${serviceDashboard.getDbLieralIdeaSubmission(addWhereClauseStatusPart,
                            whereClauseStatusPartLiteral)}
                            )`),
                        "idea_submission"
                    ],
                    "certificate",
                    "badges",
                    "created_at",
                    "full_name",
                    "user_id"
                ]
            })
            if (!studentStatsResul) {
                throw notFound(speeches.USER_NOT_FOUND)
            }
            if (studentStatsResul instanceof Error) {
                throw studentStatsResul
            }
            //console.log(studentStatsResul)
            const badges = studentStatsResul.badges;
            let badgesCount = 0
            if (badges) {
                const badgesParsed = JSON.parse(badges);
                if (badgesParsed) {
                    badgesCount = Object.keys(badgesParsed).length
                }
                delete studentStatsResul.badges;
            }
            studentStatsResul["badges_earned_count"] = badgesCount;



            res.status(200).send(dispatcher(res, studentStatsResul, "success"))

        } catch (err) {
            next(err)
        }
    }

    private async getStudentChallengeDetails(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {

            const { student_user_id } = req.params;
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }
            const studentService = new StudentService();
            const endDate = "20th November 2022 at 12pm"
            let challenge_submission_status = false
            let result: any = {
                end_date: "20th November 2022 at 12pm"
            }
            let teamMembers: any = null
            teamMembers = await studentService.getTeamMembersForUserId(student_user_id)
            if (!teamMembers) {
                teamMembers = []
            }
            if (teamMembers instanceof Error) {
                throw teamMembers
            }
            result = {
                ...result,
                "challenge_submission_status": challenge_submission_status,
                // "team_members": teamMembers
            }
            // console.log("teamMembers",teamMembers)
            if (teamMembers.length <= 0) {
                res.status(200).send(dispatcher(res, result, "success"))
                return;
            }

            const studentChallengeSubmission = await challenge_response.findAll({
                where: {
                    team_id: teamMembers[0].team_id
                }
            })

            if (!studentChallengeSubmission) {
                res.status(200).send(dispatcher(res, result, "success"))
                return;
            }
            if (studentChallengeSubmission instanceof Error) {
                throw studentChallengeSubmission
            }

            challenge_submission_status = true;
            result = {
                ...result,
                "challenge_submission_status": challenge_submission_status,
                // "team_members": teamMembers
            }
            res.status(200).send(dispatcher(res, result, "success"))
            return;
        } catch (err) {
            next(err)
        }
    }
    private async getTeamProgress(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { student_user_id } = req.params;
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }
            const studentService = new StudentService();

            let teamMembers: any = await studentService.getTeamMembersForUserIdWithProgressAsOptional(
                student_user_id,
                true,
                addWhereClauseStatusPart,
                whereClauseStatusPartLiteral)

            if (!teamMembers) {
                throw badData(speeches.TEAM_NOT_FOUND)
            }
            if (teamMembers instanceof Error) {
                throw teamMembers
            }

            res.status(200).send(dispatcher(res, teamMembers, "success"))

        } catch (err) {
            next(err)
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////// MAPP STATS
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    private async refreshMapStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const service = new DashboardService()
            const result = await service.resetMapStats()
            res.status(200).json(dispatcher(res, result, "success"))
        } catch (err) {
            next(err);
        }
    }
    private async getMapStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            this.model = dashboard_map_stat.name
            return await this.getData(req, res, next, [],
                [
                    [db.fn('DISTINCT', db.col('district_name')), 'district_name'],
                    `dashboard_map_stat_id`,
                    `overall_schools`, `reg_schools`,`reg_mentors`, `schools_with_teams`, `teams`, `ideas`, `students`, `status`, `created_by`, `created_at`, `updated_by`, `updated_at`
                ]
            )
        } catch (error) {
            next(error);
        }
    };

    private async getMapStatsLive(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const service = new DashboardService()
            await service.resetMapStats()
            this.model = dashboard_map_stat.name
            return await this.getData(req, res, next)
        } catch (error) {
            next(error);
        }
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////// EVALUATOR STATS
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    protected async getEvaluatorStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let response: any = {};
            const submitted_count = await db.query("SELECT count(challenge_response_id) as 'submitted_count' FROM challenge_responses where status = 'SUBMITTED'", { type: QueryTypes.SELECT });
            const selected_round_one_count = await db.query("SELECT count(challenge_response_id) as 'selected_round_one_count' FROM challenge_responses where evaluation_status = 'SELECTEDROUND1'", { type: QueryTypes.SELECT });
            const rejected_round_one_count = await db.query("SELECT count(challenge_response_id) as 'rejected_round_one_count' FROM challenge_responses where evaluation_status = 'REJECTEDROUND1'", { type: QueryTypes.SELECT });
            const l2_yet_to_processed = await db.query("SELECT COUNT(*) AS l2_yet_to_processed FROM l1_accepted;", { type: QueryTypes.SELECT });
            const l2_processed = await db.query("SELECT challenge_response_id, count(challenge_response_id) AS l2_processed FROM unisolve_db.evaluator_ratings group by challenge_response_id HAVING COUNT(challenge_response_id) > 2", { type: QueryTypes.SELECT });
            const draft_count = await db.query("SELECT count(challenge_response_id) as 'draft_count' FROM challenge_responses where status = 'DRAFT'", { type: QueryTypes.SELECT });
            const final_challenges = await db.query("SELECT count(challenge_response_id) as 'final_challenges' FROM evaluation_results where status = 'ACTIVE'", { type: QueryTypes.SELECT });
            const l1_yet_to_process = await db.query(`SELECT COUNT(challenge_response_id) AS l1YetToProcess FROM unisolve_db.challenge_responses WHERE status = 'SUBMITTED' AND evaluation_status is NULL OR evaluation_status = ''`, { type: QueryTypes.SELECT });
            const final_evaluation_challenge = await db.query(`SELECT COUNT(challenge_response_id) FROM unisolve_db.challenge_responses WHERE final_result = '0'`, { type: QueryTypes.SELECT });
            const final_evaluation_final = await db.query(`SELECT COUNT(challenge_response_id) FROM unisolve_db.challenge_responses WHERE final_result = '1'`, { type: QueryTypes.SELECT });
            if (submitted_count instanceof Error) {
                throw submitted_count
            }
            if (selected_round_one_count instanceof Error) {
                throw selected_round_one_count
            }
            if (rejected_round_one_count instanceof Error) {
                throw rejected_round_one_count
            };
            if (l2_yet_to_processed instanceof Error) {
                throw l2_yet_to_processed
            };
            if (l2_processed instanceof Error) {
                throw l2_processed
            };
            if (draft_count instanceof Error) {
                throw draft_count
            };
            if (final_challenges instanceof Error) {
                throw final_challenges
            };
            if (l1_yet_to_process instanceof Error) {
                throw l1_yet_to_process
            };
            if (final_evaluation_challenge instanceof Error) {
                throw final_evaluation_challenge
            };
            if (final_evaluation_final instanceof Error) {
                throw final_evaluation_final
            };
            response['draft_count'] = Object.values(draft_count[0]).toString();
            response['submitted_count'] = Object.values(submitted_count[0]).toString()
            response['l1_yet_to_process'] = Object.values(l1_yet_to_process[0]).toString();
            response['selected_round_one_count'] = Object.values(selected_round_one_count[0]).toString()
            response["rejected_round_one_count"] = Object.values(rejected_round_one_count[0]).toString()
            response["l2_processed"] = (l2_processed.length).toString()
            response["l2_yet_to_processed"] = Object.values(l2_yet_to_processed[0]).toString()
            response['final_challenges'] = Object.values(final_challenges[0]).toString();
            response['final_evaluation_challenge'] = Object.values(final_evaluation_challenge[0]).toString();
            response['final_evaluation_final'] = Object.values(final_evaluation_final[0]).toString();
            res.status(200).send(dispatcher(res, response, "success"))
        } catch (err) {
            next(err)
        }
    }

    //loggedUserCount
    protected async getLoggedInUserCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let response: any;
            const paramStatus: any = req.query.status;
            // let  timer: any = req.body.time;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }
            // timer = new Date(timer);
            // const modifiedTime: any = timer.setSeconds(timer.getSeconds() + 5);
            response = await this.crudService.findAndCountAll(user, {
                attributes: [
                    "full_name",
                    [
                        db.literal(`(SELECT mentorTeamOrg.organization_name FROM unisolve_db.students AS student LEFT OUTER JOIN teams AS team ON student.team_id = team.team_id LEFT OUTER JOIN mentors AS mentorTeam ON team.mentor_id = mentorTeam.mentor_id LEFT OUTER JOIN organizations AS mentorTeamOrg ON mentorTeam.organization_code = mentorTeamOrg.organization_code WHERE student.user_id = \`user\`.\`user_id\`)`), 'organization_name'
                    ],
                ],
                where: {
                    [Op.and]: [
                        { is_loggedin: 'YES' },
                        { role: 'STUDENT' },
                        // { last_login: { [Op.between]: [req.body.time, modifiedTime] } }
                    ]
                }
            })
            res.status(200).send(dispatcher(res, response, "success"))
        } catch (err) {
            next(err)
        }
    }
    protected async getUserQuizScores(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            const {user_id,role} = req.query
            const quizscores = await db.query(`SELECT user_id,quiz_id,attempts,score FROM unisolve_db.quiz_responses where user_id = ${user_id}`,{ type: QueryTypes.SELECT })
            result['scores'] = quizscores
            if(role==="MENTOR"){
                const currentProgress = await db.query(`SELECT count(*)as currentValue FROM unisolve_db.mentor_topic_progress where user_id = ${user_id}`,{ type: QueryTypes.SELECT })
                result['currentProgress'] = Object.values(currentProgress[0]).toString()
                result['totalProgress'] = baseConfig.MENTOR_COURSE
            }
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getteamCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            const {mentor_id} = req.query
            if(mentor_id){
                result = await db.query(`SELECT count(*) as teams_count FROM teams where mentor_id = ${mentor_id}`,{ type: QueryTypes.SELECT });
            }
            else{
                result = await db.query(`SELECT 
                COUNT(t.team_id) AS teams_count
            FROM
                organizations AS og
                    LEFT JOIN
                mentors AS mn ON og.organization_code = mn.organization_code
                    INNER JOIN
                teams AS t ON mn.mentor_id = t.mentor_id
                WHERE og.status='ACTIVE';`,{ type: QueryTypes.SELECT });

            }
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getstudentCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            const {mentor_id} = req.query
            if(mentor_id){
                result = await db.query(`SELECT count(*) as student_count FROM students join teams on students.team_id = teams.team_id  where mentor_id = ${mentor_id};`,{ type: QueryTypes.SELECT });
            }
            else{
                result = await db.query(`SELECT 
                COUNT(st.student_id) AS student_count
            FROM
                organizations AS og
                    LEFT JOIN
                mentors AS mn ON og.organization_code = mn.organization_code
                    INNER JOIN
                teams AS t ON mn.mentor_id = t.mentor_id
                    INNER JOIN
                students AS st ON st.team_id = t.team_id
                WHERE og.status='ACTIVE';`,{ type: QueryTypes.SELECT });

            }
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getideaCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            const {mentor_id} = req.query
            if(mentor_id){
                result = await db.query(`SELECT count(*) as idea_count FROM challenge_responses join teams on challenge_responses.team_id = teams.team_id where mentor_id = ${mentor_id} && challenge_responses.status = 'SUBMITTED';`,{ type: QueryTypes.SELECT });
            }
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getmentorpercentage(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            const {user_id} = req.query
            if(user_id){
                const currentProgress = await db.query(`SELECT count(*) as course_completed_count FROM mentor_topic_progress where user_id = ${user_id};`,{ type: QueryTypes.SELECT });
                result['currentProgress'] = Object.values(currentProgress[0]).toString()
                result['totalProgress'] = baseConfig.MENTOR_COURSE
            }
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }

    protected async getstudentCourseCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
                
            const StudentCoursesCompletedCount = await db.query(`SELECT 
            count(st.student_id) as studentCourseCMP
        FROM
            students AS st
                JOIN
            teams AS te ON st.team_id = te.team_id
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                user_id, COUNT(*)
            FROM
                user_topic_progress
            GROUP BY user_id
            HAVING COUNT(*) >= 34) AS temp ON st.user_id = temp.user_id WHERE og.status='ACTIVE';`,{ type: QueryTypes.SELECT });
            const started = await db.query(`SELECT 
            count(st.student_id) as studentCoursestartted
        FROM
            students AS st
                JOIN
            teams AS te ON st.team_id = te.team_id
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                DISTINCT user_id
            FROM
                user_topic_progress ) AS temp ON st.user_id = temp.user_id WHERE og.status='ACTIVE';`,{ type: QueryTypes.SELECT });
            result['StudentCoursesCompletedCount'] = Object.values(StudentCoursesCompletedCount[0]).toString()
            result['started'] = Object.values(started[0]).toString()
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getideasCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            
            const fullCount = await db.query(`SELECT 
            count(te.team_id) as initiated
        FROM
            teams AS te
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                team_id, status
            FROM
                challenge_responses) AS temp ON te.team_id = temp.team_id WHERE og.status='ACTIVE'`,{ type: QueryTypes.SELECT });
            const submittedCount = await db.query(`SELECT 
            count(te.team_id) as submittedCount
        FROM
            teams AS te
                JOIN
            mentors AS mn ON te.mentor_id = mn.mentor_id
                JOIN
            organizations AS og ON mn.organization_code = og.organization_code
                JOIN
            (SELECT 
                team_id, status
            FROM
                challenge_responses
            WHERE
                status = 'SUBMITTED') AS temp ON te.team_id = temp.team_id WHERE og.status='ACTIVE'`,{ type: QueryTypes.SELECT })
            result['initiated_ideas'] = Object.values(fullCount[0]).toString() 
            result['submitted_ideas'] = Object.values(submittedCount[0]).toString() 
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    
    protected async getmentorCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            const mentorCount = await db.query(`SELECT 
            COUNT(mn.mentor_id) AS totalmentor
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
            WHERE og.status='ACTIVE';`,{ type: QueryTypes.SELECT });
            const mentorMale = await db.query(`SELECT 
            COUNT(mn.mentor_id) AS mentorMale
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
            WHERE og.status='ACTIVE' && mn.gender = 'Male';`,{ type: QueryTypes.SELECT })
            result['mentorCount'] = Object.values(mentorCount[0]).toString() 
            result['mentorMale'] = Object.values(mentorMale[0]).toString()  
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getstudentCountbygender(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
            const student = await db.query(`SELECT 
            SUM(CASE
                WHEN st.gender = 'MALE' THEN 1
                ELSE 0
            END) AS male,
            SUM(CASE
                WHEN st.gender = 'FEMALE' THEN 1
                ELSE 0
            END) AS female
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
                INNER JOIN
            teams AS t ON mn.mentor_id = t.mentor_id
                INNER JOIN
            students AS st ON st.team_id = t.team_id
            WHERE og.status='ACTIVE';`,{ type: QueryTypes.SELECT });
            result['studentMale'] = Object.values(student[0])[0].toString();
            result['studentFemale'] = Object.values(student[0])[1].toString();
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getSchoolCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
           result = await db.query(`SELECT count(*) as schoolCount FROM organizations WHERE status='ACTIVE';`,{ type: QueryTypes.SELECT })
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getmentorCourseCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let result :any = {};
           result = await db.query(`select count(*) as mentorCoursesCompletedCount from (SELECT 
            district,cou
        FROM
            unisolve_db.organizations AS og
                LEFT JOIN
            (SELECT 
                organization_code, cou
            FROM
                unisolve_db.mentors AS mn
            LEFT JOIN (SELECT 
                user_id, COUNT(*) AS cou
            FROM
                unisolve_db.mentor_topic_progress
            GROUP BY user_id having count(*)>=8) AS t ON mn.user_id = t.user_id ) AS c ON c.organization_code = og.organization_code WHERE og.status='ACTIVE'
        group by organization_id having cou>=8) as final`,{ type: QueryTypes.SELECT })
            res.status(200).send(dispatcher(res,result,'done'))
        }
        catch(err){
            next(err)
        }
    }
    protected async getschoolRegCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const mentorCount = await db.query(`SELECT 
            COUNT(DISTINCT mn.organization_code) AS RegSchools
        FROM
            organizations AS og
                LEFT JOIN
            mentors AS mn ON og.organization_code = mn.organization_code
        WHERE
            og.status = 'ACTIVE';`,{ type: QueryTypes.SELECT });
            res.status(200).send(dispatcher(res,mentorCount,'done'))
        }
        catch(err){
            next(err)
        }
    }
    
};