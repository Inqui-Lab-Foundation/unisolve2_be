import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "quiz_survey_questions";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().removeColumn(tableName, 'correct_ans');
	await sequelize.getQueryInterface().removeColumn(tableName, 'level');
	await sequelize.getQueryInterface().removeColumn(tableName, 'redirect_to');
	await sequelize.getQueryInterface().removeColumn(tableName, 'msg_ans_correct');
	await sequelize.getQueryInterface().removeColumn(tableName, 'msg_ans_wrong');

	// declare question_image: string;
    // declare correct_ans: string;
    // declare level: Enumerator;
    // declare msg_ans_correct: string;
    // declare msg_ans_wrong: string;
    // declare redirect_to: ForeignKey<number>;
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	// await sequelize.getQueryInterface().dropTable(tableName);
	throw Error("not yet implemented")
};