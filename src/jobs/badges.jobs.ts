import { CronJob } from "cron";
import BaseJobs from "./base.job";

export default class BadgesJob extends BaseJobs {


    protected init() {
        this.name = 'BadgesJob';
        this.period = "* * * * * *"
    };

    public async executeJob() {
        super.executeJob();
        //TODO: write the logic to execute to badges Job...!!
    }
}