import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName1 = "challenge_responses";
export const tableName2 = "challenges";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().changeColumn(tableName1,'status', {
		type: DataTypes.ENUM(...Object.values(constents.challenges_flags.list)),
		allowNull: false,
		defaultValue: constents.challenges_flags.default
	});
	await sequelize.getQueryInterface().changeColumn(tableName2,'status', {
		type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
		allowNull: false,
		defaultValue: constents.common_status_flags.default
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable(tableName1);
	await sequelize.getQueryInterface().dropTable(tableName2);
};