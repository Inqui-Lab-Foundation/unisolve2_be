import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';

export const tableName = "quiz_questions";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, 'ar_image_ans_correct', {
		type: DataTypes.TEXT,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'ar_video_ans_correct', {
		type: DataTypes.TEXT,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'accimg_ans_correct', {
		type: DataTypes.TEXT,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'ar_image_ans_wrong', {
		type: DataTypes.TEXT,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'ar_video_ans_wrong', {
		type: DataTypes.TEXT,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'accimg_ans_wrong', {
		type: DataTypes.TEXT,
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn(tableName, 'ar_image_ans_correct');
	await sequelize.getQueryInterface().removeColumn(tableName, 'ar_video_ans_correct');
	await sequelize.getQueryInterface().removeColumn(tableName, 'accimg_ans_correct');
	await sequelize.getQueryInterface().removeColumn(tableName, 'ar_image_ans_wrong');
	await sequelize.getQueryInterface().removeColumn(tableName, 'ar_video_ans_wrong');
	await sequelize.getQueryInterface().removeColumn(tableName, 'accimg_ans_wrong');
};