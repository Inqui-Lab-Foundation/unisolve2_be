import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { challenge_response } from '../../../models/challenge_response.model';

export const tableName = challenge_response.tableName;
export const columnName = 'submitted_at'
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn(tableName, "submitted_by");
	await sequelize.getQueryInterface().addColumn(tableName, columnName, {
		type: DataTypes.DATE,
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().addColumn(tableName, "submitted_by", {
			type: DataTypes.INTEGER,
			allowNull: true
		});
		await sequelize.getQueryInterface().removeColumn(tableName, columnName);
	} catch (error) {
		throw error
	}
};