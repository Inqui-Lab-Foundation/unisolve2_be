import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { challenge_response } from '../../../models/challenge_response.model';

// you can put some table-specific imports/code here

export const tableName = challenge_response.tableName;
export const ColumName1 = "evaluated_by";
export const ColumName2 = "evaluated_at";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, ColumName1, {
		type: DataTypes.INTEGER,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, ColumName2, {
		type: DataTypes.DATE,
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().removeColumn(tableName, ColumName1)
		await sequelize.getQueryInterface().removeColumn(tableName, ColumName2)
	} catch (error) {
		throw error
	}
};