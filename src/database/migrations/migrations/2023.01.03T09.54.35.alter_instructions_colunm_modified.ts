import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { instructions } from '../../../models/instructions.model';

export const tableName: any = instructions.tableName
export const tableStructure: any = instructions.structure
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().changeColumn(tableName, 'instructions', {
		type: DataTypes.TEXT('long'),
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().changeColumn(tableName, 'instructions', {
			type: DataTypes.STRING,
			allowNull: true
		});
	} catch (error) {
		throw error
	}
};