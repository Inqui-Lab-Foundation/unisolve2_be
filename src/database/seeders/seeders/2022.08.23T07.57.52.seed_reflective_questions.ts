import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { Op } from 'sequelize';

// you can put some table-specific imports/code here
export const tableName = "reflective_quiz_questions";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	///Module 1
	///Video 1
	//////Question  1
	await createQuizQuestion(sequelize,
		1,1,
		`Adila says she loves how beautiful her school looks when it rains! 
		Can you tell us what do you love most about the place you live in?`,
		"",
		"",
		null,
		null,
		"",
		1,
		"HARD",
		`“Great! It is our responsibility to protect and take care of the things we love”`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"TEXT",
		)
		
	/// Video 2
	//Question 1
	await createQuizQuestion(sequelize,
		2,1,`Humans around the world use a lot of plastic unnecessarily. Think of a plastic item you use in daily life that you can avoid using unnecessarily. Tell us what it is by drawing a picture of it!
		Take a picture of your drawing and upload it by clicking the below button`,
		"",
		"",
		null,
		null,
		"",
		1,
		"HARD",
		`Excellent! We are glad you took a big step to to protect our home, the planet earth`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"DRAW")
		//Question 2
	await createQuizQuestion(sequelize,
		2,2,
		"Switching off fans, lights and other electrical appliances when not in use saves electricity. That helps in reducing global warming. Pick at least one (or more) actions from the following list of things you will now do to reduce global warming.",
		"Reuse old plastic bags",
		"Walk or Cycle to travel short distances",
		"Throw away no or less food",
		"Save power by keeping windows open  during the day.",
		"",
		1,
		"EASY",
		`Here’s me thanking you again for taking another big step`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"MCQ")
	
	////Video 3
		//////Question  1
	await createQuizQuestion(sequelize,
		3,1,`Do you recognise this? 
		It is a vegetable peeler. When first created, It is a very innovative idea that makes the job of peeling vegetables much easier
		Look in and around your house and click/draw the picture of a product you think is innovative or makes a task easier to do.`,
		"",
		"",
		null,
		null,
		"",
		2,
		"HARD",
		`There are so many innovative products we use in our daily lives`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"DRAW",
		"/images/quiz_imgs/rfq_m1_v3_q1_qimg1.png"
		)
	
		////Video 3
		//////Question  2
	await createQuizQuestion(sequelize,
		3,2,
		"How did you feel after learning about Basheera, a 12 year old girl, who solved a problem for her father.",
		"/images/quiz_imgs/rfq_m1_v3_q2_o1.png",
		"/images/quiz_imgs/rfq_m1_v3_q2_o2.png",
		"/images/quiz_imgs/rfq_m1_v3_q2_o3.png",
		null,
		"",
		2,
		"HARD",
		`There are so many innovative products we use in our daily lives`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"MRQ",
		"/images/quiz_imgs/rfq_m1_v3_q2_qimg1.png")


	
	
	////Video 4
		//////Question  1
	await createQuizQuestion(sequelize,
		4,1,`According to Adila and team people in every community should have the following things to be called developed: Good food to eat, Clean drinking water, No garbage on streets.`,
		"/images/quiz_imgs/rfq_m1_v4_q1_o1.png",
		"/images/quiz_imgs/rfq_m1_v4_q1_o2.png",
		"/images/quiz_imgs/rfq_m1_v4_q1_o3.png",
		null,
		"",
		2,
		"HARD",
		`You too can be a problem solver like just like Basheera!`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"MRQ",)

		
		//////Question  2
	await createQuizQuestion(sequelize,
		4,2,"What do you think the story of earth and the golden coins teach us about?",
		"Countries",
		"Resources",
		"Gold and Diamonds",
		null,
		"",
		3,
		"HARD",
		`Earth is the only planet that we can call our own, Let’s take care good care of it.`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"MRQ",
		"/images/quiz_imgs/rfq_m1_v4_q2_qimg1.png")

		
		//module 2
		//video 1 video_id = 5
		//question 1
	await createQuizQuestion(sequelize,
		5,1,"What is the best compliment you received from your friends or anyone you know?",
		"",
		"",
		"",
		null,
		"",
		3,
		"HARD",
		`You are always special because there is no one like you`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"TEXT",
		"/images/quiz_imgs/rfq_m2_v1_q1_qimg1.png")

	//question 2	
	await createQuizQuestion(sequelize,
		5,2,`Tell one good thing about each of your team member.`,
		"",
		"",
		null,
		null,
		"",
		3,
		"HARD",
		`You have great friends! May your Friendship always grow stronger`,
		`“Oh, you might have got confused. Why don’t you watch Video and try a similar question again ”`,
		"TEXT",
		"/images/quiz_imgs/rfq_m2_v1_q2_qimg1.png")

		//done uptill here which is question no 5 in sheet 
		///video 2
		//////Question  1
	await createQuizQuestion(sequelize,
		6,1,"Which step of the journey are you most excited about?",
		"Feel and Find",
		"Give Ideas",
		"Explore",
		"Make and Test",
		"",
		4,
		"HARD",
		`We are excited as well to see you solve problems in your communities`,
		`“Oh, you might be confused. Why don’t you watch ‘Video and try a similar question again ”`)

};

async function createQuizQuestion(
	sequelize:any,
	arg_video_id:number,
	arg_question_no:number,
	arg_q_txt:string,
	arg_o_txt1:string,arg_o_txt2:string,arg_o_txt3:any,arg_o_txt4:any,
	arg_correct_ans:string,
	arg_redirect_to:any,
	arg_level:string,
	arg_msg_ans_correct:any="keep up the good work.",
	arg_msg_ans_wrong:any="Opps may be you need to watch video again.",
	arg_quiz_type:any = "MRQ",
	arg_question_image:any=null,
	){
	const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert('reflective_quiz_questions',[
		{
			video_id:arg_video_id,
			question_no:arg_question_no,
			question:arg_q_txt,
			option_a:arg_o_txt1,
			option_b:arg_o_txt2,
			option_c:arg_o_txt3,
			option_d:arg_o_txt4,
			correct_ans:arg_correct_ans,
			redirect_to:arg_redirect_to,
			level:arg_level,
			type:arg_quiz_type,
			question_image:arg_question_image,
			msg_ans_correct:arg_msg_ans_correct,
			msg_ans_wrong:arg_msg_ans_wrong,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseQzInsterted

}

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().bulkDelete(tableName,{video_id: {[Op.in]: [1,2,3,4,5,6]}},{});
};