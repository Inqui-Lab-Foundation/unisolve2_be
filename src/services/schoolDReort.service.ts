import BaseService from "./base.service";
import { QueryTypes } from "sequelize";
import db from "../utils/dbconnection.util";
export default class SchoolDReportService extends BaseService {
    /**
     * truncates the data in school_report tables and re entries
     * @returns Object 
     */
    executeSchoolDReport = async () => {
        const removeCode =`truncate school_report;`
        const insertOrgMentor =`
    INSERT INTO school_report (mentor_id,user_id,udise_code,school_name,district,category,city,hm_name,hm_contact,teacher_name,teacher_gender,teacher_contact,teacher_whatsapp_contact)
    SELECT 
        mn.mentor_id,
        mn.user_id,
        og.organization_code,
        og.organization_name,
        og.district,
        og.category,
        og.city,
        og.principal_name,
        og.principal_mobile,
        mn.full_name,
        mn.gender,
        mn.mobile,
        mn.whatapp_mobile
    FROM
        (mentors AS mn)
            LEFT JOIN
        organizations AS og ON mn.organization_code = og.organization_code
    WHERE
        og.status = 'ACTIVE';`
        const updateMentorPreSurvey = `
        
    UPDATE school_report AS d
            JOIN
        (SELECT 
            CASE
                    WHEN status = 'ACTIVE' THEN 'Completed'
                END AS 'pre_survey_status',
                user_id
        FROM
            quiz_survey_responses
        WHERE
            quiz_survey_id = 1) AS s ON d.user_id = s.user_id 
    SET 
        d.pre_survey_status = s.pre_survey_status;`
        const updateMentorPostSurvey = `
    
    UPDATE school_report AS d
            JOIN
        (SELECT 
            CASE
                    WHEN status = 'ACTIVE' THEN 'Completed'
                END AS 'post_survey_status',
                user_id
        FROM
            quiz_survey_responses
        WHERE
            quiz_survey_id = 3) AS s ON d.user_id = s.user_id 
    SET 
        d.post_survey_status = s.post_survey_status;`
        const updateMentorCourse = `
        
    UPDATE school_report AS d
            JOIN
        (SELECT 
            CASE
                    WHEN COUNT(mentor_course_topic_id) >= 8 THEN 'Completed'
                    ELSE 'In Progress'
                END AS 'course_status',
                user_id
        FROM
            mentor_topic_progress
        GROUP BY user_id) AS s ON d.user_id = s.user_id 
    SET 
        d.course_status = s.course_status;`
        const updateTeamCount = `
        
    UPDATE school_report AS d
            JOIN
        (SELECT 
            COUNT(*) AS team_count, mentor_id
        FROM
            teams
        GROUP BY mentor_id) AS s ON d.mentor_id = s.mentor_id 
    SET 
        d.team_count = s.team_count;`
        const updateStudentCount = `
        
    UPDATE school_report AS d
            JOIN
        (SELECT 
            COUNT(*) AS student_count, mentor_id
        FROM
            teams
        JOIN students ON teams.team_id = students.team_id
        GROUP BY mentor_id) AS s ON d.mentor_id = s.mentor_id 
    SET 
        d.student_count = s.student_count;`
        const updateStuPreCount = `
        
    UPDATE school_report AS d
            JOIN
        (SELECT 
            COUNT(*) AS preSur_cmp, mentor_id
        FROM
            teams
        JOIN students ON teams.team_id = students.team_id
        JOIN quiz_survey_responses ON students.user_id = quiz_survey_responses.user_id
            AND quiz_survey_id = 2
        GROUP BY mentor_id) AS s ON d.mentor_id = s.mentor_id 
    SET 
        d.preSur_cmp = s.preSur_cmp;`
        const updateStuCouCmp = `
    
    UPDATE school_report AS d
            JOIN
        (SELECT 
            COUNT(*) AS countop, mentor_id
        FROM
            (SELECT 
            mentor_id, student_id, COUNT(*), students.user_id
        FROM
            teams
        LEFT JOIN students ON teams.team_id = students.team_id
        JOIN user_topic_progress ON students.user_id = user_topic_progress.user_id
        GROUP BY student_id
        HAVING COUNT(*) >= 34) AS total
        GROUP BY mentor_id) AS s ON d.mentor_id = s.mentor_id 
    SET 
        d.countop = s.countop;`
        const updateStuCouInpro = `
        
    UPDATE school_report AS d
            JOIN
        (SELECT 
            COUNT(*) AS courseinprogess, mentor_id
        FROM
            (SELECT 
            mentor_id, student_id, COUNT(*), students.user_id
        FROM
            teams
        LEFT JOIN students ON teams.team_id = students.team_id
        JOIN user_topic_progress ON students.user_id = user_topic_progress.user_id
        GROUP BY student_id
        HAVING COUNT(*) < 34) AS total
        GROUP BY mentor_id) AS s ON d.mentor_id = s.mentor_id 
    SET 
        d.courseinprogess = s.courseinprogess;`
        const updateStuIdeaSubCount = `
    
    UPDATE school_report AS d
            JOIN
        (SELECT 
            COUNT(*) AS submittedcout, mentor_id
        FROM
            teams
        JOIN challenge_responses ON teams.team_id = challenge_responses.team_id
        WHERE
            challenge_responses.status = 'SUBMITTED'
        GROUP BY mentor_id) AS s ON d.mentor_id = s.mentor_id 
    SET 
        d.submittedcout = s.submittedcout;`
        const updateStuIdeaDraftCount =`
        
    UPDATE school_report AS d
            JOIN
        (SELECT 
            COUNT(*) AS draftcout, mentor_id
        FROM
            teams
        JOIN challenge_responses ON teams.team_id = challenge_responses.team_id
        WHERE
            challenge_responses.status = 'DRAFT'
        GROUP BY mentor_id) AS s ON d.mentor_id = s.mentor_id 
    SET 
        d.draftcout = s.draftcout;`
        try {
          await db.query(removeCode,{
            type: QueryTypes.RAW,
          });
          await db.query(insertOrgMentor,{
            type: QueryTypes.RAW,
          });
          await db.query(updateMentorPreSurvey,{
            type: QueryTypes.RAW,
          });
          await db.query(updateMentorPostSurvey,{
            type: QueryTypes.RAW,
          });
          await db.query(updateMentorCourse,{
            type: QueryTypes.RAW,
          });
          await db.query(updateTeamCount,{
            type: QueryTypes.RAW,
          });
          await db.query(updateStudentCount,{
            type: QueryTypes.RAW,
          });
          await db.query(updateStuPreCount,{
            type: QueryTypes.RAW,
          });
          await db.query(updateStuCouCmp,{
            type: QueryTypes.RAW,
          });
          await db.query(updateStuCouInpro,{
            type: QueryTypes.RAW,
          });
          await db.query(updateStuIdeaSubCount,{
            type: QueryTypes.RAW,
          });
          await db.query(updateStuIdeaDraftCount,{
            type: QueryTypes.RAW,
          });
          console.log('SQL queries executed successfully.');
        } catch (error) {
          console.error('Error executing SQL queries:', error);
        }
      };
}