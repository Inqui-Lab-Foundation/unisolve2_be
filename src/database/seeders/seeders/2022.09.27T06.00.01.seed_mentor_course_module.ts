import { Migration } from '../../migrations/umzug';
import { course } from '../../../models/course.model';
import { mentor_course } from '../../../models/mentor_course.model';
import { Op, Sequelize } from 'sequelize';

// you can put some table-specific imports/code here
export const tableNameCourses = "mentor_courses";
export const tableNameCourseTopics = "mentor_course_topics";
export const tableNameCourseVideo = "videos";
export const tableNameCourseQuiz = "quiz";
export const tableNameCourseAttachment = "mentor_attachments";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	const courseInserted : any = await sequelize.getQueryInterface().insert(new mentor_course(),tableNameCourses,{
		title: 'UNISOLVE For Teachers',
		description: `
Description 
		Welcome to the First step in your Problem Solving Journey.
		Do you want to make a difference in the world around you but are not sure how?
		The watch the story of our Problem Solvers: Adila, Aryn, Shama, and Amir.
		What inspired them to be Problem Solvers? Let us see and get inspired too!
		Congratulation on the start of your Journey.
		Do you know what makes a great team?
		Let's find out what Aryn's teacher has to say about it.
		`,
        created_by: 1,
		updated_by: 1,
	});
	
	// //mod 1
	// const cmInserted1 = await createCourseModule(sequelize,courseInserted[0].course_id,"Inspiration",
	// "Welcome to the First step in your Problem Solving Journey.\n"+
	// "Do you want to make a difference in the world around you but are not sure how?\n"+
	// "Then watch the story of our Problem Solvers: Adila, Aryn, Shama and Amir.\n"+
	// "What inspired them to be Problem Solvers? Let us see and get inspired too!")
	// console.log(courseInserted)
	await createCourseTopicAlongWithAssociations(sequelize,courseInserted[0].mentor_course_id,"VIDEO","Training","",18)
	await createCourseTopicAlongWithAssociations(sequelize,courseInserted[0].mentor_course_id,"ATTACHMENT","Handbook","/assets/defaults/default_worksheet.pdf")
	await createCourseTopicAlongWithAssociations(sequelize,courseInserted[0].mentor_course_id,"QUIZ","Quiz")
	await createCourseTopicAlongWithAssociations(sequelize, courseInserted[0].mentor_course_id, "ATTACHMENT", "INSTRUCTIONS","/assets/mentor_courses/files/Worksheet English.pdf{{}}/assets/mentor_courses/files/Resources English.pdf")
	await createCourseTopicAlongWithAssociations(sequelize,courseInserted[0].mentor_course_id,"CERTIFICATE","Certificate","/assets/mentor_courses/files/default_certificate.jpg")

};

let currentVideoCount = 0;
async function createCourseTopicAlongWithAssociations(sequelize:any,arg_course_id:number,arg_topic_type:string,arg_title:string,arg_attachments:string="/assets/defaults/default_worksheet.pdf",topic_type_id:number=-1){
	let idOfTypeInserted =null;
	const listofVideoIds = [
		"666422934",
		"666424082",
		"666424896",
		"666425860",
		"734928143",
		"666426714",
		"666427284",
		"666428367",
		"666429408",
		"666429842",
		"674787248",
		"666427316",
		"666428034",
		"666428213",
		"666428771",
		"666429226",
		"666429792",
		"666430099",
		"666430460",
		"666430658",
		"666431426",
		"666431587",
		"666436469",
		"666436880",
		"666437136",
		"666437612",
		"666437976",
		"666438269"
	]
	if(topic_type_id!=-1){
		idOfTypeInserted = topic_type_id
	}
	if(!idOfTypeInserted){
		if(arg_topic_type=='VIDEO'){
			idOfTypeInserted = await createCourseVideo(sequelize,listofVideoIds[currentVideoCount])
			currentVideoCount++;
		}else if(arg_topic_type=='WORKSHEET'){
			idOfTypeInserted = await createCourseWorksheet(sequelize,arg_title,arg_attachments)
		}else if (arg_topic_type=='QUIZ'){
			idOfTypeInserted =  await createQuiz(sequelize,4)
		}else if (arg_topic_type=='ATTACHMENT'){
			idOfTypeInserted =  await createCourseAttachment(sequelize,arg_title,arg_attachments)
		}else if (arg_topic_type=='CERTIFICATE'){
			idOfTypeInserted =  await createCourseAttachment(sequelize,arg_title,arg_attachments)
		}
	}
	
	const idOfCourseTopicInserted = await createCourseTopic(sequelize,arg_course_id,idOfTypeInserted,arg_topic_type,arg_title)
	return idOfCourseTopicInserted;
}

async function createQuiz(sequelize:any,no_of_questions:number){
	const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert('quiz',[
		{
			no_of_questions:no_of_questions,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseQzInsterted
}

async function createCourseAttachment(sequelize:any,arg_desc:string,arg_attachments:string){
	const courseAttachmentsInsterted = await sequelize.getQueryInterface().bulkInsert('mentor_attachments',[
		{
			description:arg_desc,
			attachments:arg_attachments,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseAttachmentsInsterted
}

async function createCourseWorksheet(sequelize:any,arg_title:string,arg_attachments:string){
	const courseWsInsterted = await sequelize.getQueryInterface().bulkInsert('worksheets',[
		{
			
			attachments:arg_attachments,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseWsInsterted
}

async function createCourseVideo(sequelize:any,arg_video_stream_id:string){
	const courseVideoInsterted = await sequelize.getQueryInterface().bulkInsert('videos',[
		{
			video_stream_id: arg_video_stream_id,
			video_duration: 240,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseVideoInsterted
}

async function createCourseTopic(sequelize:any,arg_course_id:number,arg_topic_type_id:number,arg_topic_type:string,arg_title:string){
	const courseTopicInsterted = await sequelize.getQueryInterface().bulkInsert(tableNameCourseTopics,[
		{
			title: arg_title,
			created_by: 1,
			updated_by: 1,
			mentor_course_id:arg_course_id,
			topic_type_id:arg_topic_type_id,
			topic_type:arg_topic_type
		}
	]);

	return courseTopicInsterted
}

async function truncateTable(sequelize:Sequelize,tableNameToTruncate:string,options:any){
	try {
		await sequelize.transaction(async (transaction) => {
		  const options = { transaction };
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", options);
		  await sequelize.query(`TRUNCATE TABLE ${tableNameToTruncate}`, options);
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", options);
		});
	  } catch (error) {
		console.log(error);
		return error;
	  }
}

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	// const arrOfQuizIds: number[] = [];
	// const course_topic_of_topic_type_quiz:any = await mentor_course_topic.findOne({
	// 	where:{
	// 	topic_type:"QUIZ",
	// 	mentor_course_id:module.mentor_course_id,
	// }})
	// for(const module of dataMentorCourseQuizModuleArray){
	// 	const course_topic_of_topic_type_quiz:any = await mentor_course_topic.findOne({
	// 		where:{
	// 		topic_type:"QUIZ",
	// 		mentor_course_id:module.mentor_course_id,
	// 	}})
	// 	// console.log("module",module);
	// 	// console.log(course_topic_of_topic_type_quiz);
	// 	if(!course_topic_of_topic_type_quiz || course_topic_of_topic_type_quiz instanceof Error){
	// 		console.log("course_topic_of_topic_type_quiz",course_topic_of_topic_type_quiz);
	// 	}else{
	// 		arrOfQuizIds.push(course_topic_of_topic_type_quiz.dataValues.topic_type_id)
	// 	}
	// }
	// console.log("arrOfQuizIds",arrOfQuizIds);
	// // 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	// //or below implementation 

	await truncateTable(sequelize,tableNameCourseTopics,{})
	await truncateTable(sequelize,tableNameCourses,{})
};