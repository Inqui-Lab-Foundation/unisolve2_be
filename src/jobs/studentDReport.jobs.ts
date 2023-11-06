import BaseJobs from "./base.job";
import StudentDReportService from "../services/studentDReort.service";
export default class StudentDReportJob extends BaseJobs {
    service: StudentDReportService = new StudentDReportService;
    protected init() {
        this.name = 'StudentDReportJob';
        this.period = "0 0 * * *" //every night 12 am
        //this.period = '* * * * *' //every minute 
    };

    public async executeJob() {
        super.executeJob();
        //TODO: write the logic to execute to badges Job...!!
        return await this.service.executeStudentDReport()
    }
    
}