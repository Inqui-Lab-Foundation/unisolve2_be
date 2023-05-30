import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { Op } from 'sequelize';

// you can put some table-specific imports/code here
export const tableName = "quiz_questions";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 

	///QUIZ 1

	//////Question  1
	await createQuizQuestion(sequelize,
		1, 1,
		"Finding problems around you and trying to solve them makes you a _________________________.",
		"Problem Observer",
		"Problem Maker",
		"Problem Solver",
		null,
		"Problem Solver",
		1,
		"HARD",
		`“Great! You are a problem solver too!”
		Do you want to know about a few problem solvers of your age? 
		Click here to read about them.`,
		`“Oh, you might have got confused. The correct answer is : C.
		Why don’t you watch ‘Video 2: Solver in Us’  and try a similar question again`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q1_common_qimg1.png",
		"/images/quiz_imgs/quiz_1_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		"/images/quiz_imgs/quiz_1_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 1, `Problem solving means ________________	`,
		"Finding Problems around us.",
		"Creating solutions for problems around us.",
		"Wish for solutions for problems around us.",
		null,
		"Creating solutions for problems around us.",
		1,
		"MEDIUM",
		`“Great! You are a problem solver too!”
		Do you want to know about a few problem solves of your age? 
		Click here (link to AR) to read about them.`,
		`“Oh, you might have got confused again. Don’t worry. Let me explain: 
		Solving always involves a solution. And hence, problem solving involves creating solutions to solve those problems.
		Come on! Let’s try one more time.`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q1_common_qimg1.png",
		"/images/quiz_imgs/quiz_1_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_1_ar_image_ans_correct.png",
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 1,
		"___________problems around us makes one a problem solver.",
		"Creating Solutions for",
		"Talking about",
		"Complaining about",
		null,
		"Creating Solutions for",
		1,
		"EASY",
		`“Great! You are a problem solver too!”
		Do you want to know about a few problem solvers of your age? 
		Click here to read about them.`,
		`“You got the answer wrong. But don’t worry. There’s always a next time.  The right answer is Option A.
		Click here to read about a few problem solvers who are of your age. You too can be just like them! `,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q1_common_qimg1.png",
		"/images/quiz_imgs/quiz_1_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_ans_correct_motivation.png",
		"/images/quiz_imgs/quiz_1_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	//////Question  2
	await createQuizQuestion(sequelize,
		1, 2, "Which of the following actions will reduce Global Warming? (Tick all that are true)",
		"Careful use of Natural Resources",
		"Cutting down trees",
		"Recycling of used products",
		null,
		"Careful use of Natural Resources{{}}Recycling of used products",
		2,
		"HARD",
		`“Awesome! I am sure you will take steps to reduce Global Warming. It’s One World that we have after all!

		Click here to read about 10 everyday actions you can do to reduce Global Warming.`,
		`“Oh, you might have got confused. The correct answer is: A, C. 
		Click here to know more about the actions you can do to reduce Global Warming.
		
		Let’s try another similar question once you are done reading it.`,
		"MCQ",
		"/images/quiz_imgs/quiz_1_q2_common_qimg1.png",
		"/images/quiz_imgs/quiz_2_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		"/images/quiz_imgs/quiz_2_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 2,
		"How do single use plastics cause Global Warming?",
		"They are not thrown after using them once.",
		"Resources like coal, oil and petrol are overused in making them.",
		"Single-use plastics are not the cause of global warming.",
		null,
		"Resources like coal, oil and petrol are overused in making them.",
		2,
		"MEDIUM",
		`“Awesome!
		Single use plastics are thrown after a single use . So more have to be made. This requires electricity and other resources like coal, oil and petrol which cause global warming.
		`,
		`“Oh, you might have got confused again. The correct answer is : B. 
		Don’t worry. Let me explain: 
		Single use plastics are thrown after a single use . So more have to be made. This requires electricity and other resources like coal, oil and petrol which cause global warming.
		
		Come on! Let’s try one more time.`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q2_common_qimg2.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 2, "Who is responsible for the  increase in global warming?",
		"It is happening naturally.",
		"All living beings are equally responsible.",
		"Human Beings and their irresponsible actions like overusing natural resources.",
		null,
		"Human Beings and their irresponsible actions like overusing natural resources.",
		2,
		"EASY",
		`“Awesome! I am sure you will take steps to reduce Global Warming. It’s One World that we have after all!`,
		`“You got the answer wrong. But don’t worry. There’s always a next time. 
		The right answer is Option C.
		I am sure you will able to do better.
		`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q2_common_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_motivation.png",
		null,
		null,
		"/images/quiz_imgs/quiz_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	//////Question  3
	await createQuizQuestion(sequelize,
		1, 3, "Which of the following are a result or effect  of global warming?(Tick all that are true)",
		"Increase in disasters like floods",
		"Increase in the use of plastic",
		"Rise in the earth’s temperature",
		null,
		"Increase in disasters like floods{{}}Rise in the earth’s temperature",
		3,
		"HARD",
		`“You are a sharp learner!”
		Let’s together stop Global Warming.
		
		Want to know more about the effects of Global Warming? Click here (link to AR)`,
		`“Oh, you might have got confused. 
		Why don’t you read (link to AR) to understand more about the effects of Global Warming and try a similar question again ”
		`,
		"MCQ",
		"/images/quiz_imgs/quiz_1_q3_common_qimg1.png",
		"/images/quiz_imgs/quiz_3_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		"/images/quiz_imgs/quiz_3_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)



	await createQuizQuestion(sequelize,
		1, 3, "Amir says Global Warming can lead to shortage of food. Do you agree with him?",
		"Yes",
		"No",
		null,
		null,
		"Yes",
		3,
		"MEDIUM",
		`“You are a sharp learner!”
		Let’s together stop Global Warming.
		`,
		`“You got the answer wrong. But don’t worry. There’s always a next time. 
		The right answer is Option A
		When the temperatures warm up, plants die and we will not be able to produce enough food for all.
		
		Do your best for the Next Question!
		`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q3_common_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	// await createQuizQuestion(sequelize,
	// 	1,3,"Which of the following actions will lead to rise in Global Warming?		",
	// 	"All of the above",
	// 	"Only 1 and 4",
	// 	"Only 2 and 3",
	// 	null,
	// 	"Only 1 and 4",
	// 	3,
	// 	"EASY",
	// 	``,
	// 	``,
	// 	"MRQ",
	// 	"/images/quiz_imgs/quiz_1_q3_medium_q_image.png")

	await createQuizQuestion(sequelize,
		1, 3, "Which of the following are effects of  Global Warming?",
		"Shortage of food",
		"Rise in earth’s temperature",
		"Both A & B",
		null,
		"Both A & B",
		3,
		"EASY",
		`“You are a sharp learner!”
		Let’s together stop Global Warming.
		`,
		`“The correct answer is : C.
		Let me explain: 
	   Any activity that generates excess waste will lead to overuse of natural resources and cause  global warming. Always reuse and recycle!
	   
	   All the best for the next question
	   `,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q3_common_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_motivation.png",
		null,
		null,
		"/images/quiz_imgs/quiz_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	//////Question  4
	await createQuizQuestion(sequelize,
		1, 4, "Pick all the statements that are true about Social Innovation.",
		"Social Innovation is a new idea to solve a problem faced by a group of  people.",
		"Social Innovations make the life of people better.",
		"A device that can provide clean drinking water at a very low cost is an example of Social Innovation.",
		null,
		"Social Innovation is a new idea to solve a problem faced by a group of  people.{{}}Social Innovations make the life of people better.{{}}A device that can provide clean drinking water at a very low cost is an example of Social Innovation.",
		4,
		"HARD",
		`“Excellent! You will soon be an innovator too!”

		Click here  to see some excellent examples of a few social innovations. Do give it a read.
		`,
		`“Oh, you might be confused. 
		The correct answer is: A,B,C.
		Why don’t you watch ‘Video 3: Innovation for better life’  and try a similar question again ”
		`,
		"MCQ",
		"/images/quiz_imgs/quiz_1_q4_common_qimg1.png",
		"/images/quiz_imgs/quiz_4_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 4, "When can an innovation be called a Social Innovation?",
		"If it is helping solve any problem",
		"If it can earn a lot of money",
		"If it can solve a problem that makes the life of people better.",
		null,
		"If it can solve a problem that makes the life of people better.",
		4,
		"MEDIUM",
		`“Excellent! You will soon be an innovator too!”

		Click here to see some excellent examples of a few social innovations. Do give it a read.		
		`,
		`"“Oh, you might have got confused again. Don’t worry. The correct answer is C. 
		Let me explain: 
		Any new solution can be an innovation but if that new solution helps solve a problem that many people are facing, then its a social innovation.”
		
		Come on! Let’s try one more time.
		"`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q4_common_qimg1.png",
		"/images/quiz_imgs/quiz_4_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	// await createQuizQuestion(sequelize,
	// 	1,4,"Which of the following do you think is a social innovation?",
	// 	"/images/quiz_imgs/quiz_1_q4_easy_o1.png",
	// 	"/images/quiz_imgs/quiz_1_q4_easy_o2.png",
	// 	null,
	// 	null,
	// 	"/images/quiz_imgs/quiz_1_q4_easy_o1.png",
	// 	4,
	// 	"EASY",
	// 	`“Excellent! You will soon be an innovator too!” Here (link to AR)  are some excellent examples of a few social innovations.`,
	// 	`“You got the answer wrong. But don’t worry. There’s always a next time. 
	// 	The right answer is Option A.

	// 	Here (link to AR)  are some excellent examples of a few social innovations. Do give it a read before answering the next question.
	// 	`,
	// 	"MRQ",
	// 	"/images/quiz_imgs/quiz_1_q4_common_qimg1.png")

	await createQuizQuestion(sequelize,
		1, 4, "Which of the following do you think is a social innovation?",
		"A) A bag that makes it easy for the farmers to carry important items needed while working in the field.",
		"B) A pen that can write in both red and blue colors.",
		null,
		null,
		"A) A bag that makes it easy for the farmers to carry important items needed while working in the field.",
		4,
		"EASY",
		`“Excellent! You will soon be an innovator too!”

		Click here to see some excellent examples of a few social innovations.`,
		`"“You got the answer wrong. 
		The right answer is Option A.
		
		Click here to seeare some excellent examples of a few social innovations. Do give it a read before answering the next question."`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q4_common_qimg1.png" + "{{}}" + "/images/quiz_imgs/quiz_1_q4_easy_qimg1.png",
		"/images/quiz_imgs/quiz_4_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_motivation.png",
		"/images/quiz_imgs/quiz_4_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	//////Question  5
	// await createQuizQuestion(sequelize,
	// 	1,5,"Match each of  the following SDGs in column A with an Action in column B.",
	// 	"a-2, b-1, c-3",
	// 	"a-3, b-1, c-2",
	// 	"a-1, b-2, c-3",
	// 	null,
	// 	"a-2, b-1, c-3",
	// 	5,
	// 	"HARD",
	// 	`“Good! You are an SDG Expert!

	// 	Want to learn more about such simple actions you can do. Click Here( link to AR)
	// 	`,
	// 	`“Oh, you might be confused. Don’t worry. You will do better soon.Why don’t you read (link to AR) before trying again.`,
	// 	'MRQ',
	// 	"/images/quiz_imgs/quiz_1_q5_hard_q_image.png")

	await createQuizQuestion(sequelize,
		1, 5, "Match each of  the following SDGs in column A with an Action in column B.",
		"a-2, b-1, c-3",
		"a-3, b-1, c-2",
		"a-1, b-2, c-3",
		null,
		"a-2, b-1, c-3",
		5,
		"HARD",
		`"“Good! You are an SDG Expert!
		Want to learn more about such simple actions you can do. Click Here
		"`,
		`"“Oh, you might be confused. The correct answer is : A
		Don’t worry. Why don’t you Click here and read before trying again.
		"`,
		'MRQ',
		"/images/quiz_imgs/quiz_1_q5n6_common_qimg1.png" + "{{}}" + "/images/quiz_imgs/quiz_1_q5_hard_qimg1.png",
		"/images/quiz_imgs/quiz_5_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		"/images/quiz_imgs/quiz_5_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 5, "Match each of  the following SDGs in column A with an Action in column B.",
		"a-2, b-1, c-3",
		"a-3, b-1, c-2",
		"a-1, b-3, c-2",
		null,
		"a-1, b-3, c-2",
		5,
		"MEDIUM",
		`“Good! You are an SDG Expert!`,
		`“Oh, you might have got confused again. But I am here to explain. The right answer here is Option C.
		Burning waste heats up the earth.
		Girls should be allowed to do all that boys are allowed to. That’s Gender Equality at school. 
		And sleep is essential for good health.
		Let’s try again!
		`,
		'MRQ',
		"/images/quiz_imgs/quiz_1_q5n6_common_qimg1.png" + "{{}}" + "/images/quiz_imgs/quiz_1_q5_medium_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		null, null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 5, "Match each of  the following images to SDGs they can achieve.",
		"a-2, b-3, c-1",
		"a-3, b-1, c-2",
		"a-1, b-2, c-3",
		null,
		"a-2, b-3, c-1",
		5,
		"EASY",
		`“Good! You are an SDG Expert!`,
		`That’s not the right answer. 
		The correct answer is Option A.
		
		I believe you will do great in the next question
		`,
		'MRQ',
		"/images/quiz_imgs/quiz_1_q5n6_common_qimg1.png" + "{{}}" + "/images/quiz_imgs/quiz_1_q5_easy_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_motivation.png",
		null, null,
		"/images/quiz_imgs/quiz_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	//////Question  6
	await createQuizQuestion(sequelize,
		1, 6, "Why are Sustainable Development Goals important?",
		"Achieving them makes the world a better place.",
		"They make everyone on the planet wealthy.",
		"They will help us find a better place than planet earth.",
		null,
		"Achieving them makes the world a better place.",
		6,
		"HARD",
		`"“That’s right Bravo!
			Let’s make the world a better place!”
			Click here  to understand more about SDGs
			"`,
		`"“Oh, you might be confused.The correct answer is: A. 
			We all get confused sometimes. Why don’t you watch ‘Video 4: Sustainable Development Goals’  and try a similar question again ”
			"`,
		'MRQ',
		"/images/quiz_imgs/quiz_1_q5n6_common_qimg1.png",
		"/images/quiz_imgs/quiz_6_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		"/images/quiz_imgs/quiz_6_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 6, "Sustainable Development Goals aim to solve problems faced by people and planet and help build a better world. This is important because:(Tick all that are true)",
		"We may not have another planet to live.",
		"All people have the right to live happily.",
		"We need to protect the future of our planet.",
		null,
		"We may not have another planet to live.{{}}All people have the right to live happily.{{}}We need to protect the future of our planet.",
		6,
		"MEDIUM",
		`“That’s right Bravo!
			Let’s make the world a better place!”
			Click here  to understand more about SDGs"`,
		`“You got the answer wrong. The correct answer is: A, B and C”
			Click here to understand more about SDGs
			
			 Let’s try another question that’s similar.
			"`,
		'MCQ',
		"/images/quiz_imgs/quiz_1_q5n6_common_qimg1.png",
		"/images/quiz_imgs/quiz_6_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		"/images/quiz_imgs/quiz_6_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 6, "Which among the following is not an SDG",
		"Stop Climate Change",
		"Quality Education",
		"Life Beyond Earth",
		null,
		"Life Beyond Earth",
		6,
		"EASY",
		`“That’s right Bravo!
			Let’s make the world a better place!”
			`,
		`That’s not the right answer. But it’s alright. Relax before you answer the next question

			The correct answer is Option C. Do check with the list of SDGs you have.
			
			All the best for the next question.
			`,
		'MRQ',
		"/images/quiz_imgs/quiz_1_q5n6_common_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_motivation.png",
		null, null,
		"/images/quiz_imgs/quiz_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)
	//////Question  7
	await createQuizQuestion(sequelize,
		1, 7, `Which of the following practices would you call as sustainable?

			1) Turning off water taps when not in use.
			2) Collect rainwater and use it for washing clothes.
			3) Close all the windows at home and switch on lights.
			4) Use the leftover papers from your old notebooks before buying new ones.
			`,
		"All except 3",
		"Both 1 and 2",
		"Both 3 and 4.",
		null,
		"All except 3",
		7,
		"HARD",
		`“Awesome! Remember to follow such sustainable practices in daily life.

			Click here to see some simple sustainable practices you can follow at home
			"`,
		`"“Oh, you might be confused. 
			The correct answer is : A”
			Before you answer the next question,  Click here to read and understand a few easy sustainable practices you can follow at home."`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q7_common_qimg1.png",
		"/images/quiz_imgs/quiz_7_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		"/images/quiz_imgs/quiz_7_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	await createQuizQuestion(sequelize,
		1, 7, `Adila says refusing to recycle used products is not a sustainable practice. Do you agree with Adila?`,
		"No because using recycling products is not safe and will make us unhealthy.",
		"Yes because recycling used products will end hunger in the world .",
		"Yes because if we don’t recycle used products we will finish the earth’s resources .",
		null,
		"Yes because if we don’t recycle used products we will finish the earth’s resources .",
		7,
		"MEDIUM",
		`“Awesome! You are a quick learner!”`,
		`“You got the answer wrong. But don’t worry. There’s always a next time. 
			The right answer is Option C.
			
			Let’s try again after you finish reading.
			"`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q7_common_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)


	await createQuizQuestion(sequelize,
		1, 7, `What does Sustainability mean in Sustainable Development Goals?`,
		"Development that is Innovative",
		"Development that doesn’t overuse resources",
		"Development that successfully lasts for a few years",
		null,
		"Development that doesn’t overuse resources",
		7,
		"EASY",
		`“Awesome! You are a quick learner!”`,
		`“The right answer is Option B”.
			Earth has fixed amount of resources. We have to use them carefully and leave enough for the future. That’s sustainability.
			`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q7_common_qimg1.png",
		null,
		null,
		"/images/quiz_imgs/quiz_motivation.png",
		null,
		null,
		"/images/quiz_imgs/quiz_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	//////Question  8

	// await createQuizQuestion(sequelize,
	// 	1,8,`People with lesser opportunities have to be given more support so that they benefit equally. 
	// 	Which among the following images indicates better support for those who face inequality?
	// 	`,
	// 	"/images/quiz_imgs/quiz_1_q8_easy_o1.png",
	// 	"/images/quiz_imgs/quiz_1_q8_easy_o1.png",
	// 	null,
	// 	null,
	// 	"/images/quiz_imgs/quiz_1_q8_easy_o1.png",
	// 	8,
	// 	"HARD",
	// 	`“Great! Now you know what reducing inequalities means”`,
	// 	`“The right answer is Option B”.
	// 	Support must be given as per needs of people. Remember!, Some need to be given more support than others to reduce inequality
	// 	`,
	// 	"MRQ",
	// 	"/images/quiz_imgs/quiz_1_q8_common_qimg1.png"+"{{}}"+"/images/quiz_imgs/quiz_1_q8_hard_qimg1.png")
	await createQuizQuestion(sequelize,
		1, 8, `People with lesser opportunities have to be given more support so that they benefit equally. 
			Which among the following images indicates better support for those who face inequality?
			`,
		"A) Picture A",
		"B) Picture B",
		null,
		null,
		"B) Picture B",
		8,
		"HARD",
		`"“Great! Now you know what reducing inequalities means” 

			Click here to learn 5 simple Actions you can do to reduce inequalities in your communities.
			"`,
		`"“The correct answer is: B”.
			Support must be given as per needs of people. Remember!, Some need to be given more support than others to reduce inequality 
			"`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q8_common_qimg1.png" + "{{}}" + "/images/quiz_imgs/quiz_1_q8_hard_qimg1.png",
		"/images/quiz_imgs/quiz_8_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_businessman.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_teacher.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)


	await createQuizQuestion(sequelize,
		1, 8, `Which of the following actions will NOT help in reducing inequalities?`,
		"A) Give more support to people who are in need / poor.",
		"B) Stop using Single use plastics",
		"C) Donate food, clothes and money to the people who don’t have enough.",
		null,
		"B) Stop using Single use plastics",
		8,
		"MEDIUM",
		`"“Great! You can start doing these actions to reduce inequalities in your community.”
			Click here to learn 5 simple Actions you can do to reduce inequalities in your communities."`,
		`"“You got the answer wrong. But don’t worry. There’s always a next time. 
			The correct answer is :B”
			Inequalities is about providing support to the people in need  in your communities.
			
			Let’s answer a similar question and try once more  
			"`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q8_medium_q_image.png",
		"/images/quiz_imgs/quiz_8_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_accimg_on-fire.png",
		null,
		null,
		"/images/quiz_imgs/quiz_accimg_question.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)


	await createQuizQuestion(sequelize,
		1, 8, `Basheera’s wheelchair is a solution to a problem faced by many differently abled people.

			Which SDG is Basheera’s solution trying to achieve? 
			`,
		"Gender Equality",
		"Reduced Inequalities",
		"Balanced Life",
		null,
		"Reduced Inequalities",
		8,
		"EASY",
		`"“Wow! You too can be a problem solver like Basheera!”

			Click here to learn 5 simple Actions you can do to reduce inequalities in your communities.
			"`,
		`"“Oh, you might be confused. Click here to learn 5 simple Actions you can do to reduce inequalities in your communities.
			Let’s try another similar question once you are done reading
			"`,
		"MRQ",
		"/images/quiz_imgs/quiz_1_q8_common_qimg1.png",
		"/images/quiz_imgs/quiz_8_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_motivation.png",
		"/images/quiz_imgs/quiz_8_ar_image_ans_correct.png",
		null,
		"/images/quiz_imgs/quiz_thumb-up.png"
		// ar_image_ans_correct: any = null,
		// ar_video_ans_correct: any = null,
		// accimg_ans_correct: any = null,
		// ar_image_ans_wrong: any = null,
		// ar_video_ans_wrong: any = null,
		// accimg_ans_wrong: any = null
	)

	///QUIZ 3 but quiz_id = 2 because 2nd module doesnt have quiz 
	//////Question  9
	await createQuizQuestion(sequelize,
		2, 9, `Shama, during one of her visits to the community, talked to people who were exercising in a park and found out that mosquitoes flying around in the morning is a huge problem they face everyday while exercising.

		Which of the following problem finding techniques do you see Adila making use of to find problems.
		`,
		"Interview",
		"Observation",
		"Experience",
		null,
		"Interview",
		9,
		"HARD",
		`Excellent! How about reading this  (link to AR): “How to conduct interviews” before you go ahead to answer the next question!`,
		``,
		"MRQ",
		null,
		null,
		null,
		null,
		null,
		null,
		null)

	await createQuizQuestion(sequelize,
		2, 9, `Match Column A to Column B`,
		"A-3, B-2, C-4, D-1",
		"A-1, B-4, C-3, D-2",
		"A-1, B-4. C-2, D-3",
		null,
		"A-3, B-2, C-4, D-1",
		9,
		"MEDIUM",
		`Excellent! How about reading this  (link to AR): “How to conduct interviews and research” before you go ahead to answer the next question!`,
		`You might have got confused. Why don’t you watch Video 3B: identifying Problems before you go ahead to answer the next question`,
		"MRQ",
		"/images/quiz_imgs/quiz_3_q9_medium_q_image.png")
	await createQuizQuestion(sequelize,
		2, 9, `Which of the following techniques will help you find problems that you are not aware of`,
		"Research",
		"Interview",
		"PEAK Criteria",
		null,
		"Research{{}}Interview",
		9,
		"EASY",
		`Excellent! How about reading this  (link to AR): “How to conduct interviews” before you go ahead to answer the next question!`,
		``,
		"MCQ",
		null,
		null,
		null,
		null,
		null,
		null,
		null)

	//////Question  10
	await createQuizQuestion(sequelize,
		2, 10, `Look at the following I SEE - I WISH Statements:
		I SEE      - I see that there is a lot of dust in the air near our home.
		I WISH - I wish all schools have a playground for children to play..
		
		What do you think is not right in the above usage of the I SEE - I WISH technique `,
		"Both I SEE and I WISH statements are not problems",
		"I SEE is true but I WISH statement is false",
		"I SEE and I WISH are talking about two different problems",
		null,
		"I SEE and I WISH are talking about two different problems",
		10,
		"HARD",
		`Great!`,
		`Opps Wrong answer try again`,
		"MRQ",
		null,
		null,
		null,
		null,
		null,
		null,
		null)

	await createQuizQuestion(sequelize,
		2, 10, `Shama, while on her way to school, observed a problem while thinking about the I SEE - I WISH technique. Look at her I SEE Statement:
		I SEE      - I see that a lot of trees have been cut to build roads
		
		What do you think is an appropriate I WISH statement for the above?`,
		"I WISH - The roads were not Built at all.",
		"I WISH - Trees had not been cut to built roads.",
		"I WISH - There are less vehicles on the road.",
		null,
		"I WISH - There are less vehicles on the road.",
		10,
		"MEDIUM",
		`Great!`,
		`Opps Wrong answer try again`,
		"MRQ",
		null,
		null,
		null,
		null,
		null,
		null,
		null)

	await createQuizQuestion(sequelize,
		2, 10, `Which of the following is true about writing an I WISH statement`,
		"The I WISH statement should help you think about the solution.",
		"The I WISH statement is used to find more information about the problem. ",
		null,
		null,
		"The I WISH statement should help you think about the solution.",
		10,
		"EASY",
		`Great!`,
		`Opps Wrong answer try again`,
		"MRQ",
		null,
		null,
		null,
		null,
		null,
		null,
		null)
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
	accimg_ans_wrong: any = null
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
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().bulkDelete(tableName, { quiz_id: { [Op.in]: [1, 2, 3, 4, 5, 6] } }, {});
};