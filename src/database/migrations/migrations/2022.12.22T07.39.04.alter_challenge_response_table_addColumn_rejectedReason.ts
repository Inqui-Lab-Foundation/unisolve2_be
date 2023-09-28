import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { challenge_response } from '../../../models/challenge_response.model';

export const tableName = challenge_response.tableName;
export const ColumName1 = "rejected_reason";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, ColumName1, {
		type: DataTypes.TEXT,
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().removeColumn(tableName, ColumName1)
	} catch (error) {
		throw error
	}
};