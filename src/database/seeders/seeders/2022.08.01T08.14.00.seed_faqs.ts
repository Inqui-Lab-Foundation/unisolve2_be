import { Migration } from '../../migrations/umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { Op } from 'sequelize';

// you can put some table-specific imports/code here
export const tableName = "name_of_your_table";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	const faqCatAll = await createFaqCategory(sequelize,"All")
	await createFaq(sequelize,faqCatAll,"Who can register for this program?","All colleges and university students can participate in this program.");
	await createFaq(sequelize,faqCatAll,"How much is the registration fee for this program?","There is no registration fee. Anyone who wants to create a social impact with their innovative mindset and problem-solving skills can register for free.");
	await createFaq(sequelize,faqCatAll,"What is the duration of this challenge?","The duration of this challenge is 3 months (From registration to pitch day)");
	await createFaq(sequelize,faqCatAll,"Is individual participation allowed?","No, you have to register in teams of 2 to 4. This program also requires teamwork during brainstorming and ideation at later stages.");
	await createFaq(sequelize,faqCatAll,"How will the teammates log in?","The teammates will log in using their registered email ID and team password that is updated using the registration. Later, the team will have an option to change passwords individually.");
	await createFaq(sequelize,faqCatAll,"How to select the problem statement","From the shelf of problem statements the team can select one theme and one problem statement related to that.");


};

async function createFaqCategory(
	sequelize:any,
	arg_name:string){
		const faqCatInsterted = await sequelize.getQueryInterface().bulkInsert('faq_categories',[
			{
				category_name:arg_name,
				created_by: 1,
				updated_by: 1,
			}
		]);
	
		return faqCatInsterted

}
async function deleteFaqCategory(
	sequelize:any,
	arg_name:string){
		const faqCatDeleted = await sequelize.getQueryInterface().bulkDelete('faq_categories',{
			[Op.and]:[
				{category_name:arg_name},
				{created_by: 1},
				{updated_by: 1},
			]
		});

		return faqCatDeleted

}

async function createFaq(
	sequelize:any,
	arg_faq_category_id:number,
	arg_question:string,
	arg_answer:string){
	const faqInsterted = await sequelize.getQueryInterface().bulkInsert('faqs',[
		{
			faq_category_id:arg_faq_category_id,
			question:arg_question,
			answer:arg_answer,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return faqInsterted

}

async function deleteFaq(
	sequelize:any,
	arg_faq_category_id:number,
	arg_question:number,
	arg_answer:string,){
	const faqInsterted = await sequelize.getQueryInterface().bulkDelete('faqs',{
			[Op.and]:[
				{faq_category_id:arg_faq_category_id},
				{question:arg_question},
				{option_a:arg_answer},
				{created_by: 1},
				{updated_by: 1},
			]
		});

	return faqInsterted

}

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	// await sequelize.getQueryInterface().dropTable(tableName);
};