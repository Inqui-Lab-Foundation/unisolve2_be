import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { challenge_response } from '../../../models/challenge_response.model';

export const tableName = challenge_response.tableName;
export const columnName = 'evaluation_status';
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, columnName, {
		type: DataTypes.ENUM(...Object.values(constents.evaluation_status.list)),
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().removeColumn(tableName, columnName);
	} catch (error) {
		throw error
	}
};