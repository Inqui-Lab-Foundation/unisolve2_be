import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { evaluator } from '../../../models/evaluator.model';


export const tableName = evaluator.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn(tableName, "organization_name")
	await sequelize.getQueryInterface().removeColumn(tableName, "date_of_birth")
	await sequelize.getQueryInterface().removeColumn(tableName, "city")
	await sequelize.getQueryInterface().removeColumn(tableName, "qualification")
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().addColumn(tableName, "organization_name", {
			type: DataTypes.STRING,
			allowNull: true,
		});
		await sequelize.getQueryInterface().addColumn(tableName, "date_of_birth", {
			type: DataTypes.DATE,
			allowNull: true
		});
		await sequelize.getQueryInterface().addColumn(tableName, "city", {
			type: DataTypes.STRING
		});
		await sequelize.getQueryInterface().addColumn(tableName, "qualification", {
			type: DataTypes.STRING,
			allowNull: true
		});
	} catch (error) {
		throw error
	}
};