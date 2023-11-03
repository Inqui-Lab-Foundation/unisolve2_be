import BaseService from "./base.service";
import { QueryTypes } from "sequelize";
import db from "../utils/dbconnection.util";
export default class StudentDReportService extends BaseService {
    /**
     * truncates the data in dashboard map stats tables and re entries
     * @returns Object 
     */
    executeStudentDReport = async () => {
       const removeDtat = `truncate student_report;`
       const StuData = `
       INSERT INTO student_report(student_id,student_name,Age,gender,Grade,team_id,user_id)
       SELECT 
           student_id,full_name, Age, gender, Grade,team_id,user_id
       FROM
           students;`
           const teamData = ` 
       UPDATE student_report AS d
               JOIN
           (SELECT 
               team_id, team_name, mentor_id
           FROM
               teams) AS s ON d.team_id = s.team_id 
       SET 
           d.team_name = s.team_name,
           d.mentor_id = s.mentor_id;`
           const mentorData =`
       UPDATE student_report AS d
               JOIN
           (SELECT 
               mentor_id,
                   full_name,
                   gender,
                   mobile,
                   whatapp_mobile,
                   organization_code
           FROM
               mentors) AS s ON d.mentor_id = s.mentor_id 
       SET 
           d.teacher_name = s.full_name,
           d.teacher_gender = s.gender,
           d.teacher_contact = s.mobile,
           d.teacher_whatsapp_contact = s.whatapp_mobile,
           d.udise_code = s.organization_code;`
           const orgData =`
       UPDATE student_report AS d
               JOIN
           (SELECT 
               organization_code,
                   organization_name,
                   district,
                   category,
                   city,
                   status,
                   principal_name,
                   principal_mobile
           FROM
               organizations) AS s ON d.udise_code = s.organization_code 
       SET 
           d.school_name = s.organization_name,
           d.district = s.district,
           d.category = s.category,
           d.city = s.city,
           d.status = s.status,
           d.hm_name = s.principal_name,
           d.hm_contact = s.principal_mobile;`
           const usernameDtat = `   
       UPDATE student_report AS d
               JOIN
           (SELECT 
               user_id, username
           FROM
               users
           WHERE
               role = 'STUDENT') AS s ON d.user_id = s.user_id 
       SET 
           d.student_username = s.username;`
           const updatePreSurvey = `         
       UPDATE student_report AS d
               JOIN
           (SELECT 
               CASE
                       WHEN status = 'ACTIVE' THEN 'Completed'
                   END AS 'pre_survey_status',
                   user_id
           FROM
               quiz_survey_responses
           WHERE
               quiz_survey_id = 2) AS s ON d.user_id = s.user_id 
       SET 
           d.pre_survey_status = s.pre_survey_status;`
           const updatePostSurvey = `      
       UPDATE student_report AS d
               JOIN
           (SELECT 
               CASE
                       WHEN status = 'ACTIVE' THEN 'Completed'
                   END AS 'post_survey_status',
                   user_id
           FROM
               quiz_survey_responses
           WHERE
               quiz_survey_id = 4) AS s ON d.user_id = s.user_id 
       SET 
           d.post_survey_status = s.post_survey_status;`
           const ideaStatusData =`      
       UPDATE student_report AS d
               JOIN
           (SELECT 
               team_id, status
           FROM
               challenge_responses) AS s ON d.team_id = s.team_id 
       SET 
           d.idea_status = s.status;`
           const userTopicData =`     
       UPDATE student_report AS d
               JOIN
           (SELECT 
               COUNT(*) AS user_count, user_id
           FROM
               user_topic_progress
           GROUP BY user_id) AS s ON d.user_id = s.user_id 
       SET 
           d.course_status = s.user_count;
       `
        try {
          await db.query(removeDtat,{
            type: QueryTypes.RAW,
          });
          await db.query(StuData,{
            type: QueryTypes.RAW,
          });
          await db.query(teamData,{
            type: QueryTypes.RAW,
          });
          await db.query(mentorData,{
            type: QueryTypes.RAW,
          });
          await db.query(orgData,{
            type: QueryTypes.RAW,
          });
          await db.query(usernameDtat,{
            type: QueryTypes.RAW,
          });
          await db.query(updatePreSurvey,{
            type: QueryTypes.RAW,
          });
          await db.query(updatePostSurvey,{
            type: QueryTypes.RAW,
          });
          await db.query(ideaStatusData,{
            type: QueryTypes.RAW,
          });
          await db.query(userTopicData,{
            type: QueryTypes.RAW,
          });
          console.log('Student Report SQL queries executed successfully.');
        } catch (error) {
          console.error('Error executing SQL queries:', error);
        }
      };
}