import { constents } from "../../configs/constents.config";
import { translation } from "../../models/translation.model";
import { speeches_en } from "./locales/en";
import { speeches_tn } from "./locales/tn";

export default class TranslationsProviderOldNotUsed {
    
    private static translationsFromDbArr:translation[] = []
    
    private static translationsFromCodeArr:any = []

    private static defaultLocale = constents.translations_flags.default_locale
    static getDefaultLocale(){
        return this.defaultLocale
    }

    private static supportedLocales = [
        'en',
        'tn'
    ]
    static getSupportedLocales(){
        return this.supportedLocales
    }

    static async init(){
        this.translationsFromDbArr = await translation.findAll();
    }
    
    static getTranslationTo(argToLocale:string,argKey:string){
        return this.getTranslationFormTo(this.defaultLocale,argToLocale,argKey)
    }
    static getTranslationFormTo(argFromLocale:string,argToLocale:string,argKey:string){
        //sanitation checks below ...!!!!
        if(!this.supportedLocales.includes(argFromLocale)){
            argFromLocale = this.defaultLocale;
        }
        if(!this.supportedLocales.includes(argToLocale)){
            argToLocale = this.defaultLocale;
        }
        if(argToLocale==this.defaultLocale){
            return argKey
        }
        if(argFromLocale==argToLocale){
            return argKey
        }
        
        const result = this.translationsFromDbArr.filter(
                            (translation:any)=>{
                                // console.log("argFromLocale",argFromLocale);
                                // console.log("argToLocale",argToLocale);
                                // console.log("argKey",argKey);
                                if(translation.dataValues.from_locale==argFromLocale &&
                                    translation.dataValues.to_locale==argToLocale &&
                                    translation.dataValues.key==argKey){
                                        
                                        return translation
                                    }
                            }
                        )
        
        if(result.length > 0 &&  result[0]){
            return result[0].value
        }
        return argKey
    }

    static match(argFromLocale:string,argToLocale:string,argKey:string){

    }

    static getSpeechesFor(arglocale:string=this.defaultLocale){
        switch (arglocale) {
            case "en":
                return speeches_en;
            case "tn":
                return speeches_tn;
            default:
                return speeches_en;
        }
    }

}