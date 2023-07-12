import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "mentors";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, 'otp', {
		type: DataTypes.STRING,
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn(tableName,'otp');
};