import { CronJob } from 'cron';

export default class BaseJob  {
    
    public name: string="";
    public period: any;
    public cronJob: any;

    constructor() {
        this.startInitialisation();
    };
    
    private startInitialisation(){
        this.init()
        this.initializeCronJob();
    }

    protected init(){
        
    };

    protected initializeCronJob(){
        this.cronJob = new CronJob(this.period,this.handle.bind(this))
    };
    
    public async handle() {
        console.log("/////////////////////////////////")
        console.log("starting execution JOB:"+this.name)
        console.log("---------------------------------")
        await this.executeJob();
        console.log("---------------------------------")
        console.log("stoping execution JOB:"+this.name)
        console.log("/////////////////////////////////")
    };

    public async executeJob(){
        console.log("executing:"+this.name)
    }

    public start() {
        // Start job
        if(!this.cronJob){
            return;
        }
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
    }

    public stop() {
        // Start job
        if(!this.cronJob){
            return;
        }
        if (this.cronJob.running) {
            this.cronJob.stop();
        }
    }
}