import BaseJobs from "./base.job";
import IdeaReportService from "../services/ideaReort.service";

export default class IdeaReportJob extends BaseJobs {
    service: IdeaReportService = new IdeaReportService;
    protected init() {
        this.name = 'ideaReportJob';
        this.period = "0 0 * * *" //every night 12 am
        //this.period = '* * * * *' //every minute 
    };

    public async executeJob() {
        super.executeJob();
        //TODO: write the logic to execute to badges Job...!!
        return await this.service.executeIdeaDReport()
    }
    
}