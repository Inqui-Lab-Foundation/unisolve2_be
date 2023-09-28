import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import BaseService from "./base.service";
import db from "../utils/dbconnection.util";
export default class ReportService extends BaseService{
    /**
     * fetch Org Codes To include All Mentor Report Based On Report Status Param
     * @param tr String attribute to include organization code for mentor who registered more then once
     * @param tpre String attribute to include quiz quiz_survey_response 
     * @param tc String
     * @param tpost String
     * @param rs String
     * @param totalNoOfTopics String totalNoOfTopics 
     * @returns where clause object with with selected attributes
     */
    async fetchOrgCodeArrToIncInAllMentorReportBasedOnReportStatusParam(
        tr:any,
        tpre:any,
        tc:any,
        tpost:any,
        rs:any,
        totalNoOfTopics=9){
        try{
            let resultOrgCodeArr:any = []
            let meta:any = []
            let resultWherClause = {}
            if(!rs || rs=="ALL"){
                return resultWherClause
            }
            /**
             * @note  switch case begins....!! entire business logic is here, where rs param changes its Alliance based on the params given with highest weighage given to, tpost , then tc, then tpre and then tr and the way to fetch the params is diff for each ...!!
             */
            if(tpost){
                if(rs=="INPROGRESS" || 
                !(rs in constents.reports_all_ment_reports_rs_flags.list)){
                    return resultWherClause
                }
                
                [resultOrgCodeArr,meta] = await db.query(`
                    SELECT mentor.organization_code AS organization_code
                    FROM quiz_survey_responses AS qsr 
                    JOIN mentors AS mentor ON mentor.user_id = qsr.user_id
                    WHERE qsr.quiz_survey_id = 3;
                `)
                resultOrgCodeArr  = resultOrgCodeArr.map((orgCodeObj:any)=>orgCodeObj.organization_code)
                
            }else if(tc){
                if(!(rs in constents.reports_all_ment_reports_rs_flags.list)){
                    return resultWherClause
                }
                if(rs=="COMPLETED" ){
                   [ resultOrgCodeArr ,meta]= await db.query(`SELECT mentor.organization_code
                    FROM mentor_topic_progress as mtp
                    JOIN mentors as mentor on mentor.user_id = mtp.user_id
                    where mtp.status = "COMPLETED"
                    GROUP BY mtp.user_id
                    HAVING COUNT(mtp.user_id)>=${totalNoOfTopics};
                    `)
                }else if (rs=="INPROGRESS"){
                    [ resultOrgCodeArr ,meta] = await db.query(`SELECT mentor.organization_code
                    FROM mentor_topic_progress as mtp
                    JOIN mentors as mentor on mentor.user_id = mtp.user_id
                    where mtp.status = "COMPLETED"
                    GROUP BY mtp.user_id
                    HAVING COUNT(mtp.user_id)<${totalNoOfTopics} AND  COUNT(mtp.user_id)>0;
                    `)
                }else if(rs=="INCOMPLETE"){
                    [ resultOrgCodeArr ,meta] = await db.query(`SELECT mentor.organization_code
                    FROM mentor_topic_progress as mtp
                    JOIN mentors as mentor on mentor.user_id = mtp.user_id
                    GROUP BY mtp.user_id
                    HAVING COUNT(mtp.user_id)>0;
                    `)
                }
                resultOrgCodeArr  = resultOrgCodeArr.map((orgCodeObj:any)=>orgCodeObj.organization_code)

            }else if(tpre){
                if(rs=="INPROGRESS" || 
                !(rs in constents.reports_all_ment_reports_rs_flags.list)){
                    return resultWherClause
                }
                [resultOrgCodeArr,meta] = await db.query(`
                    SELECT mentor.organization_code AS organization_code
                    FROM quiz_survey_responses AS qsr 
                    JOIN mentors AS mentor ON mentor.user_id = qsr.user_id
                    WHERE qsr.quiz_survey_id = 1;
                `)
                resultOrgCodeArr  = resultOrgCodeArr.map((orgCodeObj:any)=>orgCodeObj.organization_code)
            }else if(tr){
                [ resultOrgCodeArr ,meta] = await db.query(`
                    SELECT o.organization_code
                    FROM organizations as o
                    JOIN mentors as m on m.organization_code = o.organization_code
                    GROUP BY m.user_id
                    HAVING COUNT(m.user_id)>0
                `)
                resultOrgCodeArr  = resultOrgCodeArr.map((orgCodeObj:any)=>orgCodeObj.organization_code)
            }else{
                return resultWherClause
            }
            if(rs == constents.reports_all_ment_reports_rs_flags.list["COMPLETED"] ||
                rs == constents.reports_all_ment_reports_rs_flags.list["INPROGRESS"]){
                resultWherClause = {
                    organization_code:{
                        [Op.in]:resultOrgCodeArr
                    }
                }
            }else if(rs == constents.quiz_survey_status_flags.list["INCOMPLETE"]){
                resultWherClause = {
                    organization_code:{
                        [Op.notIn]:resultOrgCodeArr
                    }
                }
            }
            return resultWherClause
        }catch(err){
            return err
        }
    }
}