import { CronJob } from "cron";
import BaseJobs from "./base.job";

export default class DefaultJob extends BaseJobs {
    
    callBackFunction:any;

    constructor(argName:string,argPeriod:any,argFn: any){
        super()
        this.setData(argName,argPeriod,argFn);
    }

    public setData(argName:string,argPeriod:any,argFn: any){
        this.name = argName;
        this.period = argPeriod;
        this.callBackFunction = argFn;
    }

    public async executeJob(){
        if(this.callBackFunction){
            this.callBackFunction()
        }
    }
}