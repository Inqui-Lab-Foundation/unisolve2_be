import { challenge_response } from "../models/challenge_response.model";
import { dashboard_map_stat } from "../models/dashboard_map_stat.model";
import { mentor } from "../models/mentor.model";
import { organization } from "../models/organization.model";
import { student } from "../models/student.model";
import { team } from "../models/team.model";
import BaseService from "./base.service";

export default class DashboardService extends BaseService {
    /**
     * truncates the data in dashboard map stats tables and re entries
     * @returns Object 
     */
    async resetMapStats() {
        try {
            let uniqueDistricts: any;
            let bulkCreateArray: any = [];
            uniqueDistricts = await this.crudService.findAll(organization, { group: ["district"] });
            if (!uniqueDistricts || uniqueDistricts.length <= 0) {
                console.log("uniqueDistricts", uniqueDistricts)
                return
            }
            if (uniqueDistricts instanceof Error) {
                console.log("uniqueDistricts", uniqueDistricts)
                return
            }
            for (const district of uniqueDistricts) {
                try {
                    if (district.district === null) {
                        continue
                    }
                    const stats: any = await this.getMapStatsForDistrict(district.dataValues.district)

                    bulkCreateArray.push({
                        overall_schools: stats.schoolIdsInDistrict.length,
                        reg_schools: stats.registeredSchoolIdsInDistrict.length,
                        teams: stats.teamIdInDistrict.length,
                        ideas: stats.challengeInDistrict.length,
                        district_name: district.district,
                        students: stats.studentsInDistric.length,
                        schools_with_teams: stats.schoolIdsInDistrictWithTeams.length
                    })
                } catch (err) {
                    console.log(err)
                }
            }

            const statsForAllDistrics: any = await this.getMapStatsForDistrict(null)

            bulkCreateArray.push({
                overall_schools: statsForAllDistrics.schoolIdsInDistrict.length,
                reg_schools: statsForAllDistrics.registeredSchoolIdsInDistrict.length,
                teams: statsForAllDistrics.teamIdInDistrict.length,
                ideas: statsForAllDistrics.challengeInDistrict.length,
                district_name: "all",
                students: statsForAllDistrics.studentsInDistric.length,
                schools_with_teams: statsForAllDistrics.schoolIdsInDistrictWithTeams.length
            })

            await this.crudService.delete(dashboard_map_stat, { where: {}, truncate: true });
            const result = await this.crudService.bulkCreate(dashboard_map_stat, bulkCreateArray);
            return result;
        } catch (err) {
            return err
        }
    }
    
    /**
     * Get map stats data with based on district
     * @param argdistric String default set to null
     * @returns object
     */
    async getMapStatsForDistrict(argdistric: any = null) {
        try {
            let whereClause = {}
            let schoolIdsInDistrict: any = [];
            let mentorIdInDistrict: any = [];
            let registeredSchoolIdsInDistrict: any = [];
            let schoolIdsInDistrictWithTeams: any = [];
            let teamIdInDistrict: any = [];
            let challengeInDistrict: any = [];
            let studentsInDistric: any = [];

            if (argdistric) {
                whereClause = {
                    district: argdistric,
                }
            }

            whereClause = {
                ...whereClause,
                status: "ACTIVE"
            }

            const overAllSchool = await this.crudService.findAll(organization, {
                where: whereClause
            });
            if (!overAllSchool || (!overAllSchool.length) || overAllSchool.length == 0) {
                return {
                    schoolIdsInDistrict: schoolIdsInDistrict,
                    registeredSchoolIdsInDistrict: registeredSchoolIdsInDistrict,
                    teamIdInDistrict: teamIdInDistrict,
                    challengeInDistrict: challengeInDistrict,
                    studentsInDistric: studentsInDistric,
                    schoolIdsInDistrictWithTeams: schoolIdsInDistrictWithTeams
                }
            }
            schoolIdsInDistrict = overAllSchool.map((Element: any) => Element.dataValues.organization_code);
            const mentorReg = await this.crudService.findAll(mentor, {
                where: {
                    organization_code: schoolIdsInDistrict,
                    status: 'ACTIVE'
                }
            });
            if (!mentorReg || (!mentorReg.length) || mentorReg.length == 0) {
                return {
                    schoolIdsInDistrict: schoolIdsInDistrict,
                    registeredSchoolIdsInDistrict: registeredSchoolIdsInDistrict,
                    teamIdInDistrict: teamIdInDistrict,
                    challengeInDistrict: challengeInDistrict,
                    studentsInDistric: studentsInDistric,
                    schoolIdsInDistrictWithTeams: schoolIdsInDistrictWithTeams
                }
            }
            mentorIdInDistrict = mentorReg.map((Element: any) => Element.dataValues.mentor_id);//changed this to  user_id from mentor_id, because teams has mentor linked with team via user_id as value in the mentor_id collumn of the teams table

            const schoolRegistered = await this.crudService.findAll(mentor, {
                where: {
                    mentor_id: mentorIdInDistrict,
                    status: 'ACTIVE'
                },
                group: ['organization_code']
            });
            if (!schoolRegistered || (!schoolRegistered.length) || schoolRegistered.length == 0) {
                registeredSchoolIdsInDistrict = []
            } else {
                registeredSchoolIdsInDistrict = schoolRegistered.map((Element: any) => Element.dataValues.organization_code);
            }


            const teamReg = await this.crudService.findAll(team, {
                where: {
                    mentor_id: mentorIdInDistrict,
                    status: 'ACTIVE'
                }
            });
            if (!teamReg || (!teamReg.length) || teamReg.length == 0) {
                return {
                    schoolIdsInDistrict: schoolIdsInDistrict,
                    registeredSchoolIdsInDistrict: registeredSchoolIdsInDistrict,
                    teamIdInDistrict: teamIdInDistrict,
                    challengeInDistrict: challengeInDistrict,
                    studentsInDistric: studentsInDistric,
                    schoolIdsInDistrictWithTeams: schoolIdsInDistrictWithTeams
                }
            }
            teamIdInDistrict = teamReg.map((Element: any) => Element.dataValues.team_id);

            //u could call below as schools with teams since one school can have only one mentor 
            const distinctMentorsWithTeams = await team.findAll({
                attributes: [
                    "mentor_id",
                ],
                where: {
                    mentor_id: mentorIdInDistrict,
                    status: 'ACTIVE'
                },
                group: ['mentor_id'],
            })
            if (!distinctMentorsWithTeams || (!distinctMentorsWithTeams.length) || distinctMentorsWithTeams.length == 0) {
                schoolIdsInDistrictWithTeams = []
            } else {
                schoolIdsInDistrictWithTeams = distinctMentorsWithTeams.map((Element: any) => Element.dataValues.mentor_id);
            }


            const challengeReg = await this.crudService.findAll(challenge_response, {
                where: {
                    team_id: teamIdInDistrict,
                    status: 'SUBMITTED'
                }
            });

            if (!challengeReg || (!challengeReg.length) || challengeReg.length == 0) {
                challengeInDistrict = []
            } else {
                challengeInDistrict = challengeReg.map((Element: any) => Element.dataValues.challenge_response_id);
            }


            const studentsResult = await student.findAll({
                attributes: [
                    "user_id",
                    "student_id"
                ],
                where: {
                    team_id: teamIdInDistrict,
                    status: 'ACTIVE'
                }
            })
            if (!studentsResult || (!studentsResult.length) || studentsResult.length == 0) {
                studentsInDistric = []
            } else {
                studentsInDistric = studentsResult.map((Element: any) => Element.dataValues.student_id);
            }
            studentsInDistric = studentsResult.map((Element: any) => Element.dataValues.student_id);

            return {
                schoolIdsInDistrict: schoolIdsInDistrict,
                registeredSchoolIdsInDistrict: registeredSchoolIdsInDistrict,
                teamIdInDistrict: teamIdInDistrict,
                challengeInDistrict: challengeInDistrict,
                studentsInDistric: studentsInDistric,
                schoolIdsInDistrictWithTeams: schoolIdsInDistrictWithTeams
            }
        } catch (err) {
            return err
        }
    }
    // Dashboard student helpers....!!
    /**
     * All course topic count
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForAllToipcsCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
             select count(t.course_topic_id) 
             from course_topics as t
             where 
             ${addWhereClauseStatusPart ? "t." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
             `
    }
    /**
     * All course topic count where topic type is VIDEO
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForAllToipcVideosCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return this.getDbLieralForAllToipcsCount(addWhereClauseStatusPart, whereClauseStatusPartLiteral) +
            `and t.topic_type = "VIDEO"`
    }
    /**
     * All course topic count where topic type is WORKSHEET
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForAllToipcWorksheetCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return this.getDbLieralForAllToipcsCount(addWhereClauseStatusPart, whereClauseStatusPartLiteral) +
            `and t.topic_type = "WORKSHEET"`
    }
    /**
     * All course topic count where topic type is QUIZ
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForAllToipcQuizCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return this.getDbLieralForAllToipcsCount(addWhereClauseStatusPart, whereClauseStatusPartLiteral) +
            `and t.topic_type = "QUIZ"`
    }
    /**
     * Get user_ids who completed Topics
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @param whereOperation String
     * @returns Object
     */
    getDbLieralCommPartToipcsCompletedCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any, whereOperation: any) {
        return `
        select utp.user_id
                from user_topic_progress as utp
                join course_topics as t on t.course_topic_id=utp.course_topic_id
                where 
                1=1
                and utp.user_id=\`student\`.\`user_id\`
                and utp.status = "COMPLETED"
                ${whereOperation}
                group by utp.user_id,utp.course_topic_id
        `
    }
    /**
     * Count completed Topics for user
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForAllToipcsCompletedCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            select count(*) from (
            ${this.getDbLieralCommPartToipcsCompletedCount(addWhereClauseStatusPart, whereClauseStatusPartLiteral, '')}
            ) as count
        `
    }
    /**
     * count for per survey status for student 
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForPreSurveyStatus(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            select count(*) from quiz_survey_responses as preSurvey where preSurvey.user_id = \`student\`.\`user_id\` and preSurvey.quiz_survey_id = 2 is true
        `
    }
    /**
     * count for post survey status for student 
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForPostSurveyStatus(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            select count(*) from quiz_survey_responses as preSurvey where preSurvey.user_id = \`student\`.\`user_id\` and preSurvey.quiz_survey_id = 4 is true
        `
    }
    /**
     * count for idea submission for student
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralIdeaSubmission(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
        select count(*) from challenge_responses as idea where idea.team_id = \`student\`.\`team_id\` and status = "SUBMITTED"
        `
    }
    /**
     * All course topic count where topic type is VIDEO
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForVideoToipcsCompletedCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            select count(*) from (
            ${this.getDbLieralCommPartToipcsCompletedCount(addWhereClauseStatusPart, whereClauseStatusPartLiteral, 'and t.topic_type = "VIDEO"')}
            ) as count
        `
    }
    /**
     * All course topic count where topic type is WORKSHEET
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForWorksheetToipcsCompletedCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            select count(*) from (
            ${this.getDbLieralCommPartToipcsCompletedCount(addWhereClauseStatusPart, whereClauseStatusPartLiteral, ' and t.topic_type = "WORKSHEET"')}
            ) as count
        `
    }
    /**
     * All course topic count where topic type is QUIZ
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForQuizToipcsCompletedCount(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            select count(*) from (
            ${this.getDbLieralCommPartToipcsCompletedCount(addWhereClauseStatusPart, whereClauseStatusPartLiteral, 'and t.topic_type = "QUIZ"')}
            ) as count
        `
    }
    /**
     * get created_at for student user from quiz survey responses
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForPostSurveyCreatedAt(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            SELECT created_at FROM unisolve_db.quiz_survey_responses where quiz_survey_id = 4 and user_Id = \`student\`.\`user_id\`
            `
    }
    /**
     * get created_at for student user from user_topic_progress
     * @param addWhereClauseStatusPart String
     * @param whereClauseStatusPartLiteral String
     * @returns Object
     */
    getDbLieralForCourseCompletedCreatedAt(addWhereClauseStatusPart: any, whereClauseStatusPartLiteral: any) {
        return `
            select created_at from user_topic_progress as utp where 1=1 and  utp.status = "COMPLETED" and course_topic_id = 34 and utp.user_id = \`student\`.\`user_id\` 
        `
    }
}