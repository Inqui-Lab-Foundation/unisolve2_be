import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "quiz_questions";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, 'question_icon', {
		type: DataTypes.TEXT,
		allowNull: true,
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn(tableName, 'question_icon');
};