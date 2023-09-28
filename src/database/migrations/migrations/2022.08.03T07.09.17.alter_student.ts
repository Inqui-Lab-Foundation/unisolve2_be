import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "students";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().addColumn(tableName, 'UUID', {
		type: DataTypes.STRING,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'Age', {
		type: DataTypes.INTEGER,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'Grade', {
		type: DataTypes.STRING,
		allowNull: true
	});
	await sequelize.getQueryInterface().addColumn(tableName, 'Gender', {
		type: DataTypes.ENUM(...Object.values(constents.gender_flags.list)),
		allowNull: true
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().removeColumn(tableName, 'UUID');
	await sequelize.getQueryInterface().removeColumn(tableName, 'Age');
	await sequelize.getQueryInterface().removeColumn(tableName, 'Grade');
	await sequelize.getQueryInterface().removeColumn(tableName, 'Gender');
};