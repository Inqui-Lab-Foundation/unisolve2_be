import BaseJobs from "./base.job";
import SchoolDReportService from "../services/schoolDReort.service";
export default class SchoolDReportJob extends BaseJobs {
    service: SchoolDReportService = new SchoolDReportService;
    protected init() {
        this.name = 'SchoolDReportJob';
        this.period = "0 0 * * *" //every night 12 am
        //this.period = '* * * * *' //every minute 
    };

    public async executeJob() {
        super.executeJob();
        //TODO: write the logic to execute to badges Job...!!
        return await this.service.executeSchoolDReport()
    }
    
}