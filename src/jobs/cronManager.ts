import { CronJob } from 'cron';
import BadgesJob from './badges.jobs';
import BaseJob from './base.job';
import DefaultJob from './default.job';

export class CronManager {
    public jobs: any;

    private static instance: CronManager;

    private constructor() {
        this.jobs = {};
    }
    public static getInstance(): CronManager {
        if (!CronManager.instance) {
            CronManager.instance = new CronManager();
        }
        return CronManager.instance;
    }

    // private getNewCronJob(periodText: any, fn: any) {
    //     return new CronJob(periodText, fn);
    // };

    // public addNewJob(name: any, periodText: any, fn: any) {
    //     const job: any = {};
    //     job[name] = new CronJob(periodText, fn, null, true);
    //     this.jobs.push(job);
    // };

    public addNewJob(name: any, periodText: any, fn: any) {
        this.jobs[name] = new DefaultJob(name, periodText, fn);
    };

    public addJob(argJob: BaseJob) {
        if (!argJob) {
            throw Error("Pleae make sure that Job is initialized properly before passing it to the CronManager..");
        }
        if (!argJob.cronJob) {
            throw Error("Pleae make sure that Job is initialized properly before passing it to the CronManager..");
        }
        this.jobs[argJob.name] = argJob;
    };

    public stopJob(name: any) {
        this.jobs[name].stop();
    }
    public deleteJob(name: any) {
        delete this.jobs[name];
    }
    public stopAll() {
        for (let name in this.jobs) {
            this.jobs[name].stop()
        }
    }
    public listJobs() {
        return this.jobs;
    }
    public getJob(name: any) {
        for (let name in this.jobs) {
            const activeJob = this.jobs[name];
            if (activeJob.name === name) {
                return activeJob;
            };
        };
    };
    public startJob(name: any) {
        for (let name in this.jobs) {
            const activeJob = this.jobs[name];
            if (activeJob.name === name) {
                activeJob.cronJob.start();
            }
        }
    };
    public startAll() {
        for (let name in this.jobs) {
            console.log("starting cron job "+name)
            this.jobs[name].start()
        }
    }
    public runningJob(name: any) {
        return this.jobs[name].cronJob.running;
    }
    public jobLastDate(name: any) {
        return this.jobs[name].cronJob.lastDate();
    }
    public jobNextDates(name: any) {
        return this.jobs[name].cronJob.nextDates();
    }
}