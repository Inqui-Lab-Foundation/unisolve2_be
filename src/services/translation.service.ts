import { Model } from "sequelize";
import { constents } from "../configs/constents.config";
import TranslationsProvider from "../utils/translations/translationProvider";

/**
 * Translation service get support language using the locale key by default set to en, and translates the object with the help of translation provider 
 */
export default class TranslationService {


    private currentLocale: any = constents.translations_flags.default_locale

    constructor(argCurrentLocale: string = constents.translations_flags.default_locale, initProviderAsWell = false) {
        this.setCurrentLocale(argCurrentLocale)
        if (initProviderAsWell) {
            TranslationsProvider.init()
        }
    }

    /**
     * @returns get supported languages
     */
    getSupportedLocales() {
        return TranslationsProvider.getSupportedLocales();
    }

    /**
     * @returns current locale key
     */
    getDefaultLocale() {
        return TranslationsProvider.getDefaultLocale
    }

    /**
     * @returns current language
     */
    getCurrentLocale() {
        return this.currentLocale
    }

    /**
     * setting the current language
     * @param argLocale string
     */
    setCurrentLocale(argLocale: string) {
        this.currentLocale = argLocale;
    }

    /**
     * translate the entire object matching key in database
     * @param argObj object
     * @returns translated object
     */
    translateEntireObj(argObj: any) {
        if (!argObj) {
            return argObj
        }
        else if (typeof argObj == 'object' || Array.isArray(argObj)) {

            //make sure sequelize model is objectified first before proessing further
            if (argObj instanceof Model) {
                // sequelize doesnt have types for dataValues hence we need to bypaas dataValues type check
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                argObj = argObj.dataValues;
            }

            for (var i = 0; i < Object.keys(argObj).length; i++) {
                const key = Object.keys(argObj)[i];
                let value = argObj[key]///remember value can be 3 things, either obj or arr or others
                if (typeof value == 'object' || Array.isArray(value)) {
                    argObj[key] = this.translateEntireObj(value);
                }
                else {
                    argObj[key] = this.translateTo(this.currentLocale, value)
                }
            }
        } else {
            argObj = this.translateTo(this.currentLocale, "" + argObj)
        }

        return argObj
    }

    /**
     * Invoke translation service 
     * @param argKey string
     * @returns 
     */
    translate(argKey: string) {
        return this.translateTo(this.currentLocale, argKey)
    }

    /**
     * get translations for specific value
     * @param argToLocale String
     * @param argValue String
     * @returns translated key
     */
    translateTo(argToLocale: string, argKey: string) {
        return TranslationsProvider.getTranslationTo(argToLocale, argKey);
    }

    /**
     * setting the speeches based on the language
     */
    getSpeeches() {
        return TranslationsProvider.getSpeechesFor(this.currentLocale);
    }

    /**
     * refresh translation in the database
     */
    async refreshDataFromDb() {
        await TranslationsProvider.init()
    }

    /**
     *  returns reverse translation for each key
     * @param String
     */
    getTranslationKey(selected_option: any) {
        try {
            const selected_optionArr = selected_option.split("{{}}"); //multiple answers submitted can be represented as singlestrign separated by {{}} 
            // console.log(selected_optionArr)
            let resultArr = selected_optionArr.map((selectedOptionOne: any) => {
                return TranslationsProvider.getTranslationKeyForValue(this.getCurrentLocale(), selectedOptionOne)
            });
            const result = resultArr.join("{{}}")
            return result;
        } catch (err) {
            return selected_option
        }
    }

    /**
     * get translations data from the database refresh the rows inserted and bulk push
     * @param translateTable model name
     * @returns array 
     */
    async translationRefresh(translateTable: any) {
        return TranslationsProvider.translateRefresh(translateTable)
    }
}