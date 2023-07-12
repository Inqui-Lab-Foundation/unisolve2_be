import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { Op } from 'sequelize';
import {  dataCourseQuizModuleArray } from '../data/course_quiz_data';
import { sanitizeForDb } from '../../../utils/utils';
import { course_topic } from '../../../models/course_topic.model';
// you can put some table-specific imports/code here
export const tableName = "quiz_questions";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 

	///QUIZ 1
	for(const module of dataCourseQuizModuleArray){
		const course_topic_of_topic_type_quiz:any = await course_topic.findOne({
			where:{
			course_module_id:module.module_id,
			topic_type:"QUIZ",
		}})
		// console.log(module);
		// console.log(course_topic_of_topic_type_quiz);
		if(!course_topic_of_topic_type_quiz || course_topic_of_topic_type_quiz instanceof Error){
			console.log("course_topic_of_topic_type_quiz",course_topic_of_topic_type_quiz);
		}else{
			// 	//////Question  1
			module.data;
			for(const question of module.data){
			// 	// console.log(question)
				await createQuizQuestion(sequelize,
					course_topic_of_topic_type_quiz.dataValues.topic_type_id,
					Number(question.question_no),
					sanitizeForDb(question.question),
					sanitizeForDb(question.option_a!),
					sanitizeForDb(question.option_b),
					sanitizeForDb(question.option_c),
					sanitizeForDb(question.option_d),
					sanitizeForDb(question.correct_ans),
					Number(question.ar_video_ans_wrong),
					sanitizeForDb(question.level),
					sanitizeForDb(question.msg_ans_correct),
					sanitizeForDb(question.msg_ans_wrong),
					sanitizeForDb(question.type),
					sanitizeForDb(question.question_image),
					sanitizeForDb(question.ar_image_ans_correct),
					sanitizeForDb(question.ar_video_ans_correct),
					sanitizeForDb(question.accimg_ans_correct),
					sanitizeForDb(question.ar_image_ans_wrong),
					sanitizeForDb(question.ar_video_ans_wrong),
					sanitizeForDb(question.accimg_ans_wrong),
					sanitizeForDb(question.question_icon))
			}
		}
	}
};


async function createQuizQuestion(
	sequelize: any,
	arg_quiz_id: number,
	arg_question_no: number,
	arg_q_txt: string,
	arg_o_txt1: string, arg_o_txt2: string, arg_o_txt3: any, arg_o_txt4: any,
	arg_correct_ans: string,
	arg_redirect_to: number,
	arg_level: string,
	arg_msg_ans_correct: any = "keep up the good work.",
	arg_msg_ans_wrong: any = "Opps may be you need to watch video again.",
	arg_quiz_type: any = "MRQ",
	arg_question_image: any = null,
	//extra
	ar_image_ans_correct: any = null,
	ar_video_ans_correct: any = null,
	accimg_ans_correct: any = null,
	ar_image_ans_wrong: any = null,
	ar_video_ans_wrong: any = null,
	accimg_ans_wrong: any = null,
	arg_question_icon: any = null,
) {
	const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert('quiz_questions', [
		{
			quiz_id: arg_quiz_id,
			question_no: arg_question_no,
			question: arg_q_txt,
			option_a: arg_o_txt1,
			option_b: arg_o_txt2,
			option_c: arg_o_txt3,
			option_d: arg_o_txt4,
			correct_ans: arg_correct_ans,
			redirect_to: arg_redirect_to,
			level: arg_level,
			type: arg_quiz_type,
			question_image: arg_question_image,
			question_icon:arg_question_icon,
			msg_ans_correct: arg_msg_ans_correct,
			msg_ans_wrong: arg_msg_ans_wrong,
			ar_image_ans_correct: ar_image_ans_correct,
			ar_video_ans_correct: ar_video_ans_correct,
			accimg_ans_correct: accimg_ans_correct,
			ar_image_ans_wrong: ar_image_ans_wrong,
			ar_video_ans_wrong: ar_video_ans_wrong,
			accimg_ans_wrong: accimg_ans_wrong,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseQzInsterted

}



export const down: Migration = async ({ context: sequelize }) => {
	const arrOfQuizIds: number[] = [];

	for(const module of dataCourseQuizModuleArray){
		const course_topic_of_topic_type_quiz:any = await course_topic.findOne({
			where:{
			topic_type:"QUIZ",
			course_module_id:module.module_id,
		}})
		// console.log(course_topic_of_topic_type_quiz);
		if(!course_topic_of_topic_type_quiz || course_topic_of_topic_type_quiz instanceof Error){
			console.log("quiz_id_module_1",course_topic_of_topic_type_quiz);
		}else{
			arrOfQuizIds.push(course_topic_of_topic_type_quiz.dataValues.topic_type_id)
		}
	}
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().bulkDelete(tableName, { quiz_id: { [Op.in]: arrOfQuizIds } }, {});
};