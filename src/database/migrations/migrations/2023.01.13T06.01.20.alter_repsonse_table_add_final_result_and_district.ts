import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { challenge_response } from '../../../models/challenge_response.model';

export const tableName = challenge_response.tableName;
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, "district", {
		type: DataTypes.STRING,
		allowNull: true,
	});
	await sequelize.getQueryInterface().addColumn(tableName, "final_result", {
		type: DataTypes.ENUM(...Object.values(constents.final_result_flags.list)),
		defaultValue: constents.final_result_flags.default,
		allowNull: true,
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn(tableName, "district");
	await sequelize.getQueryInterface().removeColumn(tableName, "final_result");
};