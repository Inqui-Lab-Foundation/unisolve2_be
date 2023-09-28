import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { Op } from 'sequelize';

// you can put some table-specific imports/code here
export const tableName = "challenge_questions";
export const up: Migration = async ({ context: sequelize }) => {
	//////Question  1
	await createChallengeQuestion(sequelize,
		1, 1,
		"Remember that your problem statement should have the current State, cause and effect of the problem and a desired state(goal) clearly mentioned",
		"Write down your problem statement ? Remember that your problem statement should have the current State, cause and effect of the problem and a desired state (goal) clearly mentioned",
		'null', 'null', null, null,
		"Problem Solver",
		'TEXT'
	)
	//Question 2
	await createChallengeQuestion(sequelize,
		1, 2,
		"Give as much detail as possible and explain your solution clearly",
		"Describe your solution to the problem you identified in your own words. Give as much detail as possible and explain your solution clearly",
		'null', 'null', null, null,
		"Optimistic",
		'TEXT'
	)
	await createChallengeQuestion(sequelize,
		1, 3,
		'You can refer to the SDGs sheet from FIND Module and pick the right option',
		"Which Sustainable development Goal (SDG) are you targeting with your solution ? (You can refer to the SDGs sheet from FIND Module and pick the right option  )",
		'null', 'null', null, null,
		"SDG 2: End Hunger",
		'TEXT'
	)
	await createChallengeQuestion(sequelize,
		1, 4,
		"something",
		"If you picked the option ‘others’ in the above question, write down which SDG or theme is your solution targeting",
		'null', 'null', null, null,
		"dream",
		'TEXT'
	)
	await createChallengeQuestion(sequelize,
		1, 5,
		"You can choose multiple options",
		"Which of the following problem finding techniques did your team used to FIND a problem",
		"Observation (I SEE - I WISH)", "Interview", "Experience", "Research",
		"Experience",
		'MCQ'
	)
	//Question 6
	await createChallengeQuestion(sequelize,
		1, 6,
		"You can choose multiple options",
		"Which of the following Activities/ techniques did your team use to EXPLORE  the problem deeper?",
		"Problem Tree", "Why’s technique", "Mind-Map", "Stakeholder Map",
		"Stakeholder Map",
		'MCQ'
	)
	await createChallengeQuestion(sequelize,
		1, 7,
		"You can choose multiple options",
		"Which of the following IDEATION TECHNIQUES did your team make use of to come-up with a solution? ",
		"First-Idea Crazy Idea", "Open Brainstorming", "What-If Technique", "Role-Storming",
		"Role-Storming",	
		'MCQ'
	)
	await createChallengeQuestion(sequelize,
		1, 8,
		"You can choose multiple options",
		"Pick the actions your team has engaged in after selecting an Idea for   your solution",
		"We collected feedback from the stakeholders after Idea selection",
		"We collected feedback from the stakeholders after Prototype",
		"We made changes to our idea after collecting feedback",
		"We made changes to our prototype after collecting feedback",
		"We collected feedback from the stakeholders after Prototype",
		'MCQ'
	)
	await createChallengeQuestion(sequelize,
		1, 9,
		"null",
		"Mention at least one feedback that your team found to be most     helpful in creating the final solution to your problem.",
		'null', 'null', null, null,
		"the stakeholders after Prototype",
		'TEXT'
	)
	await createChallengeQuestion(sequelize,
		1, 10,
		"You can choose multiple options",
		"Which Prototyping Method did you choose to test your solution?",
		"Physical Prototype",
		"Mock-Up prototype",
		"Storyboard",
		"Paper Prototype",
		"Physical Prototype",
		'MCQ'
	)
	await createChallengeQuestion(sequelize,
		1, 11,
		"You can choose multiple options",
		"Which Prototyping Method did you choose to test your solution?",
		"Physical Prototype",
		"Mock-Up prototype",
		"Storyboard",
		"Paper Prototype",
		"Physical Prototype",
		'MCQ'
	)
};

async function createChallengeQuestion(
	sequelize: any,
	arg_quiz_id: number,
	arg_question_no: number,
	description: string,
	arg_q_txt: string,
	arg_o_txt1: any,
	arg_o_txt2: any,
	arg_o_txt3: any,
	arg_o_txt4: any,
	arg_correct_ans: string,
	arg_quiz_type: any = "MRQ",
) {
	const challengeInserted = await sequelize.getQueryInterface().bulkInsert('challenge_questions', [
		{
			challenge_id: arg_quiz_id,
			question_no: arg_question_no,
			question: arg_q_txt,
			description: description,
			option_a: arg_o_txt1,
			option_b: arg_o_txt2,
			option_c: arg_o_txt3,
			option_d: arg_o_txt4,
			correct_ans: arg_correct_ans,
			type: arg_quiz_type,
			created_by: 1,
			updated_by: 1,
		}
	]);
	return challengeInserted

}

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().bulkDelete(tableName, { quiz_id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] } }, {});
};