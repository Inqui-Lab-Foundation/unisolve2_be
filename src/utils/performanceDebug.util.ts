export default class PerformanceDebug {
    startTime:any = new Date().getTime();
    lastStepTime = new Date().getTime();
    endTime:any = new Date().getTime();
    constructor(logMsgPrefix="",shouldStartAtInit=true){
        if(shouldStartAtInit){
            this.start(logMsgPrefix)
        }
    }
    start(logMsgPrefix=""){
        this.startTime = new Date();
        console.log(`:::::::::::::: Prformance Debug started for ${logMsgPrefix } ::::::::::::::::`)
    }

    end(logMsgPrefix="",logMsgSuffix="",){
        this.endTime = new Date();
        console.log(`::::::::::::::  ${logMsgPrefix } ::::::::::::::::`)
        console.log(":"+logMsgPrefix+": time taken from previous step : "+ (this.endTime-this.lastStepTime) +" millis :"+logMsgSuffix+" : ")
        console.log(":"+logMsgPrefix+": total time taken : "+ (this.endTime-this.startTime) +" millis :"+logMsgSuffix+" : ")
        console.log(`::::::::::::::  ${logMsgPrefix } ENDED ::::::::::::::::`)
        this.lastStepTime = this.endTime;
    }

}