import { Migration } from '../umzug';
import { Model } from 'sequelize';
import { translation } from '../../../models/translation.model';
import { mentor_course_topic } from '../../../models/mentor_course_topic.model';
import { dataMentorCourseQuizModuleArray, dataTranslationsCourseModules} from '../data/translation_data';
import { quiz_question } from '../../../models/quiz_question.model';
import sequelize from 'sequelize';
import { course_module } from '../../../models/course_module.model';

// you can put some table-specific imports/code here
export const tableName = translation.modelTableName;
export const up: Migration = async ({ context: sequelize }) => {
	// await seedMentorQuizDataInTamil(sequelize)
	await seedTranslationData(sequelize,"tn",course_module,"course_module_id",
	dataTranslationsCourseModules)
};

async function seedTranslationData(
	sequelize:any,
	toLoacle:string,
	modelToBeLoaded:any,
	id_collumn:string,
	data:any) {
	for(var i=0;i<data.length;i++){
		var whereClause:any = {};
		
		const item = data[i];
		console.log(item)
		whereClause[id_collumn]=item[id_collumn]
		const parent = await modelToBeLoaded.findOne({
			where:whereClause,
			raw:true
		})
		// console.log("parent",parent.title)

		var attrsToLoad:any = Object.keys(item);
		for(var j =0;j<attrsToLoad.length;j++){
			const attr = attrsToLoad[j]
			console.log("attr",attr," i==",j)
			console.log("parent[attr]",parent[attr])
			const key = parent[attr];
			const value = item[attr]
			if(!key){
				console.log("error "+attr+" not present on parent "+parent)
				continue;
			}
			if(!value){
				console.log("error "+attr+" not present on parent "+parent)
				continue;
			}
			if(typeof value != 'string'){
				console.log("attr "+attr+" value "+value+" not a string hence skipping translation for this key")
				continue;
			}
			await createTranslation(sequelize,toLoacle,parent[attr],item[attr])
		}
	}
	
}

async function seedMentorQuizDataInTamil(sequelize:any){
	for(const module of dataMentorCourseQuizModuleArray){
		const course_topic_of_topic_type_quiz:any = await mentor_course_topic.findOne({
			where:{
				mentor_course_id:module.mentor_course_id,
				topic_type:"QUIZ"
			}
		})
		// console.log("module",module);
		// console.log(course_topic_of_topic_type_quiz);
		if(!course_topic_of_topic_type_quiz || course_topic_of_topic_type_quiz instanceof Error){
			console.log("course_topic_of_topic_type_quiz",course_topic_of_topic_type_quiz);
		}else{
			// 	//////Question  1
			module.data;
			for(const question of module.data){
				const parentQuestion:any = await quiz_question.findOne({
					raw:true,
					where:{
						quiz_id:course_topic_of_topic_type_quiz.dataValues.topic_type_id,
						question_no:question.question_no,
						level:question.level
					}
				})
				// console.log("module",module);
				// console.log(course_topic_of_topic_type_quiz);
				if(!parentQuestion || parentQuestion instanceof Error){
					console.log("parentQuestion",parentQuestion);
					continue;
				}

				await saveTranslationsForEntireObj(sequelize,"tn",parentQuestion,question)
			}
		}
	}
}

async function saveTranslationsForEntireObj(sequelize:any,argToLocale:string,parent:any,translated:any){
	if(!parent || parent){
		return null;
	}
	if(translated instanceof Model){
		//@ts-ignore
		translated = translated.dataValues
	}
	if(parent instanceof Model){
		//@ts-ignore
		parent = parent.dataValues
	}

	if(typeof translated =='object'){
		const translatedKeys = Object.keys(translated);

		for(var i=0;i<translatedKeys.length;i++){
			const key = translatedKeys[i];
			createTranslation(sequelize, argToLocale,parent[key],translated[key])
		}

	}else{
		createTranslation(sequelize, argToLocale,parent,translated)
	}

}

async function createTranslation(
	sequelize: any,
	argToLocale: string,
	argKey: string,
	argValue: string) {
	const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert(tableName, [{
			to_locale:argToLocale,
			key:argKey,
			value:argValue,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseQzInsterted

}

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	try {
		await sequelize.transaction(async (transaction) => {
		  const options = { transaction };
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", options);
		  await sequelize.query(`TRUNCATE TABLE ${tableName}`, options);
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", options);
		});
	  } catch (error) {
		console.log(error);
	  }
};