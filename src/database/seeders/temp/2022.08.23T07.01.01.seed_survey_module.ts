import { Migration } from '../../migrations/umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { Op } from 'sequelize';

// you can put some table-specific imports/code here
export const tableName = "quiz_surveys";
export const tableNameSurveyQuestions = "quiz_survey_questions";
export const tableNameSurveyResponses = "quiz_survey_responses";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql
	//or below implementation
	
    const quiz_survey_id = await createSurveyQuiz(sequelize,1,5,"Pre Survey for teachers","MENTOR")
    
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MCQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MCQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MCQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MCQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")
    await createQuizQuestion(sequelize,
        quiz_survey_id,1,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam quam nulla porttitor massa id neque aliquam vestibulum morbi.",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "Pretium viverra suspendisse",
        "MRQ")

};


async function createQuizQuestion(
	sequelize:any,
	arg_quiz_survey_id:number,
	arg_question_no:number,
	arg_q_txt:string,
	arg_o_txt1:string,arg_o_txt2:string,arg_o_txt3:any,arg_o_txt4:any,
	arg_quiz_type:any = "MRQ",
	arg_question_image:any=null,
	){
        const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert(tableNameSurveyQuestions,[
            {
                quiz_survey_id:arg_quiz_survey_id,
                question_no:arg_question_no,
                question:arg_q_txt,
                option_a:arg_o_txt1,
                option_b:arg_o_txt2,
                option_c:arg_o_txt3,
                option_d:arg_o_txt4,
                type:arg_quiz_type,
                question_image:arg_question_image,
                created_by: 1,
                updated_by: 1,
            }
        ]);

        return courseQzInsterted

    }


async function createSurveyQuiz(
	sequelize:any,
    arg_id:number,
    arg_no_od_questions:number,
	arg_name:string,
    arg_role:string){
		const quizSurveyInserted = await sequelize.getQueryInterface().bulkInsert(tableName,[
			{   
                quiz_survey_id:arg_id,
				no_of_questions:arg_no_od_questions,
				name:arg_name,
				role:arg_role,
				created_by: 1,
				updated_by: 1,
			}
		]);

		return quizSurveyInserted
}

async function deleteSurveyQuiz(
	sequelize:any,
	arg_no_od_questions:number,
	arg_name:string,
    arg_role:string){
		const quizSurveyDeleted = await sequelize.getQueryInterface().bulkDelete('faq_categories',{
			[Op.and]:[
                {no_of_questions:arg_no_od_questions},
				{name:arg_name},
                {role:arg_role},
				{created_by: 1},
				{updated_by: 1},
			]
		});

		return quizSurveyDeleted

}


export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql
	//or below implementation
	await sequelize.getQueryInterface().bulkDelete(tableName,{quiz_survey_id: {[Op.in]: [1]}},{});
    await sequelize.getQueryInterface().bulkDelete(tableNameSurveyQuestions,{quiz_survey_id: {[Op.in]: [1]}},{});
    await sequelize.getQueryInterface().bulkDelete(tableNameSurveyResponses,{quiz_survey_id: {[Op.in]: [1]}},{});
    
};