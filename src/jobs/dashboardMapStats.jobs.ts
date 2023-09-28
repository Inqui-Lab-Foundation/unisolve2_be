import { CronJob } from "cron";
import { challenge_response } from "../models/challenge_response.model";
import { dashboard_map_stat } from "../models/dashboard_map_stat.model";
import { mentor } from "../models/mentor.model";
import { organization } from "../models/organization.model";
import { team } from "../models/team.model";
import CRUDService from "../services/crud.service";
import DashboardService from "../services/dashboard.service";
import BaseJobs from "./base.job";

export default class DashboardMapStatsJob extends BaseJobs {

    service: DashboardService = new DashboardService;
    protected init() {
        this.name = 'dashboard_map_stats';
        // this.period = "* * * * *"// every night 12 am 
        // this.period = "0 0 * * *" every night 12 am 
        this.period = "0 */6 * * *" // every 6 hours 
        // this.period = "0 * * * *" // every hour 
    };

    public async executeJob() {
        super.executeJob();
        //TODO: write the logic to execute to badges Job...!!
        return await this.service.resetMapStats()
    }
}