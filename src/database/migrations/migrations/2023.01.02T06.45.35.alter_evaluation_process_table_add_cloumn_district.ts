import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { evaluation_process } from '../../../models/evaluation_process.model';


export const tableName = evaluation_process.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, "district", {
		type: DataTypes.TEXT('long'),
		allowNull: true,
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().removeColumn(tableName, "district");
	} catch (error) {
		throw error
	}
};